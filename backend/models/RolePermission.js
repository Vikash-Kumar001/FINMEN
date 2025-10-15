import mongoose from 'mongoose';

const rolePermissionSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  
  // Role definition
  roleName: {
    type: String,
    required: true,
  },
  roleType: {
    type: String,
    enum: ['school_admin', 'campus_admin', 'counselor', 'school_teacher', 'department_head', 'custom'],
    required: true,
  },
  displayName: String,
  description: String,
  
  // Permissions
  permissions: {
    // Dashboard access
    viewDashboard: { type: Boolean, default: false },
    viewAnalytics: { type: Boolean, default: false },
    viewAllCampuses: { type: Boolean, default: false },
    viewOwnCampusOnly: { type: Boolean, default: false },
    
    // Student management
    createStudent: { type: Boolean, default: false },
    editStudent: { type: Boolean, default: false },
    deleteStudent: { type: Boolean, default: false },
    viewStudentPII: { type: Boolean, default: false },
    
    // Teacher/Staff management
    createStaff: { type: Boolean, default: false },
    editStaff: { type: Boolean, default: false },
    deleteStaff: { type: Boolean, default: false },
    assignClasses: { type: Boolean, default: false },
    
    // Assignments & Content
    approveAssignments: { type: Boolean, default: false },
    createAssignments: { type: Boolean, default: false },
    viewAllAssignments: { type: Boolean, default: false },
    
    // Templates
    createTemplates: { type: Boolean, default: false },
    editTemplates: { type: Boolean, default: false },
    deleteTemplates: { type: Boolean, default: false },
    approveTemplates: { type: Boolean, default: false },
    publishTemplates: { type: Boolean, default: false },
    
    // Wellbeing & Counseling
    viewWellbeingCases: { type: Boolean, default: false },
    createWellbeingFlags: { type: Boolean, default: false },
    resolveWellbeingCases: { type: Boolean, default: false },
    accessCounselingData: { type: Boolean, default: false },
    
    // Financial
    viewFinancials: { type: Boolean, default: false },
    manageSubscription: { type: Boolean, default: false },
    
    // Settings & Configuration
    manageSettings: { type: Boolean, default: false },
    manageCampuses: { type: Boolean, default: false },
    manageRoles: { type: Boolean, default: false },
    
    // Compliance
    viewComplianceData: { type: Boolean, default: false },
    manageConsents: { type: Boolean, default: false },
    managePolicies: { type: Boolean, default: false },
    viewAuditLogs: { type: Boolean, default: false },
    
    // Emergency
    viewEmergencyAlerts: { type: Boolean, default: false },
    createEmergencyAlerts: { type: Boolean, default: false },
    manageEscalation: { type: Boolean, default: false },
  },
  
  // Campus restrictions
  campusRestrictions: [{
    campusId: String,
    canAccess: Boolean,
  }],
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
}, {
  timestamps: true,
});

rolePermissionSchema.index({ tenantId: 1, roleType: 1 });

const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);
export default RolePermission;

