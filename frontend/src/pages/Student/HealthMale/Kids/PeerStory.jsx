import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A classmate says 'Cool kids drink alcohol at parties.' Should you follow them?",
      options: [
        {
          id: "b",
          text: "Yes, to be cool like them",
          emoji: "😎",
          description: "Real coolness comes from making healthy choices, not following harmful trends",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, I make my own choices",
          emoji: "💪",
          description: "Being independent and healthy is much cooler than following bad influences",
          isCorrect: true
        },
        {
          id: "c",
          text: "Maybe just try a little",
          emoji: "🤏",
          description: "Even small amounts of alcohol are harmful for kids",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friends say 'Everyone smokes sometimes.' How do you respond?",
      options: [
        {
          id: "c",
          text: "Then I should try smoking too",
          emoji: "🚬",
          description: "You don't have to do what everyone else does - choose health",
          isCorrect: false
        },
        {
          id: "a",
          text: "Not everyone, and I choose not to",
          emoji: "🚫",
          description: "Making your own healthy decisions shows real strength",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ask why they want to smoke",
          emoji: "❓",
          description: "It's better to firmly say no than question others' choices",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Someone says 'Real friends share everything, even drinks.' What do you think?",
      options: [
        {
          id: "b",
          text: "Share drinks to be a good friend",
          emoji: "🍺",
          description: "Real friends protect each other from harm, not share dangerous things",
          isCorrect: false
        },
        {
          id: "a",
          text: "Real friends help each other stay healthy",
          emoji: "🤝",
          description: "True friends support healthy choices and look out for each other",
          isCorrect: true
        },
        {
          id: "c",
          text: "Say you don't drink",
          emoji: "🙅",
          description: "Being honest about your choices is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A popular kid offers you drugs and says 'It makes you feel great.' What do you do?",
      options: [
        {
          id: "c",
          text: "Try it to feel great",
          emoji: "😊",
          description: "Drugs are dangerous and illegal - feeling great comes from healthy activities",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and walk away",
          emoji: "🚶",
          description: "Walking away from danger shows real courage and wisdom",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ask what it feels like",
          emoji: "🤔",
          description: "The answer is always no to drugs - no matter what",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you be a good friend when others face substance pressure?",
      options: [
        {
          id: "b",
          text: "Join them to fit in",
          emoji: "👥",
          description: "Good friends help each other make healthy choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore what's happening",
          emoji: "🙈",
          description: "Supporting friends in saying no shows real friendship",
          isCorrect: false
        },
        {
          id: "a",
          text: "Help them say no and choose health",
          emoji: "🛡️",
          description: "Being a positive influence makes you a true friend",
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
    navigate("/student/health-male/kids/reflex-danger-alert");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Peer Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-88"
      gameType="health-male"
      totalLevels={90}
      currentLevel={88}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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
