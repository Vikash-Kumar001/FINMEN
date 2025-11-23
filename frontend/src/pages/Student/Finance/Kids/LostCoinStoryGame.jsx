import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LostCoinStoryGame = () => {
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
      question: "You find ₹5 on the floor. What do you do?",
      choices: [
        { text: "Give to teacher 🧑‍🏫", correct: true },
        { text: "Keep it 🤫", correct: false },
        { text: "Spend it on candy 🍬", correct: false },
      ],
    },
    {
      question: "You find ₹10 in a book. What’s the honest choice?",
      choices: [
        { text: "Return it to the owner 📚", correct: true },
        { text: "Buy snacks 🍟", correct: false },
        { text: "Hide it in your bag 🎒", correct: false },
      ],
    },
    {
      question: "A shopkeeper gives ₹5 extra change. What do you do?",
      choices: [
        { text: "Return the extra change 💸", correct: true },
        { text: "Keep it quietly 😶", correct: false },
        { text: "Spend it on toys 🧸", correct: false },
      ],
    },
    {
      question: "You see ₹20 on the street. What’s best?",
      choices: [
        { text: "Ask around to find the owner 🕵️", correct: true },
        { text: "Take it home 💰", correct: false },
        { text: "Buy ice cream 🍦", correct: false },
      ],
    },
    {
      question: "Why is it good to be honest with found money?",
      choices: [
        { text: "Builds trust and respect 😊", correct: true },
        { text: "Gets you more money 💰", correct: false },
        { text: "Lets you buy more things 🛍️", correct: false },
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
      title="Lost Coin Story"
      subtitle="Make honest choices with found money!"
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
      gameId="finance-kids-181"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="space-y-4">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-white/20 px-6 py-3 rounded-full w-full hover:bg-white/30 transition-transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Honesty Champion!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for honest choices!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Honesty with money builds trust!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LostCoinStoryGame;