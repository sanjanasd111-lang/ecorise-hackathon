import { ActivityCompletion, CategoryType, Challenge, EcoHabitDNA, ParticipantBadge, CivicRecognitionInfo, GreenMobilityTrip } from '../types/database';

export interface LevelInfo {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  currentPoints: number;
  xpToNextLevel: number;
  nextLevelTitle: string;
  progressPercent: number;
  stage: number; // 0 to 4 for EcoByte mascot
}

export function calculateLevel(totalPoints: number): LevelInfo {
  if (totalPoints >= 500) {
    return {
      level: 6,
      title: 'EcoRise Legend',
      minPoints: 500,
      maxPoints: 500,
      currentPoints: totalPoints,
      xpToNextLevel: 0,
      nextLevelTitle: 'Max Level Reached',
      progressPercent: 100,
      stage: 4
    };
  } else if (totalPoints >= 300) {
    const min = 300;
    const max = 500;
    const percent = Math.min(100, Math.round(((totalPoints - min) / (max - min)) * 100));
    return {
      level: 5,
      title: 'Climate Leader',
      minPoints: min,
      maxPoints: max,
      currentPoints: totalPoints,
      xpToNextLevel: max - totalPoints,
      nextLevelTitle: 'EcoRise Legend',
      progressPercent: percent,
      stage: 4
    };
  } else if (totalPoints >= 200) {
    const min = 200;
    const max = 300;
    const percent = Math.min(100, Math.round(((totalPoints - min) / (max - min)) * 100));
    return {
      level: 4,
      title: 'Climate Champion',
      minPoints: min,
      maxPoints: max,
      currentPoints: totalPoints,
      xpToNextLevel: max - totalPoints,
      nextLevelTitle: 'Climate Leader',
      progressPercent: percent,
      stage: 3
    };
  } else if (totalPoints >= 100) {
    const min = 100;
    const max = 200;
    const percent = Math.min(100, Math.round(((totalPoints - min) / (max - min)) * 100));
    return {
      level: 3,
      title: 'Eco Contributor',
      minPoints: min,
      maxPoints: max,
      currentPoints: totalPoints,
      xpToNextLevel: max - totalPoints,
      nextLevelTitle: 'Climate Champion',
      progressPercent: percent,
      stage: 2
    };
  } else if (totalPoints >= 50) {
    const min = 50;
    const max = 100;
    const percent = Math.min(100, Math.round(((totalPoints - min) / (max - min)) * 100));
    return {
      level: 2,
      title: 'Green Participant',
      minPoints: min,
      maxPoints: max,
      currentPoints: totalPoints,
      xpToNextLevel: max - totalPoints,
      nextLevelTitle: 'Eco Contributor',
      progressPercent: percent,
      stage: 1
    };
  } else {
    const min = 0;
    const max = 50;
    const percent = Math.min(100, Math.round((totalPoints / max) * 100));
    return {
      level: 1,
      title: 'Eco Explorer',
      minPoints: min,
      maxPoints: max,
      currentPoints: totalPoints,
      xpToNextLevel: Math.max(1, max - totalPoints),
      nextLevelTitle: 'Green Participant',
      progressPercent: percent,
      stage: 0
    };
  }
}

/**
 * Calculates user streak based on activity completion dates
 */
export function calculateStreak(completions: ActivityCompletion[], shieldsAvailable: number = 0): {
  currentStreak: number;
  longestStreak: number;
  shieldUsed: boolean;
  hasActivityToday: boolean;
} {
  if (!completions || completions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, shieldUsed: false, hasActivityToday: false };
  }

  // Get distinct calendar dates in YYYY-MM-DD
  const dateSet = new Set<string>();
  completions.forEach(c => {
    const d = new Date(c.completed_at);
    dateSet.add(d.toISOString().split('T')[0]);
  });

  const sortedDates = Array.from(dateSet).sort().reverse();
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const hasActivityToday = dateSet.has(todayStr);

  // If no activity today and no activity yesterday, check if shield can protect
  let currentStreak = 0;
  let shieldUsed = false;

  let checkDate = new Date();
  if (!hasActivityToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (dateSet.has(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Missing day: test if streak shield can save it
      if (shieldsAvailable > 0 && !shieldUsed && currentStreak > 0) {
        shieldUsed = true;
        checkDate.setDate(checkDate.getDate() - 1); // skip missing day
        continue;
      }
      break;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, sortedDates.length > 0 ? currentStreak : 0),
    shieldUsed,
    hasActivityToday
  };
}

/**
 * Generates Eco Habit DNA personality based on category frequency
 */
export function calculateEcoHabitDNA(completions: ActivityCompletion[], challenges: Challenge[]): EcoHabitDNA {
  const challengeMap = new Map(challenges.map(c => [c.id, c]));

  const counts: Record<CategoryType, number> = {
    transport: 0,
    waste: 0,
    energy: 0,
    water: 0,
    nature: 0
  };

  completions.forEach(c => {
    const ch = challengeMap.get(c.challenge_id);
    if (ch && ch.category) {
      counts[ch.category] = (counts[ch.category] || 0) + 1;
    }
  });

  const total = completions.length || 1;

  const breakdown = [
    { category: 'transport' as CategoryType, label: 'Clean Transport', count: counts.transport, percentage: Math.round((counts.transport / total) * 100), color: '#8b5cf6' },
    { category: 'waste' as CategoryType, label: 'Waste Reduction', count: counts.waste, percentage: Math.round((counts.waste / total) * 100), color: '#14b8a6' },
    { category: 'energy' as CategoryType, label: 'Energy Saving', count: counts.energy, percentage: Math.round((counts.energy / total) * 100), color: '#f59e0b' },
    { category: 'water' as CategoryType, label: 'Water Conservation', count: counts.water, percentage: Math.round((counts.water / total) * 100), color: '#06b6d4' },
    { category: 'nature' as CategoryType, label: 'Nature & Trees', count: counts.nature, percentage: Math.round((counts.nature / total) * 100), color: '#10b981' }
  ].sort((a, b) => b.count - a.count);

  const top = breakdown[0];

  let personality = 'Balanced Eco-Warrior';
  let tagline = 'Harmonious climate impact across all dimensions.';
  let description = 'You maintain a balanced sustainability approach, contributing equally to waste, energy, water, transit, and nature.';

  if (top.count > 0) {
    switch (top.category) {
      case 'transport':
        personality = 'GREEN COMMUTER';
        tagline = 'Wheels and public transit are your climate weapons.';
        description = 'You consistently choose cycling, walking, and low-carbon public transit to minimize commute emissions.';
        break;
      case 'waste':
        personality = 'WASTE WARRIOR';
        tagline = 'You turn zero-waste living into an everyday habit.';
        description = 'You excel at eliminating single-use plastics, recycling cleanly, and reducing packaging footprint.';
        break;
      case 'energy':
        personality = 'ENERGY SAVER';
        tagline = 'You consistently cut unnecessary kilowatt-hours.';
        description = 'Your mindfulness in turning off lights and conserving power prevents unnecessary power grid emissions.';
        break;
      case 'water':
        personality = 'WATER PROTECTOR';
        tagline = 'Every drop matters in your sustainable routine.';
        description = 'You protect freshwater resources through shorter showers, tap conservation, and reusable bottles.';
        break;
      case 'nature':
        personality = 'NATURE GUARDIAN';
        tagline = 'Your actions keep local ecosystems thriving.';
        description = 'You actively plant trees, clean up public areas, and nurture urban biodiversity.';
        break;
    }
  }

  return {
    personality,
    tagline,
    description,
    dominantCategory: top.category,
    breakdown
  };
}

/**
 * Calculates translated real-world impact equivalencies
 */
export function calculateImpactEquivalents(completions: ActivityCompletion[], challenges: Challenge[]) {
  const challengeMap = new Map(challenges.map(c => [c.id, c]));

  let trees = 0;
  let waterLiters = 0;
  let plasticItems = 0;
  let transportKm = 0;
  let energyActions = 0;

  completions.forEach(c => {
    const ch = challengeMap.get(c.challenge_id);
    if (!ch) return;

    if (ch.impact_type === 'trees') trees += ch.impact_value;
    if (ch.impact_type === 'water') waterLiters += ch.impact_value;
    if (ch.impact_type === 'plastic') plasticItems += ch.impact_value;
    if (ch.impact_type === 'transport') transportKm += ch.impact_value;
    if (ch.impact_type === 'energy') energyActions += ch.impact_value;
  });

  // Estimated CO2 avoided based on demo standardized factors:
  // transport: ~0.17 kg CO2/km avoided; energy: ~0.4 kg CO2/action; plastic: ~0.08 kg CO2/item; tree: ~22 kg/yr
  const estimatedCo2Kg = Number((
    (transportKm * 0.17) + 
    (energyActions * 0.4) + 
    (plasticItems * 0.08) + 
    (trees * 1.8)
  ).toFixed(1));

  return {
    treesSupported: trees,
    waterSavedLiters: waterLiters,
    plasticAvoidedItems: plasticItems,
    cleanTransitKm: transportKm,
    energySavedActions: energyActions,
    estimatedCo2Kg,
    carKmEquivalent: Math.round(estimatedCo2Kg * 5.2),
    plasticBottlesEquivalent: plasticItems
  };
}

/**
 * Calculates the 10 Participant Badges with dynamic progress and unlocked timestamps
 */
export function calculateParticipantBadges(
  completions: ActivityCompletion[],
  streak: number,
  totalPoints: number,
  challenges: Challenge[],
  mobilityTrips: GreenMobilityTrip[] = [],
  storedDates: Record<string, string> = {}
): ParticipantBadge[] {
  const challengeMap = new Map(challenges.map(c => [c.id, c]));

  // Counts by category
  let waterCount = 0;
  let transportCount = 0;
  let wasteCount = 0;
  let energyCount = 0;
  let treeCount = 0;
  let transitSpecificCount = mobilityTrips.reduce((sum, t) => sum + (t.mode === 'bus' || t.mode === 'metro' ? t.tripsCount : 0), 0);

  completions.forEach(c => {
    const ch = challengeMap.get(c.challenge_id);
    const cat = ch?.category || 'waste';
    if (cat === 'water') waterCount++;
    if (cat === 'transport') {
      transportCount++;
      if (c.challenge_id === 'public_transport') transitSpecificCount++;
    }
    if (cat === 'waste') wasteCount++;
    if (cat === 'energy') energyCount++;
    if (cat === 'nature' || c.challenge_id === 'plant_tree') treeCount++;
  });

  const rawBadges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: ParticipantBadge['category'];
    progress: number;
    maxProgress: number;
  }> = [
    {
      id: 'green_starter',
      name: 'Green Starter',
      description: 'Complete your first eco activity.',
      icon: '🌱',
      category: 'starter',
      progress: Math.min(1, completions.length),
      maxProgress: 1
    },
    {
      id: 'water_guardian',
      name: 'Water Guardian',
      description: 'Complete 5 water-saving activities.',
      icon: '💧',
      category: 'water',
      progress: Math.min(5, waterCount),
      maxProgress: 5
    },
    {
      id: 'green_commuter',
      name: 'Green Commuter',
      description: 'Complete 5 cycling/public transport activities.',
      icon: '🚲',
      category: 'mobility',
      progress: Math.min(5, transportCount),
      maxProgress: 5
    },
    {
      id: 'transit_champion',
      name: 'Public Transport Champion',
      description: 'Complete 10 public transport actions.',
      icon: '🚌',
      category: 'mobility',
      progress: Math.min(10, transitSpecificCount),
      maxProgress: 10
    },
    {
      id: 'waste_warrior',
      name: 'Waste Warrior',
      description: 'Complete 10 recycling or plastic-reduction actions.',
      icon: '♻️',
      category: 'waste',
      progress: Math.min(10, wasteCount),
      maxProgress: 10
    },
    {
      id: 'tree_guardian',
      name: 'Tree Guardian',
      description: 'Complete tree-planting activities.',
      icon: '🌳',
      category: 'nature',
      progress: Math.min(1, treeCount),
      maxProgress: 1
    },
    {
      id: 'energy_saver',
      name: 'Energy Saver',
      description: 'Complete 10 energy-saving actions.',
      icon: '⚡',
      category: 'energy',
      progress: Math.min(10, energyCount),
      maxProgress: 10
    },
    {
      id: 'streak_master',
      name: 'Eco Streak Master',
      description: 'Maintain a 7-day streak.',
      icon: '🔥',
      category: 'streak',
      progress: Math.min(7, streak),
      maxProgress: 7
    },
    {
      id: 'climate_champion',
      name: 'Climate Champion',
      description: 'Reach 100 Eco Points.',
      icon: '🌍',
      category: 'points',
      progress: Math.min(100, totalPoints),
      maxProgress: 100
    },
    {
      id: 'ecorise_legend',
      name: 'EcoRise Legend',
      description: 'Reach 250 Eco Points.',
      icon: '🏆',
      category: 'points',
      progress: Math.min(250, totalPoints),
      maxProgress: 250
    }
  ];

  const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return rawBadges.map(b => {
    const isUnlocked = b.progress >= b.maxProgress;
    const earnedDate = isUnlocked ? (storedDates[b.id] || nowStr) : null;
    return {
      ...b,
      unlocked: isUnlocked,
      unlockedAt: earnedDate
    };
  });
}

/**
 * Calculates Civic Recognition Level and Certificate info
 */
export function calculateCivicRecognition(totalPoints: number, participantName: string = 'Eco Member'): CivicRecognitionInfo {
  let tier: CivicRecognitionInfo['tier'] = 'bronze';
  let title = 'Bronze Eco Contributor';
  let minPoints = 100;
  let badge = '🥉';

  if (totalPoints >= 500) {
    tier = 'leader';
    title = 'Civic Climate Leader';
    minPoints = 500;
    badge = '🏆';
  } else if (totalPoints >= 300) {
    tier = 'gold';
    title = 'Gold Climate Champion';
    minPoints = 300;
    badge = '🥇';
  } else if (totalPoints >= 200) {
    tier = 'silver';
    title = 'Silver Climate Contributor';
    minPoints = 200;
    badge = '🥈';
  } else {
    tier = 'bronze';
    title = 'Bronze Eco Contributor';
    minPoints = 100;
    badge = '🥉';
  }

  // Consistent deterministic certificate ID
  let hash = 0;
  for (let i = 0; i < participantName.length; i++) {
    hash = (hash << 5) - hash + participantName.charCodeAt(i);
    hash |= 0;
  }
  const certSuffix = String(Math.abs(hash) % 9000 + 1000);

  return {
    tier,
    title,
    minPoints,
    badge,
    isEligible: totalPoints >= 100,
    certificateId: `ECO-2026-${certSuffix}`
  };
}

/**
 * Generates the signature 'My Climate Action Story' narrative
 */
export function generateClimateStory(
  completions: ActivityCompletion[],
  mobilityTrips: GreenMobilityTrip[] = [],
  badgesCount: number = 0
) {
  const transitCount = mobilityTrips.length + completions.filter(c => c.impact_type === 'transport').length;
  const wasteCount = completions.filter(c => c.impact_type === 'plastic').length;
  const energyCount = completions.filter(c => c.impact_type === 'energy').length;
  const waterCount = completions.filter(c => c.impact_type === 'water').length;

  let narrative = "This week you chose greener mobility, reduced single-use plastic, and saved energy in your community.";
  if (transitCount >= 3) {
    narrative = "You led by example this week by opting for green commutes, avoiding single-use waste, and conserving household energy.";
  } else if (waterCount >= 2) {
    narrative = "Your climate impact shone brightly through active water conservation, lower consumption habits, and mindful daily living.";
  }

  return {
    title: "Your EcoRise Story",
    narrative,
    stats: {
      actionsCount: completions.length,
      greenCommutesCount: transitCount,
      wasteActionsCount: wasteCount,
      energyActionsCount: energyCount,
      badgesEarnedCount: badgesCount
    },
    motto: "Small actions. Visible progress. Shared impact."
  };
}
