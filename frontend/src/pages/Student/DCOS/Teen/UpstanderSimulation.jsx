import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const UpstanderSimulation = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenario = {
    title: "Group Trolling Situation",
    emoji: "👥",
    situation: "You see a group of classmates ganging up to troll and bully someone online. What do you do?",
    choices: [
      { id: 1, text: "Join them to fit in", emoji: "😞", isCorrect: false },
      { id: 2, text: "Ignore it and walk away", emoji: "🚶", isCorrect: false },
      { id: 3, text: "Defend the victim and report the bullying", emoji: "🛡️", isCorrect: true }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = scenario.choices.find(c => c.id === selectedChoice);
    
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setEarnedBadge(true);
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setEarnedBadge(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/courage-badge");
  };

  const selectedChoiceData = scenario.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Upstander Simulation"
      subtitle="Be an Upstander, Not a Bystander"
      onNext={handleNext}
      nextEnabled={showFeedback && earnedBadge}
      showGameOver={showFeedback && earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="dcos-teen-19"
      gameType="dcos"
      totalLevels={20}
      currentLevel={19}
      showConfetti={showFeedback && earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{scenario.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center text-red-400">{scenario.title}</h2>
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {scenario.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">Choose Your Action:</h3>
            
            <div className="space-y-3 mb-6">
              {scenario.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🏆 Upstander Badge!" : "Not the Right Choice..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Perfect! You chose to be an UPSTANDER! Defending victims and reporting bullying 
                    is brave and essential. You're not just protecting one person - you're showing 
                    others that bullying is unacceptable. Your courage inspires change!
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-2">🏆</div>
                  <p className="text-white text-2xl font-bold">Upstander Badge!</p>
                  <p className="text-white/80 text-sm mt-2">You stand up for others!</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {selectedChoice === 1
                      ? "Joining bullies makes YOU a bully. True courage is standing up for victims, not fitting in with cruelty!"
                      : "Ignoring bullying makes you a bystander. Silence supports bullies. Be an upstander - defend and report!"}
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default UpstanderSimulation;

