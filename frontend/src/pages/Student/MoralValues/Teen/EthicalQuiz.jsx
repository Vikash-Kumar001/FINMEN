import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EthicalQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is it okay to copy a friend’s homework just once?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Yes, if it’s only one time", emoji: "😅", isCorrect: false },
        { id: 2, text: "No, it’s still dishonest", emoji: "🚫", isCorrect: true },
        { id: 3, text: "If the teacher won’t notice, it’s fine", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "You find your friend cheating in an exam. What’s ethical?",
      emoji: "📝",
      choices: [
        { id: 1, text: "Help them quietly", emoji: "🤐", isCorrect: false },
        { id: 2, text: "Remind them it’s wrong", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Ignore it—it’s their choice", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Is it right to break promises if no one will know?",
      emoji: "🤔",
      choices: [
        { id: 1, text: "Yes, if it benefits you", emoji: "💰", isCorrect: false },
        { id: 2, text: "No, honesty matters even when unseen", emoji: "💎", isCorrect: true },
        { id: 3, text: "Depends on situation", emoji: "🤷‍♂️", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Should you take credit for group work you didn’t do?",
      emoji: "👩‍🏫",
      choices: [
        { id: 1, text: "Yes, if others won’t speak up", emoji: "😏", isCorrect: false },
        { id: 2, text: "No, give credit fairly", emoji: "🙌", isCorrect: true },
        { id: 3, text: "Sometimes it’s okay", emoji: "😬", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "If your sibling breaks a vase, do you lie for them?",
      emoji: "🏠",
      choices: [
        { id: 1, text: "Yes, to protect them", emoji: "❤️", isCorrect: false },
        { id: 2, text: "No, lying makes things worse", emoji: "🧭", isCorrect: true },
        { id: 3, text: "Maybe, if parents are angry", emoji: "😰", isCorrect: false }
      ]
    }
  ];

  const question = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = question.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setTotalScore(prev => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/reflex-right-vs-easy");
    }
  };

  const selectedChoiceData = question.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Ethical Quiz"
      subtitle="Choosing the Right Path"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={totalScore}
      gameId="moral-teen-92"
      gameType="moral"
      totalLevels={100}
      currentLevel={92}
      showConfetti={showFeedback && coins > 0}
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {question.choices.map(choice => (
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
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Great choice! Staying ethical even in small things builds trust and respect.
                    Always choose honesty and fairness — it shapes strong character and integrity.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 3 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That choice may seem easy, but it isn’t ethical. Ethics means doing the right thing,
                    even when no one is watching. Try again and choose what’s right!
                  </p>
                </div>
              </>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EthicalQuiz;
