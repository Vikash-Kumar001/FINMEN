import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundRespectStory = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      title: "Join Our Game",
      emoji: "🏃",
      situation: "A smaller child asks to join your game on the playground. What do you do?",
      choices: [
        { id: 1, text: "Say no - they're too small", emoji: "🙅", isCorrect: false },
        { id: 2, text: "Allow them to join and play together", emoji: "🤗", isCorrect: true },
        { id: 3, text: "Ignore them and keep playing", emoji: "😐", isCorrect: false },
      ],
    },
    {
      title: "Sharing the Swing",
      emoji: "🏖️",
      situation: "You’ve been on the swing for a long time and another kid is waiting. What’s fair?",
      choices: [
        { id: 1, text: "Keep swinging, I got here first", emoji: "😤", isCorrect: false },
        { id: 2, text: "Let them have a turn", emoji: "😊", isCorrect: true },
        { id: 3, text: "Ignore them and swing higher", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      title: "Helping a Friend",
      emoji: "🧩",
      situation: "A friend falls while running. What should you do?",
      choices: [
        { id: 1, text: "Laugh and keep running", emoji: "😂", isCorrect: false },
        { id: 2, text: "Help them get up and ask if they're okay", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Tell others to look", emoji: "📣", isCorrect: false },
      ],
    },
    {
      title: "New Team Member",
      emoji: "⚽",
      situation: "A new student joins your team. They seem nervous. What’s kind?",
      choices: [
        { id: 1, text: "Ignore them since they’re new", emoji: "😐", isCorrect: false },
        { id: 2, text: "Smile, introduce yourself, and include them", emoji: "😄", isCorrect: true },
        { id: 3, text: "Only talk to your old friends", emoji: "🙄", isCorrect: false },
      ],
    },
    {
      title: "Playground Clean-Up",
      emoji: "🧹",
      situation: "After playtime, there’s trash around the playground. What’s right?",
      choices: [
        { id: 1, text: "Leave it; not my problem", emoji: "😶", isCorrect: false },
        { id: 2, text: "Pick it up and keep the area clean", emoji: "🌿", isCorrect: true },
        { id: 3, text: "Blame others and walk away", emoji: "🙈", isCorrect: false },
      ],
    },
  ];

  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const story = stories[currentStory];
  const selectedChoiceData = story.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    const choice = story.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
      setCurrentStory(stories.length);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/reflex-help");
  };

  return (
    <GameShell
      title="Playground Respect Story"
      subtitle="Including Everyone"
      onNext={handleNextGame}
      nextEnabled={currentStory === stories.length && coins > 0}
      showGameOver={currentStory === stories.length && coins > 0}
      score={coins}
      gameId="moral-kids-18"
      gameType="educational"
      totalLevels={20}
      currentLevel={18}
      showConfetti={currentStory === stories.length && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {currentStory < stories.length ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-8xl mb-4 text-center">{story.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {story.title} ({currentStory + 1}/5)
              </h2>
              <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  {story.situation}
                </p>
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-7xl mb-4 text-center">
                {selectedChoiceData?.emoji}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                {selectedChoiceData?.isCorrect
                  ? "💖 Great Choice!"
                  : "Think Again..."}
              </h2>
              <p className="text-white/90 text-lg mb-6 text-center">
                {selectedChoiceData?.text}
              </p>

              {selectedChoiceData?.isCorrect ? (
                <>
                  <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white text-center">
                      {story.feedback ||
                        "Awesome! You made the respectful and kind choice!"}
                    </p>
                  </div>
                  <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                    +5 Coins 🪙
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
                  >
                    {currentStory < stories.length - 1
                      ? "Next Question"
                      : "Finish Game"}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white text-center">
                      {selectedChoice === 1
                        ? "Everyone can play, no matter their size!"
                        : "Try to include others and act kindly!"}
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Playground Respect Master!
            </h2>
            <p className="text-white mb-6">
              You completed all 5 playground kindness questions.
            </p>
            <p className="text-yellow-400 text-2xl font-bold">
              Total Coins: {coins} 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlaygroundRespectStory;
