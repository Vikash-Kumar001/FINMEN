import { OpenAI } from 'openai';
import CBTSession from '../models/CBTSession.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// CBT techniques and responses
const cbtTechniques = {
  anxietyRelief: [
    "Let's try some deep breathing together. Breathe in for 4 counts, hold for 4, and breathe out for 4. How does that feel?",
    "When you feel anxious, try naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    "Remember: anxiety is temporary. Can you think of a time when you felt anxious but it passed?"
  ],
  
  thoughtChallenge: [
    "What evidence do you have for and against this thought?",
    "If your best friend had this thought, what would you tell them?",
    "Is this thought helpful or unhelpful right now?",
    "What would be a more balanced way to think about this?"
  ],
  
  moodBooster: [
    "Let's focus on something positive. What's one thing that went well today?",
    "Think of three things you're grateful for, no matter how small.",
    "What's one compliment you could give yourself right now?"
  ],
  
  goalSetting: [
    "What's one small step you could take today towards your goal?",
    "Let's break this down into smaller, manageable parts.",
    "What would success look like for you in this situation?"
  ]
};

// Mood detection patterns
const moodPatterns = {
  sad: ['sad', 'depressed', 'down', 'upset', 'crying', 'hurt', 'disappointed'],
  anxious: ['anxious', 'worried', 'nervous', 'scared', 'panic', 'stress', 'overwhelmed'],
  angry: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed'],
  happy: ['happy', 'good', 'great', 'excited', 'joy', 'wonderful', 'amazing'],
  stressed: ['stressed', 'pressure', 'overwhelmed', 'busy', 'exhausted', 'tired']
};

// Topic detection patterns
const topicPatterns = {
  academic: ['exam', 'study', 'school', 'college', 'homework', 'grades', 'test'],
  relationships: ['friend', 'family', 'boyfriend', 'girlfriend', 'parents', 'relationship'],
  career: ['job', 'work', 'career', 'interview', 'boss', 'internship', 'future'],
  health: ['sleep', 'eating', 'exercise', 'health', 'body', 'diet'],
  general: ['life', 'day', 'today', 'tomorrow', 'yesterday', 'time']
};

// Analyze user message for mood and topic
const analyzeMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Detect mood
  let detectedMood = 'neutral';
  let maxMoodScore = 0;
  
  Object.entries(moodPatterns).forEach(([mood, patterns]) => {
    const score = patterns.reduce((count, pattern) => {
      return count + (lowerMessage.includes(pattern) ? 1 : 0);
    }, 0);
    
    if (score > maxMoodScore) {
      maxMoodScore = score;
      detectedMood = mood;
    }
  });
  
  // Detect topic
  let detectedTopic = 'general';
  let maxTopicScore = 0;
  
  Object.entries(topicPatterns).forEach(([topic, patterns]) => {
    const score = patterns.reduce((count, pattern) => {
      return count + (lowerMessage.includes(pattern) ? 1 : 0);
    }, 0);
    
    if (score > maxTopicScore) {
      maxTopicScore = score;
      detectedTopic = topic;
    }
  });
  
  return { mood: detectedMood, topic: detectedTopic };
};

// Get contextual CBT technique
const getCBTTechnique = (mood, topic) => {
  switch (mood) {
    case 'anxious':
    case 'stressed':
      return cbtTechniques.anxietyRelief[Math.floor(Math.random() * cbtTechniques.anxietyRelief.length)];
    case 'sad':
      return cbtTechniques.moodBooster[Math.floor(Math.random() * cbtTechniques.moodBooster.length)];
    case 'angry':
      return cbtTechniques.thoughtChallenge[Math.floor(Math.random() * cbtTechniques.thoughtChallenge.length)];
    default:
      return cbtTechniques.goalSetting[Math.floor(Math.random() * cbtTechniques.goalSetting.length)];
  }
};

// Generate personalized system prompt
const generateSystemPrompt = (userHistory = [], userMood = 'neutral', userTopic = 'general') => {
  const recentMessages = userHistory.slice(-5); // Last 5 messages for context
  const userName = recentMessages.length > 0 ? "friend" : "there";
  
  return `You are a compassionate CBT (Cognitive Behavioral Therapy) therapist chatbot designed specifically for Indian students aged 8-25. 

Current session context:
- User's current mood: ${userMood}
- Topic of discussion: ${userTopic}
- Recent conversation history: ${recentMessages.length} messages

Your personality:
- Warm, empathetic, and culturally sensitive
- Uses age-appropriate language and examples
- Incorporates Indian cultural context when relevant
- Encourages positive thinking without dismissing real concerns
- Provides practical CBT techniques and coping strategies

Guidelines:
1. Always validate the user's feelings first
2. Ask open-ended questions to encourage reflection
3. Provide specific, actionable CBT techniques
4. Keep responses between 1-3 sentences for better engagement
5. Use emojis sparingly but appropriately
6. Be mindful of academic pressure common in Indian education system
7. Suggest professional help if user expresses serious mental health concerns

Remember: You're not just providing advice, you're helping build emotional resilience and coping skills.`;
};

export const generateCBTReply = async (userMessage, userId = null) => {
  try {
    // Analyze the message
    const analysis = analyzeMessage(userMessage);
    
    // Get user's chat history for context
    let userHistory = [];
    if (userId) {
      const session = await CBTSession.findOne({ userId });
      userHistory = session?.messages || [];
    }
    
    // For simple greetings or short messages, use pre-built responses
    if (userMessage.length < 20 && (
      userMessage.toLowerCase().includes('hi') ||
      userMessage.toLowerCase().includes('hello') ||
      userMessage.toLowerCase().includes('hey')
    )) {
      const greetings = [
        "Hello! I'm here to support you today. How are you feeling?",
        "Hi there! What's on your mind today?",
        "Hey! I'm glad you're here. How has your day been so far?",
        "Hello! Ready to chat about whatever's on your mind?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Generate AI response with context
    const systemPrompt = generateSystemPrompt(userHistory, analysis.mood, analysis.topic);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        // Include recent conversation history
        ...userHistory.slice(-4).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 200, // Keep responses concise
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });
    
    let aiReply = response.choices[0].message.content;
    
    // Occasionally append a CBT technique
    if (Math.random() < 0.3 && analysis.mood !== 'neutral') {
      const technique = getCBTTechnique(analysis.mood, analysis.topic);
      aiReply += `\n\n💡 Quick technique: ${technique}`;
    }
    
    return aiReply;
    
  } catch (error) {
    console.error('❌ CBT Bot Engine Error:', error);
    
    // Fallback responses based on detected mood
    const fallbackResponses = {
      sad: "I understand you're going through a tough time. Remember, it's okay to feel sad sometimes. What's one small thing that usually makes you feel a bit better?",
      anxious: "I can sense you're feeling anxious. Let's take this one step at a time. What's the main thing that's worrying you right now?",
      angry: "It sounds like you're really frustrated. Those feelings are valid. What do you think might help you feel more calm?",
      happy: "I love hearing when things are going well! What's making you feel good today?",
      stressed: "Stress can be overwhelming. Let's break things down. What's the most important thing you need to focus on right now?",
      neutral: "I'm here to listen and support you. What would you like to talk about today?"
    };
    
    const analysis = analyzeMessage(userMessage);
    return fallbackResponses[analysis.mood] || fallbackResponses.neutral;
  }
};

// Generate quick action responses
export const generateQuickActionReply = (actionType, userMood = 'neutral') => {
  const responses = {
    mood: {
      happy: "That's wonderful! What's contributing to your positive mood today?",
      sad: "I'm here for you. Sometimes it helps to talk about what's making you feel down.",
      anxious: "Anxiety can be tough. What's causing you to feel anxious right now?",
      neutral: "How are you feeling today? I'm here to listen and support you."
    },
    
    motivation: {
      happy: "You're already in a great headspace! What goal would you like to work on while you're feeling motivated?",
      sad: "Even small steps count. What's one tiny thing you could do today that might make you feel a bit better?",
      anxious: "When we're anxious, focusing on what we can control helps. What's one thing you have control over today?",
      neutral: "Every day is a new opportunity. What's one thing you'd like to accomplish today?"
    },
    
    progress: {
      happy: "Let's celebrate your wins! What positive changes have you noticed in yourself recently?",
      sad: "Progress isn't always linear. What's one small positive change you can acknowledge about yourself?",
      anxious: "Sometimes progress means just getting through tough moments. What challenges have you overcome recently?",
      neutral: "Reflection is powerful. What's one area where you've grown recently?"
    }
  };
  
  return responses[actionType]?.[userMood] || responses[actionType]?.neutral || "I'm here to support you. What would you like to talk about?";
};