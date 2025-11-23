import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchCountries = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledCountries, setShuffledCountries] = useState([]);
  const [shuffledFoods, setShuffledFoods] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      country: "Japan",
      flag: "🇯🇵",
      food: "Sushi",
      foodEmoji: "🍣",
      description: "Sushi is a traditional Japanese dish made with vinegared rice and various ingredients."
    },
    {
      id: 2,
      country: "USA",
      flag: "🇺🇸",
      food: "Burger",
      foodEmoji: "🍔",
      description: "The hamburger is a popular American dish consisting of a ground meat patty in a bun."
    },
    {
      id: 3,
      country: "Italy",
      flag: "🇮🇹",
      food: "Pizza",
      foodEmoji: "🍕",
      description: "Pizza originated in Italy and is now enjoyed worldwide with various toppings."
    },
    {
      id: 4,
      country: "Mexico",
      flag: "🇲🇽",
      food: "Tacos",
      foodEmoji: "🌮",
      description: "Tacos are a traditional Mexican dish consisting of folded tortillas with various fillings."
    },
    {
      id: 5,
      country: "India",
      flag: "🇮🇳",
      food: "Biryani",
      foodEmoji: "🍛",
      description: "Biryani is a flavorful rice dish with spices and meat or vegetables, popular in India."
    }
  ];

  // Shuffle arrays for random positioning
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setShuffledCountries(shuffleArray(puzzles));
    setShuffledFoods(shuffleArray(puzzles));
  }, []);

  const handleCountrySelect = (country) => {
    if (matchedPairs.some(pair => pair.countryId === country.id)) return;
    
    if (selectedFood) {
      // Check if it's a correct match
      if (selectedFood.id === country.id) {
        const newPair = { countryId: country.id, foodId: selectedFood.id };
        setMatchedPairs(prev => [...prev, newPair]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === puzzles.length) {
          setTimeout(() => {
            setGameFinished(true);
            showAnswerConfetti();
          }, 1000);
        }
      }
      
      // Reset selections
      setSelectedCountry(null);
      setSelectedFood(null);
    } else {
      setSelectedCountry(country);
    }
  };

  const handleFoodSelect = (food) => {
    if (matchedPairs.some(pair => pair.foodId === food.id)) return;
    
    if (selectedCountry) {
      // Check if it's a correct match
      if (selectedCountry.id === food.id) {
        const newPair = { countryId: selectedCountry.id, foodId: food.id };
        setMatchedPairs(prev => [...prev, newPair]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === puzzles.length) {
          setTimeout(() => {
            setGameFinished(true);
            showAnswerConfetti();
          }, 1000);
        }
      }
      
      // Reset selections
      setSelectedCountry(null);
      setSelectedFood(null);
    } else {
      setSelectedFood(food);
    }
  };

  const isCountryMatched = (countryId) => {
    return matchedPairs.some(pair => pair.countryId === countryId);
  };

  const isFoodMatched = (foodId) => {
    return matchedPairs.some(pair => pair.foodId === foodId);
  };

  const isCountrySelected = (country) => {
    return selectedCountry && selectedCountry.id === country.id;
  };

  const isFoodSelected = (food) => {
    return selectedFood && selectedFood.id === food.id;
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  if (gameFinished) {
    return (
      <GameShell
        title="Puzzle: Match Countries"
        subtitle="Puzzle Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-kids-84"
        gameType="civic-responsibility"
        totalLevels={90}
        currentLevel={84}
        showConfetti={true}
        flashPoints={flashPoints}
        backPath="/games/civic-responsibility/kids"
      
      maxScore={90} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Great Job!</h2>
          <p className="text-white mb-6">
            You matched all {puzzles.length} country-food pairs!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're a geography expert!
          </div>
          <p className="text-white/80">
            Remember: Every country has its own unique culinary traditions that reflect its culture!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Puzzle: Match Countries"
      subtitle={`Match countries with their traditional foods | Score: ${coins}/${puzzles.length}`}
      backPath="/games/civic-responsibility/kids"
      flashPoints={flashPoints}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Countries column */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Countries</h3>
              <div className="space-y-4">
                {shuffledCountries.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => handleCountrySelect(country)}
                    disabled={isCountryMatched(country.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all transform ${
                      isCountryMatched(country.id)
                        ? "bg-green-500/30 border-2 border-green-500"
                        : isCountrySelected(country)
                        ? "bg-blue-500/30 border-2 border-blue-500 scale-95"
                        : "bg-white/10 hover:bg-white/20 border-2 border-transparent hover:scale-105"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{country.flag}</div>
                      <div>
                        <h4 className="font-bold text-lg text-white">{country.country}</h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Foods column */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Traditional Foods</h3>
              <div className="space-y-4">
                {shuffledFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleFoodSelect(food)}
                    disabled={isFoodMatched(food.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all transform ${
                      isFoodMatched(food.id)
                        ? "bg-green-500/30 border-2 border-green-500"
                        : isFoodSelected(food)
                        ? "bg-blue-500/30 border-2 border-blue-500 scale-95"
                        : "bg-white/10 hover:bg-white/20 border-2 border-transparent hover:scale-105"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{food.foodEmoji}</div>
                      <div>
                        <h4 className="font-bold text-lg text-white">{food.food}</h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Show description when a pair is matched */}
          {matchedPairs.length > 0 && (
            <div className="mt-8 p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <h4 className="font-bold text-blue-300 mb-2">Cultural Insight:</h4>
              <p className="text-white/90">
                {puzzles.find(p => p.id === matchedPairs[matchedPairs.length - 1].countryId)?.description}
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Match each country with its traditional food!
            </p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchCountries;