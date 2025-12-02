import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MoodMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-43";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedBehavior, setSelectedBehavior] = useState(null); // State for tracking selected behavior
  const [selectedMood, setSelectedMood] = useState(null); // State for tracking selected mood
  const [userMatches, setUserMatches] = useState({}); // State for tracking user matches
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      behaviors: ["Crying", "Smiling", "Yelling"],
      moods: ["Sad", "Happy", "Angry"],
      correct: { "Crying": "Sad", "Smiling": "Happy", "Yelling": "Angry" }
    },
    {
      id: 2,
      behaviors: ["Hiding", "Jumping", "Frowning"],
      moods: ["Scared", "Excited", "Sad"],
      correct: { "Hiding": "Scared", "Jumping": "Excited", "Frowning": "Sad" }
    },
    {
      id: 3,
      behaviors: ["Quiet", "Laughing", "Pouting"],
      moods: ["Calm", "Happy", "Angry"],
      correct: { "Quiet": "Calm", "Laughing": "Happy", "Pouting": "Angry" }
    },
    {
      id: 4,
      behaviors: ["Running away", "Hugging", "Stomping"],
      moods: ["Scared", "Happy", "Angry"],
      correct: { "Running away": "Scared", "Hugging": "Happy", "Stomping": "Angry" }
    },
    {
      id: 5,
      behaviors: ["Sighing", "Clapping", "Shivering"],
      moods: ["Sad", "Excited", "Scared"],
      correct: { "Sighing": "Sad", "Clapping": "Excited", "Shivering": "Scared" }
    }
  ];

  // Function to handle behavior selection
  const selectBehavior = (behavior) => {
    setSelectedBehavior(behavior);
    // If both behavior and mood are selected, create a match
    if (selectedMood) {
      const newMatches = { ...userMatches, [behavior]: selectedMood };
      setUserMatches(newMatches);
      setSelectedBehavior(null);
      setSelectedMood(null);
    }
  };

  // Function to handle mood selection
  const selectMood = (mood) => {
    setSelectedMood(mood);
    // If both behavior and mood are selected, create a match
    if (selectedBehavior) {
      const newMatches = { ...userMatches, [selectedBehavior]: mood };
      setUserMatches(newMatches);
      setSelectedBehavior(null);
      setSelectedMood(null);
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
        setSelectedBehavior(null);
        setSelectedMood(null);
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
    setSelectedBehavior(null);
    setSelectedMood(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Mood Match"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 4}
      
      gameId="uvls-kids-43"
      gameType="uvls"
      totalLevels={50}
      currentLevel={43}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Match behaviors to moods!</p>
              
              {/* Behaviors section */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Behaviors:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().behaviors.map(beh => (
                    <button
                      key={beh}
                      onClick={() => selectBehavior(beh)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedBehavior === beh
                          ? "bg-blue-400 text-white ring-2 ring-blue-300"
                          : userMatches[beh]
                          ? "bg-green-500 text-white"
                          : "bg-blue-500/80 text-white hover:bg-blue-500"
                      }`}
                    >
                      {beh} 😐
                      {userMatches[beh] && (
                        <span className="ml-2 text-xs">→ {userMatches[beh]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Moods section */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Moods:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().moods.map(mood => (
                    <button
                      key={mood}
                      onClick={() => selectMood(mood)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedMood === mood
                          ? "bg-green-400 text-white ring-2 ring-green-300"
                          : Object.values(userMatches).includes(mood)
                          ? "bg-purple-500 text-white"
                          : "bg-green-500/80 text-white hover:bg-green-500"
                      }`}
                    >
                      {mood} 💭
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current matches display */}
              {Object.keys(userMatches).length > 0 && (
                <div className="mb-4 p-3 bg-white/10 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Your Matches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userMatches).map(([behavior, mood]) => (
                      <div key={behavior} className="bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {behavior} → {mood}
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
                <h3 className="text-2xl font-bold text-white mb-4">Mood Matcher!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched correctly {finalScore} out of {questions.length} times!
                  You understand how behaviors connect to moods!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding how behaviors connect to moods helps us recognize and respond to emotions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Match More!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched correctly {finalScore} out of {questions.length} times.
                  Keep practicing to understand how behaviors connect to moods!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Pay attention to how different behaviors show different moods. Practice matching them!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MoodMatch;