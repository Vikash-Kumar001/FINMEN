import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ChatbotSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [step, setStep] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const conversationSteps = [
    {
      userPrompt: "Say 'Hello' to the chatbot",
      expectedKeywords: ["hello", "hi", "hey"],
      botResponse: "Hi! How are you today? 😊"
    },
    {
      userPrompt: "Ask the chatbot how it's doing",
      expectedKeywords: ["how", "are", "you", "doing"],
      botResponse: "I'm doing great, thank you for asking! I'm here to help you. What would you like to know?"
    },
    {
      userPrompt: "Ask the chatbot about the weather",
      expectedKeywords: ["weather", "temperature", "sunny", "rain"],
      botResponse: "I can help with weather information! In your area, it's currently sunny and 25°C. Perfect day! ☀️"
    },
    {
      userPrompt: "Thank the chatbot",
      expectedKeywords: ["thank", "thanks", "appreciate"],
      botResponse: "You're very welcome! Feel free to ask me anything anytime! 💙"
    }
  ];

  const currentStep = conversationSteps[step];

  const handleSend = () => {
    if (!userInput.trim()) return;

    // Add user message
    setMessages([...messages, { type: "user", text: userInput }]);

    // Check if input matches expected keywords
    const inputLower = userInput.toLowerCase();
    const isCorrect = currentStep.expectedKeywords.some(keyword => 
      inputLower.includes(keyword.toLowerCase())
    );

    if (isCorrect) {
      // Add bot response after delay
      setTimeout(() => {
        setMessages(prev => [...prev, { type: "bot", text: currentStep.botResponse }]);
        
        if (step < conversationSteps.length - 1) {
          setStep(prev => prev + 1);
        } else {
          showCorrectAnswerFeedback(5, true);
          setCoins(5);
          setShowComplete(true);
        }
      }, 800);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: "bot", 
          text: `Try saying something about: ${currentStep.expectedKeywords.join(", ")}` 
        }]);
      }, 800);
    }

    setUserInput("");
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-in-gaming-story");
  };

  return (
    <GameShell
      title="Chatbot Simulation"
      subtitle="Understanding Chatbots"
      onNext={handleNext}
      nextEnabled={showComplete}
      showGameOver={showComplete}
      score={coins}
      gameId="ai-teen-9"
      gameType="ai"
      totalLevels={20}
      currentLevel={9}
      showConfetti={showComplete}
      backPath="/games/ai-for-all/teens"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-6xl mb-4 text-center">🤖</div>
          <h3 className="text-white text-xl font-bold mb-6 text-center">Chat with an AI Bot!</h3>
          
          {!showComplete && (
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-sm text-center">
                {currentStep.userPrompt}
              </p>
            </div>
          )}

          {/* Chat Messages */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-4 h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-white/50 text-center py-20">
                Start the conversation...
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg ${
                        msg.type === "user"
                          ? "bg-purple-500/50 text-white"
                          : "bg-blue-500/30 text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          {!showComplete && (
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/40 rounded-xl text-white placeholder-white/50 focus:border-purple-400 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!userInput.trim()}
                className={`px-6 py-3 rounded-xl font-bold text-white transition ${
                  userInput.trim()
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          )}

          {showComplete && (
            <div className="bg-green-500/20 rounded-lg p-4 mt-4">
              <p className="text-white text-center mb-2">
                🎉 Great conversation! You understand how chatbots work!
              </p>
              <p className="text-white/80 text-sm text-center mb-4">
                💡 Chatbots use Natural Language Processing (NLP) to understand what you're saying 
                and respond appropriately. They're used in customer service, education, and entertainment!
              </p>
              <p className="text-yellow-400 text-xl font-bold text-center">
                You earned 5 Coins! 🪙
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ChatbotSimulation;

