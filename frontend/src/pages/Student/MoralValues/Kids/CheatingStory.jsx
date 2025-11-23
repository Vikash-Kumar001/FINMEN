import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CheatingStory = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      title: "The Cheating Friend",
      emoji: "📝",
      situation: "Your friend is cheating during a test and asks you to join. What should you do?",
      choices: [
        { id: 1, text: "Join them - everyone does it", emoji: "😏", isCorrect: false },
        { id: 2, text: "Say no and do your own work", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Pretend not to notice", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      title: "The Found Wallet",
      emoji: "👛",
      situation: "You find a wallet with money at school. What’s the right thing to do?",
      choices: [
        { id: 1, text: "Keep it and say nothing", emoji: "💰", isCorrect: false },
        { id: 2, text: "Tell a teacher or hand it in", emoji: "🧑‍🏫", isCorrect: true },
        { id: 3, text: "Ask your friends what to do", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      title: "The Homework Copy",
      emoji: "📚",
      situation: "Your classmate forgot their homework and wants to copy yours. What should you do?",
      choices: [
        { id: 1, text: "Let them copy quickly", emoji: "📝", isCorrect: false },
        { id: 2, text: "Say no, but help them learn", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Ignore them", emoji: "🙄", isCorrect: false }
      ]
    },
    {
      title: "The Online Rumor",
      emoji: "💻",
      situation: "Someone sends you a rumor about a classmate. What should you do?",
      choices: [
        { id: 1, text: "Share it to more friends", emoji: "📱", isCorrect: false },
        { id: 2, text: "Delete it and don’t spread it", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Laugh and ignore", emoji: "😅", isCorrect: false }
      ]
    },
    {
      title: "The Team Project",
      emoji: "🧩",
      situation: "You worked hard on a project, but your team takes all the credit. What should you do?",
      choices: [
        { id: 1, text: "Argue and get angry", emoji: "😠", isCorrect: false },
        { id: 2, text: "Talk calmly with the teacher", emoji: "🗣️", isCorrect: true },
        { id: 3, text: "Do nothing and stay upset", emoji: "😔", isCorrect: false }
      ]
    }
  ];

  const currentStory = stories[currentQuestion];
  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/kids/poster-of-honesty");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Cheating Story"
      subtitle="Being Honest in Everyday Situations"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === stories.length - 1 && showFeedback}
      score={coins}
      gameId="moral-kids-5"
      gameType="educational"
      totalLevels={20}
      currentLevel={5}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>
            <div className="space-y-3 mb-6">
              {currentStory.choices.map(choice => (
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
              {selectedChoiceData.isCorrect ? "🌟 Honest Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great job! Honesty builds trust and good character. Keep choosing what’s right!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +5 Coins Earned! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion < stories.length - 1 ? "Next Story ➜" : "Finish Game 🎉"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That’s not quite right — honesty is the best path. Try again!
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

        <p className="text-center text-white/70 text-sm">
          Story {currentQuestion + 1} of {stories.length}
        </p>
      </div>
    </GameShell>
  );
};

export default CheatingStory;
