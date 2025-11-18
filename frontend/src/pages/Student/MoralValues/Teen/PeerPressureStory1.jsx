import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerPressureStory1 = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Skipping Homework",
      emoji: "📚",
      situation: "Your friends say, 'Let’s skip homework and play games instead!'",
      choices: [
        { id: 1, text: "Agree and skip homework", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Politely refuse and do your work", emoji: "📝", isCorrect: true },
        { id: 3, text: "Pretend to agree but don’t do it", emoji: "🤐", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Classroom Dare",
      emoji: "🏫",
      situation: "Your friends dare you to make fun of a quiet classmate.",
      choices: [
        { id: 1, text: "Join in to look cool", emoji: "😎", isCorrect: false },
        { id: 2, text: "Say no and defend the classmate", emoji: "🫶", isCorrect: true },
        { id: 3, text: "Laugh quietly but don’t say anything", emoji: "😐", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Cheating in Test",
      emoji: "✏️",
      situation: "Your friend whispers answers during an exam.",
      choices: [
        { id: 1, text: "Copy quietly", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Refuse to cheat and focus on your paper", emoji: "💪", isCorrect: true },
        { id: 3, text: "Warn others about teacher coming", emoji: "👀", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Breaking Rules",
      emoji: "🚷",
      situation: "Your group suggests sneaking out of school early.",
      choices: [
        { id: 1, text: "Follow them and sneak out", emoji: "🚪", isCorrect: false },
        { id: 2, text: "Say no and remind them it’s wrong", emoji: "🙅‍♂️", isCorrect: true },
        { id: 3, text: "Wait to see if teachers notice", emoji: "👀", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Copying Homework",
      emoji: "📄",
      situation: "Your friend asks to copy your homework.",
      choices: [
        { id: 1, text: "Let them copy", emoji: "✍️", isCorrect: false },
        { id: 2, text: "Refuse and tell them to try it themselves", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Ignore and walk away", emoji: "🚶", isCorrect: false },
      ],
    },
  ];

  const story = stories[currentIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = story.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/debate-right-vs-popular");
    }
  };

  const selectedChoiceData = story.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Peer Pressure Story"
      subtitle={`Scenario ${currentIndex + 1} of ${stories.length}`}
      onNext={handleNextStory}
      nextEnabled={showFeedback}
      showGameOver={currentIndex === stories.length - 1 && showFeedback}
      score={coins}
      gameId="moral-teen-95"
      gameType="moral"
      totalLevels={100}
      currentLevel={95}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{story.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{story.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {story.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "🌟 Well Done!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white">
                  Great choice! You resisted peer pressure and stood up for what’s right.
                  That’s real courage and integrity!
                </p>
                <p className="text-yellow-400 text-2xl font-bold mt-4">+5 Coins 🪙</p>
              </div>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white">
                  Remember, real friends never force you to break rules. Stand firm and choose right next time!
                </p>
              </div>
            )}

            {/* ✅ Next Scenario Button always visible after feedback */}
            <button
              onClick={handleNextStory}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentIndex < stories.length - 1 ? "Next Scenario →" : "Finish Game 🎯"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerPressureStory1;
