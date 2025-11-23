import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateTeamVsIndividual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const topic = "Which is better — working alone or in a team?";
  const positions = [
    { id: 1, position: "Working Alone", emoji: "🧍‍♂️", isCorrect: false },
    { id: 2, position: "Working in a Team", emoji: "🤝", isCorrect: true },
  ];

  const questions = [
    "1️⃣ What’s one advantage of working in a team?",
    "2️⃣ How does teamwork improve creativity or problem-solving?",
    "3️⃣ Describe a time when teamwork helped achieve something big.",
    "4️⃣ Why can working alone sometimes be challenging?",
    "5️⃣ How does being part of a team teach responsibility?",
  ];

  const handleAnswerChange = (value) => {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion].trim().length < 20) return;
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const allFilled = answers.every((a) => a.trim().length >= 20);
    if (selectedPosition === 2 && allFilled) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setShowFeedback(true);
    } else if (selectedPosition && allFilled) {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/journal-cooperation");
  };

  const selectedPos = positions.find((p) => p.id === selectedPosition);

  return (
    <GameShell
      title="Debate: Team vs Individual"
      score={coins}
      subtitle="Collaboration vs Independence"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && coins > 0}
      
      gameId="moral-teen-66"
      gameType="moral"
      totalLevels={100}
      currentLevel={66}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🤔</div>

            {/* Debate Topic */}
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Debate Topic</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">{topic}</p>
            </div>

            {/* Step 1: Choose Position */}
            {!selectedPosition ? (
              <>
                <h3 className="text-white font-bold mb-4">1️⃣ Choose Your Position</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {positions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setSelectedPosition(pos.id)}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        selectedPosition === pos.id
                          ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                          : "bg-white/20 border-white/40 hover:bg-white/30"
                      }`}
                    >
                      <div className="text-3xl mb-2">{pos.emoji}</div>
                      <div className="text-white font-semibold text-sm">{pos.position}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Answer Questions One by One */}
                <h3 className="text-white font-bold mb-2">
                  {`Question ${currentQuestion + 1} of ${questions.length}`}
                </h3>
                <div className="mb-5">
                  <p className="text-white mb-2 font-semibold">{questions[currentQuestion]}</p>
                  <textarea
                    value={answers[currentQuestion]}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Write your thoughts (min 20 chars)..."
                    className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                    maxLength={200}
                  />
                  <div className="text-white/50 text-sm text-right">
                    {answers[currentQuestion].length}/200
                  </div>
                </div>

                {/* Next / Submit Button */}
                <button
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion].trim().length < 20}
                  className={`w-full py-3 rounded-xl font-bold text-white transition ${
                    answers[currentQuestion].trim().length >= 20
                      ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                      : "bg-gray-500/50 cursor-not-allowed"
                  }`}
                >
                  {currentQuestion === questions.length - 1 ? "Submit Debate" : "Next Question →"}
                </button>
              </>
            )}
          </div>
        ) : (
          // Feedback Section
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedPos.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedPos.isCorrect ? "🌟 Team Spirit Winner!" : "Reconsider Your Approach"}
            </h2>

            {selectedPos.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great insight! Teamwork builds collaboration, communication, and empathy.
                    Together, people achieve more, combining strengths and supporting each other.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    While independence has value, working in a team teaches collaboration and
                    patience. Try to think from both perspectives!
                  </p>
                </div>
                <p className="text-white/70 text-center">
                  Think again about teamwork’s importance!
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateTeamVsIndividual;
