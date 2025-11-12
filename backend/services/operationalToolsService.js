import CalendarEvent from '../models/CalendarEvent.js';
import Transport from '../models/Transport.js';
import Asset from '../models/Asset.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

// ============= CALENDAR EVENTS =============

// Get calendar events
export const getCalendarEvents = async (filters = {}) => {
  try {
    const {
      startDate,
      endDate,
      eventType = 'all',
      organizationId = null,
      page = 1,
      limit = 100
    } = filters;
    
    const query = {};
    
    if (startDate && endDate) {
      query.$or = [
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) }},
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) }},
        { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(endDate) }}
      ];
    }
    
    if (eventType !== 'all') {
      query.eventType = eventType;
    }
    
    if (organizationId) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    const total = await CalendarEvent.countDocuments(query);
    
    const events = await CalendarEvent.find(query)
      .sort({ startDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return {
      events,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting calendar events:', error);
    throw error;
  }
};

// Create calendar event
export const createCalendarEvent = async (eventData, createdBy) => {
  try {
    const event = new CalendarEvent({
      ...eventData,
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate),
      organizationId: eventData.organizationId ? new mongoose.Types.ObjectId(eventData.organizationId) : null,
      createdBy: new mongoose.Types.ObjectId(createdBy)
    });
    
    await event.save();
    
    return await CalendarEvent.findById(event._id)
      .populate('createdBy', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// ============= TRANSPORT =============

// Get transport vehicles
export const getTransportVehicles = async (filters = {}) => {
  try {
    const {
      organizationId = null,
      status = 'all',
      search = '',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    
    if (organizationId) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' }},
        { routeName: { $regex: search, $options: 'i' }},
        { driverName: { $regex: search, $options: 'i' }}
      ];
    }
    
    const total = await Transport.countDocuments(query);
    
    const vehicles = await Transport.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('driverId', 'fullName name email phone')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return {
      vehicles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting transport vehicles:', error);
    throw error;
  }
};

// Create transport vehicle
export const createTransportVehicle = async (vehicleData, createdBy) => {
  try {
    const vehicle = new Transport({
      ...vehicleData,
      organizationId: new mongoose.Types.ObjectId(vehicleData.organizationId),
      driverId: vehicleData.driverId ? new mongoose.Types.ObjectId(vehicleData.driverId) : null,
      createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : null
    });
    
    await vehicle.save();
    
    return await Transport.findById(vehicle._id)
      .populate('driverId', 'fullName name email phone')
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error creating transport vehicle:', error);
    throw error;
  }
};

// Update transport location
export const updateTransportLocation = async (vehicleId, location) => {
  try {
    const vehicle = await Transport.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    
    vehicle.currentLocation = {
      coordinates: location,
      lastUpdated: new Date()
    };
    
    await vehicle.save();
    
    return await Transport.findById(vehicleId).lean();
  } catch (error) {
    console.error('Error updating transport location:', error);
    throw error;
  }
};

// ============= ASSETS =============

// Get assets
export const getAssets = async (filters = {}) => {
  try {
    const {
      organizationId = null,
      assetType = 'all',
      status = 'all',
      search = '',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    
    if (organizationId) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    if (assetType !== 'all') {
      query.assetType = assetType;
    }
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { assetId: { $regex: search, $options: 'i' }},
        { name: { $regex: search, $options: 'i' }},
        { serialNumber: { $regex: search, $options: 'i' }}
      ];
    }
    
    const total = await Asset.countDocuments(query);
    
    const assets = await Asset.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('assignedTo.userId', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return {
      assets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting assets:', error);
    throw error;
  }
};

// Create asset
export const createAsset = async (assetData, createdBy) => {
  try {
    const asset = new Asset({
      ...assetData,
      organizationId: new mongoose.Types.ObjectId(assetData.organizationId),
      'assignedTo.userId': assetData.assignedTo?.userId ? new mongoose.Types.ObjectId(assetData.assignedTo.userId) : null,
      createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : null
    });
    
    await asset.save();
    
    return await Asset.findById(asset._id)
      .populate('assignedTo.userId', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

// ============= DOCUMENTS =============

// Get documents
export const getDocuments = async (filters = {}) => {
  try {
    const {
      organizationId = null,
      documentType = 'all',
      category = 'all',
      search = '',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    
    if (organizationId) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    if (documentType !== 'all') {
      query.documentType = documentType;
    }
    
    if (category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' }},
        { description: { $regex: search, $options: 'i' }},
        { keywords: { $in: [new RegExp(search, 'i')] }}
      ];
    }
    
    const total = await Document.countDocuments(query);
    
    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('uploadedBy', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return {
      documents,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

// Create document
export const createDocument = async (documentData, uploadedBy) => {
  try {
    const document = new Document({
      ...documentData,
      organizationId: documentData.organizationId ? new mongoose.Types.ObjectId(documentData.organizationId) : null,
      uploadedBy: new mongoose.Types.ObjectId(uploadedBy),
      validFrom: documentData.validFrom ? new Date(documentData.validFrom) : new Date(),
      validUntil: documentData.validUntil ? new Date(documentData.validUntil) : null,
      isExpired: documentData.validUntil ? new Date(documentData.validUntil) < new Date() : false
    });
    
    await document.save();
    
    return await Document.findById(document._id)
      .populate('uploadedBy', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Get operational statistics
export const getOperationalStats = async (organizationId = null) => {
  try {
    const orgFilter = organizationId ? { organizationId: new mongoose.Types.ObjectId(organizationId) } : {};
    
    const [
      totalEvents,
      upcomingEvents,
      activeVehicles,
      totalAssets,
      availableAssets,
      totalDocuments,
      expiringDocuments
    ] = await Promise.all([
      CalendarEvent.countDocuments(orgFilter),
      CalendarEvent.countDocuments({
        ...orgFilter,
        startDate: { $gte: new Date() },
        status: { $in: ['scheduled', 'in_progress'] }
      }),
      Transport.countDocuments({ ...orgFilter, status: 'active' }),
      Asset.countDocuments(orgFilter),
      Asset.countDocuments({ ...orgFilter, status: 'available' }),
      Document.countDocuments(orgFilter),
      Document.countDocuments({
        ...orgFilter,
        validUntil: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        isExpired: false
      })
    ]);
    
    return {
      calendar: {
        total: totalEvents,
        upcoming: upcomingEvents
      },
      transport: {
        active: activeVehicles
      },
      assets: {
        total: totalAssets,
        available: availableAssets
      },
      documents: {
        total: totalDocuments,
        expiringSoon: expiringDocuments
      }
    };
  } catch (error) {
    console.error('Error getting operational stats:', error);
    throw error;
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

