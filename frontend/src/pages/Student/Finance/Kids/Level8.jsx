import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameShell from "../GameShell";

// Draggable Goal Component
const DraggableGoal = ({ goal }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'goal',
    item: { id: goal.id, name: goal.name, emoji: goal.emoji, timeframe: goal.timeframe, priority: goal.priority },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`rounded-xl p-4 text-center cursor-grab hover:scale-105 transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        goal.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-orange-600' :
        goal.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
        'bg-gradient-to-r from-green-500 to-emerald-600'
      }`}
    >
      <div className="text-2xl mb-1">{goal.emoji}</div>
      <div className="text-white font-medium text-sm">{goal.name}</div>
      <div className="text-white/90 text-xs mt-1">
        {goal.timeframe === 'short' ? 'Soon' : goal.timeframe === 'medium' ? 'Months' : 'Years'}
      </div>
    </div>
  );
};

// Droppable Priority Category Component
const DroppableCategory = ({ category, onDrop, goals }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'goal',
    drop: (goal) => onDrop(goal.id, category.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Count goals in this category
  const goalCount = goals.filter(goal => goal.category === category.type).length;

  return (
    <div
      ref={drop}
      className={`rounded-2xl p-6 text-center transition-all ${
        isOver ? 'ring-4 ring-white scale-105' : ''
      } ${
        category.type === 'high' ? 'bg-gradient-to-r from-red-600 to-orange-700' :
        category.type === 'medium' ? 'bg-gradient-to-r from-yellow-600 to-orange-600' :
        'bg-gradient-to-r from-green-600 to-emerald-700'
      }`}
    >
      <div className="text-4xl mb-2">{category.emoji}</div>
      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
      <p className="text-white/90 mt-2">{category.description}</p>
      
      {/* Show dropped goals in category */}
      <div className="mt-4 space-y-2 min-h-20">
        {goals
          .filter(goal => goal.category === category.type)
          .map(goal => (
            <div key={`dropped-${goal.id}`} className="bg-white/20 rounded-lg p-2 flex items-center">
              <span className="text-lg mr-2">{goal.emoji}</span>
              <span className="text-white text-sm">{goal.name}</span>
            </div>
          ))}
      </div>
      
      <div className="mt-3 text-white/80 text-sm">
        Goals: {goalCount}
      </div>
    </div>
  );
};

const Level8Content = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [goals, setGoals] = useState([
    { id: 1, name: "New Bicycle", emoji: "🚲", timeframe: "short", priority: "high", category: null },
    { id: 2, name: "College Education", emoji: "🎓", timeframe: "long", priority: "high", category: null },
    { id: 3, name: "Video Game", emoji: "🎮", timeframe: "short", priority: "low", category: null },
    { id: 4, name: "Emergency Fund", emoji: "🏦", timeframe: "medium", priority: "high", category: null },
    { id: 5, name: "New Clothes", emoji: "👕", timeframe: "short", priority: "medium", category: null },
    { id: 6, name: "House Down Payment", emoji: "🏠", timeframe: "long", priority: "high", category: null }
  ]);
  const [completed, setCompleted] = useState(false);

  const categories = [
    { 
      type: "high", 
      name: "High Priority", 
      emoji: "🔴", 
      description: "Important goals that need attention",
      color: "from-red-500 to-orange-600" 
    },
    { 
      type: "medium", 
      name: "Medium Priority", 
      emoji: "🟡", 
      description: "Goals that are nice to work on",
      color: "from-yellow-500 to-orange-500" 
    },
    { 
      type: "low", 
      name: "Low Priority", 
      emoji: "🟢", 
      description: "Goals that can wait",
      color: "from-green-500 to-emerald-600" 
    }
  ];

  const handleGoalDrop = (goalId, categoryType) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId ? { ...goal, category: categoryType } : goal
      )
    );
  };

  const checkCompletion = () => {
    // Check if all goals are placed
    const allPlaced = goals.every(goal => goal.category !== null);

    if (allPlaced) {
      // Award coins for completion
      setCoins(5);
      setCompleted(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/level9");
  };

  // Get goals that haven't been categorized yet
  const uncategorizedGoals = goals.filter(goal => goal.category === null);

  return (
    <GameShell
      title="Goal Priority"
      subtitle="Sort your financial goals by priority level"
      coins={coins}
      currentLevel={8}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={completed}
      showGameOver={completed}
      score={coins}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white text-center text-lg mb-6">
            Drag each goal to the correct priority category. Think about which goals are most important.
          </p>
          
          {/* Categories with Drop Zones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {categories.map(category => (
              <DroppableCategory
                key={category.type}
                category={category}
                onDrop={handleGoalDrop}
                goals={goals}
              />
            ))}
          </div>
          
          {/* Draggable Goals */}
          <div className="mb-8">
            <h4 className="text-white text-lg font-bold mb-4 text-center">Financial Goals:</h4>
            {uncategorizedGoals.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uncategorizedGoals.map(goal => (
                  <DraggableGoal
                    key={goal.id}
                    goal={goal}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-center italic">All goals have been prioritized! Check your answers.</p>
            )}
          </div>
          
          {/* Check Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={checkCompletion}
              disabled={uncategorizedGoals.length > 0}
              className={`py-3 px-6 rounded-full font-bold transition-all ${
                uncategorizedGoals.length > 0
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
              }`}
            >
              Check My Answers
            </button>
          </div>
        </div>
        
        {/* Completion Message */}
        {completed && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Excellent Planning!</h3>
            <p className="text-white/90 mb-4">
              You've learned to prioritize your financial goals!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-full inline-flex items-center gap-2">
              <span>+{coins} Coins</span>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

const Level8 = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Level8Content />
    </DndProvider>
  );
};

export default Level8;