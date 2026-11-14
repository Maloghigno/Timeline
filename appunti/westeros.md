# Appunti: Westeros (Cronache del ghiaccio e del fuoco) per la timeline di esempio v3

File di lavoro, separato dal resto del progetto. Serve a raccogliere **dati verificati** per costruire, alla fine, un JSON della v3 con il mondo di Martin come esempio. Niente testi copiati: solo fatti (nomi, anni) e le nostre etichette.

## Regole del file

- Ogni dato ha uno stato: **✅ verificato** (con fonte e data del controllo) oppure **❓ da verificare**. Quello che non ho controllato non porta anni scritti a memoria.
- Gerarchia delle fonti: i libri (romanzi, novelle, *Fire & Blood*, *The World of Ice & Fire*); come sintesi consultabile, [A Wiki of Ice and Fire](https://awoiaf.westeros.org) (AWOIAF). La serie TV **non** è fonte: dove diverge dai libri, vale il libro.
- Gli anni dell'infobox AWOIAF sono quelli da usare. Attenzione ai tranelli (sotto).

## Convenzione degli anni

- Gli anni si contano da **Aegon's Conquest**: **AC** (After the Conquest) dopo, **BC** (Before the Conquest) prima. Fonte: [AWOIAF, Timeline of major events](https://awoiaf.westeros.org/index.php/Timeline_of_major_events) (controllata il 14/11/2026).
- **Non esiste l'anno 0.** Verifica: Aegon I nasce nel 27 BC e muore nel 37 AC «aged 63» ([AWOIAF](https://awoiaf.westeros.org/index.php/Aegon_I_Targaryen)); 27 + 37 − 1 = 63. ✅
- **Decisione da prendere per la v3** (anni interi): se un personaggio nasce prima della Conquista, o la timeline attraversa quella soglia, c'è uno scarto di 1 anno rispetto ai numeri negativi semplici. Opzioni: (a) usare l'anno AC com'è e partire dalla Conquista (1 AC), così lo scarto non esiste; (b) mappare BC n → −(n−1) (1 BC = 0), corretto ma con un «0» in asse che nel mondo non esiste. **Proposta: (a), con perimetro da 1 AC in poi.**
- Suffisso anni per la v3: `AC`.

## Tranelli già trovati

- Nell'infobox di Aegon I, le date accanto alle regine **Visenya (1–37 AC)** e **Rhaenys (1–10 AC)** sono gli anni di matrimonio/regno come regine, **non** la vita. Nascita e morte vanno cercate nelle loro pagine.
- Alcune date sono «vaghe» per scelta di Martin (le pagine AWOIAF lo dicono). Un anno incerto va segnato come tale, non arrotondato in silenzio.
- La seconda ribellione Blackfyre ha la data tra parentesi quadre (211 AC) e un'indicazione alternativa nella pagina: trattare come incerta.

## Perimetro proposto (da confermare)

Dalla Conquista (1 AC) al presente dei romanzi (≈ 298–300 AC): la dinastia Targaryen e il mondo che porta a *A Game of Thrones* e *A Clash of Kings*. Circa 40–60 personaggi, con barre di durate molto diverse, che mettono alla prova il layout. Il Nord oltre la Barriera e Essos, solo se servono come fili.

## Eventi (bande verticali) — ✅ verificati su AWOIAF «Timeline of major events», 14/11/2026

| Evento | Anni | Nota |
|---|---|---|
| Aegon's Conquest | 2 BC – 1 AC | incoronazioni: 2 BC (Aegonfort), 1 AC (Oldtown) |
| Danza dei Draghi | 129 – 131 AC | |
| Prima ribellione Blackfyre | 196 AC | evento puntuale |
| Seconda ribellione Blackfyre | 211 AC | ❓ data tra parentesi quadre nella fonte |
| Terza ribellione Blackfyre | 219 AC | |
| Quarta ribellione Blackfyre | 236 AC | |
| Defiance of Duskendale | 277 AC | |
| Ribellione di Robert | 282 – 283 AC | |
| Ribellione dei Greyjoy | 289 AC | |
| Guerra dei Cinque Re | dal 298 AC | in corso nei romanzi |

Nota per la v3: gli eventi puntuali (un anno solo) sono bande strette; si possono unire le quattro ribellioni Blackfyre in una banda 196–236 se pesano troppo.

## Personaggi: dati verificati finora

| Nome | Nascita | Morte | Stato / fonte |
|---|---|---|---|
| Aegon I Targaryen | 27 BC | 37 AC (63 anni) | ✅ [AWOIAF](https://awoiaf.westeros.org/index.php/Aegon_I_Targaryen), 14/11/2026. Regno 1–37 AC |
| Rhaenyra Targaryen | 97 AC | 130 AC (33 anni; 22° giorno del 10° mese) | ✅ [AWOIAF](https://awoiaf.westeros.org/index.php/Rhaenyra_Targaryen), 14/11/2026. Regno 129–130 AC |

Tutto il resto è ancora da verificare.

## Candidati (nomi soltanto, anni ❓ da verificare uno per uno)

**Targaryen e parenti (dalla Conquista a Rhaegar):** Aegon I ✅, Visenya, Rhaenys, Aenys I, Maegor I, Jaehaerys I, Alysanne, Viserys I, Rhaenyra ✅, Daemon Targaryen, Alicent Hightower, Aegon II, Aemond, Aegon III, Baelor I, Daeron II, Aegon IV, Daemon Blackfyre, Aegon V, Aerys II, Rhaegar.

**Era della Ribellione e dei romanzi:** Robert Baratheon, Eddard Stark, Lyanna Stark, Jon Arryn, Tywin Lannister, Cersei, Jaime, Tyrion, Stannis, Renly, Catelyn Stark, Robb Stark, Jon Snow, Daenerys, Barristan Selmy, Petyr Baelish, Varys, Oberyn Martell, Balon Greyjoy.

**Era di Egg (cavalleria e intrighi):** Ser Duncan l'Alto (Dunk), Brynden Rivers (Bloodraven), Maester Aemon.

Dubbi sul perimetro: i personaggi dei romanzi ancora vivi alla fine dei libri hanno morte «ignota»; nella v3 sono barre aperte (freccia), che qui funziona bene.

## Struttura prevista per il JSON v3 (proposta, da validare)

- **Categorie** (colore della barra): Sovrani, Guerrieri, Casate e lord, Intriganti e consiglieri, Maestri e saggi.
- **Gruppi** (aree dietro le barre, max 2 per personaggio): i Neri e i Verdi (Danza dei Draghi), i Blackfyre, i ribelli di Robert, la Casa Targaryen dalla Conquista… *da definire dopo aver verificato le date*.
- **Fili:** la successione al Trono di Spade, la stirpe Stark, la stirpe Targaryen (anche i legami Targaryen–Velaryon), la Guardia Reale… *da definire*.
- **Eventi:** la tabella qui sopra.

## Metodo e costo

- Verifica persona per persona sull'infobox AWOIAF (campi *Born* e *Died*, con l'età come controllo incrociato). Ogni consultazione costa circa 5 crediti Firecrawl; per 40–60 personaggi sono 200–300 crediti.
- Una consultazione su Eddard Stark è tornata vuota: va rifatta.
- Alternativa gratuita ma più lenta: ricerca web per persona. Non l'ho ancora provata a questo scopo.

## Domande aperte

1. Perimetro: confermi 1 AC – ≈300 AC, circa 40–60 personaggi?
2. Canone: solo libri (incluso *Fire & Blood*)? Dove i libri tacciono e la serie dice qualcosa, la lasciamo fuori?
3. Via libera a spendere i crediti Firecrawl per la verifica, oppure meglio il metodo gratuito?
4. Convenzione anni: partire da 1 AC (proposta) o gestire anche i BC?
