import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AiDoctorQuizz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    { 
      id: 1, 
      text: "AI can detect diseases from X-rays?", 
      emoji: "🩻", 
      choices: [
        { id: 1, text: "Yes", isCorrect: true },
        { id: 2, text: "No", isCorrect: false }
      ]
    },
    { 
      id: 2, 
      text: "AI can suggest personalized medicine based on patient data?", 
      emoji: "💊", 
      choices: [
        { id: 1, text: "Yes", isCorrect: true },
        { id: 2, text: "No", isCorrect: false }
      ]
    },
    { 
      id: 3, 
      text: "AI can perform surgery independently without human supervision?", 
      emoji: "🏥", 
      choices: [
        { id: 1, text: "Yes", isCorrect: false },
        { id: 2, text: "No", isCorrect: true }
      ]
    },
    { 
      id: 4, 
      text: "AI can monitor patients’ vital signs in real-time?", 
      emoji: "🩺", 
      choices: [
        { id: 1, text: "Yes", isCorrect: true },
        { id: 2, text: "No", isCorrect: false }
      ]
    },
    { 
      id: 5, 
      text: "AI can replace doctors completely?", 
      emoji: "👨‍⚕️", 
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
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, false);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      // Quiz finished, navigate to next game
      navigate("/student/ai-for-all/teen/music-playlist-ai");
    }
  };

  const selectedChoiceData = selectedChoice
    ? questions[currentQuestion].choices.find(c => c.id === selectedChoice)
    : null;

  const question = questions[currentQuestion];

  return (
    <GameShell
      title="AI Doctor Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-31"
      gameType="ai"
      totalLevels={20}
      currentLevel={31}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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
            
            <div className={`bg-${selectedChoiceData?.isCorrect ? 'green' : 'red'}-500/20 rounded-lg p-4 mb-4`}>
              <p className="text-white text-center">
                {selectedChoiceData?.isCorrect
                  ? "AI can detect patterns in medical images and patient data, helping doctors diagnose diseases faster and more accurately."
                  : "Remember, AI in healthcare assists doctors in diagnosis, but it doesn't replace human judgement!"}
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              {selectedChoiceData?.isCorrect ? "You earned 1 Coin! 🪙" : ""}
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

export default AiDoctorQuizz;
