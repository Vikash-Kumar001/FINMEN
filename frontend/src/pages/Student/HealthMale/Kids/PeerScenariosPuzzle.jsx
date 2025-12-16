import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerScenariosPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-64";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      scenario: "Friends want you to skip homework",
      emoji: "📚",
      description: "What should you do when friends pressure you to skip schoolwork?",
      responses: [
        { id: "sayno", text: "Say No", emoji: "🙅", isCorrect: true, explanation: "Saying no to skipping homework keeps you responsible" },
        { id: "agree", text: "Agree", emoji: "👍", isCorrect: false, explanation: "Agreeing means you might fall behind in school" },
        { id: "askhelp", text: "Ask Help", emoji: "🆘", isCorrect: false, explanation: "Asking help is good, but you should still do homework" }
      ]
    },
    {
      id: 2,
      scenario: "Someone dares you to try smoking",
      emoji: "🚬",
      description: "How do you respond when offered something unhealthy?",
      responses: [
        { id: "trylittle", text: "Try a Little", emoji: "🤏", isCorrect: false, explanation: "Even trying a little can be harmful to your body" },
        { id: "sayno2", text: "Say No", emoji: "🙅", isCorrect: true, explanation: "Saying no protects your health and shows strength" },
        { id: "maybe", text: "Maybe Later", emoji: "⏰", isCorrect: false, explanation: "Maybe later often becomes yes - better to say no firmly" }
      ]
    },
    {
      id: 3,
      scenario: "Friends want you to cheat on a test",
      emoji: "📝",
      description: "What do you do when asked to break school rules?",
      responses: [
        { id: "cheat", text: "Cheat", emoji: "🤫", isCorrect: false, explanation: "Cheating hurts your learning and can get you in trouble" },
        { id: "sayno3", text: "Say No", emoji: "🙅", isCorrect: true, explanation: "Saying no to cheating shows honesty and integrity" },
        { id: "tellteacher", text: "Tell Teacher", emoji: "👨‍🏫", isCorrect: false, explanation: "Telling teacher is good, but better to just say no" }
      ]
    },
    {
      id: 4,
      scenario: "Someone wants you to steal from store",
      emoji: "🏪",
      description: "How do you handle pressure to do something illegal?",
      responses: [
        { id: "steal", text: "Steal", emoji: "🛒", isCorrect: false, explanation: "Stealing is wrong and can lead to big trouble" },
        { id: "runaway", text: "Run Away", emoji: "🏃", isCorrect: false, explanation: "Running away doesn't solve the problem" },
        { id: "sayno4", text: "Say No", emoji: "🙅", isCorrect: true, explanation: "Saying no to stealing shows strong character" }
      ]
    },
    {
      id: 5,
      scenario: "Friends pressure you to bully someone",
      emoji: "😢",
      description: "What do you do when asked to be mean to others?",
      responses: [
        { id: "bully", text: "Join In", emoji: "👊", isCorrect: false, explanation: "Joining bullying makes you part of the problem" },
        { id: "sayno5", text: "Say No", emoji: "🙅", isCorrect: true, explanation: "Saying no to bullying shows kindness and courage" },
        { id: "defend", text: "Defend Victim", emoji: "🛡️", isCorrect: false, explanation: "Defending is great, but saying no first is important" }
      ]
    }
  ];

  const handleResponseSelect = (responseId) => {
    const currentP = puzzles[currentPuzzle];
    const selectedResp = currentP.responses.find(r => r.id === responseId);
    const isCorrect = selectedResp.isCorrect;
    setSelectedResponse(responseId);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedResponse(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];

  return (
    <GameShell
      title="Peer Scenarios Puzzle"
      subtitle={showResult ? "Puzzle Complete!" : `Match scenarios with best responses (${currentPuzzle + 1}/${puzzles.length} completed)`}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="health-male"
      totalLevels={puzzles.length}
      currentLevel={currentPuzzle + 1}
      maxScore={puzzles.length}
      showConfetti={showResult && score === puzzles.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Puzzles: {currentPuzzle + 1}/{puzzles.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{puzzles.length}</span>
              </div>

              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{getCurrentPuzzle().emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{getCurrentPuzzle().scenario}</h3>
                <p className="text-white/90 mb-6">{getCurrentPuzzle().description}</p>
                <p className="text-white/90 text-center">Choose the best response to this peer pressure!</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {getCurrentPuzzle().responses.map(response => {
                  const isSelected = selectedResponse === response.id;
                  const isCorrect = isSelected && response.isCorrect;
                  const isWrong = isSelected && !response.isCorrect;

                  return (
                    <button
                      key={response.id}
                      onClick={() => handleResponseSelect(response.id)}
                      disabled={selectedResponse !== null}
                      className={`w-full p-4 rounded-xl transition-all border-2 ${
                        !selectedResponse
                          ? 'bg-white/10 hover:bg-white/20 border-white/30 cursor-pointer'
                          : isCorrect
                            ? 'bg-green-500/20 border-green-400 opacity-70 cursor-not-allowed'
                            : isWrong
                              ? 'bg-red-500/20 border-red-400 opacity-70 cursor-not-allowed'
                              : 'bg-white/10 border-white/30 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{response.emoji}</span>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-white">{response.text}</div>
                          <div className="text-sm text-white/70">{response.explanation}</div>
                        </div>
                        {isSelected && (
                          <span className={`text-xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PeerScenariosPuzzle;
