import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnCultures = () => {
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
      text: "Which festival is known as the 'Festival of Lights' in India?",
      options: [
        { id: "a", text: "Holi" },
        { id: "b", text: "Diwali" },
        { id: "c", text: "Eid" }
      ],
      correctAnswer: "b",
      explanation: "Diwali is known as the Festival of Lights in India, celebrated by lighting oil lamps and creating colorful rangoli decorations."
    },
    {
      id: 2,
      text: "In which country would you most likely find people wearing a kimono?",
      options: [
        { id: "a", text: "China" },
        { id: "b", text: "Japan" },
        { id: "c", text: "Thailand" }
      ],
      correctAnswer: "b",
      explanation: "The kimono is a traditional Japanese garment, often worn during special occasions and cultural ceremonies."
    },
    {
      id: 3,
      text: "What is the traditional Mexican celebration called that honors deceased loved ones?",
      options: [
        { id: "a", text: "Cinco de Mayo" },
        { id: "b", text: "Day of the Dead (Día de los Muertos)" },
        { id: "c", text: "Las Posadas" }
      ],
      correctAnswer: "b",
      explanation: "Día de los Muertos (Day of the Dead) is a Mexican tradition where families honor and remember deceased loved ones with altars, food, and celebrations."
    },
    {
      id: 4,
      text: "Which of these is a traditional greeting in Japan?",
      options: [
        { id: "a", text: "Handshake" },
        { id: "b", text: "Bow" },
        { id: "c", text: "Hug" }
      ],
      correctAnswer: "b",
      explanation: "Bowing is a traditional form of greeting and showing respect in Japanese culture, with different types of bows for different situations."
    },
    {
      id: 5,
      text: "What is the name of the Scottish garment that is a type of skirt worn by men?",
      options: [
        { id: "a", text: "Kilt" },
        { id: "b", text: "Sari" },
        { id: "c", text: "Toga" }
      ],
      correctAnswer: "a",
      explanation: "A kilt is a traditional Scottish garment that looks like a skirt but is worn by men, especially during formal occasions and cultural events."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (showFeedback) return;
    
    setSelectedOption(optionId);
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionId === currentQ.correctAnswer;
    
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  if (gameFinished) {
    return (
      <GameShell
        title="Quiz on Cultures"
        subtitle="Game Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-kids-82"
        gameType="civic-responsibility"
        totalLevels={90}
        currentLevel={82}
        showConfetti={true}
        backPath="/games/civic-responsibility/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Great Job!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're becoming a culture expert!
          </div>
          <p className="text-white/80">
            Remember: Learning about different cultures helps us understand and respect each other better!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Quiz on Cultures"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      backPath="/games/civic-responsibility/kids"
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
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-left transition-all text-white ${
                  selectedOption === option.id
                    ? showFeedback
                      ? option.id === getCurrentQuestion().correctAnswer
                        ? "bg-green-500/30 border-2 border-green-500"
                        : "bg-red-500/30 border-2 border-red-500"
                      : "bg-blue-500/30 border-2 border-blue-500"
                    : "bg-white/10 hover:bg-white/20 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="font-bold">{option.id.toUpperCase()}</span>
                  </div>
                  <span className="text-lg">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`p-4 rounded-xl mt-6 ${
              selectedOption === getCurrentQuestion().correctAnswer 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`text-lg font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer 
                  ? 'text-green-300' 
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer 
                  ? 'Correct! 🎉' 
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">{getCurrentQuestion().explanation}</p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnCultures;