import kidAiGames from "./Kids";
import teenAiGames from "./Teen";


const aiForAllGames = {
  kids: kidAiGames,
  teen: teenAiGames,
};

export const getAiForAllGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return aiForAllGames[normalizedAgeGroup]?.[gameId];
};

export default aiForAllGames;