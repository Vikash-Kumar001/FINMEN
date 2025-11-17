import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendGroupStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      emoji: "🤝",
      title: "Project Credit",
      situation: "Two friends argue over who did more in a group project. You know both worked equally. What do you do?",
      choices: [
        { id: 1, text: "Give credit to both fairly", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "Take one friend's side", emoji: "🙅", isCorrect: false },
        { id: 3, text: "Stay silent to avoid tension", emoji: "😶", isCorrect: false }
      ],
      feedback:
        "Great! Splitting credit fairly keeps friendships strong and builds trust. Fairness shows maturity!"
    },
    {
      id: 2,
      emoji: "🧃",
      title: "The Last Juice",
      situation: "There’s one juice left and two friends want it. What’s the fair action?",
      choices: [
        { id: 1, text: "Split it equally or share turns", emoji: "🫶", isCorrect: true },
        { id: 2, text: "Let the louder friend take it", emoji: "😅", isCorrect: false },
        { id: 3, text: "Take it secretly", emoji: "🥴", isCorrect: false }
      ],
      feedback:
        "Nice! Sharing shows care. It’s not about who’s louder — it’s about being fair and kind."
    },
    {
      id: 3,
      emoji: "🎮",
      title: "Game Time",
      situation: "Your friends can’t agree who plays first. How do you handle it?",
      choices: [
        { id: 1, text: "Use turns or a quick coin toss", emoji: "🪙", isCorrect: true },
        { id: 2, text: "Let your best friend start", emoji: "🎮", isCorrect: false },
        { id: 3, text: "Start yourself quietly", emoji: "🤫", isCorrect: false }
      ],
      feedback:
        "Smart move! Fair rules reduce fights. Everyone deserves a chance — that’s true leadership!"
    },
    {
      id: 4,
      emoji: "📚",
      title: "Group Homework",
      situation: "One member forgets their part. Others are upset. What’s the right step?",
      choices: [
        { id: 1, text: "Help them and remind teamwork", emoji: "🤗", isCorrect: true },
        { id: 2, text: "Complain loudly to teacher", emoji: "📢", isCorrect: false },
        { id: 3, text: "Do their part silently", emoji: "😓", isCorrect: false }
      ],
      feedback:
        "Exactly! Helping your team and communicating kindly solves more than blaming does."
    },
    {
      id: 5,
      emoji: "💬",
      title: "Rumor Issue",
      situation: "A friend spreads a rumor about another. What’s your reaction?",
      choices: [
        { id: 1, text: "Ask them to apologize and make peace", emoji: "🌈", isCorrect: true },
        { id: 2, text: "Join in jokingly", emoji: "😬", isCorrect: false },
        { id: 3, text: "Ignore and walk away", emoji: "🚶", isCorrect: false }
      ],
      feedback:
        "Perfect! Encouraging peace over gossip builds a stronger, kinder friend circle."
    }
  ];

  const currentStory = stories[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);
    if (!choice) return;
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/debate-peace-vs-revenge");
    }
  };

  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Friend Group Story"
      subtitle="Fairness in Friendship"
      onNext={handleNextStory}
      nextEnabled={showFeedback}
      score={coins}
      gameId="moral-teen-85"
      gameType="moral"
      totalLevels={100}
      currentLevel={85}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
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

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map(choice => (
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
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌟 Great Friend!" : "Hmm... Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">{currentStory.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-6">+5 Coins Earned! 🪙</p>

                <button
                  onClick={handleNextStory}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next ➡️
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Fairness keeps friendships strong — next time, choose equality and kindness!
                  </p>
                </div>
                <button
                  onClick={() => setShowFeedback(false)}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FriendGroupStory;
