import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflectiveJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [actionStep, setActionStep] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      text: "Describe someone different from you and what you learned from understanding their perspective",
      emoji: "🌍",
      example: "Consider differences in culture, beliefs, abilities, or background..."
    },
    {
      id: 2,
      text: "Reflect on a time you judged someone without knowing their story. How did learning more change your view?",
      emoji: "🤔",
      example: "Think about assumptions you made and how the truth was different..."
    },
    {
      id: 3,
      text: "Write about an experience where you felt misunderstood. How can this help you understand others better?",
      emoji: "💭",
      example: "Reflect on how it felt and how you can apply this to others..."
    }
  ];

  const wordCount = journalEntry.trim().split(/\s+/).filter(word => word.length > 0).length;
  const actionWordCount = actionStep.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handlePromptChange = (index) => {
    setSelectedPrompt(index);
    setJournalEntry("");
    setActionStep("");
    setShowSuggestions(false);
  };

  const handleCheckEntry = () => {
    if (wordCount >= 150 && wordCount <= 250) {
      setShowSuggestions(true);
    }
  };

  const handleSubmit = () => {
    if (wordCount >= 150 && wordCount <= 250 && actionWordCount >= 10) {
      showCorrectAnswerFeedback(3, false);
      setCoins(3); // +3 Coins for reflection (minimum for progress)
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/peer-support-roleplay");
  };

  const currentPrompt = prompts[selectedPrompt];

  return (
    <GameShell
      title="Reflective Journal"
      subtitle="Deep Reflection Exercise"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="uvls-teen-6"
      gameType="uvls"
      totalLevels={20}
      coinsPerLevel={coinsPerLevel}
      currentLevel={6}
      showConfetti={showResult}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">Choose a Reflection Prompt</h3>
              <div className="space-y-3 mb-6">
                {prompts.map((prompt, index) => (
                  <button
                    key={prompt.id}
                    onClick={() => handlePromptChange(index)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedPrompt === index
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{prompt.emoji}</span>
                      <span className="text-white font-medium">{prompt.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-blue-500/20 rounded-lg p-3 mb-4">
                <p className="text-white/80 text-sm">
                  💡 {currentPrompt.example}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-white font-semibold mb-2 block">
                  Your Reflection (150-250 words):
                </label>
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Write your reflection here with specific examples..."
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none resize-none"
                  rows="8"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${
                    wordCount >= 150 && wordCount <= 250 ? 'text-green-400' : 'text-white/60'
                  }`}>
                    Word count: {wordCount} {wordCount < 150 ? `(${150 - wordCount} more needed)` : wordCount > 250 ? `(${wordCount - 250} over limit)` : '✓'}
                  </span>
                  {wordCount >= 150 && wordCount <= 250 && !showSuggestions && (
                    <button
                      onClick={handleCheckEntry}
                      className="bg-blue-500/50 hover:bg-blue-500/70 text-white px-3 py-1 rounded-lg text-sm transition"
                    >
                      Check Entry
                    </button>
                  )}
                </div>
              </div>

              {showSuggestions && (
                <div className="mb-4">
                  <label className="text-white font-semibold mb-2 block">
                    Action Step (What will you do differently?):
                  </label>
                  <textarea
                    value={actionStep}
                    onChange={(e) => setActionStep(e.target.value)}
                    placeholder="Describe a specific action you'll take based on this reflection..."
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:border-green-400 focus:outline-none resize-none"
                    rows="3"
                  />
                  <span className={`text-sm ${actionWordCount >= 10 ? 'text-green-400' : 'text-white/60'}`}>
                    {actionWordCount} words {actionWordCount >= 10 ? '✓' : `(need ${10 - actionWordCount} more)`}
                  </span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={wordCount < 150 || wordCount > 250 || actionWordCount < 10}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  wordCount >= 150 && wordCount <= 250 && actionWordCount >= 10
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit Journal! 📝
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Thoughtful Reflection!</h2>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-purple-300 font-semibold mb-2">{currentPrompt.text}</p>
              <p className="text-white text-sm mb-4">{journalEntry}</p>
              <div className="border-t border-white/30 pt-3 mt-3">
                <p className="text-green-300 font-semibold mb-2">Action Step:</p>
                <p className="text-white/90 text-sm">{actionStep}</p>
              </div>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned 3 Coins! 🪙
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Encourage specific examples and concrete action steps.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflectiveJournal;

