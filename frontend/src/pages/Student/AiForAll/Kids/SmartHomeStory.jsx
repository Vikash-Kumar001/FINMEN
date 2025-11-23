import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartHomeStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const questions = [
    {
      title: "Smart Light",
      emoji: "💡",
      question:
        "You enter a dark room and the light turns on automatically. Who made the light turn on?",
      choices: [
        { id: 1, text: "AI / Smart System", emoji: "🤖", isCorrect: true },
        { id: 2, text: "A Human person", emoji: "👤", isCorrect: false },
        { id: 3, text: "Magic", emoji: "✨", isCorrect: false },
      ],
      feedback:
        "Smart home systems use AI and sensors to detect motion and turn on lights automatically.",
    },
    {
      title: "Smart Speaker",
      emoji: "🔊",
      question:
        "You say 'Play music' and the speaker starts playing your favorite song. Who listened to your voice?",
      choices: [
        { id: 1, text: "AI Voice Assistant", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Your Friend", emoji: "👫", isCorrect: false },
        { id: 3, text: "A Radio DJ", emoji: "📻", isCorrect: false },
      ],
      feedback:
        "Voice assistants like Alexa and Google Home use AI to understand your words and respond.",
    },
    {
      title: "Smart AC",
      emoji: "❄️",
      question:
        "Your AC turns off automatically when the room gets cold. What made it stop?",
      choices: [
        { id: 1, text: "AI Temperature Sensor", emoji: "🌡️", isCorrect: true },
        { id: 2, text: "Electricity Cut", emoji: "⚡", isCorrect: false },
        { id: 3, text: "Random Luck", emoji: "🎲", isCorrect: false },
      ],
      feedback:
        "Smart thermostats use AI to maintain comfortable temperatures automatically.",
    },
    {
      title: "Smart Doorbell",
      emoji: "🚪",
      question:
        "Someone rings the doorbell and you get a video alert on your phone. Who made that possible?",
      choices: [
        { id: 1, text: "AI Security Camera", emoji: "📷", isCorrect: true },
        { id: 2, text: "Neighbor", emoji: "👩‍🦰", isCorrect: false },
        { id: 3, text: "Magic Mirror", emoji: "🪞", isCorrect: false },
      ],
      feedback:
        "AI cameras detect motion and send real-time alerts for your safety and convenience.",
    },
    {
      title: "Smart Vacuum",
      emoji: "🧹",
      question:
        "Your vacuum cleaner moves around by itself and avoids obstacles. What helps it do that?",
      choices: [
        { id: 1, text: "AI Sensors", emoji: "🔍", isCorrect: true },
        { id: 2, text: "Invisible Strings", emoji: "🧵", isCorrect: false },
        { id: 3, text: "Remote Control", emoji: "🎮", isCorrect: false },
      ],
      feedback:
        "Smart vacuums use AI sensors to map rooms and clean efficiently while avoiding obstacles.",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion?.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/train-the-robot");
  };

  return (
    <GameShell
      title="Smart Home Story"
      subtitle="AI in Our Homes"
      onNext={handleNext}
      nextEnabled={currentQuestionIndex === questions.length - 1 && showFeedback}
      showGameOver={currentQuestionIndex === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-kids-15"
      gameType="ai"
      totalLevels={100}
      currentLevel={15}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentQuestion.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.question}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
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
                    <div className="text-5xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">
                      {choice.text}
                    </div>
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
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData?.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect
                ? "🏠 Smart Home Expert!"
                : "Try Again..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  +5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! The correct answer was AI — smart systems make our homes
                    convenient and safe!
                  </p>
                </div>
              </>
            )}

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question →
              </button>
            ) : (
              <p className="text-white text-center font-bold mt-4">
                🎉 All questions completed!
              </p>
            )}  
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartHomeStory;
