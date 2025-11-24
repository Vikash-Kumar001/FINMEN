import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const BadgeBrainHealthHero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-10";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;

  const handleGameComplete = () => {
    navigate('/games/brain-health/teens');
  };

  // This badge is awarded for completing brain health practices
  const badgeCriteria = [
    "Completed Exercise Story",
    "Passed Habits Quiz",
    "Demonstrated Mind Reflex",
    "Solved Brain Fuel Puzzle",
    "Understood Junk Food Impact",
    "Participated in Brain vs Body Debate",
    "Documented Brain Fitness in Journal",
    "Chose Healthy Daily Routine",
    "Practiced Brain Boost Reflex"
  ];

  return (
    <GameShell
      title="Brain Health Hero Badge"
      score={100}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={true}
      backPath="/games/brain-health/teens"
    >
      <GameCard>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-white">Brain Health Hero Badge</h3>
          
          <div className="mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Congratulations!</h4>
            <p className="text-white/80 max-w-md mx-auto">
              You've earned the Brain Health Hero badge for completing brain health practices!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left">
            <h5 className="text-lg font-semibold mb-4 text-white">Badge Requirements:</h5>
            <ul className="space-y-2">
              {badgeCriteria.map((criterion, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-6 mb-8">
            <h5 className="font-medium text-blue-300 mb-2">Skills You've Developed:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-white/80">✓ Understanding brain-healthy habits</p>
                <p className="text-white/80">✓ Recognizing good vs bad choices</p>
                <p className="text-white/80">✓ Building daily healthy routines</p>
              </div>
              <div>
                <p className="text-white/80">✓ Improving focus and concentration</p>
                <p className="text-white/80">✓ Making informed health choices</p>
                <p className="text-white/80">✓ Practicing self-reflection</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleGameComplete}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold hover:opacity-90 transition duration-200 shadow-lg"
          >
            Return to Brain Health Dashboard
          </button>
        </div>
      </GameCard>
    </GameShell>
  );
};

export default BadgeBrainHealthHero;