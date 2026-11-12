# Timeline v3 (in lavorazione)

La v2 che parte vuota: inserisci tu personaggi, gruppi, categorie, fili ed eventi, con anni tuoi (interi, anche negativi), per esempio per la cronologia di un libro fantasy.

- **Anni interi.** Barra dalla nascita alla morte; morte vuota = ancora in vita (barra con la freccia). Suffisso degli anni a piacere (es. «E.S.»).
- **Gruppi** assegnati a mano, massimo 2 per personaggio. **Fili** per i legami (dinastie, maestro e allievo…). **Eventi** come bande verticali.
- **Righe calcolate prima di disegnare**, con lo stesso motore della v2 (`layout.js`, deterministico).
- **Dati solo nel browser** (localStorage): per salvarli o spostarli usa **Esporta JSON** e **Importa JSON**.
- Il pulsante **Esempio** carica un piccolo regno inventato.

## Formato del file JSON

```json
{
  "versione": 3,
  "titolo": "Il mio libro",
  "suffisso": "E.S.",
  "categorie": [{ "id": "c1", "nome": "Sovrani", "colore": "#8e3b46" }],
  "gruppi":    [{ "id": "g1", "nome": "Casa dei Corvi", "colore": "#b4565c" }],
  "personaggi": [{ "id": "p1", "nome": "Aldric", "nascita": 1090, "morte": 1161,
                   "categoria": "c1", "gruppi": ["g1"], "descrizione": "…" }],
  "fili":      [{ "id": "f1", "nome": "La stirpe", "colore": "#b4565c", "membri": ["p1"] }],
  "eventi":    [{ "id": "e1", "nome": "La Guerra", "da": 1187, "a": 1194, "colore": "#6b4a3a" }]
}
```

`morte: null` = ancora in vita. Gli id sono stringhe a scelta, uniche; i colori sono esadecimali `#rrggbb`.
In importazione i dati vengono controllati: un file non valido viene rifiutato con il motivo.
