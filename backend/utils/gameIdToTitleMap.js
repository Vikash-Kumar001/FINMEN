// Mapping of gameId to game title for frontend-defined games
// These games are not stored in the Game model but are defined in the frontend
export const gameIdToTitleMap = {
  // Financial Literacy - Kids
  'finance-kids-1': 'Piggy Bank Story',
  'finance-kids-2': 'Quiz on Saving',
  'finance-kids-3': 'Reflex Savings',
  'finance-kids-4': 'Puzzle: Save or Spend',
  'finance-kids-5': 'Birthday Money Story',
  'finance-kids-6': 'Poster: Saving Habit',
  'finance-kids-7': 'Journal of Saving',
  'finance-kids-8': 'Shop Story',
  'finance-kids-9': 'Saving Goal Story',
  'finance-kids-10': 'Piggy Bank Quiz',
  'finance-kids-11': 'Choose Wisely',
  'finance-kids-12': 'Saving Challenge',
  'finance-kids-13': 'Money Decision',
  'finance-kids-14': 'Smart Saver',
  'finance-kids-15': 'Saving Habit',
  'finance-kids-16': 'Piggy Bank Fun',
  'finance-kids-17': 'Save First',
  'finance-kids-18': 'Money Choice',
  'finance-kids-19': 'Saving Story',
  'finance-kids-20': 'Final Saving Challenge',
  
  // Financial Literacy - Teens
  'finance-teens-1': 'Budget Basics',
  'finance-teens-2': 'Investment Quiz',
  'finance-teens-3': 'Smart Spending',
  'finance-teens-4': 'Financial Planning',
  'finance-teens-5': 'Money Management',
  'finance-teens-6': 'Budget Hero',
  'finance-teens-7': 'Investment Strategy',
  'finance-teens-8': 'Spending Habits',
  'finance-teens-9': 'Financial Goals',
  'finance-teens-10': 'Money Smarts',
  'finance-teens-11': 'Budget Challenge',
  'finance-teens-12': 'Investment Game',
  'finance-teens-13': 'Spending Decision',
  'finance-teens-14': 'Financial Quiz',
  'finance-teens-15': 'Money Master',
  'finance-teens-16': 'Budget Builder',
  'finance-teens-17': 'Investment Quiz',
  'finance-teens-18': 'Smart Money',
  'finance-teens-19': 'Financial Fun',
  'finance-teens-20': 'Final Financial Challenge',
  
  // Brain Health - Kids
  'brain-kids-1': 'Memory Match',
  'brain-kids-2': 'Puzzle Solver',
  'brain-kids-3': 'Mind Games',
  'brain-kids-4': 'Brain Training',
  'brain-kids-5': 'Memory Challenge',
  'brain-kids-6': 'Puzzle Master',
  'brain-kids-7': 'Brain Boost',
  'brain-kids-8': 'Memory Fun',
  'brain-kids-9': 'Mind Challenge',
  'brain-kids-10': 'Brain Exercise',
  'brain-kids-11': 'Memory Game',
  'brain-kids-12': 'Puzzle Pro',
  'brain-kids-13': 'Brain Trainer',
  'brain-kids-14': 'Mind Power',
  'brain-kids-15': 'Memory Master',
  'brain-kids-16': 'Puzzle Fun',
  'brain-kids-17': 'Brain Challenge',
  'brain-kids-18': 'Mind Games Pro',
  'brain-kids-19': 'Brain Boost Pro',
  'brain-kids-20': 'Final Brain Challenge',
  
  // Brain Health - Teens
  'brain-teens-1': 'Advanced Memory',
  'brain-teens-2': 'Complex Puzzles',
  'brain-teens-3': 'Mind Training',
  'brain-teens-4': 'Brain Fitness',
  'brain-teens-5': 'Memory Master',
  'brain-teens-6': 'Puzzle Expert',
  'brain-teens-7': 'Brain Power',
  'brain-teens-8': 'Mind Challenge',
  'brain-teens-9': 'Brain Training Pro',
  'brain-teens-10': 'Memory Pro',
  'brain-teens-11': 'Advanced Puzzle',
  'brain-teens-12': 'Brain Exercise Pro',
  'brain-teens-13': 'Mind Training Pro',
  'brain-teens-14': 'Brain Fitness Pro',
  'brain-teens-15': 'Memory Challenge Pro',
  'brain-teens-16': 'Puzzle Master Pro',
  'brain-teens-17': 'Brain Power Pro',
  'brain-teens-18': 'Mind Challenge Pro',
  'brain-teens-19': 'Brain Training Expert',
  'brain-teens-20': 'Final Brain Challenge Pro',
  
  // UVLS - Kids (add more as needed)
  'uvls-kids-1': 'UVLS Game 1',
  'uvls-kids-2': 'UVLS Game 2',
  // ... add more UVLS games
  
  // UVLS - Teens
  'uvls-teens-1': 'UVLS Teen Game 1',
  'uvls-teens-2': 'UVLS Teen Game 2',
  // ... add more UVLS teen games
  
  // Digital Citizenship - Kids
  'dcos-kids-1': 'Password Safety',
  'dcos-kids-2': 'Online Privacy',
  // ... add more DCOS games
  
  // Digital Citizenship - Teens
  'dcos-teens-1': 'Digital Security',
  'dcos-teens-2': 'Privacy Settings',
  // ... add more DCOS teen games
  
  // Moral Values - Kids
  'moral-kids-1': 'Kindness Game',
  'moral-kids-2': 'Honesty Challenge',
  // ... add more Moral games
  
  // Moral Values - Teens
  'moral-teens-1': 'Ethics Challenge',
  'moral-teens-2': 'Values Quiz',
  // ... add more Moral teen games
};

// Function to get game title by gameId
export const getGameTitle = (gameId) => {
  if (!gameId) return null;
  
  // First check the mapping
  if (gameIdToTitleMap[gameId]) {
    return gameIdToTitleMap[gameId];
  }
  
  // If not found, try to extract from gameId pattern
  // e.g., "finance-kids-6" -> "Poster: Saving Habit"
  // This is a fallback - ideally all games should be in the map above
  return null;
};

// Function to infer game type/pillar from gameId when not present in DB
export const getGameType = (gameId) => {
  if (!gameId || typeof gameId !== 'string') return null;
  const lower = gameId.toLowerCase();
  if (lower.startsWith('finance-')) return 'finance';
  if (lower.startsWith('financial-')) return 'finance';
  if (lower.startsWith('brain-')) return 'brain';
  if (lower.startsWith('mental-')) return 'mental';
  if (lower.startsWith('uvls-')) return 'uvls';
  if (lower.startsWith('dcos-') || lower.startsWith('digital-')) return 'dcos';
  if (lower.startsWith('moral-')) return 'moral';
  if (lower.startsWith('ai-')) return 'ai';
  if (lower.startsWith('ehe-')) return 'ehe';
  if (lower.startsWith('crgc-')) return 'crgc';
  return null;
};

// Map internal type to display pillar label
export const getPillarLabel = (type) => {
  if (!type) return null;
  const t = String(type).toLowerCase();
  switch (t) {
    case 'finance':
    case 'financial':
      return 'Finance';
    case 'brain':
      return 'Brain Health';
    case 'mental':
      return 'Mental Health';
    case 'ai':
      return 'AI for All';
    case 'educational':
      return 'Educational';
    case 'uvls':
      return 'UVLS';
    case 'dcos':
      return 'Digital Citizenship';
    case 'moral':
      return 'Moral Values';
    case 'ehe':
      return 'EHE';
    case 'crgc':
      return 'CRGC';
    default:
      return t.charAt(0).toUpperCase() + t.slice(1);
  }
};

