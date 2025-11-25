import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ListenDeep = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-1";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentVignette, setCurrentVignette] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const vignettes = [
    {
      id: 1,
      problem: "I'm really stressed about my exams. I feel like I'm going to fail and disappoint everyone.",
      emoji: "😰",
      replies: [
        { id: 1, text: "Just study harder and you'll be fine.", hasActiveListening: false, hasValidation: false },
        { id: 2, text: "I hear you're feeling overwhelmed. That sounds really tough. Want to talk about it?", hasActiveListening: true, hasValidation: true },
        { id: 3, text: "Everyone feels that way, it's no big deal.", hasActiveListening: false, hasValidation: false },
        { id: 4, text: "It sounds like you're under a lot of pressure. How can I support you?", hasActiveListening: true, hasValidation: true }
      ]
    },
    {
      id: 2,
      problem: "My parents are fighting a lot at home. I can't focus on anything and I feel scared.",
      emoji: "😔",
      replies: [
        { id: 1, text: "That must be really hard for you. I'm here if you need to talk.", hasActiveListening: true, hasValidation: true },
        { id: 2, text: "Just ignore it and focus on school.", hasActiveListening: false, hasValidation: false },
        { id: 3, text: "My parents fight too, it's normal.", hasActiveListening: false, hasValidation: false },
        { id: 4, text: "I can tell this is affecting you deeply. Would you like me to help you find someone to talk to?", hasActiveListening: true, hasValidation: true }
      ]
    },
    {
      id: 3,
      problem: "I don't have any real friends. Everyone seems to have their groups but I'm always alone.",
      emoji: "😞",
      replies: [
        { id: 1, text: "You probably need to be more outgoing.", hasActiveListening: false, hasValidation: false },
        { id: 2, text: "I understand feeling lonely is really painful. Would you like to hang out sometime?", hasActiveListening: true, hasValidation: true },
        { id: 3, text: "Just join a club or something.", hasActiveListening: false, hasValidation: false },
        { id: 4, text: "That sounds really isolating. I'd like to get to know you better.", hasActiveListening: true, hasValidation: true }
      ]
    },
    {
      id: 4,
      problem: "I've been feeling really down lately. Nothing seems to make me happy anymore, even things I used to enjoy.",
      emoji: "😢",
      replies: [
        { id: 1, text: "Just cheer up and think positive!", hasActiveListening: false, hasValidation: false },
        { id: 2, text: "I'm sorry you're going through this. That sounds really difficult. Have you talked to anyone about how you're feeling?", hasActiveListening: true, hasValidation: true },
        { id: 3, text: "Everyone gets sad sometimes, just get over it.", hasActiveListening: false, hasValidation: false },
        { id: 4, text: "I can hear how much this is weighing on you. Your feelings are valid. I'm here for you.", hasActiveListening: true, hasValidation: true }
      ]
    },
    {
      id: 5,
      problem: "I got rejected from my dream college. I worked so hard and now I feel like all my effort was wasted.",
      emoji: "😓",
      replies: [
        { id: 1, text: "It's not the end of the world, there are other colleges.", hasActiveListening: false, hasValidation: false },
        { id: 2, text: "I can imagine how disappointing that must feel after all your hard work. That really stings. Want to talk about what's next?", hasActiveListening: true, hasValidation: true },
        { id: 3, text: "Maybe you just weren't good enough for that school.", hasActiveListening: false, hasValidation: false },
        { id: 4, text: "That must be heartbreaking after putting in so much effort. I'm here to listen if you want to process this together.", hasActiveListening: true, hasValidation: true }
      ]
    }
  ];

  const handleReplySelect = (replyId) => {
    const vignette = vignettes[currentVignette];
    const reply = vignette.replies.find(r => r.id === replyId);
    
    const isGoodResponse = reply.hasActiveListening && reply.hasValidation;
    
    const newResponses = [...responses, {
      vignetteId: vignette.id,
      replyId,
      isGoodResponse
    }];
    
    setResponses(newResponses);
    
    if (isGoodResponse) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentVignette < vignettes.length - 1) {
      setTimeout(() => {
        setCurrentVignette(prev => prev + 1);
      }, isGoodResponse ? 1500 : 1000);
    } else {
      // Last question answered - calculate final score
      const goodCount = newResponses.filter(r => r.isGoodResponse).length;
      // Ensure coins match the actual number of correct answers
      setTimeout(() => {
        setCoins(goodCount);
        setShowResult(true);
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentVignette(0);
    setResponses([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/empathy-quiz");
  };

  const vignette = vignettes[currentVignette];
  const goodCount = responses.filter(r => r.isGoodResponse).length;
  // Ensure score matches the number of correct answers
  const finalScore = showResult ? goodCount : coins;

  return (
    <GameShell
      title="Listen Deep"
      subtitle={`Situation ${currentVignette + 1} of ${vignettes.length}`}
      onNext={handleNext}
      nextEnabled={showResult && goodCount >= 2}
      showGameOver={showResult && goodCount >= 2}
      score={finalScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-1"
      gameType="uvls"
      totalLevels={vignettes.length}
      currentLevel={currentVignette + 1}
      maxScore={vignettes.length}
      showConfetti={showResult && goodCount >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8 flex justify-center items-start">
        {!showResult ? (
      <div className="space-y-6 max-w-4xl w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-6xl mb-4 text-center">{vignette.emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white/90 italic text-lg">
                  "{vignette.problem}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center font-semibold">How do you respond?</p>
              
              <div className="space-y-3">
                {vignette.replies.map(reply => (
                  <button
                    key={reply.id}
                    onClick={() => handleReplySelect(reply.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{reply.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-white mb-4">
              {goodCount >= 2 ? "🎉 Great Listener!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You gave {goodCount} out of {vignettes.length} supportive responses!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {goodCount >= 2 ? "You earned 3 Coins! 🪙" : "Get 2 or more right to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Emphasize validating phrases like "I hear you" and "That sounds really hard."
            </p>
            {goodCount < 2 && (
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

export default ListenDeep;

