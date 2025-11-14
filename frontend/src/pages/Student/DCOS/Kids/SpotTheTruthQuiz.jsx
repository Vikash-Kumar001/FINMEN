import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpotTheTruthQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Headline: 'Dogs can fly!' Real or Fake?",
      emoji: "🐶✈️",
      choices: [
        { id: 1, text: "Real", emoji: "✅", isCorrect: false },
        { id: 2, text: "Fake", emoji: "❌", isCorrect: true },
      ],
    },
    {
      text: "Headline: 'Water is wet.' Real or Fake?",
      emoji: "💧",
      choices: [
        { id: 1, text: "Real", emoji: "✅", isCorrect: true },
        { id: 2, text: "Fake", emoji: "❌", isCorrect: false },
      ],
    },
    {
      text: "Headline: 'A robot became the school principal.' Real or Fake?",
      emoji: "🤖🏫",
      choices: [
        { id: 1, text: "Real", emoji: "✅", isCorrect: false },
        { id: 2, text: "Fake", emoji: "❌", isCorrect: true },
      ],
    },
    {
      text: "Headline: 'The sun rises in the east.' Real or Fake?",
      emoji: "🌅",
      choices: [
        { id: 1, text: "Real", emoji: "✅", isCorrect: true },
        { id: 2, text: "Fake", emoji: "❌", isCorrect: false },
      ],
    },
    {
      text: "Headline: 'Chocolate grows on trees.' Real or Fake?",
      emoji: "🍫🌳",
      choices: [
        { id: 1, text: "Real", emoji: "✅", isCorrect: true },
        { id: 2, text: "Fake", emoji: "❌", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCorrectCount(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      if (correctCount >= 3) setEarnedBadge(true);
      setShowFeedback(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setEarnedBadge(false);
    resetFeedback();
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/cartoon-news-reflex");
  };

  const question = questions[currentQuestion];
  const selectedChoiceData = question?.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Spot the Truth Quiz"
      subtitle="Can You Spot Fake News?"
      onNext={handleNextGame}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="dcos-kids-31"
      gameType="educational"
      totalLevels={100}
      currentLevel={31}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback || currentQuestion < questions.length - 1 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {question.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{choice.emoji}</div>
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
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Answer
            </button>
          </div>
        ) : earnedBadge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">Truth Spotter Badge!</h2>
            <p className="text-white/90 text-lg mb-6">
              Great job! You can tell what’s real and what’s fake online. Always check sources before believing headlines!
            </p>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6">
              <p className="text-white text-2xl font-bold">Badge Earned: Truth Spotter 🕵️‍♀️</p>
              <p className="text-white/80 text-sm mt-2">You earned +3 Coins!</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4 text-center">🗞️</div>
            <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
            <p className="text-white/90 text-lg mb-6">
              You spotted {correctCount} out of {questions.length} headlines correctly!
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {showFeedback && !earnedBadge && currentQuestion < questions.length - 1 && (
          <div className="flex justify-center">
            <button
              onClick={handleNextQuestion}
              className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SpotTheTruthQuiz;
