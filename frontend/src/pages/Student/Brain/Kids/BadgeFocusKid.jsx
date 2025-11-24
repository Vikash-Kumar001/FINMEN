import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble, LevelCompleteHandler } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const BadgeFocusKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-20";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [levelCompleted] = React.useState(true);

  // This badge is awarded for completing all the focus games
  const badgeCriteria = [
    "Completed Classroom Story",
    "Passed Focus Quiz",
    "Demonstrated Attention Reflex",
    "Solved Focus Puzzle",
    "Understood Homework Focus",
    "Created Focus Matters Poster",
    "Documented Focus Strategies in Journal",
    "Learned Game Balance",
    "Practiced Quick Attention Reflex",
    "Showed Consistent Focus Skills"
  ];

  const handleNext = () => {
    navigate('/games/brain-health/kids');
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Focus Kid Badge"
      score={100}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-20"
      gameType="brain-health"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={levelCompleted}
      nextLabel="Complete"
      backPath="/games/brain-health/kids"
    
      maxScore={1} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <LevelCompleteHandler
        gameId="brain-kids-20"
        gameType="brain-health"
        levelNumber={1}
        levelScore={100}
        maxLevelScore={100}
      >
        <GameCard>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 text-white">Focus Kid Badge</h3>
            
            <div className="mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Congratulations!</h4>
              <p className="text-white/80 max-w-md mx-auto">
                You've earned the Focus Kid badge for completing all the focus and attention games!
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 mb-8 text-left">
              <h5 className="text-lg font-semibold mb-4 text-white">Badge Requirements:</h5>
              <ul className="space-y-2">
                {badgeCriteria.map((criterion, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/90">{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-6 mb-8">
              <h5 className="font-medium text-blue-300 mb-2">Skills You've Developed:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-blue-200">✓ Improved concentration and attention</p>
                  <p className="text-blue-200">✓ Better focus during learning activities</p>
                  <p className="text-blue-200">✓ Enhanced ability to ignore distractions</p>
                </div>
                <div>
                  <p className="text-blue-200">✓ Developed study and homework strategies</p>
                  <p className="text-blue-200">✓ Built self-awareness of focus habits</p>
                  <p className="text-blue-200">✓ Practiced mindfulness techniques</p>
                </div>
              </div>
            </div>
          </div>
        </GameCard>
      </LevelCompleteHandler>
    </GameShell>
  );
};

export default BadgeFocusKid;