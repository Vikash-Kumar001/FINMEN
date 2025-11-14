import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartUserBadge = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const [currentPoster, setCurrentPoster] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    { id: 1, text: "Used an app to learn something new", emoji: "📱" },
    { id: 2, text: "Watched an educational video", emoji: "🎓" },
    { id: 3, text: "Created something using tech (drawing, coding, etc.)", emoji: "💻" },
    { id: 4, text: "Helped someone using technology", emoji: "🤝" },
    { id: 5, text: "Used screen time wisely and took breaks", emoji: "🕒" },
  ];

  const posters = [
    {
      title: "Digital Learner 📱",
      message: "You used technology to learn something new! Keep exploring!",
      gradient: "from-blue-400 via-purple-400 to-pink-400",
    },
    {
      title: "Edu Explorer 🎓",
      message: "You gained knowledge using videos — smart move!",
      gradient: "from-green-400 via-teal-400 to-blue-400",
    },
    {
      title: "Creative Coder 💻",
      message: "You created something amazing with tech!",
      gradient: "from-orange-400 via-red-400 to-pink-400",
    },
    {
      title: "Digital Helper 🤝",
      message: "You used tech to help someone — that’s real digital kindness!",
      gradient: "from-purple-400 via-pink-400 to-yellow-400",
    },
    {
      title: "Mindful User 🕒",
      message: "You used screen time wisely and balanced your day!",
      gradient: "from-yellow-400 via-orange-400 to-red-400",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => {
        if (prev < posters.length - 1) return prev + 1;
        else {
          clearInterval(interval);
          setShowBadge(true);
          showCorrectAnswerFeedback(1, true);
          return prev;
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    navigate("/student/dcos/kids/strong-password-reflex");
  };

  return (
    <GameShell
      title="Smart User Badge"
      subtitle="Complete Productive Tech Acts"
      onNext={handleNext}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={1}
      gameId="dcos-kids-100"
      gameType="educational"
      totalLevels={100}
      currentLevel={100}
      showConfetti={showBadge}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {showBadge ? "🏆 All Posters Unlocked!" : "Smart Tech Habits Progress"}
          </h2>

          <div className="space-y-3 mb-6">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  index <= currentPoster
                    ? "bg-green-500/30 border-green-400"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{task.emoji}</div>
                  <div className="flex-1 text-white font-semibold">{task.text}</div>
                  {index <= currentPoster && <div className="text-2xl">✅</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Posters show one by one */}
          {currentPoster < posters.length && (
            <div
              className={`bg-gradient-to-r ${posters[currentPoster].gradient} rounded-2xl p-8 text-center animate-pulse`}
            >
              <div className="text-7xl mb-4">{tasks[currentPoster].emoji}</div>
              <h3 className="text-white text-3xl font-bold mb-2">
                {posters[currentPoster].title}
              </h3>
              <p className="text-white/90">{posters[currentPoster].message}</p>
            </div>
          )}

          {/* Final badge */}
          {showBadge && (
            <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl p-8 text-center animate-pulse mt-6">
              <div className="text-8xl mb-4">🎖️</div>
              <h3 className="text-white text-3xl font-bold mb-2">Smart User Badge!</h3>
              <p className="text-white/90">
                You unlocked all 5 tech posters! You're officially a Smart Digital User.
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default SmartUserBadge;
