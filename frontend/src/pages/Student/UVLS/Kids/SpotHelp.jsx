import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpotHelp = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedKid, setSelectedKid] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [results, setResults] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      description: "Classroom Scene - Look carefully and find who needs help",
      kids: [
        { id: 1, name: "Alex", emoji: "😊", status: "Playing happily", needsHelp: false },
        { id: 2, name: "Bella", emoji: "😢", status: "Can't reach book", needsHelp: true },
        { id: 3, name: "Carlos", emoji: "😄", status: "Drawing picture", needsHelp: false },
        { id: 4, name: "Diana", emoji: "🙂", status: "Reading quietly", needsHelp: false }
      ],
      helpActions: [
        { id: "help", text: "Offer to help get the book", isCorrect: true },
        { id: "ignore", text: "Keep playing", isCorrect: false }
      ]
    },
    {
      id: 2,
      description: "Playground Scene - Who needs your help?",
      kids: [
        { id: 1, name: "Emma", emoji: "😊", status: "Swinging happily", needsHelp: false },
        { id: 2, name: "Felix", emoji: "😰", status: "Lost their ball", needsHelp: true },
        { id: 3, name: "Grace", emoji: "😁", status: "Playing tag", needsHelp: false },
        { id: 4, name: "Henry", emoji: "🙂", status: "Sitting on bench", needsHelp: false }
      ],
      helpActions: [
        { id: "help", text: "Help find the ball", isCorrect: true },
        { id: "ignore", text: "Continue playing", isCorrect: false }
      ]
    },
    {
      id: 3,
      description: "Lunchroom Scene - Spot who could use assistance",
      kids: [
        { id: 1, name: "Ivy", emoji: "😃", status: "Eating lunch", needsHelp: false },
        { id: 2, name: "Jack", emoji: "🥺", status: "Spilled juice", needsHelp: true },
        { id: 3, name: "Kate", emoji: "😊", status: "Chatting with friends", needsHelp: false },
        { id: 4, name: "Leo", emoji: "😄", status: "Enjoying snack", needsHelp: false }
      ],
      helpActions: [
        { id: "help", text: "Get napkins to clean up", isCorrect: true },
        { id: "ignore", text: "Eat my lunch", isCorrect: false }
      ]
    }
  ];

  const handleKidSelect = (kidId) => {
    setSelectedKid(kidId);
    setSelectedAction(null);
  };

  const handleActionSelect = (actionId) => {
    setSelectedAction(actionId);
  };

  const handleConfirm = () => {
    if (!selectedKid || !selectedAction) return;

    const scenario = scenarios[currentScenario];
    const kid = scenario.kids.find(k => k.id === selectedKid);
    const action = scenario.helpActions.find(a => a.id === selectedAction);
    
    const isCorrect = kid.needsHelp && action.isCorrect;
    
    const newResults = [...results, {
      scenarioId: scenario.id,
      selectedKid: kid.name,
      selectedAction: action.text,
      isCorrect
    }];
    
    setResults(newResults);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(5, true);
    }
    
    setSelectedKid(null);
    setSelectedAction(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 0);
    } else {
      const correctChoices = newResults.filter(r => r.isCorrect).length;
      if (correctChoices >= 2) {
        setCoins(3); // +3 Coins for correct help choices (minimum for progress)
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setSelectedKid(null);
    setSelectedAction(null);
    setResults([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/kids/kind-poster");
  };

  const scenario = scenarios[currentScenario];
  const correctChoices = results.filter(r => r.isCorrect).length;

  return (
    <GameShell
      title="Spot Help"
      subtitle={`Scene ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctChoices >= 2}
      showGameOver={showResult && correctChoices >= 2}
      score={coins}
      gameId="uvls-kids-5"
      gameType="uvls"
      totalLevels={10}
      currentLevel={5}
      showConfetti={showResult && correctChoices >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white/90 text-lg mb-6 text-center font-semibold">
                {scenario.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {scenario.kids.map(kid => (
                  <button
                    key={kid.id}
                    onClick={() => handleKidSelect(kid.id)}
                    className={`border-2 rounded-xl p-4 transition-all transform hover:scale-105 ${
                      selectedKid === kid.id
                        ? 'bg-purple-500/50 border-purple-400'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-4xl mb-2">{kid.emoji}</div>
                    <div className="text-white font-bold mb-1">{kid.name}</div>
                    <div className="text-white/70 text-sm">{kid.status}</div>
                  </button>
                ))}
              </div>
              
              {selectedKid && (
                <>
                  <p className="text-white mb-3 text-center">What will you do?</p>
                  <div className="space-y-3 mb-6">
                    {scenario.helpActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => handleActionSelect(action.id)}
                        className={`w-full border-2 rounded-xl p-3 transition-all ${
                          selectedAction === action.id
                            ? 'bg-green-500/50 border-green-400'
                            : 'bg-white/20 border-white/40 hover:bg-white/30'
                        }`}
                      >
                        <div className="text-white font-medium">{action.text}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              <button
                onClick={handleConfirm}
                disabled={!selectedKid || !selectedAction}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedKid && selectedAction
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Choice
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctChoices >= 2 ? "🎉 Great Helping!" : "💪 Keep Trying!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made {correctChoices} out of {scenarios.length} correct help choices!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctChoices >= 2 ? "You earned 3 Coins! 🪙" : "Get 2 or more correct to earn coins!"}
            </p>
            {correctChoices < 2 && (
              <button
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default SpotHelp;

