import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameShell from "../GameShell";

// Draggable Need/Want Component
const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'finance-item',
    item: { id: item.id, name: item.name, emoji: item.emoji, type: item.type },
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
const DroppableCategory = ({ category, onDrop, items }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'finance-item',
    drop: (item) => onDrop(item.id, category.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Count items in this category
  const itemCount = items.filter(item => item.category === category.type).length;

  return (
    <div
      ref={drop}
      className={`rounded-2xl p-6 text-center transition-all ${
        isOver ? 'ring-4 ring-white scale-105' : ''
      } ${category.type === 'need' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-orange-600'}`}
    >
      <div className="text-4xl mb-2">{category.emoji}</div>
      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
      <p className="text-white/90 mt-2">{category.description}</p>
      
      {/* Show dropped items in category */}
      <div className="mt-4 space-y-2 min-h-16">
        {items
          .filter(item => item.category === category.type)
          .map(item => (
            <div key={`dropped-${item.id}`} className="bg-white/30 rounded-lg p-2 flex items-center justify-center">
              <span className="text-xl mr-2">{item.emoji}</span>
              <span className="text-white text-sm">{item.name}</span>
            </div>
          ))}
      </div>
      
      <div className="mt-3 text-white/80 text-sm">
        Items: {itemCount}
      </div>
    </div>
  );
};

const Level6Content = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [items, setItems] = useState([
    { id: 1, name: "School Books", emoji: "📚", type: "need", category: null },
    { id: 2, name: "Video Game", emoji: "🎮", type: "want", category: null },
    { id: 3, name: "Food", emoji: "🍎", type: "need", category: null },
    { id: 4, name: "Designer Clothes", emoji: "👕", type: "want", category: null },
    { id: 5, name: "Medicine", emoji: "💊", type: "need", category: null },
    { id: 6, name: "Chocolate", emoji: "🍫", type: "want", category: null }
  ]);
  const [completed, setCompleted] = useState(false);

  const categories = [
    { 
      type: "need", 
      name: "Needs", 
      emoji: "📋", 
      description: "Essential items you must have",
      color: "from-green-500 to-emerald-600" 
    },
    { 
      type: "want", 
      name: "Wants", 
      emoji: "🎁", 
      description: "Items you'd like to have but aren't essential",
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
    // Check if all items are correctly categorized
    const allCorrectlyCategorized = items.every(item => {
      // Check if item is placed in correct category
      return item.category === item.type;
    });

    // Check if all items are placed
    const allPlaced = items.every(item => item.category !== null);

    if (allPlaced && allCorrectlyCategorized) {
      setCoins(5);
      setCompleted(true);
    } else if (allPlaced) {
      // Show feedback for incorrect categorization
      setCoins(2); // Partial points for attempt
      setCompleted(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/level7");
  };

  // Get items that haven't been categorized yet
  const uncategorizedItems = items.filter(item => item.category === null);

  return (
    <GameShell
      title="Needs vs Wants"
      subtitle="Drag items to the correct category: Needs or Wants"
      coins={coins}
      currentLevel={6}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={completed}
      showGameOver={completed}
      score={coins}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white text-center text-lg mb-6">
            Drag each item to the correct category. Needs are essential, Wants are nice to have.
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
            <h4 className="text-white text-lg font-bold mb-4 text-center">Items to Categorize:</h4>
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
            <h3 className="text-2xl font-bold text-white mb-2">
              {coins === 5 ? "Perfect!" : "Good Try!"}
            </h3>
            <p className="text-white/90 mb-4">
              {coins === 5 
                ? "You correctly identified all needs and wants!" 
                : "You made an effort to categorize the items. Remember, needs are essential while wants are nice to have."}
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

const Level6 = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Level6Content />
    </DndProvider>
  );
};

export default Level6;