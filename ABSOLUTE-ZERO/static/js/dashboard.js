/**
 * ThermoShelter Pro - Main Dashboard Controller
 * Connects UI inputs with Flask backend API, manages Chart.js graphs,
 * and handles terrain switching and auto-optimization.
 */

// Global Chart Instances
let tempChart = null;
let heatChart = null;

// Initial state and default baseline (matching UI reference image)
const DEFAULT_BASELINE = {
  terrain_name: "Hot & Arid Desert",
  latitude: -1.2921,
  longitude: 36.8219,
  altitude: 1795,
  climate_zone: "Composite",
  wall_material: "Brick (Clay / Fireclay)",
  roof_material: "Wood Shingles + Insulation",
  conductivity: 0.84,
  thickness: 220,
  outer_reflectivity: 72.5,
  shape_model: "Rectangular Gable",
  length: 6.0,
  width: 4.5,
  height: 3.2,
  pitch: 25.0,
  ambient_temp: 34.2,
  rel_humidity: 62,
  wind_speed: 3.2,
  solar_irradiance: 850
};

// Terrain presets dictionary
let TERRAINS_DATA = {};

document.addEventListener("DOMContentLoaded", async () => {
  initNavTabs();
  initModals();
  initCharts();
  await loadTerrainsData();
  setupEventListeners();

  // Run initial simulation on load
  runSimulation();
});

// Fetch terrain presets from backend
async function loadTerrainsData() {
  try {
    const res = await fetch("/api/terrains");
    const data = await res.json();
    if (data.success) {
      TERRAINS_DATA = data.terrains;
    }
  } catch (err) {
    console.warn("Could not load terrains API:", err);
  }
}

// ================= Tab Navigation =================
function initNavTabs() {
  const tabBtns = document.querySelectorAll(".nav-tab-btn");
  const tabViews = document.querySelectorAll(".tab-view");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      tabBtns.forEach(b => b.classList.remove("active"));
      tabViews.forEach(v => v.classList.remove("active"));

      btn.classList.add("active");
      const view = document.getElementById(`tab-${target}`);
      if (view) {
        view.classList.add("active");
        if (target === "studio" && window.renderStudioCharts) {
          window.renderStudioCharts();
        } else if (target === "materials" && window.renderMaterialsDatabase) {
          window.renderMaterialsDatabase();
        }
      }
    });
  });
}

// ================= Modals =================
function initModals() {
  const settingsModal = document.getElementById("settingsModal");
  const openSettingsBtn = document.getElementById("openSettingsBtn");
  const closeSettingsBtn = document.getElementById("closeSettingsModalBtn");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");

  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener("click", () => settingsModal.classList.add("active"));
    closeSettingsBtn.addEventListener("click", () => settingsModal.classList.remove("active"));
    saveSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.remove("active");
      logAudit("[CONFIG] Solver integration step and comfort benchmark updated.");
      runSimulation();
    });
  }
}

// ================= Chart.js Initializations =================
function initCharts() {
  // Chart 1: Temperature Profile (24h)
  const ctxTemp = document.getElementById("tempProfileChart").getContext("2d");
  tempChart = new Chart(ctxTemp, {
    type: "line",
    data: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
      datasets: [
        {
          label: "Ambient",
          data: [18.5, 20.2, 27.4, 34.2, 41.0, 28.5, 20.0],
          borderColor: "#06b6d4",
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.4
        },
        {
          label: "Inside",
          data: [27.2, 26.5, 26.8, 28.4, 33.8, 30.2, 27.5],
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.06)",
          fill: true,
          borderWidth: 2.8,
          pointRadius: [0, 0, 0, 5, 0, 0, 0],
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#f97316",
          pointBorderWidth: 2.5,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#162035",
          titleColor: "#ffffff",
          bodyColor: "#cbd5e1",
          borderColor: "#2a3d60",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: function(ctx) {
              return ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}°C`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: "#162238", drawBorder: false },
          ticks: { color: "#94a3b8", font: { size: 11 } }
        },
        y: {
          min: 15,
          max: 45,
          grid: { color: "#162238", drawBorder: false },
          ticks: {
            color: "#94a3b8",
            stepSize: 10,
            callback: value => value + "°C",
            font: { size: 11 }
          }
        }
      }
    }
  });

  // Chart 2: Heat Flow Analysis
  const ctxHeat = document.getElementById("heatFlowChart").getContext("2d");
  heatChart = new Chart(ctxHeat, {
    type: "bar",
    data: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
      datasets: [
        {
          label: "Conduction",
          data: [5.7, 5.2, 8.8, 36.1, 26.9, 10.3, 5.7],
          backgroundColor: "#f97316",
          stack: "heat",
          borderRadius: 2
        },
        {
          label: "Convection",
          data: [6.0, 4.8, 10.4, 18.2, 14.5, 7.2, 6.0],
          backgroundColor: "#06b6d4",
          stack: "heat",
          borderRadius: 2
        },
        {
          label: "Radiation",
          data: [-7.8, -6.5, -12.4, -34.7, -24.8, -9.8, -7.8],
          backgroundColor: "#f59e0b",
          stack: "heat",
          borderRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#162035",
          titleColor: "#ffffff",
          bodyColor: "#cbd5e1",
          borderColor: "#2a3d60",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed.y;
              const sign = val > 0 ? "+" : "";
              return ` ${ctx.dataset.label}: ${sign}${val.toFixed(1)} W`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { color: "#162238", drawBorder: false },
          ticks: { color: "#94a3b8", font: { size: 11 } }
        },
        y: {
          stacked: true,
          min: -25,
          max: 45,
          grid: { color: "#162238", drawBorder: false },
          ticks: {
            color: "#94a3b8",
            stepSize: 20,
            callback: value => (value > 0 ? `+${value}W` : `${value}W`),
            font: { size: 11 }
          }
        }
      }
    }
  });
}

// ================= Setup Event Listeners =================
function setupEventListeners() {
  document.getElementById("runSimBtn").addEventListener("click", () => {
    runSimulation();
  });

  document.getElementById("optimizeBtn").addEventListener("click", () => {
    autoOptimizeDesign();
  });

  document.getElementById("resetDefaultsBtn").addEventListener("click", () => {
    resetToDefaults();
  });

  // Terrain / Environment Dropdown Change (Updates defaults for that terrain)
  document.getElementById("terrainSelect").addEventListener("change", (e) => {
    const terrainName = e.target.value;
    const tData = TERRAINS_DATA[terrainName];
    if (tData) {
      document.getElementById("ambientTempInput").value = tData.base_temp;
      document.getElementById("humidityInput").value = tData.rel_humidity;
      document.getElementById("windSpeedInput").value = tData.wind_speed;
      document.getElementById("solarIrradianceInput").value = tData.peak_irradiance;
      document.getElementById("altitudeInput").value = tData.altitude;
      document.getElementById("latitudeInput").value = tData.latitude;
      document.getElementById("longitudeInput").value = tData.longitude;

      logAudit(`[TERRAIN] Switched environment to "${terrainName}" (${tData.climate_zone}).`);
      runSimulation();
    }
  });

  // Material dropdowns dynamic update of conductivity & thickness
  document.getElementById("wallMaterialSelect").addEventListener("change", (e) => {
    const mat = e.target.value;
    if (mat.includes("Concrete")) {
      document.getElementById("conductivityInput").value = 1.40;
      document.getElementById("thicknessInput").value = 200;
    } else if (mat.includes("Brick")) {
      document.getElementById("conductivityInput").value = 0.84;
      document.getElementById("thicknessInput").value = 220;
    } else if (mat.includes("Polyurethane")) {
      document.getElementById("conductivityInput").value = 0.024;
      document.getElementById("thicknessInput").value = 100;
    } else if (mat.includes("Wood")) {
      document.getElementById("conductivityInput").value = 0.13;
      document.getElementById("thicknessInput").value = 80;
    } else if (mat.includes("Adobe") || mat.includes("Mud")) {
      document.getElementById("conductivityInput").value = 0.75;
      document.getElementById("thicknessInput").value = 300;
    } else if (mat.includes("Bamboo")) {
      document.getElementById("conductivityInput").value = 0.20;
      document.getElementById("thicknessInput").value = 40;
    }
    runSimulation();
  });
}

// Collect all form parameters
function getSimulationParams() {
  return {
    terrain_name: document.getElementById("terrainSelect").value,
    latitude: parseFloat(document.getElementById("latitudeInput").value) || 0,
    longitude: parseFloat(document.getElementById("longitudeInput").value) || 0,
    altitude: parseFloat(document.getElementById("altitudeInput").value) || 0,
    climate_zone: document.getElementById("climateZoneSelect").value,
    wall_material: document.getElementById("wallMaterialSelect").value,
    roof_material: document.getElementById("roofMaterialSelect").value,
    conductivity: parseFloat(document.getElementById("conductivityInput").value) || 0.84,
    thickness: parseFloat(document.getElementById("thicknessInput").value) || 220,
    outer_reflectivity: parseFloat(document.getElementById("reflectivityInput").value) || 72.5,
    shape_model: document.getElementById("shapeModelSelect").value,
    length: parseFloat(document.getElementById("lengthInput").value) || 6.0,
    width: parseFloat(document.getElementById("widthInput").value) || 4.5,
    height: parseFloat(document.getElementById("heightInput").value) || 3.2,
    pitch: parseFloat(document.getElementById("pitchInput").value) || 25.0,
    ambient_temp: parseFloat(document.getElementById("ambientTempInput").value) || 34.2,
    rel_humidity: parseFloat(document.getElementById("humidityInput").value) || 62.0,
    wind_speed: parseFloat(document.getElementById("windSpeedInput").value) || 3.2,
    solar_irradiance: parseFloat(document.getElementById("solarIrradianceInput").value) || 850.0
  };
}

// ================= Execute Simulation =================
async function runSimulation() {
  const params = getSimulationParams();
  logAudit(`[SOLVE] Executing thermal simulation for terrain "${params.terrain_name}"...`);

  try {
    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });

    const data = await res.json();
    if (!data.success) {
      alert("Simulation error: " + (data.error || "Unknown"));
      return;
    }

    const sim = data.simulation;
    const rec = data.recommended_design;

    // 1. Update 4 KPI Cards
    document.getElementById("kpiInsideTemp").textContent = `${sim.summary.inside_temp_display}°C`;
    document.getElementById("kpiInsideSubtext").textContent = `Dampened (Peak ambient ${sim.summary.ambient_peak}°C)`;

    document.getElementById("kpiSolarYield").textContent = `${sim.summary.solar_energy_yield} W/m²`;

    document.getElementById("kpiHeatFlow").textContent = `${sim.summary.heat_flow_rate} W`;

    document.getElementById("kpiComfortIndex").textContent = `${sim.summary.comfort_index.toFixed(2)}`;
    document.getElementById("kpiComfortSubtext").textContent = sim.summary.comfort_label;

    // 2. Update Temperature Profile Chart
    if (tempChart) {
      tempChart.data.labels = sim.time_labels;
      // Step sample every 4 hours for smooth 7-point match
      const stepIndices = [0, 4, 8, 12, 16, 20, 24];
      tempChart.data.datasets[0].data = stepIndices.map(i => sim.ambient_temp_curve[i]);
      tempChart.data.datasets[1].data = stepIndices.map(i => sim.inside_temp_curve[i]);
      tempChart.update();
    }

    // 3. Update Heat Flow Analysis Chart
    if (heatChart) {
      heatChart.data.labels = sim.heat_flow_breakdown.hours;
      heatChart.data.datasets[0].data = sim.heat_flow_breakdown.conduction;
      heatChart.data.datasets[1].data = sim.heat_flow_breakdown.convection;
      heatChart.data.datasets[2].data = sim.heat_flow_breakdown.radiation;
      heatChart.update();
    }

    // 4. Update Recommended Thermal Design
    if (rec) {
      document.getElementById("recShapeModel").textContent = rec.optimal_shape;
      document.getElementById("recWallLayer").textContent = rec.recommended_wall;
      document.getElementById("recRoofLayer").textContent = rec.recommended_roof;
      document.getElementById("recInsulation").textContent = rec.insulation_thickness;
      document.getElementById("recOrientation").textContent = rec.optimal_orientation;
      document.getElementById("recEfficiencyScore").textContent = `${rec.system_thermal_efficiency}% (${rec.efficiency_class})`;
      document.getElementById("recEfficiencyBar").style.width = `${rec.system_thermal_efficiency}%`;
    }

    // 5. Update Envelope Specs in Studio tab
    if (sim.envelope_specs) {
      const e = sim.envelope_specs;
      document.getElementById("specFloorArea").textContent = `${e.floor_area_m2} m²`;
      document.getElementById("specWallArea").textContent = `${e.wall_area_m2} m²`;
      document.getElementById("specRoofArea").textContent = `${e.roof_area_m2} m²`;
      document.getElementById("specVolume").textContent = `${e.interior_volume_m3} m³`;
      document.getElementById("specUWall").textContent = `${e.u_wall} W/m²K`;
      document.getElementById("specURoof").textContent = `${e.u_roof} W/m²K`;
      document.getElementById("specThermalCap").textContent = `${e.thermal_capacitance_mj} MJ/K`;
    }

    // Store latest simulation globally for studio and reports
    window.LATEST_SIMULATION = sim;
    window.LATEST_PARAMS = params;

    logAudit(`[SUCCESS] Solution converged. Peak inside ${sim.summary.inside_temp_display}°C, solar yield ${sim.summary.solar_energy_yield} W/m².`);

  } catch (err) {
    console.error("Simulation request failed:", err);
    logAudit(`[ERROR] Solver exception: ${err.message}`);
  }
}

// ================= Auto-Optimize Design =================
async function autoOptimizeDesign() {
  const params = getSimulationParams();
  logAudit(`[OPTIMIZE] Evaluating optimal envelope geometry and composite materials for ${params.terrain_name}...`);

  try {
    const res = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        terrain: params.terrain_name,
        ambient_temp: params.ambient_temp,
        solar_irradiance: params.solar_irradiance,
        wind_speed: params.wind_speed,
        rel_humidity: params.rel_humidity
      })
    });

    const data = await res.json();
    if (data.success && data.recommendation) {
      const rec = data.recommendation;
      // Apply recommended shape
      const shapeSelect = document.getElementById("shapeModelSelect");
      for (let i = 0; i < shapeSelect.options.length; i++) {
        if (shapeSelect.options[i].value === rec.optimal_shape) {
          shapeSelect.selectedIndex = i;
          break;
        }
      }

      // If recommended insulation thickness exists
      if (rec.insulation_value_mm) {
        document.getElementById("thicknessInput").value = rec.insulation_value_mm;
      }

      logAudit(`[OPTIMIZE] Recommended design applied: ${rec.optimal_shape}, ${rec.recommended_wall}.`);
      runSimulation();
    }
  } catch (err) {
    console.error("Optimization failed:", err);
  }
}

// ================= Reset to Defaults =================
function resetToDefaults() {
  document.getElementById("terrainSelect").value = DEFAULT_BASELINE.terrain_name;
  document.getElementById("latitudeInput").value = DEFAULT_BASELINE.latitude;
  document.getElementById("longitudeInput").value = DEFAULT_BASELINE.longitude;
  document.getElementById("altitudeInput").value = DEFAULT_BASELINE.altitude;
  document.getElementById("climateZoneSelect").value = DEFAULT_BASELINE.climate_zone;
  document.getElementById("wallMaterialSelect").value = DEFAULT_BASELINE.wall_material;
  document.getElementById("roofMaterialSelect").value = DEFAULT_BASELINE.roof_material;
  document.getElementById("conductivityInput").value = DEFAULT_BASELINE.conductivity;
  document.getElementById("thicknessInput").value = DEFAULT_BASELINE.thickness;
  document.getElementById("reflectivityInput").value = DEFAULT_BASELINE.outer_reflectivity;
  document.getElementById("shapeModelSelect").value = DEFAULT_BASELINE.shape_model;
  document.getElementById("lengthInput").value = DEFAULT_BASELINE.length;
  document.getElementById("widthInput").value = DEFAULT_BASELINE.width;
  document.getElementById("heightInput").value = DEFAULT_BASELINE.height;
  document.getElementById("pitchInput").value = DEFAULT_BASELINE.pitch;
  document.getElementById("ambientTempInput").value = DEFAULT_BASELINE.ambient_temp;
  document.getElementById("humidityInput").value = DEFAULT_BASELINE.rel_humidity;
  document.getElementById("windSpeedInput").value = DEFAULT_BASELINE.wind_speed;
  document.getElementById("solarIrradianceInput").value = DEFAULT_BASELINE.solar_irradiance;

  logAudit("[RESET] Form parameters reset to benchmark baseline.");
  runSimulation();
}

// Audit logger helper
function logAudit(message) {
  const logContainer = document.getElementById("simulationAuditLogs");
  if (logContainer) {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    entry.textContent = `[${time}] ${message}`;
    logContainer.prepend(entry);
  }
}
window.logAudit = logAudit;
