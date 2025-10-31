// src/data/mockFeatures.js

export const mockFeatures = [
  {
    id: 1,
    title: "Financial Literacy",
    description: "Learn the basics of personal finance and money management",
    icon: "📚",
    path: "/learn/financial-literacy",
    color: "bg-blue-500",
    category: "education",
    xpReward: 50
  },
  // Digital Citizenship & Online Safety Game Cards - Moved to the beginning of education category
  {
    id: 21,
    title: "Kids Games",
    description: "Fun and educational digital citizenship games for children",
    icon: "🧸",
    path: "/games/digital-citizenship/kids",
    color: "bg-yellow-400",
    category: "education",
    xpReward: 30
  },
  {
    id: 22,
    title: "Teen Games",
    description: "Engaging digital citizenship games designed for teenagers",
    icon: "📱",
    path: "/games/digital-citizenship/teens",
    color: "bg-blue-500",
    category: "education",
    xpReward: 35
  },
  {
    id: 23,
    title: "Adult Games",
    description: "Challenging digital citizenship games for adults",
    icon: "🧩",
    path: "/games/digital-citizenship/adults",
    color: "bg-purple-500",
    category: "education",
    xpReward: 40
  },
  {
    id: 5,
    title: "Financial Quiz",
    description: "Test your financial knowledge",
    icon: "❓",
    path: "/learn/financial-quiz",
    color: "bg-red-500",
    category: "education",
    xpReward: 55
  },
  // Financial Literacy Game Cards - Moved to the beginning of finance category
  {
    id: 12,
    title: "Kids Games",
    description: "Fun and educational financial games for children",
    icon: "🧸",
    path: "/games/financial-literacy/kids",
    color: "bg-yellow-400",
    category: "finance",
    xpReward: 30
  },
  {
    id: 13,
    title: "Teen Games",
    description: "Engaging financial games designed for teenagers",
    icon: "📱",
    path: "/games/financial-literacy/teens",
    color: "bg-blue-500",
    category: "finance",
    xpReward: 35
  },
  {
    id: 14,
    title: "Adult Games",
    description: "Challenging financial games for adults",
    icon: "🧩",
    path: "/games/financial-literacy/adults",
    color: "bg-purple-500",
    category: "finance",
    xpReward: 40
  },
  // Swapped positions: place Leaderboard where Investment Simulator was
  {
    id: 11,
    title: "Leaderboard",
    description: "See how you rank among your peers",
    icon: "🏆",
    path: "/student/leaderboard",
    color: "bg-amber-500",
    category: "competition",
    xpReward: 15
  },
  {
    id: 4,
    title: "Savings Goals",
    description: "Set and track your savings goals",
    icon: "🎯",
    path: "/tools/savings-goals",
    color: "bg-yellow-500",
    category: "finance",
    xpReward: 45
  },
  {
    id: 6,
    title: "Expense Tracker",
    description: "Track your daily expenses",
    icon: "📝",
    path: "/tools/expense-tracker",
    color: "bg-indigo-500",
    category: "finance",
    xpReward: 35
  },
  // Brain Health Game Cards - Moved to the beginning of wellness category
  {
    id: 15,
    title: "Kids Games",
    description: "Fun and educational brain health games for children",
    icon: "🧸",
    path: "/games/brain-health/kids",
    color: "bg-yellow-400",
    category: "wellness",
    xpReward: 30
  },
  {
    id: 16,
    title: "Teen Games",
    description: "Engaging brain health games designed for teenagers",
    icon: "📱",
    path: "/games/brain-health/teens",
    color: "bg-blue-500",
    category: "wellness",
    xpReward: 35
  },
  {
    id: 17,
    title: "Adult Games",
    description: "Challenging brain health games for adults",
    icon: "🧩",
    path: "/games/brain-health/adults",
    color: "bg-purple-500",
    category: "wellness",
    xpReward: 40
  },
  {
    id: 7,
    title: "Mood Tracker",
    description: "Track your daily mood and emotional well-being",
    icon: "😊",
    path: "/student/mood-tracker",
    color: "bg-pink-500",
    category: "wellness",
    xpReward: 30
  },
  // UVLS (Life Skills & Values) Game Cards - Moved to the beginning of personal category
  {
    id: 18,
    title: "Kids Games",
    description: "Fun and educational life skills games for children",
    icon: "🧸",
    path: "/games/uvls/kids",
    color: "bg-yellow-400",
    category: "personal",
    xpReward: 30
  },
  {
    id: 19,
    title: "Teen Games",
    description: "Engaging life skills games designed for teenagers",
    icon: "📱",
    path: "/games/uvls/teens",
    color: "bg-blue-500",
    category: "personal",
    xpReward: 35
  },
  {
    id: 20,
    title: "Adult Games",
    description: "Challenging life skills games for adults",
    icon: "🧩",
    path: "/games/uvls/adults",
    color: "bg-purple-500",
    category: "personal",
    xpReward: 40
  },
  {
    id: 8,
    title: "Journal",
    description: "Write down your thoughts and reflections",
    icon: "📔",
    path: "/student/journal",
    color: "bg-teal-500",
    category: "personal",
    xpReward: 25
  },
  {
    id: 9,
    title: "Breathing Exercise",
    description: "Practice mindful breathing for stress relief",
    icon: "🧘",
    path: "/student/breathing",
    color: "bg-blue-400",
    category: "wellness",
    xpReward: 20
  },
  // Original Budget Planner moved after reorder
  {
    id: 2,
    title: "Budget Planner",
    description: "Create and manage your personal budget",
    icon: "💰",
    path: "/tools/budget-planner",
    color: "bg-green-500",
    category: "finance",
    xpReward: 40
  },
  // Original Investment Simulator moved after reorder
  {
    id: 3,
    title: "Investment Simulator",
    description: "Practice investing with virtual money",
    icon: "📈",
    path: "/games/investment-simulator",
    color: "bg-purple-500",
    category: "finance",
    xpReward: 60
  },
  // Moral Values Game Cards
  {
    id: 24,
    title: "Kids Games",
    description: "Fun and educational moral values games for children",
    icon: "🧸",
    path: "/games/moral-values/kids",
    color: "bg-yellow-400",
    category: "creativity",
    xpReward: 30
  },
  {
    id: 25,
    title: "Teen Games",
    description: "Engaging moral values games designed for teenagers",
    icon: "📱",
    path: "/games/moral-values/teens",
    color: "bg-blue-500",
    category: "creativity",
    xpReward: 35
  },
  {
    id: 26,
    title: "Adult Games",
    description: "Challenging moral values games for adults",
    icon: "🧩",
    path: "/games/moral-values/adults",
    color: "bg-purple-500",
    category: "creativity",
    xpReward: 40
  },
  // AI for All Game Cards
  {
    id: 27,
    title: "Kids Games",
    description: "Fun and educational AI games for children",
    icon: "🧸",
    path: "/games/ai-for-all/kids",
    color: "bg-yellow-400",
    category: "entertainment",
    xpReward: 30
  },
  {
    id: 28,
    title: "Teen Games",
    description: "Engaging AI games designed for teenagers",
    icon: "📱",
    path: "/games/ai-for-all/teens",
    color: "bg-blue-500",
    category: "entertainment",
    xpReward: 35
  },
  {
    id: 29,
    title: "Adult Games",
    description: "Challenging AI games for adults",
    icon: "🧩",
    path: "/games/ai-for-all/adults",
    color: "bg-purple-500",
    category: "entertainment",
    xpReward: 40
  },
  // Health - Male Game Cards
  {
    id: 30,
    title: "Kids Games",
    description: "Fun and educational male health games for children",
    icon: "🧸",
    path: "/games/health-male/kids",
    color: "bg-yellow-400",
    category: "social",
    xpReward: 30
  },
  {
    id: 31,
    title: "Teen Games",
    description: "Engaging male health games designed for teenagers",
    icon: "📱",
    path: "/games/health-male/teens",
    color: "bg-blue-500",
    category: "social",
    xpReward: 35
  },
  {
    id: 32,
    title: "Adult Games",
    description: "Challenging male health games for adults",
    icon: "🧩",
    path: "/games/health-male/adults",
    color: "bg-purple-500",
    category: "social",
    xpReward: 40
  },
  // Health - Female Game Cards
  {
    id: 33,
    title: "Kids Games",
    description: "Fun and educational female health games for children",
    icon: "🧸",
    path: "/games/health-female/kids",
    color: "bg-yellow-400",
    category: "competition",
    xpReward: 30
  },
  {
    id: 34,
    title: "Teen Games",
    description: "Engaging female health games designed for teenagers",
    icon: "📱",
    path: "/games/health-female/teens",
    color: "bg-blue-500",
    category: "competition",
    xpReward: 35
  },
  {
    id: 35,
    title: "Adult Games",
    description: "Challenging female health games for adults",
    icon: "🧩",
    path: "/games/health-female/adults",
    color: "bg-purple-500",
    category: "competition",
    xpReward: 40
  },
  // Entrepreneurship & Higher Education Game Cards
  {
    id: 36,
    title: "Kids Games",
    description: "Fun and educational entrepreneurship games for children",
    icon: "🧸",
    path: "/games/entrepreneurship/kids",
    color: "bg-yellow-400",
    category: "rewards",
    xpReward: 30
  },
  {
    id: 37,
    title: "Teen Games",
    description: "Engaging entrepreneurship games designed for teenagers",
    icon: "📱",
    path: "/games/entrepreneurship/teens",
    color: "bg-blue-500",
    category: "rewards",
    xpReward: 35
  },
  {
    id: 38,
    title: "Adult Games",
    description: "Challenging entrepreneurship games for adults",
    icon: "🧩",
    path: "/games/entrepreneurship/adults",
    color: "bg-purple-500",
    category: "rewards",
    xpReward: 40
  },
  // Civic Responsibility & Global Citizenship Game Cards
  {
    id: 39,
    title: "Kids Games",
    description: "Fun and educational civic responsibility games for children",
    icon: "🧸",
    path: "/games/civic-responsibility/kids",
    color: "bg-yellow-400",
    category: "shopping",
    xpReward: 30
  },
  {
    id: 40,
    title: "Teen Games",
    description: "Engaging civic responsibility games designed for teenagers",
    icon: "📱",
    path: "/games/civic-responsibility/teens",
    color: "bg-blue-500",
    category: "shopping",
    xpReward: 35
  },
  {
    id: 41,
    title: "Adult Games",
    description: "Challenging civic responsibility games for adults",
    icon: "🧩",
    path: "/games/civic-responsibility/adults",
    color: "bg-purple-500",
    category: "shopping",
    xpReward: 40
  },
  // Sustainability Games - Added before challenges
  {
    id: 42,
    title: "Sustainability",
    description: "Learn about environmental sustainability through interactive games",
    icon: "🌱",
    path: "/games/sustainability",
    color: "bg-green-600",
    category: "sustainability",
    xpReward: 45
  }
];