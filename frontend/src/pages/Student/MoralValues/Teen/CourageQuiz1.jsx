import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CourageQuiz1 = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Which is real courage?",
      emoji: "🦁",
      choices: [
        { id: 1, text: "Teasing others", emoji: "😏", isCorrect: false },
        { id: 2, text: "Protecting others", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Running away", emoji: "🏃", isCorrect: false },
      ],
    },
    {
      text: "What does a brave person do when they see bullying?",
      emoji: "👀",
      choices: [
        { id: 1, text: "Join the bully", emoji: "😈", isCorrect: false },
        { id: 2, text: "Stay silent", emoji: "😶", isCorrect: false },
        { id: 3, text: "Stand up and help", emoji: "🤝", isCorrect: true },
      ],
    },
    {
      text: "Courage means...",
      emoji: "🧠",
      choices: [
        { id: 1, text: "Doing what is right even when scared", emoji: "💪", isCorrect: true },
        { id: 2, text: "Never being scared", emoji: "😎", isCorrect: false },
        { id: 3, text: "Showing off strength", emoji: "🔥", isCorrect: false },
      ],
    },
    {
      text: "When your friend admits a mistake, what should you do?",
      emoji: "🤗",
      choices: [
        { id: 1, text: "Laugh at them", emoji: "😂", isCorrect: false },
        { id: 2, text: "Appreciate their honesty", emoji: "👏", isCorrect: true },
        { id: 3, text: "Ignore them", emoji: "😐", isCorrect: false },
      ],
    },
    {
      text: "Which action shows bravery?",
      emoji: "🏅",
      choices: [
        { id: 1, text: "Admitting you were wrong", emoji: "🙋", isCorrect: true },
        { id: 2, text: "Hiding mistakes", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Blaming others", emoji: "😬", isCorrect: false },
      ],
    },
  ];

  const question = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = question.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/reflex-moral-courage"); // change path to next game
    }
  };

  const selectedChoiceData = question.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Courage Quiz1"
      subtitle="Discover what true courage means"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="moral-teen-courage-1-52"
      gameType="moral"
      totalLevels={100}
      currentLevel={52}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {question.choices.map((choice) => (
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
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "💪 Correct!" : "🤔 Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    True courage means doing the right thing — even when it’s hard. Protecting others,
                    standing up to wrong, or admitting mistakes are signs of real bravery!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 3 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Real courage isn’t about showing off or teasing. It’s about kindness,
                    honesty, and helping others even when it’s difficult.
                  </p>
                </div>
              </>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CourageQuiz1;
