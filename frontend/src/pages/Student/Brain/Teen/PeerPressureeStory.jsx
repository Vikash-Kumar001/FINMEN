// PeerPressureStory.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const PeerPressureeStory = () => {
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
      text: "Friends tease you about studying. Best step?",
      choices: [
        { id: 'a', text: 'Stay calm & talk', icon: '😌💬' },
        { id: 'b', text: 'Get angry & yell', icon: '😠🗣️' }
      ],
      correct: 'a',
      explanation: 'Calm communication asserts boundaries without escalating!'
    },
    {
      id: 2,
      text: "Peer pressure to skip homework. Do?",
      choices: [
        { id: 'a', text: 'Say no politely', icon: '🙅‍♂️😊' },
        { id: 'b', text: 'Give in to fit in', icon: '👥🚫' }
      ],
      correct: 'a',
      explanation: 'Standing firm protects your goals and self-respect!'
    },
    {
      id: 3,
      text: "Friends push risky behavior?",
      choices: [
        { id: 'a', text: 'Walk away', icon: '🚶‍♂️' },
        { id: 'b', text: 'Join to be cool', icon: '😎' }
      ],
      correct: 'a',
      explanation: 'True friends respect your choices; safety first!'
    },
    {
      id: 4,
      text: "Teased for being different?",
      choices: [
        { id: 'a', text: 'Own your uniqueness', icon: '🌟' },
        { id: 'b', text: 'Change to match', icon: '🔄' }
      ],
      correct: 'a',
      explanation: 'Embracing yourself builds confidence against pressure!'
    },
    {
      id: 5,
      text: "Seek help from trusted adult?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '👩‍🏫' },
        { id: 'no', text: 'No, handle alone', icon: '🚫' }
      ],
      correct: 'yes',
      explanation: 'Adults provide guidance and support in tough spots!'
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
      title="Peer Pressure Story"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-91"
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

export default PeerPressureeStory;