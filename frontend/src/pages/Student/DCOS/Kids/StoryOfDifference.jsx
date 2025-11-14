import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StoryOfDifference = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "New Friend at School",
      emoji: "🧒🌍",
      situation:
        "A new friend joins your class but speaks a different language. Others laugh, what should you do?",
      choices: [
        { id: 1, text: "Laugh with others", emoji: "😅", isCorrect: false },
        { id: 2, text: "Smile and try to communicate", emoji: "😊", isCorrect: true },
        { id: 3, text: "Ignore them", emoji: "😐", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Lunch Time",
      emoji: "🍱",
      situation:
        "Your friend brings food that looks different from yours. Some kids make faces.",
      choices: [
        { id: 1, text: "Refuse to sit with them", emoji: "🙅‍♀️", isCorrect: false },
        { id: 2, text: "Ask politely about the food", emoji: "🍛", isCorrect: true },
        { id: 3, text: "Tell everyone it smells bad", emoji: "😖", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Playground Game",
      emoji: "⚽",
      situation: "Your friend plays a new game from their country and invites you to join.",
      choices: [
        { id: 1, text: "Say it's boring", emoji: "😒", isCorrect: false },
        { id: 2, text: "Try it and learn the rules", emoji: "🤩", isCorrect: true },
        { id: 3, text: "Walk away", emoji: "🚶‍♀️", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Art Project",
      emoji: "🎨",
      situation:
        "Your class is drawing traditional outfits from different cultures.",
      choices: [
        { id: 1, text: "Draw something silly to make fun", emoji: "😜", isCorrect: false },
        {
          id: 2,
          text: "Draw carefully and appreciate others’ work",
          emoji: "❤️",
          isCorrect: true,
        },
        { id: 3, text: "Skip the task", emoji: "😴", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Music Class",
      emoji: "🎵",
      situation:
        "Your teacher plays a song from another country. Everyone laughs because it sounds strange.",
      choices: [
        { id: 1, text: "Listen and enjoy something new", emoji: "🎧", isCorrect: true },
        { id: 2, text: "Make jokes about it", emoji: "😂", isCorrect: false },
        { id: 3, text: "Ask the teacher to stop", emoji: "🙅‍♂️", isCorrect: false },
      ],
    },
  ];

  const [currentStory, setCurrentStory] = useState(0);
  const [feedbackData, setFeedbackData] = useState(null);
  const current = stories[currentStory];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (id) => {
    setSelectedChoice(id);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }
    setFeedbackData(choice);
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    resetFeedback();
    setSelectedChoice(null);
    setFeedbackData(null);
    setShowFeedback(false);
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
    }
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/journal-my-words");
  };

  const isLastStory = currentStory === stories.length - 1;

  return (
    <GameShell
      title="Story of Difference"
      subtitle="Respecting Diversity"
      onNext={handleNextGame}
      nextEnabled={showFeedback && isLastStory}
      showGameOver={showFeedback && isLastStory}
      score={coins}
      gameId="dcos-kids-87"
      gameType="educational"
      totalLevels={100}
      currentLevel={87}
      showConfetti={showFeedback && isLastStory}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {/* QUESTION SCREEN */}
        {!showFeedback && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {current.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{current.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{choice.emoji}</div>
                    <div className="text-white font-semibold">{choice.text}</div>
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
        )}

        {/* FEEDBACK SCREEN (Separate Screen) */}
        {showFeedback && feedbackData && !isLastStory && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="text-5xl mb-2 text-center">{feedbackData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {feedbackData.isCorrect ? "Great Choice! 🌟" : "Try Again!"}
            </h2>
            <p className="text-white/90 text-center mb-6">{feedbackData.text}</p>

            {feedbackData.isCorrect ? (
              <p className="text-green-400 text-center mb-4">
                Respect and kindness help everyone feel welcome. You made the right choice!
              </p>
            ) : (
              <p className="text-red-400 text-center mb-4">
                Think again — everyone deserves respect, even if they’re different.
              </p>
            )}

            {feedbackData.isCorrect ? (
              <button
                onClick={handleNextStory}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Story →
              </button>
            ) : (
              <button
                onClick={() => setShowFeedback(false)}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* FINAL SCREEN */}
        {showFeedback && isLastStory && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="text-6xl mb-4">🌈</div>
            <h2 className="text-3xl font-bold text-white mb-4">You Did It!</h2>
            <p className="text-white text-lg mb-6">
              You respected differences and made kind choices in every story. Well done!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              You earned {coins} Coins! 🪙
            </p>
            <button
              onClick={handleNextGame}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Game →
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StoryOfDifference;
