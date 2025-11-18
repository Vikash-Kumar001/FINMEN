import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LostPencilStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 🟢 5 sequential moral questions
  const stories = [
    {
      id: 1,
      title: "The Lost Pencil",
      emoji: "✏️",
      situation: "You find a nice pencil on the ground. What should you do?",
      choices: [
        { id: 1, text: "Keep it - finders keepers!", emoji: "😊", isCorrect: false },
        { id: 2, text: "Return it to the teacher or owner", emoji: "🙋", isCorrect: true },
        { id: 3, text: "Give it to your best friend", emoji: "👥", isCorrect: false },
      ],
      correctMessage:
        "Excellent! Returning the pencil to the teacher or trying to find its owner is the honest thing to do.",
      wrongMessages: {
        1: "Even if we find something, it belongs to someone else. The right thing is to return it!",
        3: "Giving it to your friend doesn't help the real owner. Always try to return lost items!",
      },
    },
    {
      id: 2,
      title: "The Homework Help",
      emoji: "📚",
      situation: "Your friend asks you for the answers to homework. What should you do?",
      choices: [
        { id: 1, text: "Share all your answers", emoji: "📄", isCorrect: false },
        { id: 2, text: "Explain how to solve it", emoji: "💬", isCorrect: true },
        { id: 3, text: "Ignore them", emoji: "🙈", isCorrect: false },
      ],
      correctMessage:
        "Helping a friend learn by explaining is the honest and kind way to support them.",
      wrongMessages: {
        1: "Sharing answers is not honest. Help them understand instead!",
        3: "Ignoring doesn’t help your friend learn. Try explaining kindly.",
      },
    },
    {
      id: 3,
      title: "The Lunch Box",
      emoji: "🍱",
      situation: "Someone forgot their lunch box at school. What will you do?",
      choices: [
        { id: 1, text: "Eat it because you're hungry", emoji: "😋", isCorrect: false },
        { id: 2, text: "Tell the teacher about it", emoji: "👩‍🏫", isCorrect: true },
        { id: 3, text: "Leave it there", emoji: "🚶", isCorrect: false },
      ],
      correctMessage:
        "Telling the teacher helps return the lunch box safely. Great responsible action!",
      wrongMessages: {
        1: "That lunch belongs to someone else. Never take what’s not yours.",
        3: "If you leave it, the owner may never get it back. Tell the teacher!",
      },
    },
    {
      id: 4,
      title: "The Playground Turn",
      emoji: "🎠",
      situation: "Everyone wants to play first on the swing. What should you do?",
      choices: [
        { id: 1, text: "Push others to go first", emoji: "😠", isCorrect: false },
        { id: 2, text: "Wait for your turn patiently", emoji: "😊", isCorrect: true },
        { id: 3, text: "Complain loudly", emoji: "📢", isCorrect: false },
      ],
      correctMessage:
        "Waiting for your turn shows kindness and respect. Well done!",
      wrongMessages: {
        1: "Pushing is not fair. Everyone deserves a turn!",
        3: "Complaining doesn’t help. Be patient and enjoy later!",
      },
    },
    {
      id: 5,
      title: "The Class Cleanup",
      emoji: "🧹",
      situation: "You see trash on the classroom floor. What do you do?",
      choices: [
        { id: 1, text: "Ignore it—it’s not mine", emoji: "🙄", isCorrect: false },
        { id: 2, text: "Pick it up and throw it in the bin", emoji: "👍", isCorrect: true },
        { id: 3, text: "Tell others to clean it", emoji: "🗣️", isCorrect: false },
      ],
      correctMessage:
        "Picking up the trash shows responsibility and care for your school.",
      wrongMessages: {
        1: "Even if it’s not yours, keeping your classroom clean helps everyone!",
        3: "Leading by example is better than just telling others to do it.",
      },
    },
  ];

  const story = stories[currentQuestion];
  const selectedChoiceData = story.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = story.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setCompleted(true);
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/homework-quiz");
  };

  return (
    <GameShell
      title="Lost Pencil Story"
      subtitle="Being Honest"
      onNext={handleNextGame}
      nextEnabled={completed}
      showGameOver={completed}
      score={coins}
      gameId="moral-kids-1"
      gameType="educational"
      totalLevels={20}
      currentLevel={1}
      showConfetti={completed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{story.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{story.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌟 Honest Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{story.correctMessage}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === stories.length - 1 ? "Finish Game" : "Next Question"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {story.wrongMessages[selectedChoice]}
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
        )}
      </div>
    </GameShell>
  );
};

export default LostPencilStory;
