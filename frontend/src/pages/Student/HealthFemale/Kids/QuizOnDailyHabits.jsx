import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnDailyHabits = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-92";

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which is a good habit?",
      options: [
        { id: "a", text: "Sleeping on time", isCorrect: true },
        { id: "b", text: "Skipping breakfast", isCorrect: false },
        { id: "c", text: "Staying up all night", isCorrect: false },
        { id: "d", text: "Never drinking water", isCorrect: false }
      ],
      explanation: "Sleeping on time helps your body rest and recover."
    },
    {
      id: 2,
      text: "Why drink water in the morning?",
      options: [
        { id: "a", text: "It makes you tired", isCorrect: false },
        { id: "b", text: "It hydrates your body", isCorrect: true },
        { id: "c", text: "It's not needed", isCorrect: false },
        { id: "d", text: "It tastes like juice", isCorrect: false }
      ],
      explanation: "Your body needs water after sleeping all night."
    },
    {
      id: 3,
      text: "When should you brush teeth?",
      options: [
        { id: "a", text: "Once a week", isCorrect: false },
        { id: "b", text: "Only if dirty", isCorrect: false },
        { id: "c", text: "Never", isCorrect: false },
        { id: "d", text: "Twice a day", isCorrect: true }
      ],
      explanation: "Brushing twice a day keeps teeth strong and clean."
    },
    {
      id: 4,
      text: "Why wash hands?",
      options: [
        { id: "a", text: "To waste water", isCorrect: false },
        { id: "b", text: "To stop germs", isCorrect: true },
        { id: "c", text: "To make them cold", isCorrect: false },
        { id: "d", text: "It is not important", isCorrect: false }
      ],
      explanation: "Washing hands stops germs from making you sick."
    },
    {
      id: 5,
      text: "What does exercise do?",
      options: [
        { id: "a", text: "Makes you weak", isCorrect: false },
        { id: "b", text: "Makes you strong", isCorrect: true },
        { id: "c", text: "Makes you sad", isCorrect: false },
        { id: "d", text: "Nothing", isCorrect: false }
      ],
      explanation: "Exercise makes your muscles and heart strong."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;

    setSelectedOption(optionId);
    const question = questions[currentQuestion];
    const selected = question.options.find(opt => opt.id === optionId);
    const isCorrect = selected.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameFinished(true);
        showAnswerConfetti();
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Daily Habits"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={92}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.isCorrect;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-105 shadow-md ${showCorrect
                      ? 'bg-green-500/20 border-2 border-green-500 text-white'
                      : showIncorrect
                        ? 'bg-red-500/20 border-2 border-red-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                    }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 font-bold text-sm">
                      {option.id.toUpperCase()}
                    </div>
                    <div className="font-semibold">{option.text}</div>
                    {showCorrect && <div className="ml-auto">✅</div>}
                    {showIncorrect && <div className="ml-auto">❌</div>}
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl text-center animate-fadeIn ${questions[currentQuestion].options.find(o => o.id === selectedOption)?.isCorrect
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
              }`}>
              <p className={`font-bold text-lg ${questions[currentQuestion].options.find(o => o.id === selectedOption)?.isCorrect
                  ? 'text-green-300'
                  : 'text-red-300'
                }`}>
                {questions[currentQuestion].options.find(o => o.id === selectedOption)?.isCorrect
                  ? 'Correct! 🎉'
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnDailyHabits;