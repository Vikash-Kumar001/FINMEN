import kidBrainGames from "./Kids";
import teenBrainGames from "./Teen";


const brainGames = {
  kids: kidBrainGames,
  teen: teenBrainGames,
};

export const getBrainGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return brainGames[normalizedAgeGroup]?.[gameId];
};

export default brainGames;