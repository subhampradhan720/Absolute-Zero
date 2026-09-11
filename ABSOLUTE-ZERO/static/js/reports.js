/**
 * ThermoShelter Pro - Reports & Logs Controller
 * CSV Report generation, thermal summary audit trail, and export triggers.
 */

document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("downloadCsvBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => exportSimulationCsv());
  }
});

async function exportSimulationCsv() {
  const params = window.LATEST_PARAMS || {};
  window.logAudit("[EXPORT] Preparing comprehensive simulation CSV report...");

  try {
    const res = await fetch("/api/export-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      alert("Failed to export report CSV.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ThermoShelter_Report_${(params.terrain_name || "Simulation").replace(/\s+/g, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    window.logAudit("[EXPORT] CSV simulation report downloaded successfully.");
  } catch (err) {
    console.error("Export CSV error:", err);
    window.logAudit(`[ERROR] Export failed: ${err.message}`);
  }
}
