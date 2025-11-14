import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GoodVsBadPostQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Which post is safe to share online?",
      emoji: "💬",
      choices: [
        { id: 1, text: "I love football! ⚽", isCorrect: true },
        { id: 2, text: "Teacher is stupid. 😡", isCorrect: false },
      ],
      feedback: "Positive posts are safe! Never post rude or hurtful messages."
    },
    {
      text: "Which comment is kind?",
      emoji: "🌸",
      choices: [
        { id: 1, text: "You played really well today! 👏", isCorrect: true },
        { id: 2, text: "You’re the worst player ever! 😠", isCorrect: false },
      ],
      feedback: "Nice! Always lift others up with your words online."
    },
    {
      text: "What kind of post should you avoid?",
      emoji: "🚫",
      choices: [
        { id: 1, text: "Sharing fun team pictures 🏆", isCorrect: false },
        { id: 2, text: "Posting mean comments about friends 😢", isCorrect: true },
      ],
      feedback: "Correct! Never post mean or hurtful things about anyone."
    },
    {
      text: "Which post shows good digital behavior?",
      emoji: "🌟",
      choices: [
        { id: 1, text: "Congrats on your new puppy! 🐶", isCorrect: true },
        { id: 2, text: "Your puppy looks ugly. 🙄", isCorrect: false },
      ],
      feedback: "Good choice! Compliments spread kindness online."
    },
    {
      text: "What should you do before posting?",
      emoji: "🤔",
      choices: [
        { id: 1, text: "Think if it’s kind and safe 😊", isCorrect: true },
        { id: 2, text: "Post it quickly without checking 😬", isCorrect: false },
      ],
      feedback: "Exactly! Always think before you post."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion.choices.find(c => c.id === selectedChoice);

  const handleChoice = (id) => {
    setSelectedChoice(id);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);
    if (choice?.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setScore(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setEarnedBadge(true);
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/emoji-reflex1");
  };

  return (
    <GameShell
      title="Good vs Bad Post Quiz"
      subtitle="Post Smart, Stay Kind"
      onNext={handleNext}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={score}
      gameId="dcos-kids-64"
      gameType="quiz"
      totalLevels={100}
      currentLevel={64}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!earnedBadge ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
              <p className="text-white text-xl font-semibold text-center mb-6">
                {currentQuestion.text}
              </p>

              <div className="space-y-3 mb-6">
                {currentQuestion.choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className={`w-full border-2 rounded-xl p-5 transition-all ${
                      selectedChoice === choice.id
                        ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                        : "bg-white/20 border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-white text-lg font-semibold">{choice.text}</div>
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-7xl mb-4 text-center">{selectedChoiceData?.isCorrect ? "🌟" : "😕"}</div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                {selectedChoiceData?.isCorrect ? "Nice Choice!" : "Oops... Try Again!"}
              </h2>
              <p className="text-white/90 text-lg mb-6 text-center">{currentQuestion.feedback}</p>

              {selectedChoiceData?.isCorrect ? (
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              )}
            </div>
          )
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">Kind Poster Badge!</h2>
            <p className="text-white/90 text-lg mb-6">
              Great job! You know how to post safely and kindly online.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GoodVsBadPostQuiz;
