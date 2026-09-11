"""
ThermoShelter Pro - Flask Web Application
Backend server providing simulation, material management, optimization,
and reporting endpoints for passive shelter thermal analysis.
"""
from flask import Flask, render_template, request, jsonify, Response
import json
import csv
import io
from model.thermal_engine import ThermalEngine
from model.materials_db import MATERIALS, TERRAINS, SHAPE_MODELS
from model.optimizer import optimize_shelter_design

app = Flask(__name__)

@app.route("/")
def index():  #render_template
    return render_template(
        "index.html",
        terrains=TERRAINS,
        materials=MATERIALS,
        shapes=SHAPE_MODELS
    )

@app.route("/api/terrains", methods=["GET"])
def get_terrains():    #jsonify
    return jsonify({"success": True, "terrains": TERRAINS})

@app.route("/api/materials", methods=["GET", "POST"])
def manage_materials():
    if request.method == "POST":
        data = request.get_json() or {}
        name = data.get("name", "").strip()
        if not name:
            return jsonify({"success": False, "error": "Material name is required"}), 400
        
        MATERIALS[name] = {
            "id": name.lower().replace(" ", "_"),
            "category": data.get("category", "Custom"),
            "conductivity": float(data.get("conductivity", 0.5)),
            "density": float(data.get("density", 1500.0)),
            "specific_heat": float(data.get("specific_heat", 900.0)),
            "default_thickness": int(data.get("thickness", 150)),
            "outer_reflectivity": float(data.get("outer_reflectivity", 40.0)),
            "emissivity": float(data.get("emissivity", 0.90)),
            "embodied_carbon": data.get("embodied_carbon", "Medium"),
            "description": data.get("description", "User-defined custom construction material.")
        }
        return jsonify({"success": True, "message": f"Material '{name}' added successfully."})
    
    return jsonify({"success": True, "materials": MATERIALS})

@app.route("/api/shapes", methods=["GET"])
def get_shapes():
    return jsonify({"success": True, "shapes": SHAPE_MODELS})

@app.route("/api/simulate", methods=["POST"])
def simulate():
    try:
        params = request.get_json() or {}
        engine = ThermalEngine(params)
        results = engine.simulate()
        
        # Also run optimizer for the current environmental conditions
        terrain_name = params.get("terrain_name", "Hot & Arid Desert")
        ambient_temp = float(params.get("ambient_temp", 34.2))
        solar_irradiance = float(params.get("solar_irradiance", 850.0))
        wind_speed = float(params.get("wind_speed", 3.2))
        rel_humidity = float(params.get("rel_humidity", 62.0))
        
        optimal_design = optimize_shelter_design(
            terrain_name=terrain_name,
            ambient_temp=ambient_temp,
            solar_irradiance=solar_irradiance,
            wind_speed=wind_speed,
            rel_humidity=rel_humidity
        )
        
        return jsonify({
            "success": True,
            "simulation": results,
            "recommended_design": optimal_design
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/optimize", methods=["POST"])
def optimize():
    try:
        data = request.get_json() or {}
        terrain = data.get("terrain", "Hot & Arid Desert")
        ambient_temp = float(data.get("ambient_temp", 34.2))
        solar_irradiance = float(data.get("solar_irradiance", 850.0))
        wind_speed = float(data.get("wind_speed", 3.2))
        rel_humidity = float(data.get("rel_humidity", 62.0))

        recommendation = optimize_shelter_design(
            terrain_name=terrain,
            ambient_temp=ambient_temp,
            solar_irradiance=solar_irradiance,
            wind_speed=wind_speed,
            rel_humidity=rel_humidity
        )
        return jsonify({"success": True, "recommendation": recommendation})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/export-csv", methods=["POST"])
def export_csv():
    try:
        params = request.get_json() or {}
        engine = ThermalEngine(params)
        sim = engine.simulate()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Hour", "Ambient Temp (°C)", "Simulated Inside Temp (°C)", "Solar Radiation (W/m²)", "Solar Yield (W/m²)"])
        
        hours = sim["full_hours"]
        ambient = sim["ambient_temp_curve"]
        inside = sim["inside_temp_curve"]
        solar_rad = sim["solar_radiation_curve"]
        solar_yield = sim["solar_yield_curve"]

        for i in range(len(hours)):
            writer.writerow([
                hours[i],
                ambient[i],
                inside[i],
                solar_rad[i],
                solar_yield[i]
            ])

        writer.writerow([])
        writer.writerow(["--- Heat Flow Analysis Breakdown ---"])
        writer.writerow(["Hour", "Conduction (W)", "Convection (W)", "Radiation (W)"])
        hf = sim["heat_flow_breakdown"]
        for i in range(len(hf["hours"])):
            writer.writerow([
                hf["hours"][i],
                hf["conduction"][i],
                hf["convection"][i],
                hf["radiation"][i]
            ])

        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment;filename=thermoshelter_simulation_report.csv"}
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print("Starting ThermoShelter Pro server on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
