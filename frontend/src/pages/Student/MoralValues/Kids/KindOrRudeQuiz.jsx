import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const KindOrRudeQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Which is kind? (a) Helping (b) Pushing (c) Teasing)",
      emoji: "🤝",
      choices: [
        { id: 1, text: "Helping", emoji: "🤗", isCorrect: true },
        { id: 2, text: "Pushing", emoji: "😡", isCorrect: false },
        { id: 3, text: "Teasing", emoji: "😏", isCorrect: false },
      ],
    },
    {
      text: "Which is kind? (a) Sharing toys (b) Taking toys by force (c) Ignoring a friend)",
      emoji: "🧸",
      choices: [
        { id: 1, text: "Sharing toys", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Taking toys by force", emoji: "😡", isCorrect: false },
        { id: 3, text: "Ignoring a friend", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      text: "Which is kind? (a) Saying thank you (b) Yelling at others (c) Gossiping)",
      emoji: "📝",
      choices: [
        { id: 1, text: "Saying thank you", emoji: "🙏", isCorrect: true },
        { id: 2, text: "Yelling at others", emoji: "😤", isCorrect: false },
        { id: 3, text: "Gossiping", emoji: "🗣️", isCorrect: false },
      ],
    },
    {
      text: "Which is kind? (a) Listening to someone (b) Ignoring them (c) Interrupting)",
      emoji: "👂",
      choices: [
        { id: 1, text: "Listening to someone", emoji: "🫂", isCorrect: true },
        { id: 2, text: "Ignoring them", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Interrupting", emoji: "😬", isCorrect: false },
      ],
    },
    {
      text: "Which is kind? (a) Complimenting (b) Criticizing harshly (c) Laughing at mistakes)",
      emoji: "🌟",
      choices: [
        { id: 1, text: "Complimenting", emoji: "😊", isCorrect: true },
        { id: 2, text: "Criticizing harshly", emoji: "😡", isCorrect: false },
        { id: 3, text: "Laughing at mistakes", emoji: "😏", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(prev => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    resetFeedback();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      navigate("/student/moral-values/kids/reflex-kindnesss"); // replace with actual next route
    }
  };

  const selectedChoiceData = questions[currentQuestion].choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Kind or Rude Quiz"
      subtitle="Recognizing Kindness"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="moral-kids-22"
      gameType="educational"
      totalLevels={100}
      currentLevel={22}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{questions[currentQuestion].emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {questions[currentQuestion].text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {questions[currentQuestion].choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Excellent! Choosing kind actions builds trust and happiness. Keep it up!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 3 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Not quite! Kind actions help everyone feel happy and respected. Try again!
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

export default KindOrRudeQuiz;
