// Calcolo delle righe per la timeline v2 (v2.html). Nessun disegno qui: si calcola prima, si disegna dopo.
//
// Idea: ogni gruppo e' un blocco rettangolare (tempo x righe). I blocchi di gruppi che non si sovrappongono
// nel tempo riusano le stesse righe; quelli che si sovrappongono si impilano, e i gruppi che condividono
// piu' persone vengono messi vicini. Chi sta in due gruppi vive nel blocco di uno e resta il piu' vicino
// possibile all'altro. L'ordine di posa e le scelte si cercano con una ricerca locale deterministica
// (stesso seme = stesso risultato).
//
// Uso (browser o Node): V2Layout.calcola(PERSONAGGI, GRUPPI, ASSEGNAZIONI, {scala: 6})
(function (root) {
  'use strict';

  var MS_PER_YEAR = 365.2425 * 24 * 3600 * 1000;
  var ADULTHOOD_DEFAULT_YEARS = 15; // stessa convenzione di index.html

  function anno(d) { return 1970 + d.getTime() / MS_PER_YEAR; }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Stima della larghezza di un'etichetta (font 11px): volutamente non misurata, cosi' il risultato
  // e' identico su ogni browser e anche in Node.
  function larghezzaTesto(s) { return s.length * 5.9 + 4; }

  // Quante righe servono al minimo, senza alcun vincolo (massimo numero di barre sovrapposte)
  function minimoTeorico(items) {
    var ev = [];
    items.forEach(function (p) { ev.push([p.a, 1]); ev.push([p.d, -1]); });
    ev.sort(function (x, y) { return x[0] - y[0] || x[1] - y[1]; });
    var cur = 0, max = 0;
    ev.forEach(function (e) { cur += e[1]; if (cur > max) max = cur; });
    return max;
  }

  function calcola(personaggi, gruppi, assegnazioni, opz) {
    opz = opz || {};
    var S = opz.scala || 6;          // pixel per anno
    var ROW = opz.riga || 21;        // altezza di una riga
    var GAP = 6;
    var TIE = opz.legame == null ? 1.5 : opz.legame; // peso della vicinanza ai gruppi condivisi
    var ITER = opz.iterazioni == null ? 1500 : opz.iterazioni;
    var rnd = mulberry32(opz.seme == null ? 20261104 : opz.seme);

    // ---- persone: barre e etichette (la barra va dall'inizio dell'eta' adulta alla morte, come nella classica) ----
    var P = personaggi.map(function (pg, i) {
      var nasc = anno(pg.birthdate);
      var a = pg.adulthood ? anno(pg.adulthood) : nasc + ADULTHOOD_DEFAULT_YEARS;
      var d = anno(pg.death);
      return { i: i, nome: pg.name, cat: pg.category, nasc: nasc, a: a, d: d,
               gruppi: (assegnazioni[pg.name] || []).slice() };
    });
    var T0 = Math.floor(Math.min.apply(null, P.map(function (p) { return p.a; })) / 25) * 25 - 5;
    var T1 = Math.ceil(Math.max.apply(null, P.map(function (p) { return p.d; })) / 25) * 25 + 5;
    P.forEach(function (p) {
      p.x0 = (p.a - T0) * S;
      p.x1 = Math.max((p.d - T0) * S, p.x0 + 8);
      var tw = larghezzaTesto(p.nome);
      p.fuori = tw + 10 > p.x1 - p.x0;            // etichetta fuori dalla barra, a destra
      p.xe = p.fuori ? p.x1 + 6 + tw : p.x1;      // estensione effettiva (barra + etichetta)
    });
    var minimo = minimoTeorico(P);

    // ---- gruppi ----
    var G = gruppi.map(function (g, k) { return { id: g.id, k: k, nome: g.nome, colore: g.colore, membri: [] }; });
    var gIdx = {}; G.forEach(function (g) { gIdx[g.id] = g.k; });
    var condivisi = [], soli = [];
    P.forEach(function (p) {
      p.gk = p.gruppi.map(function (id) { return gIdx[id]; });
      p.gk.forEach(function (k) { G[k].membri.push(p); });
      if (p.gk.length === 2) condivisi.push(p);
      if (p.gk.length === 0) soli.push(p);
    });
    var NG = G.length;
    var W = []; for (var a1 = 0; a1 < NG; a1++) { W.push(new Array(NG).fill(0)); }
    condivisi.forEach(function (p) { W[p.gk[0]][p.gk[1]]++; W[p.gk[1]][p.gk[0]]++; });
    G.forEach(function (g) {
      var m = g.membri.reduce(function (s, p) { return s + (p.a + p.d) / 2; }, 0) / (g.membri.length || 1);
      g.picco = m;
    });

    // ---- decodifica: da (ordine dei gruppi, gruppo scelto per ogni persona condivisa) ai blocchi e alle righe ----
    // Tutto vive su una griglia di righe uguali. Un blocco occupa una riga di titolo (larga quanto il titolo)
    // e tante righe quante ne servono ai suoi membri (larghe quanto i membri di quella riga): la sua sagoma e'
    // "a scalini", cosi' un gruppo puo' infilarsi negli spazi vuoti di un altro.
    function decodifica(ordine, scelta) {
      var membri = []; var k;
      for (k = 0; k < NG; k++) membri.push([]);
      P.forEach(function (p) {
        if (p.gk.length === 1) membri[p.gk[0]].push(p);
        else if (p.gk.length === 2) membri[scelta[p.i]].push(p);
      });
      var blocchi = new Array(NG);
      for (k = 0; k < NG; k++) {
        var ms = membri[k].slice().sort(function (x, y) { return x.x0 - y.x0 || x.i - y.i; });
        var righe = [], fine = [];
        ms.forEach(function (p) {
          for (var r = 0; r < fine.length; r++) {
            if (fine[r] + GAP <= p.x0) { fine[r] = p.xe; righe[r].push(p); return; }
          }
          fine.push(p.xe); righe.push([p]);
        });
        // sagoma: [x0,x1] per ogni riga (la 0 e' il titolo)
        var sag = [];
        if (ms.length) {
          var bx0 = ms[0].x0 - 6;
          sag.push([bx0, bx0 + G[k].nome.length * 6.6 + 22]);
          righe.forEach(function (r) {
            var a = Infinity, z = -Infinity;
            r.forEach(function (p) { if (p.x0 < a) a = p.x0; if (p.xe > z) z = p.xe; });
            sag.push([a - 6, z + 6]);
          });
        }
        blocchi[k] = { k: k, righe: righe, sag: sag, n: sag.length, r0: 0 };
      }
      // posa dei blocchi nell'ordine dato, sulla griglia
      var occ = [];                 // occ[riga] = elenco di [x0,x1] gia' occupati
      var posati = [], Hr = 0;
      ordine.forEach(function (k) {
        var b = blocchi[k];
        if (!b.n) return;
        var best = Infinity, br = 0;
        for (var r = 0; r <= Hr + 1; r++) {
          var base = 0.05 * r;
          if (base >= best) break;
          var ok = true;
          for (var j = 0; j < b.n && ok; j++) {
            var row = occ[r + j];
            if (!row) continue;
            var s0 = b.sag[j][0] - 4, s1 = b.sag[j][1] + 4;
            for (var q = 0; q < row.length; q++) if (row[q][0] < s1 && s0 < row[q][1]) { ok = false; break; }
          }
          if (!ok) continue;
          var score = base;
          for (j = 0; j < posati.length; j++) {
            var o = posati[j], w = W[b.k][o.k];
            if (w) score += w * Math.max(0, o.r0 - (r + b.n), r - (o.r0 + o.n));
          }
          if (score < best) { best = score; br = r; }
        }
        b.r0 = br; posati.push(b);
        for (var j2 = 0; j2 < b.n; j2++) {
          if (!occ[br + j2]) occ[br + j2] = [];
          occ[br + j2].push([b.sag[j2][0], b.sag[j2][1]]);
        }
        if (br + b.n > Hr) Hr = br + b.n;
      });
      // costo: altezza totale + distanza di chi sta in due gruppi dall'altro blocco
      var cost = 0;
      blocchi.forEach(function (b) {
        if (!b.n) return;
        b.righe.forEach(function (r, idx) {
          var cy = b.r0 + 1 + idx;
          r.forEach(function (p) {
            if (p.gk.length === 2) {
              var o = blocchi[p.gk[0] === b.k ? p.gk[1] : p.gk[0]];
              if (o.n) cost += Math.max(0, o.r0 - cy, cy - (o.r0 + o.n - 1));
            }
          });
        });
      });
      return { blocchi: blocchi, occ: occ, Hr: Hr, costo: Hr + TIE * cost };
    }

    // ---- stato iniziale: gruppi in ordine cronologico, persona condivisa nel gruppo piu' vicino nel tempo ----
    var ordine = G.map(function (g) { return g.k; }).sort(function (x, y) { return G[x].picco - G[y].picco; });
    var scelta = new Array(P.length);
    condivisi.forEach(function (p) {
      var m = (p.a + p.d) / 2;
      var g0 = G[p.gk[0]], g1 = G[p.gk[1]];
      scelta[p.i] = Math.abs(g0.picco - m) <= Math.abs(g1.picco - m) ? p.gk[0] : p.gk[1];
    });
    var corrente = decodifica(ordine, scelta);
    var migliore = { ordine: ordine.slice(), scelta: scelta.slice(), ris: corrente };

    for (var it = 0; it < ITER; it++) {
      var T = 3 * Math.pow(0.02, it / Math.max(1, ITER - 1));
      var nOrd = ordine.slice(), nSc = scelta.slice();
      var r = rnd();
      if (r < 0.5 || !condivisi.length) {
        var i1 = Math.floor(rnd() * NG), j1 = Math.floor(rnd() * NG);
        var el = nOrd.splice(i1, 1)[0]; nOrd.splice(j1, 0, el);
      } else if (r < 0.75) {
        var i2 = Math.floor(rnd() * NG), j2 = Math.floor(rnd() * NG);
        var tmp = nOrd[i2]; nOrd[i2] = nOrd[j2]; nOrd[j2] = tmp;
      } else {
        var p = condivisi[Math.floor(rnd() * condivisi.length)];
        nSc[p.i] = nSc[p.i] === p.gk[0] ? p.gk[1] : p.gk[0];
      }
      var ris = decodifica(nOrd, nSc);
      var delta = ris.costo - corrente.costo;
      if (delta <= 0 || rnd() < Math.exp(-delta / T)) {
        ordine = nOrd; scelta = nSc; corrente = ris;
        if (ris.costo < migliore.ris.costo) migliore = { ordine: nOrd.slice(), scelta: nSc.slice(), ris: ris };
      }
    }
    var fin = migliore.ris;

    // ---- rifinitura: dentro ogni blocco, chi sta in due gruppi va nelle righe piu' vicine all'altro gruppo ----
    function costruisciOcc(esclusi) {
      var o = [];
      fin.blocchi.forEach(function (b) {
        if (!b.n || b === esclusi) return;
        b.sag.forEach(function (c, j) { (o[b.r0 + j] = o[b.r0 + j] || []).push(c); });
      });
      return o;
    }
    function sagoma(b, righe) {
      var sag = [[b.sag[0][0], b.sag[0][1]]];
      righe.forEach(function (r) {
        var a = Infinity, z = -Infinity;
        r.forEach(function (p) { if (p.x0 < a) a = p.x0; if (p.xe > z) z = p.xe; });
        sag.push([a - 6, z + 6]);
      });
      return sag;
    }
    fin.blocchi.slice().sort(function (x, y) { return y.n - x.n; }).forEach(function (b) {
      if (!b.n) return;
      var ms = []; b.righe.forEach(function (r) { r.forEach(function (p) { ms.push(p); }); });
      var cond = ms.filter(function (p) { return p.gk.length === 2; });
      if (!cond.length) return;
      var nuove = b.righe.map(function () { return []; });
      var libera = function (riga, p) {
        for (var q = 0; q < riga.length; q++) if (riga[q].x0 < p.xe + GAP && p.x0 < riga[q].xe + GAP) return false;
        return true;
      };
      var metti = function (p, pref) {
        var best = -1, bd = Infinity;
        for (var j = 0; j < nuove.length; j++) {
          if (!libera(nuove[j], p)) continue;
          var d = pref == null ? j : Math.abs(j - pref);
          if (d < bd) { bd = d; best = j; }
        }
        if (best < 0) { nuove.push([]); best = nuove.length - 1; }
        nuove[best].push(p);
      };
      cond.sort(function (x, y) { return x.x0 - y.x0; }).forEach(function (p) {
        var o = fin.blocchi[p.gk[0] === b.k ? p.gk[1] : p.gk[0]];
        var pref = o.n ? (o.r0 + (o.n - 1) / 2) - (b.r0 + 1) : null;
        metti(p, pref == null ? null : Math.max(0, Math.min(nuove.length - 1, Math.round(pref))));
      });
      ms.filter(function (p) { return p.gk.length !== 2; }).sort(function (x, y) { return x.x0 - y.x0; })
        .forEach(function (p) { metti(p, null); });
      nuove = nuove.filter(function (r) { return r.length; });
      var sag = sagoma(b, nuove), occ2 = costruisciOcc(b), ok = true;
      for (var j = 0; j < sag.length && ok; j++) {
        var row = occ2[b.r0 + j];
        if (row) for (var q = 0; q < row.length; q++) if (row[q][0] < sag[j][1] + 4 && sag[j][0] - 4 < row[q][1]) { ok = false; break; }
      }
      if (ok) { b.righe = nuove; b.sag = sag; b.n = sag.length; }
    });
    fin.occ = costruisciOcc(null);
    fin.Hr = 0;
    fin.blocchi.forEach(function (b) { if (b.n && b.r0 + b.n > fin.Hr) fin.Hr = b.r0 + b.n; });

    // ---- posizioni finali delle persone nei blocchi ----
    var persone = [];
    fin.blocchi.forEach(function (b) {
      if (!b.n) return;
      b.righe.forEach(function (r, idx) {
        r.forEach(function (p) {
          p.y = (b.r0 + 1 + idx) * ROW;
          p.blocco = G[b.k].id;
          p.secondo = p.gk.length === 2 ? G[p.gk[0] === b.k ? p.gk[1] : p.gk[0]].id : null;
        });
      });
    });

    // ---- chi non ha gruppo: nel primo spazio libero fuori dai blocchi, vicino al suo gruppo secondario se ce l'ha ----
    var sec = opz.vicini || {};   // nome -> nomi di chi gli sta vicino (gruppo secondario, fili): serve a collocare chi non ha gruppo
    var occ = fin.occ, Hr = fin.Hr;
    var perNome = {}; P.forEach(function (p) { perNome[p.nome] = p; });
    var pendenti = soli.slice();
    var haVicini = function (p) { return (sec[p.nome] || []).some(function (n) { return perNome[n] && perNome[n].y != null; }); };
    while (pendenti.length) {
      var pi = 0;
      for (var z = 0; z < pendenti.length; z++) if (haVicini(pendenti[z])) { pi = z; break; }
      var p = pendenti.splice(pi, 1)[0];
      var target = 0, ys = [];
      (sec[p.nome] || []).forEach(function (n) { var q = perNome[n]; if (q && q.y != null) ys.push(q.y / ROW); });
      if (ys.length) target = ys.reduce(function (u, v) { return u + v; }, 0) / ys.length;
      var best = Infinity, br = 0;
      for (var r = 0; r <= Hr + 6; r++) {
        var row = occ[r], ok = true;
        if (row) for (var q = 0; q < row.length; q++) if (row[q][0] < p.xe + 4 && p.x0 - 4 < row[q][1]) { ok = false; break; }
        if (!ok) continue;
        var sc = Math.abs(r - target);
        if (sc < best) { best = sc; br = r; }
      }
      p.y = br * ROW; p.blocco = null; p.secondo = null;
      if (!occ[br]) occ[br] = [];
      occ[br].push([p.x0 - 4, p.xe + 4]);
      if (br + 1 > Hr) Hr = br + 1;
    }

    P.forEach(function (p) { persone.push({
      nome: p.nome, cat: p.cat, a: p.a, d: p.d, nasc: p.nasc, x0: p.x0, x1: p.x1, xe: p.xe, fuori: p.fuori,
      y: p.y, blocco: p.blocco, secondo: p.secondo, gruppi: p.gruppi }); });

    var blocchi = [];
    fin.blocchi.forEach(function (b) {
      if (!b.n) return;
      blocchi.push({ id: G[b.k].id, nome: G[b.k].nome, colore: G[b.k].colore, r0: b.r0, righe: b.righe.length,
        membri: b.righe.reduce(function (s, r) { return s + r.length; }, 0),
        celle: b.sag.map(function (c, j) { return { x0: c[0], x1: c[1], y: (b.r0 + j) * ROW }; }) });
    });

    return { persone: persone, blocchi: blocchi, altezza: Hr * ROW + 8, righe: Hr,
             minimo: minimo, T0: T0, T1: T1, scala: S, riga: ROW,
             larghezza: (T1 - T0) * S, costo: fin.costo };
  }

  var api = { calcola: calcola, anno: anno };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.V2Layout = api;
})(typeof window !== 'undefined' ? window : this);
