import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const FriendBetrayalStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "Teen feels hurt by friend’s betrayal. Positive action?",
      choices: [
        { id: 'a', text: 'Forgive and move on', icon: '🙏➡️' },
        { id: 'b', text: 'Hold a grudge', icon: '😣' }
      ],
      correct: 'a',
      explanation: 'Forgiveness frees you from emotional weight!'
    },
    {
      id: 2,
      text: "Friend spreads rumor?",
      choices: [
        { id: 'a', text: 'Talk calmly', icon: '💬😌' },
        { id: 'b', text: 'Spread rumors back', icon: '🗣️😠' }
      ],
      correct: 'a',
      explanation: 'Calm communication resolves conflicts!'
    },
    {
      id: 3,
      text: "Friend lies to you?",
      choices: [
        { id: 'a', text: 'Set boundaries', icon: '🚧' },
        { id: 'b', text: 'Cut them off', icon: '✂️' }
      ],
      correct: 'a',
      explanation: 'Boundaries maintain respect!'
    },
    {
      id: 4,
      text: "Betrayed in group?",
      choices: [
        { id: 'a', text: 'Seek support', icon: '🤝' },
        { id: 'b', text: 'Isolate yourself', icon: '🚶‍♂️' }
      ],
      correct: 'a',
      explanation: 'Support helps you heal!'
    },
    {
      id: 5,
      text: "Rebuild trust?",
      choices: [
        { id: 'a', text: 'Open dialogue', icon: '🗣️❤️' },
        { id: 'b', text: 'Stay distant', icon: '↔️' }
      ],
      correct: 'a',
      explanation: 'Dialogue rebuilds connection!'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
    if (isCorrect) {
      setScore(score + 10);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setFeedbackType(null);
      } else {
        setLevelCompleted(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setFeedbackType(null);
      setShowConfetti(false);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/emotion/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Friend Betrayal Story"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-115"
      gameType="emotion"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/emotion/teens"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6">{currentQuestionData.text}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          {currentQuestionData.choices.map((choice) => (
            <OptionButton
              key={choice.id}
              option={`${choice.icon} ${choice.text}`}
              onClick={() => handleOptionSelect(choice.id)}
              selected={selectedOption === choice.id}
              disabled={!!selectedOption}
              feedback={showFeedback ? { type: feedbackType } : null}
            />
          ))}
        </div>
        
        {showFeedback && (
          <FeedbackBubble 
            message={feedbackType === "correct" ? "Correct! 🎉" : "Not quite! 🤔"}
            type={feedbackType}
          />
        )}
        
        {showFeedback && feedbackType === "wrong" && (
          <div className="mt-4 text-white/90 text-center">
            <p>💡 {currentQuestionData.explanation}</p>
          </div>
        )}
      </GameCard>
    </GameShell>
  );
};

export default FriendBetrayalStory;