import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutritionProBadge = () => {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Choose a Healthy Breakfast",
      description: "Pick the best breakfast option for energy",
      question: "What should you eat for breakfast?",
      options: [
        { id: "a", text: "Only sugary cereal", emoji: "🥣", isCorrect: false },
        { id: "b", text: "Oats with fruits", emoji: "🥣", isCorrect: true },
        { id: "c", text: "Skip breakfast", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Smart Snacking",
      description: "Choose a nutritious snack between meals",
      question: "Best snack during study break?",
      options: [
        { id: "a", text: "Chips and soda", emoji: "🥔", isCorrect: false },
        { id: "b", text: "Only candy", emoji: "🍬", isCorrect: false },
        { id: "c", text: "Fresh fruits", emoji: "🍎", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Hydration Hero",
      description: "Pick the healthiest drink option",
      question: "What should you drink throughout the day?",
      options: [
        { id: "a", text: "Water", emoji: "💧", isCorrect: true },
        { id: "b", text: "Sugary drinks", emoji: "🥤", isCorrect: false },
        { id: "c", text: "Only when thirsty", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Balanced Dinner",
      description: "Create a complete nutritious dinner",
      question: "What makes a complete dinner?",
      options: [
        { id: "a", text: "Only carbs", emoji: "🍚", isCorrect: false },
        { id: "b", text: "Protein, carbs, vegetables", emoji: "🥘", isCorrect: true },
        { id: "c", text: "Dessert only", emoji: "🍰", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Nutrition Knowledge",
      description: "Test your understanding of healthy eating",
      question: "What helps your body grow strong?",
      options: [
        { id: "a", text: "Only junk food", emoji: "🍔", isCorrect: false },
        { id: "b", text: "Skipping meals", emoji: "❌", isCorrect: false },
        { id: "c", text: "Balanced nutrition", emoji: "🥗", isCorrect: true }
      ]
    }
  ];

  const handleChallengeChoice = (optionId) => {
    const currentChallengeData = challenges[currentChallenge];
    const selectedOption = currentChallengeData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCompletedChallenges([...completedChallenges, currentChallenge]);
      setChallengeCompleted(true);

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          setChallengeCompleted(false);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      // Show feedback but don't advance
      setTimeout(() => {
        // Stay on same challenge
      }, 1500);
    }
  };

  const getCurrentChallenge = () => challenges[currentChallenge];

  const handleNext = () => {
    navigate("/student/health-male/teens/quiz-teen-fitness");
  };

  const badgeEarned = completedChallenges.length >= 3;

  return (
    <GameShell
      title="Badge: Nutrition Pro Teen"
      subtitle={`Challenge ${currentChallenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={completedChallenges.length * 2}
      gameId="health-male-teen-20"
      gameType="health-male"
      totalLevels={100}
      currentLevel={20}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 20/100</span>
            <span className="text-yellow-400 font-bold">Coins: {completedChallenges.length * 2}</span>
          </div>

          {badgeEarned && (
            <div className="text-center mb-6 p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-white text-2xl font-bold mb-2">
                Nutrition Pro Teen Badge Earned!
              </h3>
              <p className="text-white/90">
                Complete {challenges.length} healthy food choices to master nutrition!
              </p>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-white text-xl font-bold mb-2">
              Challenge: {getCurrentChallenge().title}
            </h3>
            <p className="text-white/80 mb-4">
              {getCurrentChallenge().description}
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-white text-lg text-center">
              {getCurrentChallenge().question}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentChallenge().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChallengeChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Progress:</span>
              <span className="text-white">{completedChallenges.length}/{challenges.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {completedChallenges.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-bold mb-3">Completed Challenges:</h4>
              <div className="flex flex-wrap gap-2">
                {challenges.map((challenge, index) => (
                  <div
                    key={challenge.id}
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      completedChallenges.includes(index)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {challenge.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default NutritionProBadge;
