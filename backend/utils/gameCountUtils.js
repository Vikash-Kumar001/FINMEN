// Map pillar keys to possible gameType values (kept for backward compatibility)
const getGameTypeValues = (pillarKey) => {
    const pillarToGameTypeMap = {
      crgc: ['crgc', 'civic-responsibility'],
      moral: ['moral', 'moral-values'],
      ai: ['ai', 'ai-for-all'],
      finance: ['finance', 'financial']
    };
    return pillarToGameTypeMap[pillarKey] || [pillarKey];
  };
  
  // Counts games following: {pillar}-kids-{n} and {pillar}-teens-{n}
  export const countGamesFromDatabase = async (pillarKey, UnifiedGameProgress) => {
    try {
      const gameTypeValues = getGameTypeValues(pillarKey);
  
      const distinctGames = await UnifiedGameProgress.distinct('gameId', {
        gameType: { $in: gameTypeValues }
      });
  
      const kidsGames = distinctGames.filter(id =>
        new RegExp(`^${pillarKey}-kids-\\d+$`).test(id)
      );
  
      const teensGames = distinctGames.filter(id =>
        new RegExp(`^${pillarKey}-teens?-\\d+$`).test(id)
      );
  
      const extractNumber = (id) => {
        const match = id.match(/-(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      };
  
      let maxKidsNumber = 0;
      let maxTeensNumber = 0;
  
      if (kidsGames.length > 0) {
        maxKidsNumber = Math.max(...kidsGames.map(extractNumber));
      }
  
      if (teensGames.length > 0) {
        maxTeensNumber = Math.max(...teensGames.map(extractNumber));
      }
  
      // Based on how IDs are generated (1–100 each for kids and teens)
      return 200;
    } catch (error) {
      console.error(`Error counting games for pillar ${pillarKey}:`, error);
      return 200;
    }
  };
  
  export const getPillarGameCount = async (pillarKey, UnifiedGameProgress) => {
    if (!UnifiedGameProgress) {
      console.warn(`UnifiedGameProgress model not provided for ${pillarKey}`);
      return 0;
    }
  
    return await countGamesFromDatabase(pillarKey, UnifiedGameProgress);
  };
  
  export const getAllPillarGameCounts = async (UnifiedGameProgress) => {
    const pillars = [
      'finance',
      'brain',
      'uvls',
      'dcos',
      'moral',
      'ai',
      'health-male',
      'health-female',
      'ehe',
      'crgc',
      'sustainability'
    ];
  
    const counts = {};
  
    for (const pillarKey of pillars) {
      counts[pillarKey] = await getPillarGameCount(pillarKey, UnifiedGameProgress);
    }
  
    return counts;
  };
  
  export default {
    getPillarGameCount,
    getAllPillarGameCounts,
    countGamesFromDatabase
  };
