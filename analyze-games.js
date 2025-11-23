const fs = require('fs');
const path = require('path');

// Define all pillars
const pillars = ['finance', 'brain', 'uvls', 'dcos', 'moral', 'ai', 'health-male', 'health-female', 'ehe', 'crgc', 'sustainability'];

// Function to extract game type/pillar from file path or gameId
function getPillarFromPath(filePath, gameId) {
  const normalizedPath = filePath.toLowerCase();
  const normalizedGameId = (gameId || '').toLowerCase();
  
  // First try to get from gameId
  if (normalizedGameId.startsWith('finance-') || normalizedGameId.startsWith('financial-')) return 'finance';
  if (normalizedGameId.startsWith('brain-')) return 'brain';
  if (normalizedGameId.startsWith('uvls-')) return 'uvls';
  if (normalizedGameId.startsWith('dcos-') || normalizedGameId.startsWith('digital-')) return 'dcos';
  if (normalizedGameId.startsWith('moral-')) return 'moral';
  if (normalizedGameId.startsWith('ai-') || normalizedGameId.startsWith('ai-for-all-')) return 'ai';
  if (normalizedGameId.startsWith('health-male-')) return 'health-male';
  if (normalizedGameId.startsWith('health-female-')) return 'health-female';
  if (normalizedGameId.startsWith('ehe-')) return 'ehe';
  if (normalizedGameId.startsWith('crgc-') || normalizedGameId.startsWith('civic-responsibility-')) return 'crgc';
  if (normalizedGameId.startsWith('sustainability-')) return 'sustainability';
  
  // Then try from file path
  if (normalizedPath.includes('/finance/')) return 'finance';
  if (normalizedPath.includes('/brain/')) return 'brain';
  if (normalizedPath.includes('/uvls/')) return 'uvls';
  if (normalizedPath.includes('/dcos/') || normalizedPath.includes('/digital-citizenship/')) return 'dcos';
  if (normalizedPath.includes('/moral/') || normalizedPath.includes('/moral-values/')) return 'moral';
  if (normalizedPath.includes('/aiforall/') || normalizedPath.includes('/ai-for-all/') || normalizedPath.includes('/ai/')) return 'ai';
  if (normalizedPath.includes('/healthmale/') || normalizedPath.includes('/health-male/')) return 'health-male';
  if (normalizedPath.includes('/healthfemale/') || normalizedPath.includes('/health-female/')) return 'health-female';
  if (normalizedPath.includes('/ehe/')) return 'ehe';
  if (normalizedPath.includes('/crgc/') || normalizedPath.includes('/civic-responsibility/')) return 'crgc';
  if (normalizedPath.includes('/sustainability/')) return 'sustainability';
  
  return null;
}

// Function to extract gameId from file content
function extractGameId(content) {
  const gameIdMatch = content.match(/gameId\s*[:=]\s*["']([^"']+)["']/);
  return gameIdMatch ? gameIdMatch[1] : null;
}

// Function to count questions in a file
function countQuestions(content) {
  // Try multiple patterns to find questions array
  let questionsMatch = content.match(/const\s+questions\s*=\s*\[([\s\S]*?)\];/);
  if (!questionsMatch) {
    questionsMatch = content.match(/let\s+questions\s*=\s*\[([\s\S]*?)\];/);
  }
  if (!questionsMatch) {
    questionsMatch = content.match(/var\s+questions\s*=\s*\[([\s\S]*?)\];/);
  }
  if (!questionsMatch) {
    // Try without const/let/var
    questionsMatch = content.match(/questions\s*=\s*\[([\s\S]*?)\];/);
  }
  
  if (!questionsMatch) {
    return 0;
  }
  
  const questionsContent = questionsMatch[1];
  
  // Count question objects - look for patterns like { id: ..., text: ..., etc }
  // This is a more robust way to count objects in the array
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let questionCount = 0;
  let lastChar = '';
  
  for (let i = 0; i < questionsContent.length; i++) {
    const char = questionsContent[i];
    const prevChar = i > 0 ? questionsContent[i - 1] : '';
    
    // Handle strings
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
      lastChar = char;
      continue;
    }
    
    if (inString) {
      lastChar = char;
      continue;
    }
    
    // Count braces
    if (char === '{') {
      if (depth === 0) {
        questionCount++;
      }
      depth++;
    } else if (char === '}') {
      depth--;
    }
    
    lastChar = char;
  }
  
  return questionCount;
}

// Function to check if questions have pillar property
function checkQuestionsHavePillar(content) {
  return content.includes('pillar') && content.includes('questions');
}

// Recursively find all game files
function findGameFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findGameFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      // Check if it's likely a game file
      if (file.includes('Game') || file.includes('Quiz') || file.includes('Story') || file.includes('Reflex')) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Main analysis
const gamesDir = path.join(process.cwd(), 'frontend', 'src', 'pages', 'Student');
const gameFiles = findGameFiles(gamesDir);

console.log(`Found ${gameFiles.length} potential game files\n`);

const gameAnalysis = [];
const gamesWithOneQuestionPerPillar = [];

gameFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const gameId = extractGameId(content);
    const pillar = getPillarFromPath(filePath, gameId);
    const questionCount = countQuestions(content);
    const hasPillarInQuestions = checkQuestionsHavePillar(content);
    
    if (questionCount > 0) {
      gameAnalysis.push({
        file: path.relative(process.cwd(), filePath),
        pillar,
        gameId,
        questionCount,
        hasPillarInQuestions
      });
    }
  } catch (error) {
    // Skip errors silently
  }
});

// Group by pillar and count
const pillarStats = {};
gameAnalysis.forEach(game => {
  if (game.pillar) {
    if (!pillarStats[game.pillar]) {
      pillarStats[game.pillar] = {
        totalGames: 0,
        gamesWithOneQuestion: 0,
        games: []
      };
    }
    pillarStats[game.pillar].totalGames++;
    pillarStats[game.pillar].games.push({
      file: game.file,
      gameId: game.gameId,
      questionCount: game.questionCount
    });
    
    if (game.questionCount === 1) {
      pillarStats[game.pillar].gamesWithOneQuestion++;
    }
  }
});

// Find games that have exactly 1 question in every pillar they cover
// Since games typically belong to one pillar, we'll check if a game has 1 question
// and if it covers all pillars (which seems unlikely based on structure)

// Actually, let's check if there are games with questions that have pillar properties
const gamesWithPillarQuestions = gameAnalysis.filter(g => g.hasPillarInQuestions);

console.log('=== GAMES WITH QUESTIONS HAVING PILLAR PROPERTY ===');
gamesWithPillarQuestions.forEach(game => {
  console.log(`${game.file} - ${game.questionCount} questions - Pillar: ${game.pillar}`);
});

console.log('\n=== PILLAR STATISTICS ===');
Object.keys(pillarStats).sort().forEach(pillar => {
  const stats = pillarStats[pillar];
  console.log(`\n${pillar.toUpperCase()}:`);
  console.log(`  Total games: ${stats.totalGames}`);
  console.log(`  Games with 1 question: ${stats.gamesWithOneQuestion}`);
  console.log(`  Games with 1 question in this pillar:`);
  stats.games.filter(g => g.questionCount === 1).forEach(g => {
    console.log(`    - ${g.gameId || g.file} (${g.questionCount} question)`);
  });
});

// If the user means games that have questions covering multiple pillars with 1 question each,
// we need to check the actual question structure
console.log('\n=== CHECKING FOR GAMES WITH QUESTIONS ACROSS MULTIPLE PILLARS ===');
console.log('This would require examining the actual question objects for pillar properties.');

// Summary
const totalGamesWithOneQuestion = gameAnalysis.filter(g => g.questionCount === 1).length;
const gamesWithOneQuestion = gameAnalysis.filter(g => g.questionCount === 1);

console.log(`\n=== GAMES WITH EXACTLY 1 QUESTION ===`);
gamesWithOneQuestion.forEach(game => {
  console.log(`  - ${game.gameId || game.file}`);
  console.log(`    Pillar: ${game.pillar || 'Unknown'}`);
  console.log(`    Questions: ${game.questionCount}`);
  console.log('');
});

// Now let's check if any games have questions with pillar properties
console.log('\n=== ANALYZING QUESTION STRUCTURE FOR PILLAR ASSIGNMENTS ===');
let gamesWithPillarInQuestions = 0;
const gamesWithQuestionPillars = [];

gameFiles.slice(0, 50).forEach(filePath => { // Check first 50 for performance
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const pillar = getPillarFromPath(filePath);
    const gameId = extractGameId(content);
    
    // Look for questions array and check if questions have pillar property
    const questionsMatch = content.match(/(?:const|let|var)\s+questions\s*=\s*\[([\s\S]*?)\];/);
    if (questionsMatch) {
      const questionsContent = questionsMatch[1];
      // Check if any question object has a pillar property
      if (questionsContent.includes('pillar') || questionsContent.includes('pillar:')) {
        gamesWithPillarInQuestions++;
        gamesWithQuestionPillars.push({
          file: path.relative(process.cwd(), filePath),
          gameId,
          pillar
        });
      }
    }
  } catch (error) {
    // Skip errors
  }
});

console.log(`Games with pillar properties in questions: ${gamesWithPillarInQuestions}`);
gamesWithQuestionPillars.forEach(game => {
  console.log(`  - ${game.gameId || game.file}`);
});

console.log(`\n=== SUMMARY ===`);
console.log(`Total games analyzed: ${gameAnalysis.length}`);
console.log(`Games with exactly 1 question: ${totalGamesWithOneQuestion}`);
console.log(`Games with questions that might have pillar properties: ${gamesWithPillarQuestions.length}`);
console.log(`\nNOTE: Based on the codebase structure, games typically belong to a single pillar.`);
console.log(`If you're looking for games with questions spanning multiple pillars with 1 question each,`);
console.log(`we would need to examine the actual question objects for pillar assignments.`);

