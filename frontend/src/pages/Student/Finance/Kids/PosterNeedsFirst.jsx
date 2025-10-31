import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterNeedsFirst = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Choose a poster: "Put Needs Before Wants."',
      choices: [
        { text: "Put Needs Before Wants 📚", correct: true },
        { text: "Buy Wants First 🧸", correct: false },
        { text: "Spend Everything 🛍️", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Needs First, Save Smart."',
      choices: [
        { text: "Needs First, Save Smart 💰", correct: true },
        { text: "Wants Are Better 🎉", correct: false },
        { text: "No Need to Save 🏺", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Choose Needs, Win Big."',
      choices: [
        { text: "Choose Needs, Win Big 🥗", correct: true },
        { text: "Spend on Toys 🧸", correct: false },
        { text: "Give Money Away 🎁", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Needs Keep You Strong."',
      choices: [
        { text: "Needs Keep You Strong 💪", correct: true },
        { text: "Wants Make You Happy 😊", correct: false },
        { text: "Spend Without Plan 🛒", correct: false },
      ],
    },
    {
      question: 'Why do needs-first posters help kids?',
      choices: [
        { text: "Teach smart spending 📚", correct: true },
        { text: "Encourage more toys 🧸", correct: false },
        { text: "Make spending fun 🎉", correct: false },
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
      title="Poster: Needs First"
      subtitle="Choose posters that prioritize needs!"
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
      gameId="finance-kids-66"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🏆</div>
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
            <h3 className="text-3xl font-bold mb-4">Needs First Badge!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for prioritizing needs!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Needs come first for smart spending!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterNeedsFirst;