import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../GameShell';
import { useGameFeedback } from '../../../../hooks/useGameFeedback';

const PartyStory = () => {
  const navigate = useNavigate();
  const { feedback, triggerFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(Array(5).fill(0));

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
    const isCorrect = choiceId === questions[currentQuestion].correct;
    triggerFeedback(isCorrect);
    
    if (isCorrect) {
      const newScores = [...scores];
      newScores[currentQuestion] = 1;
      setScores(newScores);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 1500);
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
      currentLevel={currentQuestion + 1}
      score={calculateTotalScore()}
      totalScore={questions.length}
      onGameComplete={handleGameComplete}
      feedback={feedback}
    >
      <div className="game-content">
        <h3 className="text-xl font-bold mb-6 text-indigo-700">Party Planning Financial Decisions</h3>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">{questions[currentQuestion].text}</h4>
          <div className="space-y-3">
            {questions[currentQuestion].choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice.id)}
                className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 border border-blue-200 hover:border-blue-300"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
        
        {feedback && (
          <div className={`p-4 rounded-lg mb-4 ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-medium">{feedback.message}</p>
            {feedback.explanation && (
              <p className="mt-2 text-sm">{feedback.explanation}</p>
            )}
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