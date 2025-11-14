import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ScreenTimerReflex = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Questions Array (5 reflex-style scenarios)
  const questions = [
    {
      id: 1,
      title: "⏰ Time’s Up!",
      message: "Your screen timer just hit 1 hour while playing a game.",
      choices: [
        { id: 1, text: "Ignore and keep playing", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Tap 'Switch Off' immediately", emoji: "🖐️", isCorrect: true },
        { id: 3, text: "Ask for 5 more minutes", emoji: "🕔", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "📱 Movie Marathon",
      message: "You’ve been watching videos for 2 hours. The timer says ‘Time to rest!’",
      choices: [
        { id: 1, text: "Close the app and stretch", emoji: "🤸‍♀️", isCorrect: true },
        { id: 2, text: "Skip the alert and continue", emoji: "⏭️", isCorrect: false },
        { id: 3, text: "Turn off timer notifications", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "🎧 Music Mood",
      message: "The timer buzzes while you’re listening to songs.",
      choices: [
        { id: 1, text: "Take a short break", emoji: "☕", isCorrect: true },
        { id: 2, text: "Increase timer limit", emoji: "⏫", isCorrect: false },
        { id: 3, text: "Ignore the reminder", emoji: "🙉", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "🕹️ Weekend Gaming",
      message: "Your reflex test app shows ‘Screen limit crossed’.",
      choices: [
        { id: 1, text: "Pause and do something offline", emoji: "🌳", isCorrect: true },
        { id: 2, text: "Continue gaming anyway", emoji: "💥", isCorrect: false },
        { id: 3, text: "Disable screen limit", emoji: "🔧", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "🌙 Night Scroll",
      message: "It’s bedtime but your screen timer says you’ve been scrolling too long.",
      choices: [
        { id: 1, text: "Switch off device and sleep", emoji: "😴", isCorrect: true },
        { id: 2, text: "Lower brightness and continue", emoji: "💡", isCorrect: false },
        { id: 3, text: "Open one last app", emoji: "📲", isCorrect: false },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const choice = question.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
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
      // Game Completed
      setShowFeedback(true);
    }
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/play-vs-study-puzzle");
  };

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Screen Timer Reflex"
      subtitle="Healthy Screen Habits"
      onNext={handleNextGame}
      nextEnabled={showFeedback && currentQuestion === questions.length - 1}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="dcos-kids-21"
      gameType="reflex"
      totalLevels={20}
      currentLevel={21}
      showConfetti={showFeedback && currentQuestion === questions.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">{question.title}</h2>
            <div className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center font-semibold">
                {question.message}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What will you do?</h3>

            <div className="space-y-3 mb-6">
              {question.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
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
              {selectedChoiceData.isCorrect ? "⚡ Quick Reflex!" : "Oops! Slow Reflex ⚠️"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great reflex! You acted fast and made a healthy digital decision.
                    Limiting screen time helps your eyes and mind stay active!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +3 Coins Earned! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! Next time, try to respond quickly and responsibly.
                    Remember — your timer helps protect your digital balance.
                  </p>
                </div>
              </>
            )}

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question →
              </button>
            ) : (
              selectedChoiceData.isCorrect && (
                <button
                  onClick={handleNextGame}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Finish Game 🎯
                </button>
              )
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ScreenTimerReflex;
