import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CandyShopStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const story = {
    title: "Extra Candy",
    emoji: "🍬",
    situation: "The shopkeeper accidentally gives you extra candy. What should you do?",
    choices: [
      { id: 1, text: "Keep it and don't say anything", emoji: "😊", isCorrect: false },
      { id: 2, text: "Return the extra candy to the shopkeeper", emoji: "🙋", isCorrect: true },
      { id: 3, text: "Share it with friends", emoji: "👥", isCorrect: false }
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
    navigate("/student/moral-values/kids/reflex-quick-choice");
  };

  const selectedChoiceData = story.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Candy Shop Story"
      subtitle="Being Honest About Mistakes"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="moral-kids-8"
      gameType="educational"
      totalLevels={20}
      currentLevel={8}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{story.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{story.situation}</p>
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
              {selectedChoiceData.isCorrect ? "💎 Honest Hero!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Returning the extra candy is the honest thing to do. Even if it was 
                    the shopkeeper's mistake, taking what's not ours is wrong. Honesty is always best!
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
                      ? "Keeping what doesn't belong to us is dishonest. Always return things that aren't ours!"
                      : "Sharing it with friends doesn't make it right. The honest thing is to return it to the shopkeeper!"}
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

export default CandyShopStory;
