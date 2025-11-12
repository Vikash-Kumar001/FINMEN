import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmpathyQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Your friend tells you they failed a test and feels terrible.",
      options: [
        { id: "empathy", text: "I understand how disappointing that must feel. I'm here for you.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "Oh, poor you. That's so sad.", type: "sympathy", isCorrect: false },
        { id: "dismiss", text: "It's just one test, get over it.", type: "dismissive", isCorrect: false }
      ],
      explanation: "Empathy means understanding and sharing feelings. Sympathy is feeling sorry for someone."
    },
    {
      id: 2,
      text: "A classmate is anxious about presenting in front of the class.",
      options: [
        { id: "empathy", text: "I can see you're nervous. I felt the same way before my presentation. You'll do great.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "I feel so sorry for you having to present.", type: "sympathy", isCorrect: false },
        { id: "minimize", text: "Everyone has to present, just do it.", type: "minimize", isCorrect: false }
      ],
      explanation: "Empathy connects by sharing similar feelings and offering support."
    },
    {
      id: 3,
      text: "Someone shares that they're being bullied.",
      options: [
        { id: "empathy", text: "That sounds really scary and hurtful. Let's talk about how to get help.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "Oh no, you poor thing. I pity you.", type: "sympathy", isCorrect: false },
        { id: "blame", text: "What did you do to make them bully you?", type: "blame", isCorrect: false }
      ],
      explanation: "Empathy involves understanding their pain and offering to help, not pitying them."
    },
    {
      id: 4,
      text: "Your friend's pet passed away and they're very sad.",
      options: [
        { id: "empathy", text: "I can imagine how heartbroken you must be. Your pet was so special to you.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "That's so sad. Poor little pet.", type: "sympathy", isCorrect: false },
        { id: "minimize", text: "It's just a pet, you can get another one.", type: "minimize", isCorrect: false }
      ],
      explanation: "Empathy acknowledges their unique bond and pain."
    },
    {
      id: 5,
      text: "A peer is struggling with family financial problems.",
      options: [
        { id: "empathy", text: "That must be really stressful for you and your family. I'm here to listen.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "Oh, that's terrible. I feel so bad for you.", type: "sympathy", isCorrect: false },
        { id: "compare", text: "We all have money problems sometimes.", type: "compare", isCorrect: false }
      ],
      explanation: "Empathy validates their specific struggle without comparing or pitying."
    },
    {
      id: 6,
      text: "Someone is upset about not making the sports team.",
      options: [
        { id: "empathy", text: "I can see how disappointed you are. You worked really hard for this.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "Aww, that's sad. Poor thing.", type: "sympathy", isCorrect: false },
        { id: "toxic", text: "You probably weren't good enough anyway.", type: "toxic", isCorrect: false }
      ],
      explanation: "Empathy recognizes their effort and shares in their disappointment."
    }
  ];

  const handleAnswer = (optionId) => {
    const scenario = scenarios[currentQuestion];
    const option = scenario.options.find(opt => opt.id === optionId);
    
    const newAnswers = [...answers, {
      scenarioId: scenario.id,
      answer: optionId,
      isCorrect: option.isCorrect
    }];
    
    setAnswers(newAnswers);
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, option.isCorrect ? 1000 : 800);
    } else {
      const correctCount = newAnswers.filter(a => a.isCorrect).length;
      const percentage = (correctCount / scenarios.length) * 100;
      if (percentage >= 70) {
        setCoins(3); // +3 Coins for ≥70% (minimum for progress)
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/perspective-puzzle");
  };

  const correctCount = answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / scenarios.length) * 100);

  return (
    <GameShell
      title="Empathy Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && percentage >= 70}
      showGameOver={showResult && percentage >= 70}
      score={coins}
      gameId="uvls-teen-2"
      gameType="uvls"
      totalLevels={20}
      currentLevel={2}
      showConfetti={showResult && percentage >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6 font-semibold text-center">
                {scenarios[currentQuestion].text}
              </p>
              
              <div className="space-y-3 mb-4">
                {scenarios[currentQuestion].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{option.text}</div>
                    <div className="text-white/60 text-xs mt-1">{option.type}</div>
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-500/20 rounded-lg p-3 mt-4">
                <p className="text-white/80 text-sm">
                  💡 {scenarios[currentQuestion].explanation}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {percentage >= 70 ? "🎉 Empathy Master!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {correctCount} out of {scenarios.length} correct ({percentage}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {percentage >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use local culturally relevant examples when teaching empathy vs sympathy.
            </p>
            {percentage < 70 && (
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

export default EmpathyQuiz;

