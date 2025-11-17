import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayMediator = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [statement, setStatement] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scenario: "Two classmates argue loudly over who should present the project. What’s your first move as a mediator?",
      options: [
        { id: 1, text: "Let them argue until they calm down", isCorrect: false },
        { id: 2, text: "Ask both to share their sides calmly one by one", isCorrect: true },
        { id: 3, text: "Pick your favorite side to stop the fight faster", isCorrect: false },
      ],
    },
    {
      id: 2,
      scenario: "One student refuses to listen while the other talks. What would you say?",
      options: [
        { id: 1, text: "Tell them to stay quiet and let the teacher decide", isCorrect: false },
        { id: 2, text: "Remind them that listening is key to solving conflicts", isCorrect: true },
        { id: 3, text: "Leave the situation to avoid stress", isCorrect: false },
      ],
    },
    {
      id: 3,
      scenario: "Both students feel misunderstood. How can you help them reach common ground?",
      options: [
        { id: 1, text: "Repeat what each person said to ensure clarity", isCorrect: true },
        { id: 2, text: "Tell them to forget it and move on", isCorrect: false },
        { id: 3, text: "Ask others to choose who’s right", isCorrect: false },
      ],
    },
    {
      id: 4,
      scenario: "The argument gets heated again. How should you handle it?",
      options: [
        { id: 1, text: "Raise your voice to control them", isCorrect: false },
        { id: 2, text: "Encourage deep breaths and respectful tone", isCorrect: true },
        { id: 3, text: "Walk away immediately", isCorrect: false },
      ],
    },
    {
      id: 5,
      scenario: "After resolving the fight, what should a good mediator do next?",
      options: [
        { id: 1, text: "Ignore both since the fight is over", isCorrect: false },
        { id: 2, text: "Check in later to ensure peace continues", isCorrect: true },
        { id: 3, text: "Remind them you were the hero", isCorrect: false },
      ],
    },
  ];

  const currentQ = questions[currentQuestion];
  const selected = currentQ.options.find((o) => o.id === selectedOption);

  const handleSubmit = () => {
    const chosen = currentQ.options.find((o) => o.id === selectedOption);
    if (chosen && chosen.isCorrect && statement.trim().length >= 20) {
      showCorrectAnswerFeedback(1, true);
      setScore((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setStatement("");
      setShowFeedback(false);
    } else {
      // End of quiz
      if (score >= 4) setEarnedBadge(true);
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/teen/reflex-calm-action");
  };

  return (
    <GameShell
      title="Roleplay: Mediator"
      subtitle="Calm Conflicts with Understanding"
      onNext={handleNextGame}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="moral-teen-88"
      gameType="moral"
      totalLevels={100}
      currentLevel={88}
      showConfetti={earnedBadge}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!earnedBadge ? (
          <>
            {!showFeedback ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
                <div className="text-6xl mb-4 text-center">🕊️</div>
                <p className="text-center text-white/70 mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                  <p className="text-white text-lg leading-relaxed">{currentQ.scenario}</p>
                </div>

                <h3 className="text-white font-bold mb-4">1. Choose Your Response</h3>
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full border-2 rounded-xl p-4 transition-all ${
                        selectedOption === opt.id
                          ? "bg-green-500/50 border-green-400 ring-2 ring-white"
                          : "bg-white/20 border-white/40 hover:bg-white/30"
                      }`}
                    >
                      <div className="text-white font-semibold">{opt.text}</div>
                    </button>
                  ))}
                </div>

                <h3 className="text-white font-bold mb-2">2. What Would You Say? (min 20 chars)</h3>
                <textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Write how you would calmly mediate between two students..."
                  className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-green-400 resize-none mb-4"
                  maxLength={200}
                />
                <div className="text-white/50 text-sm mb-4 text-right">
                  {statement.length}/200
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!selectedOption || statement.trim().length < 20}
                  className={`w-full py-3 rounded-xl font-bold text-white transition ${
                    selectedOption && statement.trim().length >= 20
                      ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                      : "bg-gray-500/50 cursor-not-allowed"
                  }`}
                >
                  Submit Response
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
                <div className="text-7xl mb-4">{selected?.isCorrect ? "🤝" : "😔"}</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {selected?.isCorrect ? "Peaceful Mediator!" : "Try Again..."}
                </h2>

                {selected?.isCorrect ? (
                  <>
                    <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                      <p className="text-white text-center">
                        Great job! You helped others find peace and understanding. A true mediator
                        listens, respects both sides, and guides others toward harmony.
                      </p>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3 mb-6">
                      <p className="text-white/80 text-sm mb-1">Your Mediation Statement:</p>
                      <p className="text-white italic">"{statement}"</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                    <p className="text-white">
                      Remember, mediators bring calm, not chaos. Stay neutral and help both sides feel heard!
                    </p>
                  </div>
                )}

                {/* ✅ Next Question Button */}
                <button
                  onClick={handleNextQuestion}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:opacity-90 transition"
                >
                  {currentQuestion < questions.length - 1
                    ? "Next Question ➜"
                    : "Finish Roleplay 🏅"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl p-8 text-center border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-2">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-2">Mediator Badge Unlocked!</h2>
            <p className="text-white/90 mb-4">
              You calmed conflicts with wisdom and patience. True leaders bring peace wherever they go!
            </p>
            <p className="text-yellow-200 text-xl font-bold">You earned 3 Coins! 🪙</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayMediator;
