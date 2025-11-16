import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnGlobalCitizenship = () => {
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
      text: "What does global citizenship mean?",
      options: [
        { id: "a", text: "Caring for the whole world" },
        { id: "b", text: "Only caring about yourself" },
        { id: "c", text: "Ignoring other countries" }
      ],
      correctAnswer: "a",
      explanation: "Global citizenship means caring for the whole world and recognizing our interconnectedness with people everywhere."
    },
    {
      id: 2,
      text: "Which is a responsibility of a global citizen?",
      options: [
        { id: "a", text: "Respecting different cultures" },
        { id: "b", text: "Judging others based on stereotypes" },
        { id: "c", text: "Ignoring global issues" }
      ],
      correctAnswer: "a",
      explanation: "Respecting different cultures is a key responsibility of global citizens who value diversity and inclusion."
    },
    {
      id: 3,
      text: "How can global citizens contribute to solving world problems?",
      options: [
        { id: "a", text: "By taking action in their communities" },
        { id: "b", text: "By staying uninformed" },
        { id: "c", text: "By avoiding responsibility" }
      ],
      correctAnswer: "a",
      explanation: "Global citizens contribute by taking action in their communities, which collectively creates positive change worldwide."
    },
    {
      id: 4,
      text: "What is cultural awareness?",
      options: [
        { id: "a", text: "Understanding and appreciating different cultures" },
        { id: "b", text: "Thinking one's own culture is superior" },
        { id: "c", text: "Ignoring cultural differences" }
      ],
      correctAnswer: "a",
      explanation: "Cultural awareness involves understanding and appreciating different cultures, which promotes harmony and cooperation."
    },
    {
      id: 5,
      text: "Why is global citizenship important?",
      options: [
        { id: "a", text: "It helps create a more connected and compassionate world" },
        { id: "b", text: "It isolates people from each other" },
        { id: "c", text: "It encourages selfishness" }
      ],
      correctAnswer: "a",
      explanation: "Global citizenship helps create a more connected and compassionate world by fostering understanding and cooperation."
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
        title="Quiz on Global Citizenship"
        subtitle="Quiz Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-82"
        gameType="civic-responsibility"
        totalLevels={90}
        currentLevel={82}
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
            You understand global citizenship!
          </div>
          <p className="text-white/80">
            Remember: Global citizenship means caring for the whole world and recognizing our interconnectedness with people everywhere!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Quiz on Global Citizenship"
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

export default QuizOnGlobalCitizenship;