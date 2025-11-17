import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIEthicsQuiz = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Should AI follow rules?",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "Yes - AI must follow rules", emoji: "✓", isCorrect: true },
        { id: 2, text: "No - AI can ignore rules", emoji: "✗", isCorrect: false }
      ]
    },
    {
      text: "Should AI protect user privacy?",
      emoji: "🔒",
      choices: [
        { id: 1, text: "Yes, privacy is important", emoji: "🛡️", isCorrect: true },
        { id: 2, text: "No, it can share data freely", emoji: "📤", isCorrect: false }
      ]
    },
    {
      text: "Should AI avoid harmful actions?",
      emoji: "⚠️",
      choices: [
        { id: 1, text: "Yes, prevent harm", emoji: "🚫", isCorrect: true },
        { id: 2, text: "No, it can do anything", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      text: "Should AI be transparent in decisions?",
      emoji: "📝",
      choices: [
        { id: 1, text: "Yes, explain decisions", emoji: "🔍", isCorrect: true },
        { id: 2, text: "No, secrecy is fine", emoji: "🤐", isCorrect: false }
      ]
    },
    {
      text: "Should AI be fair to all people?",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "Yes, fairness matters", emoji: "🤝", isCorrect: true },
        { id: 2, text: "No, bias is acceptable", emoji: "😐", isCorrect: false }
      ]
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [coins, setCoins] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find(c => c.id === selectedChoice);
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = question.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      setCoins(prev => prev + 5);
      showCorrectAnswerFeedback(5, true);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/kids/good-ai-badge"); // Update next path
    }
  };

  return (
    <GameShell
      title="AI Ethics Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={isLastQuestion && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId={`ai-kids-97-${currentQuestion + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={97 + currentQuestion}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {question.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : choice.isCorrect
                      ? 'bg-green-500/20 border-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 border-red-400 hover:bg-red-500/30'
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-2xl text-center">{choice.text}</div>
                </button>
              ))}
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
            <div className="text-8xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✅ Correct!" : "❌ Think Again"}
            </h2>

            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You earned 5 Coins! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {selectedChoiceData.isCorrect && (
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {isLastQuestion ? "Finish" : "Next Question"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIEthicsQuiz;
