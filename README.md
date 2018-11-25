# TelemetryOfflineClientJS

## Ausprobieren
* Man braucht NodeJS mit NPM
* `npm install`
* `npm start`
* Chrome müsste sich öffnen

## Konzept
* Workspace enthält beliebig viele Tiles, die frei anordbar sind. Für jedes Tile ist auswählbar, welche Art von Graph, Channel, Tabelle etc. angezeigt werden soll
* Global wird ein Zeit-Ausschnit ausgewählt in Übersichtsgraph oder Tabelle mit Rundenangaben
* Beim Bewegen der Maus über einen Graph, wird ein Fadenkreuz an der ensprechend vorgegebenen X-Position auf allen Graphen angezeigt
* Dunkles Einstein-Styling
* **Farbverläufe**

## Struktur
* React zusammen mit Redux
    * React ist eine UI-Lib, mit denen man Components definieren und weiderverwenden kann und kümmert sich um das Updaten der Components, wenn sich die Daten ändern: https://reactjs.org
    * Redux verwaltet den State der App global, sodass man diesen speichern kann und damit verschiedene Ansichten speichern kann und später wieder laden: https://redux.js.org
* Aufteilung in Components, die keinen State haben, sondern nur von den Eltern mitgeteilt bekommen, welche Daten sie denn anzeigen sollen, und Containers, die einen State haben bzw. von Redux einen State bekommen, aber dafür nichts direkt darstellen: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
* Redux-State enthält:
    * Position und Größe der Tiles
    * Einstellungen der Tiles
    * Ausgewählter Ausschnit
    * Zeitpunkt, der gerade mit der Maus ausgewählt ist?
    * Eigentlich so ziemlich jeden State den es in der App gibt

## Libs
* Das Projekt wurde erstellt mit Create-React-App. Das richtet die ganzen Buildtools und Debugging-Sachen ein: https://github.com/facebook/create-react-app
* React: https://reactjs.org
* Redux: https://redux.js.org
* Styled-Components: Um den CSS-Style festzulegen innerhalb einer Component, [siehe unten](#Styled-components)
* React-Mosaic für die Anordnung und das dragen und droppen der Tiles: https://github.com/palantir/react-mosaic
* D3: Zum Graph malen: https://d3js.org

## Codestyle
* Eslint überprüft den Style. Es gibt für alle möglichen IDEs ein Plugin, das Verstöße dann gleich anzeigt
* Keine Semikolons. Ja, richtig, keine Semikolons: https://mislav.net/2010/05/semicolons/
* Single quotes '
* JSX mit HTML-like Code in JS: https://reactjs.org/docs/introducing-jsx.html
* Und alles mögliche andere. Bis auf wenige Ausnahmen ist das der Codestyle von 'react-app'. Siehe `package.json`


## Paar Ideen
* AsynIterator für Datensätze. Diese werden immer blockweise aus der Datei gelesen bzw. aus mehreren Dateien und nur der gerade benötigte Teil wird (irgendwie) im Speicher gehalten?
* Globaler ausgewählter Zeitpunkt. Wenn über ein Diagramm mit der Maus gefahren wird, soll es bei allen anderen Diagrammen auch gehighlightet werden
* DataManager mit Funktion die alle Werte innerhalb eines Zeitintervalls zurückgibt (als AsyncIterator?)
* Evtl. doch ChartJS statt D3?

## TODOs
* Löschen von TileSettings
* Entscheidungen dokumentieren
* TypeScript

## Entscheidungen

### Styling

#### Styled-components
* https://www.styled-components.com
* Größte Community
* Syntax wie normales CSS
* Style des Components an gleicher Stelle wie Componentdefinition selbst
* Weitere Auflösung der Seperation of Concerns zwischen CSS und JS

#### Aphrodite
* Leicht andere Syntax wie normales CSS, da als JS Objekt geschrieben
* Mehr Code-Overhead bei Benutzung durch className={css(styles.…)}

#### Emotion
* Ähnlich wie Styled-components
* Kleinere Community

#### styled-jsx
* Eher unübersichtliche Syntax

## Links
* Neue JS-Features seit ES2015
    * Cheatsheet: https://devhints.io/es6
    * Ausführlicher: https://babeljs.io/docs/en/learn/
* Thinking in React: https://reactjs.org/docs/thinking-in-react.html
* WebSockets haben eingebautes Framing: https://stackoverflow.com/a/16947118/7465253
* D3 Example: https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
* D3 API: https://github.com/d3/d3/blob/master/API.md
