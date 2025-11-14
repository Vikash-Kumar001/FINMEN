import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SharingGoodContentStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "The Science Video Post",
      emoji: "🔬",
      situation: "A child shares a video of their fun science experiment instead of posting memes.",
      question: "What do you think about this choice?",
      choices: [
        { id: 1, text: "It's great! Learning is cool!", emoji: "🤩", isCorrect: true },
        { id: 2, text: "That’s boring, memes are better", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Ignore it and move on", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Encouraging Others",
      emoji: "💬",
      situation: "Some friends laugh at the science video and call it nerdy.",
      question: "What should you comment?",
      choices: [
        { id: 1, text: "Say 'Nice experiment! I learned something!'", emoji: "👏", isCorrect: true },
        { id: 2, text: "Join the laughter", emoji: "😂", isCorrect: false },
        { id: 3, text: "Say nothing and scroll away", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Inspiration Time",
      emoji: "💡",
      situation: "The video inspires you to try a small experiment too.",
      question: "What should you do next?",
      choices: [
        { id: 1, text: "Try your own science experiment", emoji: "🧪", isCorrect: true },
        { id: 2, text: "Complain that yours won’t be good", emoji: "😞", isCorrect: false },
        { id: 3, text: "Forget about it", emoji: "😴", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Spreading Knowledge",
      emoji: "🌍",
      situation: "Your science post also gets shared by friends online.",
      question: "How should you feel about it?",
      choices: [
        { id: 1, text: "Happy you inspired learning!", emoji: "😄", isCorrect: true },
        { id: 2, text: "Worried they copied you", emoji: "😕", isCorrect: false },
        { id: 3, text: "Delete your post", emoji: "🗑️", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Digital Role Model",
      emoji: "🏅",
      situation: "Your teacher praises you for sharing positive content online.",
      question: "What lesson do you learn?",
      choices: [
        { id: 1, text: "Good content makes internet better!", emoji: "💖", isCorrect: true },
        { id: 2, text: "Only jokes get likes", emoji: "🙃", isCorrect: false },
        { id: 3, text: "Never post again", emoji: "🚫", isCorrect: false }
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
      setCorrectAnswers(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // All questions done
      const totalCoins = correctAnswers * 1;
      setCoins(totalCoins);
      setShowFeedback(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCorrectAnswers(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/journal-of-smart-use"); // ✅ same path format
  };

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Sharing Good Content Story"
      subtitle="Spread Positivity Online"
      onNext={handleNext}
      nextEnabled={showFeedback && currentQuestion === questions.length - 1}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="dcos-kids-97"
      gameType="story"
      totalLevels={100}
      currentLevel={97}
      showConfetti={showFeedback && currentQuestion === questions.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          // Question View
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{question.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed mb-2">{question.situation}</p>
              <p className="text-white/80">{question.question}</p>
            </div>

            <div className="space-y-3 mb-6">
              {question.choices.map(choice => (
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
          // Feedback View
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌟 Great Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That’s right! Sharing positive and educational content like science videos
                    makes the internet a smarter, kinder place.
                  </p>
                </div>
                {currentQuestion === questions.length - 1 ? (
                  <>
                    <p className="text-yellow-400 text-2xl font-bold text-center">
                      You earned 5 Coins! 🪙
                    </p>
                    <p className="text-white/70 text-sm text-center mt-2">
                      Keep inspiring others with good posts online!
                    </p>
                  </>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Next Story ➡️
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That choice isn’t the best. Try to support others who share learning and positivity!
                  </p>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Continue ➡️
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SharingGoodContentStory;
