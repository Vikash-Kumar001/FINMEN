import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RefugeeStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const story = {
    title: "New Student from Far Away",
    emoji: "🌍",
    situation: "A refugee girl from another country joins your class. She looks nervous and alone. What should you do?",
    choices: [
      { id: 1, text: "Welcome her warmly and offer to be her friend", emoji: "🤗", isCorrect: true },
      { id: 2, text: "Ignore her because she's different", emoji: "🙄", isCorrect: false },
      { id: 3, text: "Make fun of her accent", emoji: "😂", isCorrect: false }
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
    navigate("/student/civic-responsibility/teen/debate-kindness-weakness");
  };

  const selectedChoiceData = story.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Refugee Story"
      subtitle="Welcoming Those in Need"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="crgc-teen-5"
      gameType="crgc"
      totalLevels={20}
      currentLevel={5}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{story.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{story.situation}</p>
          </div>
        </div>

        {!showFeedback && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
              How would you respond?
            </h3>
            <div className="grid gap-4">
              {story.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    selectedChoice === choice.id
                      ? 'border-green-500 bg-green-100 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-green-300'
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
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
                {selectedChoiceData?.isCorrect ? 'Wonderful Choice!' : 'Think Again'}
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                {selectedChoiceData?.isCorrect 
                  ? 'Refugees have often faced difficult situations. Welcoming them with kindness helps them feel safe and included!'
                  : 'Everyone deserves compassion and respect, especially those who have had to leave their homes. We should always welcome newcomers with kindness.'}
              </p>
              {!selectedChoiceData?.isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all transform hover:scale-105"
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

export default RefugeeStory;

