import { useEco } from '../context/EcoContext';

export const useChallenges = () => {
  const { 
    challenges, 
    completions, 
    completeChallenge, 
    uncompleteChallenge,
    activeCategory, 
    setActiveCategory,
    searchQuery,
    setSearchQuery 
  } = useEco();

  const todayStr = new Date().toISOString().split('T')[0];
  const completedTodayIds = new Set(
    completions
      .filter(c => c.completed_at.startsWith(todayStr))
      .map(c => c.challenge_id)
  );

  const filteredChallenges = challenges.filter(c => {
    const matchesCat = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return {
    challenges: filteredChallenges,
    allChallenges: challenges,
    completedTodayIds,
    completeChallenge,
    uncompleteChallenge,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery
  };
};
