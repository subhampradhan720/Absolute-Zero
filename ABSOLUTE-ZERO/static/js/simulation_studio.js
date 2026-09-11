/**
 * ThermoShelter Pro - Simulation Studio
 * Multi-terrain sensitivity matrix & solar diurnal sweep visualization.
 */

let studioSolarChart = null;

window.renderStudioCharts = async function() {
  populateTerrainBenchmark();
  renderSolarSweepChart();
};

async function populateTerrainBenchmark() {
  const tbody = document.getElementById("terrainBenchmarkBody");
  if (!tbody) return;

  tbody.innerHTML = "<tr><td colspan='8' style='text-align:center; color:var(--text-dim);'>Evaluating terrain matrix...</td></tr>";

  try {
    const res = await fetch("/api/terrains");
    const data = await res.json();
    if (!data.success) return;

    const terrains = data.terrains;
    tbody.innerHTML = "";

    for (const [tName, tInfo] of Object.entries(terrains)) {
      // Simulate quick performance for this terrain
      const extPeak = tInfo.base_temp + (tInfo.diurnal_swing / 2.0);
      const estInside = (tInfo.base_temp * 0.75 + 6.0).toFixed(1);
      const damping = Math.min(88, Math.max(55, Math.round(100 - (tInfo.diurnal_swing * 2.2))));
      const solarYield = Math.round(tInfo.peak_irradiance * 0.58);
      
      const comfortScore = (tInfo.benchmark_efficiency / 100 * 0.95).toFixed(2);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong style="color:#ffffff;">${tName}</strong></td>
        <td><span style="color:#94a3b8; font-size:0.75rem;">${tInfo.climate_zone}</span></td>
        <td style="color:#f97316;">${extPeak.toFixed(1)}°C</td>
        <td style="color:#38bdf8; font-weight:600;">${estInside}°C</td>
        <td><span style="color:#10b981; font-weight:600;">${damping}%</span></td>
        <td>${solarYield} W/m²</td>
        <td><span style="background:rgba(16,185,129,0.15); color:#10b981; padding:2px 8px; border-radius:4px; font-weight:600;">${comfortScore}</span></td>
        <td style="color:#cbd5e1;">${tInfo.optimal_shape}</td>
      `;
      tbody.appendChild(row);
    }
  } catch (err) {
    console.error("Failed to populate benchmark table:", err);
  }
}

function renderSolarSweepChart() {
  const ctx = document.getElementById("studioSolarChart");
  if (!ctx) return;

  const sim = window.LATEST_SIMULATION;
  if (!sim) return;

  if (studioSolarChart) {
    studioSolarChart.destroy();
  }

  studioSolarChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: sim.full_hours,
      datasets: [
        {
          label: "Incident Solar Flux",
          data: sim.solar_radiation_curve,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.08)",
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: "Effective Solar Yield (Absorbed)",
          data: sim.solar_yield_curve,
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.15)",
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: { color: "#94a3b8", boxWidth: 12, font: { size: 10 } }
        },
        tooltip: {
          backgroundColor: "#162035",
          titleColor: "#ffffff",
          bodyColor: "#cbd5e1",
          borderColor: "#2a3d60",
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} W/m²`
          }
        }
      },
      scales: {
        x: {
          grid: { color: "#162238" },
          ticks: { color: "#94a3b8", maxTicksLimit: 8, font: { size: 10 } }
        },
        y: {
          grid: { color: "#162238" },
          ticks: { color: "#94a3b8", callback: v => v + " W/m²", font: { size: 10 } }
        }
      }
    }
  });
}
