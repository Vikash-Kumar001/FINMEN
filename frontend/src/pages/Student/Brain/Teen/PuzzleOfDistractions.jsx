import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { VolumeX, Coffee, Zap, Gamepad2, Phone, Book, Sun } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const PuzzleOfDistractions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-14";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const concepts = [
    { id: 1, name: 'Silent Room', icon: <VolumeX className="w-6 h-6" />, color: 'bg-blue-500' },
    { id: 2, name: 'Loud Music', icon: <Coffee className="w-6 h-6" />, color: 'bg-red-500' },
    { id: 3, name: 'Phone Notifications', icon: <Phone className="w-6 h-6" />, color: 'bg-purple-500' },
    { id: 4, name: 'Organized Desk', icon: <Book className="w-6 h-6" />, color: 'bg-green-500' },
    { id: 5, name: 'Natural Light', icon: <Sun className="w-6 h-6" />, color: 'bg-yellow-500' },
    { id: 6, name: 'Gaming During Study', icon: <Gamepad2 className="w-6 h-6" />, color: 'bg-indigo-500' }
  ];

  const benefits = [
    { id: 1, conceptId: 1, benefit: 'Focus', description: 'A quiet environment helps you concentrate and retain information' },
    { id: 2, conceptId: 2, benefit: 'Distraction', description: 'Loud music can break your concentration and reduce learning efficiency' },
    { id: 3, conceptId: 3, benefit: 'Interruption', description: 'Constant notifications fragment your attention and reduce productivity' },
    { id: 4, conceptId: 4, benefit: 'Clarity', description: 'An organized space reduces mental clutter and improves focus' },
    { id: 5, conceptId: 5, benefit: 'Alertness', description: 'Natural lighting boosts mood and maintains circadian rhythm for better focus' },
    { id: 6, conceptId: 6, benefit: 'Diversion', description: 'Playing games during study time reduces academic performance and focus' }
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
        setFeedbackMessage('Correct match! Great job identifying focus factors!');
        setShowFeedback(true);
        setScore(score + 1); // 1 coin per correct match
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === concepts.length) {
          setTimeout(() => {
            setLevelCompleted(true);
          }, 1500);
        }
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage('Not quite! Think about how each factor affects concentration.');
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
    return matchedPairs.length * 1; // 1 coin per correct match
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/teens');
  };

  // Calculate coins based on matched pairs (1 coin per pair)
  const calculateTotalCoins = () => {
    return matchedPairs.length * 1;
  };

  return (
    <GameShell
      title="Puzzle of Distractions"
      score={Math.round(calculateScore())}
      currentLevel={matchedPairs.length + 1}
      totalLevels={concepts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/teens"
    >
      {/* Removed LevelCompleteHandler */}
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Distractions Puzzle</h3>
        <p className="text-white/80 mb-6 text-center">Match each environment with its effect on focus</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Concepts column */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white text-center">Environments</h4>
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
            <h4 className="text-xl font-semibold mb-4 text-white text-center">Effects</h4>
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
            Score: {calculateScore()}/{concepts.length}
          </span>
        </div>
      </GameCard>
    </GameShell>
  );
};

export default PuzzleOfDistractions;