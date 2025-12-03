import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CommunityRolesPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-84";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [userMatches, setUserMatches] = useState({});
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      helpers: ["Doctor", "Teacher", "Police"],
      jobs: ["Teach kids", "Keep safe", "Heal sick"],
      correct: { "Doctor": "Heal sick", "Teacher": "Teach kids", "Police": "Keep safe" }
    },
    {
      id: 2,
      helpers: ["Firefighter", "Farmer", "Postman"],
      jobs: ["Deliver mail", "Fight fire", "Grow food"],
      correct: { "Firefighter": "Fight fire", "Farmer": "Grow food", "Postman": "Deliver mail" }
    },
    {
      id: 3,
      helpers: ["Librarian", "Vet", "Baker"],
      jobs: ["Bake bread", "Lend books", "Care animals"],
      correct: { "Librarian": "Lend books", "Vet": "Care animals", "Baker": "Bake bread" }
    },
    {
      id: 4,
      helpers: ["Mechanic", "Nurse", "Pilot"],
      jobs: ["Fly planes", "Fix cars", "Help patients"],
      correct: { "Mechanic": "Fix cars", "Nurse": "Help patients", "Pilot": "Fly planes" }
    },
    {
      id: 5,
      helpers: ["Chef", "Builder", "Artist"],
      jobs: ["Make art", "Build houses", "Cook meals"],
      correct: { "Chef": "Cook meals", "Builder": "Build houses", "Artist": "Make art" }
    }
  ];

  const handleHelperClick = (helper) => {
    setSelectedHelper(helper);
  };

  const handleJobClick = (job) => {
    if (selectedHelper) {
      // Create a new match
      const newMatches = { ...userMatches, [selectedHelper]: job };
      setUserMatches(newMatches);
      setSelectedHelper(null); // Reset selection
    }
  };

  const handleMatch = () => {
    const newMatches = [...matches, userMatches];
    setMatches(newMatches);

    const isCorrect = Object.keys(questions[currentLevel].correct).every(key => userMatches[key] === questions[currentLevel].correct[key]);
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setUserMatches({}); // Reset for next level
        setSelectedHelper(null);
      }, isCorrect ? 800 : 0);
    } else {
      const correctMatches = newMatches.filter((um, idx) => Object.keys(questions[idx].correct).every(key => um[key] === questions[idx].correct[key])).length;
      setFinalScore(correctMatches);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setMatches([]);
    setCoins(0);
    setFinalScore(0);
    setUserMatches({});
    setSelectedHelper(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Community Roles Puzzle"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 4}
      
      gameId="uvls-kids-84"
      gameType="uvls"
      totalLevels={100}
      currentLevel={84}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Match helpers to jobs!</p>
              
              {/* Display current matches */}
              <div className="mb-4 min-h-[30px]">
                {Object.entries(userMatches).map(([helper, job]) => (
                  <p key={`${helper}-${job}`} className="text-white">
                    {helper} → {job} ✅
                  </p>
                ))}
                {selectedHelper && (
                  <p className="text-yellow-300">
                    Selected: {selectedHelper} (now tap a job)
                  </p>
                )}
              </div>
              
              {/* Helpers */}
              <div className="flex flex-wrap gap-4">
                {getCurrentLevel().helpers.map(helper => (
                  <div 
                    key={helper} 
                    className={`p-2 rounded cursor-pointer ${selectedHelper === helper ? 'bg-yellow-500' : userMatches[helper] ? 'bg-green-500' : 'bg-blue-500'}`}
                    onClick={() => handleHelperClick(helper)}
                  >
                    {helper} 👥
                  </div>
                ))}
              </div>
              
              {/* Jobs */}
              <div className="flex flex-wrap gap-4 mt-4">
                {getCurrentLevel().jobs.map(job => (
                  <div 
                    key={job} 
                    className={`p-2 rounded cursor-pointer ${Object.values(userMatches).includes(job) ? 'bg-green-500' : 'bg-green-500'}`}
                    onClick={() => handleJobClick(job)}
                  >
                    {job} 🛠️
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleMatch} 
                className="mt-4 bg-purple-500 text-white p-2 rounded"
                disabled={Object.keys(userMatches).length !== getCurrentLevel().helpers.length}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Roles Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched correctly {finalScore} out of {questions.length} times!
                  You understand community roles!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding different community roles helps us appreciate how everyone contributes!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Match More!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched correctly {finalScore} out of {questions.length} times.
                  Keep learning about community roles!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Learn about different jobs in your community - doctors, teachers, firefighters, and more!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CommunityRolesPuzzle;