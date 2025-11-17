import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GoodBadAIQuiz = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    { id: 1, text: "AI helping blind people = Good AI?", emoji: "🤖", correct: "yes" },
    { id: 2, text: "AI spreading false news = Good AI?", emoji: "📰", correct: "no" },
    { id: 3, text: "AI recommending safe routes = Good AI?", emoji: "🛣️", correct: "yes" },
    { id: 4, text: "AI ignoring human privacy = Good AI?", emoji: "🔓", correct: "no" },
    { id: 5, text: "AI teaching kids educational games = Good AI?", emoji: "🎮", correct: "yes" },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const currentQuestionData = questions[currentQuestion];

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
  };

  const handleConfirm = () => {
    const isCorrect = selectedChoice === currentQuestionData.correct;

    if (isCorrect) {
      showCorrectAnswerFeedback(5, false); // each correct = +5 points internally
      setCoins(prev => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedChoice(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCurrentQuestion(0);
    resetFeedback();
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/kids/robot-honesty-story"); // next game path
  };

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <GameShell
      title="Good AI vs Bad AI Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleFinish}
      nextEnabled={isLastQuestion && showFeedback && coins > 0}
      showGameOver={isLastQuestion && showFeedback && coins > 0}
      score={coins}
      gameId="ai-kids-76"
      gameType="ai"
      totalLevels={100}
      currentLevel={76}
      showConfetti={isLastQuestion && showFeedback && coins > 0}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{currentQuestionData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("yes")}
                className={`border-3 rounded-xl p-8 transition-all ${
                  selectedChoice === "yes"
                    ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                    : 'bg-green-500/20 border-green-400 hover:bg-green-500/30'
                }`}
              >
                <div className="text-5xl mb-2">✅</div>
                <div className="text-white font-bold text-2xl">YES</div>
              </button>
              <button
                onClick={() => handleChoice("no")}
                className={`border-3 rounded-xl p-8 transition-all ${
                  selectedChoice === "no"
                    ? 'bg-red-500/50 border-red-400 ring-2 ring-white'
                    : 'bg-red-500/20 border-red-400 hover:bg-red-500/30'
                }`}
              >
                <div className="text-5xl mb-2">❌</div>
                <div className="text-white font-bold text-2xl">NO</div>
              </button>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{selectedChoice === currentQuestionData.correct ? "✨" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoice === currentQuestionData.correct ? "Correct!" : "Oops!"}
            </h2>

            {selectedChoice === currentQuestionData.correct ? (
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Yes! This is an example of {currentQuestionData.correct === "yes" ? "Good AI" : "Bad AI"}.
                  Ethical AI helps humans safely and fairly.
                </p>
              </div>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Actually, this is an example of {currentQuestionData.correct === "yes" ? "Good AI" : "Bad AI"}.
                </p>
              </div>
            )}

            {isLastQuestion ? (
              selectedChoice !== currentQuestionData.correct && (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              )
            ) : (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                Next Question
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GoodBadAIQuiz;
