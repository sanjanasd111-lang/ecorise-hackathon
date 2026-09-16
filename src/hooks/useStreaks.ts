import { useEco } from '../context/EcoContext';

export const useStreaks = () => {
  const { streak, longestStreak, streakShields, hasActivityToday } = useEco();
  return { streak, longestStreak, streakShields, hasActivityToday };
};
