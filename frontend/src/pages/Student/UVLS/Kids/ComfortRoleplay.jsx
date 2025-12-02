import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const ComfortRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-8";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [currentVignette, setCurrentVignette] = useState(0);
  const [selectedPhrases, setSelectedPhrases] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [vignetteResults, setVignetteResults] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const vignettes = [
    {
      id: 1,
      situation: "Your friend is crying because they lost their favorite toy.",
      emoji: "😢",
      phrases: [
        { id: 1, text: "I'm sorry you're sad. Can I help you look for it?", isCorrect: true },
        { id: 2, text: "It's just a toy, get over it.", isCorrect: false },
        { id: 3, text: "I understand how you feel. Want to talk about it?", isCorrect: true },
        { id: 4, text: "Stop crying, it's not a big deal.", isCorrect: false },
        { id: 5, text: "Let me sit with you until you feel better.", isCorrect: true }
      ],
      peerResponse: {
        good: "Thank you for being so kind and understanding! 😊",
        bad: "That didn't make me feel better... 😔"
      }
    },
    {
      id: 2,
      situation: "Your classmate is upset because they got a bad grade.",
      emoji: "📝",
      phrases: [
        { id: 1, text: "You can do better next time. I believe in you!", isCorrect: true },
        { id: 2, text: "You're not smart enough, that's why.", isCorrect: false },
        { id: 3, text: "Let's study together next time!", isCorrect: true },
        { id: 4, text: "I told you so, you should have studied more.", isCorrect: false },
        { id: 5, text: "It's okay to make mistakes. We all do.", isCorrect: true }
      ],
      peerResponse: {
        good: "Thanks for being supportive! I feel much better now. 🌟",
        bad: "Your words made me feel worse... 😢"
      }
    },
    {
      id: 3,
      situation: "A new student is sitting alone and looks lonely.",
      emoji: "😔",
      phrases: [
        { id: 1, text: "Hi! Want to sit with me and my friends?", isCorrect: true },
        { id: 2, text: "Why are you sitting alone? That's weird.", isCorrect: false },
        { id: 3, text: "Being new can be hard. I'm here if you want to talk.", isCorrect: true },
        { id: 4, text: "You look sad. What's wrong with you?", isCorrect: false },
        { id: 5, text: "Let me show you around and introduce you to people!", isCorrect: true }
      ],
      peerResponse: {
        good: "Thank you so much! I feel welcome now! 😊",
        bad: "That made me feel even more alone... 😞"
      }
    }
  ];

  const handlePhraseToggle = (phraseId) => {
    if (selectedPhrases.includes(phraseId)) {
      setSelectedPhrases(selectedPhrases.filter(id => id !== phraseId));
    } else if (selectedPhrases.length < 3) {
      setSelectedPhrases([...selectedPhrases, phraseId]);
    }
  };

  const handleConfirm = () => {
    if (selectedPhrases.length !== 3) return;

    const vignette = vignettes[currentVignette];
    const selectedPhraseObjects = vignette.phrases.filter(p => selectedPhrases.includes(p.id));
    const correctCount = selectedPhraseObjects.filter(p => p.isCorrect).length;
    const isGood = correctCount >= 2; // Need at least 2 correct phrases

    const result = {
      vignetteId: vignette.id,
      selectedPhrases: selectedPhraseObjects,
      isGood,
      correctCount
    };

    setVignetteResults([...vignetteResults, result]);

    if (isGood) {
      setCoins(prev => prev + 1); // 1 coin for correct vignette
      showCorrectAnswerFeedback(1, true);
    }

    if (currentVignette < vignettes.length - 1) {
      setTimeout(() => {
        setCurrentVignette(prev => prev + 1);
        setSelectedPhrases([]);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentVignette(0);
    setSelectedPhrases([]);
    setVignetteResults([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const vignette = vignettes[currentVignette];
  const totalGood = vignetteResults.filter(r => r.isGood).length;

  return (
    <GameShell
      title="Comfort Roleplay"
      score={coins}
      subtitle={`Situation ${currentVignette + 1} of ${vignettes.length}`}
      onNext={handleNext}
      nextEnabled={showResult && totalGood >= 2}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && totalGood >= 2}
      
      gameId="uvls-kids-8"
      gameType="uvls"
      totalLevels={10}
      currentLevel={8}
      showConfetti={showResult && totalGood >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-6xl mb-4 text-center">{vignette.emoji}</div>
              
              <p className="text-white text-lg mb-6 font-semibold text-center">
                {vignette.situation}
              </p>

              <p className="text-white/90 mb-4 text-center">
                Choose 3 kind phrases to say ({selectedPhrases.length}/3):
              </p>

              <div className="space-y-3 mb-6">
                {vignette.phrases.map(phrase => (
                  <button
                    key={phrase.id}
                    onClick={() => handlePhraseToggle(phrase.id)}
                    disabled={!selectedPhrases.includes(phrase.id) && selectedPhrases.length >= 3}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedPhrases.includes(phrase.id)
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${!selectedPhrases.includes(phrase.id) && selectedPhrases.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-white font-medium">{phrase.text}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={selectedPhrases.length !== 3}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedPhrases.length === 3
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Say These Phrases
              </button>

              {vignetteResults.length > 0 && vignetteResults[vignetteResults.length - 1] && (
                <div className={`mt-4 p-4 rounded-xl ${
                  vignetteResults[vignetteResults.length - 1].isGood
                    ? 'bg-green-500/30 border-2 border-green-400'
                    : 'bg-red-500/30 border-2 border-red-400'
                }`}>
                  <p className="text-white font-medium">
                    {vignetteResults[vignetteResults.length - 1].isGood
                      ? vignettes[vignetteResults.length - 1].peerResponse.good
                      : vignettes[vignetteResults.length - 1].peerResponse.bad}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {totalGood >= 2 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">You're So Comforting!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You comforted {totalGood} out of {vignettes.length} friends well!
                  You know how to be kind and supportive!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{totalGood} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Comforting others means showing empathy, offering help, and being understanding!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You comforted {totalGood} out of {vignettes.length} friends well.
                  Remember: Choose kind and understanding phrases!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Comfort others by showing empathy, offering help, and being understanding. Practice saying these phrases out loud with the right tone!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ComfortRoleplay;

