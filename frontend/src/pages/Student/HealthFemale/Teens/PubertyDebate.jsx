import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is puberty an embarrassing or natural process?",
      options: [
        {
          id: "a",
          text: "Natural process that everyone goes through",
          emoji: "🌱",
          description: "Puberty is a normal part of human development",
          isCorrect: true
        },
        {
          id: "b",
          text: "Embarrassing and should be hidden",
          emoji: "😳",
          description: "There's no need to feel embarrassed about normal development",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only happens to some people",
          emoji: "❓",
          description: "Puberty happens to everyone as part of growing up",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you handle body changes during puberty?",
      options: [
        {
          id: "a",
          text: "Accept changes as normal growth",
          emoji: "✅",
          description: "Acceptance leads to better mental health and confidence",
          isCorrect: true
        },
        {
          id: "b",
          text: "Feel ashamed and hide changes",
          emoji: "🙈",
          description: "Shame can lead to poor self-esteem and anxiety",
          isCorrect: false
        },
        {
          id: "c",
          text: "Compare yourself constantly to others",
          emoji: "👥",
          description: "Everyone develops at their own pace",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's the best way to deal with peer comments about puberty?",
      options: [
        {
          id: "a",
          text: "Educate peers about normal development",
          emoji: "📚",
          description: "Education helps reduce stigma and misinformation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Get angry and fight with peers",
          emoji: "😠",
          description: "Anger often escalates situations unnecessarily",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore all comments completely",
          emoji: "🔇",
          description: "Some comments may need gentle correction",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Should you talk to adults about puberty changes?",
      options: [
        {
          id: "a",
          text: "Yes, trusted adults can provide guidance",
          emoji: "👨‍👩‍👧‍👦",
          description: "Adults can offer valuable information and support",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's too embarrassing to discuss",
          emoji: "🤐",
          description: "Talking to trusted adults is important for healthy development",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only talk to friends about it",
          emoji: "👭",
          description: "Friends may not have accurate information",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the long-term benefit of positive puberty attitudes?",
      options: [
        {
          id: "a",
          text: "Better self-esteem and confidence",
          emoji: "💪",
          description: "Positive attitudes build lifelong confidence",
          isCorrect: true
        },
        {
          id: "b",
          text: "No long-term benefits",
          emoji: "😐",
          description: "Puberty attitudes significantly impact mental health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only affects teenage years",
          emoji: "📅",
          description: "Puberty attitudes influence long-term self-perception",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/health-female/teens/teen-growth-journal");
  };

  return (
    <GameShell
      title="Debate: Puberty = Awkward?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="health-female-teen-26"
      gameType="health-female"
      totalLevels={30}
      currentLevel={26}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Puberty Attitude Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default PubertyDebate;