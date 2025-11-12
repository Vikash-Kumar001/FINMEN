import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import { useGameFeedback } from '../../../../hooks/useGameFeedback';

const DebateNeedsVsWants = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState(Array(5).fill(0));
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showReflection, setShowReflection] = useState(false);

  const debateTopics = [
    {
      id: 1,
      scenario: "Should a teenager buy the latest smartphone or use their current phone that works fine?",
      positions: [
        { id: 'for', text: "FOR: Buy the latest smartphone", points: [
          "Staying connected with friends and family is important",
          "Newer phones have better cameras for documenting memories",
          "Technology skills are important for future careers"
        ]},
        { id: 'against', text: "AGAINST: Keep using the current phone", points: [
          "The current phone meets basic communication needs",
          "Money could be saved for more important future goals",
          "Frequent upgrades contribute to electronic waste"
        ]}
      ],
      reflection: "Consider both staying connected AND financial responsibility. A newer phone might help with career preparation, but your current phone likely meets essential needs."
    },
    {
      id: 2,
      scenario: "Is joining an expensive sports team worth the cost if it improves physical fitness and social connections?",
      positions: [
        { id: 'for', text: "FOR: Join the expensive sports team", points: [
          "Physical fitness is crucial for long-term health",
          "Team participation builds valuable social skills",
          "Sports can lead to college scholarships"
        ]},
        { id: 'against', text: "AGAINST: Choose free/low-cost fitness activities", points: [
          "Many free activities provide similar fitness benefits",
          "Expensive commitments can strain family finances",
          "Community sports leagues offer social connections too"
        ]}
      ],
      reflection: "Both physical health and financial stability matter. Consider if the benefits justify the cost compared to alternatives."
    },
    {
      id: 3,
      scenario: "Should teenagers prioritize saving for college or enjoying experiences now?",
      positions: [
        { id: 'for', text: "FOR: Prioritize saving for college", points: [
          "College costs continue rising and require significant savings",
          "Starting early maximizes compound interest benefits",
          "Financial stress during college affects academic performance"
        ]},
        { id: 'against', text: "AGAINST: Enjoy experiences while young", points: [
          "Memories from experiences last longer than material possessions",
          "Learning financial balance includes reasonable enjoyment",
          "Future earning potential may offset current savings"
        ]}
      ],
      reflection: "Finding balance is key. Both saving for future goals and enjoying present moments contribute to well-being."
    },
    {
      id: 4,
      scenario: "Is eating out regularly a reasonable expense or financial waste?",
      positions: [
        { id: 'for', text: "FOR: Eating out regularly", points: [
          "Cooking skills take time to develop and aren't always practical",
          "Social dining strengthens relationships with friends/family",
          "Supporting local businesses contributes to community economy"
        ]},
        { id: 'against', text: "AGAINST: Cooking at home most of the time", points: [
          "Home-cooked meals are typically much more economical",
          "Cooking develops life skills and promotes healthier eating",
          "Regular restaurant spending can quickly deplete budgets"
        ]}
      ],
      reflection: "Balance convenience and social connection with financial responsibility. Occasional dining out can fit in a healthy budget."
    },
    {
      id: 5,
      scenario: "Should teenagers invest in branded clothing or choose affordable alternatives?",
      positions: [
        { id: 'for', text: "FOR: Invest in branded clothing", points: [
          "Quality branded items last longer, offering better value over time",
          "Professional appearance can impact job interviews and opportunities",
          "Self-confidence from looking good can improve performance"
        ]},
        { id: 'against', text: "AGAINST: Choose affordable clothing", points: [
          "Personal style matters more than brand labels",
          "Money saved can be invested in experiences or education",
          "Brand loyalty often reflects marketing influence rather than value"
        ]}
      ],
      reflection: "Consider both self-expression and financial prudence. Quality matters, but brand names don't guarantee value."
    }
  ];

  const handlePositionSelect = (positionId) => {
    resetFeedback();
    setSelectedPosition(positionId);
    // In a debate game, either position can demonstrate understanding
    // We'll give credit for engaging with either side thoughtfully
    showCorrectAnswerFeedback(1, true);
    
    const newScores = [...scores];
    newScores[currentRound] = 1;
    setScores(newScores);
    
    setShowReflection(true);

    setTimeout(() => {
      setShowReflection(false);
      if (currentRound < debateTopics.length - 1) {
        setCurrentRound(currentRound + 1);
        setSelectedPosition(null);
      } else {
        // Show completion popup for the last round
        setTimeout(() => {
          const totalScore = calculateTotalScore();
          // You can implement a completion popup here if needed
          // For now, we'll just navigate after a delay
          setTimeout(() => {
            navigate('/games/financial-literacy/teen');
          }, 3000);
        }, 2000);
      }
    }, 2000);
  };

  const calculateTotalScore = () => {
    return scores.reduce((total, score) => total + score, 0);
  };

  const handleGameComplete = () => {
    navigate('/games/financial-literacy/teen');
  };

  return (
    <GameShell
      gameId="finance-teens-16"
      gameType="debate"
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentRound + 1}
      score={calculateTotalScore()}
      totalScore={debateTopics.length}
      onGameComplete={handleGameComplete}
    >
      <div className="game-content">
        <h3 className="text-xl font-bold mb-6 text-indigo-700">Needs vs Wants Debate</h3>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Scenario:</h4>
          <p className="mb-6 text-gray-700">{debateTopics[currentRound].scenario}</p>
          
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Take a Position:</h4>
          <div className="space-y-4 mb-6">
            {debateTopics[currentRound].positions.map((position) => (
              <button
                key={position.id}
                onClick={() => handlePositionSelect(position.id)}
                disabled={selectedPosition !== null}
                className={`w-full text-left p-4 rounded-lg transition duration-200 border ${
                  selectedPosition === position.id 
                    ? 'bg-indigo-100 border-indigo-300' 
                    : 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300'
                } ${selectedPosition !== null ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <div className="font-medium mb-2">{position.text}</div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {position.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          
          {showReflection && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Reflection:</h4>
              <p className="text-yellow-700">{debateTopics[currentRound].reflection}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-600">
            Round {currentRound + 1} of {debateTopics.length}
          </span>
          <span className="font-medium text-indigo-700">
            Score: {calculateTotalScore()}/{debateTopics.length}
          </span>
        </div>
      </div>
    </GameShell>
  );
};

export default DebateNeedsVsWants;