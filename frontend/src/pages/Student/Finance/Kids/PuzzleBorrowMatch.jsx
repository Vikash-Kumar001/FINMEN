import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleBorrowMatch = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
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
    if (dragged.label === target.label && dragged.id === target.id) {
      setMatchedItems((prev) => ({ ...prev, [dragged.id]: true }));
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (Object.keys(matchedItems).length + 1 === stages[currentStage].items.length) {
      if (currentStage < stages.length - 1) {
        setTimeout(() => {
          setMatchedItems({});
          setCurrentStage((prev) => prev + 1);
        }, 800);
      } else {
        setTimeout(() => setShowResult(true), 800);
      }
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Puzzle: Borrow Match"
      subtitle="Match borrowed items to their correct actions!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-104"
      gameType="finance"
    >
      <DndProvider backend={HTML5Backend}>
        <div className="text-center text-white space-y-8">
          {!showResult ? (
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
          ) : (
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <div className="text-6xl mb-4">🧩🎉</div>
              <h3 className="text-3xl font-bold mb-4">Borrowing Puzzle Master!</h3>
              <p className="text-white/90 text-lg mb-6">
                You earned {coins} out of {stages.length * stages[0].items.length} for matching!
              </p>
              <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
                +{coins} Coins
              </div>
              <p className="text-white/80">Lesson: Return or share borrowed items!</p>
            </div>
          )}
        </div>
      </DndProvider>
    </GameShell>
  );
};

export default PuzzleBorrowMatch;