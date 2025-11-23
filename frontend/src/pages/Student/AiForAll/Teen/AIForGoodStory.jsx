import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIForGoodStory = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Helping the Blind 👨‍🦯",
      emoji: "🤖",
      situation: "AI helps a blind person cross the road safely. What kind of AI is this?",
      choices: [
        { id: 1, text: "Good AI", emoji: "💖", isCorrect: true },
        { id: 2, text: "Bad AI", emoji: "⚠️", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Saving Energy 💡",
      emoji: "🌿",
      situation: "AI turns off unused lights to save electricity. Is this a good use of AI?",
      choices: [
        { id: 1, text: "Yes, it's helpful!", emoji: "✅", isCorrect: true },
        { id: 2, text: "No, it’s wrong", emoji: "❌", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Protecting Animals 🐾",
      emoji: "🦓",
      situation: "AI cameras detect poachers in forests to save wild animals. Is this AI for good?",
      choices: [
        { id: 1, text: "Yes, saving lives!", emoji: "🫶", isCorrect: true },
        { id: 2, text: "No, it’s unnecessary", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "AI in Hospitals 🏥",
      emoji: "🧠",
      situation: "AI helps doctors find early signs of cancer. Is this a positive AI use?",
      choices: [
        { id: 1, text: "Yes, helps patients", emoji: "❤️", isCorrect: true },
        { id: 2, text: "No, it replaces doctors", emoji: "🤖", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "AI in Education 📚",
      emoji: "🧑‍🏫",
      situation: "AI tutors help kids learn better at home. Should we call this ‘Good AI’?",
      choices: [
        { id: 1, text: "Yes, supports learning!", emoji: "🌟", isCorrect: true },
        { id: 2, text: "No, not useful", emoji: "😐", isCorrect: false },
      ],
    },
  ];

  const current = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins((prev) => prev + 10);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setShowFeedback(false);
    setSelectedChoice(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleNext(); // go to next game after all questions
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/future-of-ai-quiz"); // update with actual next route
  };

  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="AI for Good Story"
      subtitle="Social AI Awareness"
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect && currentQuestion === questions.length - 1}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-89"
      gameType="ai"
      totalLevels={20}
      currentLevel={19}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-green-500/50 border-green-400 ring-2 ring-white"
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌍 Great Choice!" : "Oops! Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Perfect! This action shows how AI can make life safer, healthier, and more equal for everyone.
                    Using AI for good helps build a better world! 🌈
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === questions.length - 1 ? "Finish Story" : "Next Story ➡️"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That’s not correct! This example shows AI being used for good purposes — helping people, saving energy, or protecting lives.
                  </p>
                </div>
                <button
                  onClick={() => setShowFeedback(false)}
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

export default AIForGoodStory;
