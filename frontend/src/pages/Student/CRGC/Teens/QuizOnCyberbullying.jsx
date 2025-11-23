import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnCyberbullying = () => {
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
      text: "What is cyberbullying?",
      options: [
        { id: "a", text: "Online teasing, harassment, or abuse" },
        { id: "b", text: "Playing sports online" },
        { id: "c", text: "Studying for exams using technology" }
      ],
      correctAnswer: "a",
      explanation: "Cyberbullying involves using digital technologies to tease, harass, or abuse others. It can happen through social media, messaging apps, gaming platforms, and mobile phones."
    },
    {
      id: 2,
      text: "Which of these is an example of cyberbullying?",
      options: [
        { id: "a", text: "Sending a kind message to a friend" },
        { id: "b", text: "Sharing embarrassing photos of someone without their permission" },
        { id: "c", text: "Posting about your weekend activities" }
      ],
      correctAnswer: "b",
      explanation: "Sharing embarrassing photos without someone's permission is a form of cyberbullying that violates their privacy and can cause emotional harm."
    },
    {
      id: 3,
      text: "What should you do if you witness cyberbullying?",
      options: [
        { id: "a", text: "Join in to fit in with the crowd" },
        { id: "b", text: "Ignore it completely" },
        { id: "c", text: "Report it and support the victim" }
      ],
      correctAnswer: "c",
      explanation: "When you witness cyberbullying, it's important to report it to a trusted adult and offer support to the victim. This helps stop the bullying and provides comfort to those affected."
    },
    {
      id: 4,
      text: "Why is cyberbullying particularly harmful?",
      options: [
        { id: "a", text: "It can happen 24/7 and reach a wide audience" },
        { id: "b", text: "It only happens during school hours" },
        { id: "c", text: "It's easier to ignore than face-to-face bullying" }
      ],
      correctAnswer: "a",
      explanation: "Cyberbullying can happen at any time and reach a large audience quickly, making it especially harmful because victims may feel like they can't escape it."
    },
    {
      id: 5,
      text: "What is a healthy way to deal with cyberbullying?",
      options: [
        { id: "a", text: "Retaliate by bullying the bully back" },
        { id: "b", text: "Talk to a trusted adult and save evidence" },
        { id: "c", text: "Keep it a secret to avoid embarrassment" }
      ],
      correctAnswer: "b",
      explanation: "Talking to a trusted adult and saving evidence of cyberbullying are important steps in addressing it effectively. This helps ensure proper action is taken and provides support for the victim."
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
      title="Quiz on Cyberbullying"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-32"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={32}
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

export default QuizOnCyberbullying;