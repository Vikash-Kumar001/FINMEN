import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartSpeakerStory = () => {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      emoji: "🔊",
      title: "Smart Speaker Responds",
      situation: 'You say "Play music." The smart speaker plays music. How did it do this?',
      choices: [
        { id: 1, text: "Magic", emoji: "🪄", isCorrect: false },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: true },
      ],
      feedback:
        "Smart speakers use AI speech recognition to understand your voice and play music — not magic!",
    },
    {
      emoji: "💡",
      title: "Smart Lights",
      situation:
        'You say "Turn off the lights," and your room lights switch off automatically. How did that happen?',
      choices: [
        { id: 1, text: "Magic", emoji: "🪄", isCorrect: false },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: true },
      ],
      feedback:
        "Smart home systems use AI and IoT to follow your voice commands — not spells!",
    },
    {
      emoji: "🧠",
      title: "Smart Assistant Answers",
      situation:
        'You ask your smart assistant, "What’s the weather today?" It answers instantly. How does it know?',
      choices: [
        { id: 1, text: "Magic", emoji: "🪄", isCorrect: false },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: true },
      ],
      feedback:
        "AI connects to the internet to fetch real-time weather updates. It’s smart tech, not wizardry!",
    },
    {
      emoji: "🛍️",
      title: "Smart Shopping Suggestion",
      situation:
        'You say "I need new shoes," and your phone shows shoe ads. How did it guess that?',
      choices: [
        { id: 1, text: "Magic", emoji: "🪄", isCorrect: false },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: true },
      ],
      feedback:
        "AI tracks your interests and suggests products. That’s data-driven intelligence, not magic!",
    },
    {
      emoji: "🚗",
      title: "Smart Car Speaks",
      situation:
        'Your car says, "Low fuel detected. Nearest station ahead." How did it know?',
      choices: [
        { id: 1, text: "Magic", emoji: "🪄", isCorrect: false },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: true },
      ],
      feedback:
        "AI-powered systems in cars detect and respond to fuel levels and GPS data — no spells needed!",
    },
  ];

  const current = stories[currentStory];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setTotalCoins(totalCoins + 10);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/ai-doctor-simulation");
    }
  };

  return (
    <GameShell
      title="Smart Speaker Story"
      subtitle="AI in Everyday Life"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentStory === stories.length - 1 && showFeedback}
      score={totalCoins}
      gameId="ai-kids-34"
      gameType="ai"
      totalLevels={100}
      currentLevel={34}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What made this happen?</h3>

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
              {selectedChoiceData.isCorrect ? "🎵 Smart Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{current.feedback}</p>
            </div>

            {selectedChoiceData.isCorrect && (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                +10 Coins 🪙 (Total: {totalCoins})
              </p>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentStory < stories.length - 1 ? "Next Story →" : "Finish Quiz 🎉"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartSpeakerStory;
