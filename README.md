# Timeline

Una linea del tempo di **254 personaggi storici** (nati tra il 1553 e il 1900 circa) per capire chi fosse vivo nello stesso momento di chi. Spoiler: spesso erano tutti vivi insieme e si conoscevano pure, il che spiega parecchio.

Passa il mouse su una barra e compare la **schedina**: foto (da Wikipedia), nome, date, e una frase scritta a mano, cattiva il giusto.

> *Arciduca Carlo d'Austria (05/09/1771 – 30/04/1847): l'avversario di Napoleone che teorizzava la guerra mentre Clausewitz la rimuginava.*

## Come si usa

Niente build, niente `npm install`, niente drammi: apri `index.html` nel browser.
Serve la rete, perché il grafico usa Google Charts e le foto arrivano da Wikipedia.

## Cosa c'è dentro

Quattro categorie, più o meno equilibrate:

| Categoria | Personaggi |
|---|---|
| Main (re, politici, dittatori) | 67 |
| Military (generali, ammiragli, un paio di pirati) | 67 |
| Scientist (scienziati, filosofi, esploratori) | 61 |
| Artist (pittori, musicisti, scrittori) | 59 |

## Come è fatto

- **`index.html`**: tutto il codice e l'elenco dei personaggi (`users.insert(...)`), con [LokiJS](https://github.com/techfort/LokiJS) come mini-database e Google Charts Timeline per il disegno.
- **`src/descrizioni.js`**: le frasi delle schedine, una per personaggio.
- **`src/persone.js`**: dati opzionali da Wikipedia; se è vuoto, le foto vengono caricate dal browser.
- **`tools/build_persone.py`**: script facoltativo che riempie `persone.js` da Wikipedia.

## Aggiungere un personaggio

1. Una riga `users.insert({...})` in `index.html`. **I mesi di JavaScript partono da 0**: gennaio è `0`, dicembre è `11`. Il bug è già successo una volta.
2. Se la data esatta non si conosce, `birth_year_only: true` e/o `death_year_only: true`.
3. Una frase in `src/descrizioni.js`, con lo stesso nome identico.

## Cose da sapere

- Le **frasi sono opinioni**, non fonti. Le date sono controllate dove c'era un dubbio, ma un errore può sempre sfuggire: se ne trovi uno, apri una issue.
- Se una foto non compare, di solito il titolo Wikipedia non corrisponde al nome: basta aggiungerlo a `WIKI_TITOLI` in `index.html`. Nel dubbio, restano le iniziali.
