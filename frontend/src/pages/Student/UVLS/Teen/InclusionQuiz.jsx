import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const InclusionQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which school policy best promotes inclusion?",
      options: [
        { id: "a", text: "Zero tolerance for bullying and discrimination", isCorrect: true },
        { id: "b", text: "Separate classes for different ability levels", isCorrect: false },
        { id: "c", text: "Ignoring differences to treat everyone the same", isCorrect: false }
      ],
      rationale: "Active anti-discrimination policies create safe, inclusive environments."
    },
    {
      id: 2,
      text: "What is an inclusive school action?",
      options: [
        { id: "a", text: "Providing accommodations for students with different needs", isCorrect: true },
        { id: "b", text: "Making everyone do exactly the same thing", isCorrect: false },
        { id: "c", text: "Grouping students only by academic performance", isCorrect: false }
      ],
      rationale: "True inclusion recognizes and supports diverse needs."
    },
    {
      id: 3,
      text: "How can a school cafeteria be more inclusive?",
      options: [
        { id: "a", text: "Offer diverse food options respecting dietary restrictions", isCorrect: true },
        { id: "b", text: "Serve only one type of meal for simplicity", isCorrect: false },
        { id: "c", text: "Let students bring their own food only", isCorrect: false }
      ],
      rationale: "Diverse options respect cultural, religious, and dietary needs."
    },
    {
      id: 4,
      text: "Which classroom setup promotes inclusion?",
      options: [
        { id: "a", text: "Flexible seating with wheelchair-accessible spaces", isCorrect: true },
        { id: "b", text: "Fixed rows with students grouped by ability", isCorrect: false },
        { id: "c", text: "Only desks, no alternatives", isCorrect: false }
      ],
      rationale: "Flexible, accessible seating welcomes all students."
    },
    {
      id: 5,
      text: "What makes a school event inclusive?",
      options: [
        { id: "a", text: "Offering multiple ways to participate and accessible venues", isCorrect: true },
        { id: "b", text: "Having one standard format everyone must follow", isCorrect: false },
        { id: "c", text: "Only inviting high-achieving students", isCorrect: false }
      ],
      rationale: "Multiple participation options ensure everyone can join."
    },
    {
      id: 6,
      text: "How should schools handle name pronunciation?",
      options: [
        { id: "a", text: "Ask students their preferred pronunciation and use it", isCorrect: true },
        { id: "b", text: "Give students easier nicknames", isCorrect: false },
        { id: "c", text: "Just use last names for everyone", isCorrect: false }
      ],
      rationale: "Respecting names honors students' identities."
    },
    {
      id: 7,
      text: "What's an inclusive approach to group projects?",
      options: [
        { id: "a", text: "Assign diverse roles so everyone can contribute their strengths", isCorrect: true },
        { id: "b", text: "Let popular students choose all team members", isCorrect: false },
        { id: "c", text: "Group only similar students together", isCorrect: false }
      ],
      rationale: "Diverse roles leverage everyone's unique abilities."
    },
    {
      id: 8,
      text: "How can schools support LGBTQ+ students?",
      options: [
        { id: "a", text: "Have gender-neutral bathrooms and anti-discrimination policies", isCorrect: true },
        { id: "b", text: "Ignore the topic completely", isCorrect: false },
        { id: "c", text: "Tell them to hide their identity", isCorrect: false }
      ],
      rationale: "Supportive policies and facilities show all identities are valued."
    }
  ];

  const handleAnswer = (optionId) => {
    const question = questions[currentQuestion];
    const option = question.options.find(opt => opt.id === optionId);
    
    const newAnswers = [...answers, {
      questionId: question.id,
      answer: optionId,
      isCorrect: option.isCorrect
    }];
    
    setAnswers(newAnswers);
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, option.isCorrect ? 1000 : 800);
    } else {
      const correctCount = newAnswers.filter(a => a.isCorrect).length;
      const percentage = (correctCount / questions.length) * 100;
      if (percentage >= 75) {
        setCoins(3); // +3 Coins for ≥75% (minimum for progress)
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/accessibility-puzzle");
  };

  const correctCount = answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <GameShell
      title="Inclusion Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && percentage >= 75}
      showGameOver={showResult && percentage >= 75}
      score={coins}
      gameId="uvls-teen-12"
      gameType="uvls"
      totalLevels={20}
      currentLevel={12}
      showConfetti={showResult && percentage >= 75}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6 font-semibold text-center">
                {questions[currentQuestion].text}
              </p>
              
              <div className="space-y-3 mb-4">
                {questions[currentQuestion].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{option.text}</div>
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-500/20 rounded-lg p-3 mt-4">
                <p className="text-white/80 text-sm">
                  💡 {questions[currentQuestion].rationale}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {percentage >= 75 ? "🎉 Inclusion Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {correctCount} out of {questions.length} correct ({percentage}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {percentage >= 75 ? "You earned 3 Coins! 🪙" : "Get 75% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Link these concepts to your school's actual inclusion policies!
            </p>
            {percentage < 75 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InclusionQuiz;

