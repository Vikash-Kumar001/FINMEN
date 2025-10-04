import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameShell from "../GameShell";

// Draggable Income/Expense Component
const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'money-item',
    item: { id: item.id, name: item.name, emoji: item.emoji, amount: item.amount, type: item.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`rounded-xl p-4 text-center cursor-grab hover:scale-105 transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${item.type === 'income' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-orange-600'}`}
    >
      <div className="text-2xl mb-1">{item.emoji}</div>
      <div className="text-white font-medium text-sm">{item.name}</div>
      <div className="text-white/90 text-xs mt-1">₹{item.amount}</div>
    </div>
  );
};

// Droppable Category Component
const DroppableCategory = ({ category, onDrop, items }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'money-item',
    drop: (item) => onDrop(item.id, category.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Calculate total for this category
  const total = items
    .filter(item => item.category === category.type)
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div
      ref={drop}
      className={`rounded-2xl p-6 text-center transition-all ${
        isOver ? 'ring-4 ring-white scale-105' : ''
      } ${category.type === 'income' ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-red-600 to-orange-700'}`}
    >
      <div className="text-4xl mb-2">{category.emoji}</div>
      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
      <p className="text-white/90 mt-2">{category.description}</p>
      
      {/* Show dropped items in category */}
      <div className="mt-4 space-y-2 min-h-20">
        {items
          .filter(item => item.category === category.type)
          .map(item => (
            <div key={`dropped-${item.id}`} className="bg-white/20 rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-2">{item.emoji}</span>
                <span className="text-white text-sm">{item.name}</span>
              </div>
              <span className="text-white/90 text-sm">₹{item.amount}</span>
            </div>
          ))}
      </div>
      
      <div className="mt-3 text-white font-bold text-lg">
        Total: ₹{total}
      </div>
    </div>
  );
};

const Level7Content = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [items, setItems] = useState([
    { id: 1, name: "Pocket Money", emoji: "💰", amount: 20, type: "income", category: null },
    { id: 2, name: "Ice Cream", emoji: "🍦", amount: 15, type: "expense", category: null },
    { id: 3, name: "Gift from Grandma", emoji: "🎁", amount: 50, type: "income", category: null },
    { id: 4, name: "New Book", emoji: "📚", amount: 30, type: "expense", category: null },
    { id: 5, name: "Lemonade Stand", emoji: "🍋", amount: 25, type: "income", category: null },
    { id: 6, name: "Movie Ticket", emoji: "🎬", amount: 10, type: "expense", category: null }
  ]);
  const [completed, setCompleted] = useState(false);

  const categories = [
    { 
      type: "income", 
      name: "Money In", 
      emoji: "📥", 
      description: "Ways you earn or receive money",
      color: "from-green-500 to-emerald-600" 
    },
    { 
      type: "expense", 
      name: "Money Out", 
      emoji: "📤", 
      description: "Ways you spend your money",
      color: "from-red-500 to-orange-600" 
    }
  ];

  const handleItemDrop = (itemId, categoryType) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, category: categoryType } : item
      )
    );
  };

  const checkCompletion = () => {
    // Check if all items are placed
    const allPlaced = items.every(item => item.category !== null);

    if (allPlaced) {
      // Calculate totals
      const incomeTotal = items
        .filter(item => item.category === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const expenseTotal = items
        .filter(item => item.category === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
      
      // Award coins based on completion
      setCoins(5);
      setCompleted(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/level8");
  };

  // Get items that haven't been categorized yet
  const uncategorizedItems = items.filter(item => item.category === null);

  return (
    <GameShell
      title="Income vs Expenses"
      subtitle="Sort money activities into Income (money in) or Expenses (money out)"
      coins={coins}
      currentLevel={7}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={completed}
      showGameOver={completed}
      score={coins}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white text-center text-lg mb-6">
            Drag each money activity to the correct category. Income is money you receive, Expenses is money you spend.
          </p>
          
          {/* Categories with Drop Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {categories.map(category => (
              <DroppableCategory
                key={category.type}
                category={category}
                onDrop={handleItemDrop}
                items={items}
              />
            ))}
          </div>
          
          {/* Draggable Items */}
          <div className="mb-8">
            <h4 className="text-white text-lg font-bold mb-4 text-center">Money Activities:</h4>
            {uncategorizedItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uncategorizedItems.map(item => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-center italic">All items have been categorized! Check your answers.</p>
            )}
          </div>
          
          {/* Check Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={checkCompletion}
              disabled={uncategorizedItems.length > 0}
              className={`py-3 px-6 rounded-full font-bold transition-all ${
                uncategorizedItems.length > 0
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
            <h3 className="text-2xl font-bold text-white mb-2">Great Job!</h3>
            <p className="text-white/90 mb-4">
              You've learned to distinguish between income and expenses!
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

const Level7 = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Level7Content />
    </DndProvider>
  );
};

export default Level7;