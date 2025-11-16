import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproHealthAwareTeenBadge = () => {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Understand Reproductive Anatomy",
      description: "Learn basic male reproductive system functions",
      question: "What is the main function of the testes?",
      options: [
        { id: "a", text: "Produce sperm and hormones", emoji: "🫐", isCorrect: true },
        { id: "b", text: "Store urine", emoji: "💧", isCorrect: false },
        { id: "c", text: "Pump blood", emoji: "❤️", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Recognize Normal Changes",
      description: "Accept that puberty brings normal reproductive changes",
      question: "Wet dreams during puberty are:",
      options: [
        { id: "a", text: "Completely normal and natural", emoji: "✅", isCorrect: true },
        { id: "b", text: "Something to be embarrassed about", emoji: "😳", isCorrect: false },
        { id: "c", text: "A sign of illness", emoji: "🤒", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Seek Help When Needed",
      description: "Know when to talk to healthcare providers about reproductive health",
      question: "When should you see a doctor about reproductive health concerns?",
      options: [
        { id: "a", text: "When you have questions or notice changes", emoji: "💬", isCorrect: true },
        { id: "b", text: "Only if something hurts a lot", emoji: "🤕", isCorrect: false },
        { id: "c", text: "Never, handle it yourself", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Respect Privacy",
      description: "Understand the importance of personal boundaries",
      question: "What should you do when friends pressure you to share private information?",
      options: [
        { id: "a", text: "Respectfully decline and maintain privacy", emoji: "🤝", isCorrect: true },
        { id: "b", text: "Share everything to fit in", emoji: "👥", isCorrect: false },
        { id: "c", text: "Get angry and argue", emoji: "😠", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Make Healthy Choices",
      description: "Choose behaviors that support reproductive health",
      question: "What supports good reproductive health?",
      options: [
        { id: "a", text: "Regular check-ups and healthy lifestyle", emoji: "🏥", isCorrect: true },
        { id: "b", text: "Ignoring body changes", emoji: "🙈", isCorrect: false },
        { id: "c", text: "Following peer pressure", emoji: "👥", isCorrect: false }
      ]
    }
  ];

  const handleChallengeChoice = (optionId) => {
    const currentChallengeData = challenges[currentChallenge];
    const selectedOption = currentChallengeData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCompletedChallenges([...completedChallenges, currentChallenge]);
      setChallengeCompleted(true);

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          setChallengeCompleted(false);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      // Show feedback but don't advance
      setTimeout(() => {
        // Stay on same challenge
      }, 1500);
    }
  };

  const getCurrentChallenge = () => challenges[currentChallenge];

  const handleNext = () => {
    navigate("/games/health-male/teens");
  };

  const badgeEarned = completedChallenges.length >= 3;

  return (
    <GameShell
      title="Badge: Repro Health Aware Teen (Teen)"
      subtitle={`Challenge ${currentChallenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={completedChallenges.length * 0}
      gameId="health-male-teen-40"
      gameType="health-male"
      totalLevels={100}
      currentLevel={40}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 40/100</span>
            <span className="text-yellow-400 font-bold">Coins: {completedChallenges.length * 0}</span>
          </div>

          {badgeEarned && (
            <div className="text-center mb-6 p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-white text-2xl font-bold mb-2">
                Repro Health Aware Teen Badge Earned!
              </h3>
              <p className="text-white/90">
                Complete reproductive health learning tasks to master teen health awareness!
              </p>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-white text-xl font-bold mb-2">
              Challenge: {getCurrentChallenge().title}
            </h3>
            <p className="text-white/80 mb-4">
              {getCurrentChallenge().description}
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-white text-lg text-center">
              {getCurrentChallenge().question}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentChallenge().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChallengeChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Progress:</span>
              <span className="text-white">{completedChallenges.length}/{challenges.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {completedChallenges.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-bold mb-3">Completed Challenges:</h4>
              <div className="flex flex-wrap gap-2">
                {challenges.map((challenge, index) => (
                  <div
                    key={challenge.id}
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      completedChallenges.includes(index)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {challenge.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReproHealthAwareTeenBadge;
