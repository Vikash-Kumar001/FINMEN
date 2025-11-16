import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateKindness = () => {
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
      text: "Is being kind a weakness or strength?",
      options: [
        { id: "a", text: "Weakness - Kind people get taken advantage of" },
        { id: "b", text: "Strength - Kindness requires courage and empathy" },
        { id: "c", text: "Neither - Kindness is just a personality trait" }
      ],
      correctAnswer: "b",
      explanation: "Kindness is actually a strength because it requires emotional intelligence, courage to care for others, and the ability to empathize."
    },
    {
      id: 2,
      text: "Which statement best supports the idea that kindness is a strength?",
      options: [
        { id: "a", text: "Kind people are often manipulated by others" },
        { id: "b", text: "Kindness builds strong relationships and communities" },
        { id: "c", text: "Being kind is just about following social rules" }
      ],
      correctAnswer: "b",
      explanation: "Kindness creates positive relationships and supportive communities, which are essential for individual and collective wellbeing."
    },
    {
      id: 3,
      text: "How does kindness demonstrate courage?",
      options: [
        { id: "a", text: "It doesn't - kindness is passive and requires no effort" },
        { id: "b", text: "It takes courage to be kind when others are unkind" },
        { id: "c", text: "Kindness is only easy when everyone is nice to you" }
      ],
      correctAnswer: "b",
      explanation: "Being kind when others are unkind or when it's difficult requires significant inner strength and moral courage."
    },
    {
      id: 4,
      text: "What is the impact of kindness on leadership?",
      options: [
        { id: "a", text: "Kind leaders are seen as weak and ineffective" },
        { id: "b", text: "Kind leaders inspire loyalty and create positive environments" },
        { id: "c", text: "Kindness has no impact on leadership effectiveness" }
      ],
      correctAnswer: "b",
      explanation: "Research shows that kind leaders are often the most effective because they create trust, motivation, and positive workplace cultures."
    },
    {
      id: 5,
      text: "Which of these examples best demonstrates kindness as strength?",
      options: [
        { id: "a", text: "Helping a classmate only when it benefits you" },
        { id: "b", text: "Standing up for someone being bullied even when it's risky" },
        { id: "c", text: "Being nice to people only when you're in a good mood" }
      ],
      correctAnswer: "b",
      explanation: "Standing up for someone being bullied requires moral courage and strength, especially when there might be personal consequences."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 2); // 2 coins per correct answer for debate game
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
      title="Debate: Kindness = Weakness?"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-6"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={6}
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

export default DebateKindness;