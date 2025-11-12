import userLifecycleService from '../services/userLifecycleService.js';

// Bulk onboard users
export const bulkOnboard = async (req, res) => {
  try {
    const { users, options } = req.body;
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Users array is required'
      });
    }
    
    const result = await userLifecycleService.bulkOnboardUsers(users, {
      ...options,
      importedBy: req.user._id
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('lifecycle:bulk-onboard:complete', result);
      io.to('admin').emit('lifecycle:stats:update', await userLifecycleService.getLifecycleStats());
    }

    res.json({
      success: true,
      data: result,
      message: `Bulk onboarding completed: ${result.created} created, ${result.updated} updated`
    });
  } catch (error) {
    console.error('Error in bulkOnboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error during bulk onboarding',
      error: error.message
    });
  }
};

// Sync teacher roster from HRIS
export const syncHRIS = async (req, res) => {
  try {
    const { hrisData, options } = req.body;
    
    if (!hrisData || !Array.isArray(hrisData) || hrisData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'HRIS data array is required'
      });
    }
    
    const result = await userLifecycleService.syncTeacherRoster(hrisData, {
      ...options,
      syncedBy: req.user._id
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('lifecycle:hris:sync:complete', result);
      io.to('admin').emit('lifecycle:stats:update', await userLifecycleService.getLifecycleStats());
    }

    res.json({
      success: true,
      data: result,
      message: `HRIS sync completed: ${result.synced} teachers synced`
    });
  } catch (error) {
    console.error('Error in syncHRIS:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing HRIS data',
      error: error.message
    });
  }
};

// Process graduation and promotion
export const processGraduationPromotion = async (req, res) => {
  try {
    const options = req.body;
    
    const result = await userLifecycleService.processGraduationAndPromotion({
      ...options,
      processedBy: req.user._id
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('lifecycle:graduation:complete', result);
      io.to('admin').emit('lifecycle:stats:update', await userLifecycleService.getLifecycleStats());
    }

    res.json({
      success: true,
      data: result,
      message: `Processed: ${result.promoted} promoted, ${result.graduated} graduated`
    });
  } catch (error) {
    console.error('Error in processGraduationPromotion:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing graduation/promotion',
      error: error.message
    });
  }
};

// Link parent and student
export const linkParentStudent = async (req, res) => {
  try {
    const { parentData, studentData, options } = req.body;
    
    if (!parentData?.email || !studentData?.email) {
      return res.status(400).json({
        success: false,
        message: 'Parent and student emails are required'
      });
    }
    
    const result = await userLifecycleService.linkParentStudent(parentData, studentData, options);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('lifecycle:link:complete', result);
      io.to('admin').emit('lifecycle:stats:update', await userLifecycleService.getLifecycleStats());
    }

    res.json({
      success: true,
      data: result,
      message: 'Parent and student linked successfully'
    });
  } catch (error) {
    console.error('Error in linkParentStudent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error linking parent and student',
      error: error.message
    });
  }
};

// Bulk link parent-student
export const bulkLinkParentStudent = async (req, res) => {
  try {
    const { linkDataList, options } = req.body;
    
    if (!linkDataList || !Array.isArray(linkDataList) || linkDataList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Link data array is required'
      });
    }
    
    const result = await userLifecycleService.bulkLinkParentStudent(linkDataList, options);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('lifecycle:bulk-link:complete', result);
      io.to('admin').emit('lifecycle:stats:update', await userLifecycleService.getLifecycleStats());
    }

    res.json({
      success: true,
      data: result,
      message: `Bulk linking completed: ${result.linked} links created`
    });
  } catch (error) {
    console.error('Error in bulkLinkParentStudent:', error);
    res.status(500).json({
      success: false,
      message: 'Error during bulk linking',
      error: error.message
    });
  }
};

// Get lifecycle statistics
export const getLifecycleStats = async (req, res) => {
  try {
    const filters = {
      organizationId: req.query.organizationId,
      tenantId: req.query.tenantId
    };
    
    const stats = await userLifecycleService.getLifecycleStats(filters);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getLifecycleStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lifecycle statistics',
      error: error.message
    });
  }
};

export default {
  bulkOnboard,
  syncHRIS,
  processGraduationPromotion,
  linkParentStudent,
  bulkLinkParentStudent,
  getLifecycleStats
};

