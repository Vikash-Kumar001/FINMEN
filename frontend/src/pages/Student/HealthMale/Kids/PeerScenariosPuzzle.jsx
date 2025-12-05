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

  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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

    if (isCorrect && !matchedPairs.includes(currentPuzzle)) {
      setCoins(prev => prev + 1);
      setMatchedPairs(prev => [...prev, currentPuzzle]);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedResponse(null);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];

  return (
    <GameShell
      title="Peer Scenarios Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={puzzles.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/{puzzles.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{getCurrentPuzzle().emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{getCurrentPuzzle().scenario}</h3>
            <p className="text-white/90 mb-6">{getCurrentPuzzle().description}</p>
            <p className="text-white text-lg">Choose the best response to this peer pressure!</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentPuzzle().responses.map(response => {
              const isCorrect = response.isCorrect;
              const isMatched = matchedPairs.includes(currentPuzzle);

              return (
                <button
                  key={response.id}
                  onClick={() => handleResponseSelect(response.id)}
                  disabled={isMatched}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${isMatched
                    ? isCorrect
                      ? 'bg-green-100/20 border-green-500 text-white'
                      : 'bg-red-100/20 border-red-500 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400 text-white hover:from-blue-600 hover:to-cyan-700'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`text-3xl mr-4 ${isMatched && isCorrect ? 'opacity-100' : 'opacity-60'}`}>
                        {response.emoji}
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-lg ${isMatched && isCorrect ? 'text-green-300' : 'text-white'}`}>
                          {isMatched && isCorrect ? '✅ ' : isMatched && !isCorrect ? '❌ ' : ''}{response.text}
                        </h3>
                        <p className="text-white/80 text-sm">{response.explanation}</p>
                      </div>
                    </div>
                    {isMatched && isCorrect && (
                      <div className="text-2xl">🎉</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🧩</div>
                <h3 className="text-3xl font-bold text-white mb-2">Puzzle Master!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  You matched all peer pressure scenarios perfectly! You know how to respond to tough situations!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">PEER PRESSURE PUZZLER</div>
                </div>
                <p className="text-white/80">
                  Great job understanding how to handle peer pressure! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PeerScenariosPuzzle;
