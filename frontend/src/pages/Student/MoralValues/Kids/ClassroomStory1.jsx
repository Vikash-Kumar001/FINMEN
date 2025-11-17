import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClassroomStory1 = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Group Project Contribution",
      emoji: "📚",
      situation: "You're in a group project. Do you contribute your part or let others do all the work?",
      choices: [
        { id: 1, text: "Do nothing, let others handle it", emoji: "😴", isCorrect: false },
        { id: 2, text: "Contribute actively", emoji: "💡", isCorrect: true },
        { id: 3, text: "Only help a little", emoji: "🤏", isCorrect: false }
      ]
    },
    {
      title: "Sharing Ideas",
      emoji: "📝",
      situation: "During discussion, do you share your ideas or stay silent?",
      choices: [
        { id: 1, text: "Stay silent", emoji: "🤐", isCorrect: false },
        { id: 2, text: "Share your ideas", emoji: "💭", isCorrect: true },
        { id: 3, text: "Only agree with others", emoji: "👍", isCorrect: false }
      ]
    },
    {
      title: "Helping Team Members",
      emoji: "🤝",
      situation: "A teammate struggles with their part. Do you help or ignore?",
      choices: [
        { id: 1, text: "Ignore", emoji: "🙅", isCorrect: false },
        { id: 2, text: "Help them", emoji: "💪", isCorrect: true },
        { id: 3, text: "Tell them to ask someone else", emoji: "👉", isCorrect: false }
      ]
    },
    {
      title: "Meeting Deadlines",
      emoji: "⏰",
      situation: "Your part of the project is due tomorrow. Do you finish it on time or delay?",
      choices: [
        { id: 1, text: "Delay it", emoji: "🛌", isCorrect: false },
        { id: 2, text: "Finish it on time", emoji: "✅", isCorrect: true },
        { id: 3, text: "Ask someone else to do it", emoji: "🙋", isCorrect: false }
      ]
    },
    {
      title: "Final Presentation",
      emoji: "🎤",
      situation: "Do you participate actively in presenting or let others speak for you?",
      choices: [
        { id: 1, text: "Stay quiet", emoji: "🙊", isCorrect: false },
        { id: 2, text: "Present your part confidently", emoji: "💪", isCorrect: true },
        { id: 3, text: "Only nod along", emoji: "🙂", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, false);
      setCoins(prev => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      // All questions done
      if (coins === questions.length) {
        showCorrectAnswerFeedback(5, true); // full reward
        setCoins(5);
      }
      navigate("/student/moral-values/kids/poster-team-spirit"); // next game
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];
  const selectedChoiceData = currentQuestionData.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Classroom Story"
      subtitle={`Scenario ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="moral-kids-65"
      gameType="educational"
      totalLevels={100}
      currentLevel={65}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
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
              <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                You earned 1 Coin! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Scenario
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ClassroomStory1;
