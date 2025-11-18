import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotConfusionStoryy = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      title: "Lion vs Tiger 🦁🐯",
      situation: "AI calls a lion a tiger. How should the teen fix it?",
      choices: [
        { id: 1, text: "Give more lion images 🦁", isCorrect: true },
        { id: 2, text: "Ignore the mistake ❌", isCorrect: false },
      ],
    },
    {
      title: "Apple vs Tomato 🍎🍅",
      situation: "AI thinks a tomato is an apple. What’s the correction?",
      choices: [
        { id: 1, text: "Add correct fruit labels 🏷️", isCorrect: true },
        { id: 2, text: "Keep wrong label ❌", isCorrect: false },
      ],
    },
    {
      title: "Car vs Bus 🚗🚌",
      situation: "AI identifies buses as cars. What should be done?",
      choices: [
        { id: 1, text: "Provide more bus images 🚌", isCorrect: true },
        { id: 2, text: "Delete car data 🚗", isCorrect: false },
      ],
    },
    {
      title: "Cat vs Dog 🐱🐶",
      situation: "AI mistakes cats for dogs. How do you help AI learn better?",
      choices: [
        { id: 1, text: "Add more cat photos 🐱", isCorrect: true },
        { id: 2, text: "Only show dogs 🐶", isCorrect: false },
      ],
    },
    {
      title: "Chair vs Table 🪑🪵",
      situation: "AI confuses chairs with tables. What’s the best fix?",
      choices: [
        { id: 1, text: "Train with both furniture types 🪑🪵", isCorrect: true },
        { id: 2, text: "Use fewer examples ❌", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(
      (c) => c.id === selectedChoice
    );

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins((prev) => prev + 10);
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
      navigate("/student/ai-for-all/teen/feedback-loop-reflex"); // next game path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Robot Confusion Story 🤖❓"
      subtitle="Fixing AI Mistakes"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-teen-robot-confusion"
      gameType="ai"
      totalLevels={20}
      currentLevel={63}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {current.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {current.situation}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.text.split(" ")[1]}</div>
                    <div className="text-white font-semibold text-lg">
                      {choice.text}
                    </div>
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData?.text.split(" ")[1]}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Corrected!" : "❌ Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData?.text}
            </p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great work! 🧠 You corrected the robot’s mistake with better data. Each fix helps AI learn more accurately! 🚀
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +10 Coins Earned! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➡️
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! The robot stays confused 🤖💭. Try again to correct its understanding with better examples!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotConfusionStoryy;
