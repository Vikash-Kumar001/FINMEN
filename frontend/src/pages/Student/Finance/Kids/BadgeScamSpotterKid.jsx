import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Shield, AlertTriangle, Eye, Phone, Mail } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeScamSpotterKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [scamsSpotted, setScamsSpotted] = useState(0);

  const levels = [
    {
      id: 1,
      title: "Free Gift Trick",
      question: "A stranger says 'Win FREE iPhone! Just give me your parent's phone number!' What do you do?",
      icon: Phone,
      scamType: "Too Good to Be True",
      options: [
        { text: "Say NO and tell parents immediately", correct: true, coins: 10 },
        { text: "Give phone number for free gift", correct: false, coins: 0 },
        { text: "Ask friends to give their numbers", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Nothing is truly free. Always tell parents about such offers!",
        wrong: "Red flag! Never share family information with strangers, even for 'free' gifts!"
      }
    },
    {
      id: 2,
      title: "Fake Website Trap",
      question: "A website looks like your favorite game but asks for parent's credit card. What's wrong?",
      icon: Eye,
      scamType: "Fake Website",
      options: [
        { text: "It's a SCAM! Real games don't ask for this", correct: true, coins: 15 },
        { text: "It's okay because I know the game", correct: false, coins: 0 },
        { text: "Enter card details to unlock levels", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Fake websites copy real ones. Always check with parents first!",
        wrong: "Danger! Scammers create fake websites that look real. Never enter card details!"
      }
    },
    {
      id: 3,
      title: "Urgent Help Scam",
      question: "You get a message: 'Your friend is in trouble! Send money now!' What should you do?",
      icon: AlertTriangle,
      scamType: "Urgency Trick",
      options: [
        { text: "Call friend directly and tell parents", correct: true, coins: 20 },
        { text: "Send money immediately to help", correct: false, coins: 0 },
        { text: "Forward message to other friends", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Smart! Scammers create fake urgency. Always verify through phone calls!",
        wrong: "Stop! Scammers use urgency to make you panic. Always verify first!"
      }
    },
    {
      id: 4,
      title: "Email Prize Scam",
      question: "Email says 'You won 1 Lakh rupees! Click link and enter OTP.' What do you do?",
      icon: Mail,
      scamType: "Phishing Email",
      options: [
        { text: "Delete immediately and tell parents", correct: true, coins: 25 },
        { text: "Click link to see if it's real", correct: false, coins: 0 },
        { text: "Enter OTP to claim prize", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Brilliant! Never click suspicious links or share OTPs. That's phishing!",
        wrong: "Warning! This is phishing! Never click unknown links or share OTPs!"
      }
    },
    {
      id: 5,
      title: "Social Media Scam",
      question: "Online stranger offers 'Easy money - just share your school details!' What's your response?",
      icon: Shield,
      scamType: "Information Theft",
      options: [
        { text: "Block them and report to parents/teacher", correct: true, coins: 30 },
        { text: "Share details for easy money", correct: false, coins: 0 },
        { text: "Ask what kind of work first", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! You're a true Scam Spotter! Never share personal info online!",
        wrong: "Danger! Scammers collect personal info to harm you. Never share details!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setAnswered(true);
    
    if (option.correct) {
      setTotalCoins(totalCoins + option.coins);
      setScamsSpotted(scamsSpotted + 1);
      showCorrectAnswerFeedback(option.coins, true);
      
      if (currentLevel === 5) {
        setEarnedBadge(true);
      }
    }
    
    // Automatically advance to next round after a delay
    setTimeout(() => {
      if (currentLevel < 5) {
        setCurrentLevel(currentLevel + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        // For the last round, show badge and then automatically navigate
        setTimeout(() => {
          navigate("/games/financial-literacy/kids");
        }, 3000); // Show the badge for 3 seconds before navigating
      }
    }, 2000);
  };

  const handleNext = () => {
    if (currentLevel < 5) {
      setCurrentLevel(currentLevel + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      navigate("/games/financial-literacy/kids");
    }
  };

  return (
    <GameShell
      title={`Round ${currentLevel} – ${currentLevelData.title}`}
      subtitle={currentLevelData.question}
      coins={totalCoins}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={currentLevel === 5 && answered ? () => navigate("/games/financial-literacy/kids") : null}
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextEnabled={currentLevel === 5 && answered}
      nextLabel={"Finish & Claim Badge"}
      showConfetti={answered && selectedAnswer?.correct}
      score={totalCoins}
      gameId="finance-kids-170"
      gameType="finance"
    >
      <div className="text-center text-white space-y-3 max-w-4xl mx-auto px-4">
        {/* Scam Alert Icon */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            <Icon className="w-14 h-14 text-red-400 animate-pulse" />
            {answered && selectedAnswer?.correct && (
              <Shield className="absolute -top-1 -right-1 w-6 h-6 text-green-400 animate-bounce" />
            )}
          </div>
        </div>

        {/* Scam Type Badge */}
        <div className="bg-red-900/30 backdrop-blur-sm rounded-lg p-2 border border-red-500/30 max-w-xs mx-auto">
          <p className="text-red-300 font-semibold text-xs">
            ⚠️ {currentLevelData.scamType}
          </p>
        </div>

        {!answered ? (
          <div className="space-y-2">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 px-5 py-2.5 rounded-full text-white font-bold hover:scale-105 transition-transform hover:shadow-lg text-xs"
              >
                {option.text}
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-4 rounded-xl border-2 ${
            selectedAnswer.correct 
              ? 'bg-green-500/20 border-green-400' 
              : 'bg-red-500/20 border-red-400'
          }`}>
            <Trophy className={`mx-auto w-10 h-10 mb-2 ${
              selectedAnswer.correct ? 'text-yellow-400' : 'text-gray-400'
            }`} />
            <h3 className="text-base font-bold mb-1">
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins! 🛡️` : 'Stay Alert!'}
            </h3>
            <p className="text-white/90 text-xs">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {earnedBadge && (
              <div className="mt-3 p-3 bg-gradient-to-r from-yellow-500/30 to-red-500/30 rounded-xl border-2 border-yellow-400 animate-pulse">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-7 h-7 text-yellow-400" />
                  <Shield className="w-7 h-7 text-green-400" />
                </div>
                <p className="text-base font-bold text-yellow-300 mb-1">
                  🛡️ Scam Spotter Badge! 🛡️
                </p>
                <p className="text-white/90 text-xs mb-1">
                  You can spot scams and stay safe!
                </p>
                <p className="text-green-200 font-bold text-xs">
                  Coins: {totalCoins} 💰
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Shields */}
        <div className="flex justify-center gap-2 mt-2">
          {levels.map((level) => (
            <Shield
              key={level.id}
              className={`w-5 h-5 transition-all duration-300 ${
                level.id <= scamsSpotted
                  ? 'text-green-400 scale-110'
                  : level.id === currentLevel
                  ? 'text-yellow-400 animate-pulse'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>

        {currentLevel === 5 && answered && (
          <div className="mt-2 p-2 bg-red-500/20 rounded-lg border border-red-400">
            <p className="text-xs text-red-200">
              🔒 Remember: NEVER share passwords, OTPs, or family info online!
            </p>
          </div>
        )}

        {/* Safety Stats */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm">
            <p className="text-white/70 text-xs">Scams Spotted</p>
            <p className="text-green-400 font-bold text-base">{scamsSpotted}/5</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm">
            <p className="text-white/70 text-xs">Safety Score</p>
            <p className="text-yellow-400 font-bold text-base">{totalCoins}</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeScamSpotterKid;