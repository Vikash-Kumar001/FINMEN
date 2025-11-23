import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BrokenToyStory = () => {
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
      title: "Broken Toy Story",
      emoji: "🧸",
      situation: "Your friend accidentally breaks your favorite toy. What will you do?",
      choices: [
        { id: 1, text: "Shout and call them names", emoji: "😡", isCorrect: false },
        { id: 2, text: "Tell a teacher immediately", emoji: "🧑‍🏫", isCorrect: false },
        { id: 3, text: "Forgive and say 'It's okay'", emoji: "🤗", isCorrect: true },
        { id: 4, text: "Stop talking to them forever", emoji: "🚫", isCorrect: false },
        { id: 5, text: "Break their toy too", emoji: "🔨", isCorrect: false }
      ]
    },
    {
      title: "Lost Pencil",
      emoji: "✏️",
      situation: "You find your classmate’s lost pencil on the floor. What will you do?",
      choices: [
        { id: 1, text: "Keep it for yourself", emoji: "😈", isCorrect: false },
        { id: 2, text: "Give it back to them", emoji: "😊", isCorrect: true },
        { id: 3, text: "Throw it away", emoji: "🗑️", isCorrect: false },
        { id: 4, text: "Hide it as a joke", emoji: "🙈", isCorrect: false },
        { id: 5, text: "Ask someone else to return it", emoji: "🧍", isCorrect: false }
      ]
    },
    {
      title: "Sharing Snacks",
      emoji: "🍪",
      situation: "Your friend forgot their lunch today. What should you do?",
      choices: [
        { id: 1, text: "Share your food with them", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Ignore them", emoji: "😐", isCorrect: false },
        { id: 3, text: "Tease them for forgetting", emoji: "😏", isCorrect: false },
        { id: 4, text: "Complain to teacher", emoji: "👩‍🏫", isCorrect: false },
        { id: 5, text: "Eat secretly", emoji: "🤫", isCorrect: false }
      ]
    },
    {
      title: "Helping Elderly",
      emoji: "👵",
      situation: "You see an elderly person struggling with heavy bags. What will you do?",
      choices: [
        { id: 1, text: "Offer to help carry them", emoji: "💪", isCorrect: true },
        { id: 2, text: "Walk away quickly", emoji: "🏃‍♀️", isCorrect: false },
        { id: 3, text: "Wait for someone else to help", emoji: "🕒", isCorrect: false },
        { id: 4, text: "Laugh at them", emoji: "😅", isCorrect: false },
        { id: 5, text: "Take a photo", emoji: "📸", isCorrect: false }
      ]
    },
    {
      title: "Classroom Cleanliness",
      emoji: "🧹",
      situation: "You see trash on the classroom floor. What should you do?",
      choices: [
        { id: 1, text: "Pick it up and throw it in the bin", emoji: "🗑️", isCorrect: true },
        { id: 2, text: "Kick it under the desk", emoji: "👟", isCorrect: false },
        { id: 3, text: "Blame someone else", emoji: "😠", isCorrect: false },
        { id: 4, text: "Wait for janitor to clean", emoji: "🧍‍♂️", isCorrect: false },
        { id: 5, text: "Ignore it", emoji: "🙄", isCorrect: false }
      ]
    }
  ];

  const story = stories[currentQuestion];
  const selectedChoiceData = story.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = story.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1);
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
      setShowFeedback(true);
      setCurrentQuestion(stories.length); // trigger final screen
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCurrentQuestion(0);
    resetFeedback();
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/poster-choose-peace");
  };

  // Final result screen
  if (currentQuestion === stories.length) {
    return (
      <GameShell
        title="Broken Toy Story"
      score={coins}
        subtitle="Learning Forgiveness and Kindness"
        onNext={handleNextGame}
        nextEnabled={coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
        showGameOver={true}
        
        totalLevels={100}
        currentLevel={85}
        showConfetti={coins >= 3}
        gameId="moral-kids-85"
        gameType="educational"
        backPath="/games/moral-values/kids"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-7xl mb-4">🌟</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Great Job!
          </h2>
          <p className="text-white/80 mb-6">
            You finished all 5 moral situations with kindness and understanding.  
            Keep being a role model of peace and forgiveness! 💖
          </p>
          <p className="text-yellow-400 text-2xl font-bold">
            Total Coins: {coins} 🪙
          </p>
          <button
            onClick={handleTryAgain}
            className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            Play Again
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title={story.title}
      subtitle="Choose the Peaceful Action"
      onNext={handleNextGame}
      nextEnabled={false}
      showGameOver={false}
      
      gameId="moral-kids-85"
      gameType="educational"
      totalLevels={100}
      currentLevel={85}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{story.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{story.title}</h2>
            <div className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{story.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {story.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "🌟 Good Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <p className="text-green-400 mb-4">
                  Great! That’s the peaceful and kind thing to do. 💖
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question →
                </button>
              </>
            ) : (
              <>
                <p className="text-red-400 mb-4">
                  That choice doesn’t spread peace. Try to think kindly!
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BrokenToyStory;
