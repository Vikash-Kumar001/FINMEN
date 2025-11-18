import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FeelingsStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You feel sad when your doll breaks. Is this normal?",
      options: [
        {
          id: "a",
          text: "Yes, feeling sad about broken things is normal",
          emoji: "😊",
          description: "Exactly! It's normal to feel sad when something we care about gets broken. All feelings are valid.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, you should never feel sad about things",
          emoji: "😐",
          description: "That's not right. Feeling sad about broken things is a natural human emotion. It's okay to feel sad sometimes.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend gets a new toy and you feel jealous. What should you do?",
      options: [
        {
          id: "a",
          text: "Feel the jealousy but be happy for your friend",
          emoji: "😌",
          description: "Great choice! It's normal to feel jealous sometimes, but being happy for friends shows emotional maturity.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take your friend's toy to feel better",
          emoji: "😠",
          description: "That's not a good solution. Taking someone else's things won't help your feelings and might hurt your friendship.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel angry when someone cuts in line. Is this okay?",
      options: [
        {
          id: "a",
          text: "Yes, feeling angry is normal but you should express it calmly",
          emoji: "🧘",
          description: "Perfect! Feeling angry is normal, but it's important to express it in healthy ways like talking calmly.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, you should never feel angry",
          emoji: "🤐",
          description: "That's not realistic. Everyone feels angry sometimes. The key is learning how to manage those feelings properly.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You're excited about a school trip. Is it good to share this feeling?",
      options: [
        {
          id: "a",
          text: "Yes, sharing positive feelings helps spread joy",
          emoji: "😄",
          description: "Wonderful! Sharing positive feelings can make others happy too and strengthen your relationships.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, keep your feelings to yourself",
          emoji: "🤫",
          description: "Actually, sharing positive feelings can bring people closer together and create a more joyful environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You feel nervous before a test. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Acknowledge the nervousness and prepare well",
          emoji: "📚",
          description: "Excellent! Recognizing your feelings and taking positive action is the best way to handle nervousness.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the feeling and hope for the best",
          emoji: "🤞",
          description: "Ignoring feelings doesn't make them go away. It's better to acknowledge them and take constructive steps.",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Feelings Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-51"
      gameType="health-female"
      totalLevels={60}
      currentLevel={51}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
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

export default FeelingsStory;