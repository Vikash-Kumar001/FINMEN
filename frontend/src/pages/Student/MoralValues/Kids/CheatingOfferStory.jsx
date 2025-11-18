import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CheatingOfferStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Test Time",
      emoji: "📝",
      situation: "A friend offers you the answers during a test. What should you do?",
      choices: [
        { id: 1, text: "Accept the answers and copy", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Politely refuse and do your own work", emoji: "🙅", isCorrect: true },
        { id: 3, text: "Ignore and peek occasionally", emoji: "👀", isCorrect: false }
      ]
    },
    {
      title: "Math Challenge",
      emoji: "➗",
      situation: "Your friend offers the solution to a tricky math problem. What do you do?",
      choices: [
        { id: 1, text: "Take it without asking", emoji: "🙊", isCorrect: false },
        { id: 2, text: "Try yourself first and refuse help", emoji: "💪", isCorrect: true },
        { id: 3, text: "Copy and hope teacher doesn't notice", emoji: "😅", isCorrect: false }
      ]
    },
    {
      title: "History Quiz",
      emoji: "📜",
      situation: "Friend whispers answers during a history quiz. What is your choice?",
      choices: [
        { id: 1, text: "Use their answers", emoji: "🤭", isCorrect: false },
        { id: 2, text: "Answer honestly on your own", emoji: "🖊️", isCorrect: true },
        { id: 3, text: "Mix their answers with yours", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      title: "Science Lab",
      emoji: "🔬",
      situation: "Friend wants to share lab results to cheat. What do you do?",
      choices: [
        { id: 1, text: "Copy their results", emoji: "😬", isCorrect: false },
        { id: 2, text: "Do your own experiment honestly", emoji: "🧪", isCorrect: true },
        { id: 3, text: "Change some numbers to match theirs", emoji: "😐", isCorrect: false }
      ]
    },
    {
      title: "Final Exam",
      emoji: "🎓",
      situation: "Friend tries to give you answers secretly in the exam hall. Your choice?",
      choices: [
        { id: 1, text: "Accept secretly", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Say no and focus on your own work", emoji: "✋", isCorrect: true },
        { id: 3, text: "Peek occasionally", emoji: "👁️", isCorrect: false }
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];
  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoiceData) return;
    if (selectedChoiceData.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      // ✅ After the last question, go to next game
      navigate("/student/moral-values/kids/reflex-honesty");
    }
  };

  return (
    <GameShell
      title="Cheating Offer Story"
      subtitle="Make Honest Choices"
      onNext={handleNext}
      nextEnabled={showFeedback}  /* ✅ always show next after feedback */
      showGameOver={false}
      score={coins}
      gameId="moral-kids-98"
      gameType="educational"
      totalLevels={100}
      currentLevel={98}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentQuestion.title} ({currentIndex + 1}/{questions.length})
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentQuestion.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
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
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Honest Hero!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData?.text}
            </p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! Refusing to cheat shows honesty and integrity. True success comes from doing your own work.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white font-bold hover:opacity-90 transition"
                >
                  {currentIndex < questions.length - 1 ? "Next Question ➡️" : "Finish Story ✅"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Cheating is never the right choice. Always do your own work honestly!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔄
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CheatingOfferStory;
