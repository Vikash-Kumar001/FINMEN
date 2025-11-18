import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EthicsInAIQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Should AI follow human laws?",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Is it ethical for AI to make decisions affecting human life without oversight?",
      emoji: "🤖",
      choices: [
        { id: 1, text: "Yes", emoji: "❌", isCorrect: false },
        { id: 2, text: "No", emoji: "✅", isCorrect: true }
      ]
    },
    {
      text: "Should AI follow privacy rules and data laws?",
      emoji: "🔒",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Is it right for AI to discriminate based on gender or race?",
      emoji: "🚫",
      choices: [
        { id: 1, text: "Yes", emoji: "❌", isCorrect: false },
        { id: 2, text: "No", emoji: "✅", isCorrect: true }
      ]
    },
    {
      text: "Should AI always follow human ethical guidelines?",
      emoji: "🧭",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    }
  ];

  const currentQData = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQData.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true); // reward +5 per correct
      setCoins(prev => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/teen/human-plus-ai-story"); // update next path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const selectedChoiceData = currentQData.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Ethics in AI Quiz"
      subtitle="AI Under Human Control"
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={showFeedback && selectedChoiceData?.isCorrect && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-82"
      gameType="ai"
      totalLevels={20}
      currentLevel={82}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect && currentQuestion === questions.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{currentQData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {currentQData.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-3xl">{choice.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-4">{selectedChoiceData.isCorrect ? "✅" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "Correct!" : "Oops!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold">
                +5 Coins Earned 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}

            {selectedChoiceData.isCorrect && currentQuestion < questions.length - 1 && (
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                Next ➡️
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EthicsInAIQuiz;
