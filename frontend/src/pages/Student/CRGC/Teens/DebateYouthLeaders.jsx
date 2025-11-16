import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateYouthLeaders = () => {
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
      text: "Can teens lead big change?",
      options: [
        { id: "a", text: "Yes, teens have unique perspectives and energy" },
        { id: "b", text: "No, teens lack experience and knowledge" },
        { id: "c", text: "Only with adult supervision" }
      ],
      correctAnswer: "a",
      explanation: "Teens can indeed lead significant change by bringing fresh perspectives, energy, and innovative solutions to complex problems."
    },
    {
      id: 2,
      text: "What advantage do young leaders bring to social movements?",
      options: [
        { id: "a", text: "Fresh ideas and digital fluency" },
        { id: "b", text: "Established networks and resources" },
        { id: "c", text: "Traditional approaches to problems" }
      ],
      correctAnswer: "a",
      explanation: "Young leaders often bring innovative ideas and are fluent in digital platforms that can amplify social movements."
    },
    {
      id: 3,
      text: "How can teens effectively influence policy decisions?",
      options: [
        { id: "a", text: "Through research, advocacy, and coalition building" },
        { id: "b", text: "By protesting without clear objectives" },
        { id: "c", text: "Only by waiting until they're adults" }
      ],
      correctAnswer: "a",
      explanation: "Teens can influence policy through well-researched advocacy, building coalitions, and engaging with decision-makers."
    },
    {
      id: 4,
      text: "What historical examples show youth leadership impact?",
      options: [
        { id: "a", text: "Malala Yousafzai, Greta Thunberg, March for Our Lives" },
        { id: "b", text: "Only adult political leaders have created change" },
        { id: "c", text: "Youth movements have never been successful" }
      ],
      correctAnswer: "a",
      explanation: "Many young leaders like Malala, Greta, and the Parkland students have successfully advocated for significant social and policy changes."
    },
    {
      id: 5,
      text: "What is essential for effective youth leadership?",
      options: [
        { id: "a", text: "Preparation, collaboration, and persistence" },
        { id: "b", text: "Working completely independently" },
        { id: "c", text: "Avoiding adult mentors and guidance" }
      ],
      correctAnswer: "a",
      explanation: "Effective youth leadership combines preparation, collaboration with others, and persistence in working toward goals."
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
        title="Debate: Youth Leaders?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-96"
        gameType="civic-responsibility"
        totalLevels={100}
        currentLevel={96}
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
            You understand youth leadership potential!
          </div>
          <p className="text-white/80">
            Remember: Teens can and do lead significant positive change in their communities and beyond!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: Youth Leaders?"
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

export default DebateYouthLeaders;