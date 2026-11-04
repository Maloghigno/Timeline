# Timeline v2: requisiti e strade possibili

*Documento di lavoro, aggiornato il 4 novembre 2026. Nessun codice della v2 scritto per ora: prima si decide, poi si costruisce.*

## Obiettivo

Una **seconda versione della timeline, più ricca e "infografica"**: le barre non sono impilate a caso ma vicine a chi è legato a loro nella storia, e ogni personaggio resta riconoscibile per la sua **categoria principale** (Main, Military, Scientist, Artist). La v2 vive **accanto alla timeline classica**, in una pagina HTML separata (`v2.html`): `index.html` non cambia.

## Requisiti

1. **Le categorie si mescolano.** Righe e posizione non dipendono dalla categoria; la categoria resta visibile nel colore della barra.
2. **Gruppi (max 2 per personaggio).** Ogni personaggio appartiene al massimo a **2 gruppi** (guerra, rivoluzione, corrente artistica o di pensiero), oppure a nessuno.
3. **I gruppi sono fatti di contemporanei**, con **coesione minima del 75%** (vedi sotto come si misura). I gruppi troppo dilatati nel tempo sono esclusi; possono tornare come *gruppi secondari*.
4. **I gruppi si incatenano.** Gruppi successivi stanno vicini (Rivoluzioni → Napoleone → Risorgimento; Grande Guerra → Seconda guerra mondiale). Chi appartiene a due gruppi consecutivi sta sul confine.
5. **Barre calcolate prima di disegnarle.** Posizione e riga di ogni barra si calcolano a tavolino: si conta il numero di righe e si decide la vicinanza *prima* di visualizzare.
6. **Tre tipi di "insieme" disegnati sopra o dietro le barre:**
   - **Gruppo**: rettangolo colorato sulle righe del gruppo.
   - **Evento**: **banda verticale di sfondo** su tutte le righe, tra due date (esempio: Seconda guerra mondiale, 1939–1945). Non ha membri: chi era vivo in quegli anni ci passa sotto.
   - **Filo**: linea che unisce persone lontane nel tempo (esempio: i pirati). Non vincola le righe e **deve essere graficamente curata**.
7. **Nessun nome duplicato.** Ogni personaggio compare una volta sola.

Il numero dei personaggi resta **256** (2⁸).

## Come si misura la coesione

La coesione di un gruppo è la quota di membri presenti nell'anno in cui ce n'è il maggior numero. Ne misuro due versioni:

- **Vivi**: membri vivi in quell'anno. È la misura su cui abbiamo fissato la soglia del 75%.
- **Adulti** (⚠️ sotto 75%): membri vivi *e con almeno 20 anni*. È più severa e più vicina a "hanno agito insieme": Racine nato nel 1639 non è un contemporaneo di Colbert nel 1639.

## I gruppi (23)

15 gruppi dalla prima selezione, più 8 nuovi per coprire il Seicento e l'Ottocento. Il gruppo "Imperi d'Oriente nel Seicento" è stato tolto, con i suoi tre personaggi.

| Gruppo | Membri | Già in un altro gruppo | Anno di picco | Coesione (vivi) | Coesione (adulti) |
|---|---|---|---|---|---|
| Inghilterra degli Stuart | 8 | 3 | 1600 | 100% | 75% |
| Barocco (Roma, Madrid, Amsterdam) | 6 | 1 | 1606 | 100% | 83% |
| La Guerra dei Trent'anni | 23 | 0 | 1621 | 87% | 70% ⚠️ |
| Rivoluzione scientifica | 8 | 2 | 1629 | 100% | 75% |
| Corte del Re Sole | 7 | 0 | 1639 | 100% | 100% |
| Successione spagnola e Grande Guerra del Nord | 7 | 0 | 1682 | 100% | 100% |
| Tardo Barocco musicale | 3 | 0 | 1685 | 100% | 67% ⚠️ |
| La Guerra dei Sette anni | 16 | 8 | 1738 | 94% | 69% ⚠️ |
| L'Illuminismo | 39 | 14 | 1749 | 82% | 69% ⚠️ |
| Le rivoluzioni atlantiche | 18 | 14 | 1769 | 89% | 83% |
| Le guerre napoleoniche | 29 | 11 | 1780 | 97% | 97% |
| Risorgimento e unificazioni | 12 | 8 | 1820 | 92% | 83% |
| La Guerra di secessione | 3 | 1 | 1822 | 100% | 100% |
| Le indipendenze americane | 6 | 4 | 1825 | 100% | 83% |
| Scienza dell'Ottocento | 10 | 0 | 1834 | 100% | 90% |
| Musica e romanzo dell'Ottocento | 6 | 0 | 1840 | 100% | 83% |
| Corone dell'Ottocento | 15 | 9 | 1859 | 93% | 80% |
| Impressionismo e arte moderna | 11 | 5 | 1881 | 82% | 73% ⚠️ |
| Rivoluzioni del Novecento | 9 | 5 | 1893 | 89% | 89% |
| La Grande Guerra | 30 | 19 | 1896 | 97% | 93% |
| La nuova fisica | 16 | 7 | 1912 | 88% | 75% |
| La Seconda guerra mondiale | 30 | 21 | 1912 | 100% | 100% |
| Palcoscenico, schermo e poesia | 10 | 6 | 1923 | 100% | 80% |

⚠️ **Cinque gruppi scendono sotto il 75% con la misura severa**: Trent'anni (70%), Tardo Barocco (67%), Sette anni (69%), Illuminismo (69%) e Impressionismo (73%). Sono quasi tutti movimenti che durano per generazioni, dove la misura del singolo anno penalizza. Vedi le decisioni aperte.

### Personaggi senza gruppo: 3

Michiel de Ruyter, Henry Morgan, Edward Teach (Barbanera). Morgan e Barbanera restano il filo dei pirati; per De Ruyter vedi i gruppi secondari.

### Calcolo delle righe

| Disposizione | Righe |
|---|---|
| Libera, senza vincoli: minimo teorico | **70** |
| Tutti i 23 gruppi su righe contigue, righe riusate quando il gruppo non c'è | **~115** |

Il costo della prossimità è circa il 65% di righe in più rispetto al minimo. Il ~115 viene da un metodo greedy semplice, quindi non è l'ottimo: con un ordinamento migliore si scende, ma non sotto 70.

## Gruppi secondari

Gruppi larghi, ammessi solo come *seconda* appartenenza (rientrano nel limite di 2) e che **non occupano righe**: si vedono come etichetta o filo leggero. Servono a dare una casa ai personaggi altrimenti isolati.

**Proposta: «Secolo d'oro olandese»**: Maurizio di Nassau, Rembrandt, Michiel de Ruyter, Baruch Spinoza, Christiaan Huygens, Guglielmo III d'Orange (6 membri). È l'unico modo in cui De Ruyter trova un gruppo. Coesione 83% (vivi nel 1650: 5 su 6), ma 67% per gli adulti. Il limite di 2 è rispettato da tutti.

## Fili

Un filo unisce persone che non sono contemporanee, per un legame che non vincola le righe. Proposti:

| Filo | Membri | Idea |
|---|---|---|
| **Pirati** (confermato) | Henry Morgan, Edward Teach | La linea nera. Con Ching Shih fuori sono due: valutare un terzo nodo |
| **Casa d'Asburgo** | Ferdinando II, Maria Teresa, Giuseppe II, Arciduca Carlo, Francesco Giuseppe I | Una dinastia dal 1578 al 1916, con legami di parentela reali (Carlo è nipote di Maria Teresa) |
| **Donne** | Maria de' Medici, Cristina di Svezia, Caterina II, Maria Teresa, Vittoria, Isabella II, Ada Lovelace, Marie Curie, Marlene Dietrich | Una linea che attraversa quattro secoli e rende evidente quante poche siano (9 su 256 tra quelle che ricordo; conteggio da verificare) |
| **Da Galileo a Oppenheimer** | Galileo, Newton, Volta, Faraday, Einstein, Bohr, Fermi, Oppenheimer | La fisica come catena di influenze |

Alternative scartate o rimandate: Borbone di Francia (Enrico IV → Luigi XIII → Luigi XIV → Luigi XVI), catena dei compositori (Haydn → Beethoven → Liszt → Wagner).

### Aspetto grafico dei fili

- **Curva a S** (Bézier con tangenti orizzontali) dalla fine di una barra all'inizio della successiva, in ordine cronologico.
- **Alone bianco** sotto il tratto scuro, per restare leggibile sopra le altre barre.
- **Nodi rotondi** con anello bianco sulle barre, nome del filo in maiuscoletto sul primo nodo.
- Linea **leggera di default**, evidenziata al passaggio sul nome del filo (le altre barre si attenuano).
- Se due membri si sovrappongono nel tempo, il collegamento diventa un tratto verticale breve.

## Eventi (bande di sfondo)

Candidati: Guerra dei Trent'anni (1618–1648), Rivoluzione francese (1789–1799), guerre napoleoniche (1803–1815), Prima guerra mondiale (1914–1918), Seconda guerra mondiale (1939–1945). Un evento è solo una coppia di date, una etichetta e un colore: costa poco ed è indipendente dai gruppi.

## Strade implementative

### Dati

Campi nuovi per personaggio, in un file separato (`src/gruppi.js`, sul modello di `src/descrizioni.js`):

- `gruppi: ['NAP', 'RISORG']`: al massimo 2.
- `fili: ['PIRATI']`: legami trasversali.
- Un elenco a parte per gli `eventi` (intervalli di date).

### Calcolo delle righe (prima del disegno)

1. Ordinare i gruppi per anno di picco, così quelli successivi si incatenano.
2. Impacchettare ogni gruppo in sotto-righe contigue, nella posizione libera più alta; le righe vengono **riusate** dove il gruppo non c'è.
3. Chi ha due gruppi va sul **confine** tra i blocchi.
4. I senza gruppo riempiono i buchi.
5. Risultato: tabella `personaggio → riga` e numero totale di righe, da verificare prima di disegnare.

### Disegno

| | **A. Google Charts + strato SVG** | **B. D3.js** |
|---|---|---|
| Righe | Etichette di riga invisibili: le decidiamo noi | Controllo totale |
| Gruppi, eventi, fili | Strato SVG sopra il grafico, con posizioni lette dall'asse dopo l'evento `ready` | Disegnati nativamente |
| Costo | Basso | Medio: pagina nuova |
| Rischio | Google non espone la scala del tempo (si legge dalle etichette dell'asse, fragile); comportamento incerto con barre sovrapposte nella stessa riga | Più codice da mantenere |

**Consiglio: B (D3.js)**, perché con le bande di evento e le curve dei fili serve conoscere con precisione la scala del tempo. La v2 sta in `v2.html`, sempre HTML e JavaScript puri e senza build; la timeline classica resta intatta.

## Decisioni aperte

1. **Misura di coesione**: tenere la misura «vivi» al 75% (tutti i 23 gruppi passano) oppure quella «adulti», che boccia 5 gruppi? Consiglio: «vivi» come criterio e «adulti» come indicatore di qualità, segnalando i gruppi larghi.
2. **Lista definitiva dei gruppi e delle assegnazioni**: in lavorazione (appendice sotto).
3. **Gruppo secondario «Secolo d'oro olandese»**: sì o no?
4. **Fili**: confermare Asburgo, Donne, Fisica (o scegliere altri); un terzo pirata?
5. **Eventi da includere**.
6. **Priorità di costruzione**: prima gruppi e righe, poi eventi, poi fili?

## Appendice: membri dei gruppi

⇄ = membro anche di un altro gruppo. Assegnazioni a giudizio dell'autore, non verificate su fonti: da rivedere.

<details><summary><b>Inghilterra degli Stuart</b> (8)</summary>

Francesco Bacone, William Shakespeare, Guy Fawkes, William Harvey ⇄, Thomas Hobbes ⇄, Oliver Cromwell, Anthony van Dyck ⇄, Carlo I d'Inghilterra

</details>

<details><summary><b>Barocco (Roma, Madrid, Amsterdam)</b> (6)</summary>

Michelangelo Merisi da Caravaggio, Gian Lorenzo Bernini, Francesco Borromini, Diego Velázquez, Anthony van Dyck ⇄, Rembrandt

</details>

<details><summary><b>La Guerra dei Trent'anni</b> (23)</summary>

Enrico IV di Francia, Giacomo I d'Inghilterra, Maurizio di Nassau, Principe d'Orange, Samuel de Champlain, Giovanni Keplero, Abbas I di Persia, Maria de' Medici, Pieter Paul Rubens, Cristiano IV di Danimarca, Ferdinando II d'Asburgo, Albrecht von Wallenstein, Cardinale Richelieu, Gustavo Adolfo di Svezia, Cartesio, Luigi XIII di Francia, Giulio Mazarino, Otto von Guericke, Raimondo Montecuccoli, Maresciallo Turenne, Ruprecht del Reno, Luigi II di Borbone-Condé (il Gran Condé), Cristina di Svezia, Luigi XIV di Francia (Il Re Sole)

</details>

<details><summary><b>Rivoluzione scientifica</b> (8)</summary>

Galileo Galilei, William Harvey ⇄, Thomas Hobbes ⇄, Pierre de Fermat, Evangelista Torricelli, Blaise Pascal, Robert Boyle, Christiaan Huygens

</details>

<details><summary><b>Corte del Re Sole</b> (7)</summary>

Jean-Baptiste Colbert, Molière, Charles Perrault, François-Henri de Montmorency, Jean-Baptiste Lully, Sébastien Le Prestre de Vauban, Jean Racine

</details>

<details><summary><b>Successione spagnola e Grande Guerra del Nord</b> (7)</summary>

John Churchill, I duca di Marlborough, Guglielmo III d'Orange, Luigi Guglielmo di Baden, Federico I di Prussia, Eugenio di Savoia, Pietro I di Russia (Pietro il Grande), Carlo XII di Svezia

</details>

<details><summary><b>Tardo Barocco musicale</b> (3)</summary>

Henry Purcell, Antonio Vivaldi, George Frideric Handel

</details>

<details><summary><b>La Guerra dei Sette anni</b> (16)</summary>

Filippo V di Spagna, Carlo VI d'Asburgo, Federico Guglielmo I di Prussia, Voltaire ⇄, Maresciallo de Saxe (Maurizio di Sassonia), Leopold Joseph von Daun, Luigi XV di Francia ⇄, Imperatore Qianlong, Federico II di Prussia ⇄, Maria Teresa d'Austria ⇄, Ernst Gideon von Laudon, Madame de Pompadour ⇄, James Wolfe, Maresciallo Suvorov ⇄, Giorgio III del Regno Unito ⇄, Giuseppe II d'Asburgo ⇄

</details>

<details><summary><b>L'Illuminismo</b> (39)</summary>

Baruch Spinoza, John Locke, Isaac Newton, Gottfried Wilhelm Leibniz, Jakob Bernoulli, René-Antoine de Réaumur, Johann Sebastian Bach, Daniel Gabriel Fahrenheit, Montesquieu, Voltaire ⇄, Giambattista Tiepolo, Canaletto, Benjamin Franklin ⇄, Carlo Goldoni, Eulero, Linneo, Luigi XV di Francia ⇄, David Hume, Federico II di Prussia ⇄, Jean-Jacques Rousseau ⇄, Denis Diderot, Maria Teresa d'Austria ⇄, Giovanni Battista Piranesi, Madame de Pompadour ⇄, Adam Smith, Immanuel Kant ⇄, Giacomo Casanova, James Cook, Caterina II di Russia, Franz Joseph Haydn, Luigi Galvani, Joseph Montgolfier ⇄, Giuseppe II d'Asburgo ⇄, Thomas Jefferson ⇄, Antoine Lavoisier ⇄, Alessandro Volta, Johann Wolfgang von Goethe ⇄, Vittorio Alfieri ⇄, Wolfgang Amadeus Mozart

</details>

<details><summary><b>Le rivoluzioni atlantiche</b> (18)</summary>

Benjamin Franklin ⇄, Jean-Jacques Rousseau ⇄, Immanuel Kant ⇄, Carlo Thaon di Revel ⇄, George Washington, Giorgio III del Regno Unito ⇄, Joseph Montgolfier ⇄, Thomas Jefferson ⇄, Antoine Lavoisier ⇄, Jacques-Louis David ⇄, Lazare Carnot ⇄, Charles-Maurice de Talleyrand ⇄, Luigi XVI di Francia, Maximilien Robespierre, Georges Danton, Napoleone Bonaparte ⇄, Simón Bolívar ⇄, Abraham Lincoln ⇄

</details>

<details><summary><b>Le guerre napoleoniche</b> (29)</summary>

Carlo Thaon di Revel ⇄, Maresciallo Suvorov ⇄, Gebhard Leberecht von Blücher, Francisco Goya, Jacques-Louis David ⇄, Johann Wolfgang von Goethe ⇄, Lazare Carnot ⇄, Charles-Maurice de Talleyrand ⇄, Gerhard von Scharnhorst, Horatio Nelson, August Neidhardt von Gneisenau, Josef Radetzky ⇄, Gioacchino Murat, Joseph Fourier, Napoleone Bonaparte ⇄, Arthur Wellesley, I duca di Wellington, Michel Ney, Georges Cuvier, Ludwig van Beethoven, Louis-Nicolas Davout, Karl Philipp, principe di Schwarzenberg, Arciduca Carlo d'Austria, Klemens von Metternich ⇄, Alessandro I di Russia ⇄, Carl Friedrich Gauss, José de San Martín ⇄, Antoine-Henri Jomini, Carl von Clausewitz, Lev Tolstoj

</details>

<details><summary><b>Risorgimento e unificazioni</b> (12)</summary>

Vittorio Alfieri ⇄, Josef Radetzky ⇄, Alessandro Manzoni, Giacomo Leopardi, Helmuth Karl Bernhard Graf von Moltke ⇄, Giuseppe Mazzini, Giuseppe Garibaldi ⇄, Napoleone III di Francia ⇄, Camillo Benso, conte di Cavour ⇄, Giuseppe Verdi, Otto von Bismarck ⇄, Vittorio Emanuele II ⇄

</details>

<details><summary><b>La Guerra di secessione</b> (3)</summary>

Robert E. Lee, Abraham Lincoln ⇄, Ulysses S. Grant

</details>

<details><summary><b>Le indipendenze americane</b> (6)</summary>

Alexander von Humboldt, José de San Martín ⇄, Simón Bolívar ⇄, Antonio José de Sucre, Giuseppe Garibaldi ⇄, Pedro II del Brasile ⇄

</details>

<details><summary><b>Scienza dell'Ottocento</b> (10)</summary>

John Dalton, Amedeo Avogadro, Michael Faraday, Charles Darwin, David Livingstone, George Boole, Ada Lovelace, Louis Pasteur, Gregor Mendel, Dmitrij Mendeleev

</details>

<details><summary><b>Musica e romanzo dell'Ottocento</b> (6)</summary>

Frédéric Chopin, Franz Liszt, Richard Wagner, Fëdor Dostoevskij, Jules Verne, Pëtr Il'ič Čajkovskij

</details>

<details><summary><b>Corone dell'Ottocento</b> (15)</summary>

Klemens von Metternich ⇄, Alessandro I di Russia ⇄, Victor Hugo, Napoleone III di Francia ⇄, Camillo Benso, conte di Cavour ⇄, Charles Dickens, Otto von Bismarck ⇄, Vittoria del Regno Unito, Vittorio Emanuele II ⇄, Gustave Flaubert, Pedro II del Brasile ⇄, Francesco Giuseppe I d'Austria ⇄, Isabella II di Spagna, Itō Hirobumi, Guglielmo II di Germania ⇄

</details>

<details><summary><b>Impressionismo e arte moderna</b> (11)</summary>

Paul Cézanne, Claude Monet, Friedrich Nietzsche, Vincent van Gogh, Oscar Wilde, Sigmund Freud ⇄, Gustav Klimt ⇄, Henri Matisse, Pablo Picasso ⇄, Federico García Lorca ⇄, Salvador Dalí ⇄

</details>

<details><summary><b>Rivoluzioni del Novecento</b> (9)</summary>

Nicola II Romanov ⇄, Mahatma Gandhi, Vladimir Lenin ⇄, Iosif Stalin ⇄, Lev Trotskij, Alcide De Gasperi ⇄, Francisco Franco ⇄, Mao Zedong, Ernesto Che Guevara

</details>

<details><summary><b>La Grande Guerra</b> (30)</summary>

Helmuth Karl Bernhard Graf von Moltke ⇄, Francesco Giuseppe I d'Austria ⇄, Alfred Graf von Schlieffen, Paul von Hindenburg ⇄, Helmut Johann Ludwig von Moltke, Alfred von Tirpitz, Luigi Cadorna, Ferdinand Foch, Philippe Pétain ⇄, Paolo Thaon di Revel, Guglielmo II di Germania ⇄, Arthur Conan Doyle, John J. Pershing, Erich von Falkenhayn, Douglas Haig, Erich Ludendorff ⇄, Nicola II Romanov ⇄, Vittorio Emanuele III ⇄, Vladimir Lenin ⇄, Pietro Badoglio ⇄, Winston Churchill ⇄, Ernest Shackleton, Alexander Fleming ⇄, Benito Mussolini ⇄, Adolf Hitler ⇄, Charles de Gaulle ⇄, Erwin Rommel ⇄, J. R. R. Tolkien ⇄, Hermann Wilhelm Göring ⇄, Italo Balbo ⇄

</details>

<details><summary><b>La nuova fisica</b> (16)</summary>

James Clerk Maxwell, Alfred Nobel, Thomas Edison, Nikola Tesla, Sigmund Freud ⇄, Max Planck, Gustav Klimt ⇄, Marie Curie, Guglielmo Marconi, Albert Einstein ⇄, Alexander Fleming ⇄, Niels Bohr, Edwin Hubble, Enrico Fermi ⇄, J. Robert Oppenheimer ⇄, Alan Turing ⇄

</details>

<details><summary><b>La Seconda guerra mondiale</b> (30)</summary>

Paul von Hindenburg ⇄, Philippe Pétain ⇄, Erich Ludendorff ⇄, Vittorio Emanuele III ⇄, Pietro Badoglio ⇄, Winston Churchill ⇄, Iosif Stalin ⇄, Albert Einstein ⇄, Alcide De Gasperi ⇄, Franklin Delano Roosevelt, Rodolfo Graziani, Benito Mussolini ⇄, Giovanni Messe, Erich von Manstein, Heinz Guderian, Adolf Hitler ⇄, Charlie Chaplin ⇄, Charles de Gaulle ⇄, Dwight D. Eisenhower, Erwin Rommel ⇄, Karl Dönitz, Francisco Franco ⇄, Hermann Wilhelm Göring ⇄, Italo Balbo ⇄, Georgij Žukov, Enrico Fermi ⇄, Marlene Dietrich ⇄, Hirohito, J. Robert Oppenheimer ⇄, Alan Turing ⇄

</details>

<details><summary><b>Palcoscenico, schermo e poesia</b> (10)</summary>

Giacomo Puccini, Pablo Picasso ⇄, Charlie Chaplin ⇄, J. R. R. Tolkien ⇄, Federico García Lorca ⇄, Alfred Hitchcock, Marlene Dietrich ⇄, Salvador Dalí ⇄, Greta Garbo, Maria Callas

</details>

