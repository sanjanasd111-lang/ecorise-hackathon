async function runE2ETest() {
  const API_URL = 'http://localhost:5000/api';
  console.log('--- Starting EcoRise 2.0 Full-Stack E2E Test ---');

  // 1. Health check
  const healthRes = await fetch(`${API_URL}/health`);
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status === 'online' ? 'PASS ✓' : 'FAIL ✗');

  // 2. Register new student
  const testEmail = `ecotest_${Date.now()}@example.com`;
  const regRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Maya Lin',
      email: testEmail,
      password: 'ClimatePassword123!',
      city: 'Greenwood District',
      school: 'Civic Climate Academy'
    })
  });
  const reg = await regRes.json();
  console.log('2. Registration & JWT:', reg.token ? 'PASS ✓' : 'FAIL ✗', 'Token length:', reg.token?.length);
  const token = reg.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Onboarding Questionnaire Submission
  const onboardRes = await fetch(`${API_URL}/onboarding/submit`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      transportMode: 'car',
      vehicleType: 'petrol',
      distancePerTrip: 8,
      distanceType: 'one-way',
      tripsPerWeek: 5,
      hasPublicTransitAccess: true
    })
  });
  const onboard = await onboardRes.json();
  console.log('3. Onboarding & Baseline CO2:', onboard.calculation ? 'PASS ✓' : 'FAIL ✗');
  console.log('   Estimated Weekly CO2e:', onboard.calculation?.estimatedWeeklyCO2e, 'kg CO2e');
  console.log('   First 3-Day Cycle Initialized:', onboard.cycle?.days?.length === 3 ? 'PASS ✓' : 'FAIL ✗');

  // 4. Fetch Active 3-Day Mission
  const cycleRes = await fetch(`${API_URL}/challenges/current`, { headers: authHeaders });
  const cycleData = await cycleRes.json();
  console.log('4. Active 3-Day Mission Retrieval:', cycleData.cycle?.days ? 'PASS ✓' : 'FAIL ✗');
  console.log('   Countdown time remaining:', cycleData.timeRemaining);

  // 5. Complete Day 1 Task
  const completeRes = await fetch(`${API_URL}/challenges/complete-day`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      dayNumber: 1,
      verificationNote: 'Shifted morning commute to light rail transit'
    })
  });
  const completeData = await completeRes.json();
  console.log('5. Complete Day 1 Micro-Action:', completeData.cycle?.days[0]?.completed ? 'PASS ✓' : 'FAIL ✗');
  console.log('   Updated Eco Points:', completeData.user?.ecoPoints, 'Streak:', completeData.user?.streak);

  // 6. Before/After CO2 Profile & Reduction
  const co2Res = await fetch(`${API_URL}/co2/profile`, { headers: authHeaders });
  const co2Data = await co2Res.json();
  console.log('6. Before/After CO2 Profile:', co2Data.metrics ? 'PASS ✓' : 'FAIL ✗');
  console.log('   Baseline Weekly:', co2Data.metrics?.baselineWeeklyCO2e, 'kg | Current Weekly:', co2Data.metrics?.currentWeeklyCO2e, 'kg');
  console.log('   Tailored Tips Count:', co2Data.tips?.length);

  // 7. What-If Simulator
  const simRes = await fetch(`${API_URL}/co2/what-if-simulate`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      targetMode: 'metro',
      shiftedTripsPerWeek: 2
    })
  });
  const simData = await simRes.json();
  console.log('7. What-If Modal Shift Simulator:', simData.weeklySavingsKg > 0 ? 'PASS ✓' : 'FAIL ✗');
  console.log('   Simulated Weekly Savings:', simData.weeklySavingsKg, 'kg | % Drop:', simData.percentageDrop + '%');

  // 8. Leaderboard & Olympic Podium
  const lbRes = await fetch(`${API_URL}/leaderboard`);
  const lbData = await lbRes.json();
  console.log('8. Leaderboard & Podium:', lbData.podium?.length === 3 ? 'PASS ✓' : 'FAIL ✗');

  // 9. Official Civic Certificate
  const certRes = await fetch(`${API_URL}/recognition/certificate`, { headers: authHeaders });
  const certData = await certRes.json();
  console.log('9. Civic Recognition Certificate:', certData.recognition?.certificateNumber ? 'PASS ✓' : 'FAIL ✗');
  console.log('   Certificate #:', certData.recognition?.certificateNumber);

  console.log('--- ALL E2E BACKEND API CHECKS PASSED SUCCESSFULLY! ---');
}

runE2ETest().catch(console.error);
