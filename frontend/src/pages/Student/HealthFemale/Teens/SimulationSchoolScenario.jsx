import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationSchoolScenario = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "You're in math class when you suddenly realize you've started your period and didn't bring supplies. What do you do?",
      options: [
        {
          id: "a",
          text: "Tell the teacher or ask a trusted friend for help",
          emoji: "👩‍🏫",
          description: "This is the best approach - teachers and friends can help you get what you need",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay silent and try to hide the situation",
          emoji: "🤫",
          description: "Hiding the situation can cause unnecessary stress and discomfort",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave class without telling anyone",
          emoji: "🚪",
          description: "Leaving without explanation can create confusion and missed learning",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend seems uncomfortable and keeps going to the nurse. You suspect she might have period cramps. How do you help?",
      options: [
        {
          id: "a",
          text: "Offer quiet support and suggest she talk to the nurse or counselor",
          emoji: "🤗",
          description: "Supportive, discreet help shows care while respecting privacy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell other classmates about your suspicions",
          emoji: "🗣️",
          description: "Sharing private health concerns violates trust and can cause embarrassment",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it completely and mind your own business",
          emoji: "😶",
          description: "While respecting privacy is important, offering support to a struggling friend is caring",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During PE class, you're asked to run, but you're experiencing severe cramps. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Talk to the PE teacher about modifying activities",
          emoji: "🏃",
          description: "Communicating with teachers about health needs ensures appropriate accommodations",
          isCorrect: true
        },
        {
          id: "b",
          text: "Push through the pain to keep up with classmates",
          emoji: "💪",
          description: "Ignoring severe pain can worsen health issues and isn't necessary",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip PE without explanation",
          emoji: "❌",
          description: "Skipping class without communication creates attendance issues and missed opportunities",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A classmate makes an embarrassing comment about periods. How do you respond?",
      options: [
        {
      id: "a",
      text: "Politely educate them about period normalization",
      emoji: "📚",
      description: "Calm, factual education helps reduce stigma and misinformation",
      isCorrect: true
    },
    {
      id: "b",
      text: "Laugh along to fit in with the group",
      emoji: "😂",
      description: "Reinforcing stigma doesn't help create a supportive environment",
      isCorrect: false
    },
    {
      id: "c",
      text: "Get angry and confront them aggressively",
      emoji: "😠",
      description: "Anger, while understandable, is less effective than educational responses",
      isCorrect: false
    }
  ]
},
{
  id: 5,
  text: "You need to go to the nurse for period supplies, but you're worried about being judged. What should you do?",
  options: [
    {
      id: "a",
      text: "Remember that nurses are professionals who help with these needs regularly",
      emoji: "👩‍⚕️",
      description: "Health professionals are trained to handle these situations with discretion and care",
      isCorrect: true
    },
    {
      id: "b",
      text: "Avoid asking and deal with discomfort instead",
      emoji: "😣",
      description: "Unnecessary suffering isn't required - help is available and appropriate",
      isCorrect: false
    },
    {
      id: "c",
      text: "Ask a friend to get supplies for you to avoid direct contact",
      emoji: "🤝",
      description: "While well-intentioned, this creates unnecessary complications and embarrassment",
      isCorrect: false
    }
  ]
}
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentScenario().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-health-choice");
  };

  return (
    <GameShell
      title="Simulation: School Scenario"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-38"
      gameType="health-female"
      totalLevels={40}
      currentLevel={38}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {getCurrentScenario().text}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentScenario().options.map((option) => (
              <div
                key={option.id}
                onClick={() => !choices.find(c => c.scenario === currentScenario) && handleChoice(option.id)}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  choices.find(c => c.scenario === currentScenario)?.optionId === option.id
                    ? option.isCorrect
                      ? "border-green-400 bg-green-500/20"
                      : "border-red-400 bg-red-500/20"
                    : "border-white/30 hover:border-purple-400"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-white font-medium">{option.text}</span>
                </div>
                
                {choices.find(c => c.scenario === currentScenario)?.optionId === option.id && (
                  <div className={`mt-3 p-2 rounded-lg text-sm ${
                    option.isCorrect ? "bg-green-500/30 text-green-200" : "bg-red-500/30 text-red-200"
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default SimulationSchoolScenario;