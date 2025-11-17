import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolCleanUpStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Join School Clean-Up",
      emoji: "🌱",
      situation: "Teacher asks to clean the school garden. Do you join?",
      choices: [
        { id: 1, text: "Yes, let's clean!", emoji: "💪", isCorrect: true },
        { id: 2, text: "No, I’m busy", emoji: "😴", isCorrect: false },
        { id: 3, text: "Only if friends join", emoji: "👥", isCorrect: false }
      ]
    },
    {
      title: "Collect Trash",
      emoji: "🗑️",
      situation: "Do you pick up litter you see in the garden?",
      choices: [
        { id: 1, text: "Yes, every bit counts", emoji: "🌿", isCorrect: true },
        { id: 2, text: "Ignore it", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Only big pieces", emoji: "👀", isCorrect: false }
      ]
    },
    {
      title: "Water Plants",
      emoji: "💧",
      situation: "Plants need water. Do you water them?",
      choices: [
        { id: 1, text: "Yes, carefully", emoji: "🌸", isCorrect: true },
        { id: 2, text: "No, someone else will", emoji: "😅", isCorrect: false },
        { id: 3, text: "Just sprinkle a little", emoji: "💦", isCorrect: false }
      ]
    },
    {
      title: "Weed Removal",
      emoji: "🌾",
      situation: "Weeds are growing in the garden. Do you remove them?",
      choices: [
        { id: 1, text: "Yes, keep garden neat", emoji: "✂️", isCorrect: true },
        { id: 2, text: "Ignore them", emoji: "🙃", isCorrect: false },
        { id: 3, text: "Pull some, leave others", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      title: "Final Check",
      emoji: "🏡",
      situation: "The garden looks clean. Do you make a final check?",
      choices: [
        { id: 1, text: "Yes, make sure all is tidy", emoji: "✅", isCorrect: true },
        { id: 2, text: "No, I’m done", emoji: "🛑", isCorrect: false },
        { id: 3, text: "Only check a small area", emoji: "🔍", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);
    
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // 1 coin per correct choice
    }
    
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setCoins(5); // Final reward capped at 5 coins
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/poster-helping-hands"); // Next game path
  };

  const currentQuestionData = questions[currentQuestion];
  const selectedChoiceData = currentQuestionData.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="School Clean-Up Story"
      subtitle={`Story Choice ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={currentQuestion === questions.length - 1 && showFeedback && coins > 0}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback && coins > 0}
      score={coins}
      gameId="moral-kids-75"
      gameType="educational"
      totalLevels={100}
      currentLevel={75}
      showConfetti={currentQuestion === questions.length - 1 && showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQuestionData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentQuestionData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentQuestionData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
            
            <div className="space-y-3 mb-6">
              {currentQuestionData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌟 Good Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>
            
            {selectedChoiceData.isCorrect ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default SchoolCleanUpStory;
