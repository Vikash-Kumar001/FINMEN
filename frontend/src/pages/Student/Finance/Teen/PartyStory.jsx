import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import { useGameFeedback } from '../../../../hooks/useGameFeedback';

const PartyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(Array(5).fill(0));
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const questions = [
    {
      id: 1,
      text: "You're planning a birthday party with a $200 budget. Which approach shows responsible financial planning?",
      choices: [
        { id: 'a', text: "Spend all $200 on decorations and ignore food costs", explanation: "This could leave guests hungry and isn't financially responsible." },
        { id: 'b', text: "Allocate $100 for venue, $50 for food, $30 for decorations, $20 for contingencies", explanation: "This balanced approach allocates funds appropriately across all needs with a contingency fund." },
        { id: 'c', text: "Spend everything on expensive entertainment and skip decorations", explanation: "This ignores important aspects of party planning and overspends in one area." },
        { id: 'd', text: "Ask parents to cover extra costs if you overspend", explanation: "Relying on others to cover your overspending doesn't teach financial responsibility." }
      ],
      correct: 'b'
    },
    {
      id: 2,
      text: "You receive gifts worth $150 for your party. How should you handle the monetary gifts?",
      choices: [
        { id: 'a', text: "Spend it all immediately on something you want", explanation: "This misses an opportunity to build financial discipline." },
        { id: 'b', text: "Split it: save 60% ($90) and spend 40% ($60) on something meaningful", explanation: "This balances enjoying your gift with building savings habits." },
        { id: 'c', text: "Give it all to friends who helped with the party", explanation: "While generous, this doesn't help you learn to manage your own finances." },
        { id: 'd', text: "Ask parents to hold it for you until you're older", explanation: "This avoids learning how to manage money responsibly." }
      ],
      correct: 'b'
    },
    {
      id: 3,
      text: "After the party, you realize you spent $50 more than planned. What's the best way to handle this?",
      choices: [
        { id: 'a', text: "Ignore it since it was a special occasion", explanation: "Not acknowledging overspending makes it harder to improve financial habits." },
        { id: 'b', text: "Review what caused the overspending and adjust future budgets accordingly", explanation: "This helps you learn from mistakes and improve financial planning." },
        { id: 'c', text: "Blame parents for not giving you a bigger budget", explanation: "This shifts responsibility away from developing financial skills." },
        { id: 'd', text: "Cancel your next social event to compensate", explanation: "This extreme reaction isn't necessary or helpful for learning balance." }
      ],
      correct: 'b'
    },
    {
      id: 4,
      text: "A friend asks you to host a party too. Your monthly entertainment budget is $75. What should you do?",
      choices: [
        { id: 'a', text: "Host a big party anyway since it's your friend", explanation: "This ignores your financial limits and could cause stress." },
        { id: 'b', text: "Politely decline because of budget constraints", explanation: "This respects both your financial boundaries and friendship." },
        { id: 'c', text: "Host a small gathering within your budget ($75)", explanation: "This shows financial responsibility while still being a good friend." },
        { id: 'd', text: "Ask parents to sponsor another party", explanation: "This relies on others instead of learning to manage within your means." }
      ],
      correct: 'c'
    },
    {
      id: 5,
      text: "You saved $100 from your part-time job for a party. How should you evaluate if hosting is worth it?",
      choices: [
        { id: 'a', text: "Focus only on having fun regardless of cost", explanation: "This approach doesn't consider long-term financial goals." },
        { id: 'b', text: "Compare the joy of hosting with alternative uses of that $100", explanation: "This balanced approach considers opportunity cost and personal values." },
        { id: 'c', text: "Only consider hosting if others are paying most of the costs", explanation: "This avoids taking responsibility for financial decisions." },
        { id: 'd', text: "Host the biggest party possible to impress everyone", explanation: "This focuses on external validation rather than personal financial health." }
      ],
      correct: 'b'
    }
  ];

  const handleChoiceSelect = (choiceId) => {
    resetFeedback();
    setSelectedChoice(choiceId);
    const isCorrect = choiceId === questions[currentQuestion].correct;
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      const newScores = [...scores];
      newScores[currentQuestion] = 1;
      setScores(newScores);
    }
    
    // Find the explanation for the selected choice
    const selectedChoiceObj = questions[currentQuestion].choices.find(choice => choice.id === choiceId);
    setExplanation(selectedChoiceObj?.explanation || '');
    setShowExplanation(true);

    setTimeout(() => {
      setShowExplanation(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedChoice(null);
      } else {
        // For the last question, show completion popup
        setTimeout(() => {
          setShowCompletionPopup(true);
        }, 2000);
      }
    }, 2000);
  };

  const calculateTotalScore = () => {
    return scores.reduce((total, score) => total + score, 0);
  };

  const handleGameComplete = () => {
    navigate('/student/finance');
  };

  return (
    <GameShell
      gameId="finance-teens-15"
      gameType="story"
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentQuestion + 1}
      score={calculateTotalScore()}
      totalScore={questions.length}
      onGameComplete={handleGameComplete}
    >
      <div className="game-content">
        {/* Completion Popup */}
        {showCompletionPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-indigo-700 mb-4">Congratulations!</h3>
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-lg text-gray-700 mb-2">You've completed the Party Planning Challenge!</p>
                <p className="text-xl font-bold text-indigo-700 mb-6">
                  Total HealCoins Earned: {calculateTotalScore()}
                </p>
                <button
                  onClick={() => {
                    setShowCompletionPopup(false);
                    setTimeout(() => {
                      navigate('/games/financial-literacy/kids');
                    }, 500);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold mb-6 text-indigo-700">Party Planning Financial Decisions</h3>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">{questions[currentQuestion].text}</h4>
          <div className="space-y-3">
            {questions[currentQuestion].choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice.id)}
                className={`w-full text-left p-4 rounded-lg transition duration-200 border ${
                  selectedChoice === choice.id 
                    ? (choice.id === questions[currentQuestion].correct 
                        ? 'bg-green-100 border-green-300' 
                        : 'bg-red-100 border-red-300')
                    : 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300'
                }`}
                disabled={showExplanation || showCompletionPopup}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      
        {showExplanation && (
          <div className={`p-4 rounded-lg mb-4 ${
            selectedChoice === questions[currentQuestion].correct 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-medium">
              {selectedChoice === questions[currentQuestion].correct ? 'Correct!' : 'Incorrect!'}
            </p>
            <p className="mt-2 text-sm">{explanation}</p>
          </div>
        )}
      
        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="font-medium text-indigo-700">
            Score: {calculateTotalScore()}/{questions.length}
          </span>
        </div>
      </div>
    </GameShell>
  );
};

export default PartyStory;