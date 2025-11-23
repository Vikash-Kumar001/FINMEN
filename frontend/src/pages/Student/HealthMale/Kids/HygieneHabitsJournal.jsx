import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneHabitsJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [answer, setAnswer] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      title: "New Bathing Habit",
      text: "One new hygiene habit I started is ___."
    },
    {
      id: 2,
      title: "Daily Routine",
      text: "I wash my face ___ times a day because ___."
    },
    {
      id: 3,
      title: "Fresh Feeling",
      text: "After taking a bath, I feel ___ and ___."
    },
    {
      id: 4,
      title: "Hygiene Tools",
      text: "My favorite hygiene item is ___ because ___."
    },
    {
      id: 5,
      title: "Clean Confidence",
      text: "Being clean makes me feel ___ and ___."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      setResponses([...responses, { prompt: currentPrompt, answer }]);
      setAnswer("");

      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt(prev => prev + 1);
      } else {
        setGameFinished(true);
        showCorrectAnswerFeedback(5, true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/acne-story");
  };

  return (
    <GameShell
      title="Journal: Hygiene Habits"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={responses.length * 5}
      gameId="health-male-kids-47"
      gameType="health-male"
      totalLevels={50}
      currentLevel={47}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={50} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-2">{prompts[currentPrompt].title}</h3>
            <p className="text-white/90 mb-4">
              {prompts[currentPrompt].text}
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {prompts.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentPrompt ? 'bg-green-500' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Your response:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50 resize-none"
                rows={4}
                maxLength={200}
              />
              <div className="text-right text-white/60 text-sm mt-1">
                {answer.length}/200 characters
              </div>
            </div>

            <button
              type="submit"
              disabled={!answer.trim()}
              className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${
                answer.trim()
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              {currentPrompt < prompts.length - 1 ? 'Next Prompt' : 'Complete Journal'}
            </button>
          </form>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-6xl mb-2">📝</div>
                <h3 className="text-2xl font-bold text-white mb-2">Journal Complete!</h3>
                <p className="text-white/90 mb-4">
                  Excellent reflection! You've shared 5 thoughts about your hygiene habits and daily care.
                </p>

                <div className="space-y-3 mb-4">
                  {responses.map((response, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-3 text-left">
                      <p className="text-white font-medium mb-1">{prompts[index].title}</p>
                      <p className="text-white/80 italic">"{response.answer}"</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-2">
                  <span className="text-yellow-500 text-2xl">+{responses.length * 5}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default HygieneHabitsJournal;
