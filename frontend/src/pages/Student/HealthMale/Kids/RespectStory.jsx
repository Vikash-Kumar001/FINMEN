import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RespectStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-35";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Why should we respect private parts?",
      options: [
        {
          id: "b",
          text: "Because they're ugly",
          emoji: "😞",
          description: "Private parts are special and deserve respect",
          isCorrect: false
        },
        {
          id: "a",
          text: "Because they're special & private",
          emoji: "✨",
          description: "All body parts deserve respect, especially private ones",
          isCorrect: true
        },
        {
          id: "c",
          text: "Because they're scary",
          emoji: "😨",
          description: "Private parts are normal and need respect",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone asks to see your private parts. What do you say?",
      options: [
        {
          id: "a",
          text: "No, that's private",
          emoji: "🛡️",
          description: "It's important to protect your privacy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Maybe later",
          emoji: "⏰",
          description: "Private parts should always stay private",
          isCorrect: false
        },
        {
          id: "c",
          text: "Okay, show me yours first",
          emoji: "👀",
          description: "Private parts are not for sharing",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see someone else's private parts by accident. What do you do?",
      options: [
        {
          id: "c",
          text: "Tell everyone",
          emoji: "📢",
          description: "Respect privacy by looking away and not talking",
          isCorrect: false
        },
        {
          id: "b",
          text: "Laugh at them",
          emoji: "😂",
          description: "Everyone deserves privacy and respect",
          isCorrect: false
        },
        {
          id: "a",
          text: "Look away and respect privacy",
          emoji: "🙏",
          description: "Respect means giving others privacy too",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friend shows you their private parts. How do you respond?",
      options: [
        {
          id: "b",
          text: "Show them yours too",
          emoji: "👀",
          description: "Private parts should stay private",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell the teacher immediately",
          emoji: "👩‍🏫",
          description: "It's better to talk to a trusted adult",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and walk away",
          emoji: "🚶",
          description: "Respect your own privacy and boundaries",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is body respect important for everyone?",
      options: [
        {
          id: "b",
          text: "Only for grown-ups",
          emoji: "👨‍🦳",
          description: "Everyone deserves body respect at any age",
          isCorrect: false
        },
        {
          id: "a",
          text: "Because all bodies are special",
          emoji: "🌟",
          description: "Every person deserves respect and privacy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when others are watching",
          emoji: "👁️",
          description: "Body respect is important always",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    const isLastQuestion = currentQuestion === questions.length - 1;
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Respect Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={35}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult && getCurrentQuestion() ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default RespectStory;
