import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIMapsStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [completed, setCompleted] = useState(false);

  // ✅ 5 AI-based story questions
  const stories = [
    {
      title: "AI in Maps 🗺️",
      situation: "Mom wants to find the shortest road to Grandma’s house. Who should she rely on?",
      choices: [
        { id: 1, text: "Google Maps AI 🧭", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Guessing the route ❓", emoji: "🤷‍♂️", isCorrect: false },
        { id: 3, text: "Asking a random passerby 🗣️", emoji: "👤", isCorrect: false },
        { id: 4, text: "Using a paper map 🗞️", emoji: "🗺️", isCorrect: false },
        { id: 5, text: "Following road signs 🛣️", emoji: "🚦", isCorrect: false },
      ],
      feedback: "Exactly! AI like Google Maps helps us find the fastest and safest routes easily.",
    },
    {
      title: "AI in Voice Assistants 🎤",
      situation: "Riya wants to set an alarm without touching her phone. What should she do?",
      choices: [
        { id: 1, text: "Say 'Hey Google' or 'Alexa' 🗣️", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Wait until someone reminds her ⏰", emoji: "👀", isCorrect: false },
        { id: 3, text: "Write it on paper 📝", emoji: "📄", isCorrect: false },
        { id: 4, text: "Use an egg timer ⏲️", emoji: "🥚", isCorrect: false },
        { id: 5, text: "Ask a friend to call her 📞", emoji: "📱", isCorrect: false },
      ],
      feedback: "Right! Voice assistants like Alexa and Google Assistant use AI to follow voice commands.",
    },
    {
      title: "AI in Shopping 🛍️",
      situation: "Rohit buys shoes online, and the app suggests matching socks. How does it know?",
      choices: [
        { id: 1, text: "AI recommendation system 🤖", emoji: "💡", isCorrect: true },
        { id: 2, text: "Shop owner personally guessed 🎩", emoji: "🧑‍💼", isCorrect: false },
        { id: 3, text: "Random luck 🍀", emoji: "🍀", isCorrect: false },
        { id: 4, text: "Internet magic ✨", emoji: "✨", isCorrect: false },
        { id: 5, text: "Cookies guessing it 🍪", emoji: "🍪", isCorrect: false },
      ],
      feedback: "Correct! AI learns your choices and suggests related products you might like.",
    },
    {
      title: "AI in Healthcare 🏥",
      situation: "A doctor uses a computer to detect early signs of disease from scans. What’s helping?",
      choices: [
        { id: 1, text: "AI medical imaging tool 🧠", emoji: "🩺", isCorrect: true },
        { id: 2, text: "Guessing based on luck 🎲", emoji: "🎲", isCorrect: false },
        { id: 3, text: "Doctor’s handwriting 🖋️", emoji: "🖋️", isCorrect: false },
        { id: 4, text: "Nurse taking notes 🧾", emoji: "👩‍⚕️", isCorrect: false },
        { id: 5, text: "X-ray film colors 🌈", emoji: "🌈", isCorrect: false },
      ],
      feedback: "Yes! AI helps doctors analyze scans faster and detect patterns humans might miss.",
    },
    {
      title: "AI in Entertainment 🎮",
      situation: "In Riya’s favorite racing game, the opponent cars adjust speed automatically. Why?",
      choices: [
        { id: 1, text: "AI controls difficulty dynamically 🧠", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Game developer drives them 🕹️", emoji: "👨‍💻", isCorrect: false },
        { id: 3, text: "They are random bots 🎲", emoji: "🎲", isCorrect: false },
        { id: 4, text: "It’s a coincidence 🍀", emoji: "🍀", isCorrect: false },
        { id: 5, text: "Player’s phone controls them 📱", emoji: "📱", isCorrect: false },
      ],
      feedback: "Awesome! Game AI adjusts difficulty to make challenges fun and fair.",
    },
  ];

  const currentStory = stories[currentQuestion];
  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  const handleChoice = (id) => {
    setSelectedChoice(id);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);

    setShowFeedback(true);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/voice-assistant-quiz");
  };

  return (
    <GameShell
      title="AI in Daily Life Stories"
      subtitle={`Question ${currentQuestion + 1} of ${stories.length}`}
      onNext={handleNext}
      nextEnabled={completed}
      showGameOver={completed}
      score={coins}
      gameId="ai-kids-27"
      gameType="ai"
      totalLevels={100}
      currentLevel={27}
      showConfetti={completed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!completed ? (
          <>
            {!showFeedback ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  {currentStory.title}
                </h2>
                <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                  <p className="text-white text-xl leading-relaxed text-center font-semibold">
                    {currentStory.situation}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {currentStory.choices.map(choice => (
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
                        <div className="text-3xl">{choice.emoji}</div>
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
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
                <div className="text-6xl mb-4">{selectedChoiceData.emoji}</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {selectedChoiceData.isCorrect ? "✅ Correct!" : "❌ Try Again!"}
                </h2>
                <p className="text-white/90 mb-6">{selectedChoiceData.text}</p>

                {selectedChoiceData.isCorrect ? (
                  <>
                    <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                      <p className="text-white">{currentStory.feedback}</p>
                    </div>
                    <p className="text-yellow-400 text-xl font-bold mb-4">
                      You earned +5 Coins! 🪙
                    </p>
                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                    >
                      Next Question ➡️
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleTryAgain}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Try Again 🔄
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-2">All Done!</h2>
            <p className="text-white/80 text-lg mb-4">
              You completed all 5 AI story challenges!
            </p>
            <p className="text-yellow-400 text-2xl font-bold">
              Total Coins Earned: {coins} 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIMapsStory;
