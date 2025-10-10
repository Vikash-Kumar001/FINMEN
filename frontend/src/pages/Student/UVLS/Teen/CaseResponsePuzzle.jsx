import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CaseResponsePuzzle = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const caseStudy = {
    title: "Alex's Story",
    background: "Alex is a talented student who recently lost a parent. They've been withdrawn, missing assignments, and avoiding friends.",
    steps: [
      {
        id: 1,
        situation: "You notice Alex sitting alone at lunch, looking at their phone, avoiding eye contact.",
        question: "What's the best first response?",
        options: [
          { id: 1, text: "Hey Alex, mind if I sit here? No pressure to talk.", isAppropriate: true },
          { id: 2, text: "Why are you always so sad? Cheer up!", isAppropriate: false },
          { id: 3, text: "Are you okay? You seem weird lately.", isAppropriate: false }
        ]
      },
      {
        id: 2,
        situation: "Alex opens up a bit: 'Things have been really hard at home.'",
        question: "How do you respond?",
        options: [
          { id: 1, text: "I can't imagine how difficult this is for you. I'm here to listen.", isAppropriate: true },
          { id: 2, text: "At least you still have one parent.", isAppropriate: false },
          { id: 3, text: "Oh, that's tough. Want to talk about something else?", isAppropriate: false }
        ]
      },
      {
        id: 3,
        situation: "Alex mentions they're falling behind in classes and feeling overwhelmed.",
        question: "What's helpful to say?",
        options: [
          { id: 1, text: "Would you like me to help you catch up, or find resources together?", isAppropriate: true },
          { id: 2, text: "You just need to try harder.", isAppropriate: false },
          { id: 3, text: "Everyone has problems, you're not special.", isAppropriate: false }
        ]
      },
      {
        id: 4,
        situation: "Alex says: 'I don't think anyone understands what I'm going through.'",
        question: "What validates their feelings?",
        options: [
          { id: 1, text: "I may not fully understand, but I want to support you. You're not alone.", isAppropriate: true },
          { id: 2, text: "I totally understand because I went through something similar.", isAppropriate: false },
          { id: 3, text: "You're right, no one can understand.", isAppropriate: false }
        ]
      },
      {
        id: 5,
        situation: "Alex seems hesitant about seeking professional help.",
        question: "How do you encourage them?",
        options: [
          { id: 1, text: "Talking to a counselor could really help. Would you like me to go with you?", isAppropriate: true },
          { id: 2, text: "You're not crazy, you don't need therapy.", isAppropriate: false },
          { id: 3, text: "Just deal with it on your own.", isAppropriate: false }
        ]
      },
      {
        id: 6,
        situation: "Alex thanks you for being there but says they need space sometimes.",
        question: "What respects their boundary?",
        options: [
          { id: 1, text: "I understand. I'm here whenever you need me, no pressure.", isAppropriate: true },
          { id: 2, text: "Fine, I was just trying to help.", isAppropriate: false },
          { id: 3, text: "You shouldn't push friends away.", isAppropriate: false }
        ]
      },
      {
        id: 7,
        situation: "You notice Alex returning to some normal activities but still seems fragile.",
        question: "How do you support their progress?",
        options: [
          { id: 1, text: "I've noticed you're doing some things you enjoy again. That's great to see.", isAppropriate: true },
          { id: 2, text: "So you're all better now?", isAppropriate: false },
          { id: 3, text: "See? I told you it would get better.", isAppropriate: false }
        ]
      },
      {
        id: 8,
        situation: "Other students ask you about Alex's situation.",
        question: "How do you respond?",
        options: [
          { id: 1, text: "That's Alex's private business. Maybe ask them yourself if you care.", isAppropriate: true },
          { id: 2, text: "Tell them all the details Alex shared with you", isAppropriate: false },
          { id: 3, text: "Yeah, Alex has been acting really weird.", isAppropriate: false }
        ]
      },
      {
        id: 9,
        situation: "Alex has a bad day and snaps at you unfairly.",
        question: "What's the empathetic response?",
        options: [
          { id: 1, text: "I can see you're having a hard time. I'm not upset, take care of yourself.", isAppropriate: true },
          { id: 2, text: "Wow, I was just trying to help. Forget it.", isAppropriate: false },
          { id: 3, text: "You're so ungrateful after all I've done.", isAppropriate: false }
        ]
      }
    ]
  };

  const handleResponseSelect = (optionId) => {
    const step = caseStudy.steps[currentStep];
    const option = step.options.find(opt => opt.id === optionId);
    
    const newResponses = [...responses, {
      stepId: step.id,
      optionId,
      isAppropriate: option.isAppropriate
    }];
    
    setResponses(newResponses);
    
    if (option.isAppropriate) {
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentStep < caseStudy.steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, option.isAppropriate ? 1000 : 800);
    } else {
      const appropriateCount = newResponses.filter(r => r.isAppropriate).length;
      const percentage = (appropriateCount / caseStudy.steps.length) * 100;
      if (percentage >= 80) {
        setCoins(3); // +3 Coins for appropriate responses (minimum for progress)
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/spot-distress-reflex");
  };

  const appropriateCount = responses.filter(r => r.isAppropriate).length;
  const percentage = Math.round((appropriateCount / caseStudy.steps.length) * 100);

  return (
    <GameShell
      title="Case-Response Puzzle"
      subtitle={`Step ${currentStep + 1} of ${caseStudy.steps.length}`}
      onNext={handleNext}
      nextEnabled={showResult && percentage >= 80}
      showGameOver={showResult && percentage >= 80}
      score={coins}
      gameId="uvls-teen-8"
      gameType="uvls"
      totalLevels={20}
      currentLevel={8}
      showConfetti={showResult && percentage >= 80}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {currentStep === 0 && responses.length === 0 && (
          <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-6 mb-4 border-2 border-purple-400/50">
            <h3 className="text-white text-xl font-bold mb-2">{caseStudy.title}</h3>
            <p className="text-white/90">{caseStudy.background}</p>
          </div>
        )}
        
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Step {currentStep + 1}/{caseStudy.steps.length}</span>
                <span className="text-green-400 font-bold">Appropriate: {appropriateCount}</span>
              </div>
              
              <p className="text-white text-lg mb-6 font-semibold">
                {caseStudy.steps[currentStep].situation}
              </p>
              
              <p className="text-white/90 mb-4 text-center">
                {caseStudy.steps[currentStep].question}
              </p>
              
              <div className="space-y-3">
                {caseStudy.steps[currentStep].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleResponseSelect(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {percentage >= 80 ? "🎉 Empathetic Responses!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You gave {appropriateCount} out of {caseStudy.steps.length} appropriate responses ({percentage}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {percentage >= 80 ? "You earned 3 Coins! 🪙" : "Get 80% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Discuss alternative acceptable responses and why empathy matters in supporting peers.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CaseResponsePuzzle;

