import kidFinanceGames from "./Kids";
import teenFinanceGames from "./Teen";


const financeGames = {
  kids: kidFinanceGames,
  teen: teenFinanceGames,
};

export const getFinanceGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  // Normalize gameId to lowercase for case-insensitive lookup
  const normalizedGameId = gameId?.toLowerCase();
  return financeGames[normalizedAgeGroup]?.[normalizedGameId];
};

export default financeGames;