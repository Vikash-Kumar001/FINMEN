import CommunicationMessage from '../models/CommunicationMessage.js';
import CommunicationTemplate from '../models/CommunicationTemplate.js';
import CommunicationDeliveryLog from '../models/CommunicationDeliveryLog.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

// Get all messages
export const getMessages = async (filters = {}) => {
  try {
    const {
      status = 'all',
      messageType = 'all',
      recipientType = 'all',
      search = '',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (messageType !== 'all') {
      query.messageType = messageType;
    }
    
    if (recipientType !== 'all') {
      query.recipientType = recipientType;
    }
    
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' }},
        { message: { $regex: search, $options: 'i' }}
      ];
    }
    
    const total = await CommunicationMessage.countDocuments(query);
    
    const messages = await CommunicationMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sentBy', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return {
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Create and send broadcast message
export const sendBroadcast = async (messageData, sentBy) => {
  try {
    const {
      subject,
      message,
      recipientType,
      recipientIds = [],
      recipientRoles = [],
      organizationIds = [],
      channels = ['email'],
      priority = 'normal',
      isUrgent = false,
      attachments = [],
      scheduledAt = null
    } = messageData;
    
    // Get sender info
    const sender = await User.findById(sentBy).select('fullName name email').lean();
    
    // Determine recipients
    let recipientUserIds = [];
    
    if (recipientType === 'all') {
      const allUsers = await User.find({}).select('_id').lean();
      recipientUserIds = allUsers.map(u => u._id);
    } else if (recipientType === 'custom' && recipientIds.length > 0) {
      recipientUserIds = recipientIds.map(id => new mongoose.Types.ObjectId(id));
    } else if (recipientRoles.length > 0) {
      const roleUsers = await User.find({
        role: { $in: recipientRoles }
      }).select('_id').lean();
      recipientUserIds = roleUsers.map(u => u._id);
    } else if (organizationIds.length > 0) {
      const orgUsers = await User.find({
        orgId: { $in: organizationIds.map(id => new mongoose.Types.ObjectId(id)) }
      }).select('_id').lean();
      recipientUserIds = orgUsers.map(u => u._id);
    } else {
      // Default: students, teachers, parents
      const defaultUsers = await User.find({
        role: { $in: ['student', 'school_student', 'teacher', 'parent'] }
      }).select('_id').lean();
      recipientUserIds = defaultUsers.map(u => u._id);
    }
    
    const isScheduled = scheduledAt && new Date(scheduledAt) > new Date();
    
    const communicationMessage = new CommunicationMessage({
      subject,
      message,
      messageType: 'broadcast',
      recipientType,
      recipientIds: recipientUserIds,
      recipientRoles,
      organizationIds: organizationIds.map(id => new mongoose.Types.ObjectId(id)),
      channels,
      priority,
      isUrgent,
      attachments,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      isScheduled,
      sentBy: new mongoose.Types.ObjectId(sentBy),
      senderName: sender?.fullName || sender?.name,
      senderEmail: sender?.email,
      status: isScheduled ? 'scheduled' : 'draft',
      stats: {
        totalRecipients: recipientUserIds.length
      }
    });
    
    await communicationMessage.save();
    
    // If not scheduled, send immediately
    if (!isScheduled) {
      // In a real implementation, this would trigger actual sending
      // For now, we'll mark it as sent and create delivery logs
      communicationMessage.status = 'sent';
      communicationMessage.sentAt = new Date();
      await communicationMessage.save();
      
      // Create delivery logs (mock implementation)
      // In production, this would integrate with actual email/SMS/push services
      // await createDeliveryLogs(communicationMessage._id, recipientUserIds, channels);
    }
    
    return await CommunicationMessage.findById(communicationMessage._id)
      .populate('sentBy', 'fullName name email')
      .lean();
  } catch (error) {
    console.error('Error sending broadcast:', error);
    throw error;
  }
};

// Create automated reminder
export const createReminder = async (reminderData, createdBy) => {
  try {
    const {
      subject,
      message,
      reminderType,
      recipientType,
      recipientIds = [],
      recipientRoles = [],
      organizationIds = [],
      channels = ['email'],
      frequency = 'once',
      interval = 1,
      maxReminders = 3,
      scheduledAt = null
    } = reminderData;
    
    const sender = await User.findById(createdBy).select('fullName name email').lean();
    
    const communicationMessage = new CommunicationMessage({
      subject,
      message,
      messageType: 'reminder',
      recipientType,
      recipientIds: recipientIds.map(id => new mongoose.Types.ObjectId(id)),
      recipientRoles,
      organizationIds: organizationIds.map(id => new mongoose.Types.ObjectId(id)),
      channels,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      isScheduled: !!scheduledAt,
      sentBy: new mongoose.Types.ObjectId(createdBy),
      senderName: sender?.fullName || sender?.name,
      senderEmail: sender?.email,
      status: scheduledAt ? 'scheduled' : 'draft',
      reminderConfig: {
        reminderType,
        frequency,
        interval,
        maxReminders,
        reminderCount: 0
      }
    });
    
    await communicationMessage.save();
    
    return await CommunicationMessage.findById(communicationMessage._id)
      .populate('sentBy', 'fullName name email')
      .lean();
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

// Get templates
export const getTemplates = async (filters = {}) => {
  try {
    const {
      category = 'all',
      status = 'all',
      search = '',
      organizationId = null
    } = filters;
    
    const query = {};
    
    if (category !== 'all') {
      query.category = category;
    }
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' }},
        { description: { $regex: search, $options: 'i' }}
      ];
    }
    
    // Include global templates or org-specific
    if (organizationId) {
      query.$or = [
        { isGlobal: true },
        { organizationId: new mongoose.Types.ObjectId(organizationId) }
      ];
    } else {
      query.isGlobal = true;
    }
    
    const templates = await CommunicationTemplate.find(query)
      .sort({ usageCount: -1, createdAt: -1 })
      .populate('createdBy', 'fullName name email')
      .lean();
    
    return templates;
  } catch (error) {
    console.error('Error getting templates:', error);
    throw error;
  }
};

// Create template
export const createTemplate = async (templateData, createdBy) => {
  try {
    const {
      name,
      description,
      category,
      subject,
      body,
      bodyHtml,
      channels,
      variables = [],
      defaultRecipientType,
      organizationId,
      isGlobal = false
    } = templateData;
    
    const template = new CommunicationTemplate({
      name,
      description,
      category,
      subject,
      body,
      bodyHtml,
      channels: channels || ['email'],
      variables,
      defaultRecipientType,
      organizationId: organizationId ? new mongoose.Types.ObjectId(organizationId) : null,
      isGlobal,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      status: 'active'
    });
    
    await template.save();
    
    return await CommunicationTemplate.findById(template._id)
      .populate('createdBy', 'fullName name email')
      .lean();
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

// Get delivery analytics
export const getDeliveryAnalytics = async (filters = {}) => {
  try {
    const {
      startDate,
      endDate,
      channel = 'all',
      organizationId = null
    } = filters;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }
    
    if (channel !== 'all') {
      dateFilter.channel = channel;
    }
    
    if (organizationId) {
      dateFilter.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    const [
      totalSent,
      delivered,
      opened,
      clicked,
      failed,
      byChannel,
      byStatus,
      recentDeliveries
    ] = await Promise.all([
      CommunicationDeliveryLog.countDocuments(dateFilter),
      CommunicationDeliveryLog.countDocuments({ ...dateFilter, status: 'delivered' }),
      CommunicationDeliveryLog.countDocuments({ ...dateFilter, status: 'opened' }),
      CommunicationDeliveryLog.countDocuments({ ...dateFilter, status: 'clicked' }),
      CommunicationDeliveryLog.countDocuments({ ...dateFilter, status: 'failed' }),
      CommunicationDeliveryLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$channel', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      CommunicationDeliveryLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      CommunicationDeliveryLog.find(dateFilter)
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('recipientId', 'fullName name email role')
        .populate('messageId', 'subject messageType')
        .lean()
    ]);
    
    const deliveryRate = totalSent > 0 ? ((delivered / totalSent) * 100).toFixed(2) : 0;
    const openRate = delivered > 0 ? ((opened / delivered) * 100).toFixed(2) : 0;
    const clickRate = opened > 0 ? ((clicked / opened) * 100).toFixed(2) : 0;
    
    return {
      totalSent,
      delivered,
      opened,
      clicked,
      failed,
      deliveryRate: parseFloat(deliveryRate),
      openRate: parseFloat(openRate),
      clickRate: parseFloat(clickRate),
      byChannel: byChannel || [],
      byStatus: byStatus || [],
      recentDeliveries: recentDeliveries || []
    };
  } catch (error) {
    console.error('Error getting delivery analytics:', error);
    throw error;
  }
};

// Get communication statistics
export const getCommunicationStats = async () => {
  try {
    const [
      totalMessages,
      scheduledMessages,
      sentMessages,
      byMessageType,
      byChannel,
      byRecipientType,
      totalTemplates
    ] = await Promise.all([
      CommunicationMessage.countDocuments(),
      CommunicationMessage.countDocuments({ status: 'scheduled' }),
      CommunicationMessage.countDocuments({ status: 'sent' }),
      CommunicationMessage.aggregate([
        { $group: { _id: '$messageType', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      CommunicationMessage.aggregate([
        { $unwind: '$channels' },
        { $group: { _id: '$channels', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      CommunicationMessage.aggregate([
        { $group: { _id: '$recipientType', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      CommunicationTemplate.countDocuments({ status: 'active' })
    ]);
    
    return {
      totalMessages,
      scheduledMessages,
      sentMessages,
      draftMessages: await CommunicationMessage.countDocuments({ status: 'draft' }),
      byMessageType: byMessageType || [],
      byChannel: byChannel || [],
      byRecipientType: byRecipientType || [],
      totalTemplates
    };
  } catch (error) {
    console.error('Error getting communication stats:', error);
    throw error;
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

