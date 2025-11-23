import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DisagreementStory = () => {
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
      text: "Teen friends fight over a project idea. Should they discuss calmly or fight?",
      options: [
        {
          id: "a",
          text: "Fight and argue to prove who's right",
          emoji: "😠",
          description: "That's not productive. Fighting usually makes disagreements worse and damages relationships.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Discuss calmly and listen to each other's perspectives",
          emoji: "🗣️",
          description: "That's right! Calm discussion helps friends understand each other and find solutions that work for both.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stop being friends over this disagreement",
          emoji: "💔",
          description: "That's not necessary. Disagreements are normal in friendships and can actually strengthen relationships when handled well.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "After the discussion, one friend feels their idea wasn't fully heard. What should they do?",
      options: [
        {
          id: "a",
          text: "Insist on doing things their way only",
          emoji: "😤",
          description: "That's not collaborative. Being inflexible can damage the friendship and prevent good solutions.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask for clarification and express their feelings respectfully",
          emoji: "🙋",
          description: "Perfect! Communicating feelings respectfully helps ensure both friends feel heard and valued.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Give up on the project completely",
          emoji: "🏳️",
          description: "That's not helpful. Giving up prevents both friends from achieving their goals and resolving the issue.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "They decide to combine both ideas. How does this make them feel?",
      options: [
        {
          id: "a",
          text: "Frustrated that they didn't get their way completely",
          emoji: "😒",
          description: "That's not the right mindset. Collaboration often requires compromise for the best outcome.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Happy to have found a solution that includes both perspectives",
          emoji: "😊",
          description: "That's right! Finding a solution that works for both friends shows emotional intelligence and strengthens the relationship.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Indifferent because neither got exactly what they wanted",
          emoji: "😐",
          description: "That's not right. A good compromise should leave both friends feeling satisfied with the outcome.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Their combined project is a success. What do they learn from this experience?",
      options: [
        {
          id: "a",
          text: "That they should avoid working together in the future",
          emoji: "🚫",
          description: "That's not right. This positive experience should encourage them to collaborate again.",
          isCorrect: false
        },
        {
          id: "b",
          text: "That working through disagreements can lead to better outcomes",
          emoji: "📈",
          description: "Perfect! This experience shows that handling disagreements constructively can strengthen friendships and improve results.",
          isCorrect: true
        },
        {
          id: "c",
          text: "That disagreements are always a waste of time",
          emoji: "⏰",
          description: "That's not accurate. Disagreements, when handled well, can lead to growth and better solutions.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How might they handle future disagreements differently?",
      options: [
        {
          id: "a",
          text: "By immediately compromising without discussion",
          emoji: "🤝",
          description: "That's not ideal. Discussion is important to understand different perspectives before compromising.",
          isCorrect: false
        },
        {
          id: "b",
          text: "By taking time to cool down and then discussing respectfully",
          emoji: "❄️",
          description: "That's right! Taking time to cool down and then having a respectful discussion is a mature approach to handling disagreements.",
          isCorrect: true
        },
        {
          id: "c",
          text: "By avoiding disagreements completely",
          emoji: "🙈",
          description: "That's not healthy. Avoiding disagreements can lead to unresolved issues and resentment.",
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
      title="Disagreement Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-41"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={41}
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

export default DisagreementStory;