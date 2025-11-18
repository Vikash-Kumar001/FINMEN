import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendlyAIQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 5 sequential AI ethics questions
  const questions = [
    {
      text: "Should AI help people?",
      emoji: "🤖",
      choices: [
        { id: 1, text: "Yes - AI should help us", emoji: "✅", isCorrect: true },
        { id: 2, text: "No - AI should not help", emoji: "❌", isCorrect: false }
      ],
      feedback: "Yes! AI should help people! AI is created to make our lives better, easier, and safer."
    },
    {
      text: "Should AI be kind and fair to everyone?",
      emoji: "💖",
      choices: [
        { id: 1, text: "Yes, it should be fair", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "No, it can be unfair", emoji: "🚫", isCorrect: false }
      ],
      feedback: "Correct! A good AI must treat everyone fairly and equally without bias!"
    },
    {
      text: "Should AI respect privacy?",
      emoji: "🔒",
      choices: [
        { id: 1, text: "Yes - Keep data safe", emoji: "🛡️", isCorrect: true },
        { id: 2, text: "No - Anyone can see it", emoji: "👀", isCorrect: false }
      ],
      feedback: "Right! AI should protect your data and respect privacy at all times."
    },
    {
      text: "Should we teach AI what is right or wrong?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Yes - We must teach AI ethics", emoji: "👩‍🏫", isCorrect: true },
        { id: 2, text: "No - AI learns alone", emoji: "🤷‍♀️", isCorrect: false }
      ],
      feedback: "Exactly! Humans must teach AI what’s right and wrong to make it helpful."
    },
    {
      text: "Should AI replace kindness and teamwork?",
      emoji: "🧠",
      choices: [
        { id: 1, text: "No - Humans should still be kind", emoji: "❤️", isCorrect: true },
        { id: 2, text: "Yes - Let AI do everything", emoji: "🤖", isCorrect: false }
      ],
      feedback: "Correct! AI can help, but kindness and teamwork are human superpowers!"
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const choice = question.choices.find(c => c.id === selectedChoice);
    const isCorrect = choice.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate("/student/ai-for-all/kids/robot-emotion-story"); // ✅ next game link
    }
  };

  const selectedChoiceData = questions[currentQuestion].choices.find(
    (c) => c.id === selectedChoice
  );

  const question = questions[currentQuestion];

  return (
    <GameShell
      title="Friendly AI Quiz"
      subtitle="AI Ethics for Kids"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-kids-18"
      gameType="ai"
      totalLevels={100}
      currentLevel={18}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          // 🧩 Question UI
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto ">
            <div className="text-9xl mb-4 text-center">{question.emoji}</div>
            <p className="text-white text-2xl leading-relaxed text-center font-semibold mb-6">
              {question.text}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {question.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-xl text-center">{choice.text}</div>
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
              Confirm Answer
            </button>
          </div>
        ) : (
          // 🎉 Feedback UI
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">
              {selectedChoiceData?.isCorrect ? "🌟" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "Awesome!" : "Think Again..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-lg">{question.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold">+5 Coins 🪙</p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-lg">
                  Not quite! {question.feedback}
                </p>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < questions.length - 1 ? "Next Question →" : "Finish Quiz 🎯"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FriendlyAIQuiz;
