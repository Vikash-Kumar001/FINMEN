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
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 chatbot interaction questions
  const chats = [
    {
      id: 1,
      question: "Chatbot: Say 'Hello' to start our chat!",
      correct: "hello",
      reply: "Hi, how are you?",
      correctMsg: "Awesome! That's how chatbots begin conversations.",
    },
    {
      id: 2,
      question: "Chatbot: What's your favorite color? (Type 'blue')",
      correct: "blue",
      reply: "Nice! Blue is calming and smart — just like AI!",
      correctMsg: "Perfect! You're learning how AI understands text patterns.",
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
    let isCorrect = false;

    if (userAnswer === correctAnswer) {
      isCorrect = true;
      setScore(prev => prev + 1);
      setBotReply(currentChat.reply);
      showCorrectAnswerFeedback(1, false);
    } else {
      setBotReply("Hmm, I didn't understand that. Try typing again!");
    }
    
    if (currentQuestion < chats.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setUserMessage("");
        setBotReply("");
      }, 1000);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setUserMessage("");
    setBotReply("");
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/face-unlock-game");
  };

  const accuracy = Math.round((score / chats.length) * 100);

  return (
    <GameShell
      title="Chatbot Friend"
      score={score}
      subtitle={`Chat ${currentQuestion + 1} of ${chats.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-31"
      gameType="ai"
      totalLevels={20}
      currentLevel={31}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Chat with AI</h3>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <p className="text-white text-xl font-semibold text-center">{currentChat.question}</p>
            </div>

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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Chat Expert!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You completed {score} out of {chats.length} chats correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Chatbots use AI to understand and respond to your messages!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {score} Points! 🪙
            </p>
            {accuracy < 70 && (
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