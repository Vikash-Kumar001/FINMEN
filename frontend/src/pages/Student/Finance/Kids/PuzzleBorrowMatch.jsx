import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleBorrowMatch = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-54";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [matchedItems, setMatchedItems] = useState({});

  const stages = [
    {
      items: [
        { id: 1, label: "Book Borrowed", match: "Return" },
        { id: 2, label: "Toy Borrowed", match: "Share" },
      ],
    },
    {
      items: [
        { id: 3, label: "Pencil Borrowed", match: "Return" },
        { id: 4, label: "Money Borrowed", match: "Repay" },
      ],
    },
    {
      items: [
        { id: 5, label: "Lunch Borrowed", match: "Share" },
        { id: 6, label: "Notebook Borrowed", match: "Return" },
      ],
    },
    {
      items: [
        { id: 7, label: "Crayons Borrowed", match: "Return" },
        { id: 8, label: "Help Borrowed", match: "Thank" },
      ],
    },
    {
      items: [
        { id: 9, label: "Bike Borrowed", match: "Return" },
        { id: 10, label: "Game Borrowed", match: "Share" },
      ],
    },
  ];

  const PuzzleItem = ({ item }) => {
    const [, drag] = useDrag(() => ({
      type: "ITEM",
      item: { id: item.id, label: item.label },
    }));
    return (
      <div
        ref={drag}
        className="bg-blue-500 text-white px-6 py-4 rounded-xl text-lg font-bold cursor-move mb-4"
      >
        {item.label}
      </div>
    );
  };

  const DropTarget = ({ expected, onDrop }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: "ITEM",
      drop: (draggedItem) => onDrop(draggedItem, expected),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }));

    return (
      <div
        ref={drop}
        className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-4 min-h-[60px] ${
          isOver && canDrop ? "border-green-400" : ""
        }`}
      >
        {matchedItems[expected.id] ? "✅ Matched!" : expected.match}
      </div>
    );
  };

  const handleDrop = (dragged, target) => {
    resetFeedback();
    const isCorrect = stages[currentStage].items.some(item => 
      item.id === dragged.id && item.match === target.match
    );
    
    if (isCorrect) {
      setMatchedItems((prev) => ({ ...prev, [dragged.id]: true }));
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      
      const allMatched = Object.keys(matchedItems).length + 1 === stages[currentStage].items.length;
      if (allMatched) {
        setTimeout(() => {
          if (currentStage < stages.length - 1) {
            setMatchedItems({});
            setCurrentStage((prev) => prev + 1);
          } else {
            setShowResult(true);
          }
        }, 800);
      }
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title="Puzzle: Borrow Match"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Match borrowed items to their correct actions!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <DndProvider backend={HTML5Backend}>
        <div className="text-center text-white space-y-8">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-2xl font-bold mb-4">Match borrowed items to their actions!</h3>
            <div className="flex flex-col md:flex-row justify-around items-center gap-8">
              <div className="flex flex-col">
                {stages[currentStage].items.map((item) => (
                  <PuzzleItem key={item.id} item={item} />
                ))}
              </div>
              <div className="flex flex-col">
                {stages[currentStage].items.map((item) => (
                  <DropTarget key={item.id} expected={item} onDrop={handleDrop} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </GameShell>
  );
};

export default PuzzleBorrowMatch;