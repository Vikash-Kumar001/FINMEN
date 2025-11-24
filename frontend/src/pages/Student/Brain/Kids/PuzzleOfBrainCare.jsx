import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Zap, Moon, Book, Dumbbell, Apple, Coffee, Gamepad } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const PuzzleOfBrainCare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-4";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const concepts = [
    { id: 1, name: 'Sleep', icon: <Moon className="w-6 h-6" />, color: 'bg-blue-500' },
    { id: 2, name: 'Reading', icon: <Book className="w-6 h-6" />, color: 'bg-green-500' },
    { id: 3, name: 'Exercise', icon: <Dumbbell className="w-6 h-6" />, color: 'bg-red-500' },
    { id: 4, name: 'Healthy Food', icon: <Apple className="w-6 h-6" />, color: 'bg-yellow-500' },
    { id: 5, name: 'Junk Food', icon: <Coffee className="w-6 h-6" />, color: 'bg-gray-500' },
    { id: 6, name: 'Video Games', icon: <Gamepad className="w-6 h-6" />, color: 'bg-purple-500' }
  ];

  const benefits = [
    { id: 1, conceptId: 1, benefit: 'Rest', description: 'Sleep helps your brain recover and form memories' },
    { id: 2, conceptId: 2, benefit: 'Sharp Mind', description: 'Reading improves vocabulary and thinking skills' },
    { id: 3, conceptId: 3, benefit: 'Strong Brain', description: 'Exercise increases blood flow to the brain' },
    { id: 4, conceptId: 4, benefit: 'Smart Fuel', description: 'Healthy food provides nutrients for brain function' },
    { id: 5, conceptId: 5, benefit: 'Brain Fog', description: 'Junk food can make it hard to think clearly' },
    { id: 6, conceptId: 6, benefit: 'Fun Break', description: 'Some games can be good, but too much is harmful' }
  ];

  const correctPairs = [
    { conceptId: 1, benefitId: 1 },
    { conceptId: 2, benefitId: 2 },
    { conceptId: 3, benefitId: 3 },
    { conceptId: 4, benefitId: 4 },
    { conceptId: 5, benefitId: 5 },
    { conceptId: 6, benefitId: 6 }
  ];

  const handleConceptSelect = (concept) => {
    if (matchedPairs.some(pair => pair.conceptId === concept.id)) return;
    setSelectedConcept(concept);
  };

  const handleBenefitSelect = (benefit) => {
    if (matchedPairs.some(pair => pair.benefitId === benefit.id)) return;
    
    if (selectedConcept) {
      const isCorrect = correctPairs.some(pair => 
        pair.conceptId === selectedConcept.id && pair.benefitId === benefit.id
      );
      
      if (isCorrect) {
        const newMatch = { conceptId: selectedConcept.id, benefitId: benefit.id };
        setMatchedPairs([...matchedPairs, newMatch]);
        setFeedbackType("correct");
        setFeedbackMessage('Correct match!');
        setShowFeedback(true);
        setScore(score + 8.33); // 8.33 coins per correct match (max 50 coins for 6 matches)
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === concepts.length) {
          setTimeout(() => {
            setLevelCompleted(true);
          }, 1500);
        }
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage('Try again!');
        setShowFeedback(true);
      }
      
      // Hide feedback after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
      
      setSelectedConcept(null);
      setSelectedBenefit(null);
    } else {
      setSelectedBenefit(benefit);
    }
  };

  const isConceptMatched = (conceptId) => {
    return matchedPairs.some(pair => pair.conceptId === conceptId);
  };

  const isBenefitMatched = (benefitId) => {
    return matchedPairs.some(pair => pair.benefitId === benefitId);
  };

  const calculateScore = () => {
    return matchedPairs.length * 8.33;
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Brain Care Puzzle"
      score={Math.round(calculateScore())}
      currentLevel={matchedPairs.length + 1}
      totalLevels={concepts.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-4"
      gameType="brain"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={concepts.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Brain Care Puzzle</h3>
        <p className="text-white/80 mb-6 text-center">Match each brain care activity with its benefit</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Concepts column */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white text-center">Brain Care Activities</h4>
            <div className="space-y-3">
              {concepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => handleConceptSelect(concept)}
                  disabled={isConceptMatched(concept.id)}
                  className={`w-full flex items-center p-4 rounded-xl transition duration-200 border-2 ${
                    selectedConcept?.id === concept.id
                      ? 'bg-white/20 border-white'
                      : isConceptMatched(concept.id)
                      ? 'bg-green-500/20 border-green-400 opacity-70'
                      : 'bg-white/10 hover:bg-white/20 border-white/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${concept.color}`}>
                    {concept.icon}
                  </div>
                  <span className="font-medium text-white">{concept.name}</span>
                  {isConceptMatched(concept.id) && (
                    <span className="ml-auto text-green-400 text-xl">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Benefits column */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white text-center">Benefits</h4>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <button
                  key={benefit.id}
                  onClick={() => handleBenefitSelect(benefit)}
                  disabled={isBenefitMatched(benefit.id)}
                  className={`w-full text-left p-4 rounded-xl transition duration-200 border-2 ${
                    selectedBenefit?.id === benefit.id
                      ? 'bg-white/20 border-white'
                      : isBenefitMatched(benefit.id)
                      ? 'bg-green-500/20 border-green-400 opacity-70'
                      : 'bg-white/10 hover:bg-white/20 border-white/30'
                  }`}
                >
                  <div className="font-medium text-white">{benefit.benefit}</div>
                  <div className="text-sm text-white/70 mt-1">{benefit.description}</div>
                  {isBenefitMatched(benefit.id) && (
                    <span className="text-green-400 text-xl">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {showFeedback && (
          <FeedbackBubble 
            message={feedbackMessage}
            type={feedbackType}
          />
        )}
        
        <div className="flex justify-between items-center text-white">
          <span>
            Matches: {matchedPairs.length}/{concepts.length}
          </span>
          <span className="font-bold text-yellow-300">
            Score: {Math.round(calculateScore())}/50
          </span>
        </div>
      </GameCard>
    </GameShell>
  );
};

export default PuzzleOfBrainCare;