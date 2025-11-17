import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FeedbackMattersStory = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 🧠 5 questions sequence
  const questions = [
    {
      title: "Feedback Matters!",
      emoji: "🤖",
      situation: "The robot gives a wrong answer. How should you respond?",
      choices: [
        { id: 1, text: "Correct it with the right answer", emoji: "✅", isCorrect: true },
        { id: 2, text: "Ignore it and move on", emoji: "❌", isCorrect: false },
        { id: 3, text: "Tell it it’s always wrong", emoji: "⚠️", isCorrect: false }
      ],
      feedback: "Giving correct feedback helps the robot learn and improve. Human-in-the-loop ensures AI grows smarter with our guidance!"
    },
    {
      title: "Learning from Errors!",
      emoji: "💡",
      situation: "AI mislabels a cat as a dog. What should you do?",
      choices: [
        { id: 1, text: "Correct the label to 'Cat'", emoji: "🐱", isCorrect: true },
        { id: 2, text: "Laugh and leave it", emoji: "😂", isCorrect: false },
        { id: 3, text: "Delete the AI model", emoji: "🗑️", isCorrect: false }
      ],
      feedback: "Right! Correcting errors helps AI understand patterns better for future predictions."
    },
    {
      title: "Helping AI Improve",
      emoji: "🧠",
      situation: "AI gives a half-correct answer. What’s best to do?",
      choices: [
        { id: 1, text: "Provide detailed correction", emoji: "📝", isCorrect: true },
        { id: 2, text: "Say nothing", emoji: "🤐", isCorrect: false },
        { id: 3, text: "Say ‘bad robot!’", emoji: "😡", isCorrect: false }
      ],
      feedback: "Correct! Giving specific feedback helps AI fine-tune its understanding and perform better next time."
    },
    {
      title: "Positive Teaching",
      emoji: "🌟",
      situation: "A friend’s chatbot gives silly answers. How can you help?",
      choices: [
        { id: 1, text: "Suggest better training data", emoji: "📊", isCorrect: true },
        { id: 2, text: "Call it useless", emoji: "🚫", isCorrect: false },
        { id: 3, text: "Ignore it", emoji: "🙈", isCorrect: false }
      ],
      feedback: "Yes! Quality training data helps AI perform correctly and more reliably."
    },
    {
      title: "Teamwork with AI",
      emoji: "🤝",
      situation: "AI makes a small mistake. What attitude should you have?",
      choices: [
        { id: 1, text: "Help it improve patiently", emoji: "❤️", isCorrect: true },
        { id: 2, text: "Complain and quit", emoji: "😤", isCorrect: false },
        { id: 3, text: "Say it’s hopeless", emoji: "🙄", isCorrect: false }
      ],
      feedback: "Exactly! Teamwork and patience help AI systems grow with human support — that’s the spirit of Human-in-the-loop!"
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setTotalCoins(prev => prev + 10);
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      // End of quiz
      navigate("/student/ai-for-all/kids/wrong-labels-puzzle");
    }
  };

  const selectedChoiceData = currentQuestion.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Feedback Matters Story"
      subtitle="Human-in-Loop AI"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && currentQuestionIndex === questions.length - 1 && coins > 0}
      score={totalCoins}
      gameId="ai-kids-71"
      gameType="ai"
      totalLevels={100}
      currentLevel={71}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentQuestion.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.situation}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🎯 Correct Feedback!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>

                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question ➡️" : "Finish Quiz ✅"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Providing feedback is key! Correcting the robot with right answers helps it learn effectively.
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

export default FeedbackMattersStory;
