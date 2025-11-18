import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MoodChangeStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You feel happy one moment and sad the next. Is this part of growing up?",
      options: [
        {
          id: "a",
          text: "Yes, mood changes are normal during development",
          emoji: "✅",
          description: "Exactly! Hormonal changes during development can cause mood swings. This is completely normal.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, you should always feel the same",
          emoji: "❌",
          description: "It's natural for moods to fluctuate, especially during development. Constant emotions aren't realistic or healthy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What might cause mood changes during development?",
      options: [
        {
          id: "a",
          text: "Hormonal changes and brain development",
          emoji: "🧬",
          description: "Correct! Hormonal fluctuations and brain development during puberty can affect emotions and mood regulation.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eating too much sugar",
          emoji: "🍬",
          description: "While diet can affect energy levels, mood changes during development are primarily due to biological factors.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you manage mood changes during development?",
      options: [
        {
          id: "a",
          text: "Talk to trusted adults and practice self-care",
          emoji: "💬",
          description: "Perfect! Communication and self-care strategies like exercise, sleep, and relaxation can help manage mood changes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore your feelings and pretend nothing is happening",
          emoji: "🤐",
          description: "Ignoring emotions can lead to increased stress. It's healthier to acknowledge and address your feelings.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "When should you talk to an adult about mood changes?",
      options: [
        {
          id: "a",
          text: "Only if you feel extremely sad or anxious for long periods",
          emoji: "😔",
          description: "While persistent extreme moods warrant attention, it's always okay to talk to trusted adults about any concerns.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Whenever you have questions or concerns about your feelings",
          emoji: "😊",
          description: "Great choice! It's always okay to talk to trusted adults about your feelings, whether they're mild or intense.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Your friend seems moody lately. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Avoid them because they're difficult to be around",
          emoji: "🚶‍♀️",
          description: "Everyone goes through mood changes. Being supportive rather than avoiding someone is usually more helpful.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Be patient and offer support if they want to talk",
          emoji: "🤗",
          description: "Good understanding! Being patient and offering support without judgment helps friends feel understood and cared for.",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Mood Change Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-28"
      gameType="health-female"
      totalLevels={30}
      currentLevel={28}
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

export default MoodChangeStory;