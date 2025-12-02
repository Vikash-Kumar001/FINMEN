import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TypesMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-34";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedType, setSelectedType] = useState(null); // State for tracking selected type
  const [selectedExample, setSelectedExample] = useState(null); // State for tracking selected example
  const [userMatches, setUserMatches] = useState({}); // State for tracking user matches
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      types: ["Physical", "Verbal", "Cyber"],
      examples: ["Pushing", "Name-calling", "Mean texts"],
      correct: { "Physical": "Pushing", "Verbal": "Name-calling", "Cyber": "Mean texts" }
    },
    {
      id: 2,
      types: ["Physical", "Verbal", "Cyber"],
      examples: ["Hitting", "Insults", "Online rumors"],
      correct: { "Physical": "Hitting", "Verbal": "Insults", "Cyber": "Online rumors" }
    },
    {
      id: 3,
      types: ["Physical", "Verbal", "Cyber"],
      examples: ["Tripping", "Mocking", "Hateful posts"],
      correct: { "Physical": "Tripping", "Verbal": "Mocking", "Cyber": "Hateful posts" }
    },
    {
      id: 4,
      types: ["Physical", "Verbal", "Cyber"],
      examples: ["Stealing items", "Threats", "Cyber exclusion"],
      correct: { "Physical": "Stealing items", "Verbal": "Threats", "Cyber": "Cyber exclusion" }
    },
    {
      id: 5,
      types: ["Physical", "Verbal", "Cyber"],
      examples: ["Destroying property", "Spreading lies", "Fake profiles"],
      correct: { "Physical": "Destroying property", "Verbal": "Spreading lies", "Cyber": "Fake profiles" }
    }
  ];

  // Function to handle type selection
  const selectType = (type) => {
    setSelectedType(type);
    // If both type and example are selected, create a match
    if (selectedExample) {
      const newMatches = { ...userMatches, [type]: selectedExample };
      setUserMatches(newMatches);
      setSelectedType(null);
      setSelectedExample(null);
    }
  };

  // Function to handle example selection
  const selectExample = (example) => {
    setSelectedExample(example);
    // If both type and example are selected, create a match
    if (selectedType) {
      const newMatches = { ...userMatches, [selectedType]: example };
      setUserMatches(newMatches);
      setSelectedType(null);
      setSelectedExample(null);
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
        setUserMatches({}); // Reset matches for next level
        setSelectedType(null);
        setSelectedExample(null);
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
    setUserMatches({}); // Reset matches
    setSelectedType(null);
    setSelectedExample(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Types Match"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 4}
      
      gameId="uvls-kids-34"
      gameType="uvls"
      totalLevels={50}
      currentLevel={34}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Match bullying types to examples!</p>
              
              {/* Types section */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Bullying Types:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().types.map(type => (
                    <button
                      key={type}
                      onClick={() => selectType(type)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedType === type
                          ? "bg-blue-400 text-white ring-2 ring-blue-300"
                          : userMatches[type]
                          ? "bg-green-500 text-white"
                          : "bg-blue-500/80 text-white hover:bg-blue-500"
                      }`}
                    >
                      {type} 🚫
                      {userMatches[type] && (
                        <span className="ml-2 text-xs">→ {userMatches[type]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Examples section */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Examples:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().examples.map(ex => (
                    <button
                      key={ex}
                      onClick={() => selectExample(ex)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedExample === ex
                          ? "bg-green-400 text-white ring-2 ring-green-300"
                          : Object.values(userMatches).includes(ex)
                          ? "bg-purple-500 text-white"
                          : "bg-green-500/80 text-white hover:bg-green-500"
                      }`}
                    >
                      {ex} 💥
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current matches display */}
              {Object.keys(userMatches).length > 0 && (
                <div className="mb-4 p-3 bg-white/10 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Your Matches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userMatches).map(([type, example]) => (
                      <div key={type} className="bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {type} → {example}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Submit button */}
              <button 
                onClick={handleMatch} 
                className="mt-2 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition"
                disabled={Object.keys(userMatches).length === 0}
              >
                Submit Matches ({Object.keys(userMatches).length})
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Type Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched correctly {finalScore} out of {questions.length} times!
                  You understand different types of bullying!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding different types of bullying helps us recognize and stop it!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Match Better!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched correctly {finalScore} out of {questions.length} times.
                  Keep learning about different types of bullying!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Bullying can be physical, verbal, or cyber. Learn to recognize all types!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TypesMatch;