// Calcolo delle righe per la timeline v3 (v3/index.html). Nessun disegno qui: si calcola prima, si disegna dopo.
//
// Motore della v2 adattato alla v3: anni interi qualsiasi (anche negativi o inventati), barre dalla nascita
// alla morte (senza eta' adulta), morte assente = ancora vivo, personaggi e gruppi identificati da id.
// Stesso seme = stesso risultato.
//
// Uso (browser o Node): V3Layout.calcola(persone, gruppi, {larghezza: 1400, estremi: [..anni degli eventi..], vicini: {id: [id..]}})
//   persone: [{id, nome, cat, nascita, morte (numero o null), gruppi: [idGruppo, ...]}]
//   gruppi:  [{id, nome, colore}]
(function (root) {
  'use strict';

  // distanza tra le tacche dell'asse: la prima della serie che da' al massimo ~12 tacche
  function passoAsse(span) {
    var c = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000, 100000];
    var target = span / 12;
    for (var i = 0; i < c.length; i++) if (c[i] >= target) return c[i];
    return c[c.length - 1];
  }

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

  function calcola(personaggi, gruppi, opz) {
    opz = opz || {};
    var ROW = opz.riga || 21;        // altezza di una riga
    var GAP = 6;
    var TIE = opz.legame == null ? 1.5 : opz.legame; // peso della vicinanza ai gruppi condivisi
    var ITER = opz.iterazioni == null ? 1500 : opz.iterazioni;
    var rnd = mulberry32(opz.seme == null ? 20261104 : opz.seme);

    // ---- intervallo di tempo ----
    var noti = (opz.estremi || []).slice();
    personaggi.forEach(function (pg) { noti.push(pg.nascita); if (pg.morte != null) noti.push(pg.morte); });
    if (!noti.length) {
      return { persone: [], blocchi: [], altezza: 0, righe: 0, minimo: 0, T0: 0, T1: 0, passo: 1, scala: 1, riga: ROW, larghezza: 0, costo: 0 };
    }
    var minY = Math.min.apply(null, noti), maxY = Math.max.apply(null, noti);
    var coda = Math.max(10, Math.round((maxY - minY) * 0.08)); // lunghezza della barra di chi e' ancora vivo
    var haAperti = personaggi.some(function (pg) { return pg.morte == null; });
    var fine = haAperti ? maxY + coda : maxY;
    var passo = passoAsse(Math.max(1, fine - minY));
    var marg = Math.max(1, Math.round(passo / 5));
    var T0 = Math.floor(minY / passo) * passo - marg;
    var T1 = Math.ceil(fine / passo) * passo + marg;
    var S = opz.scala || (opz.larghezza || 1400) / (T1 - T0);   // pixel per anno

    // ---- persone: barre e etichette (la barra va dalla nascita alla morte) ----
    var P = personaggi.map(function (pg, i) {
      var aperto = pg.morte == null;
      var gr = [];
      (pg.gruppi || []).forEach(function (id) { if (gr.indexOf(id) < 0) gr.push(id); });
      return { i: i, id: pg.id, nome: pg.nome, cat: pg.cat, nasc: pg.nascita, a: pg.nascita,
               d: aperto ? fine : Math.max(pg.morte, pg.nascita), aperto: aperto, gruppi: gr };
    });
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
    P.forEach(function (p) { p.gruppi = p.gruppi.filter(function (id) { return gIdx[id] != null; }).slice(0, 2); });
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

    if (NG < 2) ITER = 0;
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
    var perNome = {}; P.forEach(function (p) { perNome[p.id] = p; });
    var pendenti = soli.slice().sort(function (u, v) { return u.x0 - v.x0 || u.i - v.i; });
    var haVicini = function (p) { return (sec[p.id] || []).some(function (n) { return perNome[n] && perNome[n].y != null; }); };
    while (pendenti.length) {
      var pi = 0;
      for (var z = 0; z < pendenti.length; z++) if (haVicini(pendenti[z])) { pi = z; break; }
      var p = pendenti.splice(pi, 1)[0];
      var target = 0, ys = [];
      (sec[p.id] || []).forEach(function (n) { var q = perNome[n]; if (q && q.y != null) ys.push(q.y / ROW); });
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
      id: p.id, nome: p.nome, cat: p.cat, a: p.a, d: p.d, nasc: p.nasc, aperto: p.aperto, x0: p.x0, x1: p.x1, xe: p.xe, fuori: p.fuori,
      y: p.y, blocco: p.blocco, secondo: p.secondo, gruppi: p.gruppi }); });

    var blocchi = [];
    fin.blocchi.forEach(function (b) {
      if (!b.n) return;
      blocchi.push({ id: G[b.k].id, nome: G[b.k].nome, colore: G[b.k].colore, r0: b.r0, righe: b.righe.length,
        membri: b.righe.reduce(function (s, r) { return s + r.length; }, 0),
        celle: b.sag.map(function (c, j) { return { x0: c[0], x1: c[1], y: (b.r0 + j) * ROW }; }) });
    });

    var largMax = (T1 - T0) * S;
    persone.forEach(function (p) { if (p.xe > largMax) largMax = p.xe; });
    return { persone: persone, blocchi: blocchi, altezza: Hr * ROW + 8, righe: Hr,
             minimo: minimo, T0: T0, T1: T1, passo: passo, scala: S, riga: ROW,
             larghezza: largMax, costo: fin.costo };
  }

  var api = { calcola: calcola };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.V3Layout = api;
})(typeof window !== 'undefined' ? window : this);
