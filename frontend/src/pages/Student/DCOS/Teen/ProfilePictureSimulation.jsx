import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ProfilePictureSimulation = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const choices = [
    { id: 1, type: "Personal Photo", emoji: "📸", description: "Your real photo showing your face", isCorrect: false },
    { id: 2, type: "Cartoon/Avatar", emoji: "🎨", description: "Animated character or cartoon", isCorrect: true },
    { id: 3, type: "Full Body Photo", emoji: "🧍", description: "Photo showing your full appearance", isCorrect: false }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = choices.find(c => c.id === selectedChoice);
    
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
    navigate("/student/dcos/teen/social-media-journal");
  };

  const selectedChoiceData = choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Profile Picture Simulation"
      subtitle="Choose a Safe Profile Picture"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="dcos-teen-4"
      gameType="dcos"
      totalLevels={20}
      currentLevel={4}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Choose Your Profile Picture</h2>
            <p className="text-white/70 mb-6 text-center">Which option is safest for social media?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-6xl mb-3 text-center">{choice.emoji}</div>
                  <div className="text-white font-bold text-lg mb-2 text-center">{choice.type}</div>
                  <div className="text-white/70 text-sm text-center">{choice.description}</div>
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
              {selectedChoiceData.isCorrect ? "🌟 Smart Choice!" : "Risky Choice!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.type}</p>
            
            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Perfect! Using a cartoon or avatar protects your identity online. Personal photos 
                    can be used for facial recognition, identity theft, or tracking. Cartoons keep you 
                    anonymous while still expressing your personality!
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
                    Using personal photos as profile pictures puts you at risk! Strangers can identify 
                    you, use facial recognition, or misuse your images. Use cartoons or avatars instead 
                    to protect your identity while staying social online.
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

export default ProfilePictureSimulation;

