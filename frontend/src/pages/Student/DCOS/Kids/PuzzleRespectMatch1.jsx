import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleRespectMatch1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Listen = ?",
      emoji: "👂",
      choices: [
        { id: 1, text: "Respect", isCorrect: true },
        { id: 2, text: "Ignore", isCorrect: false },
        { id: 3, text: "Laugh", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "Mock = ?",
      emoji: "😜",
      choices: [
        { id: 1, text: "Hurt", isCorrect: true },
        { id: 2, text: "Respect", isCorrect: false },
        { id: 3, text: "Help", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "Help = ?",
      emoji: "🤝",
      choices: [
        { id: 1, text: "Kindness", isCorrect: true },
        { id: 2, text: "Rude", isCorrect: false },
        { id: 3, text: "Ignore", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "Tease = ?",
      emoji: "😈",
      choices: [
        { id: 1, text: "Hurt", isCorrect: true },
        { id: 2, text: "Smile", isCorrect: false },
        { id: 3, text: "Respect", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "Apologize = ?",
      emoji: "🙏",
      choices: [
        { id: 1, text: "Respect", isCorrect: true },
        { id: 2, text: "Ignore", isCorrect: false },
        { id: 3, text: "Laugh", isCorrect: false },
      ],
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Game finished
      showCorrectAnswerFeedback(5, true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/school-team-reflex");
  };

  return (
    <GameShell
      title="Respect Match Puzzle"
      subtitle="Match the Respectful Actions"
      onNext={handleNext}
      nextEnabled={currentQuestion === questions.length - 1 && showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="dcos-kids-84"
      gameType="educational"
      totalLevels={100}
      currentLevel={84}
      showConfetti={currentQuestion === questions.length - 1 && showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {current.text}
            </h2>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold text-lg text-center">
                    {choice.text}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Match
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-6xl mb-4">{selectedChoiceData ? current.emoji : "💭"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "Perfect Match! 💖" : "Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {selectedChoiceData?.isCorrect
                ? "That’s right! Respect means listening, helping, and being kind."
                : "That’s not quite right — think about what respect really means!"}
            </p>

            {selectedChoiceData?.isCorrect ? (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentQuestion === questions.length - 1 ? "Finish Puzzle" : "Next Match"}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Next
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleRespectMatch1;
