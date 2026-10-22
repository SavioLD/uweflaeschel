# Uwe Fläschel · Handelsvertretung

Live unter **https://uwe-flaeschel.de** (GitHub Pages, Domain über `CNAME`). Statische Website, kein Build nötig. Lokal ansehen:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | **Wieds** (Hauptseite) – Betriebshygiene, Kühlschmierstoffe, Reinigung, Fahrzeugpflege |
| `granderwasser.html` | **Granderwasser** – eigenes Layout & Design (Serifenschrift, Wellen, Tiefblau/Sand) |
| `impressum.html`, `datenschutz.html` | Rechtstexte (gemeinsam für beide Marken) |
| `404.html` | Fehlerseite (fängt auch alte OnePage-Links ab) |

Zwischen den Marken wechselt man über den **Marken-Switch** oben rechts (animierter Seitenwechsel per View Transitions), über die Markenkarten weiter unten und über den Footer.

## Struktur

```
css/style.css      Grundsystem + Wieds-Design (Farben über <body data-brand>)
css/grander.css    Zusatz-Stylesheet nur für granderwasser.html (body.g)
js/main.js         Navigation, Marken-Switch, Tabs, Karussell, Zähler, Anfrageformular
fonts/             Oswald, Inter, Fraunces – lokal (keine Google-Fonts-Verbindung)
img/               Porträts von Uwe (uwe-*), KI-Symbolbilder (wieds-*, grander-*, mit Higgsfield erstellt);
                   img/logos/ = Kundenlogos der Wieds-Referenzen
```

## Offen vor Go-live

- Impressum: USt-ID, Registereintrag, Berufshaftpflicht (falls vorhanden) – als TODO im HTML markiert. Bildnachweis: Fotograf/in der Porträts ergänzen und klären, ob die Referenzkunden der Logo-Nutzung zugestimmt haben.
- Datenschutz: Hosting-Abschnitt nennt GitHub Pages – bei Umzug auf anderen Hoster anpassen.
- Anfrageformular öffnet aktuell das E-Mail-Programm (mailto). Für Direktversand z. B. Web3Forms anbinden.
