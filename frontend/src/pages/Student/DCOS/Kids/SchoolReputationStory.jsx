import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolReputationStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Angry Post",
      emoji: "😡",
      situation: "You had a bad day and feel like posting 'This school is so stupid!' online.",
      choices: [
        { id: 1, text: "Post it anyway", emoji: "🚫", isCorrect: false },
        { id: 2, text: "Talk to a teacher instead", emoji: "💬", isCorrect: true },
        { id: 3, text: "Tell your friends to post it too", emoji: "📣", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Funny Meme",
      emoji: "😂",
      situation: "A friend made a meme making fun of a school teacher and wants you to share it.",
      choices: [
        { id: 1, text: "Share it—it’s just a joke", emoji: "😅", isCorrect: false },
        { id: 2, text: "Say no, that’s disrespectful", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Tag the teacher for fun", emoji: "🏷️", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Photo Post",
      emoji: "📸",
      situation: "You took a picture of a messy classroom. Should you post it online?",
      choices: [
        { id: 1, text: "Yes, so everyone sees how bad it is", emoji: "🤳", isCorrect: false },
        { id: 2, text: "No, it could hurt the school’s image", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Only share it in group chat", emoji: "💬", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Parent Visit",
      emoji: "👩‍🏫",
      situation: "A parent asks you online if your school is good. What should you say?",
      choices: [
        { id: 1, text: "Say something positive and honest", emoji: "😊", isCorrect: true },
        { id: 2, text: "Complain about boring classes", emoji: "😒", isCorrect: false },
        { id: 3, text: "Ignore them", emoji: "🤷‍♀️", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Friend’s Post",
      emoji: "👫",
      situation: "Your friend posted something rude about school. What should you do?",
      choices: [
        { id: 1, text: "Laugh and comment 😂", emoji: "😆", isCorrect: false },
        { id: 2, text: "Tell them it’s not right and delete it", emoji: "🧹", isCorrect: true },
        { id: 3, text: "Share it for fun", emoji: "🔁", isCorrect: false },
      ],
    },
  ];

  const current = stories[currentQuestion];
  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      if (currentQuestion === stories.length - 1) {
        setEarnedBadge(true);
      }
    }

    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/dcos/kids/poster-task1");
    }
  };

  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="School Reputation Story"
      subtitle="Think before you post online"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={earnedBadge}
      score={earnedBadge ? 5 : currentQuestion + 1}
      gameId="dcos-kids-66"
      gameType="educational"
      totalLevels={100}
      currentLevel={66}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{current.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{choice.emoji}</div>
                    <div className="text-white font-semibold">{choice.text}</div>
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
            <div className="text-6xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "Great Decision! 🌟" : "Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Perfect! Respecting your school online shows pride and kindness.
                    Think before posting—keep your school’s reputation strong! 🏫
                  </p>
                </div>

                {earnedBadge && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
                    <div className="text-5xl mb-2">🏅</div>
                    <p className="text-white text-2xl font-bold">School Pride Badge!</p>
                    <p className="text-white/80 text-sm mt-2">You respect your school online!</p>
                  </div>
                )}

                {/* ✅ Added Next Button Here */}
                <button
                  onClick={handleNext}
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next →
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Not the best choice! Negative posts can hurt your school and others.
                    Try again and choose what keeps your school’s image positive!
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

export default SchoolReputationStory;
