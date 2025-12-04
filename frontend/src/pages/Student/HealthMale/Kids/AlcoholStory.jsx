import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AlcoholStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-85";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You see adults drinking at a party. What should you drink?",
      options: [
        {
          id: "b",
          text: "Try their drink",
          emoji: "🍷",
          description: "Alcohol is for adults only",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Pretend to drink",
          emoji: "🎭",
          description: "Just be yourself and drink what you like",
          isCorrect: false
        },
        {
          id: "a",
          text: "Juice or Water",
          emoji: "🧃",
          description: "Stick to healthy drinks for kids",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Why is alcohol bad for kids?",
      options: [
        {
          id: "a",
          text: "Juice or Water",
          emoji: "🧃",
          description: "Stick to healthy drinks for kids",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's too expensive",
          emoji: "💰",
          description: "Cost isn't the main problem",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "It makes you too tall",
          emoji: "📏",
          description: "It doesn't make you tall",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What happens if you drink alcohol?",
      options: [
        {
          id: "b",
          text: "You become a superhero",
          emoji: "🦸",
          description: "Alcohol makes you weaker, not stronger",
          isCorrect: false
        },
        {
          id: "a",
          text: "You might get sick and dizzy",
          emoji: "🤢",
          description: "It makes your body feel bad",
          isCorrect: true
        },
        {
          id: "c",
          text: "You run faster",
          emoji: "🏃",
          description: "It makes you slow and clumsy",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "If a friend dares you to drink, what do you do?",
      options: [
        {
          id: "c",
          text: "Do it to be cool",
          emoji: "😎",
          description: "Being safe is cooler than doing dangerous dares",
          isCorrect: false
        },
        
        {
          id: "b",
          text: "Drink a little bit",
          emoji: "🤏",
          description: "Even a little bit is bad for kids",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say No and leave",
          emoji: "🚶",
          description: "Walk away from dangerous situations",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Who can you talk to if you are worried?",
      options: [
        {
          id: "b",
          text: "No one",
          emoji: "🤐",
          description: "Always share your worries",
          isCorrect: false
        },
        {
          id: "c",
          text: "Your pet",
          emoji: "🐶",
          description: "Pets listen, but adults can help",
          isCorrect: false
        },
        {
          id: "a",
          text: "Parents or Teachers",
          emoji: "👨‍👩‍👧",
          description: "Trusted adults are there to help you",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/say-no-poster");
  };

  return (
    <GameShell
      title="Alcohol Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default AlcoholStory;
