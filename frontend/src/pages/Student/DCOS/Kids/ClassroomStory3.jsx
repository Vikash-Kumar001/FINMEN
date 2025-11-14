import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClassroomStory3 = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      emoji: "🏫",
      situation:
        "You’re in class taking a test. You notice an AI app on your tablet that can give answers instantly. The teacher isn’t watching. What do you do?",
      choices: [
        { id: 1, text: "Use the AI app to answer every question fast", emoji: "🤖", isCorrect: false },
        { id: 2, text: "Ask AI to give hints but not full answers", emoji: "💡", isCorrect: false },
        { id: 3, text: "Tell your friend about the app during test", emoji: "🗣️", isCorrect: false },
        { id: 4, text: "Ignore the app and do the test honestly", emoji: "✅", isCorrect: true },
        { id: 5, text: "Use AI to check answers after submitting the test", emoji: "📚", isCorrect: false },
      ],
    },
    {
      id: 2,
      emoji: "👩‍🏫",
      situation:
        "Your teacher assigns an essay. You find an AI tool that can write it for you. What’s the best action?",
      choices: [
        { id: 1, text: "Copy the essay from AI and submit it", emoji: "📄", isCorrect: false },
        { id: 2, text: "Ask AI to help with ideas, but write it yourself", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Let AI write half and you write half", emoji: "✍️", isCorrect: false },
        { id: 4, text: "Skip the essay and ask AI for the answers later", emoji: "🤖", isCorrect: false },
      ],
    },
    {
      id: 3,
      emoji: "🧑‍🤝‍🧑",
      situation:
        "Your classmate asks you to share an AI-generated summary of your textbook. What do you do?",
      choices: [
        { id: 1, text: "Share it immediately to be helpful", emoji: "📤", isCorrect: false },
        { id: 2, text: "Tell them to ask the teacher first", emoji: "🧑‍🏫", isCorrect: true },
        { id: 3, text: "Post it in the group chat for everyone", emoji: "💬", isCorrect: false },
        { id: 4, text: "Ignore them completely", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 4,
      emoji: "💻",
      situation:
        "AI gives you an answer that looks wrong, but it sounds confident. What should you do?",
      choices: [
        { id: 1, text: "Trust AI completely—it’s always right", emoji: "🤖", isCorrect: false },
        { id: 2, text: "Fact-check the answer from other trusted sources", emoji: "🔍", isCorrect: true },
        { id: 3, text: "Share the wrong answer with friends", emoji: "📢", isCorrect: false },
        { id: 4, text: "Argue with AI until it agrees with you", emoji: "💬", isCorrect: false },
      ],
    },
    {
      id: 5,
      emoji: "🧩",
      situation:
        "You use AI to make a class project presentation. What’s the right way to show your work?",
      choices: [
        { id: 1, text: "Hide that AI helped you", emoji: "🙊", isCorrect: false },
        { id: 2, text: "Say AI made everything by itself", emoji: "🤖", isCorrect: false },
        { id: 3, text: "Give credit that AI helped and explain what you learned", emoji: "🏆", isCorrect: true },
        { id: 4, text: "Don’t show the project at all", emoji: "🚫", isCorrect: false },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentStory = stories[currentIndex];
  const selectedChoiceData = currentStory?.choices.find((c) => c.id === selectedChoice);

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
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setFinished(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/ai-ethics-badge");
  };

  return (
    <GameShell
      title="Classroom Story"
      subtitle="AI and Honesty"
      onNext={handleNextGame}
      nextEnabled={finished}
      showGameOver={finished}
      score={coins}
      gameId="dcos-kids-79"
      gameType="educational"
      totalLevels={100}
      currentLevel={79}
      showConfetti={finished}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!finished ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
              <div className="text-7xl mb-4 text-center">{currentStory.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Question {currentIndex + 1} of 5
              </h2>
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white text-lg leading-relaxed">{currentStory.situation}</p>
              </div>

              <h3 className="text-white font-bold mb-4">What should you do?</h3>

              <div className="space-y-3 mb-6">
                {currentStory.choices.map((choice) => (
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
                {selectedChoiceData.isCorrect ? "Smart Choice! 🌟" : "Not Quite..."}
              </h2>
              <p className="text-white/90 text-lg mb-6 text-center">
                {selectedChoiceData.text}
              </p>

              {selectedChoiceData.isCorrect ? (
                <>
                  <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white text-center">
                      Great thinking! You’re learning how to use AI with honesty and wisdom.
                    </p>
                  </div>
                  <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                    +1 Coin 🪙
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
                  >
                    {currentIndex === stories.length - 1 ? "Finish Quiz" : "Next Question"}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white text-center">
                      Remember — honesty and responsibility make AI helpful, not harmful.
                    </p>
                  </div>
                  <button
                    onClick={handleTryAgain}
                    className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Amazing Work! You finished all 5 classroom challenges!
            </h2>
            <p className="text-yellow-400 text-2xl font-bold mb-2">
              You earned {coins} Coins! 🪙
            </p>
            <p className="text-white/80 mb-4">
              You proved that honesty and responsibility make AI learning smarter and fairer.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ClassroomStory3;
