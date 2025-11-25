import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RightsMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-24";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedRight, setSelectedRight] = useState(null); // State for tracking selected right
  const [selectedScene, setSelectedScene] = useState(null); // State for tracking selected scene
  const [userMatches, setUserMatches] = useState({}); // State for tracking user matches
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      rights: ["Learn", "Play", "Safety"],
      scenes: ["School time", "Park fun", "Safe home"],
      correct: { "Learn": "School time", "Play": "Park fun", "Safety": "Safe home" }
    },
    {
      id: 2,
      rights: ["Food", "Friends", "Rest"],
      scenes: ["Eating meal", "Playing with pals", "Sleeping well"],
      correct: { "Food": "Eating meal", "Friends": "Playing with pals", "Rest": "Sleeping well" }
    },
    {
      id: 3,
      rights: ["Voice", "Health", "Family"],
      scenes: ["Speaking up", "Doctor visit", "With parents"],
      correct: { "Voice": "Speaking up", "Health": "Doctor visit", "Family": "With parents" }
    },
    {
      id: 4,
      rights: ["Education", "Fun", "Protection"],
      scenes: ["Books and class", "Games and toys", "No harm"],
      correct: { "Education": "Books and class", "Fun": "Games and toys", "Protection": "No harm" }
    },
    {
      id: 5,
      rights: ["Equality", "Care", "Growth"],
      scenes: ["Fair treatment", "Love and hugs", "Learning new things"],
      correct: { "Equality": "Fair treatment", "Care": "Love and hugs", "Growth": "Learning new things" }
    }
  ];

  // Function to select a right
  const selectRight = (right) => {
    setSelectedRight(right);
    // If a scene is already selected, create a match
    if (selectedScene) {
      setUserMatches(prev => ({
        ...prev,
        [right]: selectedScene
      }));
      setSelectedScene(null); // Clear scene selection after matching
    }
  };

  // Function to select a scene
  const selectScene = (scene) => {
    setSelectedScene(scene);
    // If a right is already selected, create a match
    if (selectedRight) {
      setUserMatches(prev => ({
        ...prev,
        [selectedRight]: scene
      }));
      setSelectedRight(null); // Clear right selection after matching
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
        setSelectedRight(null); // Reset selection for next level
        setSelectedScene(null); // Reset selection for next level
        setUserMatches({}); // Reset matches for next level
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
    setSelectedRight(null); // Reset selection
    setSelectedScene(null); // Reset selection
    setUserMatches({}); // Reset matches
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  // Function to check if a right is matched
  const isRightMatched = (right) => {
    return userMatches[right] !== undefined;
  };

  // Function to check if a scene is matched
  const isSceneMatched = (scene) => {
    return Object.values(userMatches).includes(scene);
  };

  // Function to get the matched right for a scene
  const getMatchedRight = (scene) => {
    return Object.keys(userMatches).find(right => userMatches[right] === scene);
  };

  return (
    <GameShell
      title="Rights Match"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 4}
      
      gameId="uvls-kids-24"
      gameType="uvls"
      totalLevels={30}
      currentLevel={24}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Match rights to scenes!</p>
              
              {/* Rights section */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Rights:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().rights.map(right => (
                    <button
                      key={right}
                      onClick={() => selectRight(right)}
                      className={`p-3 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                        selectedRight === right
                          ? "bg-blue-400 border-2 border-blue-200" // Visual feedback for selected
                          : isRightMatched(right)
                          ? "bg-green-500 border-2 border-green-300" // Visual feedback for matched
                          : "bg-blue-500 hover:bg-blue-400 border-2 border-blue-600"
                      }`}
                    >
                      <span>{right}</span>
                      <span>⚖️</span>
                      {isRightMatched(right) && <span className="text-lg">✅</span>}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Scenes section */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Scenes:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().scenes.map(scene => (
                    <button
                      key={scene}
                      onClick={() => selectScene(scene)}
                      className={`p-3 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                        selectedScene === scene
                          ? "bg-green-400 border-2 border-green-200" // Visual feedback for selected
                          : isSceneMatched(scene)
                          ? "bg-purple-500 border-2 border-purple-300" // Visual feedback for matched
                          : "bg-green-500 hover:bg-green-400 border-2 border-green-600"
                      }`}
                    >
                      <span>{scene}</span>
                      <span>🖼️</span>
                      {isSceneMatched(scene) && (
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">
                          {getMatchedRight(scene)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current matches display */}
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">Your Matches:</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(userMatches).map(([right, scene]) => (
                    <div key={`${right}-${scene}`} className="bg-purple-500 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                      <span>{right} ↔ {scene}</span>
                      <button 
                        onClick={() => {
                          const newMatches = {...userMatches};
                          delete newMatches[right];
                          setUserMatches(newMatches);
                        }}
                        className="text-white hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {Object.keys(userMatches).length === 0 && (
                    <div className="text-white/70 italic">No matches yet. Click a right and a scene to create a match.</div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={handleMatch} 
                className="mt-2 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={Object.keys(userMatches).length === 0}
              >
                Submit Match ({Object.keys(userMatches).length} pairs)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 4 ? "🎉 Perfect Match!" : "💪 Match Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched correctly in {finalScore} levels!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 4 ? "You earned 5 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 4 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RightsMatch;