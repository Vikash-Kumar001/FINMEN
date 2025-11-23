import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundFightStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "The Playground Fight",
      emoji: "⚽",
      situation: "Two friends fight over a ball. What should you do?",
      choices: [
        { id: 1, text: "Calm them and share the ball", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Join the fight", emoji: "👊", isCorrect: false },
        { id: 3, text: "Walk away ignoring them", emoji: "🚶", isCorrect: false },
      ],
      feedback:
        "Well done! Calming friends and sharing shows responsibility and peacekeeping. Fighting never solves problems.",
    },
    {
      id: 2,
      title: "The Broken Toy",
      emoji: "🧸",
      situation: "Your friend breaks your toy by mistake. What should you do?",
      choices: [
        { id: 1, text: "Forgive them kindly", emoji: "💖", isCorrect: true },
        { id: 2, text: "Shout and scold them", emoji: "😠", isCorrect: false },
        { id: 3, text: "Stop talking to them", emoji: "🙅", isCorrect: false },
      ],
      feedback:
        "You made the right choice! Forgiving shows emotional strength and helps maintain friendship.",
    },
    {
      id: 3,
      title: "The New Student",
      emoji: "🎒",
      situation: "A new student is sitting alone at lunch. What will you do?",
      choices: [
        { id: 1, text: "Invite them to sit with you", emoji: "😊", isCorrect: true },
        { id: 2, text: "Ignore them", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Laugh with friends", emoji: "😂", isCorrect: false },
      ],
      feedback:
        "Great! Inviting someone shows kindness and bravery to include others.",
    },
    {
      id: 4,
      title: "The Lost Pencil",
      emoji: "✏️",
      situation: "You find a pencil on the floor. What will you do?",
      choices: [
        { id: 1, text: "Ask whose pencil it is", emoji: "🙋", isCorrect: true },
        { id: 2, text: "Take it quietly", emoji: "🤫", isCorrect: false },
        { id: 3, text: "Ignore it", emoji: "🚶", isCorrect: false },
      ],
      feedback:
        "Perfect! Being honest even in small things shows integrity and fairness.",
    },
    {
      id: 5,
      title: "Sharing Snacks",
      emoji: "🍎",
      situation: "Your friend forgot their lunch. What will you do?",
      choices: [
        { id: 1, text: "Share your snacks with them", emoji: "🤗", isCorrect: true },
        { id: 2, text: "Eat secretly", emoji: "😋", isCorrect: false },
        { id: 3, text: "Tell them to bring next time", emoji: "🙃", isCorrect: false },
      ],
      feedback:
        "Awesome! Sharing food shows compassion and friendship — the mark of a responsible kid!",
    },
  ];

  const current = stories[currentStory];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    setShowFeedback(true);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, false);
      setCoins((prev) => prev + 1);
    }
  };

  const handleNextStory = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      resetFeedback();
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/quiz-peace");
  };

  const allDone = currentStory === stories.length - 1 && showFeedback;
  return (
    <GameShell
      title="Playground Fight Story"
      subtitle="Choose the Right Action in Each Story"
      onNext={handleNext}
      nextEnabled={allDone}
      showGameOver={allDone}
      score={totalCoins}
      gameId="moral-kids-81"
      gameType="educational"
      totalLevels={100}
      currentLevel={81}
      showConfetti={allDone}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>
            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "🌟 Great Job!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-4">+1 Coin Earned! 🪙</p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Try to make a kinder or fairer choice next time. You can do it!
                </p>
              </div>
            )}

            {currentStory < stories.length - 1 ? (
              <button
                onClick={handleNextStory}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Story ➜
              </button>
            ) : (
              <p className="text-green-400 text-xl font-bold mt-4">
                🎉 You completed all stories! Total: {totalCoins} Coins.
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlaygroundFightStory;
