import kidMoralGames from "./Kids";
import teenMoralGames from "./Teen";


const moralValuesGames = {
  kids: kidMoralGames,
  teen: teenMoralGames,
};

export const getMoralValuesGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return moralValuesGames[normalizedAgeGroup]?.[gameId];
};

export default moralValuesGames;