import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AISpaceStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "AI Assists on Mars",
      emoji: "🚀",
      situation: "AI helps astronauts on Mars. Who ultimately controls the mission?",
      choices: [
        { id: 1, text: "Humans", emoji: "👨‍🚀", isCorrect: true },
        { id: 2, text: "AI alone", emoji: "🤖", isCorrect: false },
        { id: 3, text: "Earth satellites", emoji: "🛰️", isCorrect: false }
      ]
    },
    {
      title: "AI Navigation",
      emoji: "🛰️",
      situation: "AI provides navigation assistance on Mars. Who makes final decisions?",
      choices: [
        { id: 1, text: "Humans", emoji: "👨‍🚀", isCorrect: true },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: false },
        { id: 3, text: "Mission Control only", emoji: "🌍", isCorrect: false }
      ]
    },
    {
      title: "Resource Management",
      emoji: "🔋",
      situation: "AI monitors oxygen and water supply. Who acts on alerts?",
      choices: [
        { id: 1, text: "Astronauts", emoji: "👨‍🚀", isCorrect: true },
        { id: 2, text: "AI autonomously", emoji: "🤖", isCorrect: false },
        { id: 3, text: "Mars base AI", emoji: "🏠", isCorrect: false }
      ]
    },
    {
      title: "Emergency Handling",
      emoji: "⚠️",
      situation: "AI detects equipment failure. Who decides the response?",
      choices: [
        { id: 1, text: "Humans", emoji: "👨‍🚀", isCorrect: true },
        { id: 2, text: "AI system", emoji: "🤖", isCorrect: false },
        { id: 3, text: "Ground team only", emoji: "🌍", isCorrect: false }
      ]
    },
    {
      title: "Future Missions",
      emoji: "🪐",
      situation: "AI plans future Mars experiments. Who approves the plan?",
      choices: [
        { id: 1, text: "Humans", emoji: "👨‍🚀", isCorrect: true },
        { id: 2, text: "AI alone", emoji: "🤖", isCorrect: false },
        { id: 3, text: "Robots", emoji: "🤖🤖", isCorrect: false }
      ]
    }
  ];

  const currentData = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentData.choices.find(c => c.id === selectedChoice);
    
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(2, true);
      setCoins(prev => prev + 2); // 2 coins per correct answer for total 10
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCurrentQuestion(0);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/teen/ai-creativity-simulation");
    }
  };

  const selectedChoiceData = currentData.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="AI & Space Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-15"
      gameType="ai"
      totalLevels={20}
      currentLevel={15}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">{currentData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentData.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {currentData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
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
              {selectedChoiceData.isCorrect ? "🚀 Mission Approved!" : "Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Correct! Humans control AI-assisted tasks in space missions. AI supports but humans make critical decisions.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 2 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Remember: AI assists astronauts, but humans control critical decisions.
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

export default AISpaceStory;
