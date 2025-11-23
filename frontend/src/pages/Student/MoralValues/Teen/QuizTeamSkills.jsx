import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizTeamSkills = () => {
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
      text: "What is the best teamwork trait?",
      emoji: "🤝",
      choices: [
        { id: 1, text: "Listening", emoji: "👂", isCorrect: true },
        { id: 2, text: "Arguing", emoji: "😠", isCorrect: false },
        { id: 3, text: "Blaming", emoji: "☹️", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "When a teammate shares an idea, what should you do?",
      emoji: "💬",
      choices: [
        { id: 1, text: "Ignore it", emoji: "🙉", isCorrect: false },
        { id: 2, text: "Listen and discuss respectfully", emoji: "🤗", isCorrect: true },
        { id: 3, text: "Laugh at it", emoji: "😂", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "If a team member makes a mistake, how should you react?",
      emoji: "🧩",
      choices: [
        { id: 1, text: "Blame them", emoji: "😤", isCorrect: false },
        { id: 2, text: "Help them fix it together", emoji: "🙌", isCorrect: true },
        { id: 3, text: "Complain to others", emoji: "🙄", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "What helps teams achieve goals faster?",
      emoji: "🚀",
      choices: [
        { id: 1, text: "Cooperation and planning", emoji: "📋", isCorrect: true },
        { id: 2, text: "Everyone working separately", emoji: "🤷‍♂️", isCorrect: false },
        { id: 3, text: "Arguing over tasks", emoji: "😡", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "When you disagree with a teammate, what’s the best response?",
      emoji: "🗣️",
      choices: [
        { id: 1, text: "Listen calmly and find a solution", emoji: "🕊️", isCorrect: true },
        { id: 2, text: "Interrupt and shout", emoji: "🚫", isCorrect: false },
        { id: 3, text: "Walk away angrily", emoji: "😠", isCorrect: false },
      ],
    },
  ];

  const currentQuestionData = questions[currentQuestion];
  const selectedChoiceData = currentQuestionData.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoiceData) return;
    if (selectedChoiceData.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/reflex-collaboration");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Quiz on Team Skills"
      subtitle="Learn Cooperation & Team Spirit"
      score={coins}
      gameId="moral-teen-62"
      gameType="moral"
      totalLevels={100}
      currentLevel={62}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQuestionData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                Q{currentQuestion + 1}. {currentQuestionData.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestionData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
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
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "🌟 Correct!" : "🤔 Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Great teamwork! Listening, helping, and staying calm builds stronger groups and friendships.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-6">You earned 3 Coins! 🪙</p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    True teamwork means respecting ideas, solving conflicts peacefully, and working together for success.
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizTeamSkills;
