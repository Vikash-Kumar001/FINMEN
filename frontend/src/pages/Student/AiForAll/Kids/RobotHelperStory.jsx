import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotHelperStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 sequential questions
  const stories = [
    {
      title: "Robot Helps Clean",
      emoji: "🤖",
      situation: "A robot helper just finished cleaning your room. What should you do?",
      choices: [
        { id: 1, text: "Thank the robot", emoji: "🙏", isCorrect: true },
        { id: 2, text: "Ignore it - it's just a machine", emoji: "😐", isCorrect: false },
        { id: 3, text: "Turn it off without saying anything", emoji: "⏻", isCorrect: false },
        { id: 4, text: "Complain it missed a corner", emoji: "😒", isCorrect: false },
        { id: 5, text: "Laugh and leave the mess again", emoji: "😂", isCorrect: false }
      ],
      correctMsg:
        "Perfect! Even though robots are machines, it's good to be polite and thankful. Showing appreciation teaches kindness.",
      wrongMsg:
        "Even though it's a robot, being kind to AI helpers teaches good manners and empathy!"
    },
    {
      title: "AI Homework Buddy",
      emoji: "🧠",
      situation: "An AI tool helped you solve your math homework quickly. What should you do?",
      choices: [
        { id: 1, text: "Say thank you and review the steps", emoji: "🙏", isCorrect: true },
        { id: 2, text: "Copy the answers blindly", emoji: "📋", isCorrect: false },
        { id: 3, text: "Tell friends it’s useless", emoji: "🙄", isCorrect: false },
        { id: 4, text: "Forget to check the work", emoji: "😶", isCorrect: false },
        { id: 5, text: "Ignore what it explained", emoji: "🚫", isCorrect: false }
      ],
      correctMsg:
        "Nice! Learning with AI responsibly helps you understand, not just finish homework fast.",
      wrongMsg:
        "Try again! Use AI as a helper, not a shortcut — reviewing what it teaches makes you smarter!"
    },
    {
      title: "AI Music Friend",
      emoji: "🎵",
      situation: "An AI created a new melody just for you. What’s the best response?",
      choices: [
        { id: 1, text: "Appreciate its creativity", emoji: "🎧", isCorrect: true },
        { id: 2, text: "Delete it right away", emoji: "🗑️", isCorrect: false },
        { id: 3, text: "Complain it's not perfect", emoji: "😤", isCorrect: false },
        { id: 4, text: "Ignore and play another song", emoji: "😐", isCorrect: false },
        { id: 5, text: "Blame it for being boring", emoji: "🙃", isCorrect: false }
      ],
      correctMsg:
        "Exactly! Appreciating AI’s creative work encourages curiosity and imagination!",
      wrongMsg:
        "Oops! AI can be creative too — it learns from art and music like humans do."
    },
    {
      title: "AI Safety Alert",
      emoji: "🚨",
      situation: "An AI warns you about a fake link online. What should you do?",
      choices: [
        { id: 1, text: "Avoid the link immediately", emoji: "🛑", isCorrect: true },
        { id: 2, text: "Click it to check", emoji: "🖱️", isCorrect: false },
        { id: 3, text: "Share it with friends", emoji: "📤", isCorrect: false },
        { id: 4, text: "Ignore the AI warning", emoji: "🙈", isCorrect: false },
        { id: 5, text: "Download from it anyway", emoji: "⬇️", isCorrect: false }
      ],
      correctMsg:
        "Smart move! AI safety alerts protect you from scams — always trust warnings.",
      wrongMsg:
        "Try again! AI safety systems help you avoid dangerous or fake websites."
    },
    {
      title: "Robot Chef",
      emoji: "👨‍🍳",
      situation: "A robot chef cooks you a perfect sandwich. What should you do?",
      choices: [
        { id: 1, text: "Say thank you to the robot", emoji: "😊", isCorrect: true },
        { id: 2, text: "Throw it away", emoji: "🚮", isCorrect: false },
        { id: 3, text: "Complain about taste", emoji: "😤", isCorrect: false },
        { id: 4, text: "Ignore the robot", emoji: "😐", isCorrect: false },
        { id: 5, text: "Break the machine for fun", emoji: "💥", isCorrect: false }
      ],
      correctMsg:
        "Awesome! Showing gratitude, even to AI, builds empathy and respect.",
      wrongMsg:
        "No worries! Remember, gratitude makes every helper — human or AI — valued."
    }
  ];

  const currentStory = stories[currentQuestion];
  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  const handleChoice = (id) => {
    setSelectedChoice(id);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins(prev => prev + 5);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      // All 5 done → navigate next
      navigate("/student/ai-for-all/kids/spam-vs-not-spam");
    }
  };

  return (
    <GameShell
      title="Robot Helper Story"
      subtitle="AI as Our Helper"
      score={totalCoins}
      gameId="ai-kids-8"
      gameType="ai"
      totalLevels={100}
      currentLevel={8}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
      nextEnabled={false}
    >
      <div className="space-y-8">
        {!showFeedback ? ( 
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStory.title}
            </h2>
            <p className="text-white text-lg text-center mb-6">{currentStory.situation}</p>

            <div className="space-y-3">
              {currentStory.choices.map(choice => (
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
                    <span className="text-3xl">{choice.emoji}</span>
                    <span className="text-white text-lg font-semibold">{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
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
              {selectedChoiceData.isCorrect ? "🌟 Great Choice!" : "🤔 Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center italic">
              {selectedChoiceData.text}
            </p>
            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">
                {selectedChoiceData.isCorrect
                  ? currentStory.correctMsg
                  : currentStory.wrongMsg}
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
              {selectedChoiceData.isCorrect ? "+5 Coins 🪙" : ""}
            </p>
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < stories.length - 1 ? "Next Question →" : "Finish Game 🎉"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotHelperStory;
