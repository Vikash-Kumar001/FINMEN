import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BullyStory2 = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Lunch Table",
      emoji: "🍱",
      situation: "A new student is eating lunch alone while others laugh. What do you do?",
      choices: [
        { id: 1, text: "Join them and laugh", emoji: "😏", isCorrect: false },
        { id: 2, text: "Invite the student to join you", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Ignore it", emoji: "😶", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Online Joke",
      emoji: "💻",
      situation: "Your friends post a mean meme about a classmate. You see it — what will you do?",
      choices: [
        { id: 1, text: "Like and share it", emoji: "😂", isCorrect: false },
        { id: 2, text: "Report and tell them it’s wrong", emoji: "⚠️", isCorrect: true },
        { id: 3, text: "Scroll away silently", emoji: "😶", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Playground Trouble",
      emoji: "🏀",
      situation: "A group pushes a smaller kid away from a basketball game. What’s right?",
      choices: [
        { id: 1, text: "Tell them to stop and let the kid play", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Watch quietly", emoji: "😐", isCorrect: false },
        { id: 3, text: "Join in the teasing", emoji: "😈", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Rumor Chain",
      emoji: "📱",
      situation: "You hear a false rumor about a classmate. Your friend asks you to pass it on.",
      choices: [
        { id: 1, text: "Refuse and defend the classmate", emoji: "🛡️", isCorrect: true },
        { id: 2, text: "Share it quietly", emoji: "📩", isCorrect: false },
        { id: 3, text: "Say nothing but don’t stop it", emoji: "🤐", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Stand Up Moment",
      emoji: "💪",
      situation: "Your best friend bullies another student. What’s the right move?",
      choices: [
        { id: 1, text: "Laugh to stay friends", emoji: "😬", isCorrect: false },
        { id: 2, text: "Tell them it’s wrong and stop it", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Walk away silently", emoji: "😶", isCorrect: false },
      ],
    },
  ];

  const current = stories[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setScore((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      const totalCoins = score === stories.length ? 5 : Math.max(2, score);
      setCoins(totalCoins);
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/debate-equal-vs-fair");
  };

  return (
    <GameShell
      title="Bully Story 2"
      subtitle="Stand Up Against Bullying"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0 && currentQuestion === stories.length - 1}
      showGameOver={showFeedback && coins > 0 && currentQuestion === stories.length - 1}
      score={coins}
      gameId="moral-teen-45"
      gameType="moral"
      totalLevels={100}
      currentLevel={45}
      showConfetti={showFeedback && coins > 0 && currentQuestion === stories.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {/* STEP 1 — Question View */}
        {!showFeedback && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>

            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {current.situation}
              </p>
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
        )}

        {/* STEP 2 — Feedback View */}
        {showFeedback && currentQuestion < stories.length && coins === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "👏 Brave Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-green-400 font-semibold mb-4">
                That’s right! Standing up for others shows courage and fairness.
              </p>
            ) : (
              <p className="text-red-400 font-semibold mb-4">
                Ignoring or joining makes bullying worse. Speak up next time!
              </p>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Story
            </button>
          </div>
        )}

        {/* STEP 3 — Final Result */}
        {showFeedback && currentQuestion === stories.length - 1 && coins > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">💪</div>
            <h2 className="text-3xl font-bold text-white mb-4">You Stood for Kindness!</h2>
            <p className="text-white/90 text-lg mb-6">
              You completed all 5 bullying situations and chose empathy, courage, and fairness.
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white">
                Always stand by the victim. Silence supports the bully. Courage creates a safer
                world.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold">You earned {coins} Coins! 🪙</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BullyStory2;
