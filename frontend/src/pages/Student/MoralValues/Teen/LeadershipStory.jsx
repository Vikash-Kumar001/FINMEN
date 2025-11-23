import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LeadershipStory = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Credit Captain",
      emoji: "⚓",
      situation:
        "A captain takes credit for all the work his teammates did. Is this fair?",
      choices: [
        { id: 1, text: "Yes, he’s the leader!", emoji: "😐", isCorrect: false },
        { id: 2, text: "No, teamwork means sharing credit.", emoji: "🙌", isCorrect: true },
        { id: 3, text: "Maybe, if he helped a little.", emoji: "🤔", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Late Team Player",
      emoji: "⏰",
      situation:
        "A team member always comes late to practice, and others cover for them. What should the leader do?",
      choices: [
        { id: 1, text: "Ignore it, to stay friendly.", emoji: "😅", isCorrect: false },
        { id: 2, text: "Talk kindly and remind them of teamwork.", emoji: "💬", isCorrect: true },
        { id: 3, text: "Complain to everyone else.", emoji: "🙄", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "New Member",
      emoji: "🧩",
      situation:
        "A new student joins the project group and seems shy. What should a good leader do?",
      choices: [
        { id: 1, text: "Ignore them until they speak up.", emoji: "😶", isCorrect: false },
        { id: 2, text: "Welcome and involve them kindly.", emoji: "🤗", isCorrect: true },
        { id: 3, text: "Let others decide their role.", emoji: "🤷", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Winning Speech",
      emoji: "🏆",
      situation:
        "The team wins a trophy. The leader is asked to give a speech. What should they say?",
      choices: [
        { id: 1, text: "Thank only myself.", emoji: "😎", isCorrect: false },
        { id: 2, text: "Thank everyone and share the credit.", emoji: "👏", isCorrect: true },
        { id: 3, text: "Say nothing about the team.", emoji: "😶", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Helping Hand",
      emoji: "🤝",
      situation:
        "A teammate is struggling with a task. How should a leader respond?",
      choices: [
        { id: 1, text: "Tell them to figure it out alone.", emoji: "😐", isCorrect: false },
        { id: 2, text: "Guide and motivate them patiently.", emoji: "💪", isCorrect: true },
        { id: 3, text: "Replace them immediately.", emoji: "🚫", isCorrect: false },
      ],
    },
  ];

  const currentStory = stories[currentIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(coins + 1); // +1 coin per correct story, total 5 stories = 5 coins
    }
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/debate-team-vs-individual");
  };

  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Leadership Story"
      subtitle="Learning Fair Leadership"
      onNext={handleNext}
      nextEnabled={showFeedback && currentIndex === stories.length - 1}
      showGameOver={showFeedback && currentIndex === stories.length - 1}
      score={coins * 1}
      gameId="moral-teen-65"
      gameType="moral"
      totalLevels={100}
      currentLevel={65}
      showConfetti={showFeedback && currentIndex === stories.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentStory.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should a good leader do?</h3>

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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData?.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌟 True Leader!" : "Think Again..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Great! A true leader shares credit, listens, supports others, and treats
                  everyone fairly. Leadership means lifting others, not standing above them!
                </p>
              </div>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Leadership isn’t about control or pride. It's about helping and guiding
                  your team kindly. Try again!
                </p>
              </div>
            )}

            {selectedChoiceData?.isCorrect ? (
              <button
                onClick={handleNextStory}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentIndex < stories.length - 1 ? "Next Story ➡️" : "Finish Game 🎉"}
              </button>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LeadershipStory;
