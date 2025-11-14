import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DigitalFootprintStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Funny Meme Post",
      emoji: "😂",
      situation:
        "You post a funny meme about your school friend. Everyone laughs, but your friend looks sad the next day.",
      choices: [
        { id: 1, text: "Apologize and delete the meme", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Ignore it—it was just a joke", emoji: "😅", isCorrect: false },
        { id: 3, text: "Make another meme", emoji: "🙈", isCorrect: false },
      ],
      lesson: "Be kind online. Once posted, things can hurt others and stay forever.",
    },
    {
      id: 2,
      title: "Teacher Saw It",
      emoji: "👩‍🏫",
      situation:
        "Your teacher sees your old meme post during a class project. It feels embarrassing.",
      choices: [
        { id: 1, text: "Learn from mistake and be careful next time", emoji: "🧠", isCorrect: true },
        { id: 2, text: "Laugh it off in class", emoji: "😂", isCorrect: false },
        { id: 3, text: "Blame someone else", emoji: "😬", isCorrect: false },
      ],
      lesson: "Posts can be seen by anyone—even teachers or future employers.",
    },
    {
      id: 3,
      title: "Private or Public?",
      emoji: "🔐",
      situation:
        "Your account is public, and a stranger likes your old posts. You feel uncomfortable.",
      choices: [
        { id: 1, text: "Change account to private", emoji: "🛡️", isCorrect: true },
        { id: 2, text: "Post more to get followers", emoji: "📸", isCorrect: false },
        { id: 3, text: "Share your profile link", emoji: "🔗", isCorrect: false },
      ],
      lesson: "Keep your account private and control who sees your posts.",
    },
    {
      id: 4,
      title: "Sharing Location",
      emoji: "📍",
      situation:
        "You upload a picture showing your school’s name in the background.",
      choices: [
        { id: 1, text: "Remove the post and avoid sharing location", emoji: "🚫", isCorrect: true },
        { id: 2, text: "Tag your school for fun", emoji: "🏫", isCorrect: false },
        { id: 3, text: "Share the same pic again", emoji: "📷", isCorrect: false },
      ],
      lesson: "Never share your school or home location online.",
    },
    {
      id: 5,
      title: "Think Before Posting",
      emoji: "💭",
      situation:
        "You’re about to post a silly dance video. Your face and name are visible.",
      choices: [
        { id: 1, text: "Ask yourself if you’d be okay seeing it later", emoji: "🤔", isCorrect: true },
        { id: 2, text: "Post it anyway for likes", emoji: "👍", isCorrect: false },
        { id: 3, text: "Tag random people", emoji: "🏷️", isCorrect: false },
      ],
      lesson: "Always think before posting. The internet remembers everything.",
    },
  ];

  const story = stories[currentQuestion];
  const selectedChoiceData = story.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = story.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(coins + 1, true);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      showCorrectAnswerFeedback(5, true);
    }
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/reflex-delete");
  };

  return (
    <GameShell
      title="Digital Footprint Story"
      subtitle="Think Before You Post"
      onNext={handleNextGame}
      nextEnabled={currentQuestion === stories.length - 1 && showFeedback}
      showGameOver={currentQuestion === stories.length - 1 && showFeedback}
      score={coins}
      gameId="dcos-kids-61"
      gameType="educational"
      totalLevels={100}
      currentLevel={61}
      showConfetti={currentQuestion === stories.length - 1 && showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{story.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{story.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {story.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{choice.emoji}</div>
                    <div className="text-white font-semibold">{choice.text}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "Smart Choice! 🌟" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white">{story.lesson}</p>
            </div>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                +1 Coin Earned! 🪙
              </p>
            ) : (
              <p className="text-white/80 text-center">Try to choose better next time!</p>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion === stories.length - 1 ? "Finish Story" : "Next Story"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DigitalFootprintStory;
