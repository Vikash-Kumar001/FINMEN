import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotEmotionStory = () => {
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
      title: "Robot's Feelings",
      emoji: "🤖",
      situation: 'A robot says "I\'m sad." What should you do?',
      choices: [
        { id: 1, text: "Comfort the robot kindly", emoji: "💖", isCorrect: true },
        { id: 2, text: "Laugh at the robot", emoji: "😂", isCorrect: false },
        { id: 3, text: "Ignore it - robots don't have feelings", emoji: "😐", isCorrect: false }
      ],
      feedback: "Even though robots don’t feel emotions, showing kindness builds empathy and good habits."
    },
    {
      title: "Robot Mistake",
      emoji: "🧠",
      situation: "Your robot assistant makes a mistake in your homework. What will you do?",
      choices: [
        { id: 1, text: "Yell at the robot", emoji: "😡", isCorrect: false },
        { id: 2, text: "Calmly fix the error", emoji: "🛠️", isCorrect: true },
        { id: 3, text: "Throw it away", emoji: "🗑️", isCorrect: false }
      ],
      feedback: "Staying calm and solving problems teaches patience and logical thinking."
    },
    {
      title: "Robot Gift",
      emoji: "🎁",
      situation: "You get a toy robot as a gift. What should you do first?",
      choices: [
        { id: 1, text: "Say thank you", emoji: "🙏", isCorrect: true },
        { id: 2, text: "Complain it’s not advanced enough", emoji: "😒", isCorrect: false },
        { id: 3, text: "Break it for fun", emoji: "💥", isCorrect: false }
      ],
      feedback: "Gratitude is always the best response — it shows respect and kindness."
    },
    {
      title: "Robot Friend",
      emoji: "🫂",
      situation: "A robot helps an old man cross the street. What do you do?",
      choices: [
        { id: 1, text: "Applaud the robot and the man", emoji: "👏", isCorrect: true },
        { id: 2, text: "Say robots shouldn’t help humans", emoji: "🚫", isCorrect: false },
        { id: 3, text: "Just walk away silently", emoji: "🚶‍♀️", isCorrect: false }
      ],
      feedback: "Recognizing good acts motivates both humans and AI to do better."
    },
    {
      title: "Robot Recycling",
      emoji: "♻️",
      situation: "Your robot runs out of battery and breaks down. What should you do?",
      choices: [
        { id: 1, text: "Recycle it safely", emoji: "🧩", isCorrect: true },
        { id: 2, text: "Throw it in the trash", emoji: "🗑️", isCorrect: false },
        { id: 3, text: "Leave it lying outside", emoji: "🌧️", isCorrect: false }
      ],
      feedback: "Recycling electronics protects the planet and shows responsibility."
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const current = questions[currentQuestion];
    const choice = current.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      setCoins(prev => prev + 5);
      showCorrectAnswerFeedback(5, true);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/recommendation-game");
    }
  };

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Robot Emotion Story"
      subtitle="Empathy with AI"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-kids-19"
      gameType="ai"
      totalLevels={100}
      currentLevel={19}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map(choice => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "✅ Correct!" : "🤔 Think Again"}
            </h2>
            <p className="text-white/90 text-lg mb-6">{current.feedback}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold mb-6">+5 Coins 🪙</p>
            ) : null}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion === questions.length - 1 ? "Finish Story" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotEmotionStory;
