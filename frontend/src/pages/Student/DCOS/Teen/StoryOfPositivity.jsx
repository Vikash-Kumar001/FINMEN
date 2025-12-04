import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StoryOfPositivity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-68";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen posts an encouraging message online. What's the result?",
      options: [
        { 
          id: "no-impact", 
          text: "No impact - just a post", 
          emoji: "😐", 
          description: "Posts don't really make a difference",
          isCorrect: false
        },
        { 
          id: "respect-positive", 
          text: "Respect - positive posts build good reputation", 
          emoji: "🌟", 
          description: "Positive posts help build a good online reputation",
          isCorrect: true
        },
        { 
          id: "mixed-reactions", 
          text: "Mixed reactions", 
          emoji: "🤷", 
          description: "People react differently to positive posts",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone shares a supportive comment helping others. What happens?",
      options: [
        { 
          id: "nothing-special", 
          text: "Nothing special", 
          emoji: "😐", 
          description: "Supportive comments don't have much impact",
          isCorrect: false
        },
        { 
          id: "gains-respect", 
          text: "Gains respect and positive reputation", 
          emoji: "🌟", 
          description: "Supportive behavior builds positive reputation",
          isCorrect: true
        },
        { 
          id: "some-notice", 
          text: "Some people notice", 
          emoji: "👀", 
          description: "A few people might see it",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A teen celebrates their achievement in a positive way. Result?",
      options: [
        { 
          id: "just-post", 
          text: "Just another post", 
          emoji: "📱", 
          description: "It's just a regular social media post",
          isCorrect: false
        },
        { 
          id: "builds-identity", 
          text: "Builds positive identity and respect", 
          emoji: "🌟", 
          description: "Positive celebration builds good reputation",
          isCorrect: true
        },
        { 
          id: "gets-likes", 
          text: "Gets some likes", 
          emoji: "👍", 
          description: "People might like the post",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Someone shares a story about helping others. What's the impact?",
      options: [
        { 
          id: "minimal-impact", 
          text: "Minimal impact", 
          emoji: "😐", 
          description: "Sharing stories doesn't have much effect",
          isCorrect: false
        },
        { 
          id: "earns-respect", 
          text: "Earns respect and builds positive reputation", 
          emoji: "🌟", 
          description: "Sharing positive stories builds good reputation",
          isCorrect: true
        },
        { 
          id: "people-see", 
          text: "People might see it", 
          emoji: "👁️", 
          description: "Some people might view the story",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A teen consistently posts positive and encouraging content. What happens?",
      options: [
        { 
          id: "no-real-impact", 
          text: "No real impact", 
          emoji: "😐", 
          description: "Consistent positive posts don't matter much",
          isCorrect: false
        },
        { 
          id: "strong-reputation", 
          text: "Builds strong positive reputation and respect", 
          emoji: "🌟", 
          description: "Consistent positivity builds a strong positive reputation",
          isCorrect: true
        },
        { 
          id: "some-appreciate", 
          text: "Some people appreciate it", 
          emoji: "🙏", 
          description: "A few people might appreciate the positivity",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/identity-badge");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Story of Positivity"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the power of positive online presence!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  Remember: Positive posts build a good reputation and earn respect!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, positive posts help build a good online reputation!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that recognizes how positive posts build reputation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StoryOfPositivity;
