import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble, LevelCompleteHandler } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const DebateBrainVsBody = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-6";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({});

  const debateTopics = [
    {
      id: 1,
      question: "Is brain health more important than body health?",
      options: [
        { id: 'brain', text: 'Brain health is more important' },
        { id: 'body', text: 'Body health is more important' },
        { id: 'both', text: 'Both are equally important' }
      ],
      correct: "both",
      explanation: "Both brain and body health are equally important and interconnected. A healthy body supports brain function, and a healthy brain helps maintain body wellness!"
    },
    {
      id: 2,
      question: "Is multitasking effective for studying?",
      options: [
        { id: 'yes', text: 'Yes, multitasking boosts productivity' },
        { id: 'no', text: 'No, multitasking reduces efficiency' },
        { id: 'sometimes', text: 'Sometimes, depends on the tasks' }
      ],
      correct: "no",
      explanation: "Multitasking actually reduces efficiency and learning. The brain needs focused attention on one task at a time for optimal performance and retention!"
    },
    {
      id: 3,
      question: "Is it better to study for long hours or take breaks?",
      options: [
        { id: 'long', text: 'Study for long hours without breaks' },
        { id: 'breaks', text: 'Take regular breaks during study' },
        { id: 'both', text: 'Both approaches work equally well' }
      ],
      correct: "breaks",
      explanation: "Taking regular breaks during study sessions improves focus and retention. The brain needs rest periods to consolidate information and prevent mental fatigue!"
    },
    {
      id: 4,
      question: "Does listening to music help with concentration?",
      options: [
        { id: 'help', text: 'Yes, music always helps concentration' },
        { id: 'hurt', text: 'No, music always hurts concentration' },
        { id: 'depends', text: 'Depends on the type of music and task' }
      ],
      correct: "depends",
      explanation: "The effect of music on concentration depends on the task and music type. Instrumental music can help with repetitive tasks, but lyrical music can interfere with reading and writing!"
    },
    {
      id: 5,
      question: "Is it better to study the same subject every day or vary subjects?",
      options: [
        { id: 'same', text: 'Study the same subject every day' },
        { id: 'vary', text: 'Vary subjects during study sessions' },
        { id: 'either', text: 'Either approach works the same' }
      ],
      correct: "vary",
      explanation: "Varying subjects during study sessions can improve learning through interleaving. Switching between different types of material helps strengthen memory and problem-solving skills!"
    }
  ];

  const currentTopic = debateTopics[currentQuestion];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === currentTopic.correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1); // 1 coin for correct answer
      setShowConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    // Auto-move to next question or complete after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < debateTopics.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setLevelCompleted(true);
      }
    }, 2000);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/teens');
  };

  return (
    <GameShell
      title="Debate: Brain vs Body"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      showAnswerConfetti={showConfetti}
      backPath="/games/brain-health/teens"
    >
      <LevelCompleteHandler
        gameId={gameId}
        gameType="brain"
        levelNumber={currentQuestion + 1}
        levelScore={selectedOption === currentTopic.correct ? 1 : 0}
        maxLevelScore={1}
      >
        <GameCard>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Debate Topic</h3>
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-6 mb-8">
            <p className="text-xl font-semibold text-white text-center">"{currentTopic.question}"</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">Choose your position:</h4>
            {currentTopic.options.map((option) => (
              <OptionButton
                key={option.id}
                option={option.text}
                onClick={() => handleOptionSelect(option.id)}
                selected={selectedOption === option.id}
                disabled={!!selectedOption}
                feedback={showFeedback ? { type: feedbackType } : null}
              />
            ))}
          </div>
          
          {showFeedback && (
            <FeedbackBubble 
              message={feedbackType === "correct" ? "Exactly! 🎉" : "Think again! 🤔"}
              type={feedbackType}
            />
          )}
          
          {showFeedback && feedbackType === "wrong" && (
            <div className="mt-4 text-white/90 text-center">
              <p>💡 {currentTopic.explanation}</p>
            </div>
          )}
        </GameCard>
      </LevelCompleteHandler>
    </GameShell>
  );
};

export default DebateBrainVsBody;