import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneJournal = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      setGameFinished(true);
      showCorrectAnswerFeedback(5, true);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/dirty-shirt-story");
  };

  return (
    <GameShell
      title="Journal of Hygiene"
      subtitle="Write about your hygiene habits"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={gameFinished ? 5 : 0}
      gameId="health-male-kids-7"
      gameType="health-male"
      totalLevels={10}
      currentLevel={7}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-2">Hygiene Journal</h3>
            <p className="text-white/90">
              Write about one habit that keeps you clean and healthy!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                One habit that keeps me clean is:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="e.g., I wash my hands before eating, I take a bath every day, I brush my teeth twice a day..."
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
              Save Journal Entry
            </button>
          </form>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-6xl mb-2">📝</div>
                <h3 className="text-2xl font-bold text-white mb-2">Journal Complete!</h3>
                <p className="text-white/90 mb-4">
                  Great job reflecting on your hygiene habits! Writing helps you remember what's important.
                </p>
                <div className="bg-white/20 rounded-xl p-4 mb-4">
                  <p className="text-white font-medium mb-1">Your entry:</p>
                  <p className="text-white/90 italic">"{answer}"</p>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="text-yellow-500 text-2xl">+5</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default HygieneJournal;
