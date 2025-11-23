import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateApology = () => {
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
      text: "Is saying sorry a weakness or strength?",
      options: [
        { id: "a", text: "Weakness - It shows you were wrong" },
        { id: "b", text: "Strength - It shows emotional maturity and accountability" },
        { id: "c", text: "Neither - It's just a social convention" }
      ],
      correctAnswer: "b",
      explanation: "Saying sorry requires courage and emotional maturity. It shows you can take responsibility for your actions and prioritize relationships over ego."
    },
    {
      id: 2,
      text: "What is the primary benefit of a sincere apology?",
      options: [
        { id: "a", text: "Avoiding consequences for your actions" },
        { id: "b", text: "Repairing relationships and promoting healing" },
        { id: "c", text: "Making others feel guilty for their part in the conflict" }
      ],
      correctAnswer: "b",
      explanation: "A sincere apology focuses on repairing relationships and promoting healing for all parties involved. It's about taking responsibility and making amends."
    },
    {
      id: 3,
      text: "When is the best time to apologize?",
      options: [
        { id: "a", text: "Only when you're completely wrong" },
        { id: "b", text: "As soon as you recognize your contribution to a conflict" },
        { id: "c", text: "Never - Apologies show weakness" }
      ],
      correctAnswer: "b",
      explanation: "Apologizing as soon as you recognize your role in a conflict shows emotional intelligence and helps prevent escalation. It doesn't require admitting complete fault."
    },
    {
      id: 4,
      text: "What should a good apology include?",
      options: [
        { id: "a", text: "Just saying 'I'm sorry' without explanation" },
        { id: "b", text: "Acknowledgment of impact, responsibility, and commitment to change" },
        { id: "c", text: "An explanation of why you did it to justify your actions" }
      ],
      correctAnswer: "b",
      explanation: "Effective apologies acknowledge the impact of our actions, take responsibility, and show commitment to change. This approach promotes healing and trust."
    },
    {
      id: 5,
      text: "How does apologizing affect personal growth?",
      options: [
        { id: "a", text: "It prevents learning from mistakes" },
        { id: "b", text: "It promotes self-awareness and emotional development" },
        { id: "c", text: "It makes you more likely to repeat mistakes" }
      ],
      correctAnswer: "b",
      explanation: "Apologizing requires self-reflection and acknowledgment of our impact on others. This process promotes self-awareness and emotional development, leading to personal growth."
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
      title="Debate: Apology = Weakness?"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-46"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={46}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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

export default DebateApology;