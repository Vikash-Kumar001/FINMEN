import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizPeerPressure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-62";
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
      text: "What does 'peer pressure' mean?",
      options: [
        {
          id: "b",
          text: "When friends try to make you do something",
          emoji: "👥",
          description: "Peer pressure is when friends push you to do things",
          isCorrect: true
        },
        {
          id: "a",
          text: "When a teacher teaches you",
          emoji: "👨‍🏫",
          description: "That's teaching, not peer pressure",
          isCorrect: false
        },
        {
          id: "c",
          text: "When family gives advice",
          emoji: "👨‍👩‍👧",
          description: "Family advice is different from peer pressure",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why do friends sometimes pressure you?",
      options: [
        {
          id: "c",
          text: "They want to be mean to you",
          emoji: "😈",
          description: "Friends might pressure you because they want you to fit in",
          isCorrect: false
        },
        {
          id: "a",
          text: "They want you to fit in with the group",
          emoji: "🤝",
          description: "Sometimes friends think fitting in means doing the same things",
          isCorrect: true
        },
        {
          id: "b",
          text: "They don't really care about you",
          emoji: "😔",
          description: "Real friends care about you, even if they make mistakes",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's a healthy way to handle peer pressure?",
      options: [
        {
          id: "b",
          text: "Always do what friends want",
          emoji: "👌",
          description: "It's okay to say no when something doesn't feel right",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never talk to those friends again",
          emoji: "🚫",
          description: "You can say no while still being friends",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no when it doesn't feel right",
          emoji: "🙅",
          description: "It's brave and healthy to say no to bad ideas",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if friends pressure you to do something dangerous?",
      options: [
        {
          id: "a",
          text: "Go along with it to fit in",
          emoji: "😅",
          description: "Safety is more important than fitting in",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell a trusted adult",
          emoji: "🆘",
          description: "Adults can help you handle dangerous situations",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it and hope it goes away",
          emoji: "🙈",
          description: "It's better to speak up than ignore dangerous situations",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you be a good friend when others face peer pressure?",
      options: [
        {
          id: "b",
          text: "Pressure them even more",
          emoji: "👊",
          description: "Good friends support each other in making good choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Don't get involved",
          emoji: "🤷",
          description: "Supporting friends in saying no is being a good friend",
          isCorrect: false
        },
        {
          id: "a",
          text: "Help them say no and make good choices",
          emoji: "🤝",
          description: "True friends help each other do the right thing",
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
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Quiz on Peer Pressure"
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

export default QuizPeerPressure;
