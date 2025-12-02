import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InviteRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-18";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
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
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentScene < scenes.length - 1) {
      setTimeout(() => {
        setCurrentScene(prev => prev + 1);
        setSelectedPhrase(null);
      }, 1500);
    } else {
      const inclusiveCount = [...sceneResults, result].filter(r => r.isInclusive).length;
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {inclusiveCount >= 2 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Inviting!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You used inclusive phrases {inclusiveCount} out of {scenes.length} times!
                  You know how to make everyone feel welcome!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{inclusiveCount} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Inviting others and being inclusive makes everyone feel welcome and valued!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You used inclusive phrases {inclusiveCount} out of {scenes.length} times.
                  Remember to invite others and be welcoming!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Use phrases that invite others to join and make them feel welcome. Pair shy students with buddies!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InviteRoleplay;

