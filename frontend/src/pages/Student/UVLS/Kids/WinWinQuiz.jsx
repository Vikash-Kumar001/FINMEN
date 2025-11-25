import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WinWinQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-72";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scenario: "Two want same swing.",
      options: [
        { id: "a", text: "Take turns", emoji: "🔄", isWinWin: true },
        { id: "b", text: "One swings all day", emoji: "🏞️", isWinWin: false },
        { id: "c", text: "No one swings", emoji: "🚫", isWinWin: false }
      ]
    },
    {
      id: 2,
      scenario: "Share one cookie.",
      options: [
        { id: "a", text: "Split half", emoji: "🍪", isWinWin: true },
        { id: "b", text: "Eat alone", emoji: "😋", isWinWin: false },
        { id: "c", text: "Throw away", emoji: "🗑️", isWinWin: false }
      ]
    },
    {
      id: 3,
      scenario: "Choose game to play.",
      options: [
        { id: "a", text: "Play both games", emoji: "🎲", isWinWin: true },
        { id: "b", text: "Play one only", emoji: "1️⃣", isWinWin: false },
        { id: "c", text: "No game", emoji: "😔", isWinWin: false }
      ]
    },
    {
      id: 4,
      scenario: "Want different TV shows.",
      options: [
        { id: "a", text: "Watch one then other", emoji: "📺", isWinWin: true },
        { id: "b", text: "Watch none", emoji: "🚫", isWinWin: false },
        { id: "c", text: "Argue", emoji: "🗣️", isWinWin: false }
      ]
    },
    {
      id: 5,
      scenario: "Share crayons.",
      options: [
        { id: "a", text: "Trade colors", emoji: "🖍️", isWinWin: true },
        { id: "b", text: "Keep all", emoji: "🤲", isWinWin: false },
        { id: "c", text: "Break them", emoji: "💥", isWinWin: false }
      ]
    }
  ];

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers, { 
      questionId: questions[currentQuestion].id, 
      answer: selectedOption,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isWinWin
    }];
    
    setAnswers(newAnswers);
    
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isWinWin;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 800 : 0);
    } else {
      const correctAnswers = newAnswers.filter(ans => ans.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Win-Win Quiz"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 4}
      
      gameId="uvls-kids-72"
      gameType="uvls"
      totalLevels={100}
      currentLevel={72}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {answers.filter(a => a.isCorrect).length}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 font-semibold">
                {getCurrentQuestion().scenario}
              </p>
              
              <div className="space-y-3">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 flex items-center gap-3"
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="text-white font-medium text-left">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 4 ? "🎉 Win-Win Winner!" : "💪 Find More Wins!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {finalScore} out of {questions.length} correct!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 4 ? "You earned 3 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 4 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WinWinQuiz;