import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FairAIStory = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "The robot is giving prizes only to tall kids. What should you do?",
      emoji: "🤖",
      choices: [
        { id: 1, text: "Make the robot give prizes equally", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "Let it continue giving prizes only to tall kids", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Ignore the robot's behavior", emoji: "😐", isCorrect: false }
      ]
    },
    {
      text: "The AI recommends jobs only to boys. What should you do?",
      emoji: "💼",
      choices: [
        { id: 1, text: "Make the AI recommend fairly", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "Let it recommend boys only", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Ignore the bias", emoji: "😐", isCorrect: false }
      ]
    },
    {
      text: "The AI grades students higher for one region only. What should you do?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Ensure fair grading for all", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "Favor the preferred region", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Do nothing", emoji: "😐", isCorrect: false }
      ]
    },
    {
      text: "The AI only shows popular content to users. What should you do?",
      emoji: "🌐",
      choices: [
        { id: 1, text: "Make content recommendation fair for all", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "Show popular content only", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Ignore the bias", emoji: "😐", isCorrect: false }
      ]
    },
    {
      text: "The AI gives higher scores to one type of music. What should you do?",
      emoji: "🎵",
      choices: [
        { id: 1, text: "Ensure all music types are treated fairly", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "Favor the preferred music", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Ignore it", emoji: "😐", isCorrect: false }
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
      setCoins(prev => prev + 10);
      showCorrectAnswerFeedback(10, true);
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
      navigate("/student/ai-for-all/kids/ethics-decision-game"); // Next game path
    }
  };

  return (
    <GameShell
      title="Fair AI Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={isLastQuestion && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId={`ai-kids-93-${currentQuestion + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={93 + currentQuestion}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{question.text}</h2>

            <div className="space-y-3 mb-6">
              {question.choices.map(choice => (
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
              {selectedChoiceData.isCorrect ? "⚖️ Correct!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">You earned 10 Coins! 🪙</p>
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

export default FairAIStory;
