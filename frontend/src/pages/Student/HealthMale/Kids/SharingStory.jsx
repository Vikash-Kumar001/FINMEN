import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SharingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-55";
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
      text: "You feel scared during a thunderstorm. What should you do?",
      options: [
        {
          id: "a",
          text: "Tell your parents you're scared",
          emoji: "💬",
          description: "Sharing feelings helps you feel better and safer",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide under the bed and stay quiet",
          emoji: "🛏️",
          description: "It's better to talk about fears than hide them",
          isCorrect: false
        },
        {
          id: "c",
          text: "Pretend you're not scared",
          emoji: "😊",
          description: "It's okay to admit when you're scared",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says something that hurts your feelings. What do you do?",
      options: [
        {
          id: "a",
          text: "Tell them how you feel",
          emoji: "🗣️",
          description: "Sharing feelings helps friends understand each other",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never talk to them again",
          emoji: "🚫",
          description: "Friends can work through hurt feelings together",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say nothing and stay mad",
          emoji: "😠",
          description: "Talking about hurt feelings helps solve problems",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel worried about a test at school. What's the best choice?",
      options: [
        {
          id: "b",
          text: "Keep worry inside and don't study",
          emoji: "😰",
          description: "Sharing worries can help you feel supported",
          isCorrect: false
        },
        {
          id: "a",
          text: "Talk to teacher or parents about it",
          emoji: "👨‍🏫",
          description: "Adults can help you with worries and give good advice",
          isCorrect: true
        },
        {
          id: "c",
          text: "Pretend everything is fine",
          emoji: "😄",
          description: "It's okay to ask for help when worried",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You feel excited about your birthday party. What should you do?",
      options: [
        {
          id: "a",
          text: "Share your excitement with family",
          emoji: "🎉",
          description: "Sharing happy feelings makes everyone feel good",
          isCorrect: true
        },
        {
          id: "b",
          text: "Act like you don't care",
          emoji: "😑",
          description: "It's fun to share excitement with others",
          isCorrect: false
        },
        {
          id: "c",
          text: "Keep excitement to yourself",
          emoji: "🤐",
          description: "Sharing excitement makes celebrations more fun",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You feel angry at your sibling. What's the healthy choice?",
      options: [
        {
          id: "a",
          text: "Tell them calmly how you feel",
          emoji: "💭",
          description: "Calm talking helps solve problems and feel better",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yell and say mean things",
          emoji: "😡",
          description: "Talking calmly helps solve problems better",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay silent and stay mad",
          emoji: "🤐",
          description: "Expressing feelings with words is healthier",
          isCorrect: false
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
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Sharing Story"
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
      backPath="/games/health-male/kids"
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

export default SharingStory;
