import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeCareerExplorerKid = () => {
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
      text: "Which job helps sick people feel better?",
      options: [
        {
          id: "b",
          text: "Chef",
          emoji: "👨‍🍳",
          description: "Chefs cook delicious food!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Doctor",
          emoji: "👨‍⚕️",
          description: "Correct! Doctors help sick people get healthy!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Pilot",
          emoji: "👨‍✈️",
          description: "Pilots fly airplanes!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Who teaches children in school?",
      options: [
        {
          id: "c",
          text: "Farmer",
          emoji: "👨‍🌾",
          description: "Farmers grow crops and take care of animals!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Teacher",
          emoji: "👩‍🏫",
          description: "Correct! Teachers help students learn!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Builder",
          emoji: "👷",
          description: "Builders construct houses and buildings!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Who flies airplanes to different places?",
      options: [
        {
          id: "c",
          text: "Police Officer",
          emoji: "👮",
          description: "Police officers help keep people safe!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Pilot",
          emoji: "👨‍✈️",
          description: "Correct! Pilots fly airplanes!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Firefighter",
          emoji: "👨‍🚒",
          description: "Firefighters put out fires and rescue people!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Who cooks delicious meals in restaurants?",
      options: [
        {
          id: "b",
          text: "Nurse",
          emoji: "👩‍⚕️",
          description: "Nurses take care of patients in hospitals!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Chef",
          emoji: "👨‍🍳",
          description: "Correct! Chefs create tasty meals!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Scientist",
          emoji: "👩‍🔬",
          description: "Scientists do experiments and research!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who grows crops and takes care of farm animals?",
      options: [
        {
          id: "c",
          text: "Artist",
          emoji: "🎨",
          description: "Artists create beautiful paintings and drawings!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Farmer",
          emoji: "👨‍🌾",
          description: "Correct! Farmers grow food and take care of animals!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Musician",
          emoji: "🎵",
          description: "Musicians play instruments and sing songs!",
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
      title="Badge: Career Explorer Kid"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-10"
      gameType="ehe"
      totalLevels={10}
      currentLevel={10}
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
            <h2 className="text-2xl font-bold text-white mb-6">Career Explorer Kid</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the Career Explorer Kid Badge!</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Achievement</h4>
                  <p className="text-white/80">
                    You correctly identified {choices.filter(c => c.isCorrect).length} out of {questions.length} careers!
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Keep Exploring Careers!</h3>
                <p className="text-white/80 mb-4">
                  You identified {choices.filter(c => c.isCorrect).length} out of {questions.length} careers correctly.
                </p>
                <p className="text-white/80">
                  Continue learning about different jobs to earn your Career Explorer Kid Badge!
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-white/70">
                {badgeEarned 
                  ? "You're on your way to becoming a career expert!" 
                  : "Keep playing to improve your career knowledge!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeCareerExplorerKid;