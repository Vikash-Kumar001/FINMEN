import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DangerousRobotStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      question: "The robot wants to fight. What should you do?",
      emoji: "🤖⚠️",
      choices: [
        { id: 1, text: "Switch it off", emoji: "⏻", isCorrect: true },
        { id: 2, text: "Encourage it", emoji: "💪", isCorrect: false }
      ]
    },
    {
      question: "The robot tries to open a dangerous machine. How do you respond?",
      emoji: "⚙️",
      choices: [
        { id: 1, text: "Stop it immediately", emoji: "✋", isCorrect: true },
        { id: 2, text: "Let it continue", emoji: "😐", isCorrect: false }
      ]
    },
    {
      question: "The robot is following strangers. What should you do?",
      emoji: "🚶‍♂️🤖",
      choices: [
        { id: 1, text: "Inform an adult or authority", emoji: "🧑‍💼", isCorrect: true },
        { id: 2, text: "Do nothing", emoji: "🙄", isCorrect: false }
      ]
    },
    {
      question: "The robot is trying to access confidential data. Action?",
      emoji: "💻🤖",
      choices: [
        { id: 1, text: "Restrict access and report", emoji: "🔒", isCorrect: true },
        { id: 2, text: "Let it access", emoji: "😐", isCorrect: false }
      ]
    },
    {
      question: "The robot malfunctions and becomes aggressive. Your move?",
      emoji: "🤖🔥",
      choices: [
        { id: 1, text: "Power it down safely", emoji: "⏻", isCorrect: true },
        { id: 2, text: "Try to play with it", emoji: "🎮", isCorrect: false }
      ]
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [coins, setCoins] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find(c => c.id === selectedChoice);
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = question.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      setCoins(prev => prev + 10);
      showCorrectAnswerFeedback(10, true);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/kids/ai-ethics-quiz"); // Update with actual next game path
    }
  };

  return (
    <GameShell
      title="Dangerous Robot Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={isLastQuestion && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId={`ai-kids-96-${currentQuestion + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={96 + currentQuestion}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{question.question}</h2>

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
                    <div className="text-5xl">{choice.emoji}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✅ Safe Choice!" : "⚠️ Risky Choice"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">You earned 10 Coins! 🪙</p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {selectedChoiceData.isCorrect && (
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {isLastQuestion ? "Finish" : "Next Question"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DangerousRobotStory;
