import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendlyAIQuiz = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const question = {
    text: "Should AI help people?",
    emoji: "🤖",
    choices: [
      { id: 1, text: "Yes - AI should help us", emoji: "✓", isCorrect: true },
      { id: 2, text: "No - AI should not help", emoji: "✗", isCorrect: false }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = question.choices.find(c => c.id === selectedChoice);
    
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
    navigate("/student/ai-for-all/kids/robot-emotion-story");
  };

  const selectedChoiceData = question.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Friendly AI Quiz"
      subtitle="AI Ethics for Kids"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="ai-kids-18"
      gameType="ai"
      totalLevels={20}
      currentLevel={18}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {question.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : choice.isCorrect
                      ? 'bg-green-500/20 border-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 border-red-400 hover:bg-red-500/30'
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-2xl text-center">{choice.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{coins > 0 ? "💖" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "Perfect!" : "Think Again..."}
            </h2>
            
            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Yes! AI should help people! AI is created to make our lives better, easier, and 
                    safer. From helping doctors to teaching students, AI is our helpful friend!
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
                    AI SHOULD help people! We create AI to make life better. Think of how Siri helps 
                    you, or how AI helps doctors save lives!
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

export default FriendlyAIQuiz;

