import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PlaygroundBystander = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-15";
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
      text: "You see a bully pushing another child on the playground. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Walk Away", 
          emoji: "🚶", 
          description: "Walk away and ignore it",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Help and Tell Teacher", 
          emoji: "🙋", 
          description: "Help the child and tell a teacher",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Just Watch", 
          emoji: "👀", 
          description: "Watch but don't do anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You see someone taking another child's lunch and making fun of them. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Help and Tell Adult", 
          emoji: "🛡️", 
          description: "Help get the lunch back and tell an adult",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Laugh Along", 
          emoji: "😄", 
          description: "Laugh along with the bully",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Pretend You Didn't See", 
          emoji: "🙈", 
          description: "Pretend you didn't see anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see mean comments being posted about a classmate online. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Report and Stand Up", 
          emoji: "📢", 
          description: "Report it and stand up for them",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Share the Comments", 
          emoji: "📤", 
          description: "Share the mean comments",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore Completely", 
          emoji: "😐", 
          description: "Ignore it completely",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You hear kids calling someone mean names in the hallway. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Tell Them to Stop", 
          emoji: "🛑", 
          description: "Tell them to stop and get help",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Join In", 
          emoji: "😈", 
          description: "Join in with the name calling",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Walk By Silently", 
          emoji: "🚶", 
          description: "Walk by without saying anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see a child being left out of a game on purpose. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Invite Them to Join", 
          emoji: "🤝", 
          description: "Invite them to join and include them",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Ignore Like Others", 
          emoji: "😐", 
          description: "Ignore them like everyone else",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Make Fun of Them", 
          emoji: "😄", 
          description: "Make fun of them for being left out",
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
      title="Playground Bystander"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-15"
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

export default PlaygroundBystander;
