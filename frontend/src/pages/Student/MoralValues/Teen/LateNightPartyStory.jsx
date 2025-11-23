import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LateNightPartyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      title: "Late Night Party 1",
      emoji: "🎉",
      situation: "Exam tomorrow, friends invite you for a late-night party. What do you do?",
      choices: [
        { id: 1, text: "Go to the party", emoji: "😎", isCorrect: false },
        { id: 2, text: "Stay home and study", emoji: "📚", isCorrect: true },
      ],
    },
    {
      title: "Late Night Party 2",
      emoji: "🕺",
      situation: "Friends plan a party the night before your big test. How do you respond?",
      choices: [
        { id: 1, text: "Join them for fun", emoji: "💃", isCorrect: false },
        { id: 2, text: "Politely decline and revise", emoji: "✍️", isCorrect: true },
      ],
    },
    {
      title: "Late Night Party 3",
      emoji: "🥳",
      situation: "Everyone is going out for snacks late night, but you have an important exam. What’s your choice?",
      choices: [
        { id: 1, text: "Go with them", emoji: "🍕", isCorrect: false },
        { id: 2, text: "Stay focused and prepare", emoji: "📖", isCorrect: true },
      ],
    },
    {
      title: "Late Night Party 4",
      emoji: "🎶",
      situation: "Music and dance at a late-night party vs. early morning exam prep. You decide?",
      choices: [
        { id: 1, text: "Party all night", emoji: "🎧", isCorrect: false },
        { id: 2, text: "Sleep early and review notes", emoji: "🛌", isCorrect: true },
      ],
    },
    {
      title: "Late Night Party 5",
      emoji: "🍹",
      situation: "Friends invite you for drinks late night but exam is next day. What’s right?",
      choices: [
        { id: 1, text: "Join friends", emoji: "🥂", isCorrect: false },
        { id: 2, text: "Stay home and revise", emoji: "📝", isCorrect: true },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(
      (c) => c.id === selectedChoice
    );

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // All questions done
      setGameOver(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleFinish = () => {
    navigate("/student/moral-values/teen/debate-rules-vs-freedom");
  };

  const selectedChoiceData = questions[currentQuestion].choices.find(
    (c) => c.id === selectedChoice
  );

  return (
    <GameShell
      title="Late Night Party Story"
      subtitle="Make Responsible Choices"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={gameOver}
      score={coins}
      gameId="moral-teen-35"
      gameType="moral"
      totalLevels={100}
      currentLevel={35}
      showConfetti={gameOver}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!gameOver ? (
          <>
            {!showFeedback ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
                <div className="text-8xl mb-4 text-center">
                  {questions[currentQuestion].emoji}
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  {questions[currentQuestion].title}
                </h2>
                <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                  <p className="text-white text-lg leading-relaxed text-center">
                    {questions[currentQuestion].situation}
                  </p>
                </div>

                <h3 className="text-white font-bold mb-4">What should you do?</h3>

                <div className="space-y-3 mb-6">
                  {questions[currentQuestion].choices.map((choice) => (
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
                  Confirm Choice
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
                <div className="text-7xl mb-4 text-center">
                  {selectedChoiceData.emoji}
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 text-center">
                  {selectedChoiceData.isCorrect ? "✨ Wise Choice!" : "Think Again..."}
                </h2>
                <p className="text-white/90 text-lg mb-6 text-center">
                  {selectedChoiceData.text}
                </p>

                {selectedChoiceData.isCorrect ? (
                  <p className="text-yellow-400 text-2xl font-bold text-center">
                    You earned 5 Coins! 🪙
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
                  {currentQuestion === questions.length - 1
                    ? "Finish Game"
                    : "Next Question"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">🎉 Well Done!</h2>
            <p className="text-white/90 text-lg mb-4">
              You showed great discipline by making smart choices before exams.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              Total Coins Earned: {coins} 🪙
            </p>
            <button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LateNightPartyStory;
