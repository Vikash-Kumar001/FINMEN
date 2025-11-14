import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalPrivateInfo = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "3 things I should never share online are...",
    "What personal details should always be kept private?",
    "Why should I avoid sharing my passwords or address online?",
    "What might happen if I share private info publicly?",
    "What are safe ways to keep my information secure?"
  ];

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      // Save response for current prompt
      setResponses((prev) => [
        ...prev,
        { prompt: prompts[currentPromptIndex], answer: journalEntry }
      ]);

      // Move to next prompt or finish
      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
        setJournalEntry("");
      } else {
        showCorrectAnswerFeedback(5, true);
        setCoins(5);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/safe-friend-quiz");
  };

  return (
    <GameShell
      title="Journal: My Private Info"
      subtitle="Write About What You Should Keep Private Online"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-58"
      gameType="educational"
      totalLevels={100}
      currentLevel={58}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Protect Your Privacy
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Prompt {currentPromptIndex + 1} of {prompts.length}</p>
              <p className="text-white text-xl font-semibold">
                {prompts[currentPromptIndex]}
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your answer here... (at least 10 characters)"
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 resize-none"
              maxLength={200}
            />

            <div className="text-white/50 text-sm mt-2 text-right">
              {journalEntry.length}/200 characters
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 10}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 10
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentPromptIndex < prompts.length - 1 ? "Next Prompt" : "Finish Journal"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🧠</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Smart Thinking!
            </h2>

            <div className="space-y-4 mb-6">
              {responses.map((res, index) => (
                <div
                  key={index}
                  className="bg-purple-500/20 rounded-lg p-4"
                >
                  <p className="text-white/70 text-sm mb-1">
                    Q{index + 1}: {res.prompt}
                  </p>
                  <p className="text-white text-lg italic">
                    "{res.answer}"
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Remember: Your full name, address, passwords, and photos are private. 
                Always think before sharing online!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalPrivateInfo;
