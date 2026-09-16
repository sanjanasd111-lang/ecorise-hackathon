import { useEco } from '../context/EcoContext';

export const useAnalytics = () => {
  const { completions, challenges, totalPoints, weeklyPoints, weeklyGoal } = useEco();

  const challengeMap = new Map(challenges.map(c => [c.id, c]));

  // Days of current week (Monday to Sunday)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
  const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diffToMonday));
  monday.setHours(0, 0, 0, 0);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyDailyData = days.map((dayName, index) => {
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + index);
    const dateStr = targetDate.toISOString().split('T')[0];

    const dayCompletions = completions.filter(c => c.completed_at.startsWith(dateStr));
    const dayPoints = dayCompletions.reduce((sum, c) => sum + c.points_earned, 0);

    return {
      day: dayName,
      date: dateStr,
      points: dayPoints,
      actions: dayCompletions.length
    };
  });

  // Category Breakdown for Charts
  const categoryTotals: Record<string, { points: number; count: number }> = {
    nature: { points: 0, count: 0 },
    water: { points: 0, count: 0 },
    transport: { points: 0, count: 0 },
    energy: { points: 0, count: 0 },
    waste: { points: 0, count: 0 }
  };

  completions.forEach(c => {
    const ch = challengeMap.get(c.challenge_id);
    if (ch && categoryTotals[ch.category]) {
      categoryTotals[ch.category].points += c.points_earned;
      categoryTotals[ch.category].count += 1;
    }
  });

  const categoryChartData = [
    { name: 'Nature', category: 'nature', points: categoryTotals.nature.points, count: categoryTotals.nature.count, fill: '#10b981' },
    { name: 'Water', category: 'water', points: categoryTotals.water.points, count: categoryTotals.water.count, fill: '#06b6d4' },
    { name: 'Transport', category: 'transport', points: categoryTotals.transport.points, count: categoryTotals.transport.count, fill: '#8b5cf6' },
    { name: 'Energy', category: 'energy', points: categoryTotals.energy.points, count: categoryTotals.energy.count, fill: '#f59e0b' },
    { name: 'Waste', category: 'waste', points: categoryTotals.waste.points, count: categoryTotals.waste.count, fill: '#14b8a6' }
  ];

  // Best Category
  const bestCategory = [...categoryChartData].sort((a, b) => b.points - a.points)[0];

  // Comparison vs previous week
  const prevMonday = new Date(monday);
  prevMonday.setDate(monday.getDate() - 7);
  const prevSunday = new Date(monday);
  prevSunday.setSeconds(-1);

  const prevWeekCompletions = completions.filter(c => {
    const d = new Date(c.completed_at);
    return d >= prevMonday && d <= prevSunday;
  });
  const prevWeekPoints = prevWeekCompletions.reduce((sum, c) => sum + c.points_earned, 0);

  let weekOverWeekChange = 0;
  if (prevWeekPoints > 0) {
    weekOverWeekChange = Math.round(((weeklyPoints - prevWeekPoints) / prevWeekPoints) * 100);
  } else if (weeklyPoints > 0) {
    weekOverWeekChange = 100;
  }

  return {
    weeklyDailyData,
    categoryChartData,
    bestCategory,
    prevWeekPoints,
    weekOverWeekChange,
    totalPoints,
    weeklyPoints,
    weeklyGoal,
    totalActions: completions.length
  };
};
