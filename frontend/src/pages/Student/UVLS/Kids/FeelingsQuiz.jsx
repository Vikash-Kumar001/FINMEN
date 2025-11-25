import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const FeelingsQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-2";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const vignettes = [
    {
      id: 1,
      text: "Sarah sees her friend crying on the playground.",
      question: "What is the caring action?",
      options: [
        { id: "a", text: "Ask what's wrong and listen", emoji: "🤗", isCorrect: true },
        { id: "b", text: "Laugh at them", emoji: "😂", isCorrect: false },
        { id: "c", text: "Walk away", emoji: "🚶", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Tom's classmate dropped their books in the hallway.",
      question: "What should Tom do?",
      options: [
        { id: "a", text: "Help pick them up", emoji: "🤝", isCorrect: true },
        { id: "b", text: "Step over them", emoji: "👣", isCorrect: false },
        { id: "c", text: "Ignore and walk past", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Maya's friend is sitting alone at lunch looking sad.",
      question: "What is the kind thing to do?",
      options: [
        { id: "a", text: "Invite them to sit together", emoji: "🍱", isCorrect: true },
        { id: "b", text: "Sit far away", emoji: "🏃", isCorrect: false },
        { id: "c", text: "Pretend not to see", emoji: "🙄", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "A new student looks confused about where to go.",
      question: "What's the helpful action?",
      options: [
        { id: "a", text: "Offer to show them the way", emoji: "🗺️", isCorrect: true },
        { id: "b", text: "Watch them struggle", emoji: "👀", isCorrect: false },
        { id: "c", text: "Laugh at their confusion", emoji: "😏", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Your friend forgot their lunch money.",
      question: "What's the caring response?",
      options: [
        { id: "a", text: "Share your lunch with them", emoji: "🥪", isCorrect: true },
        { id: "b", text: "Eat alone", emoji: "🍔", isCorrect: false },
        { id: "c", text: "Ignore their problem", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      id: 6,
      text: "Someone is being teased by others.",
      question: "What should you do?",
      options: [
        { id: "a", text: "Stand up for them or get help", emoji: "🦸", isCorrect: true },
        { id: "b", text: "Join in the teasing", emoji: "😈", isCorrect: false },
        { id: "c", text: "Do nothing", emoji: "🫥", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers, { 
      questionId: vignettes[currentQuestion].id, 
      answer: selectedOption,
      isCorrect: vignettes[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
    }];
    
    setAnswers(newAnswers);
    
    const isCorrect = vignettes[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1); // 1 coin for correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < vignettes.length - 1) {
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

  const getCurrentVignette = () => vignettes[currentQuestion];

  return (
    <GameShell
      title="Feelings Quiz"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${vignettes.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 4}
      
      gameId="uvls-kids-2"
      gameType="uvls"
      totalLevels={10}
      currentLevel={2}
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
                <span className="text-white/80">Question {currentQuestion + 1}/{vignettes.length}</span>
                <span className="text-yellow-400 font-bold">Score: {answers.filter(a => a.isCorrect).length}/{vignettes.length}</span>
              </div>
              
              <p className="text-white text-lg mb-2 font-semibold">
                {getCurrentVignette().text}
              </p>
              
              <p className="text-white/90 text-base mb-6">
                {getCurrentVignette().question}
              </p>
              
              <div className="space-y-3">
                {getCurrentVignette().options.map(option => (
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
              {finalScore >= 4 ? "🎉 Great Job!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {finalScore} out of {vignettes.length} correct!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 4 ? "You earned 3 Coins! 🪙" : "Try again to earn coins!"}
            </p>
            {finalScore < 4 && (
              <button
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FeelingsQuiz;

