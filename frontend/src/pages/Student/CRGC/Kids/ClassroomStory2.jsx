import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClassroomStory2 = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "In Priya's class, the teacher only calls on boys to answer questions, even when girls raise their hands. What should happen?",
      options: [
        {
          id: "a",
          text: "Only boys should answer questions because they're better at studies",
          emoji: "👨",
          description: "That's not fair. Academic ability isn't determined by gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "The teacher should call on both boys and girls equally",
          emoji: "🙋‍♀️🙋‍♂️",
          description: "Great! Giving everyone equal opportunities to participate promotes fairness and inclusivity.",
          isCorrect: true
        },
        {
          id: "c",
          text: "The girls should stop raising their hands",
          emoji: "🤫",
          description: "That's not the solution. Everyone should feel encouraged to participate.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Some boys in the class are making fun of girls who answer questions incorrectly. How should this be addressed?",
      options: [
        {
          id: "a",
          text: "Let them continue since making mistakes is shameful",
          emoji: "😂",
          description: "That's not kind. Everyone deserves respect, especially when they're trying.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that everyone makes mistakes and it's part of learning",
          emoji: "🤗",
          description: "Perfect! Creating a supportive environment where everyone feels safe to participate is important.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell the girls not to answer questions anymore",
          emoji: "🙅",
          description: "That's not helpful. Everyone should be encouraged to participate.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "The teacher assigns class monitor duties only to boys. What would be fair?",
      options: [
        {
          id: "a",
          text: "Only boys should be class monitors because they're more responsible",
          emoji: "👨",
          description: "That's not fair. Leadership qualities aren't determined by gender.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Both boys and girls should take turns being class monitors",
          emoji: "👥",
          description: "Wonderful! Rotating responsibilities gives everyone a chance to develop leadership skills.",
          isCorrect: false
        },
        {
          id: "c",
          text: "No one should be a class monitor",
          emoji: "❌",
          description: "That's not practical. Class monitors help with classroom management.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "During group projects, boys always get to choose the topics while girls have to accept what's left. What should be done?",
      options: [
        {
          id: "a",
          text: "Let boys continue choosing since they're better at decision-making",
          emoji: "👨",
          description: "That's not fair. Decision-making abilities aren't determined by gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Take turns choosing topics so everyone gets a fair chance",
          emoji: "🤝",
          description: "Excellent! Taking turns ensures everyone has an equal voice in group decisions.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Let the teacher choose all topics for everyone",
          emoji: "👩‍🏫",
          description: "That's not promoting independence. Students should learn to make choices.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Some students think that science subjects are only for boys and arts subjects are for girls. How should this be addressed?",
      options: [
        {
          id: "a",
          text: "Accept that certain subjects are better suited for certain genders",
          emoji: "📚",
          description: "That's not promoting equality. Interests and abilities aren't determined by gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Encourage everyone to explore subjects based on their interests",
          emoji: "🔬🎨",
          description: "Great! Everyone should be free to pursue subjects they're interested in, regardless of gender stereotypes.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make everyone study the same subjects regardless of interest",
          emoji: "📖",
          description: "That's not considering individual interests. Personal interests should be respected.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Classroom Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-28"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={28}
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

export default ClassroomStory2;