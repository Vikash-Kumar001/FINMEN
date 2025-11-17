import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NameCallingStory = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Mean Words at School",
      emoji: "🏫",
      situation: "A classmate calls you silly in front of others. What should you do?",
      choices: [
        { id: 1, text: "Shout back louder", emoji: "😡", isCorrect: false },
        { id: 2, text: "Ignore and stay calm", emoji: "😌", isCorrect: true },
        { id: 3, text: "Tell everyone they're mean", emoji: "🗣️", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Playground Teasing",
      emoji: "🏀",
      situation: "Someone laughs and calls you slow while playing. What should you do?",
      choices: [
        { id: 1, text: "Ignore and keep playing happily", emoji: "🙂", isCorrect: true },
        { id: 2, text: "Push them", emoji: "🤜", isCorrect: false },
        { id: 3, text: "Cry and leave the game", emoji: "😢", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Online Comment",
      emoji: "💻",
      situation: "Someone writes a rude comment about you online. What’s the best action?",
      choices: [
        { id: 1, text: "Reply with mean words", emoji: "😠", isCorrect: false },
        { id: 2, text: "Ignore and report calmly", emoji: "🧘", isCorrect: true },
        { id: 3, text: "Tell your friends to attack them", emoji: "👥", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Friend's Joke",
      emoji: "👫",
      situation: "Your friend jokes and calls you lazy. What should you do?",
      choices: [
        { id: 1, text: "Laugh it off and stay friendly", emoji: "😄", isCorrect: true },
        { id: 2, text: "Stop talking to them", emoji: "🙅", isCorrect: false },
        { id: 3, text: "Call them a bad name back", emoji: "😤", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Bus Ride Bully",
      emoji: "🚌",
      situation: "A kid on the bus calls you names every day. What should you do?",
      choices: [
        { id: 1, text: "Ignore and tell an adult or teacher", emoji: "👩‍🏫", isCorrect: true },
        { id: 2, text: "Hit them next time", emoji: "👊", isCorrect: false },
        { id: 3, text: "Start calling them names too", emoji: "😏", isCorrect: false },
      ],
    },
  ];

  const currentStory = stories[currentIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (!choice) return;

    setShowFeedback(true);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 1);
      setFeedbackMessage("✅ Correct! Staying calm shows strength.");
    } else {
      setFeedbackMessage("❌ Not quite! Try to stay calm next time.");
    }

    // Automatically go to next question after 1.5 seconds
    setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedChoice(null);
        setShowFeedback(false);
        resetFeedback();
      }
    }, 1500);
  };

  const handleGameComplete = () => {
    navigate("/student/moral-values/kids/reflex-stop-fight");
  };

  const gameComplete = currentIndex === stories.length - 1 && showFeedback;

  return (
    <GameShell
      title="Name Calling Story"
      subtitle="Learning to Stay Calm and Kind"
      onNext={handleGameComplete}
      nextEnabled={gameComplete && coins >= 3}
      showGameOver={gameComplete && coins >= 3}
      score={coins}
      gameId="moral-kids-88"
      gameType="educational"
      totalLevels={100}
      currentLevel={88}
      showConfetti={gameComplete && coins >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStory.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
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
        ) : gameComplete ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">💬</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Calm and Strong! 💪
            </h2>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                You stayed calm in all tough situations. Ignoring name-calling
                and responding with kindness makes you emotionally strong.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
          </div>
        ) : (
          <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
            <p className="text-xl text-white">{feedbackMessage}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NameCallingStory;
