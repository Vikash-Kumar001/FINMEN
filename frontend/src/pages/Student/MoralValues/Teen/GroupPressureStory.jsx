import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GroupPressureStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "New Student Teased",
      emoji: "😢",
      situation:
        "Your friends start teasing a new student who looks shy and nervous. What do you do?",
      choices: [
        { id: 1, text: "Join in the teasing", emoji: "😈", isCorrect: false },
        { id: 2, text: "Stay silent and watch", emoji: "😶", isCorrect: false },
        { id: 3, text: "Tell your friends to stop", emoji: "🛑", isCorrect: true },
      ],
      feedback:
        "Real courage means standing up for someone even if your friends don’t. You chose kindness and bravery!",
    },
    {
      id: 2,
      title: "Copying in Exam",
      emoji: "📝",
      situation:
        "A friend whispers during the test asking for your answers. What should you do?",
      choices: [
        { id: 1, text: "Help your friend cheat", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Ignore and focus on your paper", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Complain loudly in the class", emoji: "📢", isCorrect: false },
      ],
      feedback:
        "You made the right call! Staying honest under pressure keeps your integrity strong.",
    },
    {
      id: 3,
      title: "Group Decision",
      emoji: "🤝",
      situation:
        "Your group wants to skip cleaning duty, but you think it’s wrong. What will you do?",
      choices: [
        { id: 1, text: "Agree with them", emoji: "😬", isCorrect: false },
        { id: 2, text: "Remind them it’s everyone’s duty", emoji: "🧹", isCorrect: true },
        { id: 3, text: "Stay quiet", emoji: "😐", isCorrect: false },
      ],
      feedback:
        "You showed leadership! Reminding your group of their responsibility inspires others to do right.",
    },
    {
      id: 4,
      title: "Laughing at Mistake",
      emoji: "😂",
      situation:
        "A classmate makes a silly mistake while reading aloud, and your group laughs. What do you do?",
      choices: [
        { id: 1, text: "Laugh along with your friends", emoji: "😅", isCorrect: false },
        { id: 2, text: "Stay quiet and ignore", emoji: "😶", isCorrect: false },
        { id: 3, text: "Stop others and encourage your classmate", emoji: "💪", isCorrect: true },
      ],
      feedback:
        "Kindness shines brighter when others choose cruelty. You did the right thing by supporting your classmate.",
    },
    {
      id: 5,
      title: "Skipping Practice",
      emoji: "⚽",
      situation:
        "Your friends want to skip team practice to hang out, but the coach trusts you to show up. What do you do?",
      choices: [
        { id: 1, text: "Go with them and skip practice", emoji: "😎", isCorrect: false },
        { id: 2, text: "Show up and practice alone", emoji: "🏃‍♀️", isCorrect: true },
        { id: 3, text: "Make an excuse to the coach", emoji: "🙄", isCorrect: false },
      ],
      feedback:
        "Fantastic! Staying committed even when others don’t shows true responsibility and strength.",
    },
  ];

  const currentStory = stories[currentIndex];
  const selectedChoiceData = currentStory.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (!choice) return;

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowFeedback(false);
      setSelectedChoice(null);
    } else {
      // Game finished
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/teen/debate-fear-vs-courage");
  };

  const isGameOver = currentIndex === stories.length - 1 && showFeedback;

  return (
    <GameShell
      title="Group Pressure Story"
      subtitle="Stand Up for What’s Right"
      onNext={handleNextGame}
      nextEnabled={isGameOver}
      showGameOver={isGameOver}
      score={coins}
      gameId="moral-teen-55"
      gameType="moral"
      totalLevels={100}
      currentLevel={55}
      showConfetti={isGameOver}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!isGameOver ? (
          !showFeedback ? (
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

              <h3 className="text-white font-bold mb-4 text-center">
                What should you do?
              </h3>

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
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
              <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {selectedChoiceData.isCorrect
                  ? "🌟 You Chose Bravery!"
                  : "Think Again..."}
              </h2>
              <p className="text-white/90 text-lg mb-6">
                {selectedChoiceData.text}
              </p>

              {selectedChoiceData.isCorrect ? (
                <>
                  <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white text-center">
                      {currentStory.feedback}
                    </p>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    {currentIndex < stories.length - 1
                      ? "Next Story ➡️"
                      : "Finish Game 🎉"}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white text-center">
                      Standing up for what’s right takes courage. Try again and
                      show your true strength!
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
          )
        ) : (
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">🎉 Game Complete!</h2>
            <p className="text-xl mb-6">
              You completed all 5 stories and earned {coins} Coins! 🪙
            </p>
            <button
              onClick={handleNextGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition"
            >
              Next Game ➡️
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GroupPressureStory;
