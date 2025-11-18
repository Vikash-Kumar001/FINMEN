import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GlobalFairnessQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Should boys and girls have equal digital rights?",
      emoji: "🌐",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Should everyone have access to the internet?",
      emoji: "💻",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Should girls get same coding opportunities as boys?",
      emoji: "👩‍💻",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Should boys and girls get equal AI learning access?",
      emoji: "🤖",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Should everyone be treated equally online without bias?",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    }
  ];

  const currentQuestionData = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestionData.choices.find(c => c.id === selectedChoice);
    
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, false);
      setCoins((prev) => prev + 1); // +1 coin per correct answer
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCurrentQuestion(0);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/teen/ai-space-story");
    }
  };

  const selectedChoiceData = currentQuestionData.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Global Fairness Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-14"
      gameType="ai"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{currentQuestionData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestionData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : choice.isCorrect
                      ? 'bg-green-500/20 border-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 border-red-400 hover:bg-red-500/30'
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{selectedChoiceData.isCorrect ? "🌟" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "Correct!" : "Oops!"}
            </h2>

            <div className={`rounded-lg p-4 mb-4 ${selectedChoiceData.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <p className="text-white text-center">
                {selectedChoiceData.isCorrect
                  ? "Yes! Everyone deserves equal digital rights and opportunities. 🌐"
                  : "Remember: Equality in digital access is important for all!"}
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              {selectedChoiceData.isCorrect ? "You earned 1 Coin! 🪙" : ""}
            </p>

            {!selectedChoiceData.isCorrect && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {selectedChoiceData.isCorrect && (
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GlobalFairnessQuiz;
