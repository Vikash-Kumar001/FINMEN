import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ChatbotFriend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [botReply, setBotReply] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 chatbot interaction questions
  const chats = [
    {
      id: 1,
      question: "Chatbot: Say 'Hello' to start our chat!",
      correct: "hello",
      reply: "Hi, how are you?",
      correctMsg: "Awesome! That’s how chatbots begin conversations.",
    },
    {
      id: 2,
      question: "Chatbot: What's your favorite color? (Type 'blue')",
      correct: "blue",
      reply: "Nice! Blue is calming and smart — just like AI!",
      correctMsg: "Perfect! You’re learning how AI understands text patterns.",
    },
    {
      id: 3,
      question: "Chatbot: Say 'thank you' to show manners.",
      correct: "thank you",
      reply: "You're welcome! I like polite humans. 🤖",
      correctMsg: "Good job! Chatbots are trained to recognize kindness too!",
    },
    {
      id: 4,
      question: "Chatbot: Type 'bye' to end the chat politely.",
      correct: "bye",
      reply: "Goodbye! Talk to you soon! 👋",
      correctMsg: "Yes! You ended the chat politely — AI learns from tone and words.",
    },
    {
      id: 5,
      question: "Chatbot: What does AI mean? (Type 'Artificial Intelligence')",
      correct: "artificial intelligence",
      reply: "Correct! AI means Artificial Intelligence — smart machines that learn! 💡",
      correctMsg: "Excellent! You know what AI stands for!",
    },
  ];

  const currentChat = chats[currentQuestion];

  const handleSend = () => {
    const userAnswer = userMessage.trim().toLowerCase();
    const correctAnswer = currentChat.correct.toLowerCase();

    if (userAnswer === correctAnswer) {
      setBotReply(currentChat.reply);
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins(totalCoins + 5);
    } else {
      setBotReply("Hmm, I didn’t understand that. Try typing again!");
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setUserMessage("");
    setBotReply("");
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < chats.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserMessage("");
      setBotReply("");
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/face-unlock-game");
    }
  };

  return (
    <GameShell
      title="Chatbot Friend"
      score={coins}
      subtitle="Interact with AI"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && currentQuestion === chats.length - 1 && coins > 0}
      
      gameId="ai-kids-31"
      gameType="ai"
      totalLevels={100}
      currentLevel={31}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {currentChat.question}
            </h2>

            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full p-4 rounded-xl text-black font-semibold mb-6"
            />

            <button
              onClick={handleSend}
              disabled={!userMessage.trim()}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                userMessage.trim()
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Send
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins > 0 ? "🤖 Friendly Chat!" : "💬 Try Again"}
            </h2>

            <p className="text-white/90 text-lg mb-3">You: {userMessage}</p>
            <p className="text-white/90 text-lg mb-6">AI: {botReply}</p>

            {coins > 0 ? (
              <>
                <p className="text-green-400 mb-4 font-semibold">{currentChat.correctMsg}</p>
                <p className="text-yellow-400 text-2xl font-bold mb-6">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-2 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === chats.length - 1 ? "Finish Chat 🤝" : "Next Chat →"}
                </button>
              </>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ChatbotFriend;
