import communicationService from '../services/communicationService.js';

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'all',
      messageType: req.query.messageType || 'all',
      recipientType: req.query.recipientType || 'all',
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };
    
    const data = await communicationService.getMessages(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// Send broadcast message
export const sendBroadcast = async (req, res) => {
  try {
    const message = await communicationService.sendBroadcast(
      req.body,
      req.user._id
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('communication:broadcast:sent', message);
      if (message.status === 'sent') {
        io.emit('communication:message:received', {
          messageId: message._id,
          subject: message.subject,
          recipientCount: message.stats?.totalRecipients
        });
      }
    }
    
    res.status(201).json({
      success: true,
      message: message.isScheduled ? 'Message scheduled successfully' : 'Broadcast sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error in sendBroadcast:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending broadcast',
      error: error.message
    });
  }
};

// Create automated reminder
export const createReminder = async (req, res) => {
  try {
    const reminder = await communicationService.createReminder(
      req.body,
      req.user._id
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('communication:reminder:created', reminder);
    }
    
    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: reminder
    });
  } catch (error) {
    console.error('Error in createReminder:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating reminder',
      error: error.message
    });
  }
};

// Get templates
export const getTemplates = async (req, res) => {
  try {
    const filters = {
      category: req.query.category || 'all',
      status: req.query.status || 'all',
      search: req.query.search || '',
      organizationId: req.query.organizationId
    };
    
    const templates = await communicationService.getTemplates(filters);
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error in getTemplates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    });
  }
};

// Create template
export const createTemplate = async (req, res) => {
  try {
    const template = await communicationService.createTemplate(
      req.body,
      req.user._id
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('communication:template:created', template);
    }
    
    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });
  } catch (error) {
    console.error('Error in createTemplate:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating template',
      error: error.message
    });
  }
};

// Get delivery analytics
export const getDeliveryAnalytics = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      channel: req.query.channel || 'all',
      organizationId: req.query.organizationId
    };
    
    const analytics = await communicationService.getDeliveryAnalytics(filters);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error in getDeliveryAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery analytics',
      error: error.message
    });
  }
};

// Get communication statistics
export const getCommunicationStats = async (req, res) => {
  try {
    const stats = await communicationService.getCommunicationStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getCommunicationStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching communication statistics',
      error: error.message
    });
  }
};

export default {
  getMessages,
  sendBroadcast,
  createReminder,
  getTemplates,
  createTemplate,
  getDeliveryAnalytics,
  getCommunicationStats
};

