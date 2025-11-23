import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const InclusionJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      text: "I included someone when...",
      emoji: "🤝",
      sentenceStarters: [
        "I invited a classmate to join our game",
        "I made sure everyone had a partner",
        "I shared my materials with someone",
        "I sat with someone who was alone"
      ]
    },
    {
      id: 2,
      text: "I made someone feel welcome by...",
      emoji: "🏠",
      sentenceStarters: [
        "greeting the new student with a smile",
        "showing them around the classroom",
        "introducing them to my friends",
        "asking them to sit with us"
      ]
    },
    {
      id: 3,
      text: "I helped someone feel included when...",
      emoji: "💝",
      sentenceStarters: [
        "I asked them to join our group project",
        "I picked them for my team",
        "I listened to their ideas",
        "I defended them when others left them out"
      ]
    }
  ];

  const handlePromptChange = (index) => {
    setSelectedPrompt(index);
    setJournalEntry("");
    setSelectedSentence("");
  };

  const handleSentenceSelect = (sentence) => {
    setSelectedSentence(sentence);
    setJournalEntry(sentence);
  };

  const handleSubmit = () => {
    if (journalEntry.trim()) {
      showCorrectAnswerFeedback(5, false);
      setCoins(5);
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const currentPrompt = prompts[selectedPrompt];

  return (
    <GameShell
      title="Inclusion Journal"
      subtitle="Share Your Inclusion Story"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="uvls-kids-17"
      gameType="uvls"
      totalLevels={20}
      coinsPerLevel={coinsPerLevel}
      currentLevel={17}
      showConfetti={showResult}
      backPath="/games/uvls/kids"
    
      maxScore={20} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">Choose a Prompt</h3>
              <div className="flex gap-3 mb-6">
                {prompts.map((prompt, index) => (
                  <button
                    key={prompt.id}
                    onClick={() => handlePromptChange(index)}
                    className={`flex-1 border-2 rounded-xl p-3 transition-all ${
                      selectedPrompt === index
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-3xl mb-2">{prompt.emoji}</div>
                    <div className="text-white font-medium text-sm">{prompt.text}</div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-white text-lg font-bold mb-3">
                  {currentPrompt.text}
                </h3>
                
                <div className="mb-4">
                  <label className="text-white/80 text-sm mb-2 block">
                    Choose a sentence or write your own:
                  </label>
                  <div className="space-y-2 mb-4">
                    {currentPrompt.sentenceStarters.map((sentence, index) => (
                      <button
                        key={index}
                        onClick={() => handleSentenceSelect(sentence)}
                        className={`w-full text-left border-2 rounded-lg p-3 transition-all ${
                          selectedSentence === sentence
                            ? 'bg-blue-500/50 border-blue-400'
                            : 'bg-white/10 border-white/30 hover:bg-white/20'
                        }`}
                      >
                        <span className="text-white">{sentence}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-white/80 text-sm mb-2">Or write your own:</div>
                  <textarea
                    value={journalEntry}
                    onChange={(e) => {
                      setJournalEntry(e.target.value);
                      setSelectedSentence("");
                    }}
                    placeholder="Type your inclusion story here..."
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!journalEntry.trim()}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  journalEntry.trim()
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit My Story! ✍️
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Wonderful Story!</h2>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-purple-300 font-semibold mb-2">{currentPrompt.text}</p>
              <p className="text-white text-lg">{journalEntry}</p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned 3 Coins! 🪙
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Read some stories aloud (voluntary) to inspire others!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InclusionJournal;

