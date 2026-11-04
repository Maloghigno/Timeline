# Timeline v2: requisiti e strade possibili

*Documento di lavoro (novembre 2026). Nessun codice scritto per ora: prima si decide, poi si costruisce.*

## Obiettivo

Una timeline **più ricca e più "infografica"**: le barre non sono più impilate a caso, ma vicine a chi le è legato nella storia. Ogni personaggio resta riconoscibile per la sua **categoria principale** (Main, Military, Scientist, Artist).

## Requisiti

1. **Le categorie si mescolano.** Righe e posizione non dipendono più dalla categoria. La categoria resta visibile (colore della barra).
2. **Nuove dimensioni: gruppi.** Ogni personaggio appartiene al massimo a **2 gruppi** (guerra, rivoluzione, corrente artistica o di pensiero), oppure a nessuno.
3. **I gruppi sono fatti di contemporanei.** Un gruppo vale solo se i suoi membri sono stati **vivi più o meno nello stesso momento**. I gruppi troppo diluiti nel tempo non interessano, **per ora sono esclusi** (in futuro forse come gruppi secondari, per non lasciare soli alcuni personaggi).
4. **I gruppi si incatenano.** Gruppi successivi stanno vicini: Rivoluzione → Napoleone → Risorgimento, Grande Guerra → Seconda guerra mondiale. Chi appartiene a due gruppi consecutivi sta sul confine tra i due.
5. **Barre calcolate prima di disegnarle.** Posizione e riga di ogni barra si calcolano a tavolino: si contano le righe e si decide la vicinanza *prima* di visualizzare.
6. **Insiemi disegnati sopra le barre.** Un gruppo si vede come una forma che raccoglie le sue barre (fascia, cornice, parentesi).
7. **Fili trasversali.** Legami che attraversano i secoli (esempio: i **pirati**, Morgan, Barbanera e Ching Shih) non sono gruppi: si uniscono con una **linea**, per esempio nera, che non vincola le righe.
8. **Nessun nome duplicato.** Ogni personaggio compare una volta sola.

## Cosa dicono i numeri

Misure fatte sui 256 personaggi attuali, con un algoritmo semplice (non l'ottimo matematico).

### Le righe

| Disposizione | Righe |
|---|---|
| Libera, senza vincoli: il **minimo teorico** (il massimo di personaggi vivi nello stesso momento) | **69** |
| 24 gruppi del poster, ognuno su righe contigue | 117 |
| **15 gruppi di contemporanei** (sotto), righe contigue, più i personaggi senza gruppo negli spazi liberi | **94** |

Tenere vicini i gruppi costa circa un terzo di righe in più rispetto al minimo. È il prezzo della prossimità, e sembra ragionevole.

### Come si misura "contemporanei"

Non con l'arco dalla nascita del più vecchio alla morte del più giovane: con quel metro anche le Guerre napoleoniche durerebbero 186 anni. La misura giusta è la **coesione**: la quota di membri viva nell'anno in cui ce n'è il maggior numero. Soglia proposta: **almeno 80%**.

### I 15 gruppi che restano (coesione ≥ 80%)

| Gruppo | Membri | Anno di picco | Coesione |
|---|---|---|---|
| La Guerra dei Trent'anni | 23 | 1622 | 87% |
| La Guerra dei Sette anni | 16 | 1739 | 94% |
| L'Illuminismo | 39 | 1750 | 82% |
| Le rivoluzioni atlantiche | 17 | 1770 | 88% |
| Le guerre napoleoniche | 30 | 1781 | 93% |
| Risorgimento e unificazioni | 12 | 1821 | 92% |
| La Guerra di secessione | 3 | 1823 | 100% |
| Le indipendenze americane | 6 | 1826 | 100% |
| Corone dell'Ottocento | 15 | 1859 | 93% |
| Impressionismo e arte moderna | 11 | 1882 | 82% |
| Rivoluzioni del Novecento | 8 | 1894 | 88% |
| La Grande Guerra | 30 | 1897 | 97% |
| La nuova fisica | 16 | 1913 | 88% |
| La Seconda guerra mondiale | 31 | 1913 | 100% |
| Palcoscenico, schermo e poesia | 9 | 1924 | 100% |

### I 9 gruppi esclusi (per ora)

| Gruppo | Coesione |
|---|---|
| Mari, pirati ed esploratori | 33% |
| Imperi e guerrieri d'Oriente | 42% |
| Il Nord che sale | 56% |
| Barocco e Secolo d'oro | 57% |
| Le rivoluzioni inglesi | 59% |
| La rivoluzione scientifica | 61% |
| Scienza e industria dell'Ottocento | 64% |
| Romanticismo e grande romanzo | 68% |
| Il secolo del Re Sole | 72% |

### Chi resta fuori

Con i 15 gruppi: **198 personaggi** in almeno un gruppo (66 in due), **58 senza gruppo**. I senza gruppo sono quasi tutti del **Seicento** (43 nati prima del 1700), perché i gruppi esclusi erano soprattutto lì. È il buco da colmare per primo, con gruppi del Seicento più compatti oppure con gruppi secondari.

⚠️ I gruppi sono quelli del poster, scelti a giudizio storico e **non ancora rivisti**: le misure servono a decidere il metodo, non a congelare la lista.

## Strade implementative

### Dati

Due campi nuovi per personaggio, nella riga `users.insert(...)` o in un file a parte (`src/gruppi.js`, sul modello di `src/descrizioni.js`):

- `gruppi: ['NAP', 'RISORG']`: al massimo 2.
- `fili: ['PIRATI']`: legami trasversali, senza vincoli di riga.

### Calcolo delle righe (prima del disegno)

1. Si ordinano i gruppi per anno di picco, così quelli successivi si incatenano.
2. Ogni gruppo viene impacchettato in sotto-righe contigue, posate nella posizione libera più alta. Le righe vengono **riusate** dove il gruppo non c'è (gli impressionisti possono stare sulle righe della Guerra dei Trent'anni).
3. Chi ha due gruppi va sul **confine** tra i due blocchi.
4. I personaggi senza gruppo riempiono i buchi rimasti.
5. Risultato: una tabella `personaggio → riga`, più il numero totale di righe, da verificare prima di disegnare.

### Disegno: due opzioni

| | **A. Google Charts + strato SVG** | **B. D3.js** |
|---|---|---|
| Righe | Etichetta di riga invisibile (`r01`, `r02`…) per ogni barra: le righe le decidiamo noi | Controllo totale |
| Insiemi e fili | Strato SVG sopra il grafico, con le posizioni lette dopo l'evento `ready` | Disegnati nativamente |
| Costo | Basso: si tiene il codice attuale | Alto: `index.html` da riscrivere |
| Rischio | Da verificare: come si comporta Google con due barre sovrapposte nella stessa riga, e quanto è fragile leggere le posizioni dal suo SVG | Più codice da mantenere |

**Proposta:** prima un prototipo con **A**. Si passa a **B** solo se A mostra limiti concreti.

### Forme degli insiemi

- **Fascia colorata** dietro le righe del gruppo: adatta ai gruppi contigui, cioè quelli in questo documento.
- **Cornice o contorno** intorno alle barre del gruppo: più elegante, ma rischia di includere barre estranee.
- **Linea** che unisce barre lontane: per i fili come i pirati.

## Decisioni aperte

1. Soglia di coesione: 80% va bene?
2. Lista definitiva dei gruppi e assegnazioni (oggi sono le mie del poster, da rivedere).
3. Come trattare il Seicento rimasto senza gruppi: nuovi gruppi compatti, o gruppi secondari?
4. Quali fili oltre ai pirati.
5. Vista unica, o v2 accanto alla timeline classica?
