"""
Unit and Integration Tests for ThermoShelter Pro
"""
import unittest
import json
import app

class ThermoShelterTests(unittest.TestCase):
    def setUp(self):
        self.client = app.app.test_client()

    def test_01_index_page(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'ThermoShelter', res.data)
        self.assertIn(b'Simulation Settings', res.data)
        print("[PASS] test_01_index_page passed")

    def test_02_terrains_endpoint(self):
        res = self.client.get('/api/terrains')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertIn('Hot & Arid Desert', data['terrains'])
        self.assertIn('Cold Mountainous / Alpine', data['terrains'])
        print(f"[PASS] test_02_terrains_endpoint passed ({len(data['terrains'])} terrains verified)")

    def test_03_materials_endpoint(self):
        res = self.client.get('/api/materials')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertIn('Brick (Clay / Fireclay)', data['materials'])
        self.assertIn('Wood Shingles + Insulation', data['materials'])
        print(f"[PASS] test_03_materials_endpoint passed ({len(data['materials'])} materials verified)")

    def test_04_simulate_baseline(self):
        payload = {
            'terrain_name': 'Hot & Arid Desert',
            'wall_material': 'Brick (Clay / Fireclay)',
            'roof_material': 'Wood Shingles + Insulation',
            'conductivity': 0.84,
            'thickness': 220,
            'outer_reflectivity': 72.5,
            'shape_model': 'Rectangular Gable',
            'length': 6.0,
            'width': 4.5,
            'height': 3.2,
            'pitch': 25.0,
            'ambient_temp': 34.2,
            'rel_humidity': 62,
            'wind_speed': 3.2,
            'solar_irradiance': 850
        }
        res = self.client.post('/api/simulate', json=payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        
        sim = data['simulation']
        summary = sim['summary']
        print("\n--- Simulation Baseline Verification ---")
        print(f"1. Inside Temperature: {summary['inside_temp_display']}°C (Target: 28.4°C)")
        print(f"2. Solar Energy Yield: {summary['solar_energy_yield']} W/m² (Target: 487 W/m²)")
        print(f"3. Heat Flow Rate:     {summary['heat_flow_rate']} W (Target: 12.6 W)")
        print(f"4. Comfort Index:      {summary['comfort_index']} (Target: 0.72)")

        self.assertEqual(summary['inside_temp_display'], 28.4)
        self.assertEqual(summary['solar_energy_yield'], 487)
        self.assertEqual(summary['heat_flow_rate'], 12.6)
        self.assertEqual(summary['comfort_index'], 0.72)

        # Verify heat flow breakdown
        hf = sim['heat_flow_breakdown']
        self.assertEqual(len(hf['hours']), 7)
        self.assertEqual(len(hf['conduction']), 7)
        self.assertEqual(len(hf['convection']), 7)
        self.assertEqual(len(hf['radiation']), 7)

        # Verify recommended design
        rec = data['recommended_design']
        self.assertEqual(rec['optimal_shape'], 'Rectangular Dome Hybrid')
        self.assertEqual(rec['system_thermal_efficiency'], 94.5)
        print("[PASS] test_04_simulate_baseline passed with exact target matches")

    def test_05_add_custom_material(self):
        new_mat = {
            'name': 'Mycelium Super-Insulation',
            'category': 'Bio-Composite',
            'conductivity': 0.03,
            'density': 50.0,
            'specific_heat': 1500.0,
            'thickness': 90
        }
        res = self.client.post('/api/materials', json=new_mat)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])

        # Verify retrieved
        res_get = self.client.get('/api/materials')
        materials = json.loads(res_get.data)['materials']
        self.assertIn('Mycelium Super-Insulation', materials)
        print("[PASS] test_05_add_custom_material passed")

    def test_06_csv_export(self):
        payload = {
            'terrain_name': 'Hot & Arid Desert',
            'ambient_temp': 34.2
        }
        res = self.client.post('/api/export-csv', json=payload)
        self.assertEqual(res.status_code, 200)
        self.assertIn('text/csv', res.content_type)
        self.assertIn(b'Ambient Temp', res.data)
        self.assertIn(b'Simulated Inside Temp', res.data)
        self.assertIn(b'Conduction', res.data)
        print("[PASS] test_06_csv_export passed")

if __name__ == '__main__':
    unittest.main()
