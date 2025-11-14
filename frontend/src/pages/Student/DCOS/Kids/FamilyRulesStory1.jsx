import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FamilyRulesStory1 = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Dinner Time Rule",
      emoji: "🍽️",
      situation:
        "Your parents say, 'No phones at dinner.' Everyone should talk together instead.",
      choices: [
        { id: 1, text: "Hide your phone and keep using it secretly", emoji: "📱", isCorrect: false },
        { id: 2, text: "Put your phone away and join the talk", emoji: "😊", isCorrect: true },
        { id: 3, text: "Complain that the rule is boring", emoji: "🙄", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Homework First",
      emoji: "📚",
      situation: "Your family rule says: ‘Homework before games.’ What do you do?",
      choices: [
        { id: 1, text: "Play video games first, homework later", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Finish homework, then play happily", emoji: "✅", isCorrect: true },
        { id: 3, text: "Ask your friend to do your homework", emoji: "🤫", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "TV Time Rule",
      emoji: "📺",
      situation:
        "Family rule: No TV before breakfast. You wake up early and want to watch cartoons.",
      choices: [
        { id: 1, text: "Wait until breakfast is done", emoji: "🍳", isCorrect: true },
        { id: 2, text: "Turn on the TV quietly so no one knows", emoji: "🤫", isCorrect: false },
        { id: 3, text: "Say rules don’t matter in the morning", emoji: "😒", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Helping Out",
      emoji: "🧹",
      situation: "Your parents ask you to clean your room before playing outside.",
      choices: [
        { id: 1, text: "Do it later and go outside first", emoji: "🏃", isCorrect: false },
        { id: 2, text: "Clean it up quickly, then go play", emoji: "🌟", isCorrect: true },
        { id: 3, text: "Complain and argue about chores", emoji: "😠", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Bedtime Rule",
      emoji: "🌙",
      situation: "Family rule: Lights out by 9 PM. You’re reading your comic under the blanket.",
      choices: [
        { id: 1, text: "Turn off the lights and sleep", emoji: "😴", isCorrect: true },
        { id: 2, text: "Keep reading secretly", emoji: "📖", isCorrect: false },
        { id: 3, text: "Argue about staying up late", emoji: "😤", isCorrect: false },
      ],
    },
  ];

  const currentQ = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQ.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      navigate("/student/dcos/kids/eye-strain-reflex"); // ✅ Next game
    }
  };

  const selectedChoiceData = currentQ.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Family Rules Story"
      subtitle="Respect and Obey Family Rules"
      score={coins}
      totalLevels={100}
      currentLevel={23}
      gameId="dcos-kids-23"
      gameType="educational"
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {/* ✅ Question + Choices Section */}
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQ.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentQ.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentQ.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentQ.choices.map((choice) => (
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
          /* ✅ Feedback Section + Next Question */
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "🏅 Family Follower!" : "Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Nice work! Obeying family rules shows respect and care. You build trust and
                    earn the “Family Follower” badge!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-6">+5 Coins Earned 🪙</p>

                <button
                  onClick={handleNextQuestion}
                  className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question ➡️" : "Finish Game 🏁"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    That’s not the best choice. Rules keep families happy and safe. Try again!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    resetFeedback();
                  }}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FamilyRulesStory1;
