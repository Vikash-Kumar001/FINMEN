import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterSkillsForSuccess = () => {
  const navigate = useNavigate();
  const [selectedElements, setSelectedElements] = useState([]);
  const [showPoster, setShowPoster] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const elements = [
    { id: 1, name: "Dream", emoji: "💭", required: true },
    { id: 2, name: "Work", emoji: "💪", required: true },
    { id: 3, name: "Team", emoji: "🤝", required: true },
    { id: 4, name: "Success", emoji: "🎯", required: true }
  ];

  const handleToggleElement = (elementId) => {
    if (selectedElements.includes(elementId)) {
      setSelectedElements(selectedElements.filter(id => id !== elementId));
    } else {
      setSelectedElements([...selectedElements, elementId]);
    }
  };

  const handleCreatePoster = () => {
    const requiredSelected = elements.filter(e => e.required).every(e => selectedElements.includes(e.id));
    
    if (requiredSelected) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowPoster(true);
    }
  };

  const handleNext = () => {
    navigate("/student/ehe/kids/journal-of-skills");
  };

  const allRequired = elements.filter(e => e.required).every(e => selectedElements.includes(e.id));

  return (
    <GameShell
      title="Poster: Skills for Success"
      subtitle="Create Success Formula"
      onNext={handleNext}
      nextEnabled={showPoster}
      showGameOver={showPoster}
      score={coins}
      gameId="ehe-kids-16"
      gameType="educational"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showPoster}
      backPath="/games/entrepreneurship/kids"
    >
      <div className="space-y-8">
        {!showPoster ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Create Your Success Formula Poster!
            </h3>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-center">
                Select the elements to build your success formula:
              </p>
              <p className="text-white/80 text-sm text-center mt-2">
                Dream + Work + Team = Success
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {elements.map(element => (
                <button
                  key={element.id}
                  onClick={() => handleToggleElement(element.id)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedElements.includes(element.id)
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-6xl mb-2">{element.emoji}</div>
                  <div className="text-white font-semibold text-lg">{element.name}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleCreatePoster}
              disabled={!allRequired}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                allRequired
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Create Success Poster! 🎨
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Success Formula!</h2>
            
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 mb-6">
              <div className="flex justify-center items-center gap-3 mb-6">
                <div className="text-center">
                  <div className="text-7xl">💭</div>
                  <div className="text-white font-bold mt-2">Dream</div>
                </div>
                <div className="text-white text-5xl">+</div>
                <div className="text-center">
                  <div className="text-7xl">💪</div>
                  <div className="text-white font-bold mt-2">Work</div>
                </div>
                <div className="text-white text-5xl">+</div>
                <div className="text-center">
                  <div className="text-7xl">🤝</div>
                  <div className="text-white font-bold mt-2">Team</div>
                </div>
              </div>
              <div className="text-white text-6xl font-black text-center mb-4">=</div>
              <div className="text-center">
                <div className="text-9xl">🎯</div>
                <div className="text-white font-black text-4xl mt-2">SUCCESS!</div>
              </div>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                🌟 Amazing! Remember: Dreams give direction, work brings results, and teamwork multiplies success!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned a Badge! 🏆
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterSkillsForSuccess;

