import kidFinanceGames from "./Kids";
import teenFinanceGames from "./Teen";


const financeGames = {
  kids: kidFinanceGames,
  teen: teenFinanceGames,
};

export const getFinanceGame = (ageGroup, gameId) => {
  // Normalize age group to match object keys
  const normalizedAgeGroup = ageGroup === 'teens' ? 'teen' : ageGroup;
  return financeGames[normalizedAgeGroup]?.[gameId];
};

export default financeGames;