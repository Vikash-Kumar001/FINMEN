import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalFirstBank = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-47";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What is the main purpose of visiting a bank?",
      options: [
        { text: "To save and manage money safely", correct: true },
        { text: "To buy toys and games", correct: false },
        { text: "To play video games", correct: false },
        { text: "To watch movies", correct: false }
      ],
      feedback: {
        correct: "Excellent! Banks help you save and manage money safely!",
        wrong: "Banks are for saving and managing money safely!"
      }
    },
    {
      id: 2,
      question: "How does a bank help people?",
      options: [
        { text: "By keeping money safe and helping it grow", correct: true },
        { text: "By giving away free toys", correct: false },
        { text: "By playing games with you", correct: false },
        { text: "By buying you candy", correct: false }
      ],
      feedback: {
        correct: "Perfect! Banks keep your money safe and help it grow!",
        wrong: "Banks keep your money safe and help it grow!"
      }
    },
    {
      id: 3,
      question: "How does saving money in a bank make you feel?",
      options: [
        { text: "Safe and secure", correct: true },
        { text: "Scared and worried", correct: false },
        { text: "Bored and tired", correct: false },
        { text: "Angry and upset", correct: false }
      ],
      feedback: {
        correct: "Great! Saving in a bank makes you feel safe and secure!",
        wrong: "Saving in a bank should make you feel safe and secure!"
      }
    },
    {
      id: 4,
      question: "What is one important thing you learn about banks?",
      options: [
        { text: "Banks protect and grow your money", correct: true },
        { text: "Banks are only for adults", correct: false },
        { text: "Banks are scary places", correct: false },
        { text: "Banks don't help kids", correct: false }
      ],
      feedback: {
        correct: "Smart! Banks protect and grow your money!",
        wrong: "Banks protect and grow your money, even for kids!"
      }
    },
    {
      id: 5,
      question: "What does visiting a bank teach you about money?",
      options: [
        { text: "How to manage money wisely", correct: true },
        { text: "How to spend all your money", correct: false },
        { text: "How to hide money", correct: false },
        { text: "How to waste money", correct: false }
      ],
      feedback: {
        correct: "Perfect! Banks teach you to manage money wisely!",
        wrong: "Banks teach you how to manage money wisely!"
      }
    }
  ];

  const handleAnswer = (option) => {
    if (answered) return; // Prevent multiple clicks
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.correct;
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        // This is the last question (5th), show results
        setShowResult(true);
      } else {
        // Move to next question
        setCurrentQuestion((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Journal of First Bank Visit"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}: Test your knowledge about banks!` : "Journal Complete!"}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        {!showResult && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              {currentQuestionData.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className="w-full min-h-[60px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className="mt-6 text-lg font-semibold text-white/80">
              Score: {score}/{questions.length}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalFirstBank;