import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateLyingForFriend = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 5 Debate Topics
  const debates = [
    {
      id: 1,
      topic: "Is lying okay to protect a friend?",
      positions: [
        { id: 1, position: "Yes - loyalty to friends comes first", emoji: "🤝", isCorrect: false },
        { id: 2, position: "No - truth matters even in friendship", emoji: "💎", isCorrect: true },
      ],
      correctMessage:
        "Excellent! Truth matters even in friendship. Lying for a friend damages credibility and integrity.",
    },
    {
      id: 2,
      topic: "Is cheating in exams ever justified?",
      positions: [
        { id: 1, position: "Yes - pressure makes it okay sometimes", emoji: "📚", isCorrect: false },
        { id: 2, position: "No - honesty matters more than grades", emoji: "🎓", isCorrect: true },
      ],
      correctMessage:
        "Great choice! Cheating may bring short success, but honesty builds true confidence and respect.",
    },
    {
      id: 3,
      topic: "Should you speak up if your friend bullies someone?",
      positions: [
        { id: 1, position: "Yes - silence supports wrong", emoji: "🗣️", isCorrect: true },
        { id: 2, position: "No - stay out of it", emoji: "🙊", isCorrect: false },
      ],
      correctMessage:
        "Exactly! Speaking up against wrong shows courage and integrity. Silence only encourages bullying.",
    },
    {
      id: 4,
      topic: "Would you return a lost wallet if no one saw you?",
      positions: [
        { id: 1, position: "Yes - integrity is doing right unseen", emoji: "💼", isCorrect: true },
        { id: 2, position: "No - finders keepers", emoji: "😏", isCorrect: false },
      ],
      correctMessage:
        "Perfect! Integrity is what you do when no one’s watching. Returning it shows true moral strength.",
    },
    {
      id: 5,
      topic: "Is it okay to gossip if it’s true?",
      positions: [
        { id: 1, position: "Yes - truth isn’t gossip", emoji: "🗞️", isCorrect: false },
        { id: 2, position: "No - it still harms others’ image", emoji: "🤐", isCorrect: true },
      ],
      correctMessage:
        "Correct! Gossip, even true, spreads harm. Integrity means respecting others’ privacy and dignity.",
    },
  ];

  const currentDebate = debates[currentQuestion];

  const handleSubmit = () => {
    if (selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      const chosen = currentDebate.positions.find(p => p.id === selectedPosition);
      if (chosen.isCorrect) {
        showCorrectAnswerFeedback(10, true);
        setCoins(10);
        setTotalCoins(prev => prev + 10);
      } else {
        setCoins(0);
      }
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < debates.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedPosition(null);
      setArgument("");
      setRebuttal("");
      setShowFeedback(false);
      setCoins(0);
    } else {
      navigate("/student/moral-values/teen/integrity-journal");
    }
  };

  const selectedPos = currentDebate.positions.find(p => p.id === selectedPosition);

  return (
    <GameShell
      title="Debate Arena: Moral Dilemmas"
      subtitle="Truth, Loyalty, and Integrity"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === debates.length - 1 && showFeedback}
      score={totalCoins}
      gameId="moral-teen-6"
      gameType="moral"
      totalLevels={20}
      currentLevel={6}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Debate {currentQuestion + 1} of {debates.length}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">
                {currentDebate.topic}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentDebate.positions.map(pos => (
                <button
                  key={pos.id}
                  onClick={() => setSelectedPosition(pos.id)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedPosition === pos.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-3xl mb-2">{pos.emoji}</div>
                  <div className="text-white font-semibold text-sm">{pos.position}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. Build Your Argument (min 30 chars)</h3>
            <textarea
              value={argument}
              onChange={e => setArgument(e.target.value)}
              placeholder="Provide evidence and reasoning..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{argument.length}/200</div>

            <h3 className="text-white font-bold mb-2">3. Prepare Your Rebuttal (min 20 chars)</h3>
            <textarea
              value={rebuttal}
              onChange={e => setRebuttal(e.target.value)}
              placeholder="Counter the opposing view..."
              className="w-full h-20 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={150}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{rebuttal.length}/150</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedPosition || argument.trim().length < 30 || rebuttal.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Debate
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedPos?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedPos?.isCorrect ? "🏆 Integrity Champion!" : "Reconsider This..."}
            </h2>

            {selectedPos?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentDebate.correctMessage}</p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-white/80 text-sm mb-1">Your Argument:</p>
                  <p className="text-white italic">"{argument}"</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  That perspective values emotion over integrity. Try again to reflect deeper!
                </p>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < debates.length - 1 ? "Next Debate ➜" : "Finish Game 🏁"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateLyingForFriend;
