import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterTask4 = () => {
  const navigate = useNavigate();

  // Multi-poster flow
  const TOTAL_POSTERS = 5;
  const [currentPoster, setCurrentPoster] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Store selections per poster index (0..4)
  const [selections, setSelections] = useState(
    Array.from({ length: TOTAL_POSTERS }, () => ({
      message: null,
      design: null,
      symbol: null,
      color: null,
      textStyle: null,
    }))
  );

  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // Option lists (same as your single question)
  const messages = [
    { id: 1, text: "Use Tech to Learn 📚", color: "from-blue-400 to-purple-500" },
    { id: 2, text: "Be Smart, Learn Online 💡", color: "from-green-400 to-blue-500" },
    { id: 3, text: "Technology = Knowledge 🌐", color: "from-pink-400 to-red-400" },
    { id: 4, text: "Explore the World with Tech 🌍", color: "from-yellow-400 to-orange-400" },
    { id: 5, text: "Learn, Create, Inspire 💻", color: "from-teal-400 to-cyan-500" }
  ];

  const designs = [
    { id: 1, name: "Laptop Frame", emoji: "💻" },
    { id: 2, name: "Lightbulb", emoji: "💡" },
    { id: 3, name: "Rocket", emoji: "🚀" },
    { id: 4, name: "Book", emoji: "📖" },
    { id: 5, name: "Brain", emoji: "🧠" }
  ];

  const symbols = [
    { id: 1, emoji: "🌈" },
    { id: 2, emoji: "⭐" },
    { id: 3, emoji: "🎨" },
    { id: 4, emoji: "🪐" },
    { id: 5, emoji: "✨" }
  ];

  const colors = [
    { id: 1, name: "Blue", gradient: "from-blue-400 to-indigo-500" },
    { id: 2, name: "Pink", gradient: "from-pink-400 to-rose-500" },
    { id: 3, name: "Green", gradient: "from-green-400 to-emerald-500" },
    { id: 4, name: "Orange", gradient: "from-orange-400 to-yellow-500" },
    { id: 5, name: "Purple", gradient: "from-purple-400 to-fuchsia-500" }
  ];

  const textStyles = [
    { id: 1, name: "Bold", style: "font-extrabold text-3xl" },
    { id: 2, name: "Italic", style: "italic text-2xl" },
    { id: 3, name: "Outline", style: "font-bold text-3xl tracking-wide" },
    { id: 4, name: "Glow", style: "font-bold text-3xl text-shadow-md" },
    { id: 5, name: "Fun Font", style: "font-semibold text-3xl" }
  ];

  const handleSet = (key, value) => {
    setSelections(prev => {
      const next = [...prev];
      next[currentPoster] = { ...next[currentPoster], [key]: value };
      return next;
    });
  };

  const handleCreatePoster = () => {
    const cur = selections[currentPoster];
    if (cur.message && cur.design && cur.symbol && cur.color && cur.textStyle) {
      // Every completed poster = +5 coins (same as your single one)
      showCorrectAnswerFeedback(5, false);
      setCoins(prev => prev + 5);
      setShowPreview(true);
    }
  };

  const handleNextPoster = () => {
    if (currentPoster < TOTAL_POSTERS - 1) {
      setCurrentPoster(p => p + 1);
      setShowPreview(false);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/sharing-good-content-story");
  };

  // Current poster selections
  const curSel = selections[currentPoster];

  const selectedMsg = messages.find(m => m.id === curSel.message);
  const selectedDsgn = designs.find(d => d.id === curSel.design);
  const selectedSym = symbols.find(s => s.id === curSel.symbol);
  const selectedClr = colors.find(c => c.id === curSel.color);
  const selectedTxt = textStyles.find(t => t.id === curSel.textStyle);

  const isLast = currentPoster === TOTAL_POSTERS - 1;
  const canProceed = showPreview && isLast;

  return (
    <GameShell
      title="Poster Task 4"
      subtitle={`Use Tech to Learn • Poster ${currentPoster + 1} of ${TOTAL_POSTERS}`}
      onNext={handleNext}
      nextEnabled={canProceed}
      showGameOver={canProceed}
      score={coins}
      gameId="dcos-kids-96"
      gameType="creative"
      totalLevels={100}
      currentLevel={96}
      showConfetti={canProceed}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showPreview ? (
          <div className="space-y-6">
            {/* Q1: Choose Message */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-xl font-bold">1. Choose Poster Message</h3>
                <span className="text-white/70 text-sm">Poster {currentPoster + 1} / {TOTAL_POSTERS}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleSet("message", msg.id)}
                    className={`border-3 rounded-xl p-4 transition-all bg-gradient-to-br ${msg.color} ${
                      curSel.message === msg.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className="text-white font-bold text-sm">{msg.text}</div>
                  </button>
                ))}
              </div>

              {/* Q2: Choose Design */}
              <h3 className="text-white text-xl font-bold mb-4">2. Choose Design Icon</h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {designs.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => handleSet("design", design.id)}
                    className={`border-2 rounded-xl p-3 transition-all ${
                      curSel.design === design.id
                        ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                        : "bg-white/20 border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <div className="text-3xl mb-1">{design.emoji}</div>
                    <div className="text-white text-xs">{design.name}</div>
                  </button>
                ))}
              </div>

              {/* Q3: Choose Symbol */}
              <h3 className="text-white text-xl font-bold mb-4">3. Choose Fun Symbol</h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {symbols.map((symbol) => (
                  <button
                    key={symbol.id}
                    onClick={() => handleSet("symbol", symbol.id)}
                    className={`border-2 rounded-xl p-3 transition-all ${
                      curSel.symbol === symbol.id
                        ? "bg-green-500/50 border-green-400 ring-2 ring-white"
                        : "bg-white/20 border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <div className="text-3xl">{symbol.emoji}</div>
                  </button>
                ))}
              </div>

              {/* Q4: Choose Color */}
              <h3 className="text-white text-xl font-bold mb-4">4. Choose Poster Color Theme</h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleSet("color", color.id)}
                    className={`rounded-xl p-4 bg-gradient-to-br ${color.gradient} transition-all ${
                      curSel.color === color.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className="text-white text-xs font-bold">{color.name}</div>
                  </button>
                ))}
              </div>

              {/* Q5: Choose Text Style */}
              <h3 className="text-white text-xl font-bold mb-4">5. Choose Text Style</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {textStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleSet("textStyle", style.id)}
                    className={`rounded-xl p-3 bg-white/20 hover:bg-white/30 text-white transition-all ${
                      curSel.textStyle === style.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className={`${style.style}`}>{style.name}</div>
                  </button>
                ))}
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreatePoster}
                disabled={
                  !curSel.message ||
                  !curSel.design ||
                  !curSel.symbol ||
                  !curSel.color ||
                  !curSel.textStyle
                }
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  curSel.message &&
                  curSel.design &&
                  curSel.symbol &&
                  curSel.color &&
                  curSel.textStyle
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Create Poster! 🎨
              </button>
            </div>
          </div>
        ) : (
          // Preview for current poster
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLast ? "🎉 Amazing Poster!" : "🎉 Great Poster!"}
            </h2>
            <p className="text-white/70 mb-4">
              Poster {currentPoster + 1} of {TOTAL_POSTERS}
            </p>
            <div
              className={`rounded-xl p-8 bg-gradient-to-br ${
                selectedClr?.gradient || "from-slate-600 to-slate-800"
              } min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
            >
              <div className="text-6xl mb-4">
                {selectedDsgn?.emoji} {selectedSym?.emoji}
              </div>
              <div className={`text-white text-center ${selectedTxt?.style || ""}`}>
                {selectedMsg?.text || "Your Poster Text"}
              </div>
            </div>

            {/* Coins line — same style; adds +5 each poster */}
            <p className="text-yellow-400 text-2xl font-bold mt-6">
              You earned {isLast ? coins : 5} Coins! 🪙
            </p>

            {!isLast ? (
              <button
                onClick={handleNextPoster}
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Poster →
              </button>
            ) : (
              <p className="text-white/70 text-sm mt-3">
                All posters completed! Use the Next button to continue.
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterTask4;
