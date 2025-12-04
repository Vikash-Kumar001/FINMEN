import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-88";
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
      text: "Your friend says 'Everyone is doing it'. What do you think?",
      options: [
        {
          id: "b",
          text: "I should do it too",
          emoji: "🐑",
          description: "Don't just follow the crowd.",
          isCorrect: false
        },
        {
          id: "a",
          text: "I make my own choices",
          emoji: "🦁",
          description: "Be a leader, not a follower!",
          isCorrect: true
        },
        {
          id: "c",
          text: "I don't know",
          emoji: "🤷",
          description: "Trust yourself to make good choices.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A friend calls you 'chicken' for not smoking. How do you feel?",
      options: [
        {
          id: "c",
          text: "Sad and give in",
          emoji: "😢",
          description: "Don't let mean words change your mind.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Proud to be healthy",
          emoji: "😎",
          description: "Being healthy is the coolest thing!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Angry and fight",
          emoji: "😠",
          description: "Fighting isn't the answer.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What makes a good friend?",
      options: [
        {
          id: "a",
          text: "Someone who respects you",
          emoji: "🤝",
          description: "Good friends want you to be safe and happy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Someone who dares you",
          emoji: "😈",
          description: "Dares can be dangerous.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Someone who gives you candy",
          emoji: "🍬",
          description: "Friendship is more than just treats.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How do you say NO to a bad idea?",
      options: [
        {
          id: "c",
          text: "Mumble it",
          emoji: "😶",
          description: "Speak up so they hear you!",
          isCorrect: false
        },
        
        {
          id: "b",
          text: "Laugh",
          emoji: "😂",
          description: "They might think you are joking.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say it loud and clear",
          emoji: "📢",
          description: "Make sure they know you mean it.",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What if your friend keeps pressuring you?",
      options: [
        {
          id: "b",
          text: "Stay and listen",
          emoji: "👂",
          description: "Don't stay if they won't stop.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Yell at them",
          emoji: "🤬",
          description: "Stay calm and safe.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Leave and find new friends",
          emoji: "👋",
          description: "You deserve friends who treat you well.",
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
    navigate("/student/health-male/kids/reflex-danger-alert");
  };

  return (
    <GameShell
      title="Peer Story"
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

export default PeerStory;
