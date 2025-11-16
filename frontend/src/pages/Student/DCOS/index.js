import kidDcosGames from "./Kids";
import teenDcosGames from "./Teen";


const dcosGames = {
  kids: kidDcosGames,
  teen: teenDcosGames,
};

export const getDcosGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return dcosGames[normalizedAgeGroup]?.[gameId];
};

export default dcosGames;