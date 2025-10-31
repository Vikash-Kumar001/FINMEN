import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterReturnBorrow = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Choose a poster: "Always Return Borrowed."',
      choices: [
        { text: "Always Return Borrowed 🤝", correct: true },
        { text: "Keep Borrowed Items 😶", correct: false },
        { text: "Borrow More Stuff 📚", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Return What You Borrow."',
      choices: [
        { text: "Return What You Borrow ✅", correct: true },
        { text: "Never Return 🙈", correct: false },
        { text: "Lose Borrowed Items 😞", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Honest Borrowing Wins."',
      choices: [
        { text: "Honest Borrowing Wins 😊", correct: true },
        { text: "Borrow Without Returning 💸", correct: false },
        { text: "Take Without Asking 🤫", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Return On Time, Be Kind."',
      choices: [
        { text: "Return On Time, Be Kind 🌟", correct: true },
        { text: "Keep Items Forever 🧸", correct: false },
        { text: "Borrow More Money 💰", correct: false },
      ],
    },
    {
      question: 'Why do return-borrowing posters help?',
      choices: [
        { text: "Teach honesty and trust 📚", correct: true },
        { text: "Encourage borrowing more 🎒", correct: false },
        { text: "Make keeping items fun 🎉", correct: false },
      ],
    },
  ];

  const handleSelect = (isCorrect) => {
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
      title="Poster: Return What You Borrow"
      subtitle="Choose posters that promote honest borrowing!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-106"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-yellow-500 transition-transform hover:scale-105"
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-8xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-4">Borrowing Badge!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for honest borrowing!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Always return what you borrow!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterReturnBorrow;