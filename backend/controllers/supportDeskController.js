import supportDeskService from '../services/supportDeskService.js';

// Get all tickets
export const getTickets = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'all',
      severity: req.query.severity || 'all',
      department: req.query.department || 'all',
      sourceDashboard: req.query.sourceDashboard || 'all',
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sortBy: req.query.sortBy || 'priority',
      sortOrder: req.query.sortOrder || 'desc'
    };
    
    const data = await supportDeskService.getTickets(filters);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('support:tickets:update', data);
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getTickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
      error: error.message
    });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await supportDeskService.getTicketById(ticketId);

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Error in getTicketById:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching ticket',
      error: error.message
    });
  }
};

// Create new ticket
export const createTicket = async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const ticket = await supportDeskService.createTicket(ticketData);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('support:ticket:new', ticket);
      io.to('admin').emit('support:tickets:update', await supportDeskService.getTickets({}));
      
      // Alert if high priority
      if (ticket.severity === 'critical' || ticket.severity === 'high') {
        io.to('admin').emit('support:ticket:alert', {
          ticketId: ticket._id,
          ticketNumber: ticket.ticketNumber,
          severity: ticket.severity,
          message: `New ${ticket.severity} priority ticket: ${ticket.ticketNumber}`,
          ticket
        });
      }
    }

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket created successfully'
    });
  } catch (error) {
    console.error('Error in createTicket:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ticket',
      error: error.message
    });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const updateData = req.body;
    
    const ticket = await supportDeskService.updateTicket(ticketId, updateData, req.user._id);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('support:ticket:updated', ticket);
      io.to('admin').emit('support:tickets:update', await supportDeskService.getTickets({}));
      
      // Alert if status changed to resolved
      if (updateData.status === 'resolved' || updateData.status === 'closed') {
        io.to('admin').emit('support:ticket:resolved', {
          ticketId: ticket._id,
          ticketNumber: ticket.ticketNumber,
          resolvedBy: req.user._id
        });
      }
    }

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    console.error('Error in updateTicket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating ticket',
      error: error.message
    });
  }
};

// Auto-route ticket
export const routeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const result = await supportDeskService.routeTicket(ticketId);

    if (!result.success) {
      return res.json({
        success: false,
        message: result.message
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const ticket = await supportDeskService.getTicketById(ticketId);
      io.to('admin').emit('support:ticket:routed', {
        ticketId,
        department: result.department,
        confidence: result.confidence,
        ticket
      });
      io.to('admin').emit('support:tickets:update', await supportDeskService.getTickets({}));
    }

    res.json({
      success: true,
      data: result,
      message: 'Ticket routed successfully'
    });
  } catch (error) {
    console.error('Error in routeTicket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error routing ticket',
      error: error.message
    });
  }
};

// Get ticket statistics
export const getTicketStats = async (req, res) => {
  try {
    const filters = {
      timeRange: req.query.timeRange || 'month'
    };
    
    const stats = await supportDeskService.getTicketStats(filters);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getTicketStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket statistics',
      error: error.message
    });
  }
};

// Get AI suggestions for a ticket
export const getTicketSuggestions = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await supportDeskService.getTicketById(ticketId);
    const suggestions = await supportDeskService.generateResolutionSuggestions(ticket);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error in getTicketSuggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating suggestions',
      error: error.message
    });
  }
};

export default {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  routeTicket,
  getTicketStats,
  getTicketSuggestions
};

