import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchCareers = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showCoinFeedback, setShowCoinFeedback] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Shuffle function to randomize the order of matches
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const puzzles = [
    {
      id: 1,
      item: "Space Scientist",
      emoji: "🚀",
      matches: shuffleArray([
        { id: "mars", text: "Mars", emoji: "🪐", correct: true },
        { id: "dna", text: "DNA", emoji: "🧬", correct: false },
        { id: "earth", text: "Earth", emoji: "🌍", correct: false }
      ])
    },
    {
      id: 2,
      item: "Geneticist",
      emoji: "🧬",
      matches: shuffleArray([
        { id: "mars", text: "Mars", emoji: "🪐", correct: false },
        { id: "dna", text: "DNA", emoji: "🧬", correct: true },
        { id: "earth", text: "Earth", emoji: "🌍", correct: false }
      ])
    },
    {
      id: 3,
      item: "Climate Scientist",
      emoji: "🌍",
      matches: shuffleArray([
        { id: "mars", text: "Mars", emoji: "🪐", correct: false },
        { id: "dna", text: "DNA", emoji: "🧬", correct: false },
        { id: "earth", text: "Earth", emoji: "🌍", correct: true }
      ])
    },
    {
      id: 4,
      item: "AI Researcher",
      emoji: "🤖",
      matches: shuffleArray([
        { id: "algorithms", text: "Algorithms", emoji: "🔢", correct: true },
        { id: "paintings", text: "Paintings", emoji: "🎨", correct: false },
        { id: "recipes", text: "Recipes", emoji: "🍳", correct: false }
      ])
    },
    {
      id: 5,
      item: "Cybersecurity Expert",
      emoji: "🛡️",
      matches: shuffleArray([
        { id: "networks", text: "Networks", emoji: "🌐", correct: true },
        { id: "gardens", text: "Gardens", emoji: "🌱", correct: false },
        { id: "libraries", text: "Libraries", emoji: "📚", correct: false }
      ])
    }
  ];

  const handleMatch = (matchId) => {
    const currentPuzzleData = puzzles[currentPuzzle];
    const match = currentPuzzleData.matches.find(m => m.id === matchId);
    setSelectedMatch(matchId);

    if (match.correct) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setShowCoinFeedback(currentPuzzleData.id);
      setTimeout(() => setShowCoinFeedback(null), 1500);
    }

    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedMatch(null);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/freelance-story");
  };

  return (
    <GameShell
      title="Puzzle: Match Careers"
      subtitle={`Puzzle ${currentPuzzle + 1}/5: ${puzzles[currentPuzzle].item}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-teen-74"
      gameType="ehe"
      totalLevels={80}
      currentLevel={74}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/5: {puzzles[currentPuzzle].item}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6 text-center">
            Match the career to their area of focus!
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative">
              {showCoinFeedback === puzzles[currentPuzzle].id && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-lg animate-bounce">
                    +1
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl mr-3">{puzzles[currentPuzzle].emoji}</div>
                <div className="text-white text-xl font-bold">{puzzles[currentPuzzle].item}</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {puzzles[currentPuzzle].matches.map((match) => {
                  const isCorrect = selectedMatch === match.id && match.correct;
                  const isWrong = selectedMatch === match.id && !match.correct;

                  return (
                    <button
                      key={match.id}
                      onClick={() => handleMatch(match.id)}
                      disabled={selectedMatch !== null}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 relative ${
                        !selectedMatch
                          ? 'bg-blue-100/20 border-blue-500 text-white hover:bg-blue-200/20'
                          : isCorrect
                          ? 'bg-green-100/20 border-green-500 text-white'
                          : isWrong
                          ? 'bg-red-100/20 border-red-500 text-white'
                          : 'bg-gray-100/20 border-gray-500 text-white'
                      }`}
                    >
                      {isCorrect && (
                        <div className="absolute -top-2 -right-2 text-2xl">✅</div>
                      )}
                      {isWrong && (
                        <div className="absolute -top-2 -right-2 text-2xl">❌</div>
                      )}
                      <div className="text-2xl mb-1">{match.emoji}</div>
                      <div className="font-medium text-sm">{match.text}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchCareers;