import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NegotiationJournal = () => {
  const navigate = useNavigate();
  const [negotiation, setNegotiation] = useState("");
  const [lessons, setLessons] = useState(["", "", "", "", ""]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const handleNegotiationChange = (e) => {
    setNegotiation(e.target.value);
  };

  const handleLessonChange = (e) => {
    const newLessons = [...lessons];
    newLessons[currentLesson] = e.target.value;
    setLessons(newLessons);
  };

  const handleSubmitLesson = () => {
    if (lessons[currentLesson].trim() === "") return;
    showCorrectAnswerFeedback(1, false);
    if (currentLesson < 4) {
      setTimeout(() => {
        setCurrentLesson(prev => prev + 1);
      }, 1500);
    } else {
      setShowResult(true);
      if (negotiation.trim() !== "" && lessons.every(l => l.trim() !== "")) {
        setCoins(5);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const isComplete = negotiation.trim() !== "" && lessons.every(l => l.trim() !== "");

  return (
    <GameShell
      title="Negotiation Journal"
      subtitle={`Lesson ${currentLesson + 1} of 5`}
      onNext={handleNext}
      nextEnabled={showResult && isComplete}
      showGameOver={showResult && isComplete}
      score={coins}
      gameId="conflict-177"
      gameType="conflict"
      totalLevels={10}
      currentLevel={7}
      showConfetti={showResult && isComplete}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {currentLesson === 0 && (
                <>
                  <p className="text-white text-xl mb-6">Describe negotiation:</p>
                  <textarea
                    value={negotiation}
                    onChange={handleNegotiationChange}
                    className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                    placeholder="Negotiation you led..."
                  />
                </>
              )}
              <p className="text-white text-xl mb-6">Lesson learned {currentLesson + 1}:</p>
              
              <textarea
                value={lessons[currentLesson]}
                onChange={handleLessonChange}
                className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                placeholder="Lesson..."
              />
              
              <button
                onClick={handleSubmitLesson}
                disabled={lessons[currentLesson].trim() === ""}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  lessons[currentLesson].trim() !== ""
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Log Lesson
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Journal Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Your negotiation and lessons are recorded.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {isComplete ? "Earned 5 Coins!" : "Complete for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Archive for portfolio.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NegotiationJournal;