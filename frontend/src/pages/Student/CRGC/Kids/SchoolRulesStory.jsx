import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolRulesStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "During an important math test, you realize you know the answer to a question your classmate is struggling with. What should you do?",
      options: [
        {
          id: "a",
          text: "Quietly tell them the answer to help them",
          emoji: "🤫",
          description: "That's not honest. Cheating or helping others cheat violates school rules and isn't fair to other students.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus on your own test and let them figure it out",
          emoji: "📝",
          description: "That's right! Honesty and fairness are important school rules that apply to everyone.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Distract the teacher so your friend can look at your paper",
          emoji: "🎭",
          description: "That's dishonest and could get both of you in trouble. School rules exist to ensure fairness for all students.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You notice a classmate has brought a forbidden electronic device to school. What's the right thing to do?",
      options: [
        {
          id: "a",
          text: "Tell the teacher so the rules can be enforced",
          emoji: "👩‍🏫",
          description: "That's responsible! Following reporting procedures helps maintain school秩序.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it since it's not your business",
          emoji: "🙈",
          description: "While it might seem easier to ignore, school rules are in place for everyone's safety and fairness.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask to borrow the device during lunch break",
          emoji: "📱",
          description: "That would also violate school rules. Both you and your classmate could get in trouble.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend wants to skip lunch period to hang out in the hallway. What should you do?",
      options: [
        {
          id: "a",
          text: "Join them since lunch periods are boring",
          emoji: "🏃",
          description: "That's not following school rules. Attendance policies exist for your safety and education.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Remind your friend that skipping class is against school rules",
          emoji: "📚",
          description: "Great! Being a good friend sometimes means helping them make responsible choices.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Report them to the principal immediately",
          emoji: "👮",
          description: "While school rules should be followed, it's better to first kindly remind your friend about the rules.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You accidentally damage school property while playing. What should you do?",
      options: [
        {
          id: "a",
          text: "Hide the damage and hope no one notices",
          emoji: "🙈",
          description: "That's not honest. Taking responsibility for your actions is an important part of following school rules.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Immediately report it to a teacher or administrator",
          emoji: "🙋",
          description: "That's right! Taking responsibility shows maturity and respect for school property.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Blame it on someone else who wasn't there",
          emoji: "🤥",
          description: "That's dishonest and could get someone else in trouble unfairly.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The school has a rule about raising your hand before speaking. During a heated discussion, what should you do?",
      options: [
        {
          id: "a",
          text: "Interrupt excitedly because your point is important",
          emoji: "💬",
          description: "That's not following classroom rules. Everyone deserves a chance to speak respectfully.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Raise your hand and wait to be called on",
          emoji: "✋",
          description: "Perfect! Following classroom rules creates an environment where everyone can participate respectfully.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stay quiet and never share your opinion",
          emoji: "🤐",
          description: "While following rules is important, your opinions matter too. The right way is to follow the procedure for sharing them.",
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
      title="School Rules Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-75"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={75}
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

export default SchoolRulesStory;