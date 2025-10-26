// Unified Finance Games Export
// Combines Kids and Teen finance games into a single object

// Import all Kids games
import {
  PiggyBankStory,
  QuizOnSaving,
  ReflexSavings,
  PuzzleSaveOrSpend,
  BirthdayMoneyStory,
  PosterSavingHabit,
  JournalOfSaving,
  ShopStory,
  ReflexMoneyChoice,
  BadgeSaverKid,
  IceCreamStory,
  QuizOnSpending,
  ReflexSpending,
  PuzzleSmartVsWaste,
  ShopStory2,
  PosterSmartShopping,
  JournalOfSmartBuy,
  CandyOfferStory,
  ReflexNeedsFirst,
  BadgeSmartSpenderKid
} from './Kids';

// Import all Teen games
import {
  PocketMoneyStory,
  QuizOnSavingsRate,
  ReflexSmartSaver,
  PuzzleOfSavingGoals,
  SalaryStory,
  DebateSaveVsSpend,
  JournalOfSavingGoal,
  SimulationMonthlyMoney,
  ReflexWiseUse,
  BadgeSmartSaver,
  AllowanceStory,
  SpendingQuiz,
  ReflexWiseChoices,
  PuzzleSmartSpending,
  PartyStory,
  DebateNeedsVsWants,
  JournalOfSpending,
  SimulationShoppingMall,
  ReflexControl,
  BadgeSmartSpenderTeen
} from './Teen';

// Create unified games registry
const financeGames = {
  // Kids Games (20 games)
  kids: {
    'piggy-bank-story': PiggyBankStory,
    'quiz-on-saving': QuizOnSaving,
    'reflex-savings': ReflexSavings,
    'puzzle-save-or-spend': PuzzleSaveOrSpend,
    'birthday-money-story': BirthdayMoneyStory,
    'poster-saving-habit': PosterSavingHabit,
    'journal-of-saving': JournalOfSaving,
    'shop-story': ShopStory,
    'reflex-money-choice': ReflexMoneyChoice,
    'badge-saver-kid': BadgeSaverKid,
    'ice-cream-story': IceCreamStory,
    'quiz-on-spending': QuizOnSpending,
    'reflex-spending': ReflexSpending,
    'puzzle-smart-vs-waste': PuzzleSmartVsWaste,
    'shop-story-2': ShopStory2,
    'poster-smart-shopping': PosterSmartShopping,
    'journal-of-smart-buy': JournalOfSmartBuy,
    'candy-offer-story': CandyOfferStory,
    'reflex-needs-first': ReflexNeedsFirst,
    'badge-smart-spender-kid': BadgeSmartSpenderKid
  },

  // Teen Games (20 games)
  teen: {
    'pocket-money-story': PocketMoneyStory,
    'quiz-on-savings-rate': QuizOnSavingsRate,
    'reflex-smart-saver': ReflexSmartSaver,
    'puzzle-of-saving-goals': PuzzleOfSavingGoals,
    'salary-story': SalaryStory,
    'debate-save-vs-spend': DebateSaveVsSpend,
    'journal-of-saving-goal': JournalOfSavingGoal,
    'simulation-monthly-money': SimulationMonthlyMoney,
    'reflex-wise-use': ReflexWiseUse,
    'badge-smart-saver': BadgeSmartSaver,
    'allowance-story': AllowanceStory,
    'spending-quiz': SpendingQuiz,
    'reflex-wise-choices': ReflexWiseChoices,
    'puzzle-smart-spending': PuzzleSmartSpending,
    'party-story': PartyStory,
    'debate-needs-vs-wants': DebateNeedsVsWants,
    'journal-of-spending': JournalOfSpending,
    'simulation-shopping-mall': SimulationShoppingMall,
    'reflex-control': ReflexControl,
    'badge-smart-spender-teen': BadgeSmartSpenderTeen
  }
};

// Export functions to get games
export const getFinanceGame = (age, gameId) => {
  return financeGames[age]?.[gameId];
};

export const getAllFinanceGames = (age = null) => {
  if (age) {
    return financeGames[age] || {};
  }
  return {
    kids: financeGames.kids,
    teen: financeGames.teen
  };
};

export const getFinanceGameIds = (age = null) => {
  if (age) {
    return Object.keys(financeGames[age] || {});
  }
  return {
    kids: Object.keys(financeGames.kids),
    teen: Object.keys(financeGames.teen)
  };
};

export default financeGames;
