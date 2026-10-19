# 🕰️ Timeline dei personaggi storici

**Interactive history timeline & infographic poster** · 254 historical figures, 1553–1992 · kings, generals, scientists and artists: who lived at the same time as whom.

[![Atlante dei Personaggi](asset/Atlante_dei_Personaggi.png)](asset/Atlante_dei_Personaggi.png)

*Il poster è generato con Claude: l'obiettivo è renderlo ancora più bello. Idee e proposte sono benvenute.*

👉 **[Prova la timeline online](https://maloghigno.github.io/Timeline/)**

---

## 📜 Cos'è

Una **linea del tempo interattiva** con **254 personaggi storici**, vissuti tra il 1553 e il 1992: da **Galileo** a **Churchill**, da **Napoleone** a **Picasso**, passando per l'**Illuminismo**, il **Risorgimento**, la **Grande Guerra** e la **Seconda guerra mondiale**.

Serve a rispondere alla domanda che i libri di storia, divisi per capitoli, non fanno mai: *chi era vivo nello stesso momento di chi?* Spoiler: spesso erano tutti vivi insieme e si conoscevano pure, il che spiega parecchio.

Passa il mouse su una barra e compare la **schedina** 🃏: foto (da Wikipedia), nome, date e una frase scritta a mano, cattiva il giusto.

> *Arciduca Carlo d'Austria (05/09/1771 – 30/04/1847): l'avversario di Napoleone che teorizzava la guerra mentre Clausewitz la rimuginava.*

## 🗺️ Il poster: *Atlante dei Personaggi*

Un'**infografica** in stile vecchio libro di storia: gli stessi 254 nomi, raggruppati non per categoria ma per **guerre, corti, rivoluzioni e correnti artistiche e scientifiche**. Chi sta tra due "isole" appartiene a entrambe: si conobbero, si combatterono o si lessero.

Clicca sull'immagine in cima per la versione ad alta risoluzione (A3, 300 dpi).

## 🎲 Piccole coincidenze

- **Charlie Chaplin** (16/04/1889) e **Adolf Hitler** (20/04/1889) sono nati a quattro giorni di distanza. Uno ha fatto ridere il mondo, l'altro no.
- **Charles Darwin** e **Abraham Lincoln** sono nati lo stesso giorno: 12/02/1809.
- **Galileo** muore nel gennaio 1642 e **Newton** nasce nel gennaio 1643 (con il calendario gregoriano; con quello inglese del tempo, a Natale 1642): il passaggio di testimone più comodo della scienza.
- **Mozart** e **Robespierre** sono coetanei (1756 e 1758) e muoiono giovani a tre anni di distanza: uno a 35 anni di malattia, l'altro a 36 sotto la ghigliottina.

## 👥 Chi c'è dentro

| Categoria | Chi | Personaggi |
|---|---|---|
| 👑 Main | re, regine, politici, dittatori | 67 |
| ⚔️ Military | generali, ammiragli, un paio di pirati | 67 |
| 🔭 Scientist | scienziati, filosofi, esploratori | 61 |
| 🎨 Artist | pittori, musicisti, scrittori, attori | 59 |

## 🚀 Come si usa

**Online:** [maloghigno.github.io/Timeline](https://maloghigno.github.io/Timeline/).

**In locale:** niente build, niente `npm install`, niente drammi. Scarica il repo e apri `index.html` nel browser. Serve la rete, perché il grafico usa Google Charts e le foto arrivano da Wikipedia.

## 🛠️ Come è fatto

HTML e JavaScript puri, senza framework.

- **`index.html`**: tutto il codice e l'elenco dei personaggi (`users.insert(...)`), con [LokiJS](https://github.com/techfort/LokiJS) come mini-database e [Google Charts Timeline](https://developers.google.com/chart/interactive/docs/gallery/timeline) per il disegno.
- **`src/descrizioni.js`**: le frasi delle schedine, una per personaggio.
- **`asset/`**: il poster.

## ➕ Aggiungere un personaggio

1. Una riga `users.insert({...})` in `index.html`. ⚠️ **I mesi di JavaScript partono da 0**: gennaio è `0`, dicembre è `11`. Il bug è già successo una volta.
2. Se la data esatta non si conosce, `birth_year_only: true` e/o `death_year_only: true`.
3. Una frase in `src/descrizioni.js`, con lo stesso identico nome.

Se una foto non compare, di solito il titolo Wikipedia non corrisponde al nome: basta aggiungerlo a `WIKI_TITOLI` in `index.html`. Nel dubbio, restano le iniziali.

## 💬 Contribuire

Manca il tuo personaggio preferito? Hai trovato una data sbagliata? Hai un'idea per rendere il poster più bello? **[Apri una issue](https://github.com/Maloghigno/Timeline/issues)**.

Le **frasi sono opinioni**, non fonti. Le date sono controllate dove c'era un dubbio, ma un errore può sempre sfuggire.

## 🙏 Crediti

- Foto dei personaggi: [Wikipedia](https://it.wikipedia.org), caricate dal browser al momento.
- Grafico: [Google Charts](https://developers.google.com/chart). Mini-database: [LokiJS](https://github.com/techfort/LokiJS).
- Frasi, raggruppamenti del poster e scelta dei personaggi: opinioni dell'autore, da prendere come tali.

## 📄 Licenza

[MIT](LICENSE) © 2026 Federico ([Maloghigno](https://github.com/Maloghigno)). Puoi riusare, modificare e ridistribuire liberamente, purché resti la nota di copyright con l'attribuzione all'autore.

---

<sub>🔎 *Parole chiave: storia, linea del tempo, timeline storica, infografica, personaggi storici, storia moderna, storia contemporanea, Rinascimento, Barocco, Illuminismo, Rivoluzione francese, Napoleone, Risorgimento, Prima guerra mondiale, Seconda guerra mondiale, storia della scienza, storia dell'arte · history timeline, historical figures, infographic, data visualization, world history.*</sub>
