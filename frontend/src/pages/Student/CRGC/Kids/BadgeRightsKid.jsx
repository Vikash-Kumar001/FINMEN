import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeRightsKid = () => {
  const navigate = useNavigate();
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });
  const [gameFinished, setGameFinished] = useState(false);
  const { showAnswerConfetti } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      type: "multipleChoice",
      question: "Which situation shows a violation of children's rights?",
      options: [
        "A child being denied education because of their gender",
        "A child receiving good grades in school",
        "A child playing with friends during recess"
      ],
      correctAnswer: "A child being denied education because of their gender",
      explanation: "Denying education based on gender violates the fundamental right to education for all children!"
    },
    {
      id: 2,
      type: "trueFalse",
      question: "All children have the right to express their opinions.",
      correctAnswer: "true",
      explanation: "Yes! The UN Convention on the Rights of the Child recognizes children's right to freedom of expression."
    },
    {
      id: 3,
      type: "fillBlank",
      question: "Every child has the right to _______ regardless of their background.",
      correctAnswer: "education",
      explanation: "Education is a fundamental right that should be accessible to all children regardless of their circumstances."
    },
    {
      id: 4,
      type: "scenario",
      question: "You notice a classmate is being treated unfairly because of their disability. What should you do?",
      options: [
        "Ignore it to avoid conflict",
        "Tell a teacher or trusted adult",
        "Join in with the unfair treatment"
      ],
      correctAnswer: "Tell a teacher or trusted adult",
      explanation: "Reporting unfair treatment helps protect your classmate's rights and creates a more inclusive environment."
    },
    {
      id: 5,
      type: "multipleChoice",
      question: "Why are human rights important for children?",
      options: [
        "They ensure children can grow up safely and reach their potential",
        "They make children more special than adults",
        "They allow children to do whatever they want"
      ],
      correctAnswer: "They ensure children can grow up safely and reach their potential",
      explanation: "Human rights create the conditions necessary for children to develop physically, mentally, and socially in a safe environment."
    }
  ];

  const handleMultipleChoice = (selectedOption) => {
    const challenge = challenges[currentChallenge];
    const isCorrect = selectedOption === challenge.correctAnswer;
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Correct!" : "Not quite right.",
      explanation: challenge.explanation
    });
    
    setShowFeedback(true);
    
    if (isCorrect && !completedChallenges.includes(challenge.id)) {
      setTimeout(() => {
        setCompletedChallenges(prev => [...prev, challenge.id]);
        moveToNextChallenge();
      }, 2000);
    } else if (!isCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleTrueFalse = (answer) => {
    const challenge = challenges[currentChallenge];
    const isCorrect = answer === challenge.correctAnswer;
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Correct!" : "Not quite right.",
      explanation: challenge.explanation
    });
    
    setShowFeedback(true);
    
    if (isCorrect && !completedChallenges.includes(challenge.id)) {
      setTimeout(() => {
        setCompletedChallenges(prev => [...prev, challenge.id]);
        moveToNextChallenge();
      }, 2000);
    } else if (!isCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleFillBlank = () => {
    const challenge = challenges[currentChallenge];
    const isCorrect = userAnswer.trim().toLowerCase() === challenge.correctAnswer.toLowerCase();
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Correct!" : "Not quite right.",
      explanation: challenge.explanation
    });
    
    setShowFeedback(true);
    
    if (isCorrect && !completedChallenges.includes(challenge.id)) {
      setTimeout(() => {
        setCompletedChallenges(prev => [...prev, challenge.id]);
        moveToNextChallenge();
      }, 2000);
    } else if (!isCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const moveToNextChallenge = () => {
    setShowFeedback(false);
    setUserAnswer("");
    
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
    } else {
      // Check if all challenges are completed
      if (completedChallenges.length + 1 === challenges.length) {
        setTimeout(() => {
          setGameFinished(true);
          showAnswerConfetti();
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentChallenge = () => challenges[currentChallenge];

  const renderChallenge = () => {
    const challenge = getCurrentChallenge();
    
    switch (challenge.type) {
      case "multipleChoice":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">{challenge.question}</h3>
            <div className="grid grid-cols-1 gap-3">
              {challenge.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultipleChoice(option)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-lg mr-3">{String.fromCharCode(65 + index)}.</div>
                    <div>{option}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
        
      case "trueFalse":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">{challenge.question}</h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleTrueFalse("true")}
                disabled={showFeedback}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                True
              </button>
              <button
                onClick={() => handleTrueFalse("false")}
                disabled={showFeedback}
                className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                False
              </button>
            </div>
          </div>
        );
        
      case "fillBlank":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">{challenge.question}</h3>
            <div className="flex justify-center">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showFeedback}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg w-48 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter answer"
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleFillBlank}
                disabled={showFeedback || userAnswer.trim() === ""}
                className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${
                  userAnswer.trim() !== ""
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          </div>
        );
        
      case "scenario":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">{challenge.question}</h3>
            <div className="grid grid-cols-1 gap-3">
              {challenge.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultipleChoice(option)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-lg mr-3">{String.fromCharCode(65 + index)}.</div>
                    <div>{option}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (gameFinished) {
    return (
      <GameShell
        title="Badge: Rights Kid"
        subtitle="Congratulations!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        gameId="civic-responsibility-kids-70"
        gameType="civic-responsibility"
        totalLevels={70}
        currentLevel={70}
        showConfetti={true}
        backPath="/games/civic-responsibility/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏅</div>
          <h2 className="text-2xl font-bold mb-4">Rights Kid</h2>
          <p className="text-white/80 mb-6">
            You've completed all human rights challenges!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-8">
            You've earned your Rights Kid Badge!
          </div>
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Badge: Rights Kid"
      subtitle={`Challenge ${currentChallenge + 1} of ${challenges.length} | Completed: ${completedChallenges.length}/${challenges.length}`}
      backPath="/games/civic-responsibility/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">Progress</span>
              <span className="text-yellow-400 font-bold">{completedChallenges.length}/{challenges.length} challenges</span>
            </div>
            <div className="bg-white/10 rounded-full h-3 w-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
                style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderChallenge()}

          {showFeedback && (
            <div className={`p-4 rounded-xl mt-6 ${
              feedback.correct 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`text-lg font-semibold ${feedback.correct ? 'text-green-300' : 'text-red-300'}`}>
                {feedback.message}
              </p>
              <p className="text-white/90 mt-2">{feedback.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeRightsKid;