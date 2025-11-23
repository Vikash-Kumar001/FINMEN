import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WhiteLieQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Can a 'small' or 'white' lie be harmless?",
      emoji: "🤔",
      choices: [
        { id: 1, text: "Yes - small lies don't hurt anyone", emoji: "😊", isCorrect: false },
        { id: 2, text: "No - truth is always safer and better", emoji: "💎", isCorrect: true },
        { id: 3, text: "Sometimes it's okay to lie", emoji: "🤷", isCorrect: false },
      ],
    },
    {
      text: "If telling the truth might upset a friend, what should you do?",
      emoji: "💬",
      choices: [
        { id: 1, text: "Lie to protect their feelings", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Tell the truth kindly", emoji: "❤️", isCorrect: true },
        { id: 3, text: "Ignore it completely", emoji: "😶", isCorrect: false },
      ],
    },
    {
      text: "What happens when you lie to avoid punishment?",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "You feel relieved forever", emoji: "😅", isCorrect: false },
        { id: 2, text: "You lose trust and feel guilty", emoji: "😔", isCorrect: true },
        { id: 3, text: "Nothing changes", emoji: "🤷", isCorrect: false },
      ],
    },
    {
      text: "When is honesty most important?",
      emoji: "🌟",
      choices: [
        { id: 1, text: "Only when it's easy", emoji: "🙂", isCorrect: false },
        { id: 2, text: "Even when it's hard", emoji: "💪", isCorrect: true },
        { id: 3, text: "Never, honesty causes trouble", emoji: "🙃", isCorrect: false },
      ],
    },
    {
      text: "Why should we avoid even 'harmless' lies?",
      emoji: "🧭",
      choices: [
        { id: 1, text: "Because lies weaken trust", emoji: "💔", isCorrect: true },
        { id: 2, text: "Because people expect lies", emoji: "😏", isCorrect: false },
        { id: 3, text: "Because it’s fun sometimes", emoji: "😜", isCorrect: false },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion?.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/reflex-spot-fake");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="White Lie Quiz"
      subtitle="Understanding Truth"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestionIndex === questions.length - 1}
      score={coins}
      gameId="moral-teen-2"
      gameType="moral"
      totalLevels={20}
      currentLevel={2}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
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
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✨ Correct!" : "Think Deeper..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Great! Honesty strengthens trust and self-respect. Even small lies can weaken
                    relationships. Truth may be hard but it always builds character.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +3 Coins Earned! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Not quite! Even harmless lies can grow and cause harm. Truth may be uncomfortable,
                    but it always earns long-term respect.
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

export default WhiteLieQuiz;
