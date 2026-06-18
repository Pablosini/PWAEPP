# EPP na Jasną Górę

Statyczna aplikacja PWA dla Ełckiej Pielgrzymki Pieszej 2026.

## Uruchomienie lokalne

```bash
python3 -m http.server 4173
```

Potem otwórz `http://localhost:4173/`.

## Sprawdzenie przed publikacją

```bash
python3 scripts/validate.py
```

Skrypt sprawdza wymagane pliki PWA, ikony, mapy trasy, wersję cache, manifest i kilka regresji typowych dla tej aplikacji.

## Pliki produkcyjne

Do publikacji potrzebne są:

- `index.html`
- `manifest.json`
- `sw.js`
- `404.html`
- `icon-192.png`
- `icon-512.png`
- `logo.png`
- `trasa/dzien-01.png` do `trasa/dzien-15.png`

Pliki robocze, dokumenty i paczki źródłowe są ignorowane przez `.gitignore`.
