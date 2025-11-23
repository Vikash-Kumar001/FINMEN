import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClassArgumentStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "The Loud Argument",
      emoji: "🗣️",
      situation: "Two classmates argue loudly during group work. What do you do?",
      choices: [
        { id: 1, text: "Ignore and continue your work", emoji: "😐", isCorrect: false },
        { id: 2, text: "Try to calm them down and mediate", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Take sides in the argument", emoji: "😤", isCorrect: false },
      ],
      feedback:
        "Mediating calmly helps reduce conflict and builds teamwork. You earn respect for being fair!",
    },
    {
      id: 2,
      title: "Blame Game",
      emoji: "🧩",
      situation: "A group member blames another for a mistake. What’s your move?",
      choices: [
        { id: 1, text: "Stay silent to avoid involvement", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Encourage them to find a solution together", emoji: "💬", isCorrect: true },
        { id: 3, text: "Join the blame to support your friend", emoji: "🙄", isCorrect: false },
      ],
      feedback:
        "Good leaders promote teamwork, not blame. You helped them focus on solutions!",
    },
    {
      id: 3,
      title: "Lunch Fight",
      emoji: "🍱",
      situation: "Two friends fight over a missing lunchbox. What do you do?",
      choices: [
        { id: 1, text: "Take one friend’s side", emoji: "👊", isCorrect: false },
        { id: 2, text: "Help them talk it out and find the lunchbox", emoji: "🕊️", isCorrect: true },
        { id: 3, text: "Walk away and ignore", emoji: "🚶", isCorrect: false },
      ],
      feedback:
        "Helping them talk it out promotes peace and restores friendship. Great job!",
    },
    {
      id: 4,
      title: "Teacher’s Criticism",
      emoji: "🧑‍🏫",
      situation: "A classmate gets scolded and starts crying. How do you respond?",
      choices: [
        { id: 1, text: "Laugh or gossip with others", emoji: "😂", isCorrect: false },
        { id: 2, text: "Comfort them and offer support", emoji: "🤗", isCorrect: true },
        { id: 3, text: "Pretend not to notice", emoji: "🙈", isCorrect: false },
      ],
      feedback:
        "Empathy strengthens friendships. Comforting others shows leadership and kindness.",
    },
    {
      id: 5,
      title: "Lost Pencil Case",
      emoji: "✏️",
      situation: "A classmate accuses another of stealing their pencil case. You see it under a desk. What do you do?",
      choices: [
        { id: 1, text: "Stay quiet and let them argue", emoji: "😶", isCorrect: false },
        { id: 2, text: "Show it to them and help end the argument", emoji: "🙋", isCorrect: true },
        { id: 3, text: "Join in blaming the accused", emoji: "😡", isCorrect: false },
      ],
      feedback:
        "Honesty and action stop misunderstandings. You brought peace to the class!",
    },
  ];

  const currentStory = stories[currentStoryIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, false);
      setCoins((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setCoins((prev) => (prev >= 3 ? 5 : prev));
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/quiz-on-conflict");
  };

  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Class Argument Story"
      score={coins}
      subtitle="Mediation and Peace"
      onNext={handleNext}
      nextEnabled={showFeedback && currentStoryIndex === stories.length - 1 && coins >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && currentStoryIndex === stories.length - 1 && coins >= 3}
      
      gameId="moral-teen-81"
      gameType="moral"
      totalLevels={100}
      currentLevel={81}
      showConfetti={showFeedback && currentStoryIndex === stories.length - 1 && coins >= 3}
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
              {currentStory.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🕊️ Peacemaker!" : "🤔 Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentStory.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +1 Coin Earned 🪙
                </p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Try to think of a more peaceful and fair action next time.
                </p>
              </div>
            )}

            {currentStoryIndex < stories.length - 1 ? (
              <button
                onClick={handleNextStory}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Story ➡️
              </button>
            ) : (
              selectedChoiceData.isCorrect && (
                <p className="text-center text-yellow-400 mt-4 text-lg font-semibold">
                  Final Story Complete! 🎉
                </p>
              )
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ClassArgumentStory;
