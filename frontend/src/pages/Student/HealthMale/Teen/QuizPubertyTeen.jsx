import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizPubertyTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-22";

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
      text: "What is the main cause of puberty changes?",
      options: [
         {
          id: "a",
          text: "Hormones",
          emoji: "🧬",
          description: "Chemical messengers in your body.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eating vegetables",
          emoji: "🥦",
          description: "Healthy, but not the cause.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Playing video games",
          emoji: "🎮",
          description: "Games don't cause puberty.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which is a sign of puberty in boys?",
      options: [
        {
          id: "c",
          text: "Shrinking feet",
          emoji: "🦶",
          description: "Feet usually grow bigger.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deepening voice",
          emoji: "🗣️",
          description: "The voice box gets larger.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Losing hair",
          emoji: "👴",
          description: "That happens much later in life.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When does puberty usually start?",
      options: [
        {
          id: "b",
          text: "Age 5-7",
          emoji: "🧒",
          description: "That's too early.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Age 9-14",
          emoji: "👦",
          description: "This is the typical range.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Age 20",
          emoji: "👨",
          description: "That's adulthood.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What happens to your skin during puberty?",
      options: [
        {
          id: "c",
          text: "It turns blue",
          emoji: "🔵",
          description: "Only in movies.",
          isCorrect: false
        },
        {
          id: "b",
          text: "It gets drier",
          emoji: "🌵",
          description: "Usually it gets oilier.",
          isCorrect: false
        },
        {
          id: "a",
          text: "It gets oilier",
          emoji: "💧",
          description: "Can lead to acne.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Is it normal to feel awkward during puberty?",
      options: [
        {
          id: "a",
          text: "Yes, absolutely",
          emoji: "😅",
          description: "Your body and mind are changing fast.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, never",
          emoji: "🤖",
          description: "Everyone feels it.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if you are weird",
          emoji: "👽",
          description: "It's not weird, it's growing up.",
          isCorrect: false
        },
        
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
    navigate("/student/health-male/teens/reflex-puberty-check-teen");
  };

  return (
    <GameShell
      title="Quiz on Puberty"
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

export default QuizPubertyTeen;
