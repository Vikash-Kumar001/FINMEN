import kidHealthMaleGames from "./Kids";
import teenHealthMaleGames from "./Teen";


const healthMaleGames = {
  kids: kidHealthMaleGames,
  teen: teenHealthMaleGames,
};

export const getHealthMaleGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return healthMaleGames[normalizedAgeGroup]?.[gameId];
};

export default healthMaleGames;
