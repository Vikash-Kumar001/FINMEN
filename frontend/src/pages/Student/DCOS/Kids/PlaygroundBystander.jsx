import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundBystander = () => {
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenario = {
    title: "Playground Situation",
    emoji: "🏃",
    description: "You see a bully pushing another child on the playground...",
    actions: [
      { id: 1, text: "Walk away and ignore it", emoji: "🚶", isCorrect: false },
      { id: 2, text: "Help the child and tell a teacher", emoji: "🙋", isCorrect: true },
      { id: 3, text: "Watch but don't do anything", emoji: "👀", isCorrect: false },
      { id: 4, text: "Laugh with the bully", emoji: "😄", isCorrect: false }
    ]
  };

  const handleAction = (actionId) => {
    setSelectedAction(actionId);
  };

  const handleConfirm = () => {
    const action = scenario.actions.find(a => a.id === selectedAction);
    
    if (action.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setEarnedBadge(true);
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedAction(null);
    setShowFeedback(false);
    setEarnedBadge(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/cyberbully-report");
  };

  const selectedActionData = scenario.actions.find(a => a.id === selectedAction);

  return (
    <GameShell
      title="Playground Bystander Reflex"
      subtitle="Take Action Against Bullying"
      onNext={handleNext}
      nextEnabled={showFeedback && earnedBadge}
      showGameOver={showFeedback && earnedBadge}
      score={earnedBadge ? 1 : 0}
      gameId="dcos-kids-15"
      gameType="educational"
      totalLevels={20}
      currentLevel={15}
      showConfetti={showFeedback && earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{scenario.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center text-red-400">{scenario.title}</h2>
            
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {scenario.description}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {scenario.actions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedAction === action.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-4xl mb-2">{action.emoji}</div>
                  <div className="text-white font-semibold text-sm">{action.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedAction}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedAction
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Action
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedActionData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedActionData.isCorrect ? "🏆 Courage Kid Badge!" : "Not the Best Choice"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedActionData.text}</p>
            
            {selectedActionData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Excellent! Helping the child and telling a teacher is the right thing to do. 
                    You're being brave and standing up for someone who needs help. That's true courage!
                  </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-2">🏆</div>
                  <p className="text-white text-2xl font-bold">Courage Kid Badge!</p>
                  <p className="text-white/80 text-sm mt-2">You help others in need!</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {selectedAction === 1 || selectedAction === 3
                      ? "Ignoring bullying doesn't help. The best action is to help the child and tell a teacher!"
                      : "Laughing with the bully is wrong and hurtful. The best action is to help the child and tell a teacher!"}
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlaygroundBystander;

