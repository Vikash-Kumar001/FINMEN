import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HomeworkStoryy = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Homework Promise 1",
      emoji: "📖",
      situation: "You promised to finish your math homework. Do you do it or play instead?",
      choices: [
        { id: 1, text: "Play video games", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Finish your homework", emoji: "📝", isCorrect: true }
      ]
    },
    {
      id: 2,
      title: "Homework Promise 2",
      emoji: "📚",
      situation: "Your friend invites you to play outside but you have a homework due tomorrow. What do you do?",
      choices: [
        { id: 1, text: "Go play outside", emoji: "🏃‍♂️", isCorrect: false },
        { id: 2, text: "Complete your homework first", emoji: "📝", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Homework Promise 3",
      emoji: "✏️",
      situation: "You feel tired after school. Do you rest and delay homework or complete it now?",
      choices: [
        { id: 1, text: "Rest and delay homework", emoji: "😴", isCorrect: false },
        { id: 2, text: "Complete homework now", emoji: "📝", isCorrect: true }
      ]
    },
    {
      id: 4,
      title: "Homework Promise 4",
      emoji: "📓",
      situation: "You have homework for multiple subjects. Do you procrastinate or finish it one by one?",
      choices: [
        { id: 1, text: "Procrastinate", emoji: "⏰", isCorrect: false },
        { id: 2, text: "Finish one by one", emoji: "📝", isCorrect: true }
      ]
    },
    {
      id: 5,
      title: "Homework Promise 5",
      emoji: "🖍️",
      situation: "You’re tempted to watch TV instead of homework. What’s the right choice?",
      choices: [
        { id: 1, text: "Watch TV", emoji: "📺", isCorrect: false },
        { id: 2, text: "Do homework first", emoji: "📝", isCorrect: true }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const currentStory = stories[currentStoryIndex];
    const choice = currentStory.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/kids/quiz-responsibility");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const currentStory = stories[currentStoryIndex];
  const selectedChoiceData = selectedChoice
    ? currentStory.choices.find(c => c.id === selectedChoice)
    : null;

  return (
    <GameShell
      title="Homework Story"
      subtitle={`Being Responsible (${currentStoryIndex + 1}/5)`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={currentStoryIndex === stories.length - 1 && showFeedback}
      score={coins}
      gameId="moral-kids-31"
      gameType="educational"
      totalLevels={100}
      currentLevel={31}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map(choice => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌟 Responsible Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">You earned 5 Coins! 🪙</p>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Homework is important. Completing it responsibly helps you learn and stay on track!
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

            <button
              onClick={handleNext}
              className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoiceData?.isCorrect
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
              disabled={!selectedChoiceData?.isCorrect}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HomeworkStoryy;
