import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalFutureSkills = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      setIsSubmitted(true);
      showCorrectAnswerFeedback(5, true);
      setTimeout(() => setGameFinished(true), 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/simulation-teen-career-fair");
  };

  return (
    <GameShell
      title="Journal of Future Skills"
      subtitle={isSubmitted ? "Great job!" : "Identify essential future skills"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={isSubmitted ? 5 : 0}
      gameId="ehe-teen-77"
      gameType="ehe"
      totalLevels={80}
      currentLevel={77}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {!isSubmitted ? (
            <>
              <h2 className="text-xl font-semibold text-white mb-4">
                Write: "One skill I need for the future is ___."
              </h2>
              <p className="text-white/80 mb-6">
                Think about the skills that will be important in the future job market. Consider technical skills like 
                coding or data analysis, as well as soft skills like communication, creativity, and adaptability. 
                What specific skill would you like to develop? Why is it important? How will you work on developing it? 
                Write at least 10 words.
              </p>
              
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Start writing your journal entry here... What future skill do you want to develop and why?"
                className="w-full h-48 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-white/70 text-sm">
                  {journalEntry.length} characters
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={journalEntry.trim().length < 10}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit Entry
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Your Future Skills Journal</h2>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6 text-left">
                <p className="text-white/90 whitespace-pre-wrap">{journalEntry}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                <p className="text-green-300 font-bold">
                  🎉 Excellent! You've completed your future skills journal entry!
                </p>
                <p className="text-green-300 mt-2">
                  Identifying and planning to develop future skills will help you stay competitive in the job market!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default JournalFutureSkills;