import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendsMoneyStoryGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "Your friend drops ₹10. What do you do?",
      choices: [
        { text: "Return it to your friend 🤝", correct: true },
        { text: "Keep it for yourself 💸", correct: false },
        { text: "Spend it on snacks 🍟", correct: false },
      ],
    },
    {
      question: "Your friend needs ₹5 for lunch. You have ₹10. What do you do?",
      choices: [
        { text: "Lend ₹5 and ask for it later 🤲", correct: true },
        { text: "Give all ₹10 away 🎁", correct: false },
        { text: "Say no and keep it 😐", correct: false },
      ],
    },
    {
      question: "You find ₹20 in class. No one claims it. What’s next?",
      choices: [
        { text: "Give it to the teacher 🧑‍🏫", correct: true },
        { text: "Buy candy for everyone 🍬", correct: false },
        { text: "Keep it quietly 🤫", correct: false },
      ],
    },
    {
      question: "Your friend owes you ₹5. They offer candy instead. What do you do?",
      choices: [
        { text: "Politely ask for money 💬", correct: true },
        { text: "Take the candy 🍭", correct: false },
        { text: "Forget about it 😌", correct: false },
      ],
    },
    {
      question: "Why is being honest with money important?",
      choices: [
        { text: "Builds trust with friends 😊", correct: true },
        { text: "Lets you spend more 🛍️", correct: false },
        { text: "Gets you more candy 🍫", correct: false },
      ],
    },
  ];

  const handleChoice = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Friend’s Money Story"
      subtitle="Make honest choices with money!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-185"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-4 px-6 rounded-xl text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Honest Hero!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 for honest choices!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">
              Lesson: Honesty with money builds trust and respect.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FriendsMoneyStoryGame;