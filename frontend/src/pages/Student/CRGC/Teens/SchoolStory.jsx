import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A new girl is bullied for accent. Should you include or exclude?",
      options: [
        {
          id: "a",
          text: "Exclude her to fit in with the crowd",
          emoji: "🚫",
          description: "That's not right. Excluding someone for their accent is a form of bullying and creates a hostile environment.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Include her and help her feel welcomed",
          emoji: "🗣️",
          description: "That's right! Including someone who's being bullied shows kindness and helps create a welcoming environment.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "You notice a classmate being left out during group activities because of their background. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore the situation to avoid conflict",
          emoji: "😶",
          description: "That's not helpful. Ignoring exclusion allows it to continue and makes the victim feel even more isolated.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Invite the classmate to join your group",
          emoji: "🤝",
          description: "Perfect! Including others who are being left out shows leadership and creates a more inclusive environment.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Some students are making fun of another student's lunch because it's different from theirs. How should you respond?",
      options: [
        {
          id: "a",
          text: "Join in the teasing to avoid being targeted yourself",
          emoji: "😆",
          description: "That's not kind. Joining in bullying makes you part of the problem and can hurt others deeply.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stand up for the student and celebrate diversity",
          emoji: "🌍",
          description: "Great choice! Standing up against bullying and celebrating diversity helps create a respectful environment.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "A student with a different cultural background seems lonely and isolated. What's the right approach?",
      options: [
        {
          id: "a",
          text: "Keep to yourself to avoid any awkwardness",
          emoji: "🚶",
          description: "That's not inclusive. Avoiding someone who seems lonely can make them feel even more isolated.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Reach out and learn about their culture",
          emoji: "🤗",
          description: "Wonderful! Reaching out to someone who seems lonely shows empathy and helps build bridges between cultures.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Students are excluding a peer because they speak a different language. How should you respond?",
      options: [
        {
          id: "a",
          text: "Go along with the exclusion to maintain your social status",
          emoji: "👑",
          description: "That's not right. Maintaining social status by excluding others is harmful and creates division.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Include the peer and help with language barriers",
          emoji: "📚",
          description: "Excellent! Including peers and helping with language barriers shows compassion and builds community.",
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
      title="School Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-35"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={35}
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

export default SchoolStory;