"""
ThermoShelter Pro - Comprehensive Database of Building Materials,
Terrain Environments, and Shelter Geometries.
"""

MATERIALS = {
    "Brick (Clay / Fireclay)": {
        "id": "brick_clay",
        "category": "Masonry",
        "conductivity": 0.84,       # W/(m·K)
        "density": 1920.0,          # kg/m³
        "specific_heat": 840.0,     # J/(kg·K)
        "default_thickness": 220,   # mm
        "outer_reflectivity": 30.0, # % (solar reflectance)
        "emissivity": 0.90,
        "embodied_carbon": "Medium",
        "description": "Dense clay masonry with high thermal mass, moderating daily peak temperature swings."
    },
    "Wood Shingles + Insulation": {
        "id": "wood_shingles_insul",
        "category": "Composite / Timber",
        "conductivity": 0.052,
        "density": 220.0,
        "specific_heat": 1350.0,
        "default_thickness": 120,
        "outer_reflectivity": 72.5,
        "emissivity": 0.86,
        "embodied_carbon": "Low",
        "description": "High-efficiency insulated timber sandwich with radiant barrier, providing strong thermal resistance."
    },
    "Concrete (Standard / Reinforced)": {
        "id": "concrete_std",
        "category": "Masonry",
        "conductivity": 1.40,
        "density": 2300.0,
        "specific_heat": 880.0,
        "default_thickness": 200,
        "outer_reflectivity": 35.0,
        "emissivity": 0.92,
        "embodied_carbon": "High",
        "description": "Structural cast concrete with heavy thermal inertia, ideal for high diurnal swing regions when insulated."
    },
    "Wood (Timber / Softwood)": {
        "id": "wood_timber",
        "category": "Timber",
        "conductivity": 0.13,
        "density": 550.0,
        "specific_heat": 1600.0,
        "default_thickness": 80,
        "outer_reflectivity": 42.0,
        "emissivity": 0.88,
        "embodied_carbon": "Low",
        "description": "Natural cellular timber providing natural thermal resistance with low environmental footprint."
    },
    "Adobe / Mud (Rammed Earth)": {
        "id": "adobe_mud",
        "category": "Earthen",
        "conductivity": 0.75,
        "density": 1750.0,
        "specific_heat": 1050.0,
        "default_thickness": 300,
        "outer_reflectivity": 45.0,
        "emissivity": 0.90,
        "embodied_carbon": "Ultra-Low",
        "description": "Traditional monolithic earth wall with significant thermal lag of 8-10 hours, optimal for desert climates."
    },
    "Bamboo Composite Panel": {
        "id": "bamboo_comp",
        "category": "Bio-Composite",
        "conductivity": 0.20,
        "density": 700.0,
        "specific_heat": 1400.0,
        "default_thickness": 40,
        "outer_reflectivity": 50.0,
        "emissivity": 0.85,
        "embodied_carbon": "Negative",
        "description": "Rapidly renewable structural panel with good tensile strength and modest insulation."
    },
    "Corrugated Galvanized Steel": {
        "id": "steel_corrugated",
        "category": "Metals",
        "conductivity": 45.0,
        "density": 7850.0,
        "specific_heat": 490.0,
        "default_thickness": 3,
        "outer_reflectivity": 65.0,
        "emissivity": 0.28,
        "embodied_carbon": "High",
        "description": "Lightweight durable metal sheet, rapid heat conductor requiring supplemental insulation for thermal comfort."
    },
    "Polyurethane Sandwich Core (PUF)": {
        "id": "polyurethane_core",
        "category": "Insulation",
        "conductivity": 0.024,
        "density": 42.0,
        "specific_heat": 1400.0,
        "default_thickness": 100,
        "outer_reflectivity": 78.0,
        "emissivity": 0.82,
        "embodied_carbon": "Medium",
        "description": "Closed-cell rigid foam core providing industry-leading R-value per unit thickness."
    },
    "Aerated Autoclaved Concrete (AAC)": {
        "id": "aac_block",
        "category": "Masonry",
        "conductivity": 0.16,
        "density": 550.0,
        "specific_heat": 1000.0,
        "default_thickness": 200,
        "outer_reflectivity": 55.0,
        "emissivity": 0.88,
        "embodied_carbon": "Medium",
        "description": "Porous mineral block combining structural integrity with built-in thermal resistance."
    },
    "Expanded Polystyrene (EPS)": {
        "id": "eps_board",
        "category": "Insulation",
        "conductivity": 0.036,
        "density": 25.0,
        "specific_heat": 1300.0,
        "default_thickness": 80,
        "outer_reflectivity": 70.0,
        "emissivity": 0.85,
        "embodied_carbon": "Medium",
        "description": "Cost-effective expanded foam board providing consistent thermal barrier performance."
    },
    "Straw Bale / Thatched Straw": {
        "id": "straw_thatched",
        "category": "Bio-Composite",
        "conductivity": 0.065,
        "density": 120.0,
        "specific_heat": 1800.0,
        "default_thickness": 300,
        "outer_reflectivity": 52.0,
        "emissivity": 0.90,
        "embodied_carbon": "Negative",
        "description": "High thickness natural agricultural byproduct insulation with exceptional R-value and acoustic absorption."
    }
}

TERRAINS = {
    "Hot & Arid Desert": {
        "id": "arid_desert",
        "climate_zone": "BWh - Subtropical Hot Desert",
        "base_temp": 34.2,          # °C mean
        "diurnal_swing": 16.0,      # °C peak-to-trough amplitude
        "rel_humidity": 22.0,       # %
        "wind_speed": 3.8,          # m/s
        "peak_irradiance": 960.0,   # W/m²
        "altitude": 420,            # meters
        "latitude": 24.8,
        "longitude": 46.7,
        "description": "Severe solar radiation with drastic day/night temperature swings. Demands high thermal inertia, reflective roof barrier, and night ventilation.",
        "optimal_shape": "Rectangular Dome Hybrid",
        "optimal_wall": "Brick (Clay / Fireclay)",
        "optimal_roof": "Wood Shingles + Insulation",
        "optimal_insulation_mm": 120,
        "optimal_orientation": "15.0° North-East Offset",
        "benchmark_efficiency": 94.5
    },
    "Cold Mountainous / Alpine": {
        "id": "cold_mountain",
        "climate_zone": "ET - Alpine Tundra / Sub-zero",
        "base_temp": 4.5,
        "diurnal_swing": 12.0,
        "rel_humidity": 45.0,
        "wind_speed": 6.2,
        "peak_irradiance": 910.0,
        "altitude": 2750,
        "latitude": 34.2,
        "longitude": 77.5,
        "description": "Thin atmospheric air with intense ultraviolet solar gain by day, followed by rapid radiative losses and freezing ambient winds.",
        "optimal_shape": "Quonset / Arch",
        "optimal_wall": "Polyurethane Sandwich Core (PUF)",
        "optimal_roof": "Wood Shingles + Insulation",
        "optimal_insulation_mm": 150,
        "optimal_orientation": "0.0° Due South Facing",
        "benchmark_efficiency": 92.8
    },
    "Tropical Humid (Rainforest / Coastal)": {
        "id": "tropical_humid",
        "climate_zone": "Af - Tropical Rainforest",
        "base_temp": 31.0,
        "diurnal_swing": 6.5,
        "rel_humidity": 84.0,
        "wind_speed": 2.2,
        "peak_irradiance": 740.0,
        "altitude": 85,
        "latitude": 1.3,
        "longitude": 103.8,
        "description": "Uniform high humidity and warm temperatures with low diurnal fluctuation. Prioritizes shading, roof ventilation, and low thermal storage.",
        "optimal_shape": "Hexagonal Pavilion",
        "optimal_wall": "Bamboo Composite Panel",
        "optimal_roof": "Straw Bale / Thatched Straw",
        "optimal_insulation_mm": 90,
        "optimal_orientation": "20.0° North-Northwest",
        "benchmark_efficiency": 89.2
    },
    "Temperate Continental Plains": {
        "id": "temperate_plains",
        "climate_zone": "Cfb - Temperate Oceanic / Continental",
        "base_temp": 22.5,
        "diurnal_swing": 11.0,
        "rel_humidity": 58.0,
        "wind_speed": 3.4,
        "peak_irradiance": 820.0,
        "altitude": 320,
        "latitude": 45.4,
        "longitude": 9.1,
        "description": "Balanced climatic condition with moderate solar flux and seasonal variance. Benefits from balanced thermal mass and insulated envelopment.",
        "optimal_shape": "Rectangular Gable",
        "optimal_wall": "Aerated Autoclaved Concrete (AAC)",
        "optimal_roof": "Wood Shingles + Insulation",
        "optimal_insulation_mm": 100,
        "optimal_orientation": "10.0° South-Southeast",
        "benchmark_efficiency": 93.6
    },
    "Polar Tundra / Arctic": {
        "id": "arctic_polar",
        "climate_zone": "EF - Polar Ice Cap / Tundra",
        "base_temp": -16.0,
        "diurnal_swing": 7.0,
        "rel_humidity": 68.0,
        "wind_speed": 8.5,
        "peak_irradiance": 320.0,
        "altitude": 110,
        "latitude": 68.9,
        "longitude": 33.0,
        "description": "Sustained sub-zero temperatures, high convective surface losses due to polar winds, and low solar zenith angles. Demands ultra-low U-values.",
        "optimal_shape": "Cylindrical Yurt",
        "optimal_wall": "Polyurethane Sandwich Core (PUF)",
        "optimal_roof": "Polyurethane Sandwich Core (PUF)",
        "optimal_insulation_mm": 180,
        "optimal_orientation": "0.0° South Facing",
        "benchmark_efficiency": 96.1
    },
    "Coastal Marine / Island": {
        "id": "coastal_marine",
        "climate_zone": "Csb - Mediterranean Coastal",
        "base_temp": 25.0,
        "diurnal_swing": 7.5,
        "rel_humidity": 76.0,
        "wind_speed": 5.4,
        "peak_irradiance": 860.0,
        "altitude": 25,
        "latitude": 36.7,
        "longitude": -4.4,
        "description": "Marine boundary layer with elevated wind convection and saline humidity. Benefits from curved aerodynamic profiles and moisture-resistant surfaces.",
        "optimal_shape": "Rectangular Dome Hybrid",
        "optimal_wall": "Aerated Autoclaved Concrete (AAC)",
        "optimal_roof": "Wood Shingles + Insulation",
        "optimal_insulation_mm": 110,
        "optimal_orientation": "12.0° North-East Offset",
        "benchmark_efficiency": 91.4
    }
}

SHAPE_MODELS = {
    "Rectangular Gable": {
        "name": "Rectangular Gable",
        "area_multiplier": 1.18,     # Roof area multiplier relative to footprint
        "volume_factor": 1.15,       # Internal air volume multiplier
        "wind_drag_coeff": 1.05,     # Aerodynamic drag/convection factor
        "solar_exposure_factor": 1.0,
        "description": "Classic pitched roof shelter. Versatile, simple framing, standard thermal performance."
    },
    "Rectangular Dome Hybrid": {
        "name": "Rectangular Dome Hybrid",
        "area_multiplier": 1.12,
        "volume_factor": 1.20,
        "wind_drag_coeff": 0.78,     # Reduced wind drag and surface heat scrubbing
        "solar_exposure_factor": 0.91,# Smooth curve deflects direct midday solar zenith
        "description": "Aerodynamically contoured curved roof. Minimizes turbulent convection losses and high-noon solar absorption."
    },
    "Quonset / Arch": {
        "name": "Quonset / Arch",
        "area_multiplier": 1.08,
        "volume_factor": 1.10,
        "wind_drag_coeff": 0.72,
        "solar_exposure_factor": 0.88,
        "description": "Semi-circular arch envelope with continuous roof-wall transitions, minimizing thermal bridging."
    },
    "Cylindrical Yurt": {
        "name": "Cylindrical Yurt",
        "area_multiplier": 1.05,
        "volume_factor": 1.08,
        "wind_drag_coeff": 0.65,
        "solar_exposure_factor": 0.82,
        "description": "Circular geometry providing the minimal surface-area-to-volume (A/V) ratio, optimal for heat retention in cold winds."
    },
    "Hexagonal Pavilion": {
        "name": "Hexagonal Pavilion",
        "area_multiplier": 1.15,
        "volume_factor": 1.16,
        "wind_drag_coeff": 0.85,
        "solar_exposure_factor": 0.94,
        "description": "Multi-faceted perimeter promoting natural ventilation pathways, suitable for warm and humid zones."
    },
    "A-Frame / Steep Pitch": {
        "name": "A-Frame / Steep Pitch",
        "area_multiplier": 1.35,
        "volume_factor": 0.92,
        "wind_drag_coeff": 0.95,
        "solar_exposure_factor": 1.10,
        "description": "Steeply sloping surfaces with strong vertical thermal stratification and fast precipitation runoff."
    }
}
