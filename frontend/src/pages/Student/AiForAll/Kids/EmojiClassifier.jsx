import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmojiClassifier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const emojis = [
    {
      id: 1,
      emoji: "😊",
      type: "happy",
      choices: [
        { id: 1, text: "Happy", isCorrect: true },
        { id: 2, text: "Sad",  isCorrect: false },
        { id: 3, text: "Angry",  isCorrect: false }
      ]
    },
    {
      id: 2,
      emoji: "😢",
      type: "sad",
      choices: [
        { id: 1, text: "Excited", isCorrect: false },
        { id: 2, text: "Sad", isCorrect: true },
        { id: 3, text: "Happy",  isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "😃",
      type: "happy",
      choices: [
        { id: 1, text: "Tired",  isCorrect: false },
        { id: 2, text: "Angry",  isCorrect: false },
        { id: 3, text: "Happy", isCorrect: true }
      ]
    },
    {
      id: 4,
      emoji: "😭",
      type: "sad",
      choices: [
        { id: 1, text: "Happy",  isCorrect: false },
        { id: 2, text: "Surprised",  isCorrect: false },
        { id: 3, text: "Sad",  isCorrect: true }
      ]
    },
    {
      id: 5,
      emoji: "😄",
      type: "happy",
      choices: [
        { id: 1, text: "Sad",  isCorrect: false },
        { id: 2, text: "Scared",  isCorrect: false },
        { id: 3, text: "Happy",  isCorrect: true }
      ]
    }
  ];

  const currentEmojiData = emojis[currentEmoji];

  const handleChoice = (choiceId) => {
    const choice = currentEmojiData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentEmojiData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentEmoji < emojis.length - 1) {
      setTimeout(() => {
        setCurrentEmoji(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentEmoji(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/self-driving-car");
  };

  return (
    <GameShell
      title="Emoji Classifier"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Emoji ${currentEmoji + 1} of ${emojis.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={emojis.length}
      gameId="ai-kids-5"
      gameType="ai"
      totalLevels={emojis.length}
      currentLevel={currentEmoji + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">What emotion does this emoji show?</h3>
            
            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl p-16 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-bounce">{currentEmojiData.emoji}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentEmojiData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">{choice.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{choice.text}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Emotion Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {emojis.length} correctly! ({Math.round((finalScore / emojis.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 You just learned classification! AI uses this to understand emotions, just like you did!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {emojis.length} correctly. ({Math.round((finalScore / emojis.length) * 100)}%)
                  Keep practicing to learn more about emotion recognition!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 You just learned classification! AI uses this to understand emotions, just like you did!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmojiClassifier;

