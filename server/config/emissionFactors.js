/**
 * Transport CO₂e Emission Factors Configuration & Educational Methodology
 * Sources: UK BEIS / DEFRA Greenhouse Gas Reporting Guidelines & IPCC Transport Factors
 * Units: kg CO₂e per passenger-kilometer (kg CO₂e/km)
 */

export const EMISSION_FACTORS = {
  // Passenger Cars (Average occupancy 1.2 - 1.5 passengers)
  CAR_PETROL: 0.170,
  CAR_DIESEL: 0.171,
  CAR_HYBRID: 0.105,
  CAR_ELECTRIC: 0.045, // Lifecycle average accounting for global grid electricity mix (not claimed 0)
  CAR_AVERAGE: 0.150,  // Fallback for "Not sure"

  // Two-wheelers
  MOTORBIKE_PETROL: 0.103,
  MOTORBIKE_ELECTRIC: 0.025,
  MOTORBIKE_AVERAGE: 0.085, // Fallback for "Not sure"

  // Public & Shared Transit
  BUS: 0.082,     // Average municipal urban transit bus per passenger-km
  METRO: 0.035,   // Electric urban light rail / metro per passenger-km
  CARPOOL: 0.075, // Shared passenger ride (assumes 2+ passengers sharing footprint)
  TAXI: 0.190,    // Single passenger ride-hail / urban cab

  // Active / Zero Direct Emission Modes
  BICYCLE: 0.000,
  WALKING: 0.000
};

/**
 * Resolves the appropriate emission factor based on transport mode and fuel/vehicle type.
 */
export function getEmissionFactor(transportMode, vehicleType) {
  const mode = (transportMode || '').toLowerCase();
  const vType = (vehicleType || '').toLowerCase();

  if (mode === 'car') {
    if (vType === 'petrol') return EMISSION_FACTORS.CAR_PETROL;
    if (vType === 'diesel') return EMISSION_FACTORS.CAR_DIESEL;
    if (vType === 'hybrid') return EMISSION_FACTORS.CAR_HYBRID;
    if (vType === 'electric') return EMISSION_FACTORS.CAR_ELECTRIC;
    return EMISSION_FACTORS.CAR_AVERAGE;
  }

  if (mode === 'bike' || mode === 'scooter' || mode === 'two-wheeler' || mode === 'motorbike') {
    if (vType === 'petrol') return EMISSION_FACTORS.MOTORBIKE_PETROL;
    if (vType === 'electric') return EMISSION_FACTORS.MOTORBIKE_ELECTRIC;
    return EMISSION_FACTORS.MOTORBIKE_AVERAGE;
  }

  if (mode === 'bus') return EMISSION_FACTORS.BUS;
  if (mode === 'metro') return EMISSION_FACTORS.METRO;
  if (mode === 'carpool') return EMISSION_FACTORS.CARPOOL;
  if (mode === 'taxi' || mode === 'cab') return EMISSION_FACTORS.TAXI;
  if (mode === 'bicycle' || mode === 'bike_pedal') return EMISSION_FACTORS.BICYCLE;
  if (mode === 'walking' || mode === 'walk') return EMISSION_FACTORS.WALKING;

  return EMISSION_FACTORS.CAR_AVERAGE;
}

/**
 * Calculates weekly, monthly, and yearly estimated transport CO₂e.
 * Formula:
 * Distance Type:
 *   - 'one-way': weeklyDistance = distanceKm * 2 * tripsPerWeek
 *   - 'round-trip': weeklyDistance = distanceKm * tripsPerWeek
 * Weekly CO₂e = weeklyDistance * emissionFactor
 */
export function calculateTransportCO2e({
  transportMode,
  vehicleType = 'Not sure',
  distancePerTrip = 5,
  tripsPerWeek = 5,
  distanceType = 'one-way'
}) {
  const distance = Math.max(0.5, Number(distancePerTrip) || 5);
  const frequency = Math.max(1, Number(tripsPerWeek) || 5);
  const isOneWay = (distanceType || 'one-way').toLowerCase() === 'one-way';

  const weeklyDistanceKm = isOneWay ? distance * 2 * frequency : distance * frequency;
  const factor = getEmissionFactor(transportMode, vehicleType);

  const estimatedWeeklyCO2e = Math.round((weeklyDistanceKm * factor) * 10) / 10;
  const estimatedMonthlyCO2e = Math.round((estimatedWeeklyCO2e * 4.33) * 10) / 10;
  const estimatedYearlyCO2e = Math.round((estimatedWeeklyCO2e * 52) * 10) / 10;

  return {
    weeklyDistanceKm,
    emissionFactor: factor,
    estimatedWeeklyCO2e,
    estimatedMonthlyCO2e,
    estimatedYearlyCO2e,
    methodology: 'Distance × Frequency × Average Emission Factor (DEFRA/IPCC educational guidelines)'
  };
}
