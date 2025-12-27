import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const EventStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getSustainabilityKidsGames({});
      const currentGame = games.find(g => g.id === "sustainability-kids-93");
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state]);

  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-93";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "School has a cleanup day. Do you join or stay home?",
      options: [
        { id: "home", text: "Stay home", emoji: "🏠", isCorrect: false },
        { id: "maybe", text: "Maybe if friends go", emoji: "👥", isCorrect: false },
        { id: "busy", text: "I have other plans", emoji: "📅", isCorrect: false },
        { id: "join", text: "Join the cleanup", emoji: "🧹", isCorrect: true },
      ]
    },
    {
      id: 2,
      text: "Community plants trees. Do you volunteer to help?",
      options: [
        { id: "no", text: "No, thanks", emoji: "🙅", isCorrect: false },
        { id: "watch", text: "Just watch", emoji: "👀", isCorrect: false },
        { id: "volunteer", text: "Volunteer", emoji: "🌳", isCorrect: true },
        { id: "busy", text: "Too busy", emoji: "⏰", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Your school organizes a recycling drive. Do you participate?",
      options: [
        { id: "no", text: "No, thanks", emoji: "❌", isCorrect: false },
        { id: "participate", text: "Participate", emoji: "♻️", isCorrect: true },
        { id: "maybe", text: "Maybe later", emoji: "🤔", isCorrect: false },
        { id: "not", text: "Not interested", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "The community hosts an eco-friendly fair. Do you attend?",
      options: [
        { id: "attend", text: "Attend", emoji: "🎪", isCorrect: true },
        { id: "no", text: "No, thanks", emoji: "🙅", isCorrect: false },
        { id: "maybe", text: "Maybe if parents come", emoji: "👨‍👩‍👧", isCorrect: false },
        { id: "boring", text: "Sounds boring", emoji: "😴", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Your neighborhood organizes a car-free day. Do you join?",
      options: [
        { id: "no", text: "No, I need my car", emoji: "🚗", isCorrect: false },
        { id: "join", text: "Join", emoji: "🚶", isCorrect: true },
        { id: "maybe", text: "Maybe just for part of the day", emoji: "⏰", isCorrect: false },
        { id: "ignore", text: "Ignore it", emoji: "🙈", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        const score = choices.filter(choice => choice.isCorrect).length + (isCorrect ? 1 : 0);
        setFinalScore(score);
        setShowResult(true);
      }
    }, 1500);
  };

  const currentQuestionData = questions[currentQuestion];
  
  return (
    <GameShell
      title="Event Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={coins}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={questions.length}
      showConfetti={showResult && finalScore === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      {!showResult ? (
        <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">🎪</div>
              
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {currentQuestionData.text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData.options.map((option, index) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrectOption = option.isCorrect;
                  let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
                  
                  if (showFeedback) {
                    if (isSelected) {
                      buttonClass = isCorrectOption 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg" 
                        : "bg-gradient-to-r from-red-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg";
                    } else if (isCorrectOption) {
                      buttonClass = "bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg";
                    }
                  }
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => !showFeedback && handleChoice(option.id)}
                      disabled={showFeedback}
                      className={buttonClass}
                    >
                      <div className="text-4xl mb-3">{option.emoji}</div>
                      <h4 className="font-bold text-base">{option.text}</h4>
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && (
                <div className={`rounded-lg p-5 mt-6 ${
                  questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white whitespace-pre-line">
                    {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                      ? "Great job! Participating in community events helps build a better world! 🎉"
                      : "Nice try! Participating in community events helps everyone work together for sustainability!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎪</div>
          <h3 className="text-2xl font-bold text-white">Great job!</h3>
          <p className="text-gray-300">
            You got {finalScore} out of {questions.length} questions correct!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Keep participating in community events! 🌍
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default EventStory;