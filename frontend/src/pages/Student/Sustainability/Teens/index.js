// Sustainability Teens Games Export
import ClimateActionStory from './ClimateActionStory';
import QuizOnCarbonFootprint from './QuizOnCarbonFootprint';
import ReflexEcoChoice from './ReflexEcoChoice';
import PuzzleSustainableSolutions from './PuzzleSustainableSolutions';
import RenewableEnergyStory from './RenewableEnergyStory';
import DebateFossilFuelsVsRenewables from './DebateFossilFuelsVsRenewables';
import JournalOfGreenLiving from './JournalOfGreenLiving';
import SimulationEcoFriendlyCity from './SimulationEcoFriendlyCity';
import ReflexGreenHabits from './ReflexGreenHabits';
import BadgeClimateActivist from './BadgeClimateActivist';
import WasteReductionStory from './WasteReductionStory';
import QuizOnCircularEconomy from './QuizOnCircularEconomy';
import ReflexZeroWaste from './ReflexZeroWaste';
import PuzzleWasteHierarchy from './PuzzleWasteHierarchy';
import PlasticPollutionStory from './PlasticPollutionStory';
import DebateSingleUseVsReusable from './DebateSingleUseVsReusable';
import JournalOfWasteAudit from './JournalOfWasteAudit';
import SimulationRecyclingProgram from './SimulationRecyclingProgram';
import ReflexCompostMaster from './ReflexCompostMaster';
import BadgeZeroWasteChampion from './BadgeZeroWasteChampion';
import BiodiversityConservationStory from './BiodiversityConservationStory';
import QuizSustainableAgriculture from './QuizSustainableAgriculture';
import ReflexOceanProtector from './ReflexOceanProtector';
import SimulationGreenCommunityProject from './SimulationGreenCommunityProject';
import BadgeSustainabilityLeader from './BadgeSustainabilityLeader';

const sustainabilityTeenGames = {
  'climate-action-story': ClimateActionStory,
  'quiz-on-carbon-footprint': QuizOnCarbonFootprint,
  'reflex-eco-choice': ReflexEcoChoice,
  'puzzle-sustainable-solutions': PuzzleSustainableSolutions,
  'renewable-energy-story': RenewableEnergyStory,
  'debate-fossil-fuels-vs-renewables': DebateFossilFuelsVsRenewables,
  'journal-of-green-living': JournalOfGreenLiving,
  'simulation-eco-friendly-city': SimulationEcoFriendlyCity,
  'reflex-green-habits': ReflexGreenHabits,
  'badge-climate-activist': BadgeClimateActivist,
  'waste-reduction-story': WasteReductionStory,
  'quiz-on-circular-economy': QuizOnCircularEconomy,
  'reflex-zero-waste': ReflexZeroWaste,
  'puzzle-waste-hierarchy': PuzzleWasteHierarchy,
  'plastic-pollution-story': PlasticPollutionStory,
  'debate-single-use-vs-reusable': DebateSingleUseVsReusable,
  'journal-of-waste-audit': JournalOfWasteAudit,
  'simulation-recycling-program': SimulationRecyclingProgram,
  'reflex-compost-master': ReflexCompostMaster,
  'badge-zero-waste-champion': BadgeZeroWasteChampion,
  'biodiversity-conservation-story': BiodiversityConservationStory,
  'quiz-sustainable-agriculture': QuizSustainableAgriculture,
  'reflex-ocean-protector': ReflexOceanProtector,
  'simulation-green-community-project': SimulationGreenCommunityProject,
  'badge-sustainability-leader': BadgeSustainabilityLeader,
};

export const getSustainabilityTeenGame = (gameId) => {
  const normalizedGameId = gameId?.toLowerCase();
  return sustainabilityTeenGames[normalizedGameId];
};

export default sustainabilityTeenGames;

