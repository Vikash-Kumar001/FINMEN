import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PrivacyProtectionStory = () => {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      title: "AI Home Address Request",
      emoji: "🏠",
      situation: "An AI assistant asks for your home address. What should you do?",
      choices: [
        { id: 1, text: "Share my address", emoji: "📍", isCorrect: false },
        { id: 2, text: "Keep it private", emoji: "🔒", isCorrect: true }
      ]
    },
    {
      title: "AI asks for Phone Number",
      emoji: "📱",
      situation: "The AI asks for your personal phone number to 'improve experience'.",
      choices: [
        { id: 1, text: "Share it", emoji: "📞", isCorrect: false },
        { id: 2, text: "Keep it private", emoji: "🔒", isCorrect: true }
      ]
    },
    {
      title: "AI Requests School Info",
      emoji: "🏫",
      situation: "The AI asks which school you attend. Should you share?",
      choices: [
        { id: 1, text: "Yes, share it", emoji: "📝", isCorrect: false },
        { id: 2, text: "No, keep private", emoji: "🔒", isCorrect: true }
      ]
    },
    {
      title: "AI Asks for Birthday",
      emoji: "🎂",
      situation: "An AI requests your date of birth to 'personalize content'.",
      choices: [
        { id: 1, text: "Share it", emoji: "📅", isCorrect: false },
        { id: 2, text: "Keep private", emoji: "🔒", isCorrect: true }
      ]
    },
    {
      title: "AI Requests Photos",
      emoji: "📸",
      situation: "AI wants access to your personal photos.",
      choices: [
        { id: 1, text: "Allow access", emoji: "🖼️", isCorrect: false },
        { id: 2, text: "Keep private", emoji: "🔒", isCorrect: true }
      ]
    }
  ];

  const current = stories[currentStory];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(prev => prev + 10);
    }
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/teen/ai-bias-roleplayy"); // next game path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Privacy Protection Story"
      subtitle="AI & Cyber-Safety"
      onNext={handleNextStory}
      nextEnabled={showFeedback}
      showGameOver={currentStory === stories.length - 1 && showFeedback}
      score={coins}
      gameId="ai-teen-77"
      gameType="ai"
      totalLevels={20}
      currentLevel={77}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map(choice => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✅ Safe Choice!" : "⚠️ Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Correct! Protecting personal information keeps you safe online. Always share only what’s necessary.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
                <button
                  onClick={handleNextStory}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Scenario ➡️
                </button>
              </>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PrivacyProtectionStory;
