import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeacherGreetingStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 5 Question Stories
  const questions = [
    {
      title: "Teacher Enters Room",
      emoji: "👩‍🏫",
      situation: "Your teacher enters the classroom. What should you do?",
      choices: [
        { id: 1, text: "Keep talking with friends", emoji: "💬", isCorrect: false },
        { id: 2, text: "Stand up and greet the teacher", emoji: "🙋", isCorrect: true },
        { id: 3, text: "Look down and stay quiet", emoji: "😐", isCorrect: false },
      ],
      feedback:
        "Standing up and greeting your teacher shows respect. Teachers work hard to help us learn, and greeting them shows we appreciate them!",
    },
    {
      title: "Homework Check",
      emoji: "📚",
      situation: "The teacher asks for your homework, but you forgot it at home. What will you do?",
      choices: [
        { id: 1, text: "Make an excuse", emoji: "🙊", isCorrect: false },
        { id: 2, text: "Be honest and apologize", emoji: "🙏", isCorrect: true },
        { id: 3, text: "Blame your friend", emoji: "😬", isCorrect: false },
      ],
      feedback:
        "Being honest and apologizing shows responsibility and respect. Everyone makes mistakes, but honesty builds trust!",
    },
    {
      title: "Class Discussion",
      emoji: "🗣️",
      situation: "During a discussion, your teacher is explaining something. What should you do?",
      choices: [
        { id: 1, text: "Interrupt to share your idea", emoji: "💭", isCorrect: false },
        { id: 2, text: "Listen carefully until they finish", emoji: "👂", isCorrect: true },
        { id: 3, text: "Talk to your friend", emoji: "🗨️", isCorrect: false },
      ],
      feedback:
        "Listening carefully shows respect for the teacher and helps you learn better. Wait for your turn to share your thoughts!",
    },
    {
      title: "Group Work",
      emoji: "🤝",
      situation: "Your teacher assigns you to work in a group. What is a respectful way to act?",
      choices: [
        { id: 1, text: "Do all the work alone", emoji: "😤", isCorrect: false },
        { id: 2, text: "Work together and share ideas", emoji: "💡", isCorrect: true },
        { id: 3, text: "Ignore others’ opinions", emoji: "🙄", isCorrect: false },
      ],
      feedback:
        "Teamwork means listening and sharing ideas. Respecting everyone’s opinion makes the group stronger!",
    },
    {
      title: "End of the Day",
      emoji: "🌅",
      situation: "The class ends and your teacher is leaving. What should you do?",
      choices: [
        { id: 1, text: "Say 'Thank you, teacher!'", emoji: "😊", isCorrect: true },
        { id: 2, text: "Run out of the classroom", emoji: "🏃‍♀️", isCorrect: false },
        { id: 3, text: "Ignore and pack your bag", emoji: "🎒", isCorrect: false },
      ],
      feedback:
        "Saying 'Thank you' shows gratitude and respect. Small acts of kindness create a positive classroom!",
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current?.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    const choice = current.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      setCurrentQuestion(questions.length);
      setShowFeedback(true);
    }
  };

  const handleFinish = () => {
    navigate("/student/moral-values/kids/gratitude-poster");
  };

  return (
    <GameShell
      title={ currentQuestion < questions.length ? current.title : "All Scenarios Completed!"}
      subtitle="Showing Respect"
      onNext={handleFinish}
      nextEnabled={currentQuestion === questions.length}
      showGameOver={currentQuestion === questions.length}
      score={totalCoins}
      gameId="moral-kids-15"
      gameType="educational"
      totalLevels={20}
      currentLevel={15}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {currentQuestion === questions.length ? (
          // ✅ Final Congrats Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Excellent!</h2>
            <p className="text-white mb-4">
              You completed all 5 respect lessons and earned{" "}
              <span className="text-yellow-400 font-bold">{totalCoins} Coins 🪙</span>!
            </p>
            <p className="text-white/80 mb-6">
              Great job! You’ve learned how to be a respectful and kind student.
            </p>
            <button
              onClick={handleFinish}
              className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        ) : !showFeedback ? (
          // ✅ Question Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {current.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {current.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">
              What should you do?
            </h3>
            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
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
                    <div className="text-white font-semibold text-lg">
                      {choice.text}
                    </div>
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
          // ✅ Feedback Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect
                ? "🌟 Respectful Choice!"
                : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.text}
            </p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Story →
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Try to think of the most respectful action.
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
      </div>
    </GameShell>
  );
};

export default TeacherGreetingStory;
