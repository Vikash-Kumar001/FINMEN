import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimpleAlgorithmPuzzle = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([
    { id: 1, text: "Eat breakfast", position: null },
    { id: 2, text: "Brush teeth", position: null },
    { id: 3, text: "Go to school", position: null }
  ]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const correctOrder = [2, 1, 3]; // Brush teeth, Eat breakfast, Go to school

  const handleStepSelection = (stepId, position) => {
    const newSteps = steps.map(step => 
      step.id === stepId ? { ...step, position } : step
    );
    setSteps(newSteps);
  };

  const handleCheck = () => {
    const userOrder = steps
      .sort((a, b) => a.position - b.position)
      .map(s => s.id);
    
    const isAnswerCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    if (isAnswerCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    }
  };

  const allStepsAssigned = steps.every(step => step.position !== null);

  const handleTryAgain = () => {
    setSteps([
      { id: 1, text: "Eat breakfast", position: null },
      { id: 2, text: "Brush teeth", position: null },
      { id: 3, text: "Go to school", position: null }
    ]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/smart-home-story");
  };

  return (
    <GameShell
      title="Simple Algorithm Puzzle"
      subtitle="Understanding Algorithms"
      onNext={handleNext}
      nextEnabled={showFeedback && isCorrect}
      showGameOver={showFeedback && isCorrect}
      score={coins}
      gameId="ai-teen-17"
      gameType="ai"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showFeedback && isCorrect}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Arrange these steps in the correct order for a morning routine!
            </h3>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/80 text-sm text-center">
                Click on each step and then click on a position (1, 2, or 3) to arrange them.
              </p>
            </div>

            {/* Available Steps */}
            <div className="space-y-3 mb-6">
              {steps.filter(s => s.position === null).map(step => (
                <button
                  key={step.id}
                  onClick={() => {
                    const firstEmpty = [1, 2, 3].find(pos => 
                      !steps.some(s => s.position === pos)
                    );
                    if (firstEmpty) handleStepSelection(step.id, firstEmpty);
                  }}
                  className="w-full bg-white/20 border-2 border-white/40 hover:bg-white/30 rounded-xl p-4 text-white font-semibold text-lg transition"
                >
                  {step.text}
                </button>
              ))}
            </div>

            {/* Ordered Positions */}
            <div className="space-y-3 mb-6">
              {[1, 2, 3].map(position => {
                const step = steps.find(s => s.position === position);
                return (
                  <div
                    key={position}
                    className="flex items-center gap-4 bg-purple-500/20 border-2 border-purple-400/50 rounded-xl p-4"
                  >
                    <div className="text-white font-bold text-xl w-8">{position}.</div>
                    <div className="flex-1 text-white font-semibold">
                      {step ? (
                        <div className="flex justify-between items-center">
                          <span>{step.text}</span>
                          <button
                            onClick={() => handleStepSelection(step.id, null)}
                            className="text-sm bg-red-500/50 hover:bg-red-500/70 px-3 py-1 rounded-lg"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-white/50">Empty</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleCheck}
              disabled={!allStepsAssigned}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                allStepsAssigned
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Check My Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{isCorrect ? "🎉" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {isCorrect ? "Algorithm Expert!" : "Try Again..."}
            </h2>
            
            {isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Perfect! You've created an algorithm - a step-by-step procedure to solve a problem. 
                    All AI is built on algorithms that tell computers how to process information and make decisions!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center mb-4">
                    The correct order is: Brush teeth → Eat breakfast → Go to school.
                  </p>
                  <p className="text-white/80 text-sm text-center">
                    An algorithm is a sequence of steps. AI uses complex algorithms to solve problems!
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

export default SimpleAlgorithmPuzzle;

