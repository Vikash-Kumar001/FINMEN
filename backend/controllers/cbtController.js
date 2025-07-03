import CBTSession from '../models/CBTSession.js';
import { generateCBTReply } from '../utils/cbtBotEngine.js'; // AI reply logic

// 🧠 POST /api/cbt/chat
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
