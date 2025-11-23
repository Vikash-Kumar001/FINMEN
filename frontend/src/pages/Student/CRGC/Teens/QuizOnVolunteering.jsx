import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnVolunteering = () => {
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
      text: "Which is volunteering?",
      options: [
        { id: "a", text: "Helping at beach clean-up" },
        { id: "b", text: "Watching TV" },
        { id: "c", text: "Playing video games" }
      ],
      correctAnswer: "a",
      explanation: "Volunteering involves giving your time and effort to help others or contribute to a cause without expecting payment."
    },
    {
      id: 2,
      text: "What is a key benefit of volunteering?",
      options: [
        { id: "a", text: "Getting paid more money" },
        { id: "b", text: "Building empathy and community connections" },
        { id: "c", text: "Avoiding schoolwork" }
      ],
      correctAnswer: "b",
      explanation: "Volunteering helps build empathy by allowing you to understand others' experiences and creates meaningful connections within your community."
    },
    {
      id: 3,
      text: "Which is NOT typically considered volunteering?",
      options: [
        { id: "a", text: "Tutoring younger students" },
        { id: "b", text: "Helping at a food bank" },
        { id: "c", text: "Getting paid for a job" }
      ],
      correctAnswer: "c",
      explanation: "Volunteering is done without monetary compensation. When you're paid for work, it's considered employment rather than volunteering."
    },
    {
      id: 4,
      text: "Why is volunteering important for teens?",
      options: [
        { id: "a", text: "It helps develop life skills and responsibility" },
        { id: "b", text: "It replaces school education" },
        { id: "c", text: "It guarantees college admission" }
      ],
      correctAnswer: "a",
      explanation: "Volunteering helps teens develop important life skills like leadership, communication, and problem-solving while building a sense of responsibility."
    },
    {
      id: 5,
      text: "What should you consider when choosing a volunteer opportunity?",
      options: [
        { id: "a", text: "Only how it looks on college applications" },
        { id: "b", text: "Your interests, skills, and community needs" },
        { id: "c", text: "How easy it is to complete" }
      ],
      correctAnswer: "b",
      explanation: "Choosing volunteer opportunities that align with your interests and skills while addressing community needs leads to more meaningful and fulfilling experiences."
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
        title="Quiz on Volunteering"
        subtitle="Quiz Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-52"
        gameType="civic-responsibility"
        totalLevels={60}
        currentLevel={52}
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
            You understand volunteering!
          </div>
          <p className="text-white/80">
            Remember: Volunteering helps build stronger communities and develops important life skills!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Quiz on Volunteering"
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

export default QuizOnVolunteering;