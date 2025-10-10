import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AccessibilityPuzzle = () => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const matchPairs = [
    {
      id: 1,
      need: "Student with visual impairment",
      emoji: "👓",
      correctAccommodation: "Large print materials or screen reader software",
      accommodations: [
        "Large print materials or screen reader software",
        "Require them to sit in front",
        "Give them easier assignments"
      ]
    },
    {
      id: 2,
      need: "Student with hearing impairment",
      emoji: "👂",
      correctAccommodation: "Sign language interpreter or written instructions",
      accommodations: [
        "Speak louder at them",
        "Sign language interpreter or written instructions",
        "Excuse them from class discussions"
      ]
    },
    {
      id: 3,
      need: "Student using wheelchair",
      emoji: "♿",
      correctAccommodation: "Ramps, elevators, accessible desks",
      accommodations: [
        "Ramps, elevators, accessible desks",
        "Schedule all classes on ground floor only",
        "Have others carry them upstairs"
      ]
    },
    {
      id: 4,
      need: "Student with ADHD",
      emoji: "🧠",
      correctAccommodation: "Extended time, breaks, fidget tools",
      accommodations: [
        "Tell them to sit still and focus better",
        "Extended time, breaks, fidget tools",
        "Separate them from other students"
      ]
    },
    {
      id: 5,
      need: "Student with dyslexia",
      emoji: "📖",
      correctAccommodation: "Audiobooks, extra time for reading tasks",
      accommodations: [
        "Audiobooks, extra time for reading tasks",
        "Lower reading level assignments only",
        "Exempt them from all reading"
      ]
    },
    {
      id: 6,
      need: "Student with anxiety disorder",
      emoji: "😰",
      correctAccommodation: "Quiet testing space, advance notice of changes",
      accommodations: [
        "Tell them to just relax",
        "Quiet testing space, advance notice of changes",
        "Excuse them from presentations entirely"
      ]
    }
  ];

  const handleAccommodationSelect = (accommodation) => {
    setSelectedAccommodation(accommodation);
  };

  const handleConfirm = () => {
    if (!selectedAccommodation) return;

    const pair = matchPairs[currentMatch];
    const isCorrect = selectedAccommodation === pair.correctAccommodation;
    
    const newMatches = [...matches, {
      pairId: pair.id,
      selected: selectedAccommodation,
      isCorrect
    }];
    
    setMatches(newMatches);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedAccommodation(null);
    
    if (currentMatch < matchPairs.length - 1) {
      setTimeout(() => {
        setCurrentMatch(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      const correctCount = newMatches.filter(m => m.isCorrect).length;
      if (correctCount >= 5) {
        setCoins(3); // +3 Coins for ≥5 correct (minimum for progress)
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentMatch(0);
    setSelectedAccommodation(null);
    setMatches([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/inclusive-class-simulation");
  };

  const correctCount = matches.filter(m => m.isCorrect).length;

  return (
    <GameShell
      title="Accessibility Puzzle"
      subtitle={`Match ${currentMatch + 1} of ${matchPairs.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 5}
      showGameOver={showResult && correctCount >= 5}
      score={coins}
      gameId="uvls-teen-13"
      gameType="uvls"
      totalLevels={20}
      currentLevel={13}
      showConfetti={showResult && correctCount >= 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
                <div className="text-6xl mb-3 text-center">{matchPairs[currentMatch].emoji}</div>
                <p className="text-white text-xl font-bold text-center">
                  {matchPairs[currentMatch].need}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">What's the best accommodation?</p>
              
              <div className="space-y-3 mb-6">
                {matchPairs[currentMatch].accommodations.map((accommodation, index) => (
                  <button
                    key={index}
                    onClick={() => handleAccommodationSelect(accommodation)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedAccommodation === accommodation
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{accommodation}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedAccommodation}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedAccommodation
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Match
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 5 ? "🎉 Accessibility Pro!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched {correctCount} out of {matchPairs.length} correctly!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 5 ? "You earned 3 Coins! 🪙" : "Get 5 or more correct to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Invite local accessibility examples and discuss real accommodations in your school!
            </p>
            {correctCount < 5 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AccessibilityPuzzle;

