import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundRulesStory = () => {
  const navigate = useNavigate();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Line Up Time",
      emoji: "🧑‍🏫",
      situation: "Teacher says, 'Line up!' Do you push or follow the rules?",
      choices: [
        { id: 1, text: "Push others to go first", emoji: "🚶‍♂️", isCorrect: false },
        { id: 2, text: "Wait calmly and follow the line", emoji: "🙂", isCorrect: true },
      ],
    },
    {
      id: 2,
      title: "Sharing the Swing",
      emoji: "🏖️",
      situation: "Only one swing is free, and a friend wants a turn too. What do you do?",
      choices: [
        { id: 1, text: "Let your friend have a turn after you", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Keep swinging and ignore your friend", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Ball Game Rules",
      emoji: "⚽",
      situation: "The ball goes out of the playground. What should you do?",
      choices: [
        { id: 1, text: "Run outside without telling anyone", emoji: "🏃‍♂️", isCorrect: false },
        { id: 2, text: "Tell the teacher and ask permission", emoji: "🙋‍♀️", isCorrect: true },
      ],
    },
    {
      id: 4,
      title: "Playground Cleanliness",
      emoji: "🧹",
      situation: "You see snack wrappers on the ground. What will you do?",
      choices: [
        { id: 1, text: "Pick them up and throw in the dustbin", emoji: "♻️", isCorrect: true },
        { id: 2, text: "Ignore them — it’s not your job", emoji: "😐", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Helping a Friend",
      emoji: "🧒",
      situation: "A friend falls while running. What’s the right thing to do?",
      choices: [
        { id: 1, text: "Laugh and keep playing", emoji: "😂", isCorrect: false },
        { id: 2, text: "Help them stand and check if they're okay", emoji: "🤗", isCorrect: true },
      ],
    },
  ];

  const currentStory = stories[currentStoryIndex];
  const selectedChoiceData = currentStory.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      setCoins(5); // Final reward
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/reflex-daily-habits");
  };

  return (
    <GameShell
      title="Playground Rules Story"
      subtitle="Learn to Follow Rules While Playing"
      onNext={handleNextGame}
      nextEnabled={currentStoryIndex === stories.length - 1 && showFeedback}
      showGameOver={currentStoryIndex === stories.length - 1 && showFeedback}
      score={coins}
      gameId="moral-kids-38"
      gameType="educational"
      totalLevels={100}
      currentLevel={38}
      showConfetti={currentStoryIndex === stories.length - 1 && showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStory.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentStory.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">
              What should you do?
            </h3>

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
              {selectedChoiceData.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect
                ? "👏 Great Job!"
                : "Oops! Try Again..."}
            </h2>

            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.text}
            </p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    ✅ Well done! You followed the rule and showed discipline.
                    That’s how a responsible student behaves on the playground!
                  </p>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentStoryIndex === stories.length - 1
                    ? "Finish Story"
                    : "Next Question →"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    🚫 Following rules keeps everyone safe and happy! Try again
                    and make the right choice.
                  </p>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Next Question
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlaygroundRulesStory;
