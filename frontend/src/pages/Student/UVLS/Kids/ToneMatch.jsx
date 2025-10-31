import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ToneMatch = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedTone, setSelectedTone] = useState(null); // State for tracking selected tone
  const [selectedIntent, setSelectedIntent] = useState(null); // State for tracking selected intent
  const [userMatches, setUserMatches] = useState({}); // State for tracking user matches
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      tones: ["Happy", "Angry", "Soft"],
      intents: ["Excited news", "Mad at mistake", "Calm story"],
      correct: { "Happy": "Excited news", "Angry": "Mad at mistake", "Soft": "Calm story" }
    },
    {
      id: 2,
      tones: ["Sad", "Loud", "Quiet"],
      intents: ["Bad day", "Yelling game", "Whisper secret"],
      correct: { "Sad": "Bad day", "Loud": "Yelling game", "Quiet": "Whisper secret" }
    },
    {
      id: 3,
      tones: ["Scared", "Joyful", "Serious"],
      intents: ["Scary story", "Birthday surprise", "Important talk"],
      correct: { "Scared": "Scary story", "Joyful": "Birthday surprise", "Serious": "Important talk" }
    },
    {
      id: 4,
      tones: ["Playful", "Tired", "Energetic"],
      intents: ["Joke time", "Sleepy bedtime", "Run play"],
      correct: { "Playful": "Joke time", "Tired": "Sleepy bedtime", "Energetic": "Run play" }
    },
    {
      id: 5,
      tones: ["Kind", "Mean", "Neutral"],
      intents: ["Help offer", "Tease", "Fact state"],
      correct: { "Kind": "Help offer", "Mean": "Tease", "Neutral": "Fact state" }
    }
  ];

  // Function to handle tone selection
  const selectTone = (tone) => {
    setSelectedTone(tone);
    // If both tone and intent are selected, create a match
    if (selectedIntent) {
      const newMatches = { ...userMatches, [tone]: selectedIntent };
      setUserMatches(newMatches);
      setSelectedTone(null);
      setSelectedIntent(null);
    }
  };

  // Function to handle intent selection
  const selectIntent = (intent) => {
    setSelectedIntent(intent);
    // If both tone and intent are selected, create a match
    if (selectedTone) {
      const newMatches = { ...userMatches, [selectedTone]: intent };
      setUserMatches(newMatches);
      setSelectedTone(null);
      setSelectedIntent(null);
    }
  };

  const handleMatch = () => {
    const newMatches = [...matches, userMatches];
    setMatches(newMatches);

    const isCorrect = Object.keys(questions[currentLevel].correct).every(key => userMatches[key] === questions[currentLevel].correct[key]);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setUserMatches({}); // Reset matches for next level
        setSelectedTone(null);
        setSelectedIntent(null);
      }, isCorrect ? 800 : 0);
    } else {
      const correctMatches = newMatches.filter((um, idx) => Object.keys(questions[idx].correct).every(key => um[key] === questions[idx].correct[key])).length;
      setFinalScore(correctMatches);
      if (correctMatches >= 4) {
        setCoins(5);
      }
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
    setSelectedTone(null);
    setSelectedIntent(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Tone Match"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      showGameOver={showResult && finalScore >= 4}
      score={coins}
      gameId="uvls-kids-64"
      gameType="uvls"
      totalLevels={70}
      currentLevel={64}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Match tones to intents!</p>
              
              {/* Tones section */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Tones:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().tones.map(tone => (
                    <button
                      key={tone}
                      onClick={() => selectTone(tone)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedTone === tone
                          ? "bg-blue-400 text-white ring-2 ring-blue-300"
                          : userMatches[tone]
                          ? "bg-green-500 text-white"
                          : "bg-blue-500/80 text-white hover:bg-blue-500"
                      }`}
                    >
                      {tone} 🗣️
                      {userMatches[tone] && (
                        <span className="ml-2 text-xs">→ {userMatches[tone]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Intents section */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Intents:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().intents.map(intent => (
                    <button
                      key={intent}
                      onClick={() => selectIntent(intent)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedIntent === intent
                          ? "bg-green-400 text-white ring-2 ring-green-300"
                          : Object.values(userMatches).includes(intent)
                          ? "bg-purple-500 text-white"
                          : "bg-green-500/80 text-white hover:bg-green-500"
                      }`}
                    >
                      {intent} 💭
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current matches display */}
              {Object.keys(userMatches).length > 0 && (
                <div className="mb-4 p-3 bg-white/10 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Your Matches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userMatches).map(([tone, intent]) => (
                      <div key={tone} className="bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {tone} → {intent}
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 4 ? "🎉 Tone Matcher!" : "💪 Match More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched correctly {finalScore} times!
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

export default ToneMatch;