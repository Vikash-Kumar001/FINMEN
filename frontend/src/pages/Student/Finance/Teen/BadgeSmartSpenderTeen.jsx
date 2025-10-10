import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../GameShell';

const BadgeSmartSpenderTeen = () => {
  const navigate = useNavigate();

  const handleGameComplete = () => {
    navigate('/student/finance');
  };

  // This badge is awarded for completing all the teen finance games
  const badgeCriteria = [
    "Completed Pocket Money Story",
    "Passed Savings Rate Quiz",
    "Demonstrated Reflex Saving Skills",
    "Solved Saving Goals Puzzle",
    "Made Smart Salary Decisions",
    "Participated in Save vs Spend Debate",
    "Documented Saving Goals in Journal",
    "Managed Monthly Money Simulation",
    "Showed Wise Money Use in Reflex Game",
    "Completed Allowance Spending Story",
    "Passed Spending Quiz",
    "Made Wise Spending Choices",
    "Solved Smart Spending Puzzle",
    "Planned Party Financially",
    "Debated Needs vs Wants",
    "Reflected on Spending Habits",
    "Simulated Shopping Mall Experience",
    "Demonstrated Spending Control Reflex"
  ];

  return (
    <GameShell
      gameId="finance-teens-20"
      gameType="badge"
      totalLevels={1}
      currentLevel={1}
      score={100}
      totalScore={100}
      onGameComplete={handleGameComplete}
    >
      <div className="game-content">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-indigo-700">Smart Spender Teen Badge</h3>
          
          <div className="mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">Congratulations!</h4>
            <p className="text-gray-600 max-w-md mx-auto">
              You've earned the Smart Spender Teen badge for completing all the teen finance literacy games!
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
            <h5 className="text-lg font-semibold mb-4 text-gray-800">Badge Requirements:</h5>
            <ul className="space-y-2">
              {badgeCriteria.map((criterion, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h5 className="font-medium text-blue-800 mb-2">Skills You've Developed:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-blue-700">✓ Distinguishing needs from wants</p>
                <p className="text-blue-700">✓ Making smart purchasing decisions</p>
                <p className="text-blue-700">✓ Budgeting for short and long-term goals</p>
              </div>
              <div>
                <p className="text-blue-700">✓ Resisting impulsive spending</p>
                <p className="text-blue-700">✓ Evaluating financial trade-offs</p>
                <p className="text-blue-700">✓ Planning for financial independence</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleGameComplete}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            Return to Finance Dashboard
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeSmartSpenderTeen;