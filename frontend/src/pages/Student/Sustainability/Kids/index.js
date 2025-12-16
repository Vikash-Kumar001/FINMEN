// Import all Sustainability Kids game components
import EcoSortStory from './EcoSortStory';
import QuizOnRecycling from './QuizOnRecycling';
import ReflexRecycle from './ReflexRecycle';
import PuzzleSortWaste from './PuzzleSortWaste';
import LitterStory from './LitterStory';
import Poster3Rs from './Poster3Rs';
import JournalRecycling from './JournalRecycling';
import PlasticBagStory from './PlasticBagStory';
import ReflexWasteChoice from './ReflexWasteChoice';
import BadgeEcoHelperKid from './BadgeEcoHelperKid';
import LightsOffStory from './LightsOffStory';
import QuizSavingEnergy from './QuizSavingEnergy';
import ReflexEnergySaver from './ReflexEnergySaver';
import PuzzleEnergySources from './PuzzleEnergySources';
import WaterTapStory from './WaterTapStory';
import PosterSaveWater from './PosterSaveWater';
import JournalGreenHabits from './JournalGreenHabits';
import TreePlantingStory from './TreePlantingStory';
import ReflexNatureCare from './ReflexNatureCare';
import BadgePlanetProtectorKid from './BadgePlanetProtectorKid';
import OceanCleanupStory from './OceanCleanupStory';
import QuizWildlifeProtection from './QuizWildlifeProtection';
import ReflexCleanAir from './ReflexCleanAir';
import PuzzleGreenTransportation from './PuzzleGreenTransportation';
import BadgeEarthGuardian from './BadgeEarthGuardian';

// Create the games object mapping path segments (normalized to lowercase) to components
const sustainabilityKidsGames = {
  // Games 1-10: Recycling & Waste Management Focus
  'eco-sort-story': EcoSortStory,
  'quiz-on-recycling': QuizOnRecycling,
  'reflex-recycle': ReflexRecycle,
  'puzzle-sort-waste': PuzzleSortWaste,
  'litter-story': LitterStory,
  'poster-3rs': Poster3Rs,
  'journal-recycling': JournalRecycling,
  'plastic-bag-story': PlasticBagStory,
  'reflex-waste-choice': ReflexWasteChoice,
  'badge-eco-helper-kid': BadgeEcoHelperKid,
  
  // Games 11-20: Energy, Water & Nature Focus
  'lights-off-story': LightsOffStory,
  'quiz-saving-energy': QuizSavingEnergy,
  'reflex-energy-saver': ReflexEnergySaver,
  'puzzle-energy-sources': PuzzleEnergySources,
  'water-tap-story': WaterTapStory,
  'poster-save-water': PosterSaveWater,
  'journal-green-habits': JournalGreenHabits,
  'tree-planting-story': TreePlantingStory,
  'reflex-nature-care': ReflexNatureCare,
  'badge-planet-protector-kid': BadgePlanetProtectorKid,
  
  // Games 21-25: Advanced Sustainability Focus
  'ocean-cleanup-story': OceanCleanupStory,
  'quiz-wildlife-protection': QuizWildlifeProtection,
  'reflex-clean-air': ReflexCleanAir,
  'puzzle-green-transportation': PuzzleGreenTransportation,
  'badge-earth-guardian': BadgeEarthGuardian,
};

// Export functions to get games
export const getSustainabilityKidsGame = (gameId) => {
  // Normalize gameId to lowercase for matching
  const normalizedGameId = gameId.toLowerCase();
  return sustainabilityKidsGames[normalizedGameId] || null;
};

export const getAllSustainabilityKidsGames = () => {
  return sustainabilityKidsGames;
};

export const getSustainabilityKidsGameIds = () => {
  return Object.keys(sustainabilityKidsGames);
};

export default sustainabilityKidsGames;

