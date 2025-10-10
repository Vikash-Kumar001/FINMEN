import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PasswordSharingStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const story = {
    title: "Password Request",
    emoji: "🔐",
    situation: "Your best friend asks: 'Can I borrow your password to check something on your account? I promise I'll just look quickly and won't change anything.'",
    choices: [
      { id: 1, text: "Share it - they're my best friend", emoji: "🤝", isCorrect: false },
      { id: 2, text: "Never share passwords with anyone", emoji: "🛡️", isCorrect: true },
      { id: 3, text: "Share it but change it later", emoji: "🔄", isCorrect: false }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = story.choices.find(c => c.id === selectedChoice);
    
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/privacy-settings-quiz");
  };

  const selectedChoiceData = story.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Password Sharing Story"
      subtitle="Never Share Your Password"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="dcos-teen-1"
      gameType="dcos"
      totalLevels={20}
      currentLevel={1}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{story.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{story.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
            
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌟 Perfect!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Never share your password with anyone - not even your best friend. 
                    Passwords are personal security keys. Even with good intentions, sharing them 
                    puts your account, data, and privacy at risk. Use secure password managers if 
                    you need to share access to something.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {selectedChoice === 1
                      ? "Even best friends shouldn't know your passwords. Trust isn't about sharing passwords - it's about respecting boundaries and security."
                      : "Changing your password after sharing it doesn't fix the security breach. They still had access. Never share passwords in the first place!"}
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

export default PasswordSharingStory;

