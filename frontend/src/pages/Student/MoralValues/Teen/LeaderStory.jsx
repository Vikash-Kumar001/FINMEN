import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LeaderStory = () => {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Leader Eats First",
      emoji: "🍽️",
      situation: "A team leader eats before their team finishes the task. Is this good leadership?",
      choices: [
        { id: 1, text: "Yes, they deserve rest first", emoji: "😴", isCorrect: false },
        { id: 2, text: "No, a leader should wait and support the team", emoji: "🤝", isCorrect: true },
      ],
      feedback: "A good leader puts the team first. Waiting shows care, humility, and true leadership."
    },
    {
      id: 2,
      title: "Taking Credit",
      emoji: "🏆",
      situation: "Your class leader takes credit for an idea you gave. What’s the right action?",
      choices: [
        { id: 1, text: "Let it go silently", emoji: "😶", isCorrect: false },
        { id: 2, text: "Talk politely and remind them of teamwork", emoji: "💬", isCorrect: true },
      ],
      feedback: "True leaders share credit. They lift others up, not just themselves."
    },
    {
      id: 3,
      title: "Helping the Weak",
      emoji: "🫶",
      situation: "A team member struggles with their work. What should a leader do?",
      choices: [
        { id: 1, text: "Ignore it — everyone has to manage", emoji: "🙅", isCorrect: false },
        { id: 2, text: "Offer help and guide them patiently", emoji: "🤗", isCorrect: true },
      ],
      feedback: "Leadership means support. Helping others grow builds stronger teams."
    },
    {
      id: 4,
      title: "Fair Decision",
      emoji: "⚖️",
      situation: "Two teammates argue. The leader sides with their best friend. Is that right?",
      choices: [
        { id: 1, text: "Yes, friends deserve support", emoji: "👯", isCorrect: false },
        { id: 2, text: "No, leaders must stay fair to all", emoji: "⚖️", isCorrect: true },
      ],
      feedback: "A fair leader treats everyone equally, not based on friendship."
    },
    {
      id: 5,
      title: "Encouraging Others",
      emoji: "🎤",
      situation: "A shy team member doesn’t speak up. What should a leader do?",
      choices: [
        { id: 1, text: "Ignore them — they’ll talk later", emoji: "😐", isCorrect: false },
        { id: 2, text: "Encourage them gently to share ideas", emoji: "🌟", isCorrect: true },
      ],
      feedback: "Encouraging quiet voices makes everyone feel valued — that’s real leadership!"
    },
  ];

  const current = stories[currentStory];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setShowFeedback(true);
  };

  const handleNextStory = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();

    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
    } else {
      const totalCorrect = score + (stories[currentStory].choices.find(c => c.id === selectedChoice)?.isCorrect ? 1 : 0);
      const accuracy = (totalCorrect / stories.length) * 100;
      if (accuracy >= 70) setCoins(5);
      setScore(totalCorrect);
      setShowFeedback(true);
      setCurrentStory(stories.length); // mark as completed
    }
  };

  const handleRestart = () => {
    setCurrentStory(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/quiz-leadership");
  };

  const isLastStory = currentStory >= stories.length;

  return (
    <GameShell
      title="Leader Story"
      subtitle="Good vs Poor Leadership"
      onNext={handleNext}
      nextEnabled={isLastStory && coins > 0}
      showGameOver={isLastStory && coins > 0}
      score={coins}
      gameId="moral-teen-71"
      gameType="moral"
      totalLevels={100}
      currentLevel={71}
      showConfetti={isLastStory && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!isLastStory ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-8xl mb-4 text-center">{current.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
              <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
              </div>

              <h3 className="text-white font-bold mb-4">Choose the right action:</h3>

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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-7xl mb-4 text-center">
                {current.choices.find((c) => c.id === selectedChoice)?.emoji}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                {current.choices.find((c) => c.id === selectedChoice)?.isCorrect
                  ? "🌟 Great Leadership!"
                  : "🤔 Not Quite Right!"}
              </h2>
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">{current.feedback}</p>
              </div>
              <button
                onClick={handleNextStory}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Story →
              </button>
            </div>
          )
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              {coins > 0 ? "🏆 Leadership Star!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              You answered {score} out of {stories.length} correctly.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {coins > 0 ? "You earned 5 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            {coins === 0 && (
              <button
                onClick={handleRestart}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LeaderStory;
