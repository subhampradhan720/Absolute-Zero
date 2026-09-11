## Team

**Absolute Zero** — Smart India Hackathon 2026

# ThermoShelter Pro

**Software-Based Model Development for Area-Specific Shelter Design for Thermal Comfort Maintenance**

Built for Smart India Hackathon 2026 by Team **Absolute Zero**.

## Overview

ThermoShelter Pro is a web-based simulation and design-recommendation tool for **passive** (non-active-heating) shelters in extreme climates — with a focus on high-altitude cold regions like Ladakh, alongside presets for desert, tropical, temperate, polar, and coastal environments.

Given a shelter's geometry, shape, and construction materials, plus local climate conditions, the app simulates a full **24-hour thermal cycle** — predicting indoor temperature, solar heat gain, and heat flow through the building envelope — and recommends an optimized design (shape, wall/roof materials, insulation depth, orientation) for maximum passive thermal comfort.

## Key Features

- **24-hour thermal simulation** — hourly indoor/outdoor temperature curves, solar radiation and absorption profiles, and a conduction/convection/radiation heat-flow breakdown
- **Materials database** — 11 real construction materials (brick, adobe, straw bale, PUF insulation, etc.) with physical properties (conductivity, density, specific heat, reflectivity, emissivity), plus the ability to add custom materials
- **Terrain presets** — 6 climate archetypes (Hot Arid Desert, Cold Alpine, Tropical Humid, Temperate Plains, Polar Arctic, Coastal Marine) with realistic environmental data
- **Shape models** — 6 shelter geometries (gable, dome hybrid, quonset arch, yurt, hexagonal pavilion, A-frame) with aerodynamic and solar-exposure characteristics
- **Comfort scoring** — thermal comfort index based on the ASHRAE 55 / ISO 7730 PMV/PPD standard
- **Design optimizer** — rule-based recommendation engine suggesting the best shape/material/orientation combination for given climate conditions
- **Interactive dashboard** — live charts (Chart.js) for temperature, solar yield, and heat flow; terrain benchmark comparison table
- **CSV export** — download full simulation results for offline analysis or reporting

## Tech Stack

**Backend:** Python 3.x, Flask (REST API)
**Physics/Logic:** Custom thermal solver (conduction/convection/radiation modeling), ASHRAE 55-based comfort model, rule-based optimizer
**Frontend:** HTML5, CSS3, vanilla JavaScript (ES6+), Chart.js for data visualization
**Testing:** Python `unittest`
**Data:** In-memory Python dictionaries (materials, terrains, shapes) — no external database

## Work flow
User (Browser) → Frontend (HTML/CSS/JS) → Flask API → Model Layer (Python) → JSON/CSV response → Charts/UI update

## Project Structure

thermoshelter-pro/
├── app.py # Flask server & API routes
├── model/
│ ├── init.py # Package exports
│ ├── thermal_engine.py # 24-hour thermal simulation engine
│ ├── comfort_model.py # ASHRAE 55 PMV/PPD comfort calculations
│ ├── materials_db.py # Materials, terrains, and shape reference data
│ └── optimizer.py # Design recommendation engine
├── templates/
│ └── index.html # Dashboard UI
├── static/
│ ├── css/style.css
│ └── js/
│ ├── dashboard.js
│ ├── materials.js
│ ├── reports.js
│ └── simulation_studio.js
├── test_app.py # Integration test suite
└── requirements.txt


## Getting Started

```bash
# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py

# App runs at http://127.0.0.1:5000
```

To run tests:
```bash
python -m unittest test_app.py
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Dashboard UI |
| `/api/terrains` | GET | List terrain presets |
| `/api/materials` | GET/POST | List or add construction materials |
| `/api/shapes` | GET | List shelter shape models |
| `/api/simulate` | POST | Run full 24-hour thermal simulation + design recommendation |
| `/api/optimize` | POST | Get design recommendation only |
| `/api/export-csv` | POST | Download simulation results as CSV |

## Team

**Absolute Zero** — Smart India Hackathon 2026
