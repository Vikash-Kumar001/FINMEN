import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizOnSaving = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-2";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [choices, setChoices] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Who is the best saver?",
      options: [
        { id: "a", text: "Someone who spends all their money", correct: false },
        { id: "b", text: "Someone who wastes money", correct: false },
        { id: "c", text: "Someone who saves part of their money", correct: true }
      ],
    },
    {
      id: 2,
      text: "What should you do with your pocket money?",
      options: [
        { id: "a", text: "Spend it all immediately", correct: false },
        { id: "b", text: "Save some and spend some", correct: true },
        { id: "c", text: "Hide it and never use it", correct: false }
      ],
    },
    {
      id: 3,
      text: "Why is saving money important?",
      options: [
        { id: "a", text: "So you can buy things you need later", correct: true },
        { id: "b", text: "So you can show off to friends", correct: false },
        { id: "c", text: "It's not important at all", correct: false }
      ],
    },
    {
      id: 4,
      text: "What is a money bank used for?",
      options: [
        { id: "a", text: "Keeping toys", correct: false },
        { id: "b", text: "Saving money", correct: true },
        { id: "c", text: "Storing food", correct: false }
      ],
    },
    {
      id: 5,
      text: "If you save ₹10 every week, how much will you have in 4 weeks?",
      options: [
        { id: "a", text: "₹20", correct: false },
        { id: "b", text: "₹30", correct: false },
        { id: "c", text: "₹40", correct: true }
      ],
    }
  ];

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option.id);
    const correct = option.correct;
    const question = questions[currentQuestion];
    
    setChoices([...choices, { questionId: question.id, choice: option.id, isCorrect: correct }]);
    
    if (correct) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or finish game
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        resetFeedback();
      } else {
        setGameFinished(true);
        setShowResult(true);
      }
    }, correct ? 1000 : 1500);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/reflex-savings");
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const finalScore = choices.filter(c => c.isCorrect).length;

  return (
    <GameShell
      title="Quiz on Saving"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={2}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="finance-kids-2"
      gameType="finance"
      totalLevels={questions.length}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      showConfetti={gameFinished && finalScore >= 3}
    >
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-6">
                {getCurrentQuestion().text}
              </h3>
              
              <div className="space-y-4">
                {getCurrentQuestion().options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                    disabled={!!selectedAnswer}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedAnswer === option.id
                        ? option.correct
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        : selectedAnswer
                        ? "bg-white/5 text-white/50 cursor-not-allowed"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center mr-4">
                        {option.id.toUpperCase()}
                      </div>
                      <span className="text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                </p>
                <p className="text-white/80 text-base mb-4">
                  You earned {coins} coins! Keep saving and learning about money!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2">
                  <span>Total: {coins} Coins</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                </p>
                <p className="text-white/80 text-base mb-4">
                  Don't worry! Keep practicing and you'll become a saving expert!
                </p>
                <p className="text-white/70 text-sm mb-4">
                  You earned {coins} coins!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnSaving;