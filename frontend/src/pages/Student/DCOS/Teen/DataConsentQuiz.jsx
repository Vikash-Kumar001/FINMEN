import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DataConsentQuiz = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const question = {
    text: 'A new app requests access to: Contacts, Camera, Microphone, Location. Is this safe to allow?',
    emoji: "📱",
    choices: [
      { id: 1, text: "Yes - all apps need these permissions", emoji: "✓", isCorrect: false },
      { id: 2, text: "No - only grant necessary permissions", emoji: "🛡️", isCorrect: true },
      { id: 3, text: "Yes - if it's a popular app", emoji: "⭐", isCorrect: false }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = question.choices.find(c => c.id === selectedChoice);
    
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setEarnedBadge(true);
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setEarnedBadge(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/fake-friend-story");
  };

  const selectedChoiceData = question.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Data Consent Quiz"
      subtitle="App Permissions Matter"
      onNext={handleNext}
      nextEnabled={showFeedback && earnedBadge}
      showGameOver={showFeedback && earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="dcos-teen-6"
      gameType="dcos"
      totalLevels={20}
      currentLevel={6}
      showConfetti={showFeedback && earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {question.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
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
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🏆 Data Guardian!" : "Think Carefully..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Correct! Only grant permissions that are necessary for the app's core function. 
                    A flashlight app doesn't need your contacts! A calculator doesn't need your location! 
                    Excessive permissions can lead to data theft, privacy invasion, and misuse of your 
                    personal information.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-2">🏆</div>
                  <p className="text-white text-2xl font-bold">Data Guardian Badge!</p>
                  <p className="text-white/80 text-sm mt-2">You protect your data!</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Apps often request more permissions than they need to collect and sell your data! 
                    Always review permissions carefully and only grant what's absolutely necessary. 
                    Popularity doesn't equal safety!
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

export default DataConsentQuiz;

