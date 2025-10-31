import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionalCheckIn = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleConfirm();
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      vignette: "Friend ignores you.",
      emoji: "😔",
      correctEmotions: ["hurt", "sad"]
    },
    {
      id: 2,
      vignette: "Win a prize.",
      emoji: "🏆",
      correctEmotions: ["happy", "proud"]
    },
    {
      id: 3,
      vignette: "Fail a task.",
      emoji: "😞",
      correctEmotions: ["frustrated", "disappointed"]
    },
    {
      id: 4,
      vignette: "New challenge.",
      emoji: "🚀",
      correctEmotions: ["excited", "nervous"]
    },
    {
      id: 5,
      vignette: "Argument with family.",
      emoji: "😠",
      correctEmotions: ["angry", "upset"]
    }
  ];

  const emotions = ["happy", "sad", "angry", "frustrated", "excited", "disappointed", "hurt", "proud", "nervous", "upset"];

  const handleEmotionToggle = (emotion) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else if (selectedEmotions.length < 2) {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const isAccurate = selectedEmotions.every(e => question.correctEmotions.includes(e)) && selectedEmotions.length === question.correctEmotions.length;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isAccurate
    }];
    
    setResponses(newResponses);
    
    if (isAccurate) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedEmotions([]);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const accurateCount = newResponses.filter(r => r.isAccurate).length;
      if (accurateCount >= 4) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const accurateCount = responses.filter(r => r.isAccurate).length;

  return (
    <GameShell
      title="Emotional Check-in"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accurateCount >= 4}
      showGameOver={showResult && accurateCount >= 4}
      score={coins}
      gameId="emotion-141"
      gameType="emotion"
      totalLevels={10}
      currentLevel={1}
      showConfetti={showResult && accurateCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <div className="text-5xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <p className="text-white italic mb-6">
                "{questions[currentQuestion].vignette}"
              </p>
              
              <p className="text-white/90 mb-4 text-center">Select 2 emotions:</p>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {emotions.map(emotion => (
                  <button
                    key={emotion}
                    onClick={() => handleEmotionToggle(emotion)}
                    className={`py-2 rounded-xl text-white ${
                      selectedEmotions.includes(emotion) ? 'bg-blue-500' : 'bg-white/20'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={selectedEmotions.length === 0 && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedEmotions.length > 0 || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accurateCount >= 4 ? "🎉 Emotion Labeler!" : "💪 More Accurate!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Accurate labels: {accurateCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accurateCount >= 4 ? "Earned 5 Coins!" : "Need 4+ accurate."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach mixed emotions vocabulary.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmotionalCheckIn;