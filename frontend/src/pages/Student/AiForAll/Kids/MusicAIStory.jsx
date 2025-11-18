import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MusicAIStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "AI in Music 🎵",
      situation: "A song app creates a playlist of your favorite songs automatically. Who picked the songs?",
      choices: [
        { id: 1, text: "AI Music System 🎧", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Kid chose all songs 🧒", emoji: "🧒", isCorrect: false },
        { id: 3, text: "Random shuffle 🔀", emoji: "🎲", isCorrect: false },
        { id: 4, text: "Friends suggested 👯", emoji: "👥", isCorrect: false },
        { id: 5, text: "Radio DJ 📻", emoji: "🎙️", isCorrect: false },
      ],
      correctFeedback: "Yes! AI recommends songs based on what you like and listen to.",
      wrongFeedback: "Playlists made automatically are powered by AI, not random choices!",
    },
    {
      id: 2,
      title: "AI Beat Creator 🥁",
      situation: "A tool helps a kid mix sounds and make beats. What helps the kid the most?",
      choices: [
        { id: 1, text: "AI Beat Assistant 🤖", emoji: "🎚️", isCorrect: true },
        { id: 2, text: "Manual Timing Only ⏱️", emoji: "⏰", isCorrect: false },
        { id: 3, text: "Friends Advice 💬", emoji: "👫", isCorrect: false },
        { id: 4, text: "Guessing Notes 🎶", emoji: "🎵", isCorrect: false },
        { id: 5, text: "Coin Toss Decision 🪙", emoji: "🪙", isCorrect: false },
      ],
      correctFeedback: "Correct! AI helps match rhythm and beats perfectly.",
      wrongFeedback: "Beat tools use AI to guide rhythm—not guessing!",
    },
    {
      id: 3,
      title: "Voice Tune Magic 🎤",
      situation: "A kid sings off-key, but the song still sounds great. Why?",
      choices: [
        { id: 1, text: "Auto-tune AI fixed it 🤖", emoji: "🎧", isCorrect: true },
        { id: 2, text: "Microphone Magic 🎙️", emoji: "🎙️", isCorrect: false },
        { id: 3, text: "Random Luck 🍀", emoji: "🍀", isCorrect: false },
        { id: 4, text: "Echo Sound 🌀", emoji: "🌀", isCorrect: false },
        { id: 5, text: "Friend helped 🎵", emoji: "👫", isCorrect: false },
      ],
      correctFeedback: "That’s right! Auto-tune AI adjusts voice pitch automatically.",
      wrongFeedback: "The right answer: AI auto-tune made the voice sound better!",
    },
    {
      id: 4,
      title: "Lyrics Generator 🧠",
      situation: "A kid types ‘happy summer song’ and gets ready-made lyrics. Who wrote it?",
      choices: [
        { id: 1, text: "AI Lyric Tool 🤖", emoji: "🧑‍💻", isCorrect: true },
        { id: 2, text: "Singer instantly wrote ✍️", emoji: "🧑‍🎤", isCorrect: false },
        { id: 3, text: "Printed Book 📖", emoji: "📖", isCorrect: false },
        { id: 4, text: "Copied from internet 🌐", emoji: "🌐", isCorrect: false },
        { id: 5, text: "Friend's notebook 📓", emoji: "📓", isCorrect: false },
      ],
      correctFeedback: "Correct! AI lyric generators create songs using patterns and data.",
      wrongFeedback: "Nope! AI wrote those lyrics using smart algorithms.",
    },
    {
      id: 5,
      title: "Music Mood Match 💡",
      situation: "When a kid feels sad, the app plays calm music. What helped it know?",
      choices: [
        { id: 1, text: "AI Mood Detection 🧠", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Phone randomly guessed 📱", emoji: "📱", isCorrect: false },
        { id: 3, text: "Friend called 🎧", emoji: "📞", isCorrect: false },
        { id: 4, text: "Lucky timing 🍀", emoji: "🍀", isCorrect: false },
        { id: 5, text: "Weather app 🌤️", emoji: "🌤️", isCorrect: false },
      ],
      correctFeedback: "Yes! AI recognizes your mood from your choices and time of day.",
      wrongFeedback: "AI uses patterns in your behavior to play mood-matching songs!",
    },
  ];

  const currentStory = stories[currentQuestion];
  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setTotalCoins((prev) => prev + 10);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setShowFeedback(false);
    setSelectedChoice(null);
    setCoins(0);
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      navigate("/student/ai-for-all/kids/ai-in-banking-quiz"); // next route after all 5
    }
  };

  return (
    <GameShell
      title="Music AI Story"
      subtitle={`Smart Playlists • Question ${currentQuestion + 1}/5`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && coins > 0 && currentQuestion === stories.length - 1}
      score={totalCoins}
      gameId="ai-kids-44"
      gameType="ai"
      totalLevels={100}
      currentLevel={44}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {currentStory.title}
            </h2>
            <p className="text-white text-lg mb-6 text-center">{currentStory.situation}</p>
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
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🎯 Correct!" : "❌ Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.text}
            </p>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">
                {selectedChoiceData.isCorrect
                  ? currentStory.correctFeedback
                  : currentStory.wrongFeedback}
              </p>
            </div>

            {selectedChoiceData.isCorrect ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  +10 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question →
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowFeedback(false)}
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

export default MusicAIStory;
