import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AnimalStoryy = () => {
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
      title: "Thirsty Puppy",
      emoji: "🐶",
      situation: "A puppy is thirsty. Do you give it water?",
      choices: [
        { id: 1, text: "Yes, give water", isCorrect: true, emoji: "💧" },
        { id: 2, text: "No, ignore it", isCorrect: false, emoji: "😐" }
      ]
    },
    {
      title: "Hungry Kitten",
      emoji: "🐱",
      situation: "A kitten is hungry. Do you feed it?",
      choices: [
        { id: 1, text: "Feed it", isCorrect: true, emoji: "🐟" },
        { id: 2, text: "Don't feed", isCorrect: false, emoji: "🙁" }
      ]
    },
    {
      title: "Lost Bird",
      emoji: "🐦",
      situation: "A baby bird fell from its nest. Do you help it back?",
      choices: [
        { id: 1, text: "Yes, help it", isCorrect: true, emoji: "🪹" },
        { id: 2, text: "Leave it", isCorrect: false, emoji: "😔" }
      ]
    },
    {
      title: "Thirsty Cow",
      emoji: "🐄",
      situation: "A cow is standing near a pond but seems thirsty. Do you give water?",
      choices: [
        { id: 1, text: "Yes, give water", isCorrect: true, emoji: "💧" },
        { id: 2, text: "No, ignore", isCorrect: false, emoji: "😐" }
      ]
    },
    {
      title: "Stray Dog",
      emoji: "🐕",
      situation: "A stray dog is shivering in cold weather. Do you cover it with a blanket?",
      choices: [
        { id: 1, text: "Yes, cover it", isCorrect: true, emoji: "🛏️" },
        { id: 2, text: "No, leave it", isCorrect: false, emoji: "😢" }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/moral-values/kids/poster-kindness"); // replace with actual next route
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const currentData = questions[currentQuestion];
  const selectedChoiceData = currentData.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Animal Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="moral-kids-25"
      gameType="educational"
      totalLevels={100}
      currentLevel={25}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{currentData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentData.situation}</p>
            </div>

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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🎉 Good Choice!" : "Think Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-6">
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
              Next
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AnimalStoryy;
