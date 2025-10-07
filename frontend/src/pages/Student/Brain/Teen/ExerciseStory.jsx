import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const ExerciseStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({}); // Track answers for each question

  const questions = [
    {
      id: 1,
      text: "Alex plays 30 minutes of sports every day. Is this good for brain health?",
      choices: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ],
      correct: 'yes',
      explanation: 'Regular physical activity increases blood flow to the brain and promotes the growth of new brain cells!'
    },
    {
      id: 2,
      text: "Which type of exercise is most beneficial for brain health?",
      choices: [
        { id: 'a', text: 'Only weight lifting' },
        { id: 'b', text: 'Only running' },
        { id: 'c', text: 'A mix of cardio and strength training' }
      ],
      correct: 'c',
      explanation: 'A combination of cardio and strength training provides the most comprehensive benefits for brain health!'
    },
    {
      id: 3,
      text: "How does exercise affect memory?",
      choices: [
        { id: 'a', text: 'It worsens memory' },
        { id: 'b', text: 'It improves memory formation' },
        { id: 'c', text: 'It has no effect on memory' }
      ],
      correct: 'b',
      explanation: 'Exercise promotes the growth of new brain cells and strengthens connections between existing ones, enhancing memory!'
    },
    {
      id: 4,
      text: "When is the best time to exercise for optimal brain benefits?",
      choices: [
        { id: 'a', text: 'Late at night' },
        { id: 'b', text: 'Early morning' },
        { id: 'c', text: 'Any consistent time' }
      ],
      correct: 'c',
      explanation: 'Consistency matters more than timing - regular exercise at any time provides brain benefits!'
    },
    {
      id: 5,
      text: "How long should you exercise to see brain health benefits?",
      choices: [
        { id: 'a', text: 'At least 30 minutes daily' },
        { id: 'b', text: 'Only on weekends' },
        { id: 'c', text: 'Just 5 minutes weekly' }
      ],
      correct: 'a',
      explanation: 'Research shows that at least 30 minutes of moderate exercise daily provides significant brain health benefits!'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
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
      setScore(score + 3); // 3 coins for correct answer (max 15 coins for 5 questions)
      setShowConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    // Auto-advance to next question after delay
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
    navigate('/games/brain-health/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  // Calculate coins based on correct answers (max 15 coins for 5 questions)
  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 3;
  };

  return (
    <GameShell
      title="Exercise Story"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="exercise-story"
      gameType="brain-health"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/brain-health/teens"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6">{currentQuestionData.text}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          {currentQuestionData.choices.map((choice) => (
            <OptionButton
              key={choice.id}
              option={choice.text}
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

export default ExerciseStory;