import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AITranslatorReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 👇 Each item is a reflex test — translate foreign word into English
  const items = [
    { id: 1, emoji: "🇪🇸", word: "Hola", correct: "Hello" },
    { id: 2, emoji: "🇫🇷", word: "Merci", correct: "Thank you" },
    { id: 3, emoji: "🇩🇪", word: "Tschüss", correct: "Goodbye" },
    { id: 4, emoji: "🇮🇹", word: "Amore", correct: "Love" },
    { id: 5, emoji: "🇯🇵", word: "Neko", correct: "Cat" },
    { id: 6, emoji: "🇰🇷", word: "Annyeong", correct: "Hi" },
    { id: 7, emoji: "🇨🇳", word: "Xie Xie", correct: "Thanks" },
    { id: 8, emoji: "🇷🇺", word: "Privet", correct: "Hi" },
    { id: 9, emoji: "🇧🇷", word: "Amigo", correct: "Friend" },
    { id: 10, emoji: "🇸🇦", word: "Salam", correct: "Peace" },
  ];

  // For each word, generate 2 random options (1 correct + 1 distractor)
  const generateChoices = (item) => {
    const allWords = items.map((i) => i.correct);
    let distractor;
    do {
      distractor = allWords[Math.floor(Math.random() * allWords.length)];
    } while (distractor === item.correct);

    const options = [item.correct, distractor].sort(() => Math.random() - 0.5);
    return options;
  };

  const currentItemData = items[currentItem];
  const [options, setOptions] = useState(generateChoices(items[0]));

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 2);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        const nextIndex = currentItem + 1;
        setCurrentItem(nextIndex);
        setOptions(generateChoices(items[nextIndex]));
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    setOptions(generateChoices(items[0]));
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-in-farming-story");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="AI Translator Reflex"
      score={coins}
      subtitle={`Word ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-teen-34"
      gameType="ai"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Translate this word 👇
            </h3>

            <div className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl p-12 mb-6">
              <div className="text-8xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-white text-3xl font-bold text-center">
                “{currentItemData.word}”
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="bg-purple-500/30 hover:bg-purple-500/50 border-3 border-purple-400 rounded-xl p-8 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">{opt}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Language Master!" : "💬 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You translated {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Language AIs like Google Translate and ChatGPT help break barriers between
                cultures! Each correct translation earns you rewards while learning globally! 🌍
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>

            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AITranslatorReflex;
