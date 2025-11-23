import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotSpyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      title: "Robot Spy Story 1",
      emoji: "🤖",
      situation: "You notice a robot secretly recording voices in your home. What should you do?",
      choices: [
        { id: 1, text: "Stop the robot", emoji: "✋", isCorrect: true },
        { id: 2, text: "Ignore it - it's just a robot", emoji: "😐", isCorrect: false },
        { id: 3, text: "Laugh and record it yourself", emoji: "😂", isCorrect: false }
      ]
    },
    {
      title: "Robot Spy Story 2",
      emoji: "📷🤖",
      situation: "A robot is taking photos without permission. How do you react?",
      choices: [
        { id: 1, text: "Cover your camera and stop it", emoji: "✋📷", isCorrect: true },
        { id: 2, text: "Pose for fun photos", emoji: "😎", isCorrect: false },
        { id: 3, text: "Ignore it", emoji: "😐", isCorrect: false }
      ]
    },
    {
      title: "Robot Spy Story 3",
      emoji: "🏠🤖",
      situation: "Robot keeps tracking your movements at home. What’s safe?",
      choices: [
        { id: 1, text: "Turn off tracking features", emoji: "🛑", isCorrect: true },
        { id: 2, text: "Let it continue", emoji: "😐", isCorrect: false },
        { id: 3, text: "Try to hack the robot", emoji: "💻", isCorrect: false }
      ]
    },
    {
      title: "Robot Spy Story 4",
      emoji: "🔍🤖",
      situation: "You find a spy robot collecting data about your friends. Next step?",
      choices: [
        { id: 1, text: "Inform your friends & shut it down", emoji: "👥✋", isCorrect: true },
        { id: 2, text: "Share data with others", emoji: "📤", isCorrect: false },
        { id: 3, text: "Laugh and ignore", emoji: "😂", isCorrect: false }
      ]
    },
    {
      title: "Robot Spy Story 5",
      emoji: "🔒🤖",
      situation: "Robot company asks for your private data. What should you do?",
      choices: [
        { id: 1, text: "Deny or limit access", emoji: "✋", isCorrect: true },
        { id: 2, text: "Give full access without reading", emoji: "✅", isCorrect: false },
        { id: 3, text: "Share only with friends", emoji: "👥", isCorrect: false }
      ]
    }
  ];

  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [coins, setCoins] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const story = stories[currentStory];
  const isLastStory = currentStory === stories.length - 1;
  const selectedChoiceData = story.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = story.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      setCoins(prev => prev + 10);
      showCorrectAnswerFeedback(10, true);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (!isLastStory) {
      setCurrentStory(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/kids/ai-and-environment-quiz");
    }
  };

  return (
    <GameShell
      title="Robot Spy Stories"
      subtitle={`Story ${currentStory + 1} of ${stories.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={isLastStory && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId={`ai-kids-91-${currentStory + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={91 + currentStory}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{story.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{story.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {story.choices.map(choice => (
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
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🔒 Privacy Protected!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You earned 10 Coins! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {selectedChoiceData.isCorrect && (
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {isLastStory ? "Finish" : "Next Story"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotSpyStory;
