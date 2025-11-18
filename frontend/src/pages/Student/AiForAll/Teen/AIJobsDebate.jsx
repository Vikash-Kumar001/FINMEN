import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIJobsDebate = () => {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [coins, setCoins] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Automated Factory",
      emoji: "🏭",
      situation: "AI machines are replacing assembly line workers. What should a teen do?",
      choices: [
        { id: 1, text: "Panic and give up", emoji: "😱", isCorrect: false },
        { id: 2, text: "Learn new skills to adapt", emoji: "📚", isCorrect: true },
        { id: 3, text: "Blame AI", emoji: "🤖", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Self-Driving Taxis",
      emoji: "🚖",
      situation: "AI is driving taxis instead of humans. How should teens react?",
      choices: [
        { id: 1, text: "Look for new opportunities", emoji: "🔍", isCorrect: true },
        { id: 2, text: "Stop trying to drive", emoji: "🛑", isCorrect: false },
        { id: 3, text: "Protest against AI", emoji: "✊", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "AI in Offices",
      emoji: "🏢",
      situation: "Some office jobs are automated by AI. What should teens do?",
      choices: [
        { id: 1, text: "Learn digital skills", emoji: "💻", isCorrect: true },
        { id: 2, text: "Ignore changes", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Criticize AI publicly", emoji: "🗣️", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "AI in Healthcare",
      emoji: "🏥",
      situation: "AI tools can now diagnose basic illnesses. What is the smart choice?",
      choices: [
        { id: 1, text: "Learn healthcare skills and AI tech", emoji: "🩺", isCorrect: true },
        { id: 2, text: "Complain that AI is taking jobs", emoji: "😤", isCorrect: false },
        { id: 3, text: "Avoid healthcare careers", emoji: "🚫", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "AI Content Creation",
      emoji: "✍️",
      situation: "AI can write articles and create media. What should teens do?",
      choices: [
        { id: 1, text: "Learn creative & tech skills", emoji: "🎨", isCorrect: true },
        { id: 2, text: "Ignore AI creativity", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Argue AI should be banned", emoji: "🚫", isCorrect: false }
      ]
    }
  ];

  const currentStoryData = stories[currentStory];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStoryData.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(prev => prev + 10);
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
    if (currentStory < stories.length - 1) {
      setCurrentStory(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/teen/sustainability-quiz"); // Update next path
    }
  };

  const selectedChoiceData = currentStoryData.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="AI & Jobs Debate"
      subtitle={`Story ${currentStory + 1} of ${stories.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId="ai-teen-86"
      gameType="ai"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">{currentStoryData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStoryData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentStoryData.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {currentStoryData.choices.map(choice => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "💡 Smart Choice!" : "Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold">
                You earned 10 Coins! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIJobsDebate;
