import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PerspectivePuzzle = () => {
  const navigate = useNavigate();
  const [currentVignette, setCurrentVignette] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const vignettes = [
    {
      id: 1,
      situation: "A student is struggling with homework and looks frustrated",
      emoji: "📚",
      correctResponse: "Offer to help explain the concept",
      responses: [
        "Offer to help explain the concept",
        "Tell them they should have paid attention in class",
        "Ignore them and continue your work"
      ],
      why: "Offering help validates their struggle and provides support"
    },
    {
      id: 2,
      situation: "Someone is being excluded from a group project",
      emoji: "👥",
      correctResponse: "Invite them to join your group",
      responses: [
        "Laugh along with others",
        "Invite them to join your group",
        "Pretend not to notice"
      ],
      why: "Including them shows you understand how being excluded feels"
    },
    {
      id: 3,
      situation: "A peer is upset about family problems",
      emoji: "🏠",
      correctResponse: "Listen without judgment and offer support",
      responses: [
        "Tell them your problems are worse",
        "Listen without judgment and offer support",
        "Change the subject quickly"
      ],
      why: "Listening helps them feel heard and understood"
    },
    {
      id: 4,
      situation: "Someone made a mistake in front of the class",
      emoji: "😳",
      correctResponse: "Reassure them that mistakes happen to everyone",
      responses: [
        "Make fun of them later",
        "Reassure them that mistakes happen to everyone",
        "Act like it was embarrassing"
      ],
      why: "Reassurance helps them feel less alone in their embarrassment"
    },
    {
      id: 5,
      situation: "A new student doesn't understand the local language well",
      emoji: "🗣️",
      correctResponse: "Speak slowly and offer to help translate",
      responses: [
        "Speak slowly and offer to help translate",
        "Speak louder thinking they'll understand",
        "Avoid talking to them"
      ],
      why: "Patient communication shows understanding of their challenge"
    },
    {
      id: 6,
      situation: "Someone is crying in the bathroom",
      emoji: "😢",
      correctResponse: "Ask if they're okay and if they want to talk",
      responses: [
        "Walk away to give them privacy",
        "Ask if they're okay and if they want to talk",
        "Tell others about it"
      ],
      why: "Checking on them shows you care about their wellbeing"
    }
  ];

  const handleResponseSelect = (response) => {
    setSelectedResponse(response);
  };

  const handleConfirm = () => {
    if (!selectedResponse) return;

    const vignette = vignettes[currentVignette];
    const isCorrect = selectedResponse === vignette.correctResponse;
    
    const newMatches = [...matches, {
      vignetteId: vignette.id,
      selected: selectedResponse,
      isCorrect
    }];
    
    setMatches(newMatches);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedResponse(null);
    
    if (currentVignette < vignettes.length - 1) {
      setTimeout(() => {
        setCurrentVignette(prev => prev + 1);
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
    setCurrentVignette(0);
    setSelectedResponse(null);
    setMatches([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/walk-in-shoes");
  };

  const correctCount = matches.filter(m => m.isCorrect).length;

  return (
    <GameShell
      title="Perspective Puzzle"
      subtitle={`Vignette ${currentVignette + 1} of ${vignettes.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 5}
      showGameOver={showResult && correctCount >= 5}
      score={coins}
      gameId="uvls-teen-3"
      gameType="uvls"
      totalLevels={20}
      currentLevel={3}
      showConfetti={showResult && correctCount >= 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-6xl mb-4 text-center">{vignettes[currentVignette].emoji}</div>
              
              <p className="text-white text-lg mb-6 text-center font-semibold">
                {vignettes[currentVignette].situation}
              </p>
              
              <p className="text-white/90 mb-4 text-center">What's the best response?</p>
              
              <div className="space-y-3 mb-6">
                {vignettes[currentVignette].responses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleResponseSelect(response)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedResponse === response
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{response}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedResponse}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedResponse
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Choice
              </button>
              
              <div className="bg-purple-500/20 rounded-lg p-3 mt-4">
                <p className="text-white/80 text-sm">
                  💡 {vignettes[currentVignette].why}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 5 ? "🎉 Perspective Pro!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {correctCount} out of {vignettes.length} correct!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 5 ? "You earned 3 Coins! 🪙" : "Get 5 or more correct to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Debrief on why certain choices feel more helpful to others.
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

export default PerspectivePuzzle;

