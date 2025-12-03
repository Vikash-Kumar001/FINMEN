import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const OnlineFriendReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-9";
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
      text: "A stranger online says: 'Hi! I'm your age. Want to meet at the park?' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Say No and Tell Parent", 
          emoji: "🛡️", 
          description: "Refuse and tell a trusted adult",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Say Yes and Meet", 
          emoji: "😊", 
          description: "Agree to meet them at the park",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask for More Info", 
          emoji: "🤔", 
          description: "Ask them more questions first",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone online says: 'I know your friend. Let's meet after school.' What's the safe choice?",
      options: [
        { 
          id: "a", 
          text: "Agree to Meet", 
          emoji: "😊", 
          description: "Say yes and arrange to meet",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Refuse and Tell Adult", 
          emoji: "🛡️", 
          description: "Say no and tell a trusted adult",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask Where to Meet", 
          emoji: "🤔", 
          description: "Ask them for the meeting location",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Online person says: 'I'm a kid too. Want to play at my house?' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Say No and Block", 
          emoji: "🛡️", 
          description: "Refuse and block them",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Say Yes", 
          emoji: "😊", 
          description: "Agree to go to their house",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask for Address", 
          emoji: "📍", 
          description: "Ask them for their home address",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Stranger says: 'I have candy. Come meet me at the park.' What's the right response?",
      options: [
        { 
          id: "a", 
          text: "Go Meet Them", 
          emoji: "😊", 
          description: "Go to the park to get candy",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Refuse and Tell Parent", 
          emoji: "🛡️", 
          description: "Say no and tell parent immediately",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask What Kind of Candy", 
          emoji: "🤔", 
          description: "Ask them what candy they have",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Online friend says: 'Let's meet in person. I'll bring my parents.' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Tell Parent First", 
          emoji: "🛡️", 
          description: "Tell your parent and only meet with parent present",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Go Alone", 
          emoji: "😊", 
          description: "Go meet them by yourself",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Go with Friends Only", 
          emoji: "👥", 
          description: "Go with your friends but no parents",
          isCorrect: false
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
      title="Online Friend Reflex"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-9"
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
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default OnlineFriendReflex;
