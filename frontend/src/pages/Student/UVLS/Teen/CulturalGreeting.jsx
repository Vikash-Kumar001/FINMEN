import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CulturalGreeting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentContext, setCurrentContext] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const contexts = [
    {
      id: 1,
      context: "Meeting a Japanese exchange student for the first time",
      emoji: "🇯🇵",
      greetings: [
        { id: 1, text: "Bow slightly and say 'Konnichiwa'", isRespectful: true, rationale: "Shows respect for their culture" },
        { id: 2, text: "High five enthusiastically", isRespectful: false, rationale: "May be too informal" },
        { id: 3, text: "Hug them immediately", isRespectful: false, rationale: "Personal space is valued" }
      ]
    },
    {
      id: 2,
      context: "Greeting an elderly person in your community",
      emoji: "👴",
      greetings: [
        { id: 1, text: "Use respectful title (Sir/Ma'am) and maintain eye contact", isRespectful: true, rationale: "Shows proper respect" },
        { id: 2, text: "Hey dude!", isRespectful: false, rationale: "Too casual" },
        { id: 3, text: "Ignore them", isRespectful: false, rationale: "Disrespectful" }
      ]
    },
    {
      id: 3,
      context: "Meeting a Muslim classmate during Ramadan",
      emoji: "🕌",
      greetings: [
        { id: 1, text: "Ramadan Mubarak! How is your fast going?", isRespectful: true, rationale: "Acknowledges their practice" },
        { id: 2, text: "Want some food?", isRespectful: false, rationale: "Insensitive to fasting" },
        { id: 3, text: "Why aren't you eating?", isRespectful: false, rationale: "Shows lack of awareness" }
      ]
    },
    {
      id: 4,
      context: "Greeting a teacher from a different cultural background",
      emoji: "👨‍🏫",
      greetings: [
        { id: 1, text: "Good morning, [Title] [Last Name]", isRespectful: true, rationale: "Professional and respectful" },
        { id: 2, text: "Yo, what's up!", isRespectful: false, rationale: "Too informal" },
        { id: 3, text: "Hey teacher!", isRespectful: false, rationale: "Lacks proper respect" }
      ]
    },
    {
      id: 5,
      context: "Meeting someone who uses a wheelchair",
      emoji: "♿",
      greetings: [
        { id: 1, text: "Make eye contact and greet them normally at their level", isRespectful: true, rationale: "Treats them equally" },
        { id: 2, text: "Lean down and speak slowly like to a child", isRespectful: false, rationale: "Condescending" },
        { id: 3, text: "Avoid greeting to not seem awkward", isRespectful: false, rationale: "Exclusionary" }
      ]
    },
    {
      id: 6,
      context: "Greeting someone who is non-binary",
      emoji: "🏳️‍🌈",
      greetings: [
        { id: 1, text: "Hi! What pronouns do you use?", isRespectful: true, rationale: "Respectful and inclusive" },
        { id: 2, text: "Hey girl/boy!", isRespectful: false, rationale: "Assumes gender" },
        { id: 3, text: "You're a he or she?", isRespectful: false, rationale: "Insensitive phrasing" }
      ]
    }
  ];

  const handleGreetingSelect = (greetingId) => {
    const context = contexts[currentContext];
    const greeting = context.greetings.find(g => g.id === greetingId);
    
    const newResponses = [...responses, {
      contextId: context.id,
      greetingId,
      isRespectful: greeting.isRespectful,
      rationale: greeting.rationale
    }];
    
    setResponses(newResponses);
    
    if (greeting.isRespectful) {
      showCorrectAnswerFeedback(5, true);
    }
    
    if (currentContext < contexts.length - 1) {
      setTimeout(() => {
        setCurrentContext(prev => prev + 1);
      }, greeting.isRespectful ? 1500 : 1000);
    } else {
      const respectfulCount = newResponses.filter(r => r.isRespectful).length;
      if (respectfulCount >= 5) {
        setCoins(3); // +3 Coins for respectful greetings (minimum for progress)
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentContext(0);
    setResponses([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/inclusion-quiz");
  };

  const context = contexts[currentContext];
  const respectfulCount = responses.filter(r => r.isRespectful).length;
  const lastResponse = responses[responses.length - 1];

  return (
    <GameShell
      title="Cultural Greeting"
      subtitle={`Context ${currentContext + 1} of ${contexts.length}`}
      onNext={handleNext}
      nextEnabled={showResult && respectfulCount >= 5}
      showGameOver={showResult && respectfulCount >= 5}
      score={coins}
      gameId="uvls-teen-11"
      gameType="uvls"
      totalLevels={20}
      currentLevel={11}
      showConfetti={showResult && respectfulCount >= 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-6xl mb-4 text-center">{context.emoji}</div>
              
              <p className="text-white text-lg mb-6 font-semibold text-center">
                {context.context}
              </p>
              
              <p className="text-white/90 mb-4 text-center">How do you greet them?</p>
              
              <div className="space-y-3">
                {context.greetings.map(greeting => (
                  <button
                    key={greeting.id}
                    onClick={() => handleGreetingSelect(greeting.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{greeting.text}</div>
                  </button>
                ))}
              </div>
              
              {lastResponse && currentContext > 0 && (
                <div className={`mt-4 p-4 rounded-xl ${
                  lastResponse.isRespectful
                    ? 'bg-green-500/30 border-2 border-green-400'
                    : 'bg-red-500/30 border-2 border-red-400'
                }`}>
                  <p className="text-white font-medium text-sm">
                    💡 {lastResponse.rationale}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {respectfulCount >= 5 ? "🎉 Culturally Aware!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made {respectfulCount} out of {contexts.length} respectful greetings!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {respectfulCount >= 5 ? "You earned 3 Coins! 🪙" : "Get 5 or more correct to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use local cultural norms and invite students to share greetings from their cultures!
            </p>
            {respectfulCount < 5 && (
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

export default CulturalGreeting;

