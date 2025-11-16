import kidUvlsGames from "./Kids";
import teenUvlsGames from "./Teen";


const uvlsGames = {
  kids: kidUvlsGames,
  teen: teenUvlsGames,
};

export const getUvlsGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return uvlsGames[normalizedAgeGroup]?.[gameId];
};

export default uvlsGames;