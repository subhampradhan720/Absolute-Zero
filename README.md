# Absolute-Zero
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

## Project Structure
