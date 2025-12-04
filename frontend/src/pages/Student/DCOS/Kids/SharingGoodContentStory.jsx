import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SharingGoodContentStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-97";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A child shares a video of their fun science experiment instead of posting memes. What do you think about this choice?",
      options: [
        { 
          id: "a", 
          text: "That's Boring", 
          emoji: "🙄", 
          description: "That's boring, memes are better",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "It's Great!", 
          emoji: "🤩", 
          description: "It's great! Learning is cool!",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore It", 
          emoji: "😐", 
          description: "Ignore it and move on",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Some friends laugh at the science video and call it nerdy. What should you comment?",
      options: [
        { 
          id: "a", 
          text: "Join Laughter", 
          emoji: "😂", 
          description: "Join the laughter",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Say Nothing", 
          emoji: "😶", 
          description: "Say nothing and scroll away",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Say Nice Experiment", 
          emoji: "👏", 
          description: "Say 'Nice experiment! I learned something!'",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "The video inspires you to try a small experiment too. What should you do next?",
      options: [
        { 
          id: "a", 
          text: "Try Own Experiment", 
          emoji: "🧪", 
          description: "Try your own science experiment",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Complain", 
          emoji: "😞", 
          description: "Complain that yours won't be good",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Forget About It", 
          emoji: "😴", 
          description: "Forget about it",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your science post also gets shared by friends online. How should you feel about it?",
      options: [
        { 
          id: "a", 
          text: "Worried They Copied", 
          emoji: "😕", 
          description: "Worried they copied you",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Happy You Inspired", 
          emoji: "😄", 
          description: "Happy you inspired learning!",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Delete Post", 
          emoji: "🗑️", 
          description: "Delete your post",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your teacher praises you for sharing positive content online. What lesson do you learn?",
      options: [
        { 
          id: "a", 
          text: "Only Jokes Get Likes", 
          emoji: "🙃", 
          description: "Only jokes get likes",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Never Post Again", 
          emoji: "🚫", 
          description: "Never post again",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Good Content Helps", 
          emoji: "💖", 
          description: "Good content makes internet better!",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleNext = () => {
    navigate("/games/digital-citizenship/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Sharing Good Content Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-97"
      gameType="dcos"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default SharingGoodContentStory;
