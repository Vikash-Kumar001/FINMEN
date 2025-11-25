import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmpathyDebate = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-5";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const debateQuestions = [
    {
      id: 1,
      topic: "Should empathy be a required part of the school curriculum?",
      question: "Which argument is most effective for supporting empathy in schools?",
      options: [
        { id: "a", text: "Studies show empathetic students perform better academically", isCorrect: true },
        { id: "b", text: "I think empathy is nice to have", isCorrect: false },
        { id: "c", text: "My friend said empathy is important", isCorrect: false },
        { id: "d", text: "Empathy doesn't matter for education", isCorrect: false }
      ]
    },
    {
      id: 2,
      topic: "How can empathy reduce conflicts in schools?",
      question: "What's the best way to respond when someone disagrees with you?",
      options: [
        { id: "a", text: "I understand your concern, but evidence shows...", isCorrect: true },
        { id: "b", text: "That's completely wrong and you don't know what you're talking about", isCorrect: false },
        { id: "c", text: "You're just making that up", isCorrect: false },
        { id: "d", text: "Ignore them completely", isCorrect: false }
      ]
    },
    {
      id: 3,
      topic: "Can empathy be taught or is it natural?",
      question: "Which evidence best supports that empathy can be learned?",
      options: [
        { id: "a", text: "Research shows empathy training programs reduce bullying by 40%", isCorrect: true },
        { id: "b", text: "Some people are just born nice", isCorrect: false },
        { id: "c", text: "You either have it or you don't", isCorrect: false },
        { id: "d", text: "Empathy can't be taught in schools", isCorrect: false }
      ]
    },
    {
      id: 4,
      topic: "How does empathy affect academic performance?",
      question: "What's the relationship between empathy and learning?",
      options: [
        { id: "a", text: "Empathetic students collaborate better, leading to improved group project outcomes", isCorrect: true },
        { id: "b", text: "Empathy has no impact on academics", isCorrect: false },
        { id: "c", text: "Empathy actually hurts test scores", isCorrect: false },
        { id: "d", text: "Only smart students can be empathetic", isCorrect: false }
      ]
    },
    {
      id: 5,
      topic: "Why is respectful disagreement important?",
      question: "When debating, what makes a rebuttal effective and respectful?",
      options: [
        { id: "a", text: "I see your point, however, consider this evidence...", isCorrect: true },
        { id: "b", text: "Your opinion is stupid", isCorrect: false },
        { id: "c", text: "Just agree to avoid conflict", isCorrect: false },
        { id: "d", text: "Shout louder than your opponent", isCorrect: false }
      ]
    }
  ];

  const handleAnswerSelect = (answerId) => {
    if (isProcessing || showResult) return;
    setSelectedAnswer(answerId);
  };

  const handleConfirm = () => {
    if (!selectedAnswer || isProcessing || showResult) return;
    
    setIsProcessing(true);
    const currentQ = debateQuestions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === selectedAnswer);
    const isCorrect = selectedOption?.isCorrect === true;
    
    const newAnswers = [...answers, {
      questionId: currentQ.id,
      selected: selectedAnswer,
      isCorrect
    }];
    
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedAnswer(null);
    
    if (currentQuestion < debateQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsProcessing(false);
      }, isCorrect ? 1500 : 0);
    } else {
      setTimeout(() => {
        setShowResult(true);
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const currentQ = debateQuestions[currentQuestion];
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  // Score should be the number of correct answers for backend
  const finalScore = showResult ? correctAnswers : coins;

  return (
    <GameShell
      title="Empathy Debate"
      subtitle={`Question ${currentQuestion + 1} of ${debateQuestions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctAnswers === 5}
      showGameOver={showResult}
      score={finalScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-5"
      gameType="uvls"
      totalLevels={5}
      maxScore={5}
      showConfetti={showResult && correctAnswers === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult && currentQ && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg p-4 mb-6">
                <p className="text-white text-sm font-semibold text-center mb-2">
                  Topic:
                </p>
                <p className="text-white text-lg font-bold text-center">
                  {currentQ.topic}
                </p>
              </div>
              
              <p className="text-white text-xl mb-6 text-center font-semibold">
                {currentQ.question}
              </p>
              
              <div className="space-y-3 mb-6">
                {currentQ.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={isProcessing || answers.length > currentQuestion}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedAnswer === option.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${isProcessing || answers.length > currentQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-white font-medium">{option.text}</div>
                  </button>
                ))}
              </div>
              
              {answers.length > 0 && answers[currentQuestion] && (
                <div className={`mt-4 p-4 rounded-xl mb-4 ${
                  answers[currentQuestion].isCorrect
                    ? 'bg-green-500/30 border-2 border-green-400'
                    : 'bg-red-500/30 border-2 border-red-400'
                }`}>
                  <p className="text-white font-medium text-center">
                    {answers[currentQuestion].isCorrect 
                      ? "✓ Correct! Great debate point!" 
                      : "✗ Not quite. Keep practicing your argumentation skills!"}
                  </p>
                </div>
              )}
              
              {answers.length <= currentQuestion && (
                <button
                  onClick={handleConfirm}
                  disabled={!selectedAnswer || isProcessing}
                  className={`w-full py-3 rounded-xl font-bold text-white transition ${
                    selectedAnswer && !isProcessing
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                      : 'bg-gray-500/50 cursor-not-allowed'
                  }`}
                >
                  Confirm Answer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmpathyDebate;

