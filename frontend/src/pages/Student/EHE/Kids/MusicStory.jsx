import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MusicStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A girl loves music. Should she stop after school?",
      options: [
        {
          id: "a",
          text: "Yes, stop learning music after school",
          emoji: "🔇",
          description: "Music is a valuable skill that can be enjoyed throughout your life!",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, keep learning and enjoying music",
          emoji: "🎵",
          description: "Great choice! Music is a lifelong passion that brings joy and creativity!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Learning music helps develop:",
      options: [
        {
          id: "a",
          text: "Discipline, creativity, and listening skills",
          emoji: "🧠",
          description: "Exactly! Music education develops many valuable life skills!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing useful",
          emoji: "❌",
          description: "Actually, music education provides many cognitive and social benefits!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should the girl do to continue her music journey?",
      options: [
        {
          id: "a",
          text: "Practice regularly and explore different genres",
          emoji: "🎸",
          description: "Perfect! Regular practice and exploration help musicians grow!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give up because it's too hard",
          emoji: "😴",
          description: "Learning music takes effort, but the rewards are worth it!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Music can be enjoyed in many ways:",
      options: [
        {
          id: "a",
          text: "Playing instruments, singing, or listening",
          emoji: "🎶",
          description: "Right! There are many ways to engage with music throughout life!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only in school performances",
          emoji: "🏫",
          description: "Music can be enjoyed in many contexts beyond school!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it good to continue learning music as you grow?",
      options: [
        {
          id: "a",
          text: "It provides lifelong enjoyment and personal growth",
          emoji: "🌟",
          description: "Excellent! Music offers ongoing enrichment and personal development!",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's only for children",
          emoji: "👶",
          description: "Actually, people of all ages can enjoy and benefit from music!",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Music Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-95"
      gameType="ehe"
      totalLevels={10}
      currentLevel={95}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white/90">{option.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default MusicStory;