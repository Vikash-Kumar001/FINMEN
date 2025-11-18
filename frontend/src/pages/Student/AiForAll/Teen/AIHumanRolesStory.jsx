import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIHumanRolesStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Court Judgment Decision",
      emoji: "⚖️",
      situation: "Who should decide the final court judgment — a Human Judge or an AI system?",
      choices: [
        { id: 1, text: "AI Judge", emoji: "🤖", isCorrect: false },
        { id: 2, text: "Human Judge", emoji: "👨‍⚖️", isCorrect: true }
      ]
    },
    {
      id: 2,
      title: "Medical Diagnosis Decision",
      emoji: "🏥",
      situation: "Who should give the final say in a life-saving surgery — AI system or Doctor?",
      choices: [
        { id: 1, text: "AI System", emoji: "💻", isCorrect: false },
        { id: 2, text: "Doctor", emoji: "👩‍⚕️", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Job Hiring Decision",
      emoji: "💼",
      situation: "Who should make the final hiring decision — HR AI tool or Human Manager?",
      choices: [
        { id: 1, text: "HR AI Tool", emoji: "🤖", isCorrect: false },
        { id: 2, text: "Human Manager", emoji: "🧑‍💼", isCorrect: true }
      ]
    },
    {
      id: 4,
      title: "Education Grading Decision",
      emoji: "🎓",
      situation: "Who should grade student creativity — AI software or Teacher?",
      choices: [
        { id: 1, text: "AI Software", emoji: "🧠", isCorrect: false },
        { id: 2, text: "Teacher", emoji: "👩‍🏫", isCorrect: true }
      ]
    },
    {
      id: 5,
      title: "News Verification",
      emoji: "📰",
      situation: "Who should confirm if news is true — AI algorithm or Human Journalist?",
      choices: [
        { id: 1, text: "AI Algorithm", emoji: "💻", isCorrect: false },
        { id: 2, text: "Human Journalist", emoji: "🧑‍💻", isCorrect: true }
      ]
    }
  ];

  const current = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);
    setShowFeedback(true);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(2, true);
      setCoins((prev) => prev + 2);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/cyber-safety-reflex");
  };

  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="AI & Human Roles Story"
      subtitle="Human Authority Matters"
      onNext={handleNext}
      nextEnabled={showFeedback && currentQuestion === questions.length - 1}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-92"
      gameType="ai"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showFeedback && currentQuestion === questions.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl text-center mb-4">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-3 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map(choice => (
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "✅ Human Judgment Wins!" : "🤖 Not Quite..."}
            </h2>
            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Correct! Human judgment involves emotions, fairness, and moral reasoning — things AI can’t truly understand.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-4">
                  You earned +2 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    AI can assist, but humans must make ethical and moral decisions — not machines.
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

            {selectedChoiceData?.isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentQuestion < questions.length - 1 ? "Next Question →" : "Finish Quiz"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIHumanRolesStory;
