import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnCompassion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which of these best defines compassion?",
      options: [
        { id: "a", text: "Feeling sorry for others" },
        { id: "b", text: "Understanding and caring about others' suffering" },
        { id: "c", text: "Ignoring others' problems" }
      ],
      correctAnswer: "b",
      explanation: "Compassion involves both recognizing others' suffering and having a genuine desire to help alleviate it."
    },
    {
      id: 2,
      text: "Which action demonstrates compassion?",
      options: [
        { id: "a", text: "Laughing at someone who made a mistake" },
        { id: "b", text: "Visiting a friend who is sick in the hospital" },
        { id: "c", text: "Spreading rumors about someone's personal issues" }
      ],
      correctAnswer: "b",
      explanation: "Visiting a sick friend shows care and concern for their wellbeing, which is a key aspect of compassion."
    },
    {
      id: 3,
      text: "Why is compassion important in building relationships?",
      options: [
        { id: "a", text: "It creates distance between people" },
        { id: "b", text: "It helps people feel understood and supported" },
        { id: "c", text: "It makes you appear weak to others" }
      ],
      correctAnswer: "b",
      explanation: "Compassion helps create strong, supportive relationships by making others feel valued and cared for."
    },
    {
      id: 4,
      text: "Which of these is NOT a component of compassion?",
      options: [
        { id: "a", text: "Recognizing suffering" },
        { id: "b", text: "Feeling empathy" },
        { id: "c", text: "Indifference to others' pain" }
      ],
      correctAnswer: "c",
      explanation: "Indifference is the opposite of compassion. Compassion requires active engagement with others' experiences."
    },
    {
      id: 5,
      text: "How can practicing compassion benefit you personally?",
      options: [
        { id: "a", text: "It increases stress and anxiety" },
        { id: "b", text: "It improves emotional wellbeing and life satisfaction" },
        { id: "c", text: "It makes you more judgmental of others" }
      ],
      correctAnswer: "b",
      explanation: "Research shows that practicing compassion not only helps others but also enhances your own emotional health and happiness."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
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
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Compassion"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-2"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={2}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/teens"
    
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
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="space-y-3">
            {getCurrentQuestion().options.map(option => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === getCurrentQuestion().correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl text-left transition-all text-white ${
                    showCorrect
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : showIncorrect
                      ? 'bg-red-500/20 border-2 border-red-500'
                      : isSelected
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-lg mr-3 font-bold">
                      {option.id.toUpperCase()}.
                    </div>
                    <div>{option.text}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer
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

export default QuizOnCompassion;