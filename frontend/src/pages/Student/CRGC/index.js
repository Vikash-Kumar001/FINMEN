import kidCrgcGames from "./Kids";
import teenCrgcGames from "./Teens";

const crgcGames = {
  kids: kidCrgcGames,
  teen: teenCrgcGames
};

export const getCrgcGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return crgcGames[normalizedAgeGroup]?.[gameId];
};

export default crgcGames;