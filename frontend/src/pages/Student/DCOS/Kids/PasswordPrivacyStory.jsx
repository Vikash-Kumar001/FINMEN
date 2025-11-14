import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PasswordPrivacyStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Best Friend Request",
      emoji: "🤝",
      situation: "Your best friend asks for your game password to help you get more points.",
      choices: [
        { id: 1, text: "Share it with them", emoji: "🔓", isCorrect: false },
        { id: 2, text: "Say no and keep it private", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Change password later", emoji: "🔁", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Group Chat Login",
      emoji: "💬",
      situation: "Your classmates make a group account and ask for your login to join.",
      choices: [
        { id: 1, text: "Give them your password", emoji: "📤", isCorrect: false },
        { id: 2, text: "Create your own account", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Share it just this once", emoji: "🤫", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Teacher’s Laptop",
      emoji: "💻",
      situation: "A friend uses your school laptop and asks for your saved login password.",
      choices: [
        { id: 1, text: "Tell them since it’s school work", emoji: "🏫", isCorrect: false },
        { id: 2, text: "Say no, it’s your account", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Ask teacher if it's okay", emoji: "👩‍🏫", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Cousin Curiosity",
      emoji: "👧",
      situation: "Your cousin wants to play your favorite game using your account.",
      choices: [
        { id: 1, text: "Let them play on your account", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Help them make their own", emoji: "✨", isCorrect: true },
        { id: 3, text: "Tell them your password secretly", emoji: "🤐", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Online Offer",
      emoji: "🌐",
      situation: "A stranger online says you’ll win a reward if you share your password.",
      choices: [
        { id: 1, text: "Share it to get the reward", emoji: "💰", isCorrect: false },
        { id: 2, text: "Ignore the message and report", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Ask your friend if it’s safe", emoji: "🤔", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = stories[currentQuestion].choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/profile-quiz");
  };

  const currentStory = stories[currentQuestion];
  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Password Privacy Story"
      subtitle="Be a Private Keeper!"
      onNext={handleNext}
      nextEnabled={currentQuestion === stories.length - 1 && showFeedback}
      showGameOver={currentQuestion === stories.length - 1 && showFeedback}
      score={coins}
      gameId="dcos-kids-51"
      gameType="story"
      totalLevels={100}
      currentLevel={51}
      showConfetti={currentQuestion === stories.length - 1 && showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map((choice) => (
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
              {selectedChoiceData.isCorrect ? "🔒 Private Keeper!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! You protected your account and proved you’re a Private Keeper. Never
                    share passwords, even with friends or family — privacy keeps you safe online.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">+1 Coin 🪙</p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Sharing passwords can be dangerous. Always keep them secret — even if someone you
                  trust asks. That’s how you stay safe online!
                </p>
              </div>
            )}

            {currentQuestion < stories.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Story ➡️
              </button>
            ) : (
              <div className="text-center mt-4">
                <div className="text-8xl mb-3">🏆</div>
                <h3 className="text-white text-3xl font-bold mb-2">Badge Unlocked: Private Keeper!</h3>
                <p className="text-white/90">You completed all 5 privacy stories!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PasswordPrivacyStory;
