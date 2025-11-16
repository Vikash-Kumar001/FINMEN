import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproductiveStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "In health class, the teacher begins explaining reproductive health. This is a normal part of growing up. What should the girls do?",
      options: [
        {
          id: "a",
          text: "Listen calmly and respectfully",
          emoji: "👂",
          description: "Correct! Reproductive health is an important topic that helps us understand our bodies as we grow.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Giggle and make jokes about it",
          emoji: "😂",
          description: "Not quite. Making jokes can make others uncomfortable. It's better to listen respectfully.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Put their hands over their ears",
          emoji: "🙉",
          description: "This isn't helpful. It's important to learn about our bodies and health as we grow.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-female/teens/quiz-reproductive-basics");
  };

  return (
    <GameShell
      title="Reproductive Story"
      subtitle={`Level 31 of 40`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-31"
      gameType="health-female"
      totalLevels={40}
      currentLevel={31}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 31/40</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map((option) => (
              <div
                key={option.id}
                onClick={() => !choices.find(c => c.question === currentQuestion) && handleChoice(option.id)}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  choices.find(c => c.question === currentQuestion)?.optionId === option.id
                    ? option.isCorrect
                      ? "border-green-400 bg-green-500/20"
                      : "border-red-400 bg-red-500/20"
                    : "border-white/30 hover:border-purple-400"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-white font-medium">{option.text}</span>
                </div>
                
                {choices.find(c => c.question === currentQuestion)?.optionId === option.id && (
                  <div className={`mt-3 p-2 rounded-lg text-sm ${
                    option.isCorrect ? "bg-green-500/30 text-green-200" : "bg-red-500/30 text-red-200"
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReproductiveStory;