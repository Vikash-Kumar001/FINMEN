import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleWhoDoesWhat = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const jobs = [
    { id: 1, job: "Farmer", emoji: "👨‍🌾", correct: "crops" },
    { id: 2, job: "Pilot", emoji: "👨‍✈️", correct: "plane" },
    { id: 3, job: "Chef", emoji: "👨‍🍳", correct: "food" },
    { id: 4, job: "Teacher", emoji: "👩‍🏫", correct: "students" },
    { id: 5, job: "Doctor", emoji: "👨‍⚕️", correct: "patients" }
  ];

  const tasks = [
    { id: "crops", name: "Grows Crops", emoji: "🌾" },
    { id: "plane", name: "Flies Plane", emoji: "✈️" },
    { id: "food", name: "Cooks Food", emoji: "🍳" },
    { id: "students", name: "Teaches Students", emoji: "📚" },
    { id: "patients", name: "Treats Patients", emoji: "💊" }
  ];

  const handleMatch = (jobId, taskId) => {
    setMatches({ ...matches, [jobId]: taskId });
  };

  const handleCheck = () => {
    let correct = 0;
    jobs.forEach(job => {
      if (matches[job.id] === job.correct) {
        correct++;
      }
    });

    if (correct >= 4) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    }
    setShowResult(true);
  };

  const allMatched = jobs.every(job => matches[job.id]);

  const handleTryAgain = () => {
    setMatches({});
    setShowResult(false);
    setCoins(0);
  };

  const handleNext = () => {
    navigate("/student/ehe/kids/dream-job-story");
  };

  const correctCount = jobs.filter(job => matches[job.id] === job.correct).length;

  return (
    <GameShell
      title="Puzzle: Who Does What?"
      subtitle="Match Jobs to Tasks"
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      gameId="ehe-kids-4"
      gameType="educational"
      totalLevels={20}
      currentLevel={4}
      showConfetti={showResult && correctCount >= 4}
      backPath="/games/entrepreneurship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Match each job with what they do!</h3>
            
            <div className="space-y-4 mb-6">
              {jobs.map(job => {
                const selectedTask = tasks.find(t => t.id === matches[job.id]);
                return (
                  <div key={job.id} className="bg-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{job.emoji}</div>
                        <div className="text-white font-bold">{job.job}</div>
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="flex-1 ml-4">
                        <select
                          value={matches[job.id] || ""}
                          onChange={(e) => handleMatch(job.id, e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border-2 border-white/40 rounded-lg text-white"
                        >
                          <option value="">Select task...</option>
                          {tasks.map(task => (
                            <option key={task.id} value={task.id} className="text-black">
                              {task.emoji} {task.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleCheck}
              disabled={!allMatched}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                allMatched
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Check My Answers
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {correctCount >= 4 ? "🎉 Perfect Match!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You matched {correctCount} out of {jobs.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Every profession has unique tasks! Understanding what people do helps you explore careers!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {correctCount >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>
            {correctCount < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleWhoDoesWhat;

