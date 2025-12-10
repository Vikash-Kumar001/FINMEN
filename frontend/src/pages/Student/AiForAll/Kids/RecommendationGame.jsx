import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RecommendationGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-20");
  const gameId = gameData?.id || "ai-kids-20";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedPreference, setSelectedPreference] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 questions (categories) with logically arranged correct answer positions
  // Pattern: Correct answer positions follow 1-2-3-1-2 sequence for logical progression
  const questions = [
    {
      id: 1,
      text: "What do you like watching?",
      options: [
        { 
          id: "cartoons", 
          text: "Cartoons ", 
          emoji: "📺", 
          description: "Fun animated shows",
          recommendations: ["🎬 Cartoon Movie", "🎨 Drawing Show", "🦸 Superhero Cartoon"],
          isCorrect: true // Position 1
        },
        { 
          id: "sports", 
          text: "Sports ", 
          emoji: "⚽", 
          description: "Exciting games and matches",
          recommendations: ["🏀 Basketball Game", "⚽ Soccer Match", "🏊 Swimming Competition"],
          isCorrect: false
        },
        { 
          id: "animals", 
          text: "Animals ", 
          emoji: "🐾", 
          description: "Cute and wild creatures",
          recommendations: ["🐕 Dog Videos", "🐱 Cat Stories", "🦁 Wildlife Documentary"],
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do you like reading?",
      options: [
        { 
          id: "comics", 
          text: "Comics ", 
          emoji: "📚", 
          description: "Stories with pictures",
          recommendations: ["🦸 Superhero Comics", "😂 Funny Comics", "🎨 Art Books"],
          isCorrect: false
        },
        { 
          id: "science", 
          text: "Science ", 
          emoji: "🔬", 
          description: "Discover amazing facts",
          recommendations: ["🚀 Space Books", "🧬 Biology Stories", "⚡ Invention Facts"],
          isCorrect: true // Position 2
        },
        { 
          id: "adventure", 
          text: "Adventure ", 
          emoji: "🗺️", 
          description: "Exciting journeys",
          recommendations: ["🏔️ Travel Tales", "🏝️ Survival Stories", "🗡️ Fantasy Quests"],
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What games do you enjoy?",
      options: [
        { 
          id: "racing", 
          text: "Racing ", 
          emoji: "🏎️", 
          description: "Fast speed games",
          recommendations: ["🚗 Car Racer", "🏍️ Bike Rush", "🛞 Drift Game"],
          isCorrect: false
        },
        { 
          id: "puzzle", 
          text: "Puzzle ", 
          emoji: "🧩", 
          description: "Brain challenging games",
          recommendations: ["🧠 Brain Test", "🔢 Math Challenge", "🎨 Pattern Solver"],
          isCorrect: false
        },
        { 
          id: "shooting", 
          text: "Shooting ", 
          emoji: "🎯", 
          description: "Aim and shoot games",
          recommendations: ["🔫 Target Practice", "🪖 Battle Hero", "🛰️ Space Blaster"],
          isCorrect: true // Position 3
        }
      ]
    },
    {
      id: 4,
      text: "What music do you like?",
      options: [
        { 
          id: "pop", 
          text: "Pop ", 
          emoji: "🎤", 
          description: "Popular catchy songs",
          recommendations: ["🎶 Pop Hits", "🎧 Trending Songs", "💃 Dance Mix"],
          isCorrect: true // Position 1 (reset pattern)
        },
        { 
          id: "classical", 
          text: "Classical ", 
          emoji: "🎻", 
          description: "Beautiful orchestral music",
          recommendations: ["🎼 Calm Tunes", "🎹 Piano Melodies", "🎺 Orchestra Music"],
          isCorrect: false
        },
        { 
          id: "rock", 
          text: "Rock ", 
          emoji: "🎸", 
          description: "Energetic guitar music",
          recommendations: ["🤘 Rock Legends", "🎵 Guitar Jams", "🔥 Power Songs"],
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What do you like learning?",
      options: [
        { 
          id: "history", 
          text: "History ", 
          emoji: "🏺", 
          description: "Stories of the past",
          recommendations: ["🏰 Ancient Stories", "📜 Kings & Queens", "⚔️ Famous Battles"],
          isCorrect: false
        },
        { 
          id: "art", 
          text: "Art ", 
          emoji: "🎨", 
          description: "Creative expression",
          recommendations: ["🖌️ Drawing Tips", "🧵 Craft Tutorials", "🎭 Design Challenges"],
          isCorrect: true // Position 2 (continue pattern)
        },
        { 
          id: "coding", 
          text: "Coding ", 
          emoji: "💻", 
          description: "Programming skills",
          recommendations: ["🧠 AI Basics", "🌐 Web Projects", "🤖 Robot Coding"],
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    // Find the selected option
    const selectedOption = currentQ.options.find(opt => opt.id === selectedChoice);
    const isCorrect = selectedOption ? selectedOption.isCorrect : false;

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    // Add coins only for correct answers
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Store selected preference for recommendations display
    setSelectedPreference(selectedChoice);
    setShowRecommendations(true);
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedPreference(null);
        setShowRecommendations(false);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length + (isCorrect ? 1 : 0); // Add current selection if correct
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
        setShowRecommendations(false);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedPreference(null);
    setShowRecommendations(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/youtube-recommendation-game");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();
  const selectedOption = currentQuestionData?.options.find(opt => opt.id === selectedPreference);

  return (
    <GameShell
      title="Recommendation Game"
      subtitle={showResult ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId={gameId}
      gameType="ai"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult && !showRecommendations && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : showRecommendations && !showResult && currentQuestionData && selectedOption ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-8xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              AI Recommendations for You!
            </h2>
            <div className="bg-purple-500/30 rounded-xl p-4 mb-6 border border-purple-500/50">
              <p className="text-white/90 text-sm mb-3">
                You liked: {selectedOption.emoji} {selectedOption.text.replace(selectedOption.emoji, '').trim()}
              </p>
              <p className="text-white text-lg font-bold mb-4">AI suggests:</p>
              <div className="space-y-2">
                {selectedOption.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <p className="text-white font-bold">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/30 rounded-xl p-4 mb-4 border border-blue-500/50">
              <p className="text-white text-center">
                💡 AI platforms like YouTube, Netflix, and Spotify use your
                choices to recommend what you might enjoy next!
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
              <span>+1 Coin</span>
            </div>

            <button
              onClick={() => {
                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion(prev => prev + 1);
                  setSelectedPreference(null);
                  setShowRecommendations(false);
                } else {
                  // For the last question, we need to calculate the final score including current selection
                  const currentQ = questions[currentQuestion];
                  const selectedOption = currentQ?.options.find(opt => opt.id === selectedPreference);
                  const isCurrentCorrect = selectedOption ? selectedOption.isCorrect : false;
                  
                  // Calculate final score: previous correct answers + current selection if correct
                  const previousCorrect = choices.filter(choice => choice.isCorrect).length;
                  const finalScoreValue = previousCorrect + (isCurrentCorrect ? 1 : 0);
                  setFinalScore(finalScoreValue);
                  setShowResult(true);
                  setShowRecommendations(false);
                }
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-bold transition-all"
            >
              {currentQuestion === questions.length - 1
                ? "Finish Game ✅"
                : "Next Question →"}
            </button>
          </div>
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Recommendation Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how AI recommendations work!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 AI platforms like YouTube, Netflix, and Spotify use your choices to recommend what you might enjoy next!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Keep exploring to learn more about AI recommendations!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 AI platforms like YouTube, Netflix, and Spotify use your choices to recommend what you might enjoy next!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default RecommendationGame;