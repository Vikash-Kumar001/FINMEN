import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnLeadership = () => {
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
      text: "What is a key characteristic of a good leader?",
      options: [
        { id: "a", text: "Fairness" },
        { id: "b", text: "Bossiness" },
        { id: "c", text: "Selfishness" }
      ],
      correctAnswer: "a",
      explanation: "Fairness is essential for good leadership as it ensures all team members are treated equally and with respect."
    },
    {
      id: 2,
      text: "How should a leader handle team disagreements?",
      options: [
        { id: "a", text: "Listen to all perspectives and find common ground" },
        { id: "b", text: "Impose their own opinion" },
        { id: "c", text: "Ignore the conflict" }
      ],
      correctAnswer: "a",
      explanation: "Good leaders facilitate discussion and help teams find solutions that everyone can support."
    },
    {
      id: 3,
      text: "What should a leader prioritize?",
      options: [
        { id: "a", text: "Team goals and success" },
        { id: "b", text: "Personal recognition" },
        { id: "c", text: "Avoiding responsibility" }
      ],
      correctAnswer: "a",
      explanation: "Effective leaders prioritize team success over personal recognition and take responsibility for outcomes."
    },
    {
      id: 4,
      text: "How does a good leader motivate their team?",
      options: [
        { id: "a", text: "Through encouragement and recognition" },
        { id: "b", text: "Through fear and pressure" },
        { id: "c", text: "By taking all the credit" }
      ],
      correctAnswer: "a",
      explanation: "Good leaders motivate through positive reinforcement, encouragement, and recognizing team members' contributions."
    },
    {
      id: 5,
      text: "What is an important leadership skill?",
      options: [
        { id: "a", text: "Communication" },
        { id: "b", text: "Micromanagement" },
        { id: "c", text: "Delegation without guidance" }
      ],
      correctAnswer: "a",
      explanation: "Clear communication is vital for leaders to convey expectations, provide feedback, and ensure team alignment."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption) return; // Prevent changing answer after selection
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionId === currentQ.correctAnswer;
    
    setSelectedOption(optionId);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  if (gameFinished) {
    return (
      <GameShell
        title="Quiz on Leadership"
        subtitle="Quiz Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-92"
        gameType="civic-responsibility"
        totalLevels={100}
        currentLevel={92}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-2xl font-bold mb-4">Great Job!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand leadership principles!
          </div>
          <p className="text-white/80">
            Remember: Good leaders are fair, communicate effectively, and prioritize their team's success!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Quiz on Leadership"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="space-y-4">
            {getCurrentQuestion().options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={selectedOption}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedOption
                    ? option.id === getCurrentQuestion().correctAnswer
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : selectedOption === option.id
                      ? 'bg-red-500/20 border-2 border-red-500'
                      : 'bg-white/10 border border-white/20'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="font-bold text-white">{option.id.toUpperCase()}</span>
                  </div>
                  <span className="text-white">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500'
                : 'bg-red-500/20 border border-red-500'
            }`}>
              <p className={selectedOption === getCurrentQuestion().correctAnswer ? 'text-green-300' : 'text-red-300'}>
                {selectedOption === getCurrentQuestion().correctAnswer
                  ? 'Correct! '
                  : 'Incorrect. '}
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnLeadership;