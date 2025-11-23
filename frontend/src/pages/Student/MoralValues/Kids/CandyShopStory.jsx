import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CandyShopStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Extra Candy",
      emoji: "🍬",
      situation: "The shopkeeper accidentally gives you extra candy. What should you do?",
      choices: [
        { id: 1, text: "Keep it quietly", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Return the extra candy to the shopkeeper", emoji: "🙋", isCorrect: true },
        { id: 3, text: "Share it with friends", emoji: "👥", isCorrect: false },
      ],
      feedback: "Returning the extra candy shows honesty and respect. Great job!",
    },
    {
      title: "Lost Wallet",
      emoji: "👛",
      situation: "You find a wallet in the park. What should you do?",
      choices: [
        { id: 1, text: "Keep the money and throw the wallet", emoji: "💸", isCorrect: false },
        { id: 2, text: "Try to find the owner or give it to an adult", emoji: "🔎", isCorrect: true },
        { id: 3, text: "Ignore it and walk away", emoji: "🚶", isCorrect: false },
      ],
      feedback: "Finding the owner or reporting to an adult is the honest and kind thing to do.",
    },
    {
      title: "Class Test",
      emoji: "📝",
      situation: "Your friend offers to show you answers during a test. What will you do?",
      choices: [
        { id: 1, text: "Look at the answers secretly", emoji: "👀", isCorrect: false },
        { id: 2, text: "Refuse and focus on your own paper", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Copy only one answer", emoji: "✍️", isCorrect: false },
      ],
      feedback: "Honesty means doing your best without cheating — even if no one is watching!",
    },
    {
      title: "Broken Vase",
      emoji: "🏺",
      situation: "You accidentally break a vase at home. What do you do?",
      choices: [
        { id: 1, text: "Hide the pieces quickly", emoji: "😨", isCorrect: false },
        { id: 2, text: "Tell your parents the truth", emoji: "👨‍👩‍👧", isCorrect: true },
        { id: 3, text: "Blame your sibling", emoji: "🙈", isCorrect: false },
      ],
      feedback: "Admitting mistakes builds trust and shows courage. Always tell the truth.",
    },
    {
      title: "Homework Helper",
      emoji: "📚",
      situation: "Your classmate forgets their homework and asks to copy yours. What should you do?",
      choices: [
        { id: 1, text: "Let them copy to be nice", emoji: "😅", isCorrect: false },
        { id: 2, text: "Say no and help them learn it instead", emoji: "💡", isCorrect: true },
        { id: 3, text: "Ignore them completely", emoji: "🙄", isCorrect: false },
      ],
      feedback: "Helping a friend learn is true kindness — copying doesn’t help anyone grow.",
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setTotalCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/kids/reflex-quick-choice");
    }
  };

  return (
    <GameShell
      title="Candy Shop Story"
      subtitle="Learn Honesty through Situations"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={totalCoins}
      gameId="moral-kids-8"
      gameType="educational"
      totalLevels={20}
      currentLevel={8}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
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
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "💎 Honest Hero!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That’s not the honest choice. Think again and choose what’s right!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedChoice(null);
                    setShowFeedback(false);
                    resetFeedback();
                  }}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}

            {selectedChoiceData.isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition"
              >
                {currentQuestion === questions.length - 1 ? "Finish Game 🎉" : "Next Story ➡️"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CandyShopStory;
