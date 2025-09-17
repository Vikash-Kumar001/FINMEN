import axios from 'axios';
import ChatSession from '../models/ChatSession.js';

// AIML Service to connect with the Python Flask chatbot
class AimlService {
  constructor() {
    this.aimlBaseUrl = process.env.AIML_SERVICE_URL || 'http://127.0.0.1:5001';
    this.timeout = 10000; // 10 seconds timeout
  }

  /**
   * Send message to AIML chatbot and get response
   * @param {string} sessionId - Unique session ID for the user
   * @param {string} message - User message
   * @returns {Promise<string>} - Bot response
   */
  async sendMessage(sessionId, message) {
    try {
      console.log(`🤖 Sending message to AIML service: ${message}`);
      
      const response = await axios.post(`${this.aimlBaseUrl}/chat`, {
        message: message.trim(),
        session_id: sessionId
      }, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.response) {
        console.log(`✅ AIML response received: ${response.data.response.substring(0, 100)}...`);
        return response.data.response;
      } else {
        throw new Error('Invalid response format from AIML service');
      }
    } catch (error) {
      console.error('❌ AIML Service Error:', error.message);
      
      // Return fallback response
      return this.getFallbackResponse(message);
    }
  }

  /**
   * Generate fallback response when AIML service is unavailable
   * @param {string} message - User message
   * @returns {string} - Fallback response
   */
  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! While our advanced AI is temporarily unavailable, I can still assist you with basic questions about financial education and your FINMEN journey. What would you like to know?";
    }
    
    if (lowerMessage.includes('money') || lowerMessage.includes('finance') || lowerMessage.includes('budget')) {
      return "Great question about finances! Building good money habits is crucial. Consider starting with a simple budget: track your income, list your expenses, and find ways to save. What specific financial topic interests you most?";
    }
    
    if (lowerMessage.includes('challenge') || lowerMessage.includes('xp') || lowerMessage.includes('coins')) {
      return "Challenges are a fantastic way to learn and earn rewards! Complete daily challenges to gain XP and HealCoins. Each challenge teaches valuable financial skills. Have you tried today's challenges yet?";
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('stressed') || lowerMessage.includes('worried')) {
      return "I understand you might be feeling overwhelmed. Remember that learning about finances is a journey, and every small step counts. Take breaks when needed, and celebrate your progress. You're doing great! 💙";
    }
    
    if (lowerMessage.includes('goal') || lowerMessage.includes('target') || lowerMessage.includes('achievement')) {
      return "Setting financial goals is excellent! Start with small, achievable targets like saving a specific amount each week or completing a certain number of challenges. What financial goal would you like to work towards?";
    }
    
    // Default response
    return "Thanks for your message! Our advanced AI chatbot is temporarily unavailable, but I'm here to help with basic questions about financial education, challenges, and your FINMEN journey. Feel free to ask me anything! 🤖✨";
  }

  /**
   * Process chat message and save to database
   * @param {string} userId - User ID
   * @param {string} message - User message
   * @returns {Promise<Object>} - Response object with user and bot messages
   */
  async processMessage(userId, message) {
    try {
      // Generate session ID based on user ID and date
      const today = new Date().toISOString().split('T')[0];
      const sessionId = `finmen_${userId}_${today}`;
      
      // Get response from AIML service
      const botResponse = await this.sendMessage(sessionId, message);
      
      // Create user message object
      const userMessage = {
        sender: 'user',
        text: message.trim(),
        timestamp: new Date(),
        userId: userId
      };
      
      // Create bot message object
      const botMessage = {
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
        mood: this.detectMood(botResponse),
        category: this.detectCategory(message)
      };
      
      // Save to database
      let chatSession = await ChatSession.findOne({ userId });
      if (!chatSession) {
        chatSession = new ChatSession({
          userId,
          sessionId,
          messages: [],
          lastUsed: new Date()
        });
      }
      
      chatSession.messages.push(userMessage, botMessage);
      chatSession.lastUsed = new Date();
      await chatSession.save();
      
      return {
        userMessage,
        botMessage,
        sessionId
      };
      
    } catch (error) {
      console.error('❌ Process Message Error:', error);
      throw error;
    }
  }

  /**
   * Detect mood from bot response
   * @param {string} response - Bot response text
   * @returns {string} - Detected mood
   */
  detectMood(response) {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('congratulations') || lowerResponse.includes('excellent') || lowerResponse.includes('great')) {
      return 'excited';
    }
    if (lowerResponse.includes('sorry') || lowerResponse.includes('understand') || lowerResponse.includes('difficult')) {
      return 'supportive';
    }
    if (lowerResponse.includes('fun') || lowerResponse.includes('play') || lowerResponse.includes('game')) {
      return 'playful';
    }
    if (lowerResponse.includes('learn') || lowerResponse.includes('knowledge') || lowerResponse.includes('education')) {
      return 'wise';
    }
    
    return 'happy';
  }

  /**
   * Detect category from user message
   * @param {string} message - User message
   * @returns {string} - Message category
   */
  detectCategory(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('feel') || lowerMessage.includes('mood') || lowerMessage.includes('emotion')) {
      return 'mood';
    }
    if (lowerMessage.includes('goal') || lowerMessage.includes('target') || lowerMessage.includes('plan')) {
      return 'goals';
    }
    if (lowerMessage.includes('progress') || lowerMessage.includes('level') || lowerMessage.includes('xp')) {
      return 'progress';
    }
    if (lowerMessage.includes('achievement') || lowerMessage.includes('reward') || lowerMessage.includes('badge')) {
      return 'achievements';
    }
    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire') || lowerMessage.includes('encourage')) {
      return 'motivation';
    }
    if (lowerMessage.includes('fun') || lowerMessage.includes('game') || lowerMessage.includes('play')) {
      return 'fun';
    }
    
    return 'general';
  }

  /**
   * Check if AIML service is available
   * @returns {Promise<boolean>} - Service availability status
   */
  async checkServiceHealth() {
    try {
      const response = await axios.get(`${this.aimlBaseUrl}/`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.log('🔄 AIML service not available, using fallback responses');
      return false;
    }
  }
}

export default new AimlService();