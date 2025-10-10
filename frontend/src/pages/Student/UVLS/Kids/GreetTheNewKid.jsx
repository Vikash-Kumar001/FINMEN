import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GreetTheNewKid = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "A new student walks into your classroom looking nervous. What do you do?",
      emoji: "👋",
      options: [
        { id: "friendly", text: "Hi! I'm [your name]. Want to sit with me?", emoji: "😊", isFriendly: true },
        { id: "ignore", text: "Don't say anything and look away", emoji: "😐", isFriendly: false },
        { id: "stare", text: "Stare at them without saying anything", emoji: "👀", isFriendly: false }
      ]
    },
    {
      id: 2,
      text: "You see a new kid sitting alone at lunch. What do you say?",
      emoji: "🍽️",
      options: [
        { id: "invite", text: "Want to join us for lunch?", emoji: "🤗", isFriendly: true },
        { id: "ignore", text: "Pretend you don't see them", emoji: "🙈", isFriendly: false },
        { id: "laugh", text: "Laugh with friends about them", emoji: "😏", isFriendly: false }
      ]
    },
    {
      id: 3,
      text: "A new student doesn't know where the bathroom is. What do you do?",
      emoji: "🚪",
      options: [
        { id: "help", text: "I can show you where it is!", emoji: "👉", isFriendly: true },
        { id: "point", text: "Point vaguely without explaining", emoji: "🫱", isFriendly: false },
        { id: "walk", text: "Walk away without helping", emoji: "🚶", isFriendly: false }
      ]
    },
    {
      id: 4,
      text: "Your teacher asks you to show the new student around. How do you respond?",
      emoji: "🏫",
      options: [
        { id: "happy", text: "Sure! I'd love to help!", emoji: "😄", isFriendly: true },
        { id: "sigh", text: "Sigh and do it reluctantly", emoji: "😮‍💨", isFriendly: false },
        { id: "refuse", text: "Say you're too busy", emoji: "🙅", isFriendly: false }
      ]
    },
    {
      id: 5,
      text: "The new student is from another country. What's the best greeting?",
      emoji: "🌍",
      options: [
        { id: "welcome", text: "Welcome! We're glad you're here!", emoji: "🎉", isFriendly: true },
        { id: "weird", text: "You talk funny", emoji: "😒", isFriendly: false },
        { id: "avoid", text: "Avoid them because they're different", emoji: "❌", isFriendly: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const scenario = scenarios[currentScenario];
    const option = scenario.options.find(opt => opt.id === optionId);
    
    const newChoices = [...choices, {
      scenarioId: scenario.id,
      choice: optionId,
      isFriendly: option.isFriendly
    }];
    
    setChoices(newChoices);
    
    if (option.isFriendly) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, option.isFriendly ? 1000 : 0);
    } else {
      const friendlyCount = newChoices.filter(c => c.isFriendly).length;
      // Award bonus if passing
      if (friendlyCount >= 3 && coins < 3) {
        setCoins(3); // Minimum 3 coins for passing
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setChoices([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/kids/polite-words-quiz");
  };

  const friendlyCount = choices.filter(c => c.isFriendly).length;

  return (
    <GameShell
      title="Greet the New Kid"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && friendlyCount >= 3}
      showGameOver={showResult && friendlyCount >= 3}
      score={coins}
      gameId="uvls-kids-11"
      gameType="uvls"
      totalLevels={20}
      currentLevel={11}
      showConfetti={showResult && friendlyCount >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-6xl mb-4 text-center">{scenarios[currentScenario].emoji}</div>
              
              <p className="text-white text-lg mb-6 text-center">
                {scenarios[currentScenario].text}
              </p>
              
              <div className="space-y-3">
                {scenarios[currentScenario].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 flex items-center gap-3"
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="text-white font-medium text-left">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {friendlyCount >= 3 ? "🎉 Super Welcoming!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made {friendlyCount} out of {scenarios.length} friendly choices!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              Total Coins: {coins} 🪙
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Practice greetings in pairs to build confidence!
            </p>
            {friendlyCount < 3 && (
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

export default GreetTheNewKid;

