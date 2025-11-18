import kidEheGames from "./Kids";
import teenEheGames from "./Teens";

const eheGames = {
  kids: kidEheGames,
  teen: teenEheGames
};

export const getEheGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return eheGames[normalizedAgeGroup]?.[gameId];
};

export default eheGames;