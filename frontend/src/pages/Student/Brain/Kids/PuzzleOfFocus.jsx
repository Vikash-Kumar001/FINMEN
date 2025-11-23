import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { Zap, VolumeX, Brain, Coffee, Ear, Book } from 'lucide-react';

const PuzzleOfFocus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentPair, setCurrentPair] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const concepts = [
    { id: 1, name: 'Meditation', icon: <Brain className="w-6 h-6" />, color: 'bg-purple-500/20' },
    { id: 2, name: 'Noise', icon: <VolumeX className="w-6 h-6" />, color: 'bg-red-500/20' },
    { id: 3, name: 'Quiet Room', icon: <Book className="w-6 h-6" />, color: 'bg-green-500/20' },
    { id: 4, name: 'Listening', icon: <Ear className="w-6 h-6" />, color: 'bg-blue-500/20' },
    { id: 5, name: 'Distractions', icon: <Coffee className="w-6 h-6" />, color: 'bg-yellow-500/20' },
    { id: 6, name: 'Concentration', icon: <Zap className="w-6 h-6" />, color: 'bg-indigo-500/20' }
  ];

  const benefits = [
    { id: 1, conceptId: 1, benefit: 'Calm', description: 'Meditation helps create a calm, focused mind' },
    { id: 2, conceptId: 2, benefit: 'Distract', description: 'Noise can break your concentration' },
    { id: 3, conceptId: 3, benefit: 'Focus', description: 'A quiet environment helps you concentrate' },
    { id: 4, conceptId: 4, benefit: 'Learn', description: 'Good listening skills improve learning' },
    { id: 5, conceptId: 5, benefit: 'Scatter', description: 'Distractions make it hard to focus' },
    { id: 6, conceptId: 6, benefit: 'Sharp Mind', description: 'Concentration leads to better thinking' }
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
    if (matchedPairs.some(pair => pair.conceptId === concept.id) || levelCompleted) return;
    setSelectedConcept(concept);
  };

  const handleBenefitSelect = (benefit) => {
    if (matchedPairs.some(pair => pair.benefitId === benefit.id) || levelCompleted) return;
    
    if (selectedConcept) {
      const isCorrect = correctPairs.some(pair => 
        pair.conceptId === selectedConcept.id && pair.benefitId === benefit.id
      );
      
      if (isCorrect) {
        const newMatchedPairs = [...matchedPairs, { conceptId: selectedConcept.id, benefitId: benefit.id }];
        setMatchedPairs(newMatchedPairs);
        setScore(score + 2.5); // 2.5 coins per correct match (max 15 coins for 6 matches)
        
        // Check if all pairs are matched
        if (newMatchedPairs.length === concepts.length) {
          setTimeout(() => {
            setLevelCompleted(true);
          }, 1500);
        }
      }
      
      setSelectedConcept(null);
      setSelectedBenefit(null);
    } else {
      setSelectedBenefit(benefit);
    }
  };

  const handleNext = () => {
    navigate('/games/brain-health/kids');
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  const isConceptMatched = (conceptId) => {
    return matchedPairs.some(pair => pair.conceptId === conceptId);
  };

  const isBenefitMatched = (benefitId) => {
    return matchedPairs.some(pair => pair.benefitId === benefitId);
  };

  // Calculate total coins (max 15 coins for 6 matches)
  const calculateTotalCoins = () => {
    return matchedPairs.length * 2.5;
  };

  return (
    <GameShell
      title="Focus Puzzle"
      score={Math.round(score)}
      currentLevel={matchedPairs.length + 1}
      totalLevels={concepts.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-14"
      gameType="brain-health"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={levelCompleted}
      nextLabel="Complete"
      backPath="/games/brain-health/kids"
    
      maxScore={concepts.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Focus Puzzle</h3>
        <p className="text-white/80 mb-8 text-center">Match each focus-related concept with its effect</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Concepts column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white/90 text-center">Focus Concepts</h4>
            <div className="space-y-3">
              {concepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => handleConceptSelect(concept)}
                  disabled={isConceptMatched(concept.id) || levelCompleted}
                  className={`w-full flex items-center p-4 rounded-lg transition duration-200 border ${
                    selectedConcept?.id === concept.id
                      ? 'bg-blue-500/30 border-blue-400'
                      : isConceptMatched(concept.id)
                      ? 'bg-green-500/30 border-green-400 opacity-70'
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${concept.color}`}>
                    {concept.icon}
                  </div>
                  <span className="font-medium text-white">{concept.name}</span>
                  {isConceptMatched(concept.id) && (
                    <span className="ml-auto text-green-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Benefits column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white/90 text-center">Effects</h4>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <button
                  key={benefit.id}
                  onClick={() => handleBenefitSelect(benefit)}
                  disabled={isBenefitMatched(benefit.id) || levelCompleted}
                  className={`w-full text-left p-4 rounded-lg transition duration-200 border ${
                    selectedBenefit?.id === benefit.id
                      ? 'bg-blue-500/30 border-blue-400'
                      : isBenefitMatched(benefit.id)
                      ? 'bg-green-500/30 border-green-400 opacity-70'
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  }`}
                >
                  <div className="font-medium text-white">{benefit.benefit}</div>
                  <div className="text-sm text-white/70 mt-1">{benefit.description}</div>
                  {isBenefitMatched(benefit.id) && (
                    <span className="text-green-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/70">
            Matches: {matchedPairs.length}/{concepts.length}
          </span>
          <span className="font-medium text-white">
            Score: {Math.round(score)}/15
          </span>
        </div>
      </GameCard>
    </GameShell>
  );
};

export default PuzzleOfFocus;