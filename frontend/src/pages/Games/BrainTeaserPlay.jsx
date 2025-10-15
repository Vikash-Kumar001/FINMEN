import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Check,
    X,
    Trophy,
    Star,
    Sparkles,
    Brain,
    RotateCcw,
    Home
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function BrainTeaserPlay() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [lives, setLives] = useState(3);

    // Game configurations
    const games = {
        'memory-matrix': {
            title: 'Memory Matrix',
            icon: '🧩',
            color: 'from-purple-500 to-pink-500',
            type: 'memory',
            levels: 5
        },
        'logic-puzzle': {
            title: 'Logic Puzzle Master',
            icon: '🎯',
            color: 'from-blue-500 to-cyan-500',
            type: 'logic',
            levels: 5
        },
        'word-wizard': {
            title: 'Word Wizard',
            icon: '📝',
            color: 'from-green-500 to-emerald-500',
            type: 'word',
            levels: 5
        },
        'number-ninja': {
            title: 'Number Ninja',
            icon: '🔢',
            color: 'from-orange-500 to-red-500',
            type: 'math',
            levels: 5
        },
        'shape-shifter': {
            title: 'Shape Shifter',
            icon: '🔷',
            color: 'from-teal-500 to-cyan-500',
            type: 'shapes',
            levels: 5
        },
        'speed-think': {
            title: 'Speed Think',
            icon: '⚡',
            color: 'from-yellow-500 to-amber-500',
            type: 'speed',
            levels: 5
        },
        'pattern-pro': {
            title: 'Pattern Pro',
            icon: '🔮',
            color: 'from-indigo-500 to-purple-500',
            type: 'pattern',
            levels: 5
        },
        'attention-ace': {
            title: 'Attention Ace',
            icon: '👁️',
            color: 'from-pink-500 to-rose-500',
            type: 'attention',
            levels: 5
        }
    };

    const currentGame = games[gameId] || games['memory-matrix'];

    // Memory Matrix Game
    const [memoryPattern, setMemoryPattern] = useState([]);
    const [userPattern, setUserPattern] = useState([]);
    const [showPattern, setShowPattern] = useState(true);
    const [canClick, setCanClick] = useState(false);

    // Math Game
    const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
    const [mathAnswer, setMathAnswer] = useState('');

    // Word Game
    const [wordScramble, setWordScramble] = useState({ word: '', scrambled: '', hint: '' });
    const [wordAnswer, setWordAnswer] = useState('');

    // Pattern Game
    const [patternSequence, setPatternSequence] = useState([]);
    const [patternOptions, setPatternOptions] = useState([]);

    useEffect(() => {
        generateGame();
    }, [currentLevel, gameId]);

    const generateGame = () => {
        const game = currentGame;
        
        switch (game.type) {
            case 'memory':
                generateMemoryPattern();
                break;
            case 'math':
                generateMathQuestion();
                break;
            case 'word':
                generateWordScramble();
                break;
            case 'pattern':
                generatePattern();
                break;
            default:
                generateMemoryPattern();
        }
    };

    const generateMemoryPattern = () => {
        const size = 3 + currentLevel;
        const pattern = [];
        for (let i = 0; i < size; i++) {
            pattern.push(Math.floor(Math.random() * 9));
        }
        setMemoryPattern(pattern);
        setUserPattern([]);
        setShowPattern(true);
        setCanClick(false);

        setTimeout(() => {
            setShowPattern(false);
            setCanClick(true);
        }, 2000 + currentLevel * 500);
    };

    const generateMathQuestion = () => {
        const num1 = Math.floor(Math.random() * (10 * currentLevel)) + 1;
        const num2 = Math.floor(Math.random() * (10 * currentLevel)) + 1;
        const operations = ['+', '-', '*'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        let answer = 0;
        if (op === '+') answer = num1 + num2;
        else if (op === '-') answer = num1 - num2;
        else answer = num1 * num2;

        setMathQuestion({ num1, num2, op, answer });
        setMathAnswer('');
    };

    const generateWordScramble = () => {
        const words = [
            { word: 'BRAIN', hint: 'The organ that helps you think' },
            { word: 'PUZZLE', hint: 'A game that challenges your mind' },
            { word: 'MEMORY', hint: 'The ability to remember things' },
            { word: 'FOCUS', hint: 'Concentration on one thing' },
            { word: 'LOGIC', hint: 'Reasoning and thinking clearly' },
            { word: 'PATTERN', hint: 'A repeated design or sequence' },
            { word: 'SMART', hint: 'Clever and intelligent' },
            { word: 'THINK', hint: 'Use your mind to solve problems' }
        ];
        
        const selected = words[Math.floor(Math.random() * words.length)];
        const scrambled = selected.word.split('').sort(() => Math.random() - 0.5).join('');
        
        setWordScramble({
            word: selected.word,
            scrambled: scrambled,
            hint: selected.hint
        });
        setWordAnswer('');
    };

    const generatePattern = () => {
        const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
        const length = 3 + currentLevel;
        const pattern = [];
        for (let i = 0; i < length; i++) {
            pattern.push(shapes[i % shapes.length]);
        }
        setPatternSequence(pattern);
        
        const correct = shapes[(length) % shapes.length];
        const options = [correct, ...shapes.filter(s => s !== correct).slice(0, 3)].sort(() => Math.random() - 0.5);
        setPatternOptions(options);
    };

    const handleMemoryClick = (index) => {
        if (!canClick || gameComplete) return;
        
        const newPattern = [...userPattern, index];
        setUserPattern(newPattern);

        if (memoryPattern[newPattern.length - 1] === index) {
            if (newPattern.length === memoryPattern.length) {
                handleCorrect();
            }
        } else {
            handleWrong();
        }
    };

    const handleMathSubmit = () => {
        if (parseInt(mathAnswer) === mathQuestion.answer) {
            handleCorrect();
        } else {
            handleWrong();
        }
    };

    const handleWordSubmit = () => {
        if (wordAnswer.toUpperCase() === wordScramble.word) {
            handleCorrect();
        } else {
            handleWrong();
        }
    };

    const handlePatternClick = (shape) => {
        const correct = patternSequence.length > 0 ? 
            ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'][patternSequence.length % 6] : '🔴';
        
        if (shape === correct) {
            handleCorrect();
        } else {
            handleWrong();
        }
    };

    const handleCorrect = () => {
        setScore(score + 10);
        toast.success('Correct! 🎉', { duration: 1500 });

        if (currentLevel < currentGame.levels) {
            setTimeout(() => {
                setCurrentLevel(currentLevel + 1);
            }, 1000);
        } else {
            setTimeout(() => {
                setGameComplete(true);
                toast.success('Game Complete! 🏆', { duration: 3000 });
            }, 1000);
        }
    };

    const handleWrong = () => {
        setLives(lives - 1);
        toast.error('Try again! 💪', { duration: 1500 });

        if (lives <= 1) {
            setGameComplete(true);
            toast.error('Game Over!', { duration: 2000 });
        } else {
            setTimeout(() => generateGame(), 1000);
        }
    };

    const restartGame = () => {
        setCurrentLevel(1);
        setScore(0);
        setLives(3);
        setGameComplete(false);
        generateGame();
    };

    const renderGame = () => {
        switch (currentGame.type) {
            case 'memory':
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                            {showPattern ? 'Memorize the pattern!' : 'Recreate the pattern!'}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                            {[...Array(9)].map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleMemoryClick(index)}
                                    disabled={!canClick || showPattern}
                                    className={`aspect-square rounded-2xl text-4xl flex items-center justify-center shadow-lg transition-all ${
                                        showPattern && memoryPattern.includes(index)
                                            ? `bg-gradient-to-br ${currentGame.color} text-white`
                                            : userPattern.includes(index)
                                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                                            : 'bg-white hover:bg-gray-100'
                                    }`}
                                    whileHover={{ scale: canClick ? 1.1 : 1 }}
                                    whileTap={{ scale: canClick ? 0.95 : 1 }}
                                >
                                    {showPattern && memoryPattern.includes(index) ? '✨' : 
                                     userPattern.includes(index) ? '✓' : ''}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                );

            case 'math':
                return (
                    <div className="max-w-md mx-auto">
                        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                            Solve the equation!
                        </h3>
                        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
                            <div className="text-6xl font-black text-center mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                {mathQuestion.num1} {mathQuestion.op} {mathQuestion.num2} = ?
                            </div>
                            <input
                                type="number"
                                value={mathAnswer}
                                onChange={(e) => setMathAnswer(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleMathSubmit()}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 text-center text-3xl font-bold focus:border-orange-500 focus:outline-none"
                                placeholder="Your answer"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={handleMathSubmit}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r ${currentGame.color}`}
                        >
                            Submit Answer
                        </button>
                    </div>
                );

            case 'word':
                return (
                    <div className="max-w-md mx-auto">
                        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                            Unscramble the word!
                        </h3>
                        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-4">
                            <div className="text-5xl font-black text-center mb-4 tracking-widest bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {wordScramble.scrambled}
                            </div>
                            <p className="text-center text-gray-600 mb-6 italic">
                                💡 Hint: {wordScramble.hint}
                            </p>
                            <input
                                type="text"
                                value={wordAnswer}
                                onChange={(e) => setWordAnswer(e.target.value.toUpperCase())}
                                onKeyPress={(e) => e.key === 'Enter' && handleWordSubmit()}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 text-center text-2xl font-bold uppercase focus:border-green-500 focus:outline-none"
                                placeholder="TYPE THE WORD"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={handleWordSubmit}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r ${currentGame.color}`}
                        >
                            Submit Word
                        </button>
                    </div>
                );

            case 'pattern':
                return (
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                            What comes next in the pattern?
                        </h3>
                        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
                            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                                {patternSequence.map((shape, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                        className="text-6xl"
                                    >
                                        {shape}
                                    </motion.div>
                                ))}
                                <div className="text-6xl font-black text-gray-300">?</div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4">
                                {patternOptions.map((option, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => handlePatternClick(option)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-5xl shadow-lg hover:shadow-xl transition-all border-2 border-indigo-200 hover:border-indigo-400"
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return renderMemoryGame();
        }
    };

    if (!currentGame) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Game not found</h2>
                    <button
                        onClick={() => navigate('/games/brain-teaser')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold"
                    >
                        Back to Games
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentGame.color.replace('from-', 'from-').replace('to-', 'to-')}/10 relative overflow-hidden`}>
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-4 h-4 bg-gradient-to-r ${currentGame.color} rounded-full opacity-30`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <motion.button
                        onClick={() => navigate('/games/brain-teaser')}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-6 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-xl"
                    >
                        <ArrowLeft className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-gray-800">Back to Games</span>
                    </motion.button>

                    <div className="text-center">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-7xl mb-4"
                        >
                            {currentGame.icon}
                        </motion.div>
                        <h1 className={`text-4xl font-black mb-3 bg-gradient-to-r ${currentGame.color} bg-clip-text text-transparent`}>
                            {currentGame.title}
                        </h1>
                        
                        {/* Game Stats */}
                        <div className="flex flex-wrap gap-4 justify-center mt-6">
                            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                                <span className="text-sm text-gray-600 mr-2">Level:</span>
                                <span className="font-black text-purple-600 text-lg">{currentLevel}/{currentGame.levels}</span>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                                <span className="text-sm text-gray-600 mr-2">Score:</span>
                                <span className="font-black text-green-600 text-lg">{score}</span>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                                <span className="text-sm text-gray-600">Lives:</span>
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={`text-xl ${i < lives ? '' : 'opacity-20'}`}>
                                        ❤️
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Area */}
                <AnimatePresence mode="wait">
                    {!gameComplete ? (
                        <motion.div
                            key={currentLevel}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
                        >
                            {renderGame()}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                                className="text-9xl mb-6"
                            >
                                {lives > 0 ? '🏆' : '💪'}
                            </motion.div>
                            
                            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {lives > 0 ? 'Congratulations!' : 'Good Try!'}
                            </h2>
                            
                            <div className={`inline-block bg-gradient-to-r ${currentGame.color} text-white px-8 py-4 rounded-full mb-6 shadow-xl`}>
                                <div className="text-sm font-semibold mb-1">Final Score</div>
                                <div className="text-5xl font-black">{score}</div>
                            </div>

                            <p className="text-xl text-gray-600 mb-8 font-medium">
                                {lives > 0 
                                    ? `You completed all ${currentGame.levels} levels! Amazing! 🎉` 
                                    : 'Keep practicing to improve your skills! 💪'}
                            </p>

                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={restartGame}
                                    className={`bg-gradient-to-r ${currentGame.color} text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center gap-2`}
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Play Again
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/games/brain-teaser')}
                                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center gap-2"
                                >
                                    <Home className="w-5 h-5" />
                                    All Games
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

