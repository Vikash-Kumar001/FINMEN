import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClassroomStory2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Teacher Blames Wrong Student",
      emoji: "👩‍🏫",
      situation: "The teacher blames a classmate wrongly for misbehaving. Do you speak up?",
      choices: [
        { id: 1, text: "Stay silent", emoji: "🤐", isCorrect: false },
        { id: 2, text: "Defend the student", emoji: "🙋", isCorrect: true },
      ],
    },
    {
      id: 2,
      title: "Homework Mix-Up",
      emoji: "📝",
      situation:
        "A student is accused of copying your homework, but you know they didn’t. Do you clarify?",
      choices: [
        { id: 1, text: "Ignore it", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Explain the truth", emoji: "🗣️", isCorrect: true },
      ],
    },
    {
      id: 3,
      title: "Classroom Argument",
      emoji: "🗯️",
      situation: "Two students argue and one gets wrongly punished. Do you intervene?",
      choices: [
        { id: 1, text: "Let it be", emoji: "😶", isCorrect: false },
        { id: 2, text: "Tell the teacher the correct facts", emoji: "💬", isCorrect: true },
      ],
    },
    {
      id: 4,
      title: "Lost Belongings",
      emoji: "🎒",
      situation:
        "A classmate is blamed for losing a book that you accidentally misplaced. Do you confess?",
      choices: [
        { id: 1, text: "Hide the truth", emoji: "🙊", isCorrect: false },
        { id: 2, text: "Admit your mistake", emoji: "✋", isCorrect: true },
      ],
    },
    {
      id: 5,
      title: "Group Project Credit",
      emoji: "📚",
      situation:
        "Your friend gets unfairly credited for your work. Do you claim your contribution?",
      choices: [
        { id: 1, text: "Let it go", emoji: "😔", isCorrect: false },
        { id: 2, text: "Politely clarify your effort", emoji: "🙋‍♂️", isCorrect: true },
      ],
    },
  ];

  const currentQuestionData = questions[currentQuestion];
  const selectedChoiceData = currentQuestionData?.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;

    const choice = currentQuestionData.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
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
      navigate("/student/moral-values/teen/justice-quiz");
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    resetFeedback();
  };

  return (
    <GameShell
      title="Classroom Story 2"
      subtitle="Standing Up for Justice"
      score={coins}
      gameId="moral-teen-41"
      gameType="moral"
      totalLevels={100}
      currentLevel={41}
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
          // ---- QUESTION SCREEN ----
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQuestionData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentQuestionData.title}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {currentQuestionData.situation}
            </p>

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
              Confirm Choice
            </button>
          </div>
        ) : (
          // ---- FEEDBACK SCREEN ----
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "🌟 Honest Action!" : "Think Again..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <>
                <p className="text-white/80 mb-6">
                  Great! That was the right choice — standing up for fairness encourages honesty
                  and justice.
                </p>
                <p className="text-yellow-400 text-2xl font-bold mb-6">+5 Coins 🪙</p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-xl hover:opacity-90 transition"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question ➡️" : "Finish Game 🎯"}
                </button>
              </>
            ) : (
              <>
                <p className="text-white/80 mb-6">
                  That choice allowed unfairness to continue. Try to choose fairness next time!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ClassroomStory2;
