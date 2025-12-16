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
    title: "Kids Module",
    description: "Fun and educational digital citizenship games for children",
    icon: "🧸",
    path: "/games/digital-citizenship/kids",
    color: "bg-yellow-400",
    category: "education",
    xpReward: 1000
  },
  {
    id: 22,
    title: "Teen Module",
    description: "Engaging digital citizenship games designed for teenagers",
    icon: "📱",
    path: "/games/digital-citizenship/teens",
    color: "bg-blue-500",
    category: "education",
    xpReward: 1000
  },
  {
    id: 23,
    title: "Adult Module",
    description: "Challenging digital citizenship games for adults",
    icon: "🧩",
    path: "/games/digital-citizenship/adults",
    color: "bg-purple-500",
    category: "education",
    xpReward: 1000
  },
  // Financial Literacy Game Cards - Moved to the beginning of finance category
  {
    id: 12,
    title: "Kids Module",
    description: "Fun and educational financial games for children",
    icon: "🧸",
    path: "/games/financial-literacy/kids",
    color: "bg-yellow-400",
    category: "finance",
    xpReward: 1000
  },
  {
    id: 13,
    title: "Teen Module",
    description: "Engaging financial games designed for teenagers",
    icon: "📱",
    path: "/games/financial-literacy/teens",
    color: "bg-blue-500",
    category: "finance",
    xpReward: 1000
  },
  {
    id: 14,
    title: "Adult Module",
    description: "Challenging financial games for adults",
    icon: "🧩",
    path: "/games/financial-literacy/adults",
    color: "bg-purple-500",
    category: "finance",
    xpReward: 1000
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
    path: "/student/finance/savings-goals",
    color: "bg-yellow-500",
    category: "finance",
    xpReward: 45,
    showXp: false
  },
  {
    id: 6,
    title: "Expense Tracker",
    description: "Track your daily expenses",
    icon: "📝",
    path: "/student/finance/expense-tracker",
    color: "bg-indigo-500",
    category: "finance",
    xpReward: 35,
    showXp: false
  },
  // Brain Health Game Cards - Moved to the beginning of wellness category
  {
    id: 15,
    title: "Kids Module",
    description: "Fun and educational brain health games for children",
    icon: "🧸",
    path: "/games/brain-health/kids",
    color: "bg-yellow-400",
    category: "wellness",
    xpReward: 1000
  },
  {
    id: 16,
    title: "Teen Module",
    description: "Engaging brain health games designed for teenagers",
    icon: "📱",
    path: "/games/brain-health/teens",
    color: "bg-blue-500",
    category: "wellness",
    xpReward: 1000
  },
  {
    id: 17,
    title: "Adult Module",
    description: "Challenging brain health games for adults",
    icon: "🧩",
    path: "/games/brain-health/adults",
    color: "bg-purple-500",
    category: "wellness",
    xpReward: 1000
  },
  {
    id: 7,
    title: "Mood Tracker",
    description: "Track your daily mood and emotional well-being",
    icon: "😊",
    path: "/student/mood-tracker",
    color: "bg-pink-500",
    category: "wellness",
    xpReward: 30,
    showXp: false
  },
  // UVLS (Life Skills & Values) Game Cards - Moved to the beginning of personal category
  {
    id: 18,
    title: "Kids Module",
    description: "Fun and educational life skills games for children",
    icon: "🧸",
    path: "/games/uvls/kids",
    color: "bg-yellow-400",
    category: "personal",
    xpReward: 1000
  },
  {
    id: 19,
    title: "Teen Module",
    description: "Engaging life skills games designed for teenagers",
    icon: "📱",
    path: "/games/uvls/teens",
    color: "bg-blue-500",
    category: "personal",
    xpReward: 1000
  },
  {
    id: 20,
    title: "Adult Module",
    description: "Challenging life skills games for adults",
    icon: "🧩",
    path: "/games/uvls/adults",
    color: "bg-purple-500",
    category: "personal",
    xpReward: 1000
  },
  {
    id: 9,
    title: "Breathing Exercise",
    description: "Practice mindful breathing for stress relief",
    icon: "🧘",
    path: "/student/breathing",
    color: "bg-blue-400",
    category: "wellness",
    xpReward: 20,
    showXp: false
  },
  // Original Budget Planner moved after reorder
  {
    id: 2,
    title: "Budget Planner",
    description: "Create and manage your personal budget",
    icon: "💰",
    path: "/student/finance/budget-planner",
    color: "bg-green-500",
    category: "finance",
    xpReward: 40,
    showXp: false
  },
  // Original Investment Simulator moved after reorder
  {
    id: 3,
    title: "Investment Simulator",
    description: "Practice investing with virtual money",
    icon: "📈",
    path: "/student/finance/investment-simulator",
    color: "bg-purple-500",
    category: "finance",
    xpReward: 60,
    showXp: false
  },
  {
    id: 51,
    title: "Credit Management",
    description: "Learn how to manage and improve your credit score",
    icon: "💳",
    path: "/student/finance/credit-management",
    color: "bg-emerald-500",
    category: "finance",
    xpReward: 50,
    showXp: false
  },
  // Moral Values Game Cards
  {
    id: 24,
    title: "Kids Module",
    description: "Fun and educational moral values games for children",
    icon: "🧸",
    path: "/games/moral-values/kids",
    color: "bg-yellow-400",
    category: "creativity",
    xpReward: 1000
  },
  {
    id: 25,
    title: "Teen Module",
    description: "Engaging moral values games designed for teenagers",
    icon: "📱",
    path: "/games/moral-values/teens",
    color: "bg-blue-500",
    category: "creativity",
    xpReward: 1000
  },
  {
    id: 26,
    title: "Adult Module",
    description: "Challenging moral values games for adults",
    icon: "🧩",
    path: "/games/moral-values/adults",
    color: "bg-purple-500",
    category: "creativity",
    xpReward: 1000
  },
  // AI for All Game Cards
  {
    id: 27,
    title: "Kids Module",
    description: "Fun and educational AI games for children",
    icon: "🧸",
    path: "/games/ai-for-all/kids",
    color: "bg-yellow-400",
    category: "entertainment",
    xpReward: 1000
  },
  {
    id: 28,
    title: "Teen Module",
    description: "Engaging AI games designed for teenagers",
    icon: "📱",
    path: "/games/ai-for-all/teens",
    color: "bg-blue-500",
    category: "entertainment",
    xpReward: 1000
  },
  {
    id: 29,
    title: "Adult Module",
    description: "Challenging AI games for adults",
    icon: "🧩",
    path: "/games/ai-for-all/adults",
    color: "bg-purple-500",
    category: "entertainment",
    xpReward: 1000
  },
  // Health - Male Game Cards
  {
    id: 30,
    title: "Kids Module",
    description: "Fun and educational male health games for children",
    icon: "🧸",
    path: "/games/health-male/kids",
    color: "bg-yellow-400",
    category: "social",
    xpReward: 1000
  },
  {
    id: 31,
    title: "Teen Module",
    description: "Engaging male health games designed for teenagers",
    icon: "📱",
    path: "/games/health-male/teens",
    color: "bg-blue-500",
    category: "social",
    xpReward: 1000
  },
  {
    id: 32,
    title: "Adult Module",
    description: "Challenging male health games for adults",
    icon: "🧩",
    path: "/games/health-male/adults",
    color: "bg-purple-500",
    category: "social",
    xpReward: 1000
  },
  // Health - Female Game Cards
  {
    id: 33,
    title: "Kids Module",
    description: "Fun and educational female health games for children",
    icon: "🧸",
    path: "/games/health-female/kids",
    color: "bg-yellow-400",
    category: "competition",
    xpReward: 1000
  },
  {
    id: 34,
    title: "Teen Module",
    description: "Engaging female health games designed for teenagers",
    icon: "📱",
    path: "/games/health-female/teens",
    color: "bg-blue-500",
    category: "competition",
    xpReward: 1000
  },
  {
    id: 35,
    title: "Adult Module",
    description: "Challenging female health games for adults",
    icon: "🧩",
    path: "/games/health-female/adults",
    color: "bg-purple-500",
    category: "competition",
    xpReward: 1000
  },
  // Entrepreneurship & Higher Education Game Cards
  {
    id: 36,
    title: "Kids Module",
    description: "Fun and educational entrepreneurship games for children",
    icon: "🧸",
    path: "/games/ehe/kids",
    color: "bg-yellow-400",
    category: "rewards",
    xpReward: 1000
  },
  {
    id: 37,
    title: "Teen Module",
    description: "Engaging entrepreneurship games designed for teenagers",
    icon: "📱",
    path: "/games/ehe/teens",
    color: "bg-blue-500",
    category: "rewards",
    xpReward: 1000
  },
  {
    id: 38,
    title: "Adult Module",
    description: "Challenging entrepreneurship games for adults",
    icon: "🧩",
    path: "/games/ehe/adults",
    color: "bg-purple-500",
    category: "rewards",
    xpReward: 1000
  },
  // Civic Responsibility & Global Citizenship Game Cards
  {
    id: 39,
    title: "Kids Module",
    description: "Fun and educational civic responsibility games for children",
    icon: "🧸",
    path: "/games/civic-responsibility/kids",
    color: "bg-yellow-400",
    category: "shopping",
    xpReward: 1000
  },
  {
    id: 40,
    title: "Teen Module",
    description: "Engaging civic responsibility games designed for teenagers",
    icon: "📱",
    path: "/games/civic-responsibility/teens",
    color: "bg-blue-500",
    category: "shopping",
    xpReward: 1000
  },
  {
    id: 41,
    title: "Adult Module",
    description: "Challenging civic responsibility games for adults",
    icon: "🧩",
    path: "/games/civic-responsibility/adults",
    color: "bg-purple-500",
    category: "shopping",
    xpReward: 1000
  },
  // Sustainability Game Cards - Added before main Sustainability card
  {
    id: 43,
    title: "Kids Module",
    description: "Fun and educational sustainability games for children",
    icon: "🧸",
    path: "/games/sustainability/kids",
    color: "bg-yellow-400",
    category: "sustainability",
    xpReward: 1000
  },
  {
    id: 44,
    title: "Teen Module",
    description: "Engaging sustainability games designed for teenagers",
    icon: "📱",
    path: "/games/sustainability/teens",
    color: "bg-blue-500",
    category: "sustainability",
    xpReward: 1000
  },
  {
    id: 45,
    title: "Adult Module",
    description: "Challenging sustainability games for adults",
    icon: "🧩",
    path: "/games/sustainability/adults",
    color: "bg-purple-500",
    category: "sustainability",
    xpReward: 1000
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
  },
];