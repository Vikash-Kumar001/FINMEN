import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const SpotHelp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-5";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
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
    },
    {
      id: 4,
      description: "Library Scene - Who needs assistance?",
      kids: [
        { id: 1, name: "Maya", emoji: "😊", status: "Reading a book", needsHelp: false },
        { id: 2, name: "Noah", emoji: "😕", status: "Can't find a book", needsHelp: true },
        { id: 3, name: "Olivia", emoji: "😄", status: "Writing notes", needsHelp: false },
        { id: 4, name: "Peter", emoji: "🙂", status: "Studying quietly", needsHelp: false }
      ],
      helpActions: [
        { id: "help", text: "Help find the book", isCorrect: true },
        { id: "ignore", text: "Continue reading", isCorrect: false }
      ]
    },
    {
      id: 5,
      description: "Art Room Scene - Look for someone who needs help",
      kids: [
        { id: 1, name: "Quinn", emoji: "😁", status: "Painting happily", needsHelp: false },
        { id: 2, name: "Ruby", emoji: "😟", status: "Can't reach supplies", needsHelp: true },
        { id: 3, name: "Sam", emoji: "😊", status: "Drawing a picture", needsHelp: false },
        { id: 4, name: "Tina", emoji: "🙂", status: "Coloring quietly", needsHelp: false }
      ],
      helpActions: [
        { id: "help", text: "Offer to get the supplies", isCorrect: true },
        { id: "ignore", text: "Keep working on my art", isCorrect: false }
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
      setCoins(prev => prev + 1); // 1 coin for correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedKid(null);
    setSelectedAction(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 0);
    } else {
      setShowResult(true);
    }
  };


  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const scenario = scenarios[currentScenario];
  const correctChoices = results.filter(r => r.isCorrect).length;
  // Score should be the number of correct answers for backend
  const finalScore = showResult ? correctChoices : coins;

  return (
    <GameShell
      title="Spot Help"
      score={finalScore}
      subtitle={`Scene ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctChoices === 5}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      totalLevels={5}
      maxScore={5}
      gameId="uvls-kids-5"
      gameType="uvls"
      showConfetti={showResult && correctChoices === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult && (
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
        )}
      </div>
    </GameShell>
  );
};

export default SpotHelp;

