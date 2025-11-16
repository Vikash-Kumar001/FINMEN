import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeCollegeDreamer = () => {
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
      text: "What is the main purpose of college education?",
      options: [
        {
          id: "a",
          text: "Gain knowledge and skills",
          emoji: "📚",
          description: "Perfect! College helps you gain valuable knowledge and skills!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just to party",
          emoji: "🎉",
          description: "Socializing is part of college, but learning is the main purpose!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid working",
          emoji: "😴",
          description: "College requires hard work and dedication!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is it important to have college dreams?",
      options: [
        {
          id: "a",
          text: "They motivate you to study hard",
          emoji: "💪",
          description: "Exactly! Dreams motivate you to work toward your goals!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just to impress others",
          emoji: "👀",
          description: "Having dreams is about personal growth, not just impressing others!",
          isCorrect: false
        },
        {
          id: "c",
          text: "No reason at all",
          emoji: "🤷",
          description: "Dreams give you direction and purpose!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you consider when choosing a college?",
      options: [
        {
          id: "a",
          text: "Programs offered and your interests",
          emoji: "🎯",
          description: "Perfect! Choose a college that aligns with your interests and goals!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only the most expensive one",
          emoji: "💰",
          description: "Cost is a factor, but not the only one to consider!",
          isCorrect: false
        },
        {
          id: "c",
          text: "What your friends are doing",
          emoji: "👥",
          description: "Your choice should be based on your own goals!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can you prepare for college while still in school?",
      options: [
        {
          id: "a",
          text: "Study hard and develop good habits",
          emoji: "📖",
          description: "Exactly! Good study habits prepare you for college success!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just wait for it to come",
          emoji: "⏳",
          description: "Preparation is key to college success!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all challenges",
          emoji: "🚫",
          description: "Challenges help you grow and prepare for college!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a benefit of having clear college goals?",
      options: [
        {
          id: "a",
          text: "Better focus and direction",
          emoji: "🧭",
          description: "Perfect! Clear goals provide focus and direction!",
          isCorrect: true
        },
        {
          id: "b",
          text: "No benefits at all",
          emoji: "❌",
          description: "Clear goals have many benefits for your future!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Less need to study",
          emoji: "😴",
          description: "Clear goals actually motivate you to study more!",
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
      title="Badge: College Dreamer"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-70"
      gameType="ehe"
      totalLevels={10}
      currentLevel={70}
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
            <h2 className="text-2xl font-bold text-white mb-6">College Dreamer</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the College Dreamer Badge!</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Achievement</h4>
                  <p className="text-white/80">
                    You correctly identified {choices.filter(c => c.isCorrect).length} out of {questions.length} higher education awareness skills!
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Keep Dreaming Big!</h3>
                <p className="text-white/80 mb-4">
                  You identified {choices.filter(c => c.isCorrect).length} out of {questions.length} higher education awareness skills correctly.
                </p>
                <p className="text-white/80">
                  Continue learning about higher education to earn your College Dreamer Badge!
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-white/70">
                {badgeEarned 
                  ? "You're on your way to becoming a college expert!" 
                  : "Keep exploring higher education concepts to improve your skills!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeCollegeDreamer;