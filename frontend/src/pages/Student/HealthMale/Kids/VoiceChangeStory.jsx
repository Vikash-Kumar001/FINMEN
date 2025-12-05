import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const VoiceChangeStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-25";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your voice cracks for the first time while talking. Should you panic?",
      options: [
        {
          id: "b",
          text: "Yes, run to doctor",
          emoji: "🏥",
          description: "Voice cracking is a normal part of puberty",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, it's normal",
          emoji: "🗣️",
          description: "Voice changes are completely normal during growth",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide from friends",
          emoji: "🙈",
          description: "Voice changes happen to all boys eventually",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your voice sounds different when you sing. What should you do?",
      options: [
        {
          id: "a",
          text: "Keep practicing singing",
          emoji: "🎵",
          description: "Practice helps as your voice develops",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop singing forever",
          emoji: "😢",
          description: "Voice changes are temporary",
          isCorrect: false
        },
        {
          id: "c",
          text: "Pretend nothing changed",
          emoji: "😐",
          description: "It's okay to acknowledge voice changes",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Friends laugh when your voice squeaks. How do you respond?",
      options: [
        {
          id: "c",
          text: "Get very angry",
          emoji: "😠",
          description: "Friends might not understand voice changes yet",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stop talking completely",
          emoji: "🤐",
          description: "Voice changes are normal and temporary",
          isCorrect: false
        },
        {
          id: "a",
          text: "Laugh with them",
          emoji: "😄",
          description: "Having a good attitude helps during changes",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your voice gets deeper over time. What does this mean?",
      options: [
        {
          id: "b",
          text: "Something is wrong",
          emoji: "😟",
          description: "Deepening voice is a normal puberty change",
          isCorrect: false
        },
        {
          id: "c",
          text: "You're becoming an adult",
          emoji: "🧑",
          description: "Voice deepening shows normal development",
          isCorrect: false
        },
        {
          id: "a",
          text: "You're growing up",
          emoji: "🌱",
          description: "Voice changes are part of normal growth",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You feel self-conscious about your changing voice. What helps?",
      options: [
        {
          id: "b",
          text: "Try to talk less",
          emoji: "🤫",
          description: "Talking normally helps you adjust",
          isCorrect: false
        },
        {
          id: "a",
          text: "Talk to trusted adult",
          emoji: "👨‍👦",
          description: "Adults can explain that voice changes are normal",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the changes",
          emoji: "🙄",
          description: "Understanding changes helps you feel better",
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Voice Change Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={25}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Story {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🗣️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Voice Changes</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className={`bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${choices.some(c => c.question === currentQuestion) ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
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

export default VoiceChangeStory;
