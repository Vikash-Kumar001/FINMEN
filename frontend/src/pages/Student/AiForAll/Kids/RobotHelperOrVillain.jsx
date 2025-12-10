import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotHelperOrVillain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // Game scenarios
  const actions = [
    {
      id: 1,
      emoji: "🤖",
      situation: "An old man drops his stick.",
      choices: [
        { id: 1, text: "Steal phone", isCorrect: false },
        { id: 2, text: "Walk away", isCorrect: false },
        { id: 3, text: "Help old man", isCorrect: true },
      ]
    },
    {
      id: 2,
      emoji: "🤖",
      situation: "Robot sees a lost wallet.",
      choices: [
        { id: 1, text: "Return it", isCorrect: true },
        { id: 2, text: "Keep it", isCorrect: false },
        { id: 3, text: "Leave it", isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "🤖",
      situation: "Kid falls down.",
      choices: [
        { id: 1, text: "Help kid", isCorrect: true },
        { id: 2, text: "Laugh", isCorrect: false },
        { id: 3, text: "Record video", isCorrect: false }
      ]
    },
    {
      id: 4,
      emoji: "🤖",
      situation: "Robot finds a phone on road.",
      choices: [
        { id: 1, text: "Steal phone", isCorrect: false },
        { id: 2, text: "Give to owner", isCorrect: true },
        { id: 3, text: "Sell it online", isCorrect: false }
      ]
    },
    {
      id: 5,
      emoji: "🤖",
      situation: "Someone needs directions.",
      choices: [
        { id: 1, text: "Guide them", isCorrect: true },
        { id: 2, text: "Ignore", isCorrect: false },
        { id: 3, text: "Give wrong directions", isCorrect: false }
      ]
    }
  ];

  const currentAction = actions[currentScenario];

  const handleChoice = (choiceId) => {
    const choice = currentAction.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentAction.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentScenario < actions.length - 1) {
      setTimeout(() => {
        setCurrentScenario((prev) => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-and-jobs-story");
  };

  return (
    <GameShell
      title="Robot Helper or Villain"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Scenario ${currentScenario + 1} of ${actions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={actions.length}
      gameId="ai-kids-81"
      gameType="ai"
      totalLevels={actions.length}
      currentLevel={currentScenario + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Choose the Right Action!
            </h3>

            <div className="bg-white/10 rounded-lg p-6 mb-6 text-center">
              <div className="text-8xl mb-4 animate-pulse">{currentAction.emoji}</div>
              <p className="text-white text-xl font-semibold">
                {currentAction.situation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentAction.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <h3 className="font-bold text-xl mb-2">{choice.text}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-4">You're a Kind Robot!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You chose kindness {finalScore} out of {actions.length} times! ({Math.round((finalScore / actions.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 Great job! You learned how AI can be guided to make moral, helpful decisions.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-4">Try Again!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You chose kindness {finalScore} out of {actions.length} times. ({Math.round((finalScore / actions.length) * 100)}%)
                  Keep practicing to learn more about ethical AI!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 Great job! You learned how AI can be guided to make moral, helpful decisions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotHelperOrVillain;
