import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ServiceStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      title: "Dropped Money",
      emoji: "💵",
      situation:
        "The bus conductor accidentally drops money while collecting fares. No one notices except you. What do you do?",
      choices: [
        { id: 1, text: "Keep it quietly", emoji: "😏", isCorrect: false },
        { id: 2, text: "Return it to the conductor immediately", emoji: "🙋", isCorrect: true },
        { id: 3, text: "Leave it on the floor", emoji: "👀", isCorrect: false },
      ],
    },
    {
      title: "Old Lady’s Bag",
      emoji: "👜",
      situation:
        "An elderly woman struggles to carry her grocery bag up the stairs. What would you do?",
      choices: [
        { id: 1, text: "Offer to help her carry it", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Just walk past silently", emoji: "🚶‍♀️", isCorrect: false },
        { id: 3, text: "Laugh and walk away", emoji: "😅", isCorrect: false },
      ],
    },
    {
      title: "Library Cleanup",
      emoji: "📚",
      situation:
        "You see books scattered all over a library table after a student leaves. What do you do?",
      choices: [
        { id: 1, text: "Leave them as is", emoji: "😐", isCorrect: false },
        { id: 2, text: "Help arrange the books properly", emoji: "📖", isCorrect: true },
        { id: 3, text: "Tell the librarian and walk away", emoji: "👩‍🏫", isCorrect: false },
      ],
    },
    {
      title: "Lost Wallet",
      emoji: "👛",
      situation:
        "You find a wallet on a park bench with money and an ID card. What should you do?",
      choices: [
        { id: 1, text: "Keep the money and throw the wallet", emoji: "💸", isCorrect: false },
        { id: 2, text: "Return it to the owner or nearest police", emoji: "🫡", isCorrect: true },
        { id: 3, text: "Ignore it completely", emoji: "😶", isCorrect: false },
      ],
    },
    {
      title: "Classroom Spill",
      emoji: "🧃",
      situation:
        "A classmate accidentally spills juice on the floor. The teacher hasn’t noticed. What do you do?",
      choices: [
        { id: 1, text: "Complain to the teacher", emoji: "🙄", isCorrect: false },
        { id: 2, text: "Help clean up the mess", emoji: "🧹", isCorrect: true },
        { id: 3, text: "Step away and ignore", emoji: "😬", isCorrect: false },
      ],
    },
  ];

  const story = stories[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = story.choices.find((c) => c.id === selectedChoice);

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

  const handleNextQuestion = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
    }
  };

  const handleGameComplete = () => {
    navigate("/student/moral-values/teen/respect-journal");
  };

  const selectedChoiceData = story.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Service Story"
      subtitle="Acts of Honesty and Helpfulness"
      onNext={handleGameComplete}
      nextEnabled={showFeedback && currentQuestion === stories.length - 1}
      showGameOver={showFeedback && currentQuestion === stories.length - 1}
      score={coins}
      gameId="moral-teen-15"
      gameType="moral"
      totalLevels={20}
      currentLevel={15}
      showConfetti={showFeedback && currentQuestion === stories.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {story.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {story.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">
              What should you do?
            </h3>

            <div className="space-y-3 mb-6">
              {story.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData?.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect
                ? "💪 Great Act of Service!"
                : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData?.text}
            </p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Well done! Acts of honesty and kindness create a better
                    world. Keep showing empathy and doing small helpful deeds
                    that make a big difference!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +5 Coins Earned 🪙
                </p>
                {currentQuestion < stories.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleGameComplete}
                    className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Finish Game ✅
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Not quite right! Try to think about how your action affects
                    others and what helps the community most.
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

export default ServiceStory;
