import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CyberbullyingStoryy = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      situation: "A robot posts a mean comment about your classmate online. What should you do?",
      choices: [
        { id: 1, text: "Report the post", emoji: "📣", isCorrect: true },
        { id: 2, text: "Like the post", emoji: "👍", isCorrect: false },
        { id: 3, text: "Ignore and share it", emoji: "📤", isCorrect: false }
      ]
    },
    {
      situation: "The robot spreads rumors about a friend. How should you act?",
      choices: [
        { id: 1, text: "Report the robot", emoji: "📣", isCorrect: true },
        { id: 2, text: "Forward the rumors", emoji: "📤", isCorrect: false },
        { id: 3, text: "Laugh at it", emoji: "😂", isCorrect: false }
      ]
    },
    {
      situation: "You see a robot tagging someone in hurtful messages. Your action?",
      choices: [
        { id: 1, text: "Report to platform", emoji: "📣", isCorrect: true },
        { id: 2, text: "Join the bullying", emoji: "👎", isCorrect: false },
        { id: 3, text: "Ignore it", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      situation: "Robot posts a fake negative review about your friend. What do you do?",
      choices: [
        { id: 1, text: "Report the post", emoji: "📣", isCorrect: true },
        { id: 2, text: "Comment negatively too", emoji: "💬", isCorrect: false },
        { id: 3, text: "Share to others", emoji: "📤", isCorrect: false }
      ]
    },
    {
      situation: "Robot sends harmful messages to multiple users. How should a teen respond?",
      choices: [
        { id: 1, text: "Report the robot", emoji: "📣", isCorrect: true },
        { id: 2, text: "Copy the messages", emoji: "📤", isCorrect: false },
        { id: 3, text: "React angrily", emoji: "😡", isCorrect: false }
      ]
    }
  ];

  const currentQData = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQData.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(2, true); // reward +2 per correct
      setCoins(prev => prev + 2);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/teen/ethics-in-ai-quiz"); // update next path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const selectedChoiceData = currentQData.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Cyberbullying Story"
      subtitle="Practice Online Empathy"
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={showFeedback && selectedChoiceData?.isCorrect && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-77"
      gameType="ai"
      totalLevels={20}
      currentLevel={77}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect && currentQuestion === questions.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentQData.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQData.choices.map(choice => (
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
              Confirm Action
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "✅ Good Choice!" : "❌ Wrong Choice!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold">
                +2 Coins Earned 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}

            {selectedChoiceData.isCorrect && currentQuestion < questions.length - 1 && (
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                Next ➡️
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CyberbullyingStoryy;
