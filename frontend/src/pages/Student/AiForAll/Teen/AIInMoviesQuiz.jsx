import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIInMoviesQuiz = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    { 
      id: 1, 
      text: "Does Netflix use AI to suggest films?", 
      emoji: "🎬", 
      choices: [
        { id: 1, text: "Yes", isCorrect: true },
        { id: 2, text: "No", isCorrect: false }
      ]
    },
    { 
      id: 2, 
      text: "AI is used to enhance movie special effects?", 
      emoji: "💥", 
      choices: [
        { id: 1, text: "Yes", isCorrect: true },
        { id: 2, text: "No", isCorrect: false }
      ]
    },
    { 
      id: 3, 
      text: "AI can fully replace movie directors?", 
      emoji: "🎥", 
      choices: [
        { id: 1, text: "Yes", isCorrect: false },
        { id: 2, text: "No", isCorrect: true }
      ]
    },
    { 
      id: 4, 
      text: "AI helps in editing and color grading films?", 
      emoji: "🎨", 
      choices: [
        { id: 1, text: "Yes", isCorrect: true },
        { id: 2, text: "No", isCorrect: false }
      ]
    },
    { 
      id: 5, 
      text: "AI writes movie scripts entirely on its own?", 
      emoji: "📝", 
      choices: [
        { id: 1, text: "Yes", isCorrect: false },
        { id: 2, text: "No", isCorrect: true }
      ]
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 5); // Reward +5 as per your instructions
      showCorrectAnswerFeedback(5, false);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // Navigate to next game or story
      navigate("/student/ai-for-all/teen/smart-farming-reflex"); // replace with actual path
    }
  };

  const selectedChoiceData = selectedChoice
    ? questions[currentQuestion].choices.find(c => c.id === selectedChoice)
    : null;

  const question = questions[currentQuestion];

  return (
    <GameShell
      title="AI in Movies Quiz 🎬"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-36"
      gameType="ai"
      totalLevels={20}
      currentLevel={18}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {question.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{choice.text === "Yes" ? "✅" : "❌"}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🎉" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Not Quite..."}
            </h2>
            
            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">
                {selectedChoiceData?.isCorrect
                  ? "AI helps streaming platforms recommend movies, assist in editing, and create better entertainment experiences! 🎬🤖"
                  : "Remember, AI supports movie-making and recommendations but doesn’t replace creativity entirely!"}
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              {selectedChoiceData?.isCorrect ? "You earned 5 Coins! 🪙" : ""}
            </p>

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIInMoviesQuiz;
