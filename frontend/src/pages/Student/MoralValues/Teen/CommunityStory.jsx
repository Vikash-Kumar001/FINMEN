import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CommunityStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Dirty Park",
      emoji: "🌳",
      situation: "You see your local park full of trash. Do you lead your friends to clean it?",
      choices: [
        { id: 1, text: "Yes, organize a quick cleanup!", emoji: "💪", isCorrect: true },
        { id: 2, text: "Ignore it; it’s not your job", emoji: "😐", isCorrect: false },
        { id: 3, text: "Complain but don’t act", emoji: "🙄", isCorrect: false }
      ],
      correctMessage: "Awesome! Taking initiative to clean the park shows responsibility and leadership.",
      wrongMessage: "Ignoring problems doesn’t help the community. Small efforts make a big difference!"
    },
    {
      id: 2,
      title: "Elder Help",
      emoji: "🧓",
      situation: "You notice an elderly neighbor struggling to carry groceries. What do you do?",
      choices: [
        { id: 1, text: "Offer to help carry the bags", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Walk away quickly", emoji: "🚶‍♀️", isCorrect: false },
        { id: 3, text: "Watch but don’t help", emoji: "👀", isCorrect: false }
      ],
      correctMessage: "Great! Helping others builds kindness and strengthens community bonds.",
      wrongMessage: "Helping a neighbor is a small act that spreads positivity. Try again!"
    },
    {
      id: 3,
      title: "School Garden",
      emoji: "🌼",
      situation: "Your teacher asks for volunteers to water the school garden daily. What’s your response?",
      choices: [
        { id: 1, text: "Volunteer and invite others", emoji: "🙋‍♀️", isCorrect: true },
        { id: 2, text: "Say you’re too busy", emoji: "😴", isCorrect: false },
        { id: 3, text: "Pretend not to hear", emoji: "🙈", isCorrect: false }
      ],
      correctMessage: "Nice! Volunteering teaches responsibility and care for shared spaces.",
      wrongMessage: "Avoiding tasks hurts the community spirit. Step up and make a difference!"
    },
    {
      id: 4,
      title: "Street Safety",
      emoji: "🚸",
      situation: "A streetlight near your area is broken. What will you do?",
      choices: [
        { id: 1, text: "Report it to local authorities", emoji: "📞", isCorrect: true },
        { id: 2, text: "Do nothing about it", emoji: "😶", isCorrect: false },
        { id: 3, text: "Complain to friends only", emoji: "😒", isCorrect: false }
      ],
      correctMessage: "Exactly! Reporting issues shows responsibility for community safety.",
      wrongMessage: "Complaining doesn’t fix problems — responsible action does!"
    },
    {
      id: 5,
      title: "Festival Waste",
      emoji: "🎉",
      situation: "After a local festival, you see leftover waste everywhere. What do you do?",
      choices: [
        { id: 1, text: "Gather a group to clean up", emoji: "🧹", isCorrect: true },
        { id: 2, text: "Walk away after enjoying", emoji: "🏃‍♀️", isCorrect: false },
        { id: 3, text: "Blame others for the mess", emoji: "🤔", isCorrect: false }
      ],
      correctMessage: "Perfect! True community members take action, not just enjoy the fun.",
      wrongMessage: "It’s easy to blame others, but action is what makes a difference!"
    }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const current = questions[currentQuestion];
    const choice = current.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 1);
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
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/debate-boss-vs-leader");
  };

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Community Story"
      subtitle="Taking Initiative in Your Neighborhood"
      onNext={handleNext}
      nextEnabled={currentQuestion === questions.length - 1 && showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins * 5}
      gameId="moral-teen-75"
      gameType="moral"
      totalLevels={100}
      currentLevel={75}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map(choice => (
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
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌟 Great Citizen!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.correctMessage}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Game"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.wrongMessage}</p>
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

export default CommunityStory;
