import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const CollegeApplicationSimulation = () => {
  const location = useLocation();
  const gameId = "dcos-teen-64";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getDcosTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
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
  }, [location.state, gameId]);

  const questions = [
    {
      id: 1,
      text: "College checks social media. Which profile is better?",
      emoji: "🎓",
      profiles: [
        { id: 1, name: "Clean and respectful posts", isBetter: true },
        { id: 2, name: "Rude and offensive content", isBetter: false },
        { id: 3, name: "Inappropriate jokes and memes", isBetter: false }
      ]
    },
    {
      id: 2,
      text: "Which social media profile would impress colleges?",
      emoji: "📚",
      profiles: [
        { id: 1, name: "Professional and positive content", isBetter: true },
        { id: 2, name: "Negative and complaining posts", isBetter: false },
        { id: 3, name: "Controversial and argumentative", isBetter: false }
      ]
    },
    {
      id: 3,
      text: "What kind of profile helps college applications?",
      emoji: "✅",
      profiles: [
        { id: 1, name: "Respectful and achievement-focused", isBetter: true },
        { id: 2, name: "Insulting and disrespectful", isBetter: false },
        { id: 3, name: "Unprofessional and immature", isBetter: false }
      ]
    },
    {
      id: 4,
      text: "Which profile shows good character to colleges?",
      emoji: "🌟",
      profiles: [
        { id: 1, name: "Positive and supportive posts", isBetter: true },
        { id: 2, name: "Mean and hurtful comments", isBetter: false },
        { id: 3, name: "Inappropriate and offensive", isBetter: false }
      ]
    },
    {
      id: 5,
      text: "What profile would colleges prefer to see?",
      emoji: "🏆",
      profiles: [
        { id: 1, name: "Clean, respectful, and mature", isBetter: true },
        { id: 2, name: "Rude, negative, and immature", isBetter: false },
        { id: 3, name: "Controversial and unprofessional", isBetter: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setSelectedOption(optionId);
    setAnswered(true);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedProfile = currentQuestionData.profiles.find(p => p.id === optionId);
    const isCorrect = selectedProfile?.isBetter || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="College Application Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-6 text-center">{currentQuestionData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg md:text-xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestionData.profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => handleChoice(profile.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all ${
                    answered && profile.isBetter
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !profile.isBetter && selectedOption === profile.id
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedOption === profile.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-semibold text-base md:text-lg text-center">{profile.name}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🎓</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect College Applicant! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Excellent! Colleges check social media profiles. A clean, respectful, and positive profile helps your application. Rude, offensive, or unprofessional content can hurt your chances. Keep your online presence professional and positive to impress colleges!"
                : "Great job! Keep learning about what colleges look for!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Keep your profile clean and respectful - colleges check social media!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CollegeApplicationSimulation;
