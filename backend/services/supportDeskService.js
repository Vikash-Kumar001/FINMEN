import SupportTicket from '../models/SupportTicket.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

// Calculate priority score based on various factors
const calculatePriorityScore = (ticket) => {
  let score = 0;
  
  // Severity multiplier
  const severityMultiplier = {
    'critical': 100,
    'high': 50,
    'medium': 25,
    'low': 10
  };
  
  score += severityMultiplier[ticket.severity] || 10;
  
  // Age of ticket (older = higher priority)
  const ageInHours = (new Date() - new Date(ticket.createdAt)) / (1000 * 60 * 60);
  score += Math.min(ageInHours * 2, 50); // Max 50 points for age
  
  // Source dashboard (some dashboards are more critical)
  const sourceMultiplier = {
    'admin': 30,
    'school_admin': 25,
    'csr': 20,
    'teacher': 15,
    'parent': 10,
    'student': 5
  };
  
  score += sourceMultiplier[ticket.sourceDashboard] || 10;
  
  // If assigned to department, reduce score slightly (being handled)
  if (ticket.assignedToDepartment) {
    score -= 10;
  }
  
  // If escalated, increase score
  if (ticket.escalated) {
    score += 30;
  }
  
  // Response time urgency (if near SLA breach)
  if (ticket.sla && ticket.sla.breachTime) {
    const timeToBreach = (new Date(ticket.sla.breachTime) - new Date()) / (1000 * 60 * 60);
    if (timeToBreach < 2) {
      score += 40; // Very urgent if < 2 hours to breach
    } else if (timeToBreach < 4) {
      score += 20; // Urgent if < 4 hours to breach
    }
  }
  
  return Math.round(score);
};

// Auto-route ticket to the right department based on content analysis
const autoRouteTicket = (ticket) => {
  const title = (ticket.subject || ticket.title || '').toLowerCase();
  const description = (ticket.description || ticket.message || '').toLowerCase();
  const category = ticket.category || '';
  
  // Keyword-based routing
  const routingRules = [
    {
      keywords: ['payment', 'billing', 'invoice', 'refund', 'transaction', 'subscription', 'fee'],
      department: 'billing',
      priority: 'high'
    },
    {
      keywords: ['login', 'password', 'account', 'access', 'authentication', 'security', 'hack'],
      department: 'security',
      priority: 'high'
    },
    {
      keywords: ['bug', 'error', 'crash', 'not working', 'broken', 'issue', 'problem', 'glitch'],
      department: 'technical',
      priority: 'medium'
    },
    {
      keywords: ['feature', 'request', 'enhancement', 'new', 'add', 'suggestion'],
      department: 'product',
      priority: 'low'
    },
    {
      keywords: ['data', 'export', 'import', 'backup', 'sync', 'integration'],
      department: 'technical',
      priority: 'medium'
    },
    {
      keywords: ['training', 'how to', 'tutorial', 'guide', 'documentation', 'help'],
      department: 'support',
      priority: 'low'
    },
    {
      keywords: ['school', 'student', 'parent', 'teacher', 'class', 'attendance', 'grades'],
      department: 'education',
      priority: 'medium'
    }
  ];
  
  // Check for matching keywords
  for (const rule of routingRules) {
    const text = `${title} ${description} ${category}`;
    if (rule.keywords.some(keyword => text.includes(keyword))) {
      return {
        department: rule.department,
        priority: rule.priority,
        confidence: 0.8
      };
    }
  }
  
  // Default routing
  return {
    department: 'general',
    priority: ticket.severity || 'medium',
    confidence: 0.5
  };
};

// Generate AI-powered resolution suggestions
const generateResolutionSuggestions = async (ticket) => {
  const suggestions = [];
  
  const title = (ticket.subject || ticket.title || '').toLowerCase();
  const description = (ticket.description || ticket.message || '').toLowerCase();
  const text = `${title} ${description}`;
  
  // Common resolution patterns
  const resolutionPatterns = [
    {
      keywords: ['password', 'forgot', 'reset'],
      suggestions: [
        'Guide user to use "Forgot Password" feature',
        'Verify user identity before reset',
        'Check if account is locked',
        'Review account security settings'
      ]
    },
    {
      keywords: ['payment', 'transaction', 'failed'],
      suggestions: [
        'Check payment gateway status',
        'Verify card/bank details',
        'Check transaction logs',
        'Contact payment provider if needed',
        'Offer alternative payment method'
      ]
    },
    {
      keywords: ['login', 'access', 'cannot'],
      suggestions: [
        'Check account status (active/suspended)',
        'Verify credentials are correct',
        'Check for IP restrictions',
        'Review session timeout settings',
        'Check browser cache/cookies'
      ]
    },
    {
      keywords: ['slow', 'lag', 'performance'],
      suggestions: [
        'Check server load and performance',
        'Review recent deployments',
        'Analyze user location/network',
        'Check database query performance',
        'Review CDN cache status'
      ]
    },
    {
      keywords: ['data', 'missing', 'lost'],
      suggestions: [
        'Check backup systems',
        'Review audit logs',
        'Verify user permissions',
        'Check data sync status',
        'Review database integrity'
      ]
    },
    {
      keywords: ['feature', 'not available', 'missing'],
      suggestions: [
        'Check subscription plan limitations',
        'Verify feature availability for user role',
        'Review feature flags',
        'Check if feature is in beta/testing'
      ]
    }
  ];
  
  // Find matching patterns
  for (const pattern of resolutionPatterns) {
    if (pattern.keywords.some(keyword => text.includes(keyword))) {
      suggestions.push(...pattern.suggestions);
    }
  }
  
  // Add general suggestions if no specific matches
  if (suggestions.length === 0) {
    suggestions.push(
      'Review ticket details and gather more information',
      'Check similar past tickets for solutions',
      'Verify user permissions and access',
      'Review system logs for related errors',
      'Contact user for additional details if needed'
    );
  }
  
  // Add department-specific suggestions based on routing
  const routing = autoRouteTicket(ticket);
  if (routing.department === 'billing') {
    suggestions.push('Check payment history and subscription status');
  } else if (routing.department === 'technical') {
    suggestions.push('Review error logs and system status');
  } else if (routing.department === 'security') {
    suggestions.push('Review security logs and user activity');
  }
  
  // Limit to top 5 suggestions
  return suggestions.slice(0, 5).map((suggestion, index) => ({
    id: `suggestion-${Date.now()}-${index}`,
    text: suggestion,
    confidence: 0.7,
    source: 'ai_analysis'
  }));
};

// Calculate SLA timers
const calculateSLATimers = (ticket) => {
  const severity = ticket.severity || 'medium';
  
  // SLA targets in hours
  const slaTargets = {
    'critical': 1,    // 1 hour
    'high': 4,       // 4 hours
    'medium': 24,    // 24 hours
    'low': 72        // 72 hours
  };
  
  const targetHours = slaTargets[severity] || 24;
  const createdAt = new Date(ticket.createdAt);
  const breachTime = new Date(createdAt.getTime() + targetHours * 60 * 60 * 1000);
  const now = new Date();
  const elapsedHours = (now - createdAt) / (1000 * 60 * 60);
  const remainingHours = (breachTime - now) / (1000 * 60 * 60);
  const progress = Math.min((elapsedHours / targetHours) * 100, 100);
  
  // Determine status
  let status = 'on_time';
  if (remainingHours < 0) {
    status = 'breached';
  } else if (remainingHours < (targetHours * 0.25)) {
    status = 'at_risk';
  } else if (remainingHours < (targetHours * 0.5)) {
    status = 'warning';
  }
  
  return {
    targetHours,
    breachTime,
    elapsedHours: Math.round(elapsedHours * 10) / 10,
    remainingHours: Math.round(remainingHours * 10) / 10,
    progress,
    status,
    isBreached: remainingHours < 0
  };
};

// Get all tickets with unified filtering
export const getTickets = async (filters = {}) => {
  try {
    const {
      status = 'all',
      severity = 'all',
      department = 'all',
      sourceDashboard = 'all',
      search = '',
      page = 1,
      limit = 20,
      sortBy = 'priority',
      sortOrder = 'desc'
    } = filters;
    
    // Build query
    const query = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (severity !== 'all') {
      query.severity = severity;
    }
    
    if (department !== 'all') {
      query.assignedToDepartment = department;
    }
    
    if (sourceDashboard !== 'all') {
      query.sourceDashboard = sourceDashboard;
    }
    
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' }},
        { title: { $regex: search, $options: 'i' }},
        { description: { $regex: search, $options: 'i' }},
        { message: { $regex: search, $options: 'i' }},
        { ticketNumber: { $regex: search, $options: 'i' }}
      ];
    }
    
    // Count total
    const total = await SupportTicket.countDocuments(query);
    
    // Determine sort
    let sort = {};
    if (sortBy === 'priority') {
      // We'll calculate priority after fetching
      sort = { createdAt: sortOrder === 'asc' ? 1 : -1 };
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    
    // Fetch tickets
    const tickets = await SupportTicket.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'fullName email role')
      .populate('assignedTo', 'fullName email role')
      .populate('organizationId', 'name tenantId')
      .populate('orgId', 'name tenantId')
      .lean();
    
    // Calculate priority scores and enrich tickets
    const enrichedTickets = tickets.map(ticket => {
      const priorityScore = calculatePriorityScore(ticket);
      const sla = calculateSLATimers(ticket);
      const routing = ticket.assignedToDepartment 
        ? { department: ticket.assignedToDepartment, confidence: 1 }
        : autoRouteTicket(ticket);
      
      return {
        ...ticket,
        priorityScore,
        sla,
        routing,
        canAutoRoute: !ticket.assignedToDepartment
      };
    });
    
    // Sort by priority if requested
    if (sortBy === 'priority') {
      enrichedTickets.sort((a, b) => {
        return sortOrder === 'desc' 
          ? b.priorityScore - a.priorityScore 
          : a.priorityScore - b.priorityScore;
      });
    }
    
    return {
      tickets: enrichedTickets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting tickets:', error);
    throw error;
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const ticket = await SupportTicket.findById(ticketId)
      .populate('createdBy', 'fullName email role tenantId')
      .populate('assignedTo', 'fullName email role')
      .populate('organizationId', 'name tenantId type')
      .populate('orgId', 'name tenantId type')
      .lean();
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    const priorityScore = calculatePriorityScore(ticket);
    const sla = calculateSLATimers(ticket);
    const routing = ticket.assignedToDepartment 
      ? { department: ticket.assignedToDepartment, confidence: 1 }
      : autoRouteTicket(ticket);
    
    // Generate AI suggestions
    const suggestions = await generateResolutionSuggestions(ticket);
    
    return {
      ...ticket,
      priorityScore,
      sla,
      routing,
      suggestions,
      canAutoRoute: !ticket.assignedToDepartment
    };
  } catch (error) {
    console.error('Error getting ticket:', error);
    throw error;
  }
};

// Create new ticket
export const createTicket = async (ticketData) => {
  try {
    const {
      subject,
      description,
      sourceDashboard,
      createdBy,
      organizationId,
      category,
      severity = 'medium'
    } = ticketData;
    
    // Auto-route the ticket
    const routing = autoRouteTicket({
      subject,
      description,
      category,
      severity,
      sourceDashboard
    });
    
    // Generate ticket number
    const year = new Date().getFullYear();
    const prefix = 'TKT';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const ticketNumber = `${prefix}-${year}-${random}`;
    
    // Calculate initial SLA
    const slaTargets = {
      'critical': 1,
      'high': 4,
      'medium': 24,
      'low': 72
    };
    const targetHours = slaTargets[severity] || 24;
    const breachTime = new Date(Date.now() + targetHours * 60 * 60 * 1000);
    
    // Get user for tenantId/orgId if not provided
    let tenantId = ticketData.tenantId || 'default';
    let orgId = organizationId || null;
    
    if (createdBy) {
      const user = await User.findById(createdBy).select('tenantId orgId').lean();
      if (user) {
        tenantId = user.tenantId || tenantId;
        orgId = user.orgId || orgId;
      }
    }
    
    // If no orgId, try to find from organizationId
    if (!orgId && organizationId) {
      orgId = organizationId;
    }
    
    // If still no orgId, create a default organization reference or use null
    // For admin-created tickets, orgId might be optional
    const ticket = new SupportTicket({
      tenantId,
      orgId: orgId || new mongoose.Types.ObjectId(), // Temporary if needed, or handle in model
      ticketNumber,
      subject: subject || 'Untitled Ticket',
      description: description || '',
      type: category || 'general_inquiry',
      sourceDashboard: sourceDashboard || 'student',
      createdBy,
      organizationId: organizationId || undefined,
      category,
      severity,
      status: 'open',
      assignedToDepartment: routing.department,
      sla: {
        targetHours,
        breachTime,
        status: 'on_time'
      },
      priorityScore: calculatePriorityScore({
        severity,
        sourceDashboard,
        createdAt: new Date()
      })
    });
    
    await ticket.save();
    
    // Populate and enrich
    const enriched = await getTicketById(ticket._id);
    
    return enriched;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Update ticket
export const updateTicket = async (ticketId, updateData, updatedBy) => {
  try {
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // Update fields
    if (updateData.status !== undefined) {
      ticket.status = updateData.status;
      
      if (updateData.status === 'resolved' || updateData.status === 'closed') {
        ticket.resolvedAt = new Date();
        ticket.resolvedBy = updatedBy;
      }
    }
    
    if (updateData.assignedTo !== undefined) {
      ticket.assignedTo = updateData.assignedTo;
    }
    
    if (updateData.assignedToDepartment !== undefined) {
      ticket.assignedToDepartment = updateData.assignedToDepartment;
    }
    
    if (updateData.severity !== undefined) {
      ticket.severity = updateData.severity;
      // Recalculate SLA
      const slaTargets = {
        'critical': 1,
        'high': 4,
        'medium': 24,
        'low': 72
      };
      const targetHours = slaTargets[updateData.severity] || 24;
      ticket.sla = {
        targetHours,
        breachTime: new Date(Date.now() + targetHours * 60 * 60 * 1000),
        status: 'on_time'
      };
    }
    
    if (updateData.resolutionNotes !== undefined) {
      ticket.resolutionNotes = updateData.resolutionNotes;
    }
    
    // Add to audit trail
    ticket.auditTrail = ticket.auditTrail || [];
    ticket.auditTrail.push({
      action: 'updated',
      performedBy: updatedBy,
      performedAt: new Date(),
      changes: updateData
    });
    
    // Recalculate priority
    ticket.priorityScore = calculatePriorityScore(ticket);
    
    await ticket.save();
    
    return await getTicketById(ticketId);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

// Auto-route ticket
export const routeTicket = async (ticketId) => {
  try {
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    if (ticket.assignedToDepartment) {
      return {
        success: false,
        message: 'Ticket already assigned to department'
      };
    }
    
    const routing = autoRouteTicket(ticket);
    ticket.assignedToDepartment = routing.department;
    
    if (routing.priority && !ticket.severity) {
      ticket.severity = routing.priority;
    }
    
    await ticket.save();
    
    return {
      success: true,
      department: routing.department,
      confidence: routing.confidence
    };
  } catch (error) {
    console.error('Error routing ticket:', error);
    throw error;
  }
};

// Get ticket statistics
export const getTicketStats = async (filters = {}) => {
  try {
    const { timeRange = 'month' } = filters;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      ticketsByStatus,
      ticketsBySeverity,
      ticketsByDepartment,
      ticketsBySource,
      avgResolutionTime,
      slaBreaches
    ] = await Promise.all([
      SupportTicket.countDocuments({ createdAt: { $gte: startDate }}),
      SupportTicket.countDocuments({ status: 'open', createdAt: { $gte: startDate }}),
      SupportTicket.countDocuments({ status: 'resolved', createdAt: { $gte: startDate }}),
      SupportTicket.aggregate([
        { $match: { createdAt: { $gte: startDate }}},
        { $group: { _id: '$status', count: { $sum: 1 }}}
      ]),
      SupportTicket.aggregate([
        { $match: { createdAt: { $gte: startDate }}},
        { $group: { _id: '$severity', count: { $sum: 1 }}}
      ]),
      SupportTicket.aggregate([
        { $match: { createdAt: { $gte: startDate }}},
        { $group: { _id: '$assignedToDepartment', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      SupportTicket.aggregate([
        { $match: { createdAt: { $gte: startDate }}},
        { $group: { _id: '$sourceDashboard', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      SupportTicket.aggregate([
        { 
          $match: { 
            status: 'resolved',
            resolvedAt: { $exists: true },
            createdAt: { $gte: startDate }
          }
        },
        {
          $project: {
            resolutionTime: {
              $divide: [
                { $subtract: ['$resolvedAt', '$createdAt']},
                1000 * 60 * 60 // Convert to hours
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgHours: { $avg: '$resolutionTime' }
          }
        }
      ]),
      SupportTicket.countDocuments({
        createdAt: { $gte: startDate },
        'sla.status': 'breached'
      })
    ]);
    
    const avgResTime = avgResolutionTime[0]?.avgHours || 0;
    
    return {
      total: totalTickets,
      open: openTickets,
      resolved: resolvedTickets,
      byStatus: ticketsByStatus || [],
      bySeverity: ticketsBySeverity || [],
      byDepartment: ticketsByDepartment || [],
      bySource: ticketsBySource || [],
      avgResolutionTimeHours: Math.round(avgResTime * 10) / 10,
      slaBreaches: slaBreaches || 0,
      resolutionRate: totalTickets > 0 
        ? Math.round((resolvedTickets / totalTickets) * 100) 
        : 0
    };
  } catch (error) {
    console.error('Error getting ticket stats:', error);
    throw error;
  }
};

export default {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  routeTicket,
  getTicketStats,
  generateResolutionSuggestions,
  calculatePriorityScore,
  autoRouteTicket,
  calculateSLATimers
};

