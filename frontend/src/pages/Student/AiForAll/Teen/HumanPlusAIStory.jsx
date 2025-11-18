import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HumanPlusAIStory = () => {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      title: "AI Diagnoses Disease",
      emoji: "🩺",
      situation: "AI analyzes patient data and suggests a treatment. Who gives the final word?",
      choices: [
        { id: 1, text: "Doctor", emoji: "👨‍⚕️", isCorrect: true },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: false }
      ]
    },
    {
      title: "Surgical Assistance",
      emoji: "🔪",
      situation: "AI assists during surgery by recommending steps. Who decides the final action?",
      choices: [
        { id: 1, text: "Doctor", emoji: "👨‍⚕️", isCorrect: true },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: false }
      ]
    },
    {
      title: "Medical Imaging Analysis",
      emoji: "🩻",
      situation: "AI detects anomalies in X-rays. Who confirms the diagnosis?",
      choices: [
        { id: 1, text: "Doctor", emoji: "👨‍⚕️", isCorrect: true },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: false }
      ]
    },
    {
      title: "Medication Recommendation",
      emoji: "💊",
      situation: "AI suggests medication for a patient. Who approves the prescription?",
      choices: [
        { id: 1, text: "Doctor", emoji: "👨‍⚕️", isCorrect: true },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: false }
      ]
    },
    {
      title: "Health Monitoring",
      emoji: "📈",
      situation: "AI monitors patient's vital signs continuously. Who interprets critical alerts?",
      choices: [
        { id: 1, text: "Doctor", emoji: "👨‍⚕️", isCorrect: true },
        { id: 2, text: "AI", emoji: "🤖", isCorrect: false }
      ]
    }
  ];

  const currentData = stories[currentStory];
  const selectedChoiceData = currentData.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (selectedChoiceData.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(prev => prev + 10);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/teen/dangerous-robot-storyy"); // update next path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Human + AI Story"
      subtitle="Human-in-loop Concept"
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={showFeedback && selectedChoiceData?.isCorrect && currentStory === stories.length - 1}
      score={coins}
      gameId="ai-teen-83"
      gameType="ai"
      totalLevels={20}
      currentLevel={83}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect && currentStory === stories.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">{currentData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentData.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {currentData.choices.map(choice => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-4">{selectedChoiceData.isCorrect ? "✅" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "Correct!" : "Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold">
                +10 Coins Earned 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}

            {selectedChoiceData.isCorrect && currentStory < stories.length - 1 && (
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                Next ➡️
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HumanPlusAIStory;
