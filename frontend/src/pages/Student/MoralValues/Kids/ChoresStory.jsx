import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ChoresStory = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Putting Plates Away",
      emoji: "🍽️",
      situation: "Mom asks you to put the plates away after dinner. What do you do?",
      choices: [
        { id: 1, text: "Say 'I'll do it later'", emoji: "😴", isCorrect: false },
        { id: 2, text: "Do it right away to help", emoji: "💪", isCorrect: true },
        { id: 3, text: "Ignore and keep playing", emoji: "🎮", isCorrect: false },
      ],
      feedback:
        "Helping right away shows you’re responsible and caring. You make home life easier for everyone!",
    },
    {
      title: "Feeding the Pet",
      emoji: "🐶",
      situation: "Your pet is hungry, and it's your turn to feed it.",
      choices: [
        { id: 1, text: "Feed your pet immediately", emoji: "🥣", isCorrect: true },
        { id: 2, text: "Wait for mom to remind you", emoji: "🕒", isCorrect: false },
        { id: 3, text: "Forget and go out to play", emoji: "🏃", isCorrect: false },
      ],
      feedback:
        "Responsibility means doing things on time, especially when someone depends on you — even a pet!",
    },
    {
      title: "Cleaning Toys",
      emoji: "🧸",
      situation: "After playing, your toys are all over the floor.",
      choices: [
        { id: 1, text: "Leave them and walk away", emoji: "🚶", isCorrect: false },
        { id: 2, text: "Clean up all the toys neatly", emoji: "🧹", isCorrect: true },
        { id: 3, text: "Ask someone else to clean", emoji: "🙋", isCorrect: false },
      ],
      feedback:
        "Cleaning up your toys keeps your space neat and shows you take responsibility for your things!",
    },
    {
      title: "Doing Homework",
      emoji: "📚",
      situation: "You promised to finish your homework before watching TV.",
      choices: [
        { id: 1, text: "Finish homework first", emoji: "✏️", isCorrect: true },
        { id: 2, text: "Watch TV first and then maybe do it", emoji: "📺", isCorrect: false },
        { id: 3, text: "Ignore homework completely", emoji: "🙈", isCorrect: false },
      ],
      feedback:
        "Doing your work before fun shows discipline. Responsible kids keep their promises to themselves too!",
    },
    {
      title: "Helping Siblings",
      emoji: "👧👦",
      situation: "Your younger sibling drops their crayons. What do you do?",
      choices: [
        { id: 1, text: "Help pick them up", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Laugh and walk away", emoji: "😅", isCorrect: false },
        { id: 3, text: "Call mom to do it", emoji: "📞", isCorrect: false },
      ],
      feedback:
        "Helping others without being asked is true responsibility. You make your family proud!",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/kids/poster-discipline");
    }
  };

  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Chores Story"
      subtitle="Learning Responsibility at Home"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={currentQuestionIndex === questions.length - 1 && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId="moral-kids-35"
      gameType="story"
      totalLevels={100}
      currentLevel={35}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentQuestion.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentQuestion.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌟 Responsible Choice!" : "Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">You earned 5 Coins! 🪙</p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➡️
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Responsibility means doing your duties on time and helping others!
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

export default ChoresStory;
