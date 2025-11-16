import kidHealthFemaleGames from "./Kids";
import teenHealthFemaleGames from "./Teens";

const healthFemaleGames = {
  kids: kidHealthFemaleGames,
  teen: teenHealthFemaleGames,
};

export const getHealthFemaleGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return healthFemaleGames[normalizedAgeGroup]?.[gameId];
};

export default healthFemaleGames;