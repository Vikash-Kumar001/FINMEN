import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AINewsStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 🧠 5 Story Questions
  const questions = [
    {
      title: "AI Recommends News",
      emoji: "📰",
      situation:
        "A student opens a news app, and it shows articles about science and space. Who recommends these articles?",
      choices: [
        { id: 1, text: "AI News Recommender 🤖", emoji: "🧠", isCorrect: true },
        { id: 2, text: "School Teacher 👩‍🏫", emoji: "👩‍🏫", isCorrect: false },
        { id: 3, text: "Random Newspapers 🗞️", emoji: "🗞️", isCorrect: false },
        { id: 4, text: "Friends' Suggestions 🧑‍🤝‍🧑", emoji: "👥", isCorrect: false },
        { id: 5, text: "TV News Anchor 📺", emoji: "📺", isCorrect: false },
      ],
      correctMsg: "Yes! AI studies what you read and shows news you’re interested in.",
      wrongMsg: "Teachers or friends don’t recommend app articles — AI does!",
    },
    {
      title: "Breaking News Timing",
      emoji: "⏰",
      situation: "A news app instantly notifies you about breaking events. How does it do that?",
      choices: [
        { id: 1, text: "AI detects trending topics 🔥", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Manual updates by teachers 🧑‍🏫", emoji: "🧑‍🏫", isCorrect: false },
        { id: 3, text: "Friends send the alerts 💬", emoji: "💬", isCorrect: false },
        { id: 4, text: "Random notifications 📱", emoji: "📱", isCorrect: false },
        { id: 5, text: "TV channel updates 📺", emoji: "📺", isCorrect: false },
      ],
      correctMsg: "Correct! AI scans social media and websites to find trending events fast.",
      wrongMsg: "Nope! AI, not humans, scans for trending topics automatically.",
    },
    {
      title: "Language of News",
      emoji: "🌐",
      situation: "A user reads news in Hindi, and the app automatically translates English articles. Which tech is behind it?",
      choices: [
        { id: 1, text: "AI Language Translator 🌎", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Manual Translator 🧑‍🏫", emoji: "🧑‍🏫", isCorrect: false },
        { id: 3, text: "Google Maps 🗺️", emoji: "🗺️", isCorrect: false },
        { id: 4, text: "Weather System ☁️", emoji: "☁️", isCorrect: false },
        { id: 5, text: "Dictionary 📘", emoji: "📘", isCorrect: false },
      ],
      correctMsg: "Exactly! AI translation models convert news into your language instantly.",
      wrongMsg: "No, it’s not manual translation — AI handles it in real-time.",
    },
    {
      title: "Fake News Check",
      emoji: "🔍",
      situation: "Some apps warn you if a news article might be fake. Who helps them detect that?",
      choices: [
        { id: 1, text: "AI Fact Checker 🤖", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Newsreader 👀", emoji: "👀", isCorrect: false },
        { id: 3, text: "Random Algorithm 🎲", emoji: "🎲", isCorrect: false },
        { id: 4, text: "TV Editor 📰", emoji: "📰", isCorrect: false },
        { id: 5, text: "School Library 📚", emoji: "📚", isCorrect: false },
      ],
      correctMsg: "Correct! AI checks articles for misinformation using data and patterns.",
      wrongMsg: "Nope! AI, not editors, verifies fake or real news automatically.",
    },
    {
      title: "Smart Headlines",
      emoji: "🧠",
      situation: "Your app highlights top stories you might like every morning. How does it know your interests?",
      choices: [
        { id: 1, text: "AI tracks your reading habits 📖", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Random headlines 🎯", emoji: "🎯", isCorrect: false },
        { id: 3, text: "Manual selection 🧑‍💻", emoji: "🧑‍💻", isCorrect: false },
        { id: 4, text: "By horoscope 🔮", emoji: "🔮", isCorrect: false },
        { id: 5, text: "By luck 🍀", emoji: "🍀", isCorrect: false },
      ],
      correctMsg: "Right! AI learns your reading behavior to show stories you’ll enjoy.",
      wrongMsg: "No, luck or horoscope doesn’t pick headlines — AI personalization does!",
    },
  ];

  const current = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(2, false);
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
      // Final Result
      const earnedCoins = score >= 3 ? 10 : 0;
      setCoins(earnedCoins);
      setShowFeedback(false);
      setCurrentQuestion(questions.length);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-doctor-quiz");
  };

  // Game finished
  const isGameOver = currentQuestion >= questions.length;

  return (
    <GameShell
      title="AI News Story"
      subtitle={
        isGameOver
          ? "Game Complete!"
          : `Story ${currentQuestion + 1} of ${questions.length}`
      }
      onNext={handleNext}
      nextEnabled={isGameOver && coins > 0}
      showGameOver={isGameOver && coins > 0}
      score={coins}
      gameId="ai-kids-47"
      gameType="ai"
      totalLevels={100}
      currentLevel={47}
      showConfetti={isGameOver && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!isGameOver ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-9xl mb-4 text-center">{current.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {current.title}
              </h2>
              <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                <p className="text-white text-xl leading-relaxed text-center font-semibold">
                  {current.situation}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {current.choices.map((choice) => (
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
                Confirm Choice
              </button>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-7xl mb-4 text-center">
                {
                  current.choices.find((c) => c.id === selectedChoice)?.emoji
                }
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                {
                  current.choices.find((c) => c.id === selectedChoice)
                    ?.isCorrect
                    ? "🎉 Correct!"
                    : "❌ Not Quite!"
                }
              </h2>
              <p className="text-white/90 text-lg mb-6 text-center">
                {current.choices.find((c) => c.id === selectedChoice)?.text}
              </p>

              {current.choices.find((c) => c.id === selectedChoice)?.isCorrect ? (
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.correctMsg}</p>
                </div>
              ) : (
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.wrongMsg}</p>
                </div>
              )}

              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Story
              </button>
            </div>
          )
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              🧠 AI News Genius!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You answered {score} out of {questions.length} stories correctly.
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-sm">
                📰 AI helps deliver personalized, real-time, and trustworthy news!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold">
              {coins > 0
                ? "You earned 10 Coins! 🪙"
                : "Get at least 3 correct to earn coins!"}
            </p>
            {coins === 0 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default AINewsStory;
