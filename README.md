# Uwe Fläschel · Handelsvertretung

Statische Website, kein Build nötig. Lokal ansehen:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | **Wieds** (Hauptseite) – Betriebshygiene, Kühlschmierstoffe, Reinigung, Fahrzeugpflege |
| `granderwasser.html` | **Granderwasser** – eigenes Layout & Design (Serifenschrift, Wellen, Tiefblau/Sand) |
| `impressum.html`, `datenschutz.html` | Rechtstexte (gemeinsam für beide Marken) |

Zwischen den Marken wechselt man über den **Marken-Switch** oben rechts (animierter Seitenwechsel per View Transitions), über die Markenkarten weiter unten und über den Footer.

## Struktur

```
css/style.css      Grundsystem + Wieds-Design (Farben über <body data-brand>)
css/grander.css    Zusatz-Stylesheet nur für granderwasser.html (body.g)
js/main.js         Navigation, Marken-Switch, Tabs, Karussell, Zähler, Anfrageformular
fonts/             Oswald, Inter, Fraunces – lokal (keine Google-Fonts-Verbindung)
img/               Fotos; img/logos/ = Kundenlogos der Wieds-Referenzen
```

## Offen vor Go-live

- Industrie-/Wasserbilder (`img/wieds-*.jpg`, `img/grander-*.jpg`) sind noch Ausschnitte aus OnePage-Screenshots → durch Originale oder neue Bilder ersetzen (gleiche Dateinamen).
- Impressum: USt-ID, Registereintrag, Berufshaftpflicht, Bildnachweis (falls vorhanden) – als TODO im HTML markiert.
- Datenschutz: Hoster konkret benennen (TODO im HTML).
- Anfrageformular öffnet aktuell das E-Mail-Programm (mailto). Für Direktversand z. B. Web3Forms anbinden.
