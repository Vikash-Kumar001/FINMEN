import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameShell from "../GameShell";

// Draggable Item Component
const DraggableItem = ({ item, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'item',
    item: { id: item.id, name: item.name, emoji: item.emoji },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white/20 rounded-xl p-4 text-center cursor-grab hover:bg-white/30 transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="text-3xl mb-2">{item.emoji}</div>
      <div className="text-white font-medium">{item.name}</div>
    </div>
  );
};

// Droppable Category Component
const DroppableCategory = ({ category, items, onDrop, matches }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'item',
    drop: (item) => onDrop(item.id, category.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`bg-gradient-to-r ${category.color} rounded-2xl p-6 text-center transition-all ${
        isOver ? 'ring-4 ring-white scale-105' : ''
      }`}
    >
      <div className="text-4xl mb-2">{category.emoji}</div>
      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
      
      {/* Show dropped items in category */}
      <div className="mt-4 space-y-2">
        {Object.entries(matches)
          .filter(([itemId, categoryId]) => categoryId === category.id)
          .map(([itemId]) => {
            const item = items.find(i => i.id == itemId);
            return (
              <div key={`dropped-${itemId}`} className="bg-white/30 rounded-lg p-2 flex items-center justify-center">
                <span className="text-xl mr-2">{item?.emoji}</span>
                <span className="text-white text-sm">{item?.name}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const Level4Content = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState({});
  const [completed, setCompleted] = useState(false);

  const items = [
    { id: 1, name: "Piggy Bank", emoji: "🐷", category: "save" },
    { id: 2, name: "Ice Cream", emoji: "🍦", category: "spend" },
    { id: 3, name: "Savings Jar", emoji: "🫙", category: "save" },
    { id: 4, name: "Toy", emoji: "🧸", category: "spend" },
    { id: 5, name: "Bank Account", emoji: "🏦", category: "save" },
    { id: 6, name: "Candy", emoji: "🍬", category: "spend" }
  ];

  const categories = [
    { id: "save", name: "Save", emoji: "💰", color: "from-green-500 to-emerald-600" },
    { id: "spend", name: "Spend", emoji: "🛍️", color: "from-red-500 to-orange-600" }
  ];

  const handleItemDrop = (itemId, categoryId) => {
    setMatches(prev => ({
      ...prev,
      [itemId]: categoryId
    }));
  };

  const checkCompletion = () => {
    const correctMatches = Object.entries(matches).filter(([itemId, categoryId]) => {
      const item = items.find(i => i.id == itemId);
      return item && item.category === categoryId;
    }).length;

    if (correctMatches === items.length) {
      setCoins(5);
      setCompleted(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/level5");
  };

  return (
    <GameShell
      title="Puzzle: Save or Spend"
      subtitle="Drag and drop each item to the correct category"
      coins={coins}
      currentLevel={4}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={completed}
      showGameOver={completed}
      score={coins}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white text-center text-lg mb-6">
            Drag and drop each item to the correct category
          </p>
          
          {/* Categories with Drop Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {categories.map(category => (
              <DroppableCategory
                key={category.id}
                category={category}
                items={items}
                onDrop={handleItemDrop}
                matches={matches}
              />
            ))}
          </div>
          
          {/* Draggable Items */}
          <div className="mb-8">
            <h4 className="text-white text-lg font-bold mb-4 text-center">Items to Categorize:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items
                .filter(item => !matches[item.id]) // Only show items that haven't been matched yet
                .map(item => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    onDrop={handleItemDrop}
                  />
                ))}
            </div>
          </div>
          
          {/* Matching Area - Show current matches */}
          <div className="space-y-6">
            <h4 className="text-white text-lg font-bold text-center">Your Matches:</h4>
            {Object.entries(matches).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(matches).map(([itemId, categoryId]) => {
                  const item = items.find(i => i.id == itemId);
                  const category = categories.find(c => c.id === categoryId);
                  return (
                    <div 
                      key={`${itemId}-${categoryId}`}
                      className="bg-white/10 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{item?.emoji}</span>
                        <span className="text-white">{item?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white mr-2">→</span>
                        <span className="text-2xl">{category?.emoji}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-white/70 text-center italic">Drag items to the categories above to make matches.</p>
            )}
          </div>
          
          {/* Check Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={checkCompletion}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all"
            >
              Check My Answers
            </button>
          </div>
        </div>
        
        {/* Completion Message */}
        {completed && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Perfect!</h3>
            <p className="text-white/90 mb-4">
              You correctly matched all items to their categories!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-full inline-flex items-center gap-2">
              <span>+5 Coins</span>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

const Level4 = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Level4Content />
    </DndProvider>
  );
};

export default Level4;