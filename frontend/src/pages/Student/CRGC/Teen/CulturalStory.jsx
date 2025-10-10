import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CulturalStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const story = {
    title: "Friend from Another Religion",
    emoji: "🕌",
    situation: "You meet a new friend from a different religion. They have different customs and practices. What should you do?",
    choices: [
      { id: 1, text: "Learn about their religion and respect their beliefs", emoji: "📚", isCorrect: true },
      { id: 2, text: "Mock their customs and make fun of them", emoji: "😂", isCorrect: false },
      { id: 3, text: "Avoid them because they're different", emoji: "🚶", isCorrect: false }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = story.choices.find(c => c.id === selectedChoice);
    
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/civic-responsibility/teen/quiz-on-inclusion");
  };

  const selectedChoiceData = story.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Cultural Story"
      subtitle="Respecting Different Cultures"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="crgc-teen-11"
      gameType="crgc"
      totalLevels={20}
      currentLevel={11}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{story.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{story.situation}</p>
          </div>
        </div>

        {!showFeedback && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
              What would you do?
            </h3>
            <div className="grid gap-4">
              {story.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    selectedChoice === choice.id
                      ? 'border-indigo-500 bg-indigo-100 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{choice.emoji}</span>
                    <span className="text-lg font-medium text-gray-800 flex-1 text-left">
                      {choice.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                selectedChoice
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        )}

        {showFeedback && (
          <div className={`p-8 rounded-2xl ${selectedChoiceData?.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-center">
              <div className="text-6xl mb-4">
                {selectedChoiceData?.isCorrect ? '🌟' : '💭'}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                selectedChoiceData?.isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedChoiceData?.isCorrect ? 'Excellent Choice!' : 'Think Again'}
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                {selectedChoiceData?.isCorrect 
                  ? 'Perfect! Learning about and respecting different religions and cultures makes us better global citizens!'
                  : 'We should always respect people from different religions and cultures. Diversity makes our world richer and more interesting.'}
              </p>
              {!selectedChoiceData?.isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all transform hover:scale-105"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CulturalStory;

