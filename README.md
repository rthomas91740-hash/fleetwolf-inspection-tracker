# Fleet Wolf Inspection Tracker

A MyGeotab add-in that tracks every asset inspection (standard and the new beta Inspections) and every defect, with a calculator for how many were done by day, week, month and year.

## What it shows
- Totals: inspections done, standard vs new (beta), defects reported, open, repaired, not safe to operate, assets inspected.
- Calculator: count inspections, defects reported, defects repaired, or inspections with defects; group by day, week, month or year; split by version, inspection type or driver. Shows averages per day, weekday, week and month, the yearly pace, and the busiest period.
- By driver: inspections, per week, pre-trip, post-trip, beta, defects found, open, unsafe, assets, last inspection. Driver is also a filter and a calculator split.
- Inspection types (pre-trip, post-trip, in-trip), checklists, defect types with their category, and the assets with the most defects.
- Full lists of defects and inspections, and a CSV export.

## Old vs new (beta) inspections
Geotab hasn't published how beta inspections are marked in the API. The add-in reads every `DVIRLog` and marks a checklist as beta if its name contains "beta" or the record carries template-style fields. Anyone can click a checklist's tag to switch it; the choice is saved in that browser for that database. Check this against a database with real beta inspections.

## Install
1. Create a public GitHub repo named `fleetwolf-inspection-tracker`, add `index.html`, and turn on GitHub Pages (main branch, root).
2. In MyGeotab: Administration → System → System Settings → Add-Ins → New Add-In, paste `addin-config.json`, save, and refresh.

## Local preview
`node demo/preview-server.js`, then open http://127.0.0.1:8771/?demo=1 (made-up data only).
