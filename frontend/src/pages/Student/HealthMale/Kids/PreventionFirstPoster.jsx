import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PreventionFirstPoster = () => {
  const navigate = useNavigate();
  const [selectedElements, setSelectedElements] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const posterElements = [
    { id: "title", text: "PREVENTION IS BETTER THAN CURE", emoji: "🛡️", category: "title" },
    { id: "prevention", text: "Prevention", emoji: "🚫", category: "word" },
    { id: "cure", text: "Cure", emoji: "💊", category: "word" },
    { id: "better", text: "Better", emoji: "⭐", category: "word" },
    { id: "healthy", text: "Healthy", emoji: "💚", category: "word" },
    { id: "message", text: "Stay healthy before getting sick", emoji: "🏥", category: "message" },
    { id: "wash", text: "Wash Hands", emoji: "🧼", category: "prevention" },
    { id: "mask", text: "Wear Mask", emoji: "😷", category: "prevention" },
    { id: "exercise", text: "Exercise", emoji: "🏃", category: "prevention" },
    { id: "rainbow", text: "🌈", emoji: "🌈", category: "decoration" }
  ];

  const handleElementToggle = (elementId) => {
    if (selectedElements.includes(elementId)) {
      setSelectedElements(prev => prev.filter(id => id !== elementId));
    } else {
      setSelectedElements(prev => [...prev, elementId]);
    }
  };

  React.useEffect(() => {
    // Check if user has selected enough elements to complete the poster
    const requiredElements = ["title", "message"];
    const hasRequired = requiredElements.every(req => selectedElements.includes(req));
    const hasPrevention = posterElements.filter(el => el.category === "prevention").some(el => selectedElements.includes(el.id));

    if (hasRequired && hasPrevention && selectedElements.length >= 5 && !gameFinished) {
      setGameFinished(true);
      showCorrectAnswerFeedback(0, true); // Badge reward
    }
  }, [selectedElements, gameFinished]);

  const handleNext = () => {
    navigate("/student/health-male/kids/safety-journal");
  };

  const selectedCount = selectedElements.length;
  const isComplete = gameFinished;

  return (
    <GameShell
      title="Prevention First Poster"
      subtitle={`Design your poster - ${selectedCount} elements chosen`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={0}
      gameId="health-male-kids-76"
      gameType="health-male"
      totalLevels={80}
      currentLevel={76}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">Create Your Prevention First Poster</h3>
            <p className="text-white/90 mb-4">
              Design a poster that shows "Prevention is Better Than Cure"
            </p>
            <div className="bg-white/20 rounded-full p-3 inline-block mb-4">
              <span className="text-white font-bold">Choose at least 5 elements including title and prevention activities!</span>
            </div>
          </div>

          {/* Poster Preview */}
          <div className="bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-2xl p-8 mb-6 min-h-[300px] border-2 border-white/30">
            <div className="text-center space-y-4">
              {selectedElements.length === 0 ? (
                <div className="text-white/60">
                  <div className="text-6xl mb-4">📄</div>
                  <p>Your poster will appear here as you add elements!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                  {selectedElements.map(elementId => {
                    const element = posterElements.find(el => el.id === elementId);
                    return (
                      <div
                        key={elementId}
                        className="bg-white/20 rounded-xl p-3 text-center transform hover:scale-105 transition-all"
                      >
                        <div className="text-3xl mb-1">{element.emoji}</div>
                        <div className="text-white font-medium text-sm">{element.text}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Element Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posterElements.map(element => {
              const isSelected = selectedElements.includes(element.id);

              return (
                <button
                  key={element.id}
                  onClick={() => handleElementToggle(element.id)}
                  className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 text-white hover:from-blue-600 hover:to-indigo-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{element.emoji}</div>
                    <div className="font-bold text-sm mb-1">{element.text}</div>
                    <div className="text-xs opacity-80 capitalize">{element.category}</div>
                    {isSelected && <div className="text-lg mt-1">✅</div>}
                  </div>
                </button>
              );
            })}
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🎨</div>
                <h3 className="text-3xl font-bold text-white mb-2">Poster Complete!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Your "Prevention is Better Than Cure" poster is inspiring! You created a powerful message about staying healthy!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">PREVENTION ARTIST</div>
                </div>
                <p className="text-white/80">
                  Excellent work promoting the importance of prevention! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PreventionFirstPoster;
