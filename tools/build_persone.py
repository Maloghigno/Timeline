#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_persone.py - genera src/persone.js con foto, descrizione e testo breve di
ogni personaggio di index.html, prendendoli da Wikipedia.

Uso (dalla radice del repo, serve solo Python 3.8+, nessun pacchetto da installare):

    python tools/build_persone.py            # elabora solo chi manca (riprende da dove era rimasto)
    python tools/build_persone.py --all      # rifa' tutti
    python tools/build_persone.py --only "Erwin Rommel" --only "Hirohito"

Come sceglie la pagina giusta (per non attaccare la foto di un omonimo):
  1. prova il titolo uguale al nome (o quello in WIKI_TITLES);
  2. se non esiste, e' una pagina di disambiguazione o non quadra, usa la ricerca di Wikipedia
     e controlla i primi 5 risultati;
  3. una pagina e' accettata solo se nel suo testo compare l'anno di nascita o di morte
     scritto in index.html. Se nessuna lo e', la persona NON entra in persone.js e finisce
     nel report: spesso significa che la data nel file e' sbagliata.
Prova prima it.wikipedia, poi en.wikipedia.

Scrive:
  src/persone.js          dati per la schedina (caricato da index.html con <script src>)
  tools/persone_report.md cosa e' stato risolto, cosa no, e quali titoli controllare a occhio
"""
import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

try:  # evita UnicodeEncodeError nella console di Windows (es. "Ito", "Zukov")
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
OUT_JS = ROOT / "src" / "persone.js"
REPORT = ROOT / "tools" / "persone_report.md"
CACHE = ROOT / "tools" / ".cache" / "wikipedia.json"

UA = "TimelineStorica/1.0 (https://github.com/Maloghigno/Timeline; progetto personale)"
LANGS = ["it", "en"]
SEARCH_LIMIT = 5
EXTRACT_MAX = 330
PAUSE = 0.15  # secondi fra due richieste non in cache: cortesia verso Wikipedia

# Nome in index.html -> titolo esatto della voce, solo dove il nome non basta.
# Non serve riempirlo a mano: dove il titolo e' sbagliato scatta la ricerca con controllo dell'anno.
WIKI_TITLES = {
    "Edward Teach (Barbanera)": "Barbanera",
    "Pietro I di Russia (Pietro il Grande)": "Pietro I di Russia",
    "Luigi XIV di Francia (Il Re Sole)": "Luigi XIV di Francia",
    "Maresciallo de Saxe (Maurizio di Sassonia)": "Maurizio di Sassonia",
    "Maresciallo Suvorov": "Aleksandr Vasil'evič Suvorov",
    "Imperatore Qianlong": "Qianlong",
    "Luigi II di Borbone-Condé (il Gran Condé)": "Luigi II di Borbone-Condé",
}

# Parole in piu' da cercare quando serve la ricerca (dove il nome da solo e' ambiguo).
SEARCH_HINTS = {
    "Henry Morgan": "Henry Morgan corsaro",
    "Edward Teach (Barbanera)": "Barbanera pirata",
    "Ching Shih": "Ching Shih pirata",
    "James Wolfe": "James Wolfe generale",
    "James Cook": "James Cook esploratore",
    "Thomas Edison": "Thomas Edison inventore",
}


# --------------------------------------------------------------------------- parsing di index.html
def parse_persons():
    """Legge da index.html nome e anni di nascita/morte di ogni users.insert(...)."""
    text = INDEX.read_text(encoding="utf-8")
    persons = []
    for line in text.splitlines():
        if "users.insert(" not in line:
            continue
        m_name = re.search(r"name:\s*'((?:[^'\\]|\\.)*)'", line)
        m_b = re.search(r"birthdate:\s*new Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)", line)
        m_d = re.search(r"death:\s*new Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)", line)
        if not (m_name and m_b and m_d):
            print("ATTENZIONE: riga non riconosciuta:", line.strip()[:100])
            continue
        name = m_name.group(1).replace("\\'", "'")
        persons.append({"name": name, "born": int(m_b.group(1)), "died": int(m_d.group(1))})
    return persons


# --------------------------------------------------------------------------- rete + cache
class Wiki:
    def __init__(self, base, use_cache=True):
        self.base = base
        self.cache = {}
        self.use_cache = use_cache
        if use_cache and CACHE.exists():
            try:
                self.cache = json.loads(CACHE.read_text(encoding="utf-8"))
            except Exception:
                self.cache = {}
        self.requests = 0

    def save(self):
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        CACHE.write_text(json.dumps(self.cache, ensure_ascii=False), encoding="utf-8")

    def _get(self, url):
        """GET con User-Agent, ripetizione su 429/5xx. Ritorna dict JSON oppure None se 404."""
        last = None
        for attempt in range(5):
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
            try:
                time.sleep(PAUSE)
                self.requests += 1
                with urllib.request.urlopen(req, timeout=25) as r:
                    return json.loads(r.read().decode("utf-8"))
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    return None
                last = "HTTP %d" % e.code
                if e.code in (429, 500, 502, 503, 504):
                    wait = e.headers.get("Retry-After")
                    time.sleep(float(wait) if wait and wait.isdigit() else 2 * (attempt + 1))
                    continue
                raise
            except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
                last = str(e)
                time.sleep(2 * (attempt + 1))
        raise RuntimeError("richiesta fallita dopo 5 tentativi (%s): %s" % (last, url))

    def _root(self, lang):
        return self.base.format(lang=lang)

    def summary(self, lang, title):
        key = "s|%s|%s" % (lang, title)
        if key in self.cache:
            return self.cache[key]
        url = "%s/api/rest_v1/page/summary/%s?redirect=true" % (
            self._root(lang), urllib.parse.quote(title.replace(" ", "_"), safe=""))
        data = self._get(url)
        self.cache[key] = data
        return data

    def search(self, lang, query):
        key = "q|%s|%s" % (lang, query)
        if key in self.cache:
            return self.cache[key]
        url = "%s/w/api.php?%s" % (self._root(lang), urllib.parse.urlencode({
            "action": "query", "list": "search", "srsearch": query,
            "srlimit": SEARCH_LIMIT, "format": "json", "utf8": 1}))
        data = self._get(url) or {}
        titles = [h["title"] for h in data.get("query", {}).get("search", [])]
        self.cache[key] = titles
        return titles


# --------------------------------------------------------------------------- scelta e pulizia del testo
def year_ok(page, born, died):
    """La pagina cita l'anno di nascita o di morte atteso?"""
    text = "%s %s" % (page.get("description", ""), page.get("extract", ""))
    return str(born) in text or str(died) in text


def usable(page):
    return bool(page) and page.get("type") == "standard" and page.get("extract")


def trim(extract, limit=EXTRACT_MAX):
    """Toglie le parentesi con le date (la schedina le mostra gia') e tiene 1-2 frasi."""
    text = re.sub(r"\s+", " ", extract).strip()
    for _ in range(3):  # parentesi non annidate con un anno dentro, solo in apertura di testo
        new = re.sub(r"^([^()]{0,80}?)\s*\([^()]*\b\d{3,4}\b[^()]*\)", r"\1", text, count=1)
        if new == text:
            break
        text = new
    sentences = re.split(r"(?<=[a-zà-ùA-Z0-9)»\"”])\.\s+(?=[A-ZÀ-Ý«\"“])", text)
    out = ""
    for s in sentences:
        cand = (out + " " + s).strip() if out else s
        cand_end = cand if cand.endswith((".", "!", "?")) else cand + "."
        if out and len(cand_end) > limit:
            break
        out = cand_end
        if len(out) >= limit * 0.6:
            break
    if len(out) > limit:
        cut = out[:limit].rsplit(" ", 1)[0].rstrip(",;:")
        out = cut + "…"
    return out


def build_record(page, lang):
    thumb = (page.get("thumbnail") or {}).get("source", "")
    url = ((page.get("content_urls") or {}).get("desktop") or {}).get("page", "")
    return {
        "title": page.get("title", ""),
        "description": page.get("description", ""),
        "extract": trim(page.get("extract", "")),
        "thumb": thumb,
        "url": url,
        "lang": lang,
    }


def resolve(wiki, person):
    """Ritorna (record, nota). record e' None se non si trova una pagina che quadra."""
    name, born, died = person["name"], person["born"], person["died"]
    plain = re.sub(r"\s*\([^)]*\)", "", name).strip()
    paren = re.search(r"\(([^)]*)\)", name)
    direct = [WIKI_TITLES[name]] if name in WIKI_TITLES else []
    direct += [t for t in (name, plain, paren.group(1) if paren else None) if t and t not in direct]
    notes = []
    for lang in LANGS:
        for title in direct:
            page = wiki.summary(lang, title)
            if usable(page) and year_ok(page, born, died):
                return build_record(page, lang), ""
            if page and page.get("type") == "disambiguation":
                notes.append("%s:%s e' una disambiguazione" % (lang, title))
            elif usable(page):
                notes.append("%s:%s scartata, anni non coincidono" % (lang, title))
        query = SEARCH_HINTS.get(name, plain)
        for title in wiki.search(lang, query):
            page = wiki.summary(lang, title)
            if usable(page) and year_ok(page, born, died):
                return build_record(page, lang), "trovata con la ricerca (%s)" % lang
            if usable(page):
                notes.append("%s:%s scartata, anni non coincidono" % (lang, title))
    return None, "; ".join(dict.fromkeys(notes)) or "nessuna pagina trovata"


# --------------------------------------------------------------------------- file di uscita
def load_existing():
    if not OUT_JS.exists():
        return {}
    raw = OUT_JS.read_text(encoding="utf-8")
    i, j = raw.find("{"), raw.rfind("}")
    if i < 0 or j < i:
        return {}
    try:
        return json.loads(raw[i:j + 1])
    except Exception:
        return {}


def write_js(data):
    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(data, ensure_ascii=False, indent=1, sort_keys=True)
    OUT_JS.write_text(
        "// Generato da tools/build_persone.py il %s - non modificare a mano, rilancia lo script.\n"
        "// Testi e immagini: Wikipedia (testo CC BY-SA, immagini con licenze proprie: vedi il link nella schedina).\n"
        "var PERSONE = %s;\n" % (date.today().isoformat(), body), encoding="utf-8")


def write_report(persons, data, failures, notes):
    lines = ["# Report persone.js", "",
             "Personaggi in index.html: %d - risolti: %d - da controllare: %d" % (
                 len(persons), len(data), len(failures)), ""]
    if failures:
        lines += ["## Non risolti (non sono in persone.js)", "",
                  "Spesso significa che nome o date in index.html non quadrano con Wikipedia.", ""]
        for name, why in failures:
            lines.append("- **%s**: %s" % (name, why))
        lines.append("")
    diff = [(n, data[n]["title"], data[n]["lang"], notes.get(n, "")) for n in sorted(data)
            if data[n]["title"].lower() != n.lower()]
    if diff:
        lines += ["## Titolo Wikipedia diverso dal nome nel file (guardali a occhio)", ""]
        for n, t, lang, note in diff:
            lines.append("- %s -> `%s` (%s)%s" % (n, t, lang, " - " + note if note else ""))
        lines.append("")
    nophoto = [n for n in sorted(data) if not data[n]["thumb"]]
    if nophoto:
        lines += ["## Senza foto su Wikipedia (la schedina mostra le iniziali)", ""]
        lines += ["- " + n for n in nophoto]
        lines.append("")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines), encoding="utf-8")


# --------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description="Genera src/persone.js da Wikipedia.")
    ap.add_argument("--all", action="store_true", help="rifa' tutti, anche quelli gia' presenti")
    ap.add_argument("--only", action="append", default=[], metavar="NOME", help="solo questo nome (ripetibile)")
    ap.add_argument("--refresh", action="store_true", help="ignora la cache delle richieste")
    ap.add_argument("--base", default="https://{lang}.wikipedia.org", help=argparse.SUPPRESS)  # per i test
    args = ap.parse_args()

    persons = parse_persons()
    names = [p["name"] for p in persons]
    if len(set(names)) != len(names):
        dup = sorted({n for n in names if names.count(n) > 1})
        sys.exit("Nomi duplicati in index.html (la chiave di persone.js deve essere unica): %s" % dup)

    data = load_existing()
    if args.only:
        unknown = [n for n in args.only if n not in names]
        if unknown:
            sys.exit("Nome non presente in index.html: %s" % unknown)
        todo = [p for p in persons if p["name"] in args.only]
    elif args.all:
        todo = persons
    else:
        todo = [p for p in persons if p["name"] not in data]

    # chi non e' piu' in index.html non deve restare in persone.js
    data = {n: v for n, v in data.items() if n in names}

    print("Personaggi: %d - da elaborare: %d" % (len(persons), len(todo)))
    wiki = Wiki(args.base, use_cache=not args.refresh)
    failures, notes = [], {}
    try:
        for i, p in enumerate(todo, 1):
            rec, note = resolve(wiki, p)
            if rec:
                data[p["name"]] = rec
                notes[p["name"]] = note
                flag = "ok " if rec["thumb"] else "ok*"
                print("[%3d/%d] %s %s -> %s (%s)" % (i, len(todo), flag, p["name"], rec["title"], rec["lang"]))
            else:
                data.pop(p["name"], None)
                failures.append((p["name"], note))
                print("[%3d/%d] NO  %s: %s" % (i, len(todo), p["name"], note))
            if i % 10 == 0:
                wiki.save()
    except KeyboardInterrupt:
        print("\nInterrotto: salvo quello fatto finora, rilancia per riprendere.")
    finally:
        wiki.save()

    # chi non ha scheda e non e' tra i fallimenti di questa esecuzione: non e' stato elaborato adesso
    failed = {n for n, _ in failures}
    for n in names:
        if n not in data and n not in failed:
            failures.append((n, "non elaborato in questa esecuzione (rilancia senza --only)"))

    write_js(data)
    write_report(persons, data, failures, notes)
    missing = [n for n in names if n not in data]
    print("\nScritto %s (%d su %d)." % (OUT_JS.relative_to(ROOT), len(data), len(persons)))
    print("Report: %s - richieste fatte: %d" % (REPORT.relative_to(ROOT), wiki.requests))
    if missing:
        print("Senza scheda: %d (vedi report)" % len(missing))


if __name__ == "__main__":
    main()
