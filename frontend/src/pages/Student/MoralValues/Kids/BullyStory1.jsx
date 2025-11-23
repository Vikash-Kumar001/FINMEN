import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BullyStory1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      id: 1,
      emoji: "🤝",
      situation: "Your friend is being teased by others. What should you do?",
      choices: [
        { id: 1, text: "Laugh along with others", emoji: "😂", isCorrect: false },
        { id: 2, text: "Support your friend and stand up", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ignore it and walk away", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 2,
      emoji: "🗣️",
      situation: "You see someone spreading rumors about your classmate. What’s the right response?",
      choices: [
        { id: 1, text: "Join the gossip to fit in", emoji: "📢", isCorrect: false },
        { id: 2, text: "Stop the gossip and tell the truth", emoji: "🤐", isCorrect: true },
        { id: 3, text: "Just listen quietly", emoji: "👂", isCorrect: false },
      ],
    },
    {
      id: 3,
      emoji: "📱",
      situation:
        "A student posts a mean comment online about your friend. What should you do?",
      choices: [
        { id: 1, text: "Report the comment and comfort your friend", emoji: "📩", isCorrect: true },
        { id: 2, text: "Like the comment to look cool", emoji: "👍", isCorrect: false },
        { id: 3, text: "Ignore it completely", emoji: "😶", isCorrect: false },
      ],
    },
    {
      id: 4,
      emoji: "🏫",
      situation: "You notice a new student sitting alone because others ignore them. What will you do?",
      choices: [
        { id: 1, text: "Invite them to join your group", emoji: "🤗", isCorrect: true },
        { id: 2, text: "Leave them alone — they’ll find friends later", emoji: "🕒", isCorrect: false },
        { id: 3, text: "Make jokes about them", emoji: "😜", isCorrect: false },
      ],
    },
    {
      id: 5,
      emoji: "💬",
      situation: "Someone makes fun of another student’s accent. What’s the best thing to do?",
      choices: [
        { id: 1, text: "Laugh along so you don't look boring", emoji: "😂", isCorrect: false },
        { id: 2, text: "Speak up and remind others to respect differences", emoji: "🗯️", isCorrect: true },
        { id: 3, text: "Walk away quietly", emoji: "🚶", isCorrect: false },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      setGameOver(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/reflex-brave-symbol");
  };

  return (
    <GameShell
      title="Bully Story 1"
      subtitle="Support Your Friend"
      onNext={handleNextGame}
      nextEnabled={gameOver}
      showGameOver={gameOver}
      score={coins}
      gameId="moral-kids-58"
      gameType="educational"
      totalLevels={100}
      currentLevel={58}
      showConfetti={gameOver}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {/* ✅ GAME OVER SUMMARY */}
        {gameOver ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Well Done!</h2>
            <p className="text-white text-lg mb-6">
              You’ve learned how to stand up against bullying and support your friends.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              Total Coins Earned: {coins} 🪙
            </p>
            <button
              onClick={handleNextGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Game →
            </button>
          </div>
        ) : (
          <>
            {/* ✅ QUESTION SECTION */}
            {!showFeedback ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
                <div className="text-8xl mb-4 text-center">{currentQuestion.emoji}</div>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <div className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-5 mb-6">
                  <p className="text-white text-lg leading-relaxed text-center">
                    {currentQuestion.situation}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {currentQuestion.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice.id)}
                      className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                        selectedChoice === choice.id
                          ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                          : "bg-white/20 border-white/40 hover:bg-white/30"
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
                      ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                      : "bg-gray-500/50 cursor-not-allowed"
                  }`}
                >
                  Confirm Choice
                </button>
              </div>
            ) : (
              /* ✅ FEEDBACK SECTION */
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
                <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
                <h2 className="text-3xl font-bold text-white mb-4 text-center">
                  {selectedChoiceData.isCorrect ? "🌟 Correct!" : "Think Again..."}
                </h2>
                <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

                {selectedChoiceData.isCorrect ? (
                  <>
                    <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                      <p className="text-white text-center">
                        Great! You made the right choice. Helping others and stopping bullying builds
                        a safe and respectful community.
                      </p>
                    </div>
                    <p className="text-yellow-400 text-2xl font-bold text-center">
                      +5 Coins Earned! 🪙
                    </p>
                    <button
                      onClick={handleNextQuestion}
                      className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                    >
                      {currentQuestionIndex + 1 < questions.length
                        ? "Next Question →"
                        : "Finish Quiz 🎯"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                      <p className="text-white text-center">
                        {selectedChoice === 1
                          ? "Joining in hurts others. The right thing is to support and stop the bullying!"
                          : "Ignoring it won’t solve the problem. Step in to help your friend!"}
                      </p>
                    </div>
                    <button
                      onClick={handleTryAgain}
                      className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </GameShell>
  );
};

export default BullyStory1;
