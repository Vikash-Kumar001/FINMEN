import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BiasInDataStory = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Bias in Data",
      emoji: "🧠",
      situation:
        "The robot was trained mostly on boys' faces. When a girl tries to use it, the robot can't recognize her. What should we do?",
      choices: [
        {
          id: 1,
          text: "Add many girls' faces to the training data so the robot learns both boys and girls.",
          emoji: "📸",
          isCorrect: true,
        },
        { id: 2, text: "Ignore the problem — only boys need to use the robot.", emoji: "🙅‍♂️", isCorrect: false },
        { id: 3, text: "Remove girls from the system so it never makes mistakes again.", emoji: "🗑️", isCorrect: false },
      ],
      correctFeedback:
        "Exactly! The robot failed because its training data wasn't diverse. Adding girls' faces helps it recognize everyone equally.",
      incorrectFeedback:
        "That won’t fix it. The robot needs diverse examples so it can learn to recognize everyone fairly.",
    },
    {
      id: 2,
      title: "Data Fairness",
      emoji: "⚖️",
      situation:
        "An AI suggests scholarships mostly to students from one region. What’s the fair fix?",
      choices: [
        {
          id: 1,
          text: "Add balanced data from all regions so the AI treats everyone fairly.",
          emoji: "🌍",
          isCorrect: true,
        },
        { id: 2, text: "Continue with the same region since it’s easier.", emoji: "🚫", isCorrect: false },
        { id: 3, text: "Delete all data from that region.", emoji: "❌", isCorrect: false },
      ],
      correctFeedback:
        "Correct! Balanced data ensures fairness for everyone, no matter where they live.",
      incorrectFeedback:
        "That keeps bias. Always include diverse data from all regions to make fair decisions.",
    },
    {
      id: 3,
      title: "Voice Assistant Bias",
      emoji: "🎙️",
      situation:
        "Your voice assistant only understands deep voices. What can developers do?",
      choices: [
        {
          id: 1,
          text: "Train it with voices of different pitches and accents.",
          emoji: "🔊",
          isCorrect: true,
        },
        { id: 2, text: "Only allow users with deep voices.", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Turn off voice recognition.", emoji: "📴", isCorrect: false },
      ],
      correctFeedback:
        "Nice! Training with varied voices helps it understand everyone.",
      incorrectFeedback:
        "That excludes users. The assistant must be trained with all kinds of voices.",
    },
    {
      id: 4,
      title: "AI in Schools",
      emoji: "🏫",
      situation:
        "A grading AI gives lower marks to essays with certain writing styles. What should teachers do?",
      choices: [
        {
          id: 1,
          text: "Review the AI and include essays from many writing styles in training.",
          emoji: "📝",
          isCorrect: true,
        },
        { id: 2, text: "Ban students with those writing styles.", emoji: "🚷", isCorrect: false },
        { id: 3, text: "Ignore the issue — AI knows best.", emoji: "🤖", isCorrect: false },
      ],
      correctFeedback:
        "Exactly! Fair grading comes from training the AI with diverse examples.",
      incorrectFeedback:
        "That makes it unfair. Always retrain AI with examples from all kinds of students.",
    },
    {
      id: 5,
      title: "Robot Helper",
      emoji: "🤖",
      situation:
        "A home robot keeps misunderstanding older people’s commands. What should the developers do?",
      choices: [
        {
          id: 1,
          text: "Include more elderly voices and commands in training data.",
          emoji: "👵",
          isCorrect: true,
        },
        { id: 2, text: "Make the robot only for young users.", emoji: "👶", isCorrect: false },
        { id: 3, text: "Remove voice control completely.", emoji: "🔇", isCorrect: false },
      ],
      correctFeedback:
        "Perfect! Inclusive data ensures robots understand and help everyone.",
      incorrectFeedback:
        "That’s not fair. The robot should be trained with data from all ages and voices.",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    if (!choice) return;

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(15, true);
      setCoins(15);
      setTotalCoins((prev) => prev + 15);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/robot-learning-bar"); // final next route
    }
  };

  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Bias in Data Story"
      subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestionIndex === questions.length - 1}
      score={totalCoins}
      gameId="ai-kids-bias-67"
      gameType="ai"
      totalLevels={100}
      currentLevel={67}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentQuestion.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center font-semibold">{currentQuestion.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should we do?</h3>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div>
                      <div className="text-white font-semibold text-lg">{choice.text}</div>
                    </div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Great Fix!" : "🤔 Not the best choice"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.correctFeedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 15 Coins! 🪙 (Total: {totalCoins})
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.incorrectFeedback}</p>
                </div>
              </>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish Game" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BiasInDataStory;
