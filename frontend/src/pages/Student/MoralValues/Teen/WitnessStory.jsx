import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WitnessStory = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Cheating in Exam",
      emoji: "📝",
      situation: "You see a student copying during a test. What do you do?",
      choices: [
        { id: 1, text: "Ignore it and focus on your paper", emoji: "😶", isCorrect: false },
        { id: 2, text: "Quietly inform the teacher later", emoji: "📢", isCorrect: true },
        { id: 3, text: "Join them and cheat too", emoji: "😬", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Lost Wallet",
      emoji: "👛",
      situation: "You find a wallet on the ground. What do you do?",
      choices: [
        { id: 1, text: "Keep it for yourself", emoji: "💸", isCorrect: false },
        { id: 2, text: "Give it to a teacher or office", emoji: "🏫", isCorrect: true },
        { id: 3, text: "Ask your friends if they want it", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Team Project",
      emoji: "🤝",
      situation: "Your team forgot to add one member’s name in the project. What do you do?",
      choices: [
        { id: 1, text: "Say nothing—it’s already submitted", emoji: "😐", isCorrect: false },
        { id: 2, text: "Tell the teacher to correct it", emoji: "🗣️", isCorrect: true },
        { id: 3, text: "Tell the student it’s their fault", emoji: "🙄", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Lunch Line",
      emoji: "🍱",
      situation: "A smaller student is pushed out of the lunch line. What do you do?",
      choices: [
        { id: 1, text: "Take your food and ignore", emoji: "😶", isCorrect: false },
        { id: 2, text: "Help them get their place back", emoji: "🧍‍♀️", isCorrect: true },
        { id: 3, text: "Laugh along with the others", emoji: "😂", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Exam Paper Swap",
      emoji: "📚",
      situation: "A friend asks to swap your exam paper to copy answers. What do you do?",
      choices: [
        { id: 1, text: "Agree to help them", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Refuse politely and stay honest", emoji: "💬", isCorrect: true },
        { id: 3, text: "Ignore the rule—it’s just one exam", emoji: "😅", isCorrect: false }
      ]
    }
  ];

  const currentStory = stories[currentIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
      showCorrectAnswerFeedback(5, true);
    }
  };

  const handleFinish = () => {
    navigate("/games/moral-values/teens/courage-quiz1");
  };

  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Witness Story"
      subtitle="Standing Up for Justice"
      onNext={handleFinish}
      nextEnabled={currentIndex === stories.length - 1 && showFeedback}
      showGameOver={currentIndex === stories.length - 1 && showFeedback}
      score={coins * 1}
      gameId="moral-teen-51"
      gameType="moral"
      totalLevels={100}
      currentLevel={51}
      showConfetti={currentIndex === stories.length - 1 && showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-yellow-500/20 rounded-lg p-5 mb-6">
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
                      ? "bg-orange-500/50 border-orange-400 ring-2 ring-white"
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
                  ? "bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "⚖️ Fair Decision!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great choice! Standing up for fairness and doing what's right takes courage and honesty.
                    You’ve shown real moral strength today!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned +1 Justice Point ⚖️
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That action doesn’t promote fairness or honesty. Try again — justice means standing up for the truth!
                  </p>
                </div>
                <button
                  onClick={handleNextStory}
                  className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Story
                </button>
              </>
            )}

            {selectedChoiceData?.isCorrect && (
              <button
                onClick={handleNextStory}
                className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default WitnessStory;
