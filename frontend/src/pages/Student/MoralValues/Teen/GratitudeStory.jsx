import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GratitudeStory = () => {
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
      title: "Shared Notes",
      emoji: "📔",
      situation: "Your friend shares their study notes with you before the exam. What do you do?",
      choices: [
        { id: 1, text: "Use them without saying anything", emoji: "😐", isCorrect: false },
        { id: 2, text: "Thank them genuinely and offer to help back", emoji: "🙏", isCorrect: true },
        { id: 3, text: "Just say 'okay' and move on", emoji: "👍", isCorrect: false }
      ]
    },
    {
      title: "Lunch Box Help",
      emoji: "🍱",
      situation: "A classmate shares their lunch when you forgot yours. What do you say?",
      choices: [
        { id: 1, text: "Ignore and eat quietly", emoji: "😶", isCorrect: false },
        { id: 2, text: "Say thank you and share your snacks next time", emoji: "😊", isCorrect: true },
        { id: 3, text: "Say 'finally!' and eat fast", emoji: "😅", isCorrect: false }
      ]
    },
    {
      title: "Teacher’s Help",
      emoji: "👩‍🏫",
      situation: "Your teacher spends extra time helping you understand a tough topic.",
      choices: [
        { id: 1, text: "Leave class without saying anything", emoji: "😶", isCorrect: false },
        { id: 2, text: "Thank them and promise to practice more", emoji: "📚", isCorrect: true },
        { id: 3, text: "Complain it was too long", emoji: "🙄", isCorrect: false }
      ]
    },
    {
      title: "Sibling Support",
      emoji: "👫",
      situation: "Your sibling helps you with a project late at night. What should you do?",
      choices: [
        { id: 1, text: "Say thanks and do the same when they need help", emoji: "🤗", isCorrect: true },
        { id: 2, text: "Say 'you had to help anyway'", emoji: "😏", isCorrect: false },
        { id: 3, text: "Ignore it", emoji: "😶", isCorrect: false }
      ]
    },
    {
      title: "Community Cleaner",
      emoji: "🧹",
      situation: "You see a cleaner working hard in your school corridor.",
      choices: [
        { id: 1, text: "Say thank you for keeping it clean", emoji: "🙂", isCorrect: true },
        { id: 2, text: "Walk past without noticing", emoji: "😐", isCorrect: false },
        { id: 3, text: "Laugh with friends", emoji: "🙃", isCorrect: false }
      ]
    }
  ];

  const currentStory = stories[currentQuestion];
  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins(prev => prev + 5);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate("/student/moral-values/teen/reflex-politeness");
    }
  };

  return (
    <GameShell
      title="Gratitude Stories"
      subtitle="Expressing Thanks"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === stories.length - 1}
      score={totalCoins}
      gameId="moral-teen-12"
      gameType="moral"
      totalLevels={20}
      currentLevel={12}
      showConfetti={showFeedback && coins > 0}
      maxScore={20} // Max score is total number of questions (all correct)
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
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
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
              {selectedChoiceData.isCorrect ? "💖 Grateful Person!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! Showing gratitude spreads kindness and strengthens trust. Keep it up!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +5 Coins Earned! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Gratitude matters! Next time, say thank you and show appreciation — it makes a difference.
                  </p>
                </div>
              </>
            )}
            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < stories.length - 1 ? "Next Story ➜" : "Finish 🎉"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GratitudeStory;
