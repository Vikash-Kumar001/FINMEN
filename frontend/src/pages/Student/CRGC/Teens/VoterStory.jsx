import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VoterStory = () => {
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
      text: "At 18, what duty do you gain?",
      options: [
        {
          id: "a",
          text: "Right to vote",
          emoji: "🗳️",
          description: "That's right! At 18, citizens gain the right to vote in elections, which is both a right and a civic duty.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Right to drive",
          emoji: "🚗",
          description: "That's not correct. While you can get a driver's license at 18 in many places, the civic duty that begins at 18 is voting.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Right to drink alcohol",
          emoji: "🍺",
          description: "That's not right. The legal drinking age varies by country and is not necessarily connected to civic duties at 18.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is voting important for democracy?",
      options: [
        {
          id: "a",
          text: "It allows citizens to choose their representatives",
          emoji: "🏛️",
          description: "That's right! Voting is the foundation of democracy, allowing citizens to select leaders who represent their interests and values.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's just for entertainment",
          emoji: "🎮",
          description: "That's not correct. Voting is a serious civic responsibility that shapes the direction of government and society.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's only for politicians",
          emoji: "👨‍💼",
          description: "That's not right. Voting is a right and duty for all eligible citizens, not just politicians.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do before voting in an election?",
      options: [
        {
          id: "a",
          text: "Research candidates and issues",
          emoji: "🔍",
          description: "That's right! Being informed about candidates' positions and issues helps you make thoughtful voting decisions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ask friends to vote the same way",
          emoji: "👥",
          description: "That's not the best approach. While discussion is good, you should make your own informed decision based on research.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Vote without any preparation",
          emoji: "😴",
          description: "That's not responsible. Voting without understanding the issues and candidates doesn't serve democracy well.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a consequence of low voter turnout?",
      options: [
        {
          id: "a",
          text: "Government may not represent all citizens",
          emoji: "🤔",
          description: "That's right! Low turnout can lead to governments that don't reflect the views of the entire population, undermining democratic representation.",
          isCorrect: true
        },
        {
          id: "b",
          text: "More entertainment options",
          emoji: "📺",
          description: "That's not correct. Voter turnout affects governance, not entertainment choices.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Better weather",
          emoji: "☀️",
          description: "That's not right. Voter turnout has no connection to weather patterns.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can young voters make a difference?",
      options: [
        {
          id: "a",
          text: "By participating in elections and advocating for issues",
          emoji: "✊",
          description: "That's right! Young voters can influence policy by voting and raising awareness about issues that matter to their generation.",
          isCorrect: true
        },
        {
          id: "b",
          text: "By ignoring politics completely",
          emoji: "😴",
          description: "That's not helpful. Ignoring politics means giving up the power to influence decisions that affect your future.",
          isCorrect: false
        },
        {
          id: "c",
          text: "By following others without thinking",
          emoji: "🐑",
          description: "That's not effective. Making a difference requires independent thinking and active participation, not blind following.",
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Voter Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-75"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={75}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
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
          
          <h2 className="text-xl font-semibold text-white mb-4">
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

export default VoterStory;