import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmpathyStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "New Student",
      emoji: "👩‍🎓",
      situation: "A new student feels lonely in the classroom. Do you invite them to join your group?",
      choices: [
        { id: 1, text: "Ignore them", emoji: "😐", isCorrect: false },
        { id: 2, text: "Invite them to join your group", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Tell them to sit elsewhere", emoji: "🚶", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Lunch Table",
      emoji: "🍽️",
      situation: "You notice a student eating alone at lunch. What do you do?",
      choices: [
        { id: 1, text: "Invite them to sit with you", emoji: "🥗", isCorrect: true },
        { id: 2, text: "Keep to your friends", emoji: "😎", isCorrect: false },
        { id: 3, text: "Make fun of them", emoji: "😈", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Class Project",
      emoji: "📚",
      situation: "A new student struggles with a project. How do you respond?",
      choices: [
        { id: 1, text: "Offer to help them", emoji: "📝", isCorrect: true },
        { id: 2, text: "Ignore their struggle", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Tell them they’re slow", emoji: "😠", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Playground Friend",
      emoji: "🏀",
      situation: "A student is standing alone at recess. What do you do?",
      choices: [
        { id: 1, text: "Invite them to play", emoji: "🤾", isCorrect: true },
        { id: 2, text: "Go play with your usual friends", emoji: "😎", isCorrect: false },
        { id: 3, text: "Ignore them", emoji: "😐", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Team Activity",
      emoji: "⚽",
      situation: "During team activity, a student is left out. How do you act?",
      choices: [
        { id: 1, text: "Include them in your team", emoji: "🎉", isCorrect: true },
        { id: 2, text: "Let them find a team alone", emoji: "😕", isCorrect: false },
        { id: 3, text: "Make fun of them", emoji: "😈", isCorrect: false },
      ],
    },
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = stories[currentStoryIndex];
  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const story = stories[currentStoryIndex];
    const choice = story.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/quiz-feelings");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Empathy Story"
      subtitle={`Show Kindness & Empathy (${currentStoryIndex + 1}/5)`}
      score={coins}
      gameId={`moral-teen-21`}
      gameType="moral"
      totalLevels={100}
      currentLevel={21}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          // 🔹 Question Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStory.title}
            </h2>
            <div className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentStory.situation}</p>
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
        ) : (
          // 🔹 Feedback Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "🌟 Empathy Hero!" : "Think Again..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <>
                <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>
                <p className="text-yellow-400 text-2xl font-bold mb-6">
                  You earned 5 Coins! 🪙
                </p>

                {/* ✅ Added Next Question Button */}
                <button
                  onClick={handleNext}
                  className="mt-2 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentStoryIndex < stories.length - 1 ? "Next Question ➡️" : "Finish Game 🎯"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Ignoring or avoiding someone in need shows a lack of empathy. True kindness
                    includes everyone.
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmpathyStory;
