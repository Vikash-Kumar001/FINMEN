import contentGovernanceService from '../services/contentGovernanceService.js';

// Get all content
export const getContent = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'all',
      type: req.query.type || 'all',
      category: req.query.category || 'all',
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
      ageRating: req.query.ageRating || 'all',
      region: req.query.region || 'all'
    };
    
    const data = await contentGovernanceService.getContent(filters);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('content:governance:update', data);
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getContent:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// Get content by ID
export const getContentById = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    const content = await contentGovernanceService.getContentById(contentId);

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error in getContentById:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching content',
      error: error.message
    });
  }
};

// Approve content
export const approveContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { comments } = req.body;
    
    const content = await contentGovernanceService.approveContent(contentId, req.user._id, comments);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('content:approved', content);
      io.to('admin').emit('content:governance:update', await contentGovernanceService.getContent({}));
      
      // Notify content creator
      if (content.createdBy?._id) {
        io.to(content.createdBy._id.toString()).emit('content:status:update', {
          contentId: content._id,
          status: 'approved',
          message: 'Your content has been approved'
        });
      }
    }

    res.json({
      success: true,
      data: content,
      message: 'Content approved successfully'
    });
  } catch (error) {
    console.error('Error in approveContent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error approving content',
      error: error.message
    });
  }
};

// Reject content
export const rejectContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    const content = await contentGovernanceService.rejectContent(contentId, req.user._id, rejectionReason);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('content:rejected', content);
      io.to('admin').emit('content:governance:update', await contentGovernanceService.getContent({}));
      
      // Notify content creator
      if (content.createdBy?._id) {
        io.to(content.createdBy._id.toString()).emit('content:status:update', {
          contentId: content._id,
          status: 'rejected',
          message: 'Your content has been rejected',
          reason: rejectionReason
        });
      }
    }

    res.json({
      success: true,
      data: content,
      message: 'Content rejected successfully'
    });
  } catch (error) {
    console.error('Error in rejectContent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error rejecting content',
      error: error.message
    });
  }
};

// Check age appropriateness
export const checkAgeAppropriate = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userAge } = req.body;
    
    if (!userAge) {
      return res.status(400).json({
        success: false,
        message: 'User age is required'
      });
    }
    
    const check = await contentGovernanceService.checkContentAgeAppropriate(contentId, parseInt(userAge));

    res.json({
      success: true,
      data: check
    });
  } catch (error) {
    console.error('Error in checkAgeAppropriate:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking age appropriateness',
      error: error.message
    });
  }
};

// Set region restrictions
export const setRegionRestrictions = async (req, res) => {
  try {
    const { contentId } = req.params;
    const restrictions = req.body;
    
    const content = await contentGovernanceService.setRegionRestrictions(contentId, restrictions, req.user._id);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('content:region:restricted', content);
    }

    res.json({
      success: true,
      data: content,
      message: 'Region restrictions updated successfully'
    });
  } catch (error) {
    console.error('Error in setRegionRestrictions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error setting region restrictions',
      error: error.message
    });
  }
};

// Get content analytics
export const getContentAnalytics = async (req, res) => {
  try {
    const filters = {
      timeRange: req.query.timeRange || 'month',
      contentId: req.query.contentId,
      type: req.query.type || 'all',
      category: req.query.category || 'all'
    };
    
    const analytics = await contentGovernanceService.getContentAnalytics(filters);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error in getContentAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content analytics',
      error: error.message
    });
  }
};

// Get governance statistics
export const getGovernanceStats = async (req, res) => {
  try {
    const filters = {
      organizationId: req.query.organizationId
    };
    
    const stats = await contentGovernanceService.getGovernanceStats(filters);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getGovernanceStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching governance statistics',
      error: error.message
    });
  }
};

export default {
  getContent,
  getContentById,
  approveContent,
  rejectContent,
  checkAgeAppropriate,
  setRegionRestrictions,
  getContentAnalytics,
  getGovernanceStats
};

