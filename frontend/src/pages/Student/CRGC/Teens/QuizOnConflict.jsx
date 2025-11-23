import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnConflict = () => {
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
      text: "What is the best way to solve a conflict?",
      options: [
        { id: "a", text: "Talk and listen to understand each other" },
        { id: "b", text: "Fight or argue until you win" },
        { id: "c", text: "Ignore the problem and hope it goes away" }
      ],
      correctAnswer: "a",
      explanation: "Talking and listening helps both parties understand each other's perspectives and find solutions that work for everyone."
    },
    {
      id: 2,
      text: "What should you do when you realize you've hurt someone's feelings during a conflict?",
      options: [
        { id: "a", text: "Blame them for being too sensitive" },
        { id: "b", text: "Apologize sincerely and try to make amends" },
        { id: "c", text: "Deny that you did anything wrong" }
      ],
      correctAnswer: "b",
      explanation: "Taking responsibility for our actions and apologizing shows emotional maturity and helps repair relationships."
    },
    {
      id: 3,
      text: "Which approach is most likely to lead to a lasting resolution?",
      options: [
        { id: "a", text: "Winning the argument at all costs" },
        { id: "b", text: "Finding a compromise that works for both parties" },
        { id: "c", text: "Avoiding the conflict entirely" }
      ],
      correctAnswer: "b",
      explanation: "Compromise ensures that both parties feel heard and satisfied with the outcome, leading to stronger relationships."
    },
    {
      id: 4,
      text: "What is an important skill for resolving conflicts peacefully?",
      options: [
        { id: "a", text: "Interrupting others when they speak" },
        { id: "b", text: "Listening actively to understand different perspectives" },
        { id: "c", text: "Raising your voice to be heard" }
      ],
      correctAnswer: "b",
      explanation: "Active listening helps you understand the other person's point of view and shows respect for their feelings."
    },
    {
      id: 5,
      text: "What should you do if emotions are running high during a conflict?",
      options: [
        { id: "a", text: "Continue arguing to get your point across" },
        { id: "b", text: "Take a break to cool down before continuing" },
        { id: "c", text: "Walk away permanently without resolution" }
      ],
      correctAnswer: "b",
      explanation: "Taking a break allows everyone to calm down and approach the conflict with a clearer mind and more constructive attitude."
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
        title="Quiz on Conflict"
        subtitle="Quiz Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-42"
        gameType="civic-responsibility"
        totalLevels={50}
        currentLevel={42}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🧠</div>
          <h2 className="text-2xl font-bold mb-4">Great Job!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand conflict resolution!
          </div>
          <p className="text-white/80">
            Remember: Good communication and empathy are key to resolving conflicts peacefully!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Quiz on Conflict"
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

export default QuizOnConflict;