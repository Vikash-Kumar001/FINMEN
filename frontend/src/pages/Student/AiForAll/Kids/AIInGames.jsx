import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIInGames = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const questions = [
    {
      title: "Video Game Enemy",
      emoji: "🎮",
      question: "Who controls the enemy in a video game?",
      choices: [
        { id: 1, text: "AI controls the enemy", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Teacher controls it", emoji: "👩‍🏫", isCorrect: false },
        { id: 3, text: "Nobody", emoji: "❓", isCorrect: false },
      ],
    },
    {
      title: "Racing Games",
      emoji: "🏎️",
      question: "What makes computer cars race against you?",
      choices: [
        { id: 1, text: "AI Drivers", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Your Friends", emoji: "👫", isCorrect: false },
        { id: 3, text: "Magic", emoji: "✨", isCorrect: false },
      ],
    },
    {
      title: "Chess Master",
      emoji: "♟️",
      question: "When you play chess on a computer, who moves the pieces for the computer?",
      choices: [
        { id: 1, text: "AI", emoji: "🧠", isCorrect: true },
        { id: 2, text: "You", emoji: "🙋‍♀️", isCorrect: false },
        { id: 3, text: "Random Luck", emoji: "🎲", isCorrect: false },
      ],
    },
    {
      title: "Football Game",
      emoji: "⚽",
      question: "How do computer players know when to kick the ball?",
      choices: [
        { id: 1, text: "AI makes them act", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Coach tells them", emoji: "🏋️‍♂️", isCorrect: false },
        { id: 3, text: "They guess randomly", emoji: "🎯", isCorrect: false },
      ],
    },
    {
      title: "Adventure Game",
      emoji: "🗺️",
      question: "What helps enemies or friends react to your moves in adventure games?",
      choices: [
        { id: 1, text: "AI Logic", emoji: "⚙️", isCorrect: true },
        { id: 2, text: "Game Music", emoji: "🎵", isCorrect: false },
        { id: 3, text: "Game Designer live", emoji: "🎮", isCorrect: false },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion?.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/match-ai-tools");
  };

  return (
    <GameShell
      title="AI in Games"
      subtitle="AI in Play"
      onNext={handleNext}
      nextEnabled={currentQuestionIndex === questions.length - 1 && showFeedback}
      showGameOver={currentQuestionIndex === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-kids-11"
      gameType="ai"
      totalLevels={100}
      currentLevel={11}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentQuestion.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.question}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
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
                    <div className="text-4xl">{choice.emoji}</div>
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
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData?.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect
                ? "🎯 Correct!"
                : "❌ Not Quite..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! {currentQuestion.title} uses AI for smart actions and
                    fun challenges!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  +5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! The correct answer was AI — it makes games smart and
                    interactive!
                  </p>
                </div>
              </>
            )}

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question →
              </button>
            ) : (
              <p className="text-white text-center font-bold mt-4">
                🎉 All questions completed!
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIInGames;
