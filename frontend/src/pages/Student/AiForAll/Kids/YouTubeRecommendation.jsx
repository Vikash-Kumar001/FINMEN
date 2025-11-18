import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const YouTubeRecommendation = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      text: "What kind of videos should AI recommend to kids?",
      emoji: "📺",
      choices: [
        { id: 1, text: "Cartoons 🧸", isCorrect: true },
        { id: 2, text: "Adult Shows 📺", isCorrect: false },
      ],
      feedback:
        "Perfect! AI recommends fun and safe videos like cartoons or songs for kids!",
    },
    {
      text: "Which of these is a fun and educational video for kids?",
      emoji: "🎓",
      choices: [
        { id: 1, text: "Science Experiment 🔬", isCorrect: true },
        { id: 2, text: "Politics Debate 🏛️", isCorrect: false },
      ],
      feedback:
        "Correct! Science experiments teach and entertain kids — AI loves recommending such videos!",
    },
    {
      text: "If you watch DIY craft videos often, what will YouTube show next?",
      emoji: "✂️",
      choices: [
        { id: 1, text: "More DIY Craft Videos 🎨", isCorrect: true },
        { id: 2, text: "Random Scary Movies 👻", isCorrect: false },
      ],
      feedback:
        "Right! AI tracks your watching patterns and recommends more of what you enjoy — like crafts!",
    },
    {
      text: "AI uses what to decide your recommendations?",
      emoji: "🧠",
      choices: [
        { id: 1, text: "Your Watch History 📜", isCorrect: true },
        { id: 2, text: "Random Guessing 🎲", isCorrect: false },
      ],
      feedback:
        "Exactly! AI learns from your watch history and behavior to give smarter video suggestions.",
    },
    {
      text: "Why does YouTube ask 'Do you like this video?'",
      emoji: "👍",
      choices: [
        { id: 1, text: "To learn your taste and improve recommendations 💡", isCorrect: true },
        { id: 2, text: "Just for fun 🎈", isCorrect: false },
      ],
      feedback:
        "Yes! When you like or dislike a video, AI learns your preferences to show better content next time!",
    },
  ];

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const choice = question.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins(totalCoins + 5);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/smart-fridge-story");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="YouTube Recommendation Quiz"
      subtitle="Learn AI Recommendations"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={totalCoins}
      gameId="ai-kids-29"
      gameType="ai"
      totalLevels={100}
      currentLevel={29}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-6 text-center">{question.emoji}</div>
            <h3 className="text-white text-2xl font-bold mb-6 text-center">
              Q{currentQuestion + 1}. {question.text}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {question.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-6 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-5xl mb-2">{choice.text.split(" ")[1]}</div>
                  <div className="text-white font-bold text-lg text-center">{choice.text}</div>
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
            <div className="text-6xl mb-4 text-center">{coins > 0 ? "🎉" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "Correct!" : "Try Again!"}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                coins > 0 ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{question.feedback}</p>
            </div>

            {coins > 0 ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === questions.length - 1
                    ? "Finish Quiz"
                    : "Next Question →"}
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

export default YouTubeRecommendation;
