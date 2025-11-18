import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LostBallStory = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Found a Classmate's Ball",
      emoji: "⚽",
      situation: "You find a classmate’s ball in the playground. What should you do?",
      choices: [
        { id: 1, text: "Keep it for yourself", emoji: "😏", isCorrect: false },
        { id: 2, text: "Return it to your classmate", emoji: "🙋", isCorrect: true }
      ]
    },
    {
      id: 2,
      title: "Lost Pencil Case",
      emoji: "✏️",
      situation: "You see a pencil case on the bench that isn’t yours. What do you do?",
      choices: [
        { id: 1, text: "Take it home", emoji: "😈", isCorrect: false },
        { id: 2, text: "Give it to the teacher to return", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Forgotten Jacket",
      emoji: "🧥",
      situation: "Someone forgot their jacket in the classroom. How should you act?",
      choices: [
        { id: 1, text: "Wear it yourself", emoji: "😎", isCorrect: false },
        { id: 2, text: "Give it to lost and found", emoji: "🙌", isCorrect: true }
      ]
    },
    {
      id: 4,
      title: "Missing Notebook",
      emoji: "📓",
      situation: "A classmate left their notebook on the desk. What do you do?",
      choices: [
        { id: 1, text: "Hide it", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Return it to them politely", emoji: "💌", isCorrect: true }
      ]
    },
    {
      id: 5,
      title: "Lost Lunchbox",
      emoji: "🍱",
      situation: "You find someone’s lunchbox outside. How should you respond?",
      choices: [
        { id: 1, text: "Eat it secretly", emoji: "😋", isCorrect: false },
        { id: 2, text: "Return it to the owner", emoji: "🖐️", isCorrect: true }
      ]
    }
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const story = stories[currentStoryIndex];
    const choice = story.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      navigate("/student/moral-values/kids/reflex-help-fast"); // Replace with actual next route
    }
  };

  const currentStory = stories[currentStoryIndex];
  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Lost Ball Story"
      subtitle="Being Honest and Responsible"
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={currentStoryIndex === stories.length - 1 && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId="moral-kids-28"
      gameType="educational"
      totalLevels={100}
      currentLevel={28}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
            <div className="space-y-3 mb-6">
              {currentStory.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌟 Honest Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Perfect! Returning lost items shows honesty and responsibility. Always do the right thing!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That’s not the right choice. Remember, returning lost items is honest and kind.
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

            {selectedChoiceData?.isCorrect && (
              <button
                onClick={handleNext}
                className="mt-4 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
              >
                Next Story
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LostBallStory;
