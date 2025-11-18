import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SharingSweetsStory = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [completed, setCompleted] = useState(false);

  const stories = [
    {
      id: 1,
      title: "Sharing Sweets 🍭",
      situation: "You have 4 sweets and your friend has 1. Do you share some with your friend?",
      choices: [
        { id: 1, text: "Keep all for yourself", emoji: "😋", isCorrect: false },
        { id: 2, text: "Share some with your friend", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Give only one and keep the rest", emoji: "🍬", isCorrect: true },
        { id: 4, text: "Trade sweets for toys instead", emoji: "🧸", isCorrect: false },
        { id: 5, text: "Ignore your friend and eat quietly", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Lunch Time 🍱",
      situation: "Your friend forgot their lunch. What will you do?",
      choices: [
        { id: 1, text: "Share half of your lunch", emoji: "🍔", isCorrect: true },
        { id: 2, text: "Say 'Too bad!'", emoji: "😅", isCorrect: false },
        { id: 3, text: "Hide your lunch", emoji: "🙈", isCorrect: false },
        { id: 4, text: "Give one bite only", emoji: "🍴", isCorrect: true },
        { id: 5, text: "Ask someone else to share", emoji: "🧃", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Playground Ball ⚽",
      situation: "You have the new ball everyone wants to play with. What do you do?",
      choices: [
        { id: 1, text: "Let everyone take turns", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Play alone", emoji: "🙅‍♂️", isCorrect: false },
        { id: 3, text: "Only allow your best friend", emoji: "👫", isCorrect: false },
        { id: 4, text: "Share and make new friends", emoji: "😊", isCorrect: true },
        { id: 5, text: "Hide the ball", emoji: "🙈", isCorrect: false }
      ]
    }
  ];

  const story = stories[currentIndex];

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const selected = story.choices.find((c) => c.id === selectedChoice);
    setShowFeedback(true);

    if (selected.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  const handleFinish = () => {
    navigate("/student/moral-values/kids/reflex-equal-share");
  };

  const selectedChoiceData = story.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Sharing Sweets Story"
      subtitle="Learning to Share"
      onNext={completed ? handleFinish : handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={completed}
      score={coins}
      gameId="moral-kids-48"
      gameType="educational"
      totalLevels={100}
      currentLevel={48}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!completed ? (
          <>
            {!showFeedback ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
                <div className="text-7xl mb-4 text-center">{story.title.split(" ")[1]}</div>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">{story.title}</h2>

                <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                  <p className="text-white text-lg text-center leading-relaxed">{story.situation}</p>
                </div>

                <h3 className="text-white font-bold mb-4">What should you do?</h3>
                <div className="space-y-3 mb-6">
                  {story.choices.map((choice) => (
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
                        <div className="text-3xl">{choice.emoji}</div>
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
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-6xl mb-4 text-center">{selectedChoiceData.emoji}</div>
                <h2 className="text-3xl font-bold text-white mb-4 text-center">
                  {selectedChoiceData.isCorrect ? "🎉 Great Choice!" : "Think Again..."}
                </h2>
                <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

                {selectedChoiceData.isCorrect ? (
                  <>
                    <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                      <p className="text-white text-center">
                        Excellent! You showed kindness and fairness. Keep it up!
                      </p>
                    </div>
                    <p className="text-yellow-400 text-2xl font-bold text-center">
                      +5 Coins! 🪙 Total: {coins}
                    </p>

                    <button
                      onClick={handleNextQuestion}
                      className="mt-4 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                    >
                      Next Story →
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                      <p className="text-white text-center">
                        Try to be fair next time! Sharing and caring make better friends.
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
          </>
        ) : (
          <div className="bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 rounded-2xl p-8 text-center text-white">
            <div className="text-8xl mb-4">🏅</div>
            <h2 className="text-4xl font-bold mb-2">Sharing Star!</h2>
            <p className="text-lg mb-4">
              You completed all stories showing fairness, kindness, and empathy. 🌟
            </p>
            <p className="text-2xl font-bold mb-4">Total Coins: {coins} 🪙</p>
            <button
              onClick={handleFinish}
              className="bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-purple-100 transition"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SharingSweetsStory;
