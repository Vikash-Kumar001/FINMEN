import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIFriendStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-75";
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
      text: "An AI chatbot says, 'Hi! I'm your new friend! What's your name and address?' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Share Address", 
          emoji: "🏠", 
          description: "Share your address",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Refuse and Stay Safe", 
          emoji: "🛡️", 
          description: "Refuse and stay safe",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask for Address", 
          emoji: "📍", 
          description: "Ask for its address too",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The AI friend says, 'Send me a selfie so we can be real friends!' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Send Photo", 
          emoji: "📷", 
          description: "Send a photo",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Say No", 
          emoji: "🙅‍♀️", 
          description: "Say 'No, I don't share photos online'",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore", 
          emoji: "🤔", 
          description: "Ignore the message",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The AI chatbot asks, 'Can we chat secretly? Don't tell your parents.' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Keep Secret", 
          emoji: "🤫", 
          description: "Keep it secret",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Tell Parent or Teacher", 
          emoji: "👩‍🏫", 
          description: "Tell a parent or teacher",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Say Nothing", 
          emoji: "😶", 
          description: "Say nothing",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The AI friend sends you a link to a 'fun new game' and says, 'Click fast!' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Click Quickly", 
          emoji: "⚡", 
          description: "Click it quickly",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ask Adult First", 
          emoji: "🧑‍🏫", 
          description: "Ask an adult before clicking",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Trust AI Friend", 
          emoji: "🤝", 
          description: "Trust the AI friend",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The chatbot says, 'Tell me your school name and class. I won't tell anyone!' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Give All Info", 
          emoji: "📚", 
          description: "Give all info",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Refuse and End Chat", 
          emoji: "🚫", 
          description: "Refuse and end chat",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Share School Only", 
          emoji: "🏫", 
          description: "Share school name only",
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
      title="AI Friend Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-75"
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

export default AIFriendStory;
