import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateGirlsLeaders = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should girls lead nations?",
      options: [
        { id: "a", text: "Yes, leadership has no gender" },
        { id: "b", text: "No, men are natural leaders" },
        { id: "c", text: "Only in certain areas" }
      ],
      correctAnswer: "a",
      explanation: "Leadership is a skill that can be developed by anyone regardless of gender. Many successful female leaders have demonstrated exceptional leadership abilities."
    },
    {
      id: 2,
      text: "What qualities make a good leader?",
      options: [
        { id: "a", text: "Communication skills, empathy, and decision-making abilities" },
        { id: "b", text: "Being male and authoritative" },
        { id: "c", text: "Following traditional gender roles" }
      ],
      correctAnswer: "a",
      explanation: "Good leaders possess qualities like communication skills, empathy, decision-making abilities, and integrity - traits that are not determined by gender."
    },
    {
      id: 3,
      text: "How does gender diversity in leadership benefit organizations?",
      options: [
        { id: "a", text: "It brings diverse perspectives and improves decision-making" },
        { id: "b", text: "It creates confusion and conflict" },
        { id: "c", text: "It doesn't make a difference" }
      ],
      correctAnswer: "a",
      explanation: "Gender diversity in leadership brings different perspectives, experiences, and problem-solving approaches, which leads to better decision-making and innovation."
    },
    {
      id: 4,
      text: "Why is it important to encourage girls to pursue leadership roles?",
      options: [
        { id: "a", text: "To ensure equal representation and opportunities for all" },
        { id: "b", text: "To replace male leaders" },
        { id: "c", text: "To fulfill a quota requirement" }
      ],
      correctAnswer: "a",
      explanation: "Encouraging girls to pursue leadership roles ensures equal representation and opportunities, creating a more inclusive and equitable society."
    },
    {
      id: 5,
      text: "What is a barrier to girls becoming leaders?",
      options: [
        { id: "a", text: "Gender stereotypes and lack of role models" },
        { id: "b", text: "Girls lack leadership abilities" },
        { id: "c", text: "Leadership is not important for girls" }
      ],
      correctAnswer: "a",
      explanation: "Gender stereotypes and lack of female role models can discourage girls from pursuing leadership roles, but these are societal barriers rather than inherent limitations."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 2); // 2 coins for debate questions
      showCorrectAnswerFeedback(2, true);
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
      title="Debate: Girls as Leaders?"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-26"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={26}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate Question {currentQuestion + 1}/{questions.length}</span>
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

export default DebateGirlsLeaders;