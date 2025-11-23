import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendSecretStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Friend’s Secret",
      emoji: "🤫",
      situation: "Your friend tells you a secret. What do you do?",
      choices: [
        { id: 1, text: "Keep it safe and don’t tell anyone", emoji: "🛡️", isCorrect: true },
        { id: 2, text: "Tell others for fun", emoji: "🗣️", isCorrect: false },
        { id: 3, text: "Ignore it and forget", emoji: "😐", isCorrect: false }
      ]
    },
    {
      title: "Homework Secret",
      emoji: "📚",
      situation: "Friend shares their homework answers secretly. What should you do?",
      choices: [
        { id: 1, text: "Keep it secret and don’t copy", emoji: "🛡️", isCorrect: true },
        { id: 2, text: "Show it to others", emoji: "🗣️", isCorrect: false },
        { id: 3, text: "Discard it immediately", emoji: "🗑️", isCorrect: false }
      ]
    },
    {
      title: "Birthday Surprise",
      emoji: "🎂",
      situation: "Friend tells you a surprise plan. Do you share it?",
      choices: [
        { id: 1, text: "Keep it secret", emoji: "🤐", isCorrect: true },
        { id: 2, text: "Tell others to help", emoji: "🗣️", isCorrect: false },
        { id: 3, text: "Forget the plan", emoji: "😅", isCorrect: false }
      ]
    },
    {
      title: "Lost Toy Secret",
      emoji: "🧸",
      situation: "Friend lost a toy and tells you secretly. What do you do?",
      choices: [
        { id: 1, text: "Help and keep it secret", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Tell others to find it", emoji: "🗣️", isCorrect: false },
        { id: 3, text: "Ignore them", emoji: "😐", isCorrect: false }
      ]
    },
    {
      title: "Secret Drawing",
      emoji: "🎨",
      situation: "Friend shows you a drawing secretly. Do you show it to others?",
      choices: [
        { id: 1, text: "Keep it private", emoji: "🖌️", isCorrect: true },
        { id: 2, text: "Share for fun", emoji: "🗣️", isCorrect: false },
        { id: 3, text: "Throw it away", emoji: "🗑️", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);
    
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }
    
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/moral-values/kids/poster-right-choice"); // replace with next game path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const selectedChoiceData = questions[currentQuestion].choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Friend’s Secret Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={showFeedback && selectedChoiceData?.isCorrect && currentQuestion === questions.length - 1}
      score={coins}
      gameId="moral-kids-95"
      gameType="educational"
      totalLevels={100}
      currentLevel={95}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{questions[currentQuestion].title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{questions[currentQuestion].situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
            
            <div className="space-y-3 mb-6">
              {questions[currentQuestion].choices.map(choice => (
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
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🤝 Trustworthy Friend!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>
            
            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You earned 5 Coins! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!selectedChoiceData?.isCorrect}
              className={`mt-4 w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoiceData?.isCorrect
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Next Story
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FriendSecretStory;
