import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfLeadership = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "1️⃣ One time I led others by example was when I helped solve a group problem.",
    "2️⃣ I showed leadership by taking responsibility when others hesitated.",
    "3️⃣ A moment I inspired my team was when I stayed calm during a challenge.",
    "4️⃣ I demonstrated leadership when I encouraged others to stay positive.",
    "5️⃣ One time I showed initiative to make things better was when I...",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [entries, setEntries] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleNextPrompt = () => {
    if (inputValue.trim().length < 30) return;

    const updated = [...entries, inputValue.trim()];
    setEntries(updated);
    setInputValue("");

    if (currentIndex + 1 < prompts.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // all reflections done
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/roleplay-true-leader");
  };

  return (
    <GameShell
      title="Journal of Leadership"
      subtitle="Reflect on Leading by Example"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-teen-77"
      gameType="moral"
      totalLevels={100}
      currentLevel={77}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {/* JOURNAL PROMPT STAGE */}
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">👑</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Reflection {currentIndex + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white font-semibold text-lg">
                {prompts[currentIndex]}
              </p>
              <p className="text-white/60 text-sm mt-2">
                Write at least 30 characters to describe your experience.
              </p>
            </div>

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write your reflection here..."
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={300}
            />
            <div className="text-white/50 text-sm mt-2 text-right">
              {inputValue.length}/300 characters (min: 30)
            </div>

            <button
              onClick={handleNextPrompt}
              disabled={inputValue.trim().length < 30}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                inputValue.trim().length >= 30
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentIndex + 1 === prompts.length
                ? "Finish Journal"
                : "Next Reflection"}
            </button>
          </div>
        ) : (
          // ✅ FINAL RESULT / REVIEW
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Inspiring Leadership Reflections!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6 max-h-[350px] overflow-y-auto">
              {entries.map((entry, index) => (
                <div key={index} className="mb-4">
                  <p className="text-white/70 text-sm mb-1">
                    {prompts[index]}
                  </p>
                  <p className="text-white italic">“{entry}”</p>
                  <hr className="border-white/20 my-2" />
                </div>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Leadership is not about power — it’s about guiding others
                through empathy, courage, and example.
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

export default JournalOfLeadership;
