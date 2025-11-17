import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizService = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Which is an act of service?",
      emoji: "🤝",
      choices: [
        { id: 1, text: "Helping the poor", emoji: "👐", isCorrect: true },
        { id: 2, text: "Teasing the poor", emoji: "😈", isCorrect: false },
        { id: 3, text: "Ignoring the poor", emoji: "🙁", isCorrect: false }
      ]
    },
    {
      text: "Which action shows service in school?",
      emoji: "🏫",
      choices: [
        { id: 1, text: "Helping classmates with homework", emoji: "📚", isCorrect: true },
        { id: 2, text: "Laughing at mistakes", emoji: "😆", isCorrect: false },
        { id: 3, text: "Ignoring someone in need", emoji: "🙁", isCorrect: false }
      ]
    },
    {
      text: "Which is a service at home?",
      emoji: "🏠",
      choices: [
        { id: 1, text: "Helping parents with chores", emoji: "🧹", isCorrect: true },
        { id: 2, text: "Complaining about chores", emoji: "😤", isCorrect: false },
        { id: 3, text: "Refusing to help siblings", emoji: "🙁", isCorrect: false }
      ]
    },
    {
      text: "Helping someone who is sad is:",
      emoji: "😢",
      choices: [
        { id: 1, text: "An act of service", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Being rude", emoji: "😡", isCorrect: false },
        { id: 3, text: "Ignoring them", emoji: "🙁", isCorrect: false }
      ]
    },
    {
      text: "Which is a community service?",
      emoji: "🌍",
      choices: [
        { id: 1, text: "Cleaning the park", emoji: "🧹", isCorrect: true },
        { id: 2, text: "Littering the park", emoji: "🗑️", isCorrect: false },
        { id: 3, text: "Breaking park property", emoji: "💥", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/moral-values/kids/truth-reflex");
    }
  };

  const selectedChoiceData = selectedChoice
    ? questions[currentQuestion].choices.find(c => c.id === selectedChoice)
    : null;

  return (
    <GameShell
      title="Quiz on Service"
      subtitle="Understanding Service"
      score={coins}
      gameId="moral-kids-72"
      gameType="educational"
      totalLevels={100}
      currentLevel={72}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          // 🟢 QUESTION CARD
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{questions[currentQuestion].emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {questions[currentQuestion].text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {questions[currentQuestion].choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
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
              Submit Answer
            </button>
          </div>
        ) : (
          // 🟡 FEEDBACK CARD
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {selectedChoiceData?.isCorrect
                ? "Excellent! Helping others and serving those in need is the right choice. 🌟"
                : "Remember, acts of service make the world better. Choose kindness!"}
            </p>

            {/* ✅ SHOW NEXT BUTTON AFTER FEEDBACK */}
            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < questions.length - 1 ? "Next Question ➡️" : "Finish Quiz 🏁"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizService;
