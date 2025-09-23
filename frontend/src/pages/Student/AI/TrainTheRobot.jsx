import React, { useState } from "react";
import GameShell, { GameCard, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/* --------------------- Draggable Item --------------------- */
const ItemCard = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: { name: item.name, category: item.category },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [item]);

  return (
    <div
      ref={drag}
      className="text-5xl p-4 bg-white/20 rounded-xl border border-white/30 backdrop-blur-md cursor-grab select-none"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      aria-grabbed={isDragging}
      role="button"
    >
      {item.emoji}
    </div>
  );
};

/* --------------------- Drop Target Box --------------------- */
const DropBox = ({ label, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (item) => onDrop(item, label),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [label, onDrop]);

  return (
    <div
      ref={drop}
      className={`flex-1 min-h-[120px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition
        ${isOver && canDrop ? "bg-green-300/30 border-green-400" : "bg-white/10 border-white/20"}`}
      aria-label={`${label} drop zone`}
    >
      <p className="text-white font-bold text-lg mb-2">{label} Bucket</p>
      <p className="text-sm text-white/60">Drop {label.toLowerCase()} items here</p>
    </div>
  );
};

/* --------------------- Main Game --------------------- */
const initialItems = [
  { emoji: "🍎", name: "Apple", category: "Food" },
  { emoji: "🚗", name: "Car", category: "Vehicle" },
  { emoji: "🍌", name: "Banana", category: "Food" },
  { emoji: "✈️", name: "Plane", category: "Vehicle" },
  { emoji: "🥦", name: "Broccoli", category: "Food" },
];

const TrainRobotGame = () => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [remainingItems, setRemainingItems] = useState(initialItems);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null);

  const handleDrop = (item, bucketLabel) => {
    const itemCategory = (item?.category || "").trim().toLowerCase();
    const target = (bucketLabel || "").trim().toLowerCase();
    if (!itemCategory) return;

    if (itemCategory === target) {
      // correct
      setScore((prev) => prev + 2);
      setFlashPoints(2);
      setTimeout(() => setFlashPoints(null), 1000);

      const newRemaining = remainingItems.filter(
        (i) => !(i.name === item.name && i.category === item.category)
      );
      setRemainingItems(newRemaining);

      if (newRemaining.length === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowGameOver(true), 1200);
      }

      setFeedback({ message: "Robot learned successfully!", type: "correct" });
    } else {
      setFeedback({
        message: `Oops! ${item.name} belongs in ${item.category} Bucket`,
        type: "wrong",
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GameShell
        title="Train the Robot"
        subtitle="Drag items into the correct bucket to teach the AI"
        rightSlot={
          <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
            Score: {score} ⭐ {remainingItems.length} left
          </div>
        }
        showGameOver={showGameOver}
        score={score}
        gameId="train-the-robot"
        gameType="ai"
        totalLevels={5}
      >
        {showConfetti && <Confetti />}
        {flashPoints && <ScoreFlash points={flashPoints} />}

        <LevelCompleteHandler
          gameId="train-the-robot"
          gameType="ai"
          levelNumber={initialItems.length - remainingItems.length + 1}
          levelScore={feedback.type === 'correct' ? 2 : 0}
          maxLevelScore={2}
        >
          <GameCard>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {remainingItems.map((item, idx) => (
                <ItemCard key={`${item.name}-${idx}`} item={item} />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
              <DropBox label="Food" onDrop={handleDrop} />
              <DropBox label="Vehicle" onDrop={handleDrop} />
            </div>
          </GameCard>
        </LevelCompleteHandler>

        {feedback.message && (
          <FeedbackBubble message={feedback.message} type={feedback.type} />
        )}
      </GameShell>
    </DndProvider>
  );
};

export default TrainRobotGame;
