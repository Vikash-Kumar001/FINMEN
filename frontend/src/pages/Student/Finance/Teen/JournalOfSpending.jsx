import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import { useGameFeedback } from '../../../../hooks/useGameFeedback';

const JournalOfSpending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentEntry, setCurrentEntry] = useState(0);
  const [scores, setScores] = useState(Array(5).fill(0));
  const [journalEntries, setJournalEntries] = useState(Array(5).fill(''));
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const journalPrompts = [
    {
      id: 1,
      prompt: "Describe a recent purchase you made. What influenced your decision? Was it a need or a want? How did you feel before, during, and after the purchase?",
      guidance: "Reflect on your emotions and thought process. Consider factors like peer pressure, advertising, or impulse."
    },
    {
      id: 2,
      prompt: "Track your spending for one day. List all purchases, no matter how small. What patterns do you notice? Which expenses surprised you?",
      guidance: "Small purchases can add up. Look for emotional spending triggers or routine expenses that could be reduced."
    },
    {
      id: 3,
      prompt: "Think about a time you spent money impulsively. What were the circumstances? How did you feel afterward? What would you do differently now?",
      guidance: "Impulse purchases often happen when we're emotional. Consider strategies to pause before buying."
    },
    {
      id: 4,
      prompt: "Compare your spending habits with your financial goals. Where are you aligning well? Where might adjustments be needed?",
      guidance: "Honest self-assessment helps identify areas for improvement. Focus on progress, not perfection."
    },
    {
      id: 5,
      prompt: "Describe your ideal approach to money management. What habits would support this vision? What steps can you take this week to move toward this ideal?",
      guidance: "Creating a positive vision helps motivate change. Make specific, achievable commitments."
    }
  ];

  const handleEntryChange = (e) => {
    const newEntries = [...journalEntries];
    newEntries[currentEntry] = e.target.value;
    setJournalEntries(newEntries);
  };

  const handleSubmitEntry = () => {
    resetFeedback();
    if (journalEntries[currentEntry].trim().length > 20) {
      showCorrectAnswerFeedback(1, true);
      const newScores = [...scores];
      newScores[currentEntry] = 1;
      setScores(newScores);
      
      setFeedbackMessage('Great reflection! Keep up the good work.');
      setIsSuccess(true);
      
      setTimeout(() => {
        setFeedbackMessage('');
        if (currentEntry < journalPrompts.length - 1) {
          setCurrentEntry(currentEntry + 1);
        } else {
          // For the last entry, navigate after a delay
          setTimeout(() => {
            navigate('/games/financial-literacy/teen');
          }, 3000);
        }
      }, 2000);
    } else {
      setFeedbackMessage('Please write a more detailed reflection (at least 20 words)');
      setIsSuccess(false);
      
      setTimeout(() => {
        setFeedbackMessage('');
      }, 2000);
    }
  };

  const calculateTotalScore = () => {
    return scores.reduce((total, score) => total + score, 0);
  };

  const handleGameComplete = () => {
    navigate('/games/financial-literacy/teen');
  };

  return (
    <GameShell
      gameId="finance-teens-17"
      gameType="journal"
      totalLevels={journalPrompts.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentEntry + 1}
      score={calculateTotalScore()}
      totalScore={journalPrompts.length}
      onGameComplete={handleGameComplete}
    >
      <div className="game-content">
        <h3 className="text-xl font-bold mb-6 text-indigo-700">Spending Habits Journal</h3>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Journal Prompt:</h4>
          <p className="mb-4 text-gray-700">{journalPrompts[currentEntry].prompt}</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h5 className="font-medium text-blue-800 mb-2">Guidance:</h5>
            <p className="text-blue-700 text-sm">{journalPrompts[currentEntry].guidance}</p>
          </div>
          
          <textarea
            value={journalEntries[currentEntry]}
            onChange={handleEntryChange}
            placeholder="Write your reflection here..."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          
          <button
            onClick={handleSubmitEntry}
            disabled={!journalEntries[currentEntry].trim()}
            className={`mt-4 px-6 py-2 rounded-lg font-medium transition duration-200 ${
              journalEntries[currentEntry].trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Entry
          </button>
        </div>
        
        {feedbackMessage && (
          <div className={`p-4 rounded-lg mb-4 ${
            isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-medium">{feedbackMessage}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-600">
            Entry {currentEntry + 1} of {journalPrompts.length}
          </span>
          <span className="font-medium text-indigo-700">
            Completed: {calculateTotalScore()}/{journalPrompts.length}
          </span>
        </div>
      </div>
    </GameShell>
  );
};

export default JournalOfSpending;