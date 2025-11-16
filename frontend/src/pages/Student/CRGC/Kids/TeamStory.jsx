import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeamStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your group is working on a school project, but two friends are arguing about who gets to be the leader. The project is falling behind. What should you do?",
      options: [
        {
          id: "a",
          text: "Suggest dividing tasks based on each person's strengths",
          emoji: "📋",
          description: "That's right! Dividing tasks based on strengths ensures everyone contributes effectively and reduces conflict.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Let them argue while you do all the work yourself",
          emoji: "😤",
          description: "That's not fair. Effective teamwork requires everyone to participate and resolve conflicts constructively.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Quit the group and start your own project",
          emoji: "🚶",
          description: "That's not collaborative. Working through challenges as a team builds important life skills.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During a group presentation, one team member is nervous and struggling with their part. How should the team respond?",
      options: [
        {
          id: "a",
          text: "Offer to help them practice and provide support",
          emoji: "🤝",
          description: "Perfect! Supporting team members creates a positive environment and helps everyone succeed.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take over their part completely without asking",
          emoji: "😤",
          description: "That's not respectful. Helping should be offered, not forced, to maintain team harmony.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make fun of them for being nervous",
          emoji: "😂",
          description: "That's not kind. Making fun of someone's struggles damages team trust and morale.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your team has different ideas about how to approach a community service project. Some want to plant trees while others prefer organizing a food drive. How should you decide?",
      options: [
        {
          id: "a",
          text: "Discuss the pros and cons of each idea and vote",
          emoji: "🗳️",
          description: "Great! Democratic decision-making ensures everyone's voice is heard and increases team buy-in.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Let the loudest person decide",
          emoji: "📢",
          description: "That's not fair. Leadership isn't about being the loudest; it's about inclusive decision-making.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Split into two separate groups and do both projects",
          emoji: "💔",
          description: "That's not collaborative. Working together despite differences builds stronger problem-solving skills.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "One team member consistently misses meetings and doesn't complete their assigned tasks. How should the team address this?",
      options: [
        {
          id: "a",
          text: "Talk to them privately to understand any challenges and offer help",
          emoji: "💬",
          description: "That's right! Addressing issues with understanding and support helps resolve problems constructively.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complain about them to the teacher behind their back",
          emoji: "😠",
          description: "That's not respectful. Direct communication is more effective and maintains team integrity.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Do their work for them without saying anything",
          emoji: "😒",
          description: "That's not sustainable. It doesn't solve the underlying issue and creates an unfair workload.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your team successfully completes a challenging project that benefits the school community. How should you celebrate?",
      options: [
        {
          id: "a",
          text: "Acknowledge everyone's contributions and celebrate together",
          emoji: "🎉",
          description: "Perfect! Recognizing individual contributions while celebrating as a team builds morale and strengthens relationships.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Let only the 'best' contributors get recognition",
          emoji: "😒",
          description: "That's not inclusive. Every team member contributes in their own way and deserves recognition.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Move on immediately without acknowledging the achievement",
          emoji: "🏃",
          description: "That's not appreciative. Celebrating successes motivates continued effort and builds team pride.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Team Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-98"
      gameType="civic-responsibility"
      totalLevels={100}
      currentLevel={98}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
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

export default TeamStory;