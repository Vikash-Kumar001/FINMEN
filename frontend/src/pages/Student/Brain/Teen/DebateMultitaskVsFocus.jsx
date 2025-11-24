import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble, LevelCompleteHandler } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const DebateMultitaskVsFocus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-16";
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
      question: "Is multitasking effective for productivity?",
      options: [
        { id: 'yes', text: 'Yes, multitasking is effective' },
        { id: 'no', text: 'No, focus on one task' },
        { id: 'sometimes', text: 'Sometimes it depends' }
      ],
      correct: "no",
      explanation: "Research shows that multitasking actually reduces productivity by up to 40%. Focusing on one task at a time (single-tasking) is much more effective!"
    },
    {
      id: 2,
      question: "Is it better to study with background music or in silence?",
      options: [
        { id: 'music', text: 'Music helps with studying' },
        { id: 'silence', text: 'Silence is better for focus' },
        { id: 'depends', text: 'Depends on the type of music' }
      ],
      correct: "depends",
      explanation: "The effectiveness of background music depends on the type of music and task. Instrumental music can help with repetitive tasks, but lyrical music can interfere with reading comprehension!"
    },
    {
      id: 3,
      question: "Should you study the same subject for hours or switch subjects?",
      options: [
        { id: 'same', text: 'Study same subject for hours' },
        { id: 'switch', text: 'Switch between different subjects' },
        { id: 'either', text: 'Either approach works equally well' }
      ],
      correct: "switch",
      explanation: "Switching between different subjects (interleaving) can improve learning and retention. It helps strengthen memory connections and enhances problem-solving skills by varying the types of material!"
    },
    {
      id: 4,
      question: "Is it better to take short breaks or study for long periods?",
      options: [
        { id: 'short', text: 'Take frequent short breaks' },
        { id: 'long', text: 'Study for long periods without breaks' },
        { id: 'no', text: 'Don\'t take any breaks at all' }
      ],
      correct: "short",
      explanation: "Taking frequent short breaks during study sessions improves focus and prevents mental fatigue. The brain needs rest periods to consolidate information and maintain optimal performance!"
    },
    {
      id: 5,
      question: "Is digital note-taking or handwriting more effective for learning?",
      options: [
        { id: 'digital', text: 'Digital note-taking is more effective' },
        { id: 'hand', text: 'Handwriting notes is more effective' },
        { id: 'both', text: 'Both methods work equally well' }
      ],
      correct: "hand",
      explanation: "Handwriting notes is more effective for learning because it engages the brain more actively. The slower pace of writing forces you to process and summarize information, leading to better retention!"
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
      title="Debate: Multitask vs Focus"
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

export default DebateMultitaskVsFocus;