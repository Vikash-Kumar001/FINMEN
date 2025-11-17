import {
  Heart,
  Users,
  Globe,
  Target,
  Award,
  BookOpen,
  Zap,
  Brain,
  Sparkles,
  Handshake,
  School,
  Medal,
  ShoppingCart,
  TreePine,
  IndianRupee,
  Banknote,
  Droplets,
  Wrench,
  Smartphone,
  Gamepad2,
  Music,
  ChefHat
} from "lucide-react";
import buildIds from "../../../Games/GameCategories/buildGameIds";

export const crgcGameIdsKids = buildIds("civic-responsibility", "kids")

export const getCrgcKidsGames = (gameCompletionStatus) => {
    const crgcGamesKids = [
        {
            id: 'civic-responsibility-kids-1',
            title: 'Friend\'s Sad Story',
            description: 'Your friend is crying because her toy broke. What should you do?',
            icon: <Heart className="w-6 h-6" />,
            difficulty: 'Easy',
            duration: '4 min',
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus['civic-responsibility-kids-1'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/friends-sad-story',
            index: 0
        },
        {
            id: 'civic-responsibility-kids-2',
            title: 'Quiz on Empathy',
            description: 'Empathy means? (a) Feeling with others, (b) Ignoring.',
            icon: <Brain className="w-6 h-6" />,
            difficulty: 'Easy',
            duration: '4 min',
            coins: 3,
            xp: 8,
            completed: gameCompletionStatus['civic-responsibility-kids-2'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/quiz-on-empathy',
            index: 1
        },
        {
            id: 'civic-responsibility-kids-3',
            title: 'Reflex Kindness',
            description: 'Tap ❤️ for "Sharing Snacks," ❌ for "Laughing at Friend."',
            icon: <Zap className="w-6 h-6" />,
            difficulty: 'Medium',
            duration: '3 min',
            coins: 3,
            xp: 8,
            completed: gameCompletionStatus['civic-responsibility-kids-3'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/reflex-kindness',
            index: 2
        },
        {
            id: 'civic-responsibility-kids-4',
            title: 'Puzzle: Match Feelings',
            description: 'Match "Happy → 😊 Smile, Sad → 😢 Cry, Angry → 😠 Frown."',
            icon: <Target className="w-6 h-6" />,
            difficulty: 'Medium',
            duration: '5 min',
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus['civic-responsibility-kids-4'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/puzzle-match-feelings',
            index: 3
        },
        {
            id: 'civic-responsibility-kids-5',
            title: 'Animal Story',
            description: 'You see a hungry 🐕 dog. Should you feed or kick it?',
            icon: <Sparkles className="w-6 h-6" />,
            difficulty: 'Easy',
            duration: '4 min',
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus['civic-responsibility-kids-5'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/animal-story',
            index: 4
        },
        {
            id: 'civic-responsibility-kids-6',
            title: 'Poster: Be Kind Always',
            description: 'Create/select poster: "Kindness is My Superpower."',
            icon: <Award className="w-6 h-6" />,
            difficulty: 'Medium',
            duration: '6 min',
            coins: 0,
            xp: 15,
            completed: gameCompletionStatus['civic-responsibility-kids-6'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/poster-be-kind-always',
            index: 5
        },
        {
            id: 'civic-responsibility-kids-7',
            title: 'Journal of Empathy',
            description: 'Write: "I showed kindness today by ___."',
            icon: <BookOpen className="w-6 h-6" />,
            difficulty: 'Easy',
            duration: '5 min',
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus['civic-responsibility-kids-7'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/journal-of-empathy',
            index: 6
        },
        {
            id: 'civic-responsibility-kids-8',
            title: 'Bully Story',
            description: 'A bully teases a classmate. Should you join or stop him?',
            icon: <School className="w-6 h-6" />,
            difficulty: 'Easy',
            duration: '4 min',
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus['civic-responsibility-kids-8'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/bully-story',
            index: 7
        },
        {
            id: 'civic-responsibility-kids-9',
            title: 'Reflex Help Alert',
            description: 'Tap 🙋 for "Help a Friend," ❌ for "Ignore Pain."',
            icon: <Zap className="w-6 h-6" />,
            difficulty: 'Medium',
            duration: '3 min',
            coins: 3,
            xp: 8,
            completed: gameCompletionStatus['civic-responsibility-kids-9'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/reflex-help-alert',
            index: 8
        },
        {
            id: 'civic-responsibility-kids-10',
            title: 'Badge: Kind Kid',
            description: 'Show empathy in 5 cases to earn your badge.',
            icon: <Medal className="w-6 h-6" />,
            difficulty: 'Medium',
            duration: '5 min',
            coins: 0,
            xp: 20,
            completed: gameCompletionStatus['civic-responsibility-kids-10'] || false,
            isSpecial: true,
            path: '/student/civic-responsibility/kids/badge-kind-kid',
            index: 9
        }
    ];

    return crgcGamesKids;
};

export default getCrgcKidsGames;