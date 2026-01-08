import { getChatResponse, getChatHistory } from '../services/aiService.js';

// @desc    Send message to AI chatbot
// @route   POST /api/chatbot/chat
// @access  Private
export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = await getChatResponse(req.user.id, message.trim());

    res.json({
      message: response,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      message: 'Failed to get AI response. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chatbot/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const history = await getChatHistory(req.user.id);
    res.json({ messages: history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






