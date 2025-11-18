import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeLifelongLearnerKid = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is a habit of lifelong learners?",
      options: [
        {
          id: "a",
          text: "Reading regularly to learn new things",
          emoji: "📚",
          description: "Correct! Lifelong learners read regularly to expand their knowledge!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stopping learning after school",
          emoji: "🛑",
          description: "Lifelong learners continue learning throughout their lives!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Lifelong learners welcome:",
      options: [
        {
          id: "a",
          text: "New challenges and experiences",
          emoji: "🌟",
          description: "Exactly! Lifelong learners embrace new challenges as opportunities to grow!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Staying in their comfort zone",
          emoji: "🛋️",
          description: "Actually, lifelong learners step out of their comfort zones to learn!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps develop a lifelong learning mindset?",
      options: [
        {
          id: "a",
          text: "Asking questions and staying curious",
          emoji: "❓",
          description: "Perfect! Curiosity and questioning are key to lifelong learning!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Thinking you know everything",
          emoji: "🤯",
          description: "Actually, lifelong learners recognize there's always more to learn!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Lifelong learners view mistakes as:",
      options: [
        {
          id: "a",
          text: "Opportunities to learn and improve",
          emoji: "📈",
          description: "Right! Lifelong learners see mistakes as valuable learning experiences!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Failures to be avoided",
          emoji: "😨",
          description: "Lifelong learners understand that mistakes are part of the learning process!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is lifelong learning valuable?",
      options: [
        {
          id: "a",
          text: "It helps you adapt and grow throughout life",
          emoji: "🌱",
          description: "Excellent! Lifelong learning enables personal and professional growth!",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's only useful for getting good grades",
          emoji: "📝",
          description: "Lifelong learning has value far beyond grades - it benefits your entire life!",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Check if user earned the badge (at least 4 correct answers)
        const correctAnswers = [...choices, { question: currentQuestion, optionId, isCorrect }]
          .filter(choice => choice.isCorrect).length;
        
        if (isCorrect && correctAnswers >= 4) {
          setBadgeEarned(true);
        } else if (!isCorrect && correctAnswers >= 4) {
          setBadgeEarned(true);
        }
        
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Badge: Lifelong Learner Kid"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-100"
      gameType="ehe"
      totalLevels={10}
      currentLevel={100}
      showConfetti={gameFinished && badgeEarned}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-6">
              {getCurrentQuestion().text}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {getCurrentQuestion().options.map(option => {
                const isSelected = choices.some(c => 
                  c.question === currentQuestion && c.optionId === option.id
                );
                const showFeedback = choices.some(c => c.question === currentQuestion);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={showFeedback}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">{option.emoji}</div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                        {showFeedback && isSelected && (
                          <p className="text-white/90">{option.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Lifelong Learner Kid</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the Lifelong Learner Kid Badge!</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Achievement</h4>
                  <p className="text-white/80">
                    You correctly identified {choices.filter(c => c.isCorrect).length} out of {questions.length} lifelong learning habits!
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Keep Learning and Growing!</h3>
                <p className="text-white/80 mb-4">
                  You identified {choices.filter(c => c.isCorrect).length} out of {questions.length} lifelong learning habits correctly.
                </p>
                <p className="text-white/80">
                  Continue developing your lifelong learning habits to earn your badge!
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-white/70">
                {badgeEarned 
                  ? "You're on your way to becoming a lifelong learner!" 
                  : "Keep exploring the joy of learning!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeLifelongLearnerKid;