import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CatOrDogGame = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const images = [
    { id: 1, emoji: "🐱", type: "cat", correct: "cat" },
    { id: 2, emoji: "🐶", type: "dog", correct: "dog" },
    { id: 3, emoji: "😺", type: "cat", correct: "cat" },
    { id: 4, emoji: "🐕", type: "dog", correct: "dog" },
    { id: 5, emoji: "😸", type: "cat", correct: "cat" },
    { id: 6, emoji: "🦮", type: "dog", correct: "dog" },
    { id: 7, emoji: "😻", type: "cat", correct: "cat" },
    { id: 8, emoji: "🐩", type: "dog", correct: "dog" },
    { id: 9, emoji: "🐈", type: "cat", correct: "cat" },
    { id: 10, emoji: "🐕‍🦺", type: "dog", correct: "dog" }
  ];

  const currentImageData = images[currentImage];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentImageData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentImage < images.length - 1) {
      setTimeout(() => {
        setCurrentImage(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentImage(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/sorting-colors");
  };

  const accuracy = Math.round((score / images.length) * 100);

  return (
    <GameShell
      title="Cat or Dog Game"
      subtitle={`Image ${currentImage + 1} of ${images.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-kids-2"
      gameType="ai"
      totalLevels={20}
      currentLevel={2}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Is this a Cat or Dog?</h3>
            
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-bounce">{currentImageData.emoji}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("cat")}
                className="bg-orange-500/30 hover:bg-orange-500/50 border-3 border-orange-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🐱</div>
                <div className="text-white font-bold text-xl">Cat</div>
              </button>
              <button
                onClick={() => handleChoice("dog")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🐶</div>
                <div className="text-white font-bold text-xl">Dog</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Classification Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You classified {score} out of {images.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 You just learned classification - how AI sorts things into groups! This is how AI 
                recognizes cats, dogs, and many other things!
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
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CatOrDogGame;

