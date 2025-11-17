import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AICareerQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which jobs use AI?",
      emoji: "🤖",
      choices: [
        { id: "A", text: "Doctor", isCorrect: false },
        { id: "B", text: "Engineer", isCorrect: false },
        { id: "C", text: "Teacher", isCorrect: false },
        { id: "D", text: "All of the above", isCorrect: true }
      ]
    },
    {
      id: 2,
      text: "Who uses AI to analyze patient data?",
      emoji: "🩺",
      choices: [
        { id: "A", text: "Doctors", isCorrect: true },
        { id: "B", text: "Pilots", isCorrect: false },
        { id: "C", text: "Chefs", isCorrect: false },
        { id: "D", text: "Musicians", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Which profession uses AI for predictive maintenance?",
      emoji: "⚙️",
      choices: [
        { id: "A", text: "Engineers", isCorrect: true },
        { id: "B", text: "Artists", isCorrect: false },
        { id: "C", text: "Teachers", isCorrect: false },
        { id: "D", text: "Athletes", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Who might use AI for personalized learning?",
      emoji: "📚",
      choices: [
        { id: "A", text: "Students", isCorrect: false },
        { id: "B", text: "Teachers", isCorrect: true },
        { id: "C", text: "Farmers", isCorrect: false },
        { id: "D", text: "Chefs", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "AI can assist in career guidance for:",
      emoji: "💼",
      choices: [
        { id: "A", text: "Everyone", isCorrect: true },
        { id: "B", text: "Only doctors", isCorrect: false },
        { id: "C", text: "Only engineers", isCorrect: false },
        { id: "D", text: "Only teachers", isCorrect: false }
      ]
    }
  ];

  const currentData = questions[currentQuestion];
  const selectedChoiceData = currentData.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (selectedChoiceData.isCorrect) {
      showCorrectAnswerFeedback(1, true); // 1 coin per correct answer
      setCoins(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/teen/future-journal"); // next game
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCurrentQuestion(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="AI Career Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-22"
      gameType="ai"
      totalLevels={22}
      currentLevel={22}
      showConfetti={showFeedback}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">{currentData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentData.text}</h2>

            <div className="space-y-3 mb-6">
              {currentData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-semibold text-lg">{choice.id}. {choice.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
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
            <div className="text-8xl mb-4 text-center">{selectedChoiceData.isCorrect ? "✅" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "Correct!" : "Oops!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.isCorrect ? "Well done! 🎉" : "The correct answer is: " + currentData.choices.find(c => c.isCorrect).text}
            </p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You earned 1 Coin! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AICareerQuiz;
