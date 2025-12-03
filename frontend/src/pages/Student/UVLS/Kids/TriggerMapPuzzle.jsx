import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TriggerMapPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-49";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedTrigger, setSelectedTrigger] = useState(null); // State for tracking selected trigger
  const [selectedCalm, setSelectedCalm] = useState(null); // State for tracking selected calm
  const [userMatches, setUserMatches] = useState({}); // State for tracking user matches
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      triggers: ["Angry", "Sad", "Scared"],
      calms: ["Talk", "Hug", "Breathe"],
      correct: { "Angry": "Breathe", "Sad": "Talk", "Scared": "Hug" }
    },
    {
      id: 2,
      triggers: ["Frustrated", "Anxious", "Tired"],
      calms: ["Rest", "Count", "Walk"],
      correct: { "Frustrated": "Count", "Anxious": "Walk", "Tired": "Rest" }
    },
    {
      id: 3,
      triggers: ["Excited too much", "Lonely", "Overwhelmed"],
      calms: ["Break tasks", "Calm down", "Call friend"],
      correct: { "Excited too much": "Calm down", "Lonely": "Call friend", "Overwhelmed": "Break tasks" }
    },
    {
      id: 4,
      triggers: ["Jealous", "Bored", "Nervous"],
      calms: ["Prepare", "Play", "Positive think"],
      correct: { "Jealous": "Positive think", "Bored": "Play", "Nervous": "Prepare" }
    },
    {
      id: 5,
      triggers: ["Hurt", "Confused", "Happy overload"],
      calms: ["Share joy", "Seek help", "Ask question"],
      correct: { "Hurt": "Seek help", "Confused": "Ask question", "Happy overload": "Share joy" }
    }
  ];

  // Function to handle trigger selection
  const selectTrigger = (trigger) => {
    setSelectedTrigger(trigger);
    // If both trigger and calm are selected, create a match
    if (selectedCalm) {
      const newMatches = { ...userMatches, [trigger]: selectedCalm };
      setUserMatches(newMatches);
      setSelectedTrigger(null);
      setSelectedCalm(null);
    }
  };

  // Function to handle calm selection
  const selectCalm = (calm) => {
    setSelectedCalm(calm);
    // If both trigger and calm are selected, create a match
    if (selectedTrigger) {
      const newMatches = { ...userMatches, [selectedTrigger]: calm };
      setUserMatches(newMatches);
      setSelectedTrigger(null);
      setSelectedCalm(null);
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
        setSelectedTrigger(null);
        setSelectedCalm(null);
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
    setSelectedTrigger(null);
    setSelectedCalm(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Trigger Map Puzzle"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 4}
      
      gameId="uvls-kids-49"
      gameType="uvls"
      totalLevels={50}
      currentLevel={49}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Link triggers to calms!</p>
              
              {/* Triggers section */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Triggers:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().triggers.map(trig => (
                    <button
                      key={trig}
                      onClick={() => selectTrigger(trig)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedTrigger === trig
                          ? "bg-red-400 text-white ring-2 ring-red-300"
                          : userMatches[trig]
                          ? "bg-green-500 text-white"
                          : "bg-red-500/80 text-white hover:bg-red-500"
                      }`}
                    >
                      {trig} ⚠️
                      {userMatches[trig] && (
                        <span className="ml-2 text-xs">→ {userMatches[trig]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Calms section */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Calms:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().calms.map(calm => (
                    <button
                      key={calm}
                      onClick={() => selectCalm(calm)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedCalm === calm
                          ? "bg-blue-400 text-white ring-2 ring-blue-300"
                          : Object.values(userMatches).includes(calm)
                          ? "bg-purple-500 text-white"
                          : "bg-blue-500/80 text-white hover:bg-blue-500"
                      }`}
                    >
                      {calm} 😌
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current matches display */}
              {Object.keys(userMatches).length > 0 && (
                <div className="mb-4 p-3 bg-white/10 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Your Matches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userMatches).map(([trigger, calm]) => (
                      <div key={trigger} className="bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {trigger} → {calm}
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
                <h3 className="text-2xl font-bold text-white mb-4">Puzzle Solver!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You solved {finalScore} out of {questions.length} puzzles!
                  You know how to match triggers to calming strategies!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding what triggers you and how to calm down helps you manage your emotions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Puzzle More!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You solved {finalScore} out of {questions.length} puzzles.
                  Keep practicing to match triggers with calming strategies!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Learn to recognize your triggers and practice calming strategies like breathing, talking, or taking a walk!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TriggerMapPuzzle;