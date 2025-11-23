import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const InviteRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentScene, setCurrentScene] = useState(0);
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [sceneResults, setSceneResults] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenes = [
    {
      id: 1,
      description: "A shy student is standing alone during group activities",
      emoji: "🧍",
      phrases: [
        { id: 1, text: "Hey! Want to be in our group?", isInclusive: true, response: "Thank you! I'd love to join! 😊" },
        { id: 2, text: "You can watch us if you want", isInclusive: false, response: "Oh... okay... 😔" },
        { id: 3, text: "We already have enough people", isInclusive: false, response: "I feel left out... 😢" },
        { id: 4, text: "Come on! We need one more person!", isInclusive: true, response: "Really? Thanks so much! 😄" }
      ]
    },
    {
      id: 2,
      description: "A new student looks confused during PE class",
      emoji: "🤸",
      phrases: [
        { id: 1, text: "Want me to explain the game rules?", isInclusive: true, response: "Yes please! That would help! 😊" },
        { id: 2, text: "Figure it out yourself", isInclusive: false, response: "I don't understand... 😰" },
        { id: 3, text: "Don't you know how to play?", isInclusive: false, response: "I feel embarrassed... 😞" },
        { id: 4, text: "I'll be your partner and help!", isInclusive: true, response: "That's so kind! Thank you! 😃" }
      ]
    },
    {
      id: 3,
      description: "Someone is sitting alone during art time",
      emoji: "🖌️",
      phrases: [
        { id: 1, text: "Want to create something together?", isInclusive: true, response: "I'd love to! 🎨" },
        { id: 2, text: "Why aren't you with anyone?", isInclusive: false, response: "I don't know... 😔" },
        { id: 3, text: "You should find your own group", isInclusive: false, response: "I tried... 😢" },
        { id: 4, text: "We have extra supplies, join us!", isInclusive: true, response: "Really? Thanks! 😊" }
      ]
    }
  ];

  const handlePhraseSelect = (phraseId) => {
    setSelectedPhrase(phraseId);
  };

  const handleConfirm = () => {
    if (!selectedPhrase) return;

    const scene = scenes[currentScene];
    const phrase = scene.phrases.find(p => p.id === selectedPhrase);
    
    const result = {
      sceneId: scene.id,
      phraseId: selectedPhrase,
      isInclusive: phrase.isInclusive,
      response: phrase.response
    };

    setSceneResults([...sceneResults, result]);

    if (phrase.isInclusive) {
      showCorrectAnswerFeedback(5, true);
    }

    if (currentScene < scenes.length - 1) {
      setTimeout(() => {
        setCurrentScene(prev => prev + 1);
        setSelectedPhrase(null);
      }, 1500);
    } else {
      const inclusiveCount = [...sceneResults, result].filter(r => r.isInclusive).length;
      if (inclusiveCount >= 2) {
        setCoins(3); // +3 Coins for inclusive phrases (minimum for progress)
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScene(0);
    setSelectedPhrase(null);
    setSceneResults([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const scene = scenes[currentScene];
  const inclusiveCount = sceneResults.filter(r => r.isInclusive).length;
  const lastResult = sceneResults[sceneResults.length - 1];

  return (
    <GameShell
      title="Invite Roleplay"
      score={coins}
      subtitle={`Scene ${currentScene + 1} of ${scenes.length}`}
      onNext={handleNext}
      nextEnabled={showResult && inclusiveCount >= 2}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && inclusiveCount >= 2}
      
      gameId="uvls-kids-18"
      gameType="uvls"
      totalLevels={20}
      currentLevel={18}
      showConfetti={showResult && inclusiveCount >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-6xl mb-4 text-center">{scene.emoji}</div>
              
              <p className="text-white text-lg mb-6 font-semibold text-center">
                {scene.description}
              </p>

              <p className="text-white/90 mb-4 text-center">What do you say?</p>

              <div className="space-y-3 mb-6">
                {scene.phrases.map(phrase => (
                  <button
                    key={phrase.id}
                    onClick={() => handlePhraseSelect(phrase.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedPhrase === phrase.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{phrase.text}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedPhrase}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedPhrase
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Say This Phrase
              </button>

              {lastResult && currentScene > 0 && (
                <div className={`mt-4 p-4 rounded-xl ${
                  lastResult.isInclusive
                    ? 'bg-green-500/30 border-2 border-green-400'
                    : 'bg-red-500/30 border-2 border-red-400'
                }`}>
                  <p className="text-white font-medium">
                    {lastResult.response}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {inclusiveCount >= 2 ? "🎉 Great Inviting!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You used inclusive phrases {inclusiveCount} out of {scenes.length} times!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {inclusiveCount >= 2 ? "You earned 3 Coins! 🪙" : "Get 2 or more right to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Pair shy students with buddies!
            </p>
            {inclusiveCount < 2 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InviteRoleplay;

