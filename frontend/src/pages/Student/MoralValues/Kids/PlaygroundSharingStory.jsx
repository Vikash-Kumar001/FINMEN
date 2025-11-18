import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundSharingStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const prompts = [
    {
      title: "Sharing the Ball",
      emoji: "⚽",
      situation: "You have one ball and many kids want to play. Do you share turns?",
      choices: [
        { id: 1, text: "No, keep it for yourself", emoji: "🙅", isCorrect: false },
        { id: 2, text: "Yes, let everyone take turns", emoji: "🤝", isCorrect: true }
      ]
    },
    {
      title: "Swing Time",
      emoji: "🎠",
      situation: "There are limited swings. Do you wait and share?",
      choices: [
        { id: 1, text: "Take all the swings", emoji: "🙃", isCorrect: false },
        { id: 2, text: "Share with others patiently", emoji: "👍", isCorrect: true }
      ]
    },
    {
      title: "Slide Fun",
      emoji: "🛝",
      situation: "Only one slide is free. What should you do?",
      choices: [
        { id: 1, text: "Go multiple times without letting others", emoji: "😎", isCorrect: false },
        { id: 2, text: "Wait for your turn and let others slide too", emoji: "🙂", isCorrect: true }
      ]
    },
    {
      title: "Sandpit Sharing",
      emoji: "🏖️",
      situation: "You have all the sand toys. How do you play?",
      choices: [
        { id: 1, text: "Keep toys only for yourself", emoji: "😡", isCorrect: false },
        { id: 2, text: "Share toys so everyone can play", emoji: "🌟", isCorrect: true }
      ]
    },
    {
      title: "Team Tug-of-War",
      emoji: "🤼",
      situation: "Only some kids can play first. What do you do?",
      choices: [
        { id: 1, text: "Play repeatedly without breaks", emoji: "🙄", isCorrect: false },
        { id: 2, text: "Take turns fairly with everyone", emoji: "✌️", isCorrect: true }
      ]
    }
  ];

  const currentPrompt = prompts[currentPromptIndex];
  const selectedChoiceData = currentPrompt.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    const choice = currentPrompt.choices.find((c) => c.id === selectedChoice);
    setShowFeedback(true);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);

      // Auto-next after short delay
      setTimeout(() => {
        if (currentPromptIndex < prompts.length - 1) {
          setCurrentPromptIndex((prev) => prev + 1);
          setSelectedChoice(null);
          setShowFeedback(false);
          resetFeedback();
        } else {
          navigate("/student/moral-values/kids/reflex-cooperation"); // next game
        }
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Playground Sharing Story"
      subtitle="Learning to Share"
      onNext={() => {}}
      nextEnabled={false}
      showGameOver={false}
      score={coins}
      gameId="moral-kids-68"
      gameType="educational"
      totalLevels={100}
      currentLevel={68}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentPrompt.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentPrompt.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentPrompt.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentPrompt.choices.map((choice) => (
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
              {selectedChoiceData.isCorrect ? "🌟 Great Sharing!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Excellent! Sharing helps everyone enjoy together. Get ready for the next question!
                </p>
              </div>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Remember: Taking turns and sharing makes everyone happy and fair. Try again!
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

export default PlaygroundSharingStory;
