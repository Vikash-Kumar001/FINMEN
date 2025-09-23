import React, { useState } from 'react';
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from './GameShell';

const TrueOrFalseAIQuiz = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null);
  const [gameOver, setGameOver] = useState(false); // ✅ Add gameOver state

  const questions = [
    { id: 1, question: 'AI can learn from data', correctAnswer: true, explanation: 'Yes! AI learns patterns from data to make predictions.', rewardPoints: 5 },
    { id: 2, question: 'AI can think like humans', correctAnswer: false, explanation: 'AI processes information differently than human thinking.', rewardPoints: 5 },
    { id: 3, question: 'AI needs electricity to work', correctAnswer: true, explanation: 'AI runs on computers which need electricity.', rewardPoints: 5 },
    { id: 4, question: 'AI can feel emotions', correctAnswer: false, explanation: 'AI cannot feel emotions, it only processes information.', rewardPoints: 5 },
    { id: 5, question: 'AI can recognize images', correctAnswer: true, explanation: 'Yes! AI can identify objects, faces, and patterns in images.', rewardPoints: 5 },
  ];

  const currentQuestion = questions[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;
    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentQuestion.correctAnswer) {
      setFeedback({ message: 'Great! Correct!', type: 'correct' });
      setScore(prev => prev + currentQuestion.rewardPoints);
      setFlashPoints(currentQuestion.rewardPoints); // trigger score flash
      setShowConfetti(true);

      // hide score flash after 1 second
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! ${currentQuestion.explanation}`, type: 'wrong' });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < questions.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setFeedback({ message: '', type: '' });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      setGameOver(true); // ✅ trigger centralized GameOverModal
    }
  };

  return (
    <GameShell
      title="True or False AI Quiz"
      subtitle="Decide if each statement is true or false"
      rightSlot={<div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">Score: {score} ⭐ {currentLevelIndex + 1}/{questions.length}</div>}
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message}
      showGameOver={gameOver} // ✅ centralized modal
      score={score} // ✅ pass score
      gameId="true-or-false-ai-quiz" // ✅ Add game ID for heal coins
      gameType="ai" // ✅ Add game type
      totalLevels={questions.length} // ✅ Add total levels
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <LevelCompleteHandler
        gameId="true-or-false-ai-quiz"
        gameType="ai"
        levelNumber={currentLevelIndex + 1}
        levelScore={feedback.type === 'correct' ? currentQuestion.rewardPoints : 0}
        maxLevelScore={currentQuestion.rewardPoints}
      >
        <GameCard>
          <div style={{ fontWeight: 'bold', fontSize: 'clamp(16px, 3.5vw, 28px)', color: 'white' }}>
            {currentQuestion.question}
          </div>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex justify-center gap-6 flex-wrap">
        <OptionButton
          option="true"
          onClick={() => handleOptionClick(true)}
          selected={selectedOption}
          disabled={isOptionDisabled}
          feedback={feedback}
        />
        <OptionButton
          option="false"
          onClick={() => handleOptionClick(false)}
          selected={selectedOption}
          disabled={isOptionDisabled}
          feedback={feedback}
        />
      </div>

      {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
    </GameShell>
  );
};

export default TrueOrFalseAIQuiz;
