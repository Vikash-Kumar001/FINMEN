import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InviteToPlay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-15";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentScene, setCurrentScene] = useState(0);
  const [invitations, setInvitations] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenes = [
    {
      id: 1,
      description: "You see a shy child sitting alone during recess",
      emoji: "😔",
      phrases: [
        { id: "invite", text: "Hi! Want to come play with us?", isInviting: true },
        { id: "ignore", text: "Walk past without saying anything", isInviting: false },
        { id: "point", text: "Just point at them without speaking", isInviting: false }
      ]
    },
    {
      id: 2,
      description: "A new student is watching your game from far away",
      emoji: "👀",
      phrases: [
        { id: "wave", text: "Hey! Come join our team!", isInviting: true },
        { id: "continue", text: "Keep playing and ignore them", isInviting: false },
        { id: "stare", text: "Stare back at them", isInviting: false }
      ]
    },
    {
      id: 3,
      description: "Someone is sitting alone at the art table",
      emoji: "🎨",
      phrases: [
        { id: "invite", text: "We have extra crayons! Want to draw with us?", isInviting: true },
        { id: "ask", text: "Why are you alone?", isInviting: false },
        { id: "leave", text: "Move to another table", isInviting: false }
      ]
    },
    {
      id: 4,
      description: "A classmate is standing near the swings looking sad",
      emoji: "🛝",
      phrases: [
        { id: "offer", text: "Would you like to swing together?", isInviting: true },
        { id: "take", text: "Take the swing without asking", isInviting: false },
        { id: "walk", text: "Walk away to play elsewhere", isInviting: false }
      ]
    },
    {
      id: 5,
      description: "Someone dropped their lunch and is sitting alone",
      emoji: "🍱",
      phrases: [
        { id: "share", text: "I can share my lunch with you. Come sit!", isInviting: true },
        { id: "laugh", text: "Laugh at them for dropping it", isInviting: false },
        { id: "ignore", text: "Eat your own lunch silently", isInviting: false }
      ]
    }
  ];

  const handlePhraseChoice = (phraseId) => {
    const scene = scenes[currentScene];
    const phrase = scene.phrases.find(p => p.id === phraseId);
    
    const newInvitations = [...invitations, {
      sceneId: scene.id,
      phraseId,
      isInviting: phrase.isInviting
    }];
    
    setInvitations(newInvitations);
    
    if (phrase.isInviting) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentScene < scenes.length - 1) {
      setTimeout(() => {
        setCurrentScene(prev => prev + 1);
      }, phrase.isInviting ? 1000 : 0);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScene(0);
    setInvitations([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const invitingCount = invitations.filter(inv => inv.isInviting).length;

  return (
    <GameShell
      title="Invite to Play"
      score={coins}
      subtitle={`Scene ${currentScene + 1} of ${scenes.length}`}
      onNext={handleNext}
      nextEnabled={showResult && invitingCount >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && invitingCount >= 3}
      
      gameId="uvls-kids-15"
      gameType="uvls"
      totalLevels={20}
      currentLevel={15}
      showConfetti={showResult && invitingCount >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-7xl mb-4 text-center">{scenes[currentScene].emoji}</div>
              
              <p className="text-white text-lg mb-6 text-center font-semibold">
                {scenes[currentScene].description}
              </p>
              
              <p className="text-white/90 mb-4 text-center">What do you do?</p>
              
              <div className="space-y-3">
                {scenes[currentScene].phrases.map(phrase => (
                  <button
                    key={phrase.id}
                    onClick={() => handlePhraseChoice(phrase.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102"
                  >
                    <div className="text-white font-medium">{phrase.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {invitingCount >= 3 ? "🎉 You're So Welcoming!" : "💪 Practice Inviting!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You invited {invitingCount} out of {scenes.length} times!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              Total Coins: {coins} 🪙
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Make inviting a daily classroom task!
            </p>
            {invitingCount < 3 && (
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

export default InviteToPlay;

