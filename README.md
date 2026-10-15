# Anwesenheits-App – Meisterkurs Kunststoff/Kautschuk

## Dateien
- `index.html` – Benutzeroberfläche
- `style.css` – Gestaltung
- `app.js` – Anwesenheit, Speicherung und Auswertung

## Neue persönliche Auswertung
Im Bereich **Stunden & Prozent** gibt es jetzt einen eigenen Reiter für jeden Teilnehmer. Jeder persönliche Reiter zeigt:
- Gesamtquote als Anwesenheitstage / alle erfassten Unterrichtstage
- Gesamtstunden und erfasste Sollstunden
- Monatsübersicht mit Anwesenheitstagen, Unterrichtstagen, Quote und Stunden
- Möglichkeit, einzelne Tage zu prüfen und zu korrigieren

Die Gesamtquote wird aus den Monaten berechnet, die in diesem Browser in der App gespeichert sind. Alte PDF-/Foto-Listen werden nicht automatisch importiert; ihre Tage und Kürzel müssen in der App eingetragen oder importiert werden.

## Auf GitHub Pages veröffentlichen
1. ZIP entpacken.
2. `index.html`, `style.css`, `app.js` und `README.md` ins Repository hochladen (im Hauptordner).
3. In GitHub unter **Settings → Pages** die Veröffentlichung aus dem gewünschten Branch aktivieren.

## Datenspeicherung und Datenschutz
Die Daten liegen aktuell in `localStorage` des verwendeten Browsers. Sie werden nicht automatisch zwischen Teilnehmern oder Geräten synchronisiert. Für persönliche Logins, Rechte je Teilnehmer und gemeinsame Speicherung ist eine Datenbank mit Authentifizierung erforderlich (z. B. Supabase mit passenden Zugriffsregeln).

## Anwesenheitsregeln
- Lesbares Namenskürzel zählt als anwesend.
- Leeres Feld, `/`, `—`, `-`, `E`, `K` und `U` zählen nicht als Anwesenheit.
- `+` und `x` sind für spätere Korrekturen gedacht und zählen nicht als Namenskürzel.
- Standard: 4 Stunden Montag–Freitag, 6 Stunden Samstag; diese Werte sind einstellbar.

## Historische Datenübernahme
Beim ersten Öffnen werden die bekannten Unterrichtsdaten aus den vorhandenen Listen in den Browser importiert. Gut lesbare Kürzel aus den Fotos Januar bis April 2026 wurden übertragen. `?` bedeutet „im Original nicht sicher übertragen / bitte prüfen“ und zählt ausdrücklich **nicht** als Anwesenheit. Ein `/` zählt ebenfalls nicht als Anwesenheit. Die übrigen Monate enthalten zunächst die bekannten Unterrichtstage mit `?`-Markierungen, damit unleserliche oder noch nicht sauber übertragene Kürzel nicht erfunden werden. Nach dem ersten Import bleiben Änderungen im lokalen Browser gespeichert.

Wichtig: GitHub Pages synchronisiert diese lokalen Daten nicht zwischen verschiedenen Geräten. Für gemeinsame Nutzung durch Lehrkraft und Teilnehmer ist später eine Datenbank (z. B. Supabase) nötig.

### Nachtrag September/Oktober 2026
Die Septemberliste wurde anhand des nachgereichten Fotos ergänzt (Unterrichtstage: 2., 5., 7., 9., 14., 16., 19., 21., 23., 26., 28. und 30. September). Unklare Handschrift ist mit `?` markiert und zählt nicht als Anwesenheit. Oktober 2026 ist als Ferienmonat ohne Unterrichtstage hinterlegt; die nächste Liste beginnt mit einer neuen Vorlage. Beim ersten Öffnen der aktualisierten App wird der September ergänzt, ohne andere bereits gespeicherte Monatsdaten zu überschreiben.


## Bedienung der Monatsvorlage
- In der Hauptansicht wird die Monatsliste bearbeitet und als PDF exportiert.
- Die Auswertung ist über den separaten Button **Anwesenheitsübersicht** erreichbar.
- Ein leeres Anwesenheitsfeld anklicken: Das passende Teilnehmerkürzel wird automatisch eingetragen. Anschließend kann das Feld weiterhin manuell bearbeitet werden.
- Für den Versand werden die PDF-Daten der Monatsliste erstellt; die Auswertungsansicht wird nicht mit exportiert.

- **Druckvorschau / PDF** erstellt nur die Monats-Anwesenheitsliste im Querformat, ohne zweite Auswertungsseite.
- **Monat speichern & ablegen** speichert den Monat im Browser und zeigt ihn in der Monatsablage an. Frühere Monate lassen sich dort erneut öffnen.
- Die Monatsdaten werden beim Bearbeiten automatisch lokal gespeichert. Die Ablage ist aktuell browserlokal und nicht geräteübergreifend.
