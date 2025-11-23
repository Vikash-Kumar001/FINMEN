import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartFridgeStory = () => {
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
      title: "Smart Fridge Reminder",
      emoji: "🧊",
      situation: "Your fridge reminds you that milk is about to expire. Who sent the reminder?",
      choices: [
        { id: 1, text: "AI Fridge Notification", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Mom", emoji: "👩‍🦰", isCorrect: false },
        { id: 3, text: "Dad", emoji: "👨‍🦱", isCorrect: false },
      ],
      correctMsg:
        "Exactly! Smart home devices like AI fridges help remind you about food, making life easier and preventing waste. 🥛✨",
      wrongMsg:
        "Actually, AI fridges can notify you automatically. Smart devices help manage tasks efficiently in modern homes.",
    },
    {
      id: 2,
      title: "Smart Lights",
      emoji: "💡",
      situation: "The lights in your room turn off when you leave. What made that happen?",
      choices: [
        { id: 1, text: "AI Motion Sensor", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Electric Switch", emoji: "🔌", isCorrect: false },
        { id: 3, text: "Magic", emoji: "🪄", isCorrect: false },
      ],
      correctMsg:
        "Correct! AI-powered sensors detect when no one is in the room and save energy automatically. 🌍💡",
      wrongMsg:
        "Not quite! Smart lights use motion sensors and AI to detect movement — not magic!",
    },
    {
      id: 3,
      title: "Smart Speaker",
      emoji: "🗣️",
      situation: "You say 'Play my favorite song' and music starts playing. What made it possible?",
      choices: [
        { id: 1, text: "Voice Recognition AI", emoji: "🎶", isCorrect: true },
        { id: 2, text: "Radio", emoji: "📻", isCorrect: false },
        { id: 3, text: "Television", emoji: "📺", isCorrect: false },
      ],
      correctMsg:
        "Yes! Smart assistants like Alexa or Google use AI to understand your voice and play the right music. 🎧🤖",
      wrongMsg:
        "Oops! It’s not a radio — AI voice assistants recognize your words and respond smartly.",
    },
    {
      id: 4,
      title: "Smart Vacuum",
      emoji: "🧹",
      situation: "A small robot cleans your floor while you relax. What technology is it using?",
      choices: [
        { id: 1, text: "AI Navigation", emoji: "🧭", isCorrect: true },
        { id: 2, text: "Manual Remote", emoji: "🎮", isCorrect: false },
        { id: 3, text: "Wheels and Broom", emoji: "🪣", isCorrect: false },
      ],
      correctMsg:
        "Exactly! Smart vacuums use AI navigation and sensors to clean rooms without bumping into things. 🤖✨",
      wrongMsg:
        "Try again! Smart vacuums don’t need remotes — they use AI to move around automatically.",
    },
    {
      id: 5,
      title: "Smart Doorbell",
      emoji: "🚪",
      situation: "You get a phone alert when someone is at the door. What made this happen?",
      choices: [
        { id: 1, text: "AI Camera Detection", emoji: "📷", isCorrect: true },
        { id: 2, text: "Mailman", emoji: "📬", isCorrect: false },
        { id: 3, text: "Timer Alarm", emoji: "⏰", isCorrect: false },
      ],
      correctMsg:
        "Correct! AI doorbells use face detection and motion alerts to notify you instantly. 🔔📱",
      wrongMsg:
        "Not quite! Smart doorbells use AI cameras to recognize people, not regular alarms.",
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setTotalCoins(totalCoins + 10);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/chatbot-friend");
    }
  };

  return (
    <GameShell
      title="Smart Fridge Story"
      score={coins}
      subtitle="AI in Smart Homes"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && currentQuestion === questions.length - 1 && coins > 0}
      
      gameId="ai-kids-30"
      gameType="ai"
      totalLevels={100}
      currentLevel={30}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map(choice => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Smart Choice!" : "Think Again..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.correctMsg}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">You earned 10 Coins! 🪙</p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.wrongMsg}</p>
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

export default SmartFridgeStory;
