import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizCooperation = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is teamwork? (a) Sharing tasks, (b) Fighting, (c) Ignoring",
      emoji: "🤝",
      choices: [
        { id: 1, text: "Sharing tasks", emoji: "✅", isCorrect: true },
        { id: 2, text: "Fighting", emoji: "❌", isCorrect: false },
        { id: 3, text: "Ignoring", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Your teammate is struggling. How do you act?",
      emoji: "⚽",
      choices: [
        { id: 1, text: "Help them", emoji: "💪", isCorrect: true },
        { id: 2, text: "Ignore them", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Laugh at them", emoji: "😏", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "During a group project, someone finishes early. Do you?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Help others complete tasks", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Do nothing", emoji: "😐", isCorrect: false },
        { id: 3, text: "Take their work", emoji: "😈", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Team members disagree. You should?",
      emoji: "🗣️",
      choices: [
        { id: 1, text: "Listen and discuss calmly", emoji: "🫂", isCorrect: true },
        { id: 2, text: "Argue loudly", emoji: "😡", isCorrect: false },
        { id: 3, text: "Walk away", emoji: "🚶", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "A teammate makes a mistake. You should?",
      emoji: "⚠️",
      choices: [
        { id: 1, text: "Help them fix it", emoji: "🛠️", isCorrect: true },
        { id: 2, text: "Blame them", emoji: "😠", isCorrect: false },
        { id: 3, text: "Ignore it", emoji: "🙈", isCorrect: false }
      ]
    }
  ];

  const currentData = questions[currentQuestion];
  const selectedChoiceData = currentData.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentData.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(prev => prev + 3);
    }

    setShowFeedback(true);

    // Auto move to next question after 2s if correct
    if (choice.isCorrect) {
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedChoice(null);
          setShowFeedback(false);
          resetFeedback();
        } else {
          navigate("/student/moral-values/kids/reflex-team-acts");
        }
      }, 2000);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Quiz on Cooperation"
      subtitle="Learn Teamwork"
      score={coins}
      gameId="moral-kids-62"
      gameType="educational"
      totalLevels={100}
      currentLevel={62 + currentQuestion}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentData.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentData.choices.map(choice => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold">
                You earned 3 Coins! 🪙
                <br />
                <span className="text-white/70 text-base">(Next question loading...)</span>
              </p>
            ) : (
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

export default QuizCooperation;
