import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendLieStory = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Friend’s Request",
      emoji: "🤥",
      situation:
        "Your friend asks you to lie to the teacher about why they were late. What do you do?",
      choices: [
        { id: 1, text: "Lie for them – they’re my friend", emoji: "😞", isCorrect: false },
        { id: 2, text: "Refuse to lie – tell the truth", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Avoid the teacher completely", emoji: "🚶", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Homework Help",
      emoji: "📚",
      situation:
        "Your best friend forgot to do their homework and asks to copy yours. What do you do?",
      choices: [
        { id: 1, text: "Let them copy it quickly", emoji: "✏️", isCorrect: false },
        { id: 2, text: "Explain the topic and help them learn", emoji: "💡", isCorrect: true },
        { id: 3, text: "Ignore them completely", emoji: "🙄", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Group Project",
      emoji: "🧑‍🤝‍🧑",
      situation:
        "A classmate takes credit for your hard work in a group project. What do you do?",
      choices: [
        { id: 1, text: "Stay silent to avoid conflict", emoji: "😐", isCorrect: false },
        { id: 2, text: "Calmly tell the teacher the truth", emoji: "🗣️", isCorrect: true },
        { id: 3, text: "Yell at your classmate", emoji: "😡", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Lost Wallet",
      emoji: "💰",
      situation:
        "You find a wallet in the school playground. No one is around. What do you do?",
      choices: [
        { id: 1, text: "Take the money and throw the wallet", emoji: "💸", isCorrect: false },
        { id: 2, text: "Give it to the teacher or office", emoji: "🏫", isCorrect: true },
        { id: 3, text: "Keep it hidden for later", emoji: "😶", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Truth or Lie",
      emoji: "🪞",
      situation:
        "You broke a class decoration accidentally, but no one saw you. What do you do?",
      choices: [
        { id: 1, text: "Admit it and say sorry", emoji: "🙏", isCorrect: true },
        { id: 2, text: "Stay silent and hope no one notices", emoji: "😬", isCorrect: false },
        { id: 3, text: "Blame someone else", emoji: "🚫", isCorrect: false },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentStory = stories[currentQuestion];
  const selectedChoiceData = currentStory?.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    if (!selectedChoice) return;
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/white-lie-quiz");
  };

  return (
    <GameShell
      title="Friend’s Lie Story"
      subtitle="Integrity in Friendship"
      onNext={handleNext}
      nextEnabled={completed}
      showGameOver={completed}
      score={coins}
      gameId="moral-teen-1"
      gameType="moral"
      totalLevels={20}
      currentLevel={1}
      showConfetti={completed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!completed ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
              <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {currentStory.title}
              </h2>
              <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
                <p className="text-white text-lg leading-relaxed">
                  {currentStory.situation}
                </p>
              </div>

              <h3 className="text-white font-bold mb-4">What should you do?</h3>

              <div className="space-y-3 mb-6">
                {currentStory.choices.map((choice) => (
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
                      <div className="text-white font-semibold text-lg">
                        {choice.text}
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
              <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                {selectedChoiceData.isCorrect ? "🌟 Great Choice!" : "Think Again..."}
              </h2>
              <p className="text-white/90 text-lg mb-6 text-center">
                {selectedChoiceData.text}
              </p>

              {selectedChoiceData.isCorrect ? (
                <>
                  <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white text-center">
                      Excellent decision! You showed honesty and responsibility.
                    </p>
                  </div>
                  <p className="text-yellow-400 text-2xl font-bold text-center">
                    +5 Coins 🪙
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Next Question →
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white text-center">
                      That wasn’t the best choice. Try thinking from an integrity point of view.
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
          )
        ) : (
          // ✅ Final Summary Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center  max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">🏆 Integrity Hero!</h2>
            <p className="text-white/80 mb-6 text-lg">
              You’ve completed all 5 questions with integrity and truth! 🎉
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              Total Coins Earned: {coins} 🪙
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FriendLieStory;
