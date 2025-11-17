import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CandyDilemmaStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Extra Candy in Bag",
      emoji: "🍬",
      situation: "You find extra candy in your bag. What should you do?",
      choices: [
        { id: 1, text: "Keep it secretly", emoji: "😏", isCorrect: false },
        { id: 2, text: "Return it to the teacher/shopkeeper", emoji: "🙋", isCorrect: true },
      ],
    },
    {
      id: 2,
      title: "Found Candy on Floor",
      emoji: "🍭",
      situation: "You see candy on the classroom floor. Do you eat it or return it?",
      choices: [
        { id: 1, text: "Eat it immediately", emoji: "😋", isCorrect: false },
        { id: 2, text: "Give it back to the teacher", emoji: "🙌", isCorrect: true },
      ],
    },
    {
      id: 3,
      title: "Candy Given by Friend",
      emoji: "🍫",
      situation: "A friend accidentally gives you extra candy. What do you do?",
      choices: [
        { id: 1, text: "Keep it quietly", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Return it politely", emoji: "🫱", isCorrect: true },
      ],
    },
    {
      id: 4,
      title: "Extra Candy at Party",
      emoji: "🍪",
      situation: "You got extra candy at a party. Should you keep or return?",
      choices: [
        { id: 1, text: "Keep it", emoji: "😎", isCorrect: false },
        { id: 2, text: "Return to the host", emoji: "🙋‍♂️", isCorrect: true },
      ],
    },
    {
      id: 5,
      title: "Candy from Store Mistake",
      emoji: "🍩",
      situation: "The store gives you extra candy by mistake. What is right?",
      choices: [
        { id: 1, text: "Keep it without telling", emoji: "😏", isCorrect: false },
        { id: 2, text: "Return it to the shopkeeper", emoji: "🛎️", isCorrect: true },
      ],
    },
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = stories[currentStoryIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/kids/quiz-right-choice");
    }
  };

  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Candy Dilemma Story"
      subtitle={`Doing the Honest Thing — Story ${currentStoryIndex + 1} of ${stories.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={false}
      score={coins}
      gameId="moral-kids-91"
      gameType="educational"
      totalLevels={100}
      currentLevel={91}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
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

            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentStory.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "🌟 Honest Hero!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white">
                    Excellent! Returning candy is the honest choice. Honesty matters more
                    than keeping extra treats!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-4">+5 Coins 🪙</p>

                {/* ✅ Next Story Button */}
                <button
                  onClick={handleNext}
                  className="mt-2 w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentStoryIndex < stories.length - 1 ? "Next Story →" : "Finish Game 🎯"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Keeping candy that isn't yours is wrong. Always do the honest thing and
                    return it!
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

export default CandyDilemmaStory;
