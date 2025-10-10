import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PredictNextWord = () => {
  const navigate = useNavigate();
  const [currentSentence, setCurrentSentence] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const sentences = [
    { id: 1, text: "The sun rises in the", correct: "east", alternatives: ["East", "EAST"] },
    { id: 2, text: "Water boils at 100 degrees", correct: "celsius", alternatives: ["Celsius", "CELSIUS", "centigrade"] },
    { id: 3, text: "The capital of France is", correct: "paris", alternatives: ["Paris", "PARIS"] },
    { id: 4, text: "There are 7 days in a", correct: "week", alternatives: ["Week", "WEEK"] },
    { id: 5, text: "The opposite of hot is", correct: "cold", alternatives: ["Cold", "COLD"] }
  ];

  const currentSentenceData = sentences[currentSentence];

  const handleSubmit = () => {
    const answer = userAnswer.trim().toLowerCase();
    const correctAnswer = currentSentenceData.correct.toLowerCase();
    const alternatives = currentSentenceData.alternatives.map(a => a.toLowerCase());
    
    const isCorrect = answer === correctAnswer || alternatives.includes(answer);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect. The answer is: ${currentSentenceData.correct}`);
    }
    
    setTimeout(() => {
      if (currentSentence < sentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
        setUserAnswer("");
        setFeedback("");
      } else {
        if ((score + (isCorrect ? 1 : 0)) >= 4) {
          setCoins(5);
        }
        setScore(prev => prev + (isCorrect ? 1 : 0));
        setShowResult(true);
      }
    }, 1500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentSentence(0);
    setUserAnswer("");
    setScore(0);
    setCoins(0);
    setFeedback("");
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/self-driving-car-reflex");
  };

  return (
    <GameShell
      title="Predict the Next Word"
      subtitle={`Sentence ${currentSentence + 1} of ${sentences.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ai-teen-5"
      gameType="ai"
      totalLevels={20}
      currentLevel={5}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Complete the sentence!</h3>
            
            <div className="bg-blue-500/20 rounded-lg p-6 mb-6">
              <p className="text-white text-2xl font-semibold text-center mb-4">
                {currentSentenceData.text} ___
              </p>
            </div>

            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && handleSubmit()}
              placeholder="Type your answer..."
              disabled={feedback !== ""}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/40 rounded-xl text-white text-lg placeholder-white/50 focus:border-purple-400 focus:outline-none mb-4"
            />

            {feedback && (
              <div className={`p-3 rounded-lg mb-4 ${
                feedback === "Correct!" ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <p className="text-white text-center font-semibold">{feedback}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim() || feedback !== ""}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                userAnswer.trim() && feedback === ""
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🎉 Prediction Pro!" : "💪 Keep Trying!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You predicted {score} out of {sentences.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 This is how AI language models like ChatGPT work! They predict the next word 
                based on patterns learned from billions of texts!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>
            {score < 4 && (
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

export default PredictNextWord;

