/**
 * ThermoShelter Pro - Materials Database Controller
 * Search, view technical specs, and add custom construction materials.
 */

let ALL_MATERIALS = {};

document.addEventListener("DOMContentLoaded", () => {
  initMaterialModal();
  initMaterialSearch();
});

window.renderMaterialsDatabase = async function() {
  await fetchAndDisplayMaterials();
};

async function fetchAndDisplayMaterials() {
  try {
    const res = await fetch("/api/materials");
    const data = await res.json();
    if (!data.success) return;

    ALL_MATERIALS = data.materials;
    displayMaterialsGrid(ALL_MATERIALS);
  } catch (err) {
    console.error("Failed to load materials database:", err);
  }
}

function displayMaterialsGrid(materialsDict) {
  const grid = document.getElementById("materialsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  for (const [name, mat] of Object.entries(materialsDict)) {
    const rVal = ((mat.default_thickness / 1000.0) / mat.conductivity + 0.17).toFixed(2);

    const card = document.createElement("div");
    card.className = "material-card";
    card.innerHTML = `
      <div class="mat-card-header">
        <h4 class="mat-title">${name}</h4>
        <span class="mat-category-badge">${mat.category}</span>
      </div>
      <div class="mat-props-grid">
        <div class="mat-prop-item">
          <span class="mat-prop-label">Conductivity (k)</span>
          <span class="mat-prop-val">${mat.conductivity} W/mK</span>
        </div>
        <div class="mat-prop-item">
          <span class="mat-prop-label">R-Value (@${mat.default_thickness}mm)</span>
          <span class="mat-prop-val" style="color:#10b981;">${rVal} m²K/W</span>
        </div>
        <div class="mat-prop-item">
          <span class="mat-prop-label">Density</span>
          <span class="mat-prop-val">${mat.density} kg/m³</span>
        </div>
        <div class="mat-prop-item">
          <span class="mat-prop-label">Specific Heat</span>
          <span class="mat-prop-val">${mat.specific_heat} J/kgK</span>
        </div>
        <div class="mat-prop-item">
          <span class="mat-prop-label">Solar Reflectivity</span>
          <span class="mat-prop-val">${mat.outer_reflectivity}%</span>
        </div>
        <div class="mat-prop-item">
          <span class="mat-prop-label">Embodied Carbon</span>
          <span class="mat-prop-val" style="color:#93c5fd;">${mat.embodied_carbon}</span>
        </div>
      </div>
      <p class="mat-desc">${mat.description}</p>
    `;
    grid.appendChild(card);
  }
}

function initMaterialSearch() {
  const searchInput = document.getElementById("materialSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = {};
      for (const [name, mat] of Object.entries(ALL_MATERIALS)) {
        if (name.toLowerCase().includes(q) || mat.category.toLowerCase().includes(q) || mat.description.toLowerCase().includes(q)) {
          filtered[name] = mat;
        }
      }
      displayMaterialsGrid(filtered);
    });
  }
}

function initMaterialModal() {
  const modal = document.getElementById("addMaterialModal");
  const openBtn = document.getElementById("openAddMaterialModalBtn");
  const closeBtn = document.getElementById("closeAddMaterialModalBtn");
  const saveBtn = document.getElementById("saveCustomMaterialBtn");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => modal.classList.add("active"));
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));

    saveBtn.addEventListener("click", async () => {
      const name = document.getElementById("newMatName").value.trim();
      if (!name) {
        alert("Please enter a valid material name.");
        return;
      }

      const payload = {
        name: name,
        category: document.getElementById("newMatCategory").value,
        conductivity: parseFloat(document.getElementById("newMatConductivity").value) || 0.04,
        thickness: parseInt(document.getElementById("newMatThickness").value) || 100,
        density: parseFloat(document.getElementById("newMatDensity").value) || 60,
        outer_reflectivity: parseFloat(document.getElementById("newMatReflectivity").value) || 60,
        specific_heat: parseFloat(document.getElementById("newMatSpecificHeat").value) || 1400
      };

      try {
        const res = await fetch("/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          modal.classList.remove("active");
          // Add to dropdowns
          const wallSelect = document.getElementById("wallMaterialSelect");
          const roofSelect = document.getElementById("roofMaterialSelect");
          const opt1 = new Option(name, name);
          const opt2 = new Option(name, name);
          wallSelect.add(opt1);
          roofSelect.add(opt2);

          // Reset inputs
          document.getElementById("newMatName").value = "";
          window.logAudit(`[MATERIAL] Custom material '${name}' successfully registered.`);
          await fetchAndDisplayMaterials();
        } else {
          alert("Error saving material: " + data.error);
        }
      } catch (err) {
        console.error("Save material error:", err);
      }
    });
  }
}
