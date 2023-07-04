# LF07/08 Schul-Projekt

## Vorbereitung

- Repository klonen: Vorzugsweise mit "git clone https://github.com/TimDehler/LF0708SchoolProject.git" in der bash
- .env Datei erstellen um Umgebungsvariablen zu setzen wie Datenbank-IP und Datenbank- und Collectionname (beim provider Anfragen => Tim Dehler)
- im Terminal "git pull" laufen lassen um evtl. neuere Version vom Repo zu ziehen (nur sinnvoll wenn nicht direkt vorher geklont wurde)
- im Terminal "npm install" laufen lassen um alle Abhängigkeiten zu installieren

## .env

- school_uri="mongodb://10.100.20.145:27017"
- database="dobot-data"
- collection="prod"

## API

- Api starten mit bash command "npm run api" (startet gleichzeitig den MQTT-Subscribe-Client)
- Bei API Fehlern werden diese in die Bash geloggt

#### express

- Express api die die nötigen Endpoints bereitstellt
- Nutzt die methoden aus mqtt.mjs & mongo_utils.mjs als Backendabfrage an Datenbank und MQTT-Broker

#### mongo_utils

- Stellt die nötigen Methoden zum Verbinden / Trennen bereit
- Regelt die Fehlerbehandlung für MongoDB
- Regelt die Datenabfrage aus MongoDB

#### mqtt

- Stellt einen MQTT-Subscribe-Client bereit
- Regelt die Fehlerbehandlung für MQTT
- Stellt eine Schnittstelle für die API bereit um die MQTT Daten abzufragen

## Raspi

#### .service Files

- service Files können in den Autostart gelegt werden
- wenn der von der Gruppe genutzte Raspi verwendet wird muss er nur wie in der Anwenderdokumentation dokumentiert angeschlossen werden und ist funktionstüchtig ohne manuelles starten von .py files

#### .py Files

- code für die jeweiligen .service files
- falls hier etwas geändert wird müssen neue .service files erstellt werden und in den Autostart gelegt werden
- Alternativ können die .py files auf dem Raspi auf manuell gestartet werden

## Dobot

- im dobot Ordner muss im DobotDllType.py file der DLL_PATH (Variable ist ganz oben zu finden) auf den aboluten Pfad der DobotDll.dll Datei auf dem Dobot Host PC geändert werden
- ist dies getan ist zu beachten, dass die Entwicklungsumgebung auf 32-Bit Python laufen muss, da der Dobot sonst einen Fehler wirft
- Danach kann auf dem mit dem Dobot verbunden PC (Host PC) die main.py gestartet werden (wenn alle anderen Komponenten aufgesetzt wurden)

## Website

- Die Website kann via Live Server plugin gestartet werden
- Die Website kann gehostet werden um sie dauerhaft nutzbar zu machen (API muss dementsprechend dann auch gehostet sein)

#### awattar

- Zieht Daten von der Awattar Price API
- Filtert die Daten um den günstigsten Zeitpunkt in den nächsten 24h zu berechnen
- Kann auch mit Parametern aufgerufen werden um den Zeitraum zu spezifieren

#### mqttData_intervall

- checkt im Intervall ob neue Daten vom MQTT Sub-Client bereitstehen
- Fehlerbehandlung
- Anzeigen der Daten

#### script

- Spricht die express API an
- Setzt den "PriceStatus" (Günstigster Zeitpunkt in den nächsten 24h)

#### uitls

- enthält funktionen die Datei übergreifend verwendet werden (Clean Code / Code Einsparungen)
- mapping eines Datenobjekts zu einem HTMLListElement
- Formattierung von Zeit und Datum

## Documentation

-> Enthält die geforderte Dokumentation sowohl in .docx als auch in .pdf Format.
