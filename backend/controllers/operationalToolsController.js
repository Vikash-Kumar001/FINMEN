import operationalToolsService from '../services/operationalToolsService.js';

// ============= CALENDAR EVENTS =============

export const getCalendarEvents = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      eventType: req.query.eventType || 'all',
      organizationId: req.query.organizationId,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 100
    };
    
    const data = await operationalToolsService.getCalendarEvents(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getCalendarEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching calendar events',
      error: error.message
    });
  }
};

export const createCalendarEvent = async (req, res) => {
  try {
    const event = await operationalToolsService.createCalendarEvent(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('operational:event:created', event);
    }
    
    res.status(201).json({
      success: true,
      message: 'Calendar event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Error in createCalendarEvent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating calendar event',
      error: error.message
    });
  }
};

// ============= TRANSPORT =============

export const getTransportVehicles = async (req, res) => {
  try {
    const filters = {
      organizationId: req.query.organizationId,
      status: req.query.status || 'all',
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };
    
    const data = await operationalToolsService.getTransportVehicles(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getTransportVehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transport vehicles',
      error: error.message
    });
  }
};

export const createTransportVehicle = async (req, res) => {
  try {
    const vehicle = await operationalToolsService.createTransportVehicle(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('operational:transport:created', vehicle);
    }
    
    res.status(201).json({
      success: true,
      message: 'Transport vehicle created successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error in createTransportVehicle:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating transport vehicle',
      error: error.message
    });
  }
};

export const updateTransportLocation = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { lat, lng } = req.body;
    
    const vehicle = await operationalToolsService.updateTransportLocation(vehicleId, { lat, lng });
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('operational:transport:location:updated', vehicle);
    }
    
    res.json({
      success: true,
      message: 'Transport location updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error in updateTransportLocation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating transport location',
      error: error.message
    });
  }
};

// ============= ASSETS =============

export const getAssets = async (req, res) => {
  try {
    const filters = {
      organizationId: req.query.organizationId,
      assetType: req.query.assetType || 'all',
      status: req.query.status || 'all',
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };
    
    const data = await operationalToolsService.getAssets(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getAssets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assets',
      error: error.message
    });
  }
};

export const createAsset = async (req, res) => {
  try {
    const asset = await operationalToolsService.createAsset(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('operational:asset:created', asset);
    }
    
    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset
    });
  } catch (error) {
    console.error('Error in createAsset:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating asset',
      error: error.message
    });
  }
};

// ============= DOCUMENTS =============

export const getDocuments = async (req, res) => {
  try {
    const filters = {
      organizationId: req.query.organizationId,
      documentType: req.query.documentType || 'all',
      category: req.query.category || 'all',
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };
    
    const data = await operationalToolsService.getDocuments(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getDocuments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

export const createDocument = async (req, res) => {
  try {
    // In production, handle file upload using multer
    const documentData = {
      ...req.body,
      filePath: req.file?.path || req.body.filePath,
      filename: req.file?.filename || req.body.filename,
      originalFilename: req.file?.originalname || req.body.originalFilename,
      fileSize: req.file?.size || req.body.fileSize,
      mimeType: req.file?.mimetype || req.body.mimeType
    };
    
    const document = await operationalToolsService.createDocument(
      documentData,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('operational:document:created', document);
    }
    
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });
  } catch (error) {
    console.error('Error in createDocument:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading document',
      error: error.message
    });
  }
};

// ============= STATISTICS =============

export const getOperationalStats = async (req, res) => {
  try {
    const stats = await operationalToolsService.getOperationalStats(
      req.query.organizationId
    );
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getOperationalStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching operational statistics',
      error: error.message
    });
  }
};

export default {
  getCalendarEvents,
  createCalendarEvent,
  getTransportVehicles,
  createTransportVehicle,
  updateTransportLocation,
  getAssets,
  createAsset,
  getDocuments,
  createDocument,
  getOperationalStats
};

