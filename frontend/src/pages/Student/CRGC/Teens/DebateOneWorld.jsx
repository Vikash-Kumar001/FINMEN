import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateOneWorld = () => {
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
      text: "Is the world one family?",
      options: [
        { id: "a", text: "Yes, we're all interconnected" },
        { id: "b", text: "No, we're separate nations" },
        { id: "c", text: "Only economically" }
      ],
      correctAnswer: "a",
      explanation: "While we have distinct nations and cultures, we're all interconnected through shared humanity and global challenges."
    },
    {
      id: 2,
      text: "Should we prioritize global cooperation over national interests?",
      options: [
        { id: "a", text: "Yes, many challenges require global solutions" },
        { id: "b", text: "No, national interests always come first" },
        { id: "c", text: "Only when it's convenient" }
      ],
      correctAnswer: "a",
      explanation: "Many challenges like climate change, pandemics, and poverty require global cooperation for effective solutions."
    },
    {
      id: 3,
      text: "What is the benefit of seeing the world as one family?",
      options: [
        { id: "a", text: "Promotes empathy and collective problem-solving" },
        { id: "b", text: "Eliminates all cultural differences" },
        { id: "c", text: "Makes everyone the same" }
      ],
      correctAnswer: "a",
      explanation: "Seeing the world as one family promotes empathy and collective problem-solving while respecting diversity."
    },
    {
      id: 4,
      text: "How does global interconnectedness affect local communities?",
      options: [
        { id: "a", text: "Local actions can have global impact" },
        { id: "b", text: "Global issues don't affect locals" },
        { id: "c", text: "Local communities are isolated" }
      ],
      correctAnswer: "a",
      explanation: "Local actions can have global impact, and global events affect local communities, showing our interconnectedness."
    },
    {
      id: 5,
      text: "What role should global citizenship play in education?",
      options: [
        { id: "a", text: "Teach students to be responsible global citizens" },
        { id: "b", text: "Focus only on national history" },
        { id: "c", text: "Ignore global perspectives" }
      ],
      correctAnswer: "a",
      explanation: "Education should prepare students to be responsible global citizens who understand their role in the interconnected world."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption) return; // Prevent changing answer after selection
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionId === currentQ.correctAnswer;
    
    setSelectedOption(optionId);
    
    if (isCorrect) {
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(2, true);
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
        title="Debate: One World?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-86"
        gameType="civic-responsibility"
        totalLevels={90}
        currentLevel={86}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Excellent Debate!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length * 2} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand global interconnectedness!
          </div>
          <p className="text-white/80">
            Remember: While we have distinct cultures and nations, we're all part of one interconnected human family!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: One World?"
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

export default DebateOneWorld;