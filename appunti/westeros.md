# Appunti: Westeros (Cronache del ghiaccio e del fuoco) per la timeline di esempio v3

File di lavoro, separato dal resto del progetto. Raccoglie i dati per la timeline di esempio della v3 sul mondo di Martin.
Niente testi copiati: solo fatti (nomi, anni) e le nostre etichette.

- **Dati pronti per la v3:** [`v3/demo/westeros.json`](../v3/demo/westeros.json), la **demo della v3** (pulsante *Demo Westeros*, oppure *Importa JSON*).
- **Anteprima:** [`v3/demo/westeros.png`](../v3/demo/westeros.png).

## Regole del file

- Ogni dato ha uno stato: **✅ verificato** (con la fonte), **≈ periodo** (la fonte dà un intervallo o un evento, non un anno preciso), **❓ da verificare**. Gli anni scritti a memoria non entrano.
- Gerarchia delle fonti: i libri (romanzi, novelle, *Fire & Blood*, *The World of Ice & Fire*); come sintesi consultabile [A Wiki of Ice and Fire](https://awoiaf.westeros.org) (AWOIAF). La serie TV **non** è fonte.
- Fonti indicate da Federico: [AWOIAF, Timeline of major events](https://awoiaf.westeros.org/index.php/Timeline_of_major_events) (usata) e [Il Trono di Spade Wiki, Cronache del ghiaccio e del fuoco](https://iltronodispade.fandom.com/it/wiki/Cronache_del_ghiaccio_e_del_fuoco) (consultata il 14/11/2026: è una pagina di presentazione della saga, senza date né cronologia).
- Tutte le verifiche sono del 14/11/2026, sull'infobox della pagina AWOIAF del personaggio, salvo dove indicato.

## Convenzione degli anni

- Gli anni si contano da **Aegon's Conquest**: AC dopo, BC prima. **Non esiste l'anno 0.** Lo conferma Aegon I: nato nel 27 BC, morto nel 37 AC «aged 63» (27 + 37 − 1 = 63). ✅
- **Scelta per la v3:** BC = numero negativo semplice (27 BC → −27). Prima della Conquista le barre sono quindi spostate di **un anno** rispetto al conto vero. A questa scala non si vede.
- L'asse della v3 mostra comunque una tacca «0 AC», che nel mondo di Martin non esiste.
- Suffisso degli anni nella v3: `AC`.

## Tranelli trovati

- Nell'infobox di Aegon I, le date accanto a Visenya (1–37 AC) e Rhaenys (1–10 AC) sono gli anni da regine, non la loro vita.
- La pagina *Timeline of major events* ha intestazioni sbagliate: le Guerre del Drago sono intitolate «213 AC», ma il testo dice 2–4 AC.
- La seconda ribellione Blackfyre ha la data tra parentesi quadre (211 AC): incerta.
- Le pagine delle casate (Stark, Baratheon, Lannister) **non** riportano anni: servono le pagine dei singoli.
- Diversi draghi hanno solo la data di morte. La v3 vuole una nascita, quindi per ora sono fuori dalle barre (elenco sotto).

## Colori (categorie della v3 = casate)

| Casata | Colore | Nota |
|---|---|---|
| Targaryen | nero `#1c1c1c` | come richiesto |
| Stark | grigio `#8a9099` | come richiesto |
| Baratheon | oro `#c9a227` | il campo dello stemma (cervo nero su oro) |
| Draghi | rosso fuoco `#b3261e` | categoria a sé, per distinguerli dai cavalieri |

## Eventi ✅ (AWOIAF, Timeline of major events)

| Anni | Evento |
|---|---|
| 2 BC – 1 AC | Conquista di Aegon |
| 2 – 4 AC | Guerre del Drago (Isole di Ferro, Tre Sorelle, invasione di Dorne): non ancora nella v3 |
| 41 – 48 AC | Rivolta della Fede Militante |
| 129 – 131 AC | Danza dei Draghi |
| 153 AC | Morte dell'ultimo drago |
| 157 – 161 AC | Conquista di Dorne (Daeron I) |
| 196 / 211 (incerta) / 219 / 236 AC | Ribellioni Blackfyre, dalla prima alla quarta |
| 209 AC | Grande morbo di primavera: non ancora nella v3 |
| 259 AC | Tragedia di Summerhall |
| 260 AC | Guerra dei Re da Nove Soldi: non ancora nella v3 |
| 277 AC | Defiance of Duskendale: non ancora nella v3 |
| 282 – 283 AC | Ribellione di Robert |
| 289 AC | Ribellione dei Greyjoy |
| 298 – 300 AC | Guerra dei Cinque Re (i romanzi pubblicati arrivano al 300 AC) |

Prima della Conquista, per un'eventuale estensione: −114 migrazione dei Targaryen a Roccia del Drago; −102 Destino di Valyria.

## Personaggi ✅

| Nome | Nascita | Morte | Note |
|---|---|---|---|
| Aegon I | 27 BC | 37 AC | regno 1–37 AC; drago Balerion |
| Visenya | 29 BC | 44 AC | drago Vhagar |
| Aenys I | 7 | 42 | regno 37–42; drago Quicksilver |
| Maegor I | 12 | 48 | regno 42–48; drago Balerion |
| Jaehaerys I | 34 | 103 | regno 48–103; drago Vermithor |
| Viserys I | 77 | 129 | regno 103–129; drago Balerion |
| Daemon | 81 | 130 | drago Caraxes |
| Rhaenyra | 97 | 130 | regina contesa 129–130; drago Syrax |
| Aegon II | 107 | 131 | regno 129–131; drago Sunfyre |
| Aemond | 110 | 130 | drago Vhagar (dalla pagina *Dragon*) |
| Aegon III | 120 | 157 | regno 131–157; drago Stormcloud |
| Viserys II | 122 | 172 | regno 171–172 |
| Aegon IV | 135 | 184 | regno 172–184 |
| Daeron I | 143 | 161 | regno 157–161 |
| Baelor I | 144 | 171 | regno 161–171 |
| Daeron II | 153 | 209 | regno 184–209 |
| Aerys I | ≈ 172–176 | 221 | regno 209–221; la barra parte dal 172 |
| Maekar I | 174 | 233 | regno 221–233 |
| Aegon V | 200 | 259 | regno 233–259 |
| Jaehaerys II | 225 | 262 | regno 259–262 |
| Aerys II | 244 | 283 | regno 262–283 |
| Rhaegar | 259 | 283 | |
| Daenerys | 284 | — | viva alla fine dei romanzi |
| Rickard Stark | ≈ 230–250 | 282 | la barra parte dal 230 |
| Eddard Stark | 263 | 299 | |
| Lyanna Stark | ≈ 266–267 | 283 | la barra parte dal 266 |
| Robb Stark | 283 | 299 | |
| Jon Snow | 283 | ? | l'infobox non dà la morte: barra aperta |
| Robert I Baratheon | 262 | 298 | regno 283–298 |
| Joffrey Baratheon | 286 | 300 | regno 298–300 |
| Tommen Baratheon | 291 | — | regna dal 300 AC |

Regni dei Targaryen confermati anche dalla pagina [House Targaryen](https://awoiaf.westeros.org/index.php/Targaryen).

**Esclusi per ora dalle barre** (manca un anno): Cregan Stark (nato nel 108 AC, morte non indicata), Torrhen Stark (l'infobox non dà la nascita), Rhaenys (moglie di Aegon I: nessuna data nella fonte consultata), Lannister (non verificati).

## Draghi e cavalieri (AWOIAF, pagina [Dragon](https://awoiaf.westeros.org/index.php/Dragon), sezione «Known Dragons»)

| Drago | Cavalieri, in ordine | Nascita | Morte | Nella v3 |
|---|---|---|---|---|
| Balerion | Aegon I, Maegor I, Aerea, Viserys I | prima del 114 BC | 94 AC | sì, barra dal 114 BC |
| Vhagar | Visenya, Baelon, Laena Velaryon, Aemond | 52 BC | 130 | sì |
| Meraxes | Rhaenys | tra il 114 BC e la Conquista | 10 | sì, barra dal 114 BC |
| Quicksilver | Aenys I, il principe Aegon | 7 | 43 | sì |
| Vermax | Jacaerys Velaryon | tra il 114 e il 120 | 130 | sì, dal 114 |
| Arrax | Lucerys Velaryon | tra il 115 e il 120 | 129 | sì, dal 115 |
| Tyraxes | Joffrey Velaryon | tra il 117 e il 120 | 130 | sì, dal 117 |
| Stormcloud | Aegon il Giovane (poi Aegon III) | tra il 120 e il 129 | 130 | sì, dal 120 |
| Morning | Rhaena | durante la Danza | entro il 153 | sì, ≈ 130–153 |
| Drogon, Rhaegal, Viserion | Daenerys (Drogon) | dalla pira di Drogo | vivi | sì, dal 298 (≈: la fonte non dà l'anno) |
| Caraxes | Aemon, Daemon | ? | 130 | no |
| Syrax | Rhaenyra | ? | 130 | no |
| Sunfyre | Aegon II | ? | 130 | no |
| Vermithor | Jaehaerys I, Hugh Hammer | ? | 130 | no |
| Dreamfyre | Rhaena, Helaena | ? | 130 | no |
| Meleys | Alyssa, Rhaenys | ? | 129 | no |
| Seasmoke | Laenor Velaryon, Addam Velaryon | ? | 130 | no |
| Tessarion | Daeron | ? | 130 | no |
| Moondancer | Baela | ? | 130 | no |
| Silverwing | Alysanne | ? | entro il 153 | no |
| Ultimo drago | nessuno | ? | 153 | no |

Per avere anche Caraxes, Syrax, Sunfyre e gli altri servirebbe la data di nascita, o una regola nostra: per esempio «la barra parte dal primo anno in cui la fonte lo dà per vivo». Da decidere.

## Gruppi nella v3 (bozza)

La Conquista · I Neri (Danza dei Draghi) · I Verdi (Danza dei Draghi) · I lealisti di Aerys · I ribelli di Robert · Guerra dei Cinque Re. Al massimo 2 per personaggio. Vhagar è sia nella Conquista sia tra i Verdi.

## Fili

1. **La corona dei Sette Regni** (oro): i 20 re sul Trono di Spade in ordine di successione, da Aegon I a Tommen.
   - Rhaenyra è fuori dalla successione ufficiale, come nella lista dei re di AWOIAF: è nominata solo nella sua descrizione.
   - Per seguire l'ordine di successione e non quello di nascita, la v3 ora ha l'opzione «ordine: come li spunto». Esempio: Viserys II (nato nel 122) regna dopo Baelor I (nato nel 144).
2. Prossimi candidati: un filo per ciascun drago con i suoi cavalieri (Balerion, Vhagar), la stirpe Stark.

## Da fare

- [ ] Decidere la regola per i draghi senza data di nascita.
- [ ] Lannister, Tully, Greyjoy, Martell (con i loro colori), se servono.
- [ ] Eventi mancanti: Guerre del Drago, Grande morbo di primavera, Re da Nove Soldi, Duskendale.
- [ ] Cregan e Torrhen Stark: cercare la data mancante.
