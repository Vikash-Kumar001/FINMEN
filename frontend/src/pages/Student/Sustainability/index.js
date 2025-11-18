// Unified Sustainability Games Export
// Combines all sustainability games into a single object

// Import all sustainability games (organized by theme, not age)
import TestSolarGame from './SolarAndCity/TestSolarGame';
import TestWaterRecycleGame from './WaterAndRecycle/TestWaterRecycleGame';
import TestCarbonGame from './CarbonAndClimate/TestCarbonGame';
import TestWaterEnergyGame from './WaterAndEnergy/TestWaterEnergyGame';

// Create unified games registry
// Note: Sustainability games are organized by theme, not age group
const sustainabilityGames = {
  // All games available for both kids and teens
  all: {
    'test-solar-game': TestSolarGame,
    'test-water-recycle-game': TestWaterRecycleGame,
    'test-carbon-game': TestCarbonGame,
    'test-water-energy-game': TestWaterEnergyGame
  },

  // For compatibility with universal renderer, mirror in both age groups
  kids: {
    'test-solar-game': TestSolarGame,
    'test-water-recycle-game': TestWaterRecycleGame,
    'test-carbon-game': TestCarbonGame,
    'test-water-energy-game': TestWaterEnergyGame
  },

  teen: {
    'test-solar-game': TestSolarGame,
    'test-water-recycle-game': TestWaterRecycleGame,
    'test-carbon-game': TestCarbonGame,
    'test-water-energy-game': TestWaterEnergyGame
  }
};

// Export functions to get games
export const getSustainabilityGame = (age, gameId) => {
  return sustainabilityGames[age]?.[gameId] || sustainabilityGames.all[gameId];
};

export const getAllSustainabilityGames = (age = null) => {
  if (age && age !== 'all') {
    return sustainabilityGames[age] || {};
  }
  return sustainabilityGames.all;
};

export const getSustainabilityGameIds = (age = null) => {
  if (age && age !== 'all') {
    return Object.keys(sustainabilityGames[age] || {});
  }
  return Object.keys(sustainabilityGames.all);
};

export default sustainabilityGames;
