import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CyberbullyStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen receives mean messages online. Should she ignore or report?",
      options: [
        {
          id: "a",
          text: "Ignore the messages and hope they stop",
          emoji: "🙈",
          description: "That's not the best approach. Ignoring cyberbullying can allow it to continue and escalate.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Report the messages to a trusted adult",
          emoji: "💻",
          description: "That's right! Reporting cyberbullying is the best way to stop it and get help.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Someone shares embarrassing photos of a classmate online without permission. What should you do?",
      options: [
        {
          id: "a",
          text: "Share the photos with others for laughs",
          emoji: "😂",
          description: "That's not right. Sharing embarrassing photos without consent is a form of cyberbullying.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell a trusted adult and support the classmate",
          emoji: "🛡️",
          description: "Perfect! Supporting the victim and reporting the incident helps stop cyberbullying.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "A friend asks you to join in teasing someone online. How should you respond?",
      options: [
        {
          id: "a",
          text: "Join in to avoid losing the friendship",
          emoji: "👥",
          description: "That's not the right choice. Participating in online teasing makes you part of the problem.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Refuse to participate and劝告 friend to stop",
          emoji: "✋",
          description: "Great choice! Standing up against cyberbullying shows true friendship and integrity.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You notice someone being excluded from online group chats and receiving mean comments. What should you do?",
      options: [
        {
          id: "a",
          text: "Stay out of it to avoid getting involved",
          emoji: "🤐",
          description: "That's not helpful. Staying silent allows cyberbullying to continue unchecked.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Reach out to the person and report the behavior",
          emoji: "🤗",
          description: "Wonderful! Supporting the victim and reporting the behavior helps create a safer online environment.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Someone creates a fake profile to impersonate and embarrass another student online. How should this be handled?",
      options: [
        {
          id: "a",
          text: "Ignore it as just a joke",
          emoji: "🎭",
          description: "That's not appropriate. Impersonating someone online is a serious form of cyberbullying.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Report it immediately to school authorities",
          emoji: "🚨",
          description: "Excellent! Reporting identity theft and impersonation is crucial for stopping this type of cyberbullying.",
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Cyberbully Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-31"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={31}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
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

export default CyberbullyStory;