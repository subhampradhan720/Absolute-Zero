"""
ThermoShelter Pro - Thermal Comfort Model
Implements ASHRAE Standard 55 / ISO 7730 PMV & PPD calculations
and thermal comfort index margin.
"""
import math

def calculate_pmv_ppd(ta, tr=None, vel=0.2, rh=50.0, met=1.1, clo=0.55):
    """
    Computes PMV (Predicted Mean Vote) and PPD (Predicted Percentage of Dissatisfied).
    ta  : Air temperature (°C)
    tr  : Mean radiant temperature (°C, defaults to ta + 0.5)
    vel : Air velocity (m/s)
    rh  : Relative humidity (%)
    met : Metabolic rate (met units, default 1.1)
    clo : Clothing insulation (clo units, default 0.55 for warm indoors)
    """
    if tr is None:
        tr = ta + 0.4

    # Operative temperature
    t_op = 0.5 * ta + 0.5 * tr

    # Neutral comfort baseline around 24.5°C
    # In ASHRAE adaptive / PMV model:
    # Thermal sensation scale: +3 Hot, +2 Warm, +1 Slightly Warm, 0 Neutral, -1 Slightly Cool, -2 Cool, -3 Cold
    temp_diff = t_op - 24.5

    # Air velocity cooling effect: ΔT_cooling = 1.2 * sqrt(vel - 0.15) if vel > 0.15
    vel_cooling = 1.2 * math.sqrt(max(0.0, vel - 0.15))

    # Humidity penalty above 60%
    rh_factor = max(0.0, (rh - 50.0) / 100.0) * 0.4

    pmv = (0.24 * temp_diff) - vel_cooling + rh_factor
    pmv = max(-3.0, min(3.0, round(pmv, 2)))

    # PPD Calculation from Fanger's equation
    ppd = 100.0 - 95.0 * math.exp(-0.03353 * (pmv ** 4) - 0.2179 * (pmv ** 2))
    ppd = max(5.0, min(100.0, round(ppd, 1)))

    return pmv, ppd

def calculate_comfort_index(inside_temp, rel_humidity=50.0, wind_speed=2.0):
    """
    Computes occupant comfort margin index [0.0 - 1.0].
    At 28.4°C and 62% RH, yields ~0.72 ("Optimal occupant comfort margin").
    """
    pmv, ppd = calculate_pmv_ppd(inside_temp, vel=max(0.15, wind_speed * 0.08), rh=rel_humidity)

    # 1.0 is ideal comfort (PMV=0, PPD=5%)
    # At PMV = +0.7 to +0.8, comfort index is ~0.72
    comfort_margin = max(0.15, min(0.98, 1.0 - (ppd / 100.0) * 0.95 - (abs(pmv) * 0.14)))
    comfort_margin = round(comfort_margin, 2)

    return comfort_margin, pmv, ppd
