import React, { useState } from "react";
import GameShell, { GameCard, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/* --------------------- Draggable Tool Item --------------------- */
const ToolItem = ({ tool }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TOOL",
    item: { name: tool.name, category: tool.category },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [tool]);

  return (
    <div
      ref={drag}
      className="text-lg p-4 bg-white/20 rounded-xl border border-white/30 backdrop-blur-md cursor-grab select-none"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      aria-grabbed={isDragging}
      role="button"
    >
      {tool.name}
    </div>
  );
};

/* --------------------- Drop Target Bucket --------------------- */
const DropBox = ({ label, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "TOOL",
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
      <p className="text-sm text-white/60">Drop {label.toLowerCase()} tools here</p>
    </div>
  );
};

/* --------------------- Main Game --------------------- */
const initialTools = [
  { name: "Google Maps", category: "AI" },
  { name: "Pencil", category: "Not AI" },
  { name: "ChatGPT", category: "AI" },
  { name: "Calculator", category: "Not AI" },
  { name: "Grammarly", category: "AI" },
];

const MatchAITools = () => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [remainingTools, setRemainingTools] = useState(initialTools);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null);

  const handleDrop = (item, bucketLabel) => {
    const itemCategory = (item?.category || "").trim().toLowerCase();
    const target = (bucketLabel || "").trim().toLowerCase();
    if (!itemCategory) return;

    if (itemCategory === target) {
      // correct
      setScore((prev) => prev + 5); // +5 points per correct match
      setFlashPoints(5);
      setTimeout(() => setFlashPoints(null), 1000);

      const newRemaining = remainingTools.filter(
        (t) => !(t.name === item.name && t.category === item.category)
      );
      setRemainingTools(newRemaining);

      if (newRemaining.length === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowGameOver(true), 1200);
      }

      setFeedback({ message: "Correct! AI recognized!", type: "correct" });
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
        gameId="match-ai-tools"
        gameType="ai"
        totalLevels={initialTools.length}
        title="Match AI Tools"
        subtitle="Drag tools into AI or Not AI bucket"
        rightSlot={
          <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
            Score: {score} ⭐ {remainingTools.length} left
          </div>
        }
        showGameOver={showGameOver}
        score={score}
      >
        {showConfetti && <Confetti />}
        {flashPoints && <ScoreFlash points={flashPoints} />}

        <LevelCompleteHandler gameId="match-ai-tools" gameType="ai" levelNumber={initialTools.length - remainingTools.length + 1}>
          <GameCard>
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-white">
              {remainingTools.map((tool, idx) => (
                <ToolItem key={`${tool.name}-${idx}`} tool={tool} />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
              <DropBox label="AI" onDrop={handleDrop} />
              <DropBox label="Not AI" onDrop={handleDrop} />
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

export default MatchAITools;
