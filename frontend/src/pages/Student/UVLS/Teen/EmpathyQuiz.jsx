import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmpathyQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-2");
  const gameId = gameData?.id || "uvls-teen-2";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Your friend tells you they failed a test and feels terrible.",
      options: [
        { id: "empathy", text: "I understand how disappointing that must feel. I'm here for you.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "Oh, poor you. That's so sad.", type: "sympathy", isCorrect: false },
        { id: "dismiss", text: "It's just one test, get over it.", type: "dismissive", isCorrect: false }
      ],
      explanation: "Empathy means understanding and sharing feelings. Sympathy is feeling sorry for someone."
    },
    {
      id: 2,
      text: "A classmate is anxious about presenting in front of the class.",
      options: [
        { id: "empathy", text: "I can see you're nervous. I felt the same way before my presentation. You'll do great.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "I feel so sorry for you having to present.", type: "sympathy", isCorrect: false },
        { id: "minimize", text: "Everyone has to present, just do it.", type: "minimize", isCorrect: false }
      ],
      explanation: "Empathy connects by sharing similar feelings and offering support."
    },
    {
      id: 3,
      text: "Someone shares that they're being bullied.",
      options: [
        { id: "empathy", text: "That sounds really scary and hurtful. Let's talk about how to get help.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "Oh no, you poor thing. I pity you.", type: "sympathy", isCorrect: false },
        { id: "blame", text: "What did you do to make them bully you?", type: "blame", isCorrect: false }
      ],
      explanation: "Empathy involves understanding their pain and offering to help, not pitying them."
    },
    {
      id: 4,
      text: "Your friend's pet passed away and they're very sad.",
      options: [
        { id: "empathy", text: "I can imagine how heartbroken you must be. Your pet was so special to you.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "That's so sad. Poor little pet.", type: "sympathy", isCorrect: false },
        { id: "minimize", text: "It's just a pet, you can get another one.", type: "minimize", isCorrect: false }
      ],
      explanation: "Empathy acknowledges their unique bond and pain."
    },
    {
      id: 5,
      text: "A peer is struggling with family financial problems.",
      options: [
        { id: "empathy", text: "That must be really stressful for you and your family. I'm here to listen.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "Oh, that's terrible. I feel so bad for you.", type: "sympathy", isCorrect: false },
        { id: "compare", text: "We all have money problems sometimes.", type: "compare", isCorrect: false }
      ],
      explanation: "Empathy validates their specific struggle without comparing or pitying."
    },
    {
      id: 6,
      text: "Someone is upset about not making the sports team.",
      options: [
        { id: "empathy", text: "I can see how disappointed you are. You worked really hard for this.", type: "empathy", isCorrect: true },
        { id: "sympathy", text: "Aww, that's sad. Poor thing.", type: "sympathy", isCorrect: false },
        { id: "toxic", text: "You probably weren't good enough anyway.", type: "toxic", isCorrect: false }
      ],
      explanation: "Empathy recognizes their effort and shares in their disappointment."
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <GameShell
      title="Empathy Quiz"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && percentage >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="font-semibold text-lg">{option.text}</span>
                      <span className="text-sm opacity-90 italic">{option.type}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className="bg-blue-500/20 rounded-lg p-3 mt-4">
                  <p className="text-white/80 text-sm">
                    💡 {questions[currentQuestion].explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {percentage >= 70 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Empathy Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct ({percentage}%)!
                  You understand empathy vs sympathy!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Empathy means understanding and sharing someone's feelings by putting yourself in their shoes. Sympathy is feeling sorry for someone. Empathy creates deeper connections!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct ({percentage}%).
                  Get 70% or higher to earn coins!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Empathy means understanding how someone feels by imagining yourself in their situation. It's different from sympathy, which is just feeling sorry for them!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmpathyQuiz;
