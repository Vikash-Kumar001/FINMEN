import CBTSession from '../models/CBTSession.js';
import { generateCBTReply } from '../utils/cbtBotEngine.js';

// 🧠 POST /api/cbt/chat - REST API endpoint
export const startChat = async (req, res) => {
  const userId = req.user?._id;
  const { message } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: 'Missing message or user' });
  }

  try {
    const botReply = await generateCBTReply(message);

    const session = await CBTSession.findOneAndUpdate(
      { userId },
      {
        $push: {
          messages: [
            { sender: 'user', text: message, timestamp: new Date() },
            { sender: 'bot', text: botReply, timestamp: new Date() },
          ],
        },
        lastUsed: new Date(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      reply: botReply,
      session: session.messages,
    });
  } catch (err) {
    console.error('❌ CBT Chat Error:', err);
    res.status(500).json({ error: 'Failed to process CBT conversation' });
  }
};

// 🗂️ GET /api/cbt/history
export const getChatHistory = async (req, res) => {
  const userId = req.user?._id;

  try {
    const session = await CBTSession.findOne({ userId });
    res.status(200).json({ history: session?.messages || [] });
  } catch (err) {
    console.error('❌ CBT History Error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// 🔄 DELETE /api/cbt/history
export const clearChatHistory = async (req, res) => {
  const userId = req.user?._id;

  try {
    await CBTSession.findOneAndDelete({ userId });
    res.status(200).json({ message: 'CBT chat history cleared successfully' });
  } catch (err) {
    console.error('❌ Clear History Error:', err);
    res.status(500).json({ error: 'Failed to clear CBT chat history' });
  }
};

// 🔌 Socket.io handlers for real-time chat
export const handleCBTSocketEvents = (io, socket) => {
  // Subscribe to CBT chat room
  socket.on('student:chat:subscribe', async ({ studentId }) => {
    try {
      socket.join(`cbt_chat_${studentId}`);
      
      // Send chat history on subscription
      const session = await CBTSession.findOne({ userId: studentId });
      socket.emit('student:chat:history', session?.messages || []);
    } catch (err) {
      console.error('❌ CBT Socket Subscribe Error:', err);
      socket.emit('error', { message: 'Failed to subscribe to chat' });
    }
  });

  // Handle incoming chat messages
  socket.on('student:chat:send', async ({ studentId, text }) => {
    try {
      if (!text || !studentId) {
        socket.emit('error', { message: 'Missing message or student ID' });
        return;
      }

      // Create user message
      const userMessage = {
        sender: 'user',
        text: text.trim(),
        timestamp: new Date()
      };

      // Generate CBT bot reply
      const botReply = await generateCBTReply(text);
      
      const botMessage = {
        sender: 'bot',
        text: botReply,
        timestamp: new Date()
      };

      // Save to database
      await CBTSession.findOneAndUpdate(
        { userId: studentId },
        {
          $push: {
            messages: [userMessage, botMessage]
          },
          lastUsed: new Date(),
        },
        { new: true, upsert: true }
      );

      // Emit user message first
      io.to(`cbt_chat_${studentId}`).emit('student:chat:message', userMessage);
      
      // Add delay for more natural conversation flow
      setTimeout(() => {
        io.to(`cbt_chat_${studentId}`).emit('student:chat:message', botMessage);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds

    } catch (err) {
      console.error('❌ CBT Socket Send Error:', err);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 CBT Chat client disconnected');
  });
};

// 🎯 Quick action handlers for predefined responses
export const handleQuickAction = async (userId, actionType) => {
  try {
    const quickActionResponses = {
      mood: "I'm here to help you understand your feelings better. How are you feeling right now, and what might have contributed to these emotions?",
      motivation: "Remember that every small step forward is progress! What's one thing you accomplished today, no matter how small?",
      progress: "Let's take a moment to reflect on your journey. What positive changes have you noticed in yourself recently?",
      goals: "Setting achievable goals is powerful! What's one small, specific goal you'd like to work on today?",
      achievements: "Celebrating your wins is important for mental health! What's something you're proud of recently?",
      fun: "Here's a fun CBT technique: Try the 5-4-3-2-1 grounding exercise! Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. How does that feel?"
    };

    const response = quickActionResponses[actionType] || "I'm here to support you. What would you like to talk about today?";
    
    const botMessage = {
      sender: 'bot',
      text: response,
      timestamp: new Date()
    };

    await CBTSession.findOneAndUpdate(
      { userId },
      {
        $push: { messages: [botMessage] },
        lastUsed: new Date(),
      },
      { new: true, upsert: true }
    );

    return response;
  } catch (err) {
    console.error('❌ Quick Action Error:', err);
    throw new Error('Failed to process quick action');
  }
};