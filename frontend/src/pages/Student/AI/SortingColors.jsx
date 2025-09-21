import React, { useState } from "react";
import GameShell, { GameCard, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/* --------------------- Draggable Color Item --------------------- */
const ColorItem = ({ color }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "COLOR",
      item: { emoji: color.emoji, category: color.category },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [color]
  );

  return (
    <div
      ref={drag}
      className="text-5xl p-4 bg-white/20 rounded-xl border border-white/30 backdrop-blur-md cursor-grab select-none"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      aria-grabbed={isDragging}
      role="button"
    >
      {color.emoji}
    </div>
  );
};

/* --------------------- Drop Target Box --------------------- */
const DropBox = ({ label, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "COLOR",
      drop: (item) => onDrop(item, label),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [label, onDrop]
  );

  return (
    <div
      ref={drop}
      className={`flex-1 min-h-[120px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition
        ${isOver && canDrop ? "bg-green-300/30 border-green-400" : "bg-white/10 border-white/20"}`}
      aria-label={`${label} drop zone`}
    >
      <p className="text-white font-bold text-lg mb-2">{label} Box</p>
      <p className="text-sm text-white/60">Drop {label.toLowerCase()} items here</p>
    </div>
  );
};

/* --------------------- Main Game --------------------- */
const initialColors = [
  { emoji: "🔴", category: "Red" },
  { emoji: "🔵", category: "Blue" },
  { emoji: "🟡", category: "Yellow" },
  { emoji: "🟢", category: "Green" },
  { emoji: "🟠", category: "Orange" },
  { emoji: "🟣", category: "Purple" },
];

const SortingColors = () => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [remainingColors, setRemainingColors] = useState(initialColors);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash

  const handleDrop = (item, boxLabel) => {
    const itemCategory = (item?.category || "").trim().toLowerCase();
    const target = (boxLabel || "").trim().toLowerCase();
    if (!itemCategory) return;

    if (itemCategory === target) {
      // correct
      setScore((prev) => prev + 2);
      setFlashPoints(2); // trigger score flash
      setTimeout(() => setFlashPoints(null), 1000); // hide flash after 1s

      // remove the dropped item
      const newRemaining = remainingColors.filter(
        (c) => !(c.emoji === item.emoji && c.category === item.category)
      );
      setRemainingColors(newRemaining);

      if (newRemaining.length === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowGameOver(true), 1200);
      }

      setFeedback({ message: "Great! Carry on!", type: "correct" });
    } else {
      // wrong target
      setFeedback({
        message: `Oops! That belongs in ${item.category} Box`,
        type: "wrong",
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GameShell
        title="Sorting Colors"
        subtitle="Drag each colored object into the matching box"
        rightSlot={
          <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
            Score: {score} ⭐ {remainingColors.length} left
          </div>
        }
        showGameOver={showGameOver}
        score={score}
      >
        {showConfetti && <Confetti />}
        {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

        <GameCard>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {remainingColors.map((color, idx) => (
              <ColorItem key={`${color.emoji}-${idx}`} color={color} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
            <DropBox label="Red" onDrop={handleDrop} />
            <DropBox label="Blue" onDrop={handleDrop} />
            <DropBox label="Yellow" onDrop={handleDrop} />
            <DropBox label="Green" onDrop={handleDrop} />
            <DropBox label="Orange" onDrop={handleDrop} />
            <DropBox label="Purple" onDrop={handleDrop} />
          </div>
        </GameCard>

        {feedback.message && (
          <FeedbackBubble message={feedback.message} type={feedback.type} />
        )}
      </GameShell>
    </DndProvider>
  );
};

export default SortingColors;
