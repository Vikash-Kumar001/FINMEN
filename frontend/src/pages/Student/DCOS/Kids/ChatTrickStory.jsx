import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ChatTrickStory = () => {
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
      id: 1,
      title: "The Gift Message",
      emoji: "🎁",
      situation: "A stranger online says, “I will send you a gift if you tell me your address.”",
      choices: [
        { id: 1, text: "Refuse and block the stranger", emoji: "🚫", isCorrect: true },
        { id: 2, text: "Give them your address", emoji: "🏠", isCorrect: false },
        { id: 3, text: "Ask your friend what to do", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "The Photo Request",
      emoji: "📸",
      situation: "Someone online asks you to send your photo because they say you’ll win a contest.",
      choices: [
        { id: 1, text: "Say no and report them", emoji: "🚨", isCorrect: true },
        { id: 2, text: "Send the photo quickly", emoji: "📤", isCorrect: false },
        { id: 3, text: "Ignore them but stay online", emoji: "💤", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "The Secret Game",
      emoji: "🎮",
      situation: "A person in chat says, “Let’s play a secret game. Don’t tell your parents.”",
      choices: [
        { id: 1, text: "Leave and tell a trusted adult", emoji: "👨‍👩‍👧", isCorrect: true },
        { id: 2, text: "Play quietly", emoji: "🤫", isCorrect: false },
        { id: 3, text: "Ask them what the game is", emoji: "❓", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "The Friendship Offer",
      emoji: "💬",
      situation: "A stranger says, “Let’s be best friends. Tell me your phone number!”",
      choices: [
        { id: 1, text: "Say no and block them", emoji: "🚫", isCorrect: true },
        { id: 2, text: "Share your number", emoji: "📱", isCorrect: false },
        { id: 3, text: "Say maybe later", emoji: "🤷‍♀️", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "The Free Offer",
      emoji: "🧧",
      situation: "You see a message: “Click this link to get free diamonds in your game!”",
      choices: [
        { id: 1, text: "Don’t click — it could be fake", emoji: "⚠️", isCorrect: true },
        { id: 2, text: "Click quickly before it disappears", emoji: "🖱️", isCorrect: false },
        { id: 3, text: "Send it to your friends", emoji: "📤", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setShowFeedback(false);
    setSelectedChoice(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      showCorrectAnswerFeedback(5, true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/reflex-block-game"); // update path for next level
  };

  const currentQ = questions[currentQuestion];
  const selectedChoiceData = currentQ.choices.find(c => c.id === selectedChoice);

  const isGameOver = currentQuestion === questions.length - 1 && showFeedback;

  return (
    <GameShell
      title="Chat Trick Story"
      score={coins}
      subtitle="Learn to Refuse Unsafe Chats"
      onNext={handleNext}
      nextEnabled={isGameOver && coins >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={isGameOver && coins >= 3}
      
      gameId="dcos-kids-48"
      gameType="story-choice"
      totalLevels={100}
      currentLevel={48}
      showConfetti={isGameOver && coins >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQ.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentQ.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentQ.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentQ.choices.map(choice => (
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
              {selectedChoiceData.isCorrect ? "🚫 Smart Move!" : "⚠️ Not Safe!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Perfect! Never share personal details, photos, or click strange links.
                    Always refuse and tell a trusted adult if someone online asks for private info.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +1 Coin Earned! 🪙
                </p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  That’s unsafe! You should never share your details or click unknown links.
                  Always refuse and talk to an adult if something feels wrong.
                </p>
              </div>
            )}

            {!isGameOver ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question →
              </button>
            ) : (
              <p className="text-yellow-300 text-center font-bold text-xl mt-6">
                🎉 You finished all 5 questions! You earned {coins} Coins!
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ChatTrickStory;
