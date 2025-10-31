import AdminApprovalRequest from '../models/AdminApprovalRequest.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new approval request
export const createApprovalRequest = async (req, res) => {
  try {
    const { approvalType, targetType, targetId, justification } = req.body;
    const userId = req.user._id;

    if (!approvalType || !targetType || !targetId || !justification) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: approvalType, targetType, targetId, justification'
      });
    }

    // Check for duplicate pending request
    const existingRequest = await AdminApprovalRequest.findOne({
      requestedBy: userId,
      targetType,
      targetId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'A pending request already exists for this target'
      });
    }

    const approvalRequest = await AdminApprovalRequest.create({
      requestedBy: userId,
      approvalType,
      targetType,
      targetId,
      justification,
      auditTrail: [{
        action: 'created',
        performedBy: userId,
        metadata: { approvalType, targetType, targetId }
      }]
    });

    res.json({
      success: true,
      message: 'Approval request created successfully',
      data: approvalRequest
    });
  } catch (error) {
    console.error('Error creating approval request:', error);
    res.status(500).json({ success: false, message: 'Error creating approval request' });
  }
};

// Get all approval requests (filtered by status)
export const getApprovalRequests = async (req, res) => {
  try {
    const { status, requestedBy } = req.query;
    const userId = req.user._id;

    let query = {};
    
    // Regular admins can only see their own requests, super admins can see all
    const isSuperAdmin = req.user.adminLevel === 'super';
    if (!isSuperAdmin) {
      query.requestedBy = userId;
    } else if (requestedBy) {
      query.requestedBy = requestedBy;
    }

    if (status) {
      query.status = status;
    }

    const requests = await AdminApprovalRequest.find(query)
      .populate('requestedBy', 'name email')
      .populate('approvedBy.admin', 'name email')
      .populate('dataAccessed.accessedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching approval requests:', error);
    res.status(500).json({ success: false, message: 'Error fetching approval requests' });
  }
};

// Approve an approval request (requires second approval)
export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { comments } = req.body;
    const userId = req.user._id;

    const approvalRequest = await AdminApprovalRequest.findById(requestId);

    if (!approvalRequest) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    if (approvalRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${approvalRequest.status}`
      });
    }

    // Check if request has expired
    if (new Date() > approvalRequest.expiryDate) {
      approvalRequest.status = 'expired';
      approvalRequest.auditTrail.push({
        action: 'expired',
        performedBy: userId
      });
      await approvalRequest.save();

      return res.status(400).json({
        success: false,
        message: 'Approval request has expired'
      });
    }

    // Add approval
    approvalRequest.approvedBy.push({
      admin: userId,
      approvedAt: new Date(),
      comments
    });

    // Check if we have dual approval (2 admin approvals)
    if (approvalRequest.approvedBy.length >= 2) {
      approvalRequest.status = 'approved';
      approvalRequest.auditTrail.push({
        action: 'approved',
        performedBy: userId,
        metadata: { totalApprovals: approvalRequest.approvedBy.length }
      });
    } else {
      approvalRequest.auditTrail.push({
        action: 'approved',
        performedBy: userId,
        metadata: { approvalNumber: approvalRequest.approvedBy.length, totalRequired: 2 }
      });
    }

    await approvalRequest.save();

    res.json({
      success: true,
      message: approvalRequest.status === 'approved' 
        ? 'Request approved with dual authorization' 
        : 'First approval received, waiting for second approval',
      data: approvalRequest
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ success: false, message: 'Error approving request' });
  }
};

// Reject an approval request
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const approvalRequest = await AdminApprovalRequest.findById(requestId);

    if (!approvalRequest) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    if (approvalRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${approvalRequest.status}`
      });
    }

    approvalRequest.status = 'rejected';
    approvalRequest.auditTrail.push({
      action: 'rejected',
      performedBy: userId,
      metadata: { reason }
    });

    await approvalRequest.save();

    res.json({
      success: true,
      message: 'Approval request rejected',
      data: approvalRequest
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ success: false, message: 'Error rejecting request' });
  }
};

// Access approved data (logs access)
export const accessApprovedData = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { fields } = req.body;

    const approvalRequest = await AdminApprovalRequest.findById(requestId);

    if (!approvalRequest) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    if (approvalRequest.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Request must be approved to access data'
      });
    }

    // Check if request has expired
    if (new Date() > approvalRequest.expiryDate) {
      approvalRequest.status = 'expired';
      approvalRequest.auditTrail.push({
        action: 'expired',
        performedBy: req.user._id
      });
      await approvalRequest.save();

      return res.status(400).json({
        success: false,
        message: 'Approval has expired. Please submit a new request.'
      });
    }

    // Log data access
    approvalRequest.dataAccessed = {
      accessedAt: new Date(),
      accessedBy: req.user._id,
      fieldsAccessed: fields || [],
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    approvalRequest.auditTrail.push({
      action: 'accessed',
      performedBy: req.user._id,
      metadata: { fieldsAccessed: fields }
    });

    await approvalRequest.save();

    // Now fetch and return the actual data based on targetType
    let data = null;
    
    if (approvalRequest.targetType === 'student') {
      const db = mongoose.connection.db;
      const student = await db.collection('schoolstudents').findOne({ 
        _id: new mongoose.Types.ObjectId(approvalRequest.targetId) 
      });
      
      if (student) {
        // Only return requested fields
        if (fields && fields.length > 0) {
          const filteredData = {};
          fields.forEach(field => {
            if (student[field] !== undefined) {
              filteredData[field] = student[field];
            }
          });
          data = filteredData;
        } else {
          // Return all data if no specific fields requested
          data = student;
        }
      }
    }

    res.json({
      success: true,
      message: 'Data accessed successfully',
      data,
      approvalDetails: {
        requestId: approvalRequest._id,
        justification: approvalRequest.justification,
        approvedBy: approvalRequest.approvedBy,
        accessedAt: approvalRequest.dataAccessed.accessedAt
      }
    });
  } catch (error) {
    console.error('Error accessing approved data:', error);
    res.status(500).json({ success: false, message: 'Error accessing approved data' });
  }
};

// Get approval statistics for dashboard
export const getApprovalStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const isSuperAdmin = req.user.adminLevel === 'super';

    let query = {};
    if (!isSuperAdmin) {
      query.requestedBy = userId;
    }

    const stats = await AdminApprovalRequest.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRequests = await AdminApprovalRequest.countDocuments(query);
    const pendingApprovals = await AdminApprovalRequest.countDocuments({ ...query, status: 'pending' });

    res.json({
      success: true,
      data: {
        totalRequests,
        pendingApprovals,
        byStatus: stats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching approval stats' });
  }
};

