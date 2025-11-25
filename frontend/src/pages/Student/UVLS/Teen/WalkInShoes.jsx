import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WalkInShoes = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-4";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentNode, setCurrentNode] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const decisionNodes = [
    {
      id: 1,
      scenario: "You're a new student who speaks a different language. During lunch, you sit alone because you're not sure how to join others.",
      emoji: "🍱",
      question: "What do you do?",
      options: [
        { id: "ask", text: "Try to ask someone if you can join (supportive)", isHelpful: true },
        { id: "hide", text: "Hide in the library to avoid everyone", isHelpful: false },
        { id: "cry", text: "Just sit alone and feel sad", isHelpful: false },
        { id: "teacher", text: "Talk to a teacher about feeling lonely (help-seeking)", isHelpful: true }
      ],
      outcome: {
        supportive: "Someone notices your courage and invites you over! 😊",
        negative: "You continue feeling isolated and lonely... 😔"
      }
    },
    {
      id: 2,
      scenario: "You have a learning disability and the class is moving too fast. You're falling behind and feeling overwhelmed.",
      emoji: "📖",
      question: "How do you handle this?",
      options: [
        { id: "advocate", text: "Ask the teacher for help or accommodations (help-seeking)", isHelpful: true },
        { id: "quit", text: "Give up and stop trying", isHelpful: false },
        { id: "copy", text: "Copy someone else's work", isHelpful: false },
        { id: "peer", text: "Ask a supportive classmate to study together (supportive)", isHelpful: true }
      ],
      outcome: {
        supportive: "You get the support you need and start understanding! 📚",
        negative: "You fall further behind and feel more stressed... 😰"
      }
    },
    {
      id: 3,
      scenario: "You're being excluded from group activities because of your background. Others make comments that hurt.",
      emoji: "💔",
      question: "What's your choice?",
      options: [
        { id: "report", text: "Report the exclusion to a trusted adult (help-seeking)", isHelpful: true },
        { id: "accept", text: "Accept it and try to change who you are", isHelpful: false },
        { id: "anger", text: "React with anger and aggression", isHelpful: false },
        { id: "support", text: "Find supportive friends who accept you (supportive)", isHelpful: true }
      ],
      outcome: {
        supportive: "You find allies and the situation is addressed! 🤝",
        negative: "The exclusion continues and affects your wellbeing... 😞"
      }
    }
  ];

  const handleChoice = (optionId) => {
    const node = decisionNodes[currentNode];
    const option = node.options.find(opt => opt.id === optionId);
    
    const newChoices = [...choices, {
      nodeId: node.id,
      choice: optionId,
      isHelpful: option.isHelpful
    }];
    
    setChoices(newChoices);
    
    if (option.isHelpful) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentNode < decisionNodes.length - 1) {
      setTimeout(() => {
        setCurrentNode(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentNode(0);
    setChoices([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const helpfulCount = choices.filter(c => c.isHelpful).length;

  return (
    <GameShell
      title="Walk in Their Shoes"
      subtitle={`Situation ${currentNode + 1} of ${decisionNodes.length}`}
      onNext={handleNext}
      nextEnabled={showResult && helpfulCount >= 2}
      showGameOver={showResult && helpfulCount >= 2}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-4"
      gameType="uvls"
      totalLevels={20}
      currentLevel={4}
      showConfetti={showResult && helpfulCount >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
                <p className="text-yellow-200 text-xs font-semibold">
                  ⚠️ Content Warning: This simulation touches on sensitive topics
                </p>
              </div>
              
              <div className="text-6xl mb-4 text-center">{decisionNodes[currentNode].emoji}</div>
              
              <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
                <p className="text-white text-lg">
                  {decisionNodes[currentNode].scenario}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center font-semibold">
                {decisionNodes[currentNode].question}
              </p>
              
              <div className="space-y-3">
                {decisionNodes[currentNode].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{option.text}</div>
                  </button>
                ))}
              </div>
              
              {choices.length > 0 && (
                <div className={`mt-4 p-4 rounded-xl ${
                  choices[choices.length - 1].isHelpful
                    ? 'bg-green-500/30 border-2 border-green-400'
                    : 'bg-red-500/30 border-2 border-red-400'
                }`}>
                  <p className="text-white font-medium">
                    {choices[choices.length - 1].isHelpful 
                      ? decisionNodes[choices.length - 1].outcome.supportive
                      : decisionNodes[choices.length - 1].outcome.negative}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {helpfulCount >= 2 ? "🎉 Empathetic Choices!" : "💪 Try Different Choices!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made {helpfulCount} out of {decisionNodes.length} supportive choices!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                <strong>Reflection:</strong> How did it feel to experience these challenges? 
                What can we do to support others facing similar situations?
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {helpfulCount >= 2 ? "You earned 3 Coins! 🪙" : "Make 2 or more supportive choices to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Debrief with students about their experiences and feelings during the simulation.
            </p>
            {helpfulCount < 2 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WalkInShoes;

