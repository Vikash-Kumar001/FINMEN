import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectEldersStory = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Grandpa Needs Help",
      emoji: "👴",
      situation: "Your grandpa asks for help carrying groceries. What do you do?",
      choices: [
        { id: 1, text: "Keep playing and ignore him", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Help grandpa right away", emoji: "💪", isCorrect: true },
        { id: 3, text: "Say you'll help later", emoji: "⏰", isCorrect: false },
      ],
      correctMsg:
        "Perfect! Helping our elders right away shows respect and care. They have done so much for us, and helping them when they need us is important!",
    },
    {
      id: 2,
      title: "Grandma Calls You",
      emoji: "👵",
      situation: "Grandma calls you while you’re watching TV. What will you do?",
      choices: [
        { id: 1, text: "Pretend you didn’t hear", emoji: "🙉", isCorrect: false },
        { id: 2, text: "Answer and ask how you can help", emoji: "📞", isCorrect: true },
        { id: 3, text: "Say you’re busy and continue watching", emoji: "📺", isCorrect: false },
      ],
      correctMsg:
        "Well done! Responding when elders call you shows respect and love.",
    },
    {
      id: 3,
      title: "Helping Grandma Cross the Road",
      emoji: "🚶‍♀️",
      situation: "You see your grandma crossing the road with heavy bags. What will you do?",
      choices: [
        { id: 1, text: "Offer to carry her bags and walk with her", emoji: "👜", isCorrect: true },
        { id: 2, text: "Just wave from far", emoji: "👋", isCorrect: false },
        { id: 3, text: "Wait till she finishes", emoji: "⏳", isCorrect: false },
      ],
      correctMsg:
        "Wonderful! Helping elders cross safely shows kindness and respect.",
    },
    {
      id: 4,
      title: "Grandpa Shares a Story",
      emoji: "📖",
      situation: "Grandpa starts telling an old story, but your phone rings. What will you do?",
      choices: [
        { id: 1, text: "Listen to grandpa first", emoji: "👂", isCorrect: true },
        { id: 2, text: "Answer your phone", emoji: "📱", isCorrect: false },
        { id: 3, text: "Walk away quietly", emoji: "🚶", isCorrect: false },
      ],
      correctMsg:
        "Perfect! Listening to elders’ stories helps you learn wisdom and shows you value them.",
    },
    {
      id: 5,
      title: "Respecting Elder’s Advice",
      emoji: "🧓",
      situation: "Your elder tells you not to be rude online. What do you do?",
      choices: [
        { id: 1, text: "Ignore them and continue being rude", emoji: "😠", isCorrect: false },
        { id: 2, text: "Say thank you and follow their advice", emoji: "🙏", isCorrect: true },
        { id: 3, text: "Complain they’re old-fashioned", emoji: "😒", isCorrect: false },
      ],
      correctMsg:
        "That’s right! Elders guide us to be kind and responsible. Listening makes us wiser!",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  const currentStory = stories[currentIndex];
  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (choice?.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
    setCurrentIndex((prev) => prev + 1);
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/polite-words-quiz2");
  };

  const allQuestionsDone = currentIndex === stories.length;

  return (
    <GameShell
      title="Respect Elders Story"
      subtitle="Helping Our Elders"
      onNext={handleNextGame}
      nextEnabled={allQuestionsDone}
      showGameOver={allQuestionsDone}
      score={totalCoins}
      gameId="moral-kids-11"
      gameType="educational"
      totalLevels={20}
      currentLevel={11}
      showConfetti={allQuestionsDone}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <>
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
                      <div className="text-white font-semibold text-lg">
                        {choice.text}
                      </div>
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

            <div className="text-center text-white/80 text-sm">
              Question {currentIndex + 1} of {stories.length} | Total Coins: {totalCoins} 🪙
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect
                ? "🌟 Respectful Kid!"
                : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.text}
            </p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {currentStory.correctMsg}
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Not quite! Try again to learn the right way to respect elders.
                </p>
              </div>
            )}

            <button
              onClick={() =>
                selectedChoiceData.isCorrect
                  ? handleNextQuestion()
                  : handleNextQuestion()
              }
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentIndex + 1 < stories.length
                ? "Next Question →"
                : "Finish Quiz"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RespectEldersStory;
