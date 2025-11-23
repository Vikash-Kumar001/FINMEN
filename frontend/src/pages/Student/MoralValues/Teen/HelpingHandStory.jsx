import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HelpingHandStory = () => {
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
      id: 1,
      title: "Books on Floor 📚",
      situation: "Your classmate drops all their books in the hallway. Everyone laughs. What do you do?",
      choices: [
        { id: 1, text: "Help pick up the books", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Ignore and walk away", emoji: "🚶‍♀️", isCorrect: false },
        { id: 3, text: "Laugh with others", emoji: "😆", isCorrect: false }
      ],
    },
    {
      id: 2,
      title: "Fallen Lunch 🍱",
      situation: "Your friend’s lunchbox falls and food spills on the floor. What would you do?",
      choices: [
        { id: 1, text: "Help them clean and share your food", emoji: "❤️", isCorrect: true },
        { id: 2, text: "Ignore and continue eating", emoji: "🍔", isCorrect: false },
        { id: 3, text: "Tell others to come and see", emoji: "📢", isCorrect: false }
      ],
    },
    {
      id: 3,
      title: "Heavy Bag 🎒",
      situation: "A younger student struggles with a heavy bag up the stairs. What do you do?",
      choices: [
        { id: 1, text: "Offer to help carry the bag", emoji: "💪", isCorrect: true },
        { id: 2, text: "Run ahead quickly", emoji: "🏃", isCorrect: false },
        { id: 3, text: "Watch silently", emoji: "👀", isCorrect: false }
      ],
    },
    {
      id: 4,
      title: "New Student 🧒",
      situation: "A new student sits alone at lunch. What would you do?",
      choices: [
        { id: 1, text: "Invite them to sit with you", emoji: "😊", isCorrect: true },
        { id: 2, text: "Ignore and sit with your group", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Whisper about them", emoji: "😬", isCorrect: false }
      ],
    },
    {
      id: 5,
      title: "Classroom Mess 🧹",
      situation: "After art class, the floor is messy with paper scraps. What would you do?",
      choices: [
        { id: 1, text: "Help clean even if it’s not your mess", emoji: "🧽", isCorrect: true },
        { id: 2, text: "Leave immediately", emoji: "🚪", isCorrect: false },
        { id: 3, text: "Blame someone else", emoji: "😒", isCorrect: false }
      ],
    },
  ];

  const currentStory = stories[currentQuestion];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(coins + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate("/student/moral-values/teen/reflex-comfort");
    }
  };

  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Helping Hand Story"
      subtitle="Being Kind and Supportive"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === stories.length - 1 && showFeedback}
      score={coins}
      gameId="moral-teen-helping-hand"
      gameType="moral"
      totalLevels={100}
      currentLevel={28}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.choices[0].emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
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
              {selectedChoiceData.isCorrect ? "💫 Great Helper!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Helping others makes school a kinder place! Small actions like this build friendship and trust.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That wasn’t the most kind choice. Always try to help or comfort others when they need you.
                  </p>
                </div>
              </>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < stories.length - 1 ? "Next Story ➜" : "Finish Game 🎉"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HelpingHandStory;
