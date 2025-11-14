import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolTeamReflex = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 5 reflex-based scenarios
  const questions = [
    {
      id: 1,
      situation: "Your school football team just lost the match.",
      emoji: "⚽😢",
      choices: [
        { id: 1, text: "Say 'You all are losers!'", emoji: "😠", isCorrect: false },
        { id: 2, text: "Say 'Good effort, we’ll win next time!'", emoji: "👏", isCorrect: true },
        { id: 3, text: "Walk away without saying anything", emoji: "🚶‍♂️", isCorrect: false },
      ],
    },
    {
      id: 2,
      situation: "A classmate drops the relay baton during a race.",
      emoji: "🏃‍♀️💨",
      choices: [
        { id: 1, text: "Laugh and call them clumsy", emoji: "😂", isCorrect: false },
        { id: 2, text: "Say 'It’s okay, keep trying!'", emoji: "🤗", isCorrect: true },
        { id: 3, text: "Complain to teacher about losing", emoji: "📢", isCorrect: false },
      ],
    },
    {
      id: 3,
      situation: "Your debate team forgets a line on stage.",
      emoji: "🎤😬",
      choices: [
        { id: 1, text: "Encourage from the audience", emoji: "👍", isCorrect: true },
        { id: 2, text: "Whisper jokes to your friend", emoji: "🤭", isCorrect: false },
        { id: 3, text: "Record it and share online", emoji: "📱", isCorrect: false },
      ],
    },
    {
      id: 4,
      situation: "During basketball, your friend misses an easy shot.",
      emoji: "🏀😔",
      choices: [
        { id: 1, text: "Say 'You’re terrible at this!'", emoji: "😡", isCorrect: false },
        { id: 2, text: "Clap and say 'You’ll get it next time!'", emoji: "🙌", isCorrect: true },
        { id: 3, text: "Ignore and leave", emoji: "🚶‍♀️", isCorrect: false },
      ],
    },
    {
      id: 5,
      situation: "Your house team comes last in sports day.",
      emoji: "🏅😢",
      choices: [
        { id: 1, text: "Cheer them and say 'We’ll come back stronger!'", emoji: "💪", isCorrect: true },
        { id: 2, text: "Say 'You embarrassed us!'", emoji: "😤", isCorrect: false },
        { id: 3, text: "Complain about unfair rules", emoji: "🤷‍♂️", isCorrect: false },
      ],
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      showCorrectAnswerFeedback(3, true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/poster-task3");
  };

  return (
    <GameShell
      title="School Team Reflex"
      subtitle="Encourage, Don’t Insult!"
      onNext={handleNext}
      nextEnabled={currentQuestion === questions.length - 1 && showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="dcos-kids-85"
      gameType="educational"
      totalLevels={100}
      currentLevel={85}
      showConfetti={currentQuestion === questions.length - 1 && showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {current.situation}
            </h2>

            <h3 className="text-white font-bold mb-4 text-center">Tap your reflex choice 👇</h3>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4 justify-center">
                    <div className="text-3xl">{choice.emoji}</div>
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
              Confirm Reflex
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "🌟 Encouraging Spirit!" : "Oops! Try Again 💭"}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {selectedChoiceData?.isCorrect
                ? "That’s the right reflex! Encouragement builds teamwork and confidence."
                : "That wasn’t kind. Great teammates lift others up — not put them down."}
            </p>

            <button
              onClick={handleNextQuestion}
              className={`mt-4 w-full ${
                selectedChoiceData?.isCorrect
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              } text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition`}
            >
              {currentQuestion === questions.length - 1 ? "Finish Reflex Game" : "Next Reflex"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SchoolTeamReflex;
