import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DeEscalationRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badge, setBadge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleConfirm();
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      argument: "Yelling in argument.",
      emoji: "😠",
      languages: [
        { id: 1, text: "Let's lower voices.", deescalate: true },
        { id: 2, text: "Yell louder.", deescalate: false },
        { id: 3, text: "Take a break.", deescalate: true },
        { id: 4, text: "Insult back.", deescalate: false }
      ]
    },
    {
      id: 2,
      argument: "Name calling.",
      emoji: "🗣️",
      languages: [
        { id: 1, text: "That's hurtful, let's talk.", deescalate: true },
        { id: 2, text: "Call names back.", deescalate: false },
        { id: 3, text: "Use I feel statements.", deescalate: true },
        { id: 4, text: "Ignore.", deescalate: false }
      ]
    },
    {
      id: 3,
      argument: "Physical aggression threat.",
      emoji: "💪",
      languages: [
        { id: 1, text: "Step back, calm down.", deescalate: true },
        { id: 2, text: "Threaten back.", deescalate: false },
        { id: 3, text: "Get help.", deescalate: true },
        { id: 4, text: "Engage physically.", deescalate: false }
      ]
    },
    {
      id: 4,
      argument: "Emotional outburst.",
      emoji: "😢",
      languages: [
        { id: 1, text: "I understand you're upset.", deescalate: true },
        { id: 2, text: "Stop crying.", deescalate: false },
        { id: 3, text: "Listen actively.", deescalate: true },
        { id: 4, text: "Dismiss feelings.", deescalate: false }
      ]
    },
    {
      id: 5,
      argument: "Group conflict.",
      emoji: "👥",
      languages: [
        { id: 1, text: "Let's hear all sides.", deescalate: true },
        { id: 2, text: "Take one side.", deescalate: false },
        { id: 3, text: "Find common ground.", deescalate: true },
        { id: 4, text: "Escalate.", deescalate: false }
      ]
    }
  ];

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const language = question.languages.find(l => l.id === selectedLanguage) || { deescalate: false };
    
    const isDeescalate = language.deescalate;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isDeescalate
    }];
    
    setResponses(newResponses);
    
    if (isDeescalate) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedLanguage(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const deescalateCount = newResponses.filter(r => r.isDeescalate).length;
      if (deescalateCount >= 3) {
        setBadge(true);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const deescalateCount = responses.filter(r => r.isDeescalate).length;

  return (
    <GameShell
      title="De-escalation Roleplay"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && deescalateCount >= 3}
      showGameOver={showResult && deescalateCount >= 3}
      score={0}
      gameId="emotion-145"
      gameType="emotion"
      totalLevels={10}
      currentLevel={5}
      showConfetti={showResult && deescalateCount >= 3}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <div className="text-5xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Argument: {questions[currentQuestion].argument}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Choose language:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].languages.map(language => (
                  <button
                    key={language.id}
                    onClick={() => handleLanguageSelect(language.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedLanguage === language.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{language.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedLanguage && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedLanguage || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Calm
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {deescalateCount >= 3 ? "🎉 De-escalator!" : "💪 More Techniques!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              De-escalation techniques: {deescalateCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {deescalateCount >= 3 ? "Earned Badge!" : "Need 3+ techniques."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Reinforce non-verbal calming cues.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DeEscalationRoleplay;