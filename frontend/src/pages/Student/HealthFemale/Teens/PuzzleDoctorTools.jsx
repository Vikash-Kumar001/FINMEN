import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleDoctorTools = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showCoinFeedback, setShowCoinFeedback] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      item: "Stethoscope",
      emoji: "🎧",
      matches: [
        { id: "heart", text: "Heart", emoji: "❤️", correct: true },
        { id: "brain", text: "Brain", emoji: "🧠", correct: false },
        { id: "lung", text: "Lung", emoji: "🫁", correct: false }
      ]
    },
    {
      id: 2,
      item: "Thermometer",
      emoji: "🌡️",
      matches: [
        { id: "fever", text: "Fever", emoji: "🤒", correct: true },
        { id: "pain", text: "Pain", emoji: "🤕", correct: false },
        { id: "cough", text: "Cough", emoji: "😷", correct: false }
      ]
    },
    {
      id: 3,
      item: "Vaccine",
      emoji: "💉",
      matches: [
        { id: "protection", text: "Protection", emoji: "🛡️", correct: true },
        { id: "treatment", text: "Treatment", emoji: "🔧", correct: false },
        { id: "diagnosis", text: "Diagnosis", emoji: "🔍", correct: false }
      ]
    },
    {
      id: 4,
      item: "Blood Pressure Cuff",
      emoji: "🩺",
      matches: [
        { id: "pressure", text: "Pressure", emoji: "💪", correct: true },
        { id: "sugar", text: "Sugar", emoji: "🍬", correct: false },
        { id: "oxygen", text: "Oxygen", emoji: "💨", correct: false }
      ]
    },
    {
      id: 5,
      item: "Reflex Hammer",
      emoji: "🔨",
      matches: [
        { id: "reflexes", text: "Reflexes", emoji: "🦵", correct: true },
        { id: "bones", text: "Bones", emoji: "🦴", correct: false },
        { id: "joints", text: "Joints", emoji: "🦿", correct: false }
      ]
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
    navigate("/student/health-female/teens/specialist-story");
  };

  return (
    <GameShell
      title="Puzzle: Doctor Tools"
      subtitle={`Puzzle ${currentPuzzle + 1}/5: ${puzzles[currentPuzzle].item}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-teen-74"
      gameType="health-female"
      totalLevels={10}
      currentLevel={4}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/5: {puzzles[currentPuzzle].item}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6 text-center">
            Match the medical tool to its primary function!
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

export default PuzzleDoctorTools;