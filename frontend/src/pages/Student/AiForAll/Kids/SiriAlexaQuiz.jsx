import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SiriAlexaQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // ✅ 5 Questions in same flow
  const questions = [
    {
      text: "Is Alexa an AI?",
      emoji: "🔊",
      choices: [
        { id: 1, text: "Yes", emoji: "✓", isCorrect: true },
        { id: 2, text: "No", emoji: "✗", isCorrect: false },
      ],
      correctMsg:
        "Yes! Alexa, Siri, and Google Assistant are all AI — they understand your voice and help you with tasks!",
      wrongMsg:
        "Alexa IS an AI! Voice assistants like Siri and Alexa use AI to understand and respond to you.",
    },
    {
      text: "What can Siri do using AI?",
      emoji: "📱",
      choices: [
        { id: 1, text: "Set alarms and reminders", emoji: "⏰", isCorrect: true },
        { id: 2, text: "Cook food", emoji: "🍳", isCorrect: false },
      ],
      correctMsg:
        "Correct! Siri uses AI to understand commands like setting alarms or reminders.",
      wrongMsg:
        "Not quite! Siri can’t cook — but she can set alarms, call people, and answer questions using AI.",
    },
    {
      text: "Does Alexa learn from your voice patterns?",
      emoji: "🗣️",
      choices: [
        { id: 1, text: "Yes, to improve answers", emoji: "💡", isCorrect: true },
        { id: 2, text: "No, it never learns", emoji: "🚫", isCorrect: false },
      ],
      correctMsg:
        "Exactly! Alexa learns from your speech patterns to understand you better over time.",
      wrongMsg:
        "Actually, Alexa uses machine learning to recognize and improve its understanding of your voice.",
    },
    {
      text: "Which of these is NOT an AI assistant?",
      emoji: "🤔",
      choices: [
        { id: 1, text: "Google Assistant", emoji: "🎙️", isCorrect: false },
        { id: 2, text: "Refrigerator", emoji: "🧊", isCorrect: true },
      ],
      correctMsg:
        "Right! A refrigerator isn’t an AI assistant — Google Assistant, Siri, and Alexa are!",
      wrongMsg:
        "Oops! A refrigerator is not an AI — AI assistants like Google Assistant and Alexa can talk and respond!",
    },
    {
      text: "How do Siri and Alexa help us daily?",
      emoji: "💬",
      choices: [
        { id: 1, text: "By answering questions and reminders", emoji: "🧠", isCorrect: true },
        { id: 2, text: "By playing video games for us", emoji: "🎮", isCorrect: false },
      ],
      correctMsg:
        "Perfect! They assist with reminders, answers, and tasks using speech recognition AI.",
      wrongMsg:
        "Not really! Siri and Alexa help by listening, answering, and reminding — not gaming.",
    },
  ];

  const current = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    const choice = current.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-in-games");
  };

  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <GameShell
      title="Siri/Alexa Quiz"
      score={score}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-10"
      gameType="ai"
      totalLevels={20}
      currentLevel={10}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Test Your Knowledge</h3>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-3 text-center">{current.emoji}</div>
              <p className="text-white text-xl font-semibold text-center">"{current.text}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-white/20 hover:bg-white/30 border-3 border-white/40 rounded-xl p-8 transition-all transform hover:scale-105"
                >
                  <div className="text-5xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-xl">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 AI Assistant Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You answered {score} out of {questions.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI assistants like Siri, Alexa, and Google Assistant use artificial intelligence to understand and respond to your voice!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {score} Points! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default SiriAlexaQuiz;