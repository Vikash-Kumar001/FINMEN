import Incident from '../models/Incident.js';
import User from '../models/User.js';
import { createPrivacyIncident, autoGeneratePrivacyIncident } from '../services/privacyIncidentService.js';
import { checkSLABreaches, getIncidentManagementURL } from '../services/slaMonitorService.js';

/**
 * Get all incidents
 */
export const getIncidents = async (req, res) => {
  try {
    const { status, severity, incidentType, limit = 50 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (incidentType) query.incidentType = incidentType;

    const incidents = await Incident.find(query)
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: incidents
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ success: false, message: 'Error fetching incidents' });
  }
};

/**
 * Get incident by ID
 */
export const getIncidentById = async (req, res) => {
  try {
    const { incidentId } = req.params;

    const incident = await Incident.findById(incidentId)
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email')
      .populate('auditTrail.performedBy', 'name email');

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    res.json({
      success: true,
      data: incident
    });
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ success: false, message: 'Error fetching incident' });
  }
};

/**
 * Create manual incident
 */
export const createIncident = async (req, res) => {
  try {
    const incidentData = req.body;
    const userId = req.user._id;

    const incident = await Incident.create({
      ...incidentData,
      auditTrail: [{
        action: 'created',
        performedBy: userId,
        metadata: { source: 'manual' }
      }]
    });

    res.json({
      success: true,
      message: 'Incident created successfully',
      data: incident
    });
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ success: false, message: 'Error creating incident' });
  }
};

/**
 * Update incident
 */
export const updateIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const updates = req.body;
    const userId = req.user._id;

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        incident[key] = updates[key];
      }
    });

    // Add audit trail
    incident.auditTrail.push({
      action: 'updated',
      performedBy: userId,
      metadata: { updatedFields: Object.keys(updates) }
    });

    await incident.save();

    res.json({
      success: true,
      message: 'Incident updated successfully',
      data: incident
    });
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ success: false, message: 'Error updating incident' });
  }
};

/**
 * Assign incident to user
 */
export const assignIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { assignedTo } = req.body;
    const userId = req.user._id;

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    incident.assignedTo = assignedTo;
    incident.auditTrail.push({
      action: 'assigned',
      performedBy: userId,
      metadata: { assignedTo }
    });

    await incident.save();

    res.json({
      success: true,
      message: 'Incident assigned successfully',
      data: incident
    });
  } catch (error) {
    console.error('Error assigning incident:', error);
    res.status(500).json({ success: false, message: 'Error assigning incident' });
  }
};

/**
 * Resolve incident
 */
export const resolveIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { resolutionNotes } = req.body;
    const userId = req.user._id;

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    incident.status = 'resolved';
    incident.resolvedAt = new Date();
    incident.resolvedBy = userId;
    incident.resolutionNotes = resolutionNotes;

    incident.auditTrail.push({
      action: 'resolved',
      performedBy: userId,
      metadata: { resolutionNotes }
    });

    await incident.save();

    res.json({
      success: true,
      message: 'Incident resolved successfully',
      data: incident
    });
  } catch (error) {
    console.error('Error resolving incident:', error);
    res.status(500).json({ success: false, message: 'Error resolving incident' });
  }
};

/**
 * Create privacy incident manually
 */
export const createPrivacyIncidentManual = async (req, res) => {
  try {
    const incidentData = req.body;

    const incident = await createPrivacyIncident(incidentData);

    res.json({
      success: true,
      message: 'Privacy incident created and compliance team notified',
      data: incident
    });
  } catch (error) {
    console.error('Error creating privacy incident:', error);
    res.status(500).json({ success: false, message: 'Error creating privacy incident' });
  }
};

/**
 * Get incident statistics
 */
export const getIncidentStats = async (req, res) => {
  try {
    const stats = await Incident.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          investigating: {
            $sum: { $cond: [{ $eq: ['$status', 'investigating'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        total: 0,
        open: 0,
        investigating: 0,
        resolved: 0,
        critical: 0
      }
    });
  } catch (error) {
    console.error('Error fetching incident stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching incident stats' });
  }
};

/**
 * Get incident management URL
 */
export const getIncidentManagementURLRoute = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const url = getIncidentManagementURL(ticketNumber);

    res.json({
      success: true,
      data: { url }
    });
  } catch (error) {
    console.error('Error getting incident URL:', error);
    res.status(500).json({ success: false, message: 'Error getting incident URL' });
  }
};

