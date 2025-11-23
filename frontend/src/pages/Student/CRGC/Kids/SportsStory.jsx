import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SportsStory = () => {
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
      text: "The teacher asks who can play cricket. Some boys raise their hands immediately. What should happen next?",
      options: [
        {
          id: "a",
          text: "Only boys should play cricket",
          emoji: "⚾",
          description: "That's not fair. Sports should be open to everyone regardless of gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "The teacher should ask if girls are also interested",
          emoji: "🙋‍♀️",
          description: "Great! Everyone should have equal opportunities to participate in sports.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Girls should stay on the sidelines and watch",
          emoji: "👀",
          description: "That's not inclusive. Everyone deserves a chance to participate.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Some girls want to join the cricket team, but other students are saying girls can't play as well as boys. How do you respond?",
      options: [
        {
          id: "a",
          text: "Agree that girls aren't as good at sports",
          emoji: "😞",
          description: "That's not respectful. Skill in sports isn't determined by gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Encourage everyone to try out and let skill determine the team",
          emoji: "💪",
          description: "Perfect! Giving everyone a fair chance based on skill promotes equality.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay quiet and let others decide",
          emoji: "🤫",
          description: "That's not helpful. Speaking up for fairness is important.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "During practice, a girl hits a great shot but some boys complain she got lucky. What should you do?",
      options: [
        {
          id: "a",
          text: "Join in and make fun of her",
          emoji: "😂",
          description: "That's not kind. Everyone deserves respect for their efforts.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Acknowledge her good shot and encourage her",
          emoji: "👏",
          description: "Wonderful! Recognizing good plays from everyone promotes a positive environment.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell her to let the boys practice",
          emoji: "🙅",
          description: "That's not fair. Everyone should have equal practice time.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The team captain position is open. There's a boy and a girl who are equally skilled. Who should be chosen?",
      options: [
        {
          id: "a",
          text: "The boy automatically because he's male",
          emoji: "👨",
          description: "That's not fair. Leadership should be based on skill and qualities, not gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Let them both demonstrate leadership and choose based on merit",
          emoji: "🏆",
          description: "Excellent! Choosing leaders based on merit ensures the best person leads.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Let the teacher decide without considering skills",
          emoji: "🤔",
          description: "That's not the best approach. Skills and qualities should be considered.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Some parents are concerned that mixed-gender teams won't be competitive. How would you address this?",
      options: [
        {
          id: "a",
          text: "Agree with the parents that boys and girls should be separate",
          emoji: "💔",
          description: "That's not promoting equality. Mixed teams can be very successful.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that mixed teams promote fairness and teamwork skills",
          emoji: "🤝",
          description: "Great! Mixed teams help develop important life skills like cooperation and respect.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the parents' concerns",
          emoji: "👂",
          description: "That's not helpful. Addressing concerns respectfully is important.",
          isCorrect: true
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Sports Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-21"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={21}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
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
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default SportsStory;