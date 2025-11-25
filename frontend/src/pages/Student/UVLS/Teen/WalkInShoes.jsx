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
  const [isProcessing, setIsProcessing] = useState(false);
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
    },
    {
      id: 4,
      scenario: "You're dealing with family financial struggles and can't afford school supplies. Others seem to have everything they need.",
      emoji: "💰",
      question: "How do you respond?",
      options: [
        { id: "share", text: "Ask the school counselor for resources (help-seeking)", isHelpful: true },
        { id: "shame", text: "Feel ashamed and try to hide your situation", isHelpful: false },
        { id: "steal", text: "Take supplies from others without asking", isHelpful: false },
        { id: "connect", text: "Connect with a teacher or counselor who can help (supportive)", isHelpful: true }
      ],
      outcome: {
        supportive: "You receive the help you need and feel supported! ✨",
        negative: "The stress continues to build and affects your studies... 😓"
      }
    },
    {
      id: 5,
      scenario: "You're experiencing mental health challenges and feel like you're the only one struggling. Others seem happy and carefree.",
      emoji: "🧠",
      question: "What action do you take?",
      options: [
        { id: "therapy", text: "Seek help from a school counselor or therapist (help-seeking)", isHelpful: true },
        { id: "isolate", text: "Withdraw and isolate yourself from everyone", isHelpful: false },
        { id: "deny", text: "Pretend everything is fine and ignore your feelings", isHelpful: false },
        { id: "trust", text: "Talk to a trusted adult or friend about your feelings (supportive)", isHelpful: true }
      ],
      outcome: {
        supportive: "You find support and start feeling better! 🌈",
        negative: "Your struggles continue to grow in silence... 💙"
      }
    }
  ];

  const handleChoice = (optionId) => {
    if (isProcessing || showResult) return; // Prevent double clicks
    
    setIsProcessing(true);
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
        setIsProcessing(false);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
        setIsProcessing(false);
      }, 1500);
    }
  };


  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const helpfulCount = choices.filter(c => c.isHelpful).length;
  // Score should be the number of correct answers for backend
  const finalScore = showResult ? helpfulCount : coins;

  return (
    <GameShell
      title="Walk in Their Shoes"
      subtitle={`Situation ${currentNode + 1} of ${decisionNodes.length}`}
      onNext={handleNext}
      nextEnabled={showResult && helpfulCount === 5}
      showGameOver={showResult}
      score={finalScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-4"
      gameType="uvls"
      totalLevels={5}
      maxScore={5}
      showConfetti={showResult && helpfulCount === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult && (
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
                    disabled={isProcessing || choices.length > currentNode}
                    className={`w-full backdrop-blur-sm border-2 rounded-xl p-4 transition-all transform text-left ${
                      isProcessing || choices.length > currentNode
                        ? 'bg-gray-500/20 border-gray-400/40 cursor-not-allowed opacity-50'
                        : 'bg-white/20 border-white/40 hover:bg-white/30 hover:scale-102'
                    }`}
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
        )}
      </div>
    </GameShell>
  );
};

export default WalkInShoes;

