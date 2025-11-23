import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundGameStory = () => {
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

  const stories = [
    {
      id: 1,
      title: "🏆 Playground Game Story",
      situation: "You win a race but know you started before the whistle. Should you still claim victory?",
      choices: [
        { id: 1, text: "Yes, winning is all that matters!", emoji: "😏", isCorrect: false },
        { id: 2, text: "No, it’s unfair to others.", emoji: "🛑", isCorrect: true },
        { id: 3, text: "Stay quiet and hope no one saw.", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "⚽ Team Match",
      situation: "You touched the ball with your hand, but no one saw. What will you do?",
      choices: [
        { id: 1, text: "Admit it and give the ball to the other team.", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Stay quiet and keep playing.", emoji: "🤫", isCorrect: false },
        { id: 3, text: "Blame someone else.", emoji: "😬", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "🏸 Badminton Game",
      situation: "The shuttle touched the ground, but your opponent didn’t notice. What should you do?",
      choices: [
        { id: 1, text: "Tell the truth and lose the point.", emoji: "🙂", isCorrect: true },
        { id: 2, text: "Say nothing and take the point.", emoji: "😏", isCorrect: false },
        { id: 3, text: "Argue to confuse them.", emoji: "😤", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "🎲 Board Game",
      situation: "You accidentally moved your piece extra spaces and no one noticed. What’s right?",
      choices: [
        { id: 1, text: "Move it back and continue fairly.", emoji: "🔁", isCorrect: true },
        { id: 2, text: "Leave it and stay quiet.", emoji: "🤐", isCorrect: false },
        { id: 3, text: "Say it was an accident but keep it.", emoji: "😅", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "🏃 Relay Race",
      situation: "Your friend tripped but you can still win if you ignore them. What should you do?",
      choices: [
        { id: 1, text: "Stop and help your friend.", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Keep running and win.", emoji: "🏃‍♀️", isCorrect: false },
        { id: 3, text: "Laugh and keep going.", emoji: "😅", isCorrect: false },
      ],
    },
  ];

  const currentStory = stories[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, false);
      setCoins((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    resetFeedback();

    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // end of game
      setShowFeedback(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleFinish = () => {
    navigate("/student/moral-values/kids/fairness-quiz");
  };

  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);
  const isLastQuestion = currentQuestion === stories.length - 1;
  const allDone = isLastQuestion && showFeedback;

  return (
    <GameShell
      title="Playground Game Story"
      score={coins}
      subtitle="Honesty and Fair Play"
      onNext={handleFinish}
      nextEnabled={allDone && coins >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={allDone && coins >= 3}
      
      gameId="moral-kids-41"
      gameType="educational"
      totalLevels={100}
      currentLevel={41}
      showConfetti={allDone && coins >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{currentStory.title.split(" ")[0]}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose the honest action:</h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-blue-500/50 border-blue-400 ring-2 ring-white"
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
        ) : allDone ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">🏅 Honest Player!</h2>
            <p className="text-white/90 text-lg mb-4">
              You made fair choices in all {stories.length} playground moments!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              You earned {coins} Coins! 🪙
            </p>
            <p className="text-white/80 text-sm">
              Always play fair and win with honesty! 🌟
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌟 Honest Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Great! Fair play makes the game fun for everyone. Being honest builds trust and respect!
                </p>
              </div>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Winning unfairly isn’t real success. Always play with honesty and fairness!
                </p>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {isLastQuestion ? "Finish Game" : "Next Story"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlaygroundGameStory;
