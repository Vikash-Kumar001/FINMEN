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
import WaterBottleStory from './WaterBottleStory';
import QuizOnWaterConservation from './QuizOnWaterConservation';
import ReflexWaterSaver from './ReflexWaterSaver';
import PuzzleWaterSources from './PuzzleWaterSources';
import RainStory from './RainStory';
import PosterCleanAir from './PosterCleanAir';
import JournalOfWaterHabits from './JournalOfWaterHabits';
import PlantStory from './PlantStory';
import ReflexAirQuality from './ReflexAirQuality';
import BadgeWaterWarriorKid from './BadgeWaterWarriorKid';
import LeftoverFoodStory from './LeftoverFoodStory';
import QuizOnFoodWaste from './QuizOnFoodWaste';
import ReflexFoodSaver from './ReflexFoodSaver';
import PuzzleCompostItems from './PuzzleCompostItems';
import GardenStory from './GardenStory';
import PosterReduceFoodWaste from './PosterReduceFoodWaste';
import JournalOfFoodHabits from './JournalOfFoodHabits';
import CompostStory from './CompostStory';
import ReflexCompostHelper from './ReflexCompostHelper';
import BadgeFoodSaverKid from './BadgeFoodSaverKid';
import BikeStory from './BikeStory';
import QuizOnGreenTransport from './QuizOnGreenTransport';
import ReflexTransportChoice from './ReflexTransportChoice';
import PuzzleEnergyChoices from './PuzzleEnergyChoices';
import UnplugStory from './UnplugStory';
import PosterSaveEnergy from './PosterSaveEnergy';
import JournalOfTransport from './JournalOfTransport';
import BusStory from './BusStory';
import ReflexEnergyWise from './ReflexEnergyWise';
import BadgeGreenTravelerKid from './BadgeGreenTravelerKid';
import AnimalStory from './AnimalStory';
import QuizOnWildlife from './QuizOnWildlife';
import ReflexAnimalCare from './ReflexAnimalCare';
import PuzzleAnimalHomes from './PuzzleAnimalHomes';
import ForestStory from './ForestStory';
import PosterProtectWildlife from './PosterProtectWildlife';
import JournalNatureCare from './JournalNatureCare';
import BeeStory from './BeeStory';
import ReflexHabitatHelper from './ReflexHabitatHelper';
import BadgeWildlifeFriendKid from './BadgeWildlifeFriendKid';
import PaperStory from './PaperStory';
import QuizOnUpcycling from './QuizOnUpcycling';
import ReflexUpcycleMaster from './ReflexUpcycleMaster';
import PuzzleMaterialLife from './PuzzleMaterialLife';
import CraftStory from './CraftStory';
import PosterUpcycleIdeas from './PosterUpcycleIdeas';
import JournalOfReuse from './JournalOfReuse';
import DonationStory from './DonationStory';
import ReflexResourceSaver from './ReflexResourceSaver';
import BadgeUpcycleChampionKid from './BadgeUpcycleChampionKid';
import WeatherStory from './WeatherStory';
import QuizOnClimateChange from './QuizOnClimateChange';
import ReflexClimateHelper from './ReflexClimateHelper';
import PuzzleClimateSolutions from './PuzzleClimateSolutions';
import SeasonStory from './SeasonStory';
import PosterClimateAction from './PosterClimateAction';
import JournalOfGreenChoices from './JournalOfGreenChoices';
import CarbonStory from './CarbonStory';
import ReflexGreenFuture from './ReflexGreenFuture';
import BadgeClimateHelperKid from './BadgeClimateHelperKid';
import CommunityStory from './CommunityStory';
import QuizOnSustainableLiving from './QuizOnSustainableLiving';
import ReflexSustainableLife from './ReflexSustainableLife';
import PuzzleDailyHabits from './PuzzleDailyHabits';
import NeighborStory from './NeighborStory';
import PosterCommunityAction from './PosterCommunityAction';
import JournalOfCommunityHelp from './JournalOfCommunityHelp';
import EventStory from './EventStory';
import ReflexCommunityCare from './ReflexCommunityCare';
import BadgeCommunityGreenKid from './BadgeCommunityGreenKid';
import FutureStory from './FutureStory';
import QuizOnEarthCare from './QuizOnEarthCare';
import ReflexEarthGuardian from './ReflexEarthGuardian';
import PuzzleEarthSolutions from './PuzzleEarthSolutions';
import BadgeMasterEarthGuardianKid from './BadgeMasterEarthGuardianKid';

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
  
  
  // Games 26-35: Water Conservation & Air Quality Focus
  'water-bottle-story': WaterBottleStory,
  'quiz-on-water-conservation': QuizOnWaterConservation,
  'reflex-water-saver': ReflexWaterSaver,
  'puzzle-water-sources': PuzzleWaterSources,
  'rain-story': RainStory,
  'poster-clean-air': PosterCleanAir,
  'journal-of-water-habits': JournalOfWaterHabits,
  'plant-story': PlantStory,
  'reflex-air-quality': ReflexAirQuality,
  'badge-water-warrior-kid': BadgeWaterWarriorKid,
  
  // Games 36-45: Food Waste & Composting Focus
  'leftover-food-story': LeftoverFoodStory,
  'quiz-on-food-waste': QuizOnFoodWaste,
  'reflex-food-saver': ReflexFoodSaver,
  'puzzle-compost-items': PuzzleCompostItems,
  'garden-story': GardenStory,
  'poster-reduce-food-waste': PosterReduceFoodWaste,
  'journal-of-food-habits': JournalOfFoodHabits,
  'compost-story': CompostStory,
  'reflex-compost-helper': ReflexCompostHelper,
  'badge-food-saver-kid': BadgeFoodSaverKid,
  
  // Games 46-55: Green Transport & Energy Focus
  'bike-story': BikeStory,
  'quiz-on-green-transport': QuizOnGreenTransport,
  'reflex-transport-choice': ReflexTransportChoice,
  'puzzle-energy-choices': PuzzleEnergyChoices,
  'unplug-story': UnplugStory,
  'poster-save-energy': PosterSaveEnergy,
  'journal-of-transport': JournalOfTransport,
  'bus-story': BusStory,
  'reflex-energy-wise': ReflexEnergyWise,
  'badge-green-traveler-kid': BadgeGreenTravelerKid,
  
  // Games 56-65: Wildlife & Animal Protection Focus
  'animal-story': AnimalStory,
  'quiz-on-wildlife': QuizOnWildlife,
  'reflex-animal-care': ReflexAnimalCare,
  'puzzle-animal-homes': PuzzleAnimalHomes,
  'forest-story': ForestStory,
  'poster-protect-wildlife': PosterProtectWildlife,
  'journal-nature-care': JournalNatureCare,
  'bee-story': BeeStory,
  'reflex-habitat-helper': ReflexHabitatHelper,
  'badge-wildlife-friend-kid': BadgeWildlifeFriendKid,
  
  // Games 66-75: Upcycling & Reuse Focus
  'paper-story': PaperStory,
  'quiz-on-upcycling': QuizOnUpcycling,
  'reflex-upcycle-master': ReflexUpcycleMaster,
  'puzzle-material-life': PuzzleMaterialLife,
  'craft-story': CraftStory,
  'poster-upcycle-ideas': PosterUpcycleIdeas,
  'journal-of-reuse': JournalOfReuse,
  'donation-story': DonationStory,
  'reflex-resource-saver': ReflexResourceSaver,
  'badge-upcycle-champion-kid': BadgeUpcycleChampionKid,
  
  // Games 76-85: Climate and Weather Focus
  'weather-story': WeatherStory,
  'quiz-on-climate-change': QuizOnClimateChange,
  'reflex-climate-helper': ReflexClimateHelper,
  'puzzle-climate-solutions': PuzzleClimateSolutions,
  'season-story': SeasonStory,
  'poster-climate-action': PosterClimateAction,
  'journal-of-green-choices': JournalOfGreenChoices,
  'carbon-story': CarbonStory,
  'reflex-green-future': ReflexGreenFuture,
  'badge-climate-helper-kid': BadgeClimateHelperKid,
  
  // Games 86-95: Community Action & Sustainability Focus
  'community-story': CommunityStory,
  'quiz-on-sustainable-living': QuizOnSustainableLiving,
  'reflex-sustainable-life': ReflexSustainableLife,
  'puzzle-daily-habits': PuzzleDailyHabits,
  'neighbor-story': NeighborStory,
  'poster-community-action': PosterCommunityAction,
  'journal-of-community-help': JournalOfCommunityHelp,
  'event-story': EventStory,
  'reflex-community-care': ReflexCommunityCare,
  'badge-community-green-kid': BadgeCommunityGreenKid,
  
  // Games 96-100: Earth Guardian Series
  'future-story': FutureStory,
  'quiz-on-earth-care': QuizOnEarthCare,
  'reflex-earth-guardian': ReflexEarthGuardian,
  'puzzle-earth-solutions': PuzzleEarthSolutions,
  'badge-master-earth-guardian-kid': BadgeMasterEarthGuardianKid,
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

