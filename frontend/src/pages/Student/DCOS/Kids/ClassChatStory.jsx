import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClassChatStory = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Group Chat Trouble",
      emoji: "💬",
      situation: "A classmate posts, 'You're so fat!' in the group chat. Everyone laughs.",
      choices: [
        { id: 1, text: "Tell them to stop — it’s not nice.", emoji: "🛑", isCorrect: true },
        { id: 2, text: "Laugh along with others.", emoji: "😂", isCorrect: false },
        { id: 3, text: "Ignore it and stay silent.", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Forward or Forget?",
      emoji: "📱",
      situation: "Someone sends a funny meme making fun of a classmate’s picture.",
      choices: [
        { id: 1, text: "Forward it to friends for fun.", emoji: "📤", isCorrect: false },
        { id: 2, text: "Tell them it’s mean and delete it.", emoji: "🗑️", isCorrect: true },
        { id: 3, text: "Do nothing and keep it.", emoji: "🤷‍♀️", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Typing Back",
      emoji: "⌨️",
      situation: "You see a mean comment about your best friend online.",
      choices: [
        { id: 1, text: "Join in and say worse things.", emoji: "😈", isCorrect: false },
        { id: 2, text: "Report the post and tell your friend.", emoji: "📢", isCorrect: true },
        { id: 3, text: "Just scroll past.", emoji: "👀", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Oops Message",
      emoji: "😳",
      situation: "You accidentally type something rude about a classmate in a group chat.",
      choices: [
        { id: 1, text: "Apologize and delete it right away.", emoji: "🙏", isCorrect: true },
        { id: 2, text: "Blame someone else.", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Ignore and hope no one saw it.", emoji: "😬", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "After Class Chat",
      emoji: "🎓",
      situation: "Someone calls another student ‘nerd’ in chat. Everyone is watching.",
      choices: [
        { id: 1, text: "Say 'That’s not kind — stop it.'", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Join the teasing for fun.", emoji: "🤣", isCorrect: false },
        { id: 3, text: "Say nothing and leave group.", emoji: "🚪", isCorrect: false }
      ]
    }
  ];

  const currentStory = stories[currentScenario];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCorrectAnswers(prev => prev + 1);
    }

    if (currentScenario < stories.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
        setSelectedChoice(null);
      }, 600);
    } else {
      setShowFeedback(true);
      const totalCoins = correctAnswers + (choice.isCorrect ? 1 : 0) >= 3 ? 3 : 0;
      setCoins(totalCoins);
    }
  };

  const handleTryAgain = () => {
    setCurrentScenario(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCorrectAnswers(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/puzzle-respect-match1");
  };

  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Class Chat Story"
      subtitle="Online Respect"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="dcos-kids-83"
      gameType="educational"
      totalLevels={100}
      currentLevel={83}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{choice.emoji}</div>
                    <div className="text-white font-semibold">{choice.text}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins > 0 ? "Respect Kid Badge Unlocked!" : "Almost There!"}
            </h2>
            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Amazing! You stopped cyberbullying and stood up for kindness in the chat.  
                    You earned the <strong>“Respect Kid”</strong> badge! 🏅
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold">
                  You earned 3 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Not bad! You need at least 3 correct responses to earn the badge.  
                    Try again and stand up for kindness online!
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

export default ClassChatStory;
