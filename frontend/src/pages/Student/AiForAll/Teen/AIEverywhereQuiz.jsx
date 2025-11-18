import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIEverywhereQuiz = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const question = {
    text: "Is AI only in robots?",
    emoji: "🌍",
    choices: [
      { id: 1, text: "Yes - AI is only in robots", emoji: "🤖", isCorrect: false },
      { id: 2, text: "No - AI is everywhere!", emoji: "🌐", isCorrect: true }
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

  const handleFinish = () => {
    navigate("/games/ai-for-all/teens/spam-filter-reflex");
  };

  const selectedChoiceData = question.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="AI Everywhere Quiz"
      subtitle="Understanding AI's Reach"
      onNext={handleFinish}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="ai-teen-20"
      gameType="ai"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
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

            <div className="space-y-4">
              {question.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-6 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
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
            <div className="text-8xl mb-4 text-center">{coins > 0 ? "🌟" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "Perfect Understanding!" : "Think Bigger..."}
            </h2>
            
            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-5 mb-4">
                  <p className="text-white text-center mb-4">
                    Absolutely correct! AI is EVERYWHERE:
                  </p>
                  <ul className="text-white/90 text-sm space-y-2 text-left">
                    <li>📱 <strong>Your Phone:</strong> Face unlock, voice assistants, predictive text</li>
                    <li>🎬 <strong>Entertainment:</strong> Netflix, YouTube, Spotify recommendations</li>
                    <li>🛒 <strong>Shopping:</strong> Amazon, online stores, personalized ads</li>
                    <li>🚗 <strong>Transportation:</strong> GPS navigation, self-driving cars</li>
                    <li>🏥 <strong>Healthcare:</strong> Disease diagnosis, drug discovery</li>
                    <li>🎮 <strong>Gaming:</strong> Smart NPCs, procedural generation</li>
                    <li>🏠 <strong>Home:</strong> Smart devices, thermostats, security</li>
                    <li>💬 <strong>Communication:</strong> Email filters, translation, chatbots</li>
                    <li>📸 <strong>Photos:</strong> Face recognition, filters, image enhancement</li>
                    <li>🔍 <strong>Search:</strong> Google, Bing use AI to understand your queries</li>
                  </ul>
                  <p className="text-white/80 text-sm text-center mt-4">
                    AI is integrated into almost every aspect of modern life!
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
                    AI is NOT just in robots! AI is in your phone, apps, games, smart home devices, 
                    cars, healthcare, education, and countless other places. It's all around us!
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

export default AIEverywhereQuiz;

