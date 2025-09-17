import express from "express";
import {
  getOrganizationDetails,
  inviteUser,
  getOrganizationUsers,
  updateUserRole,
  deactivateUser,
  updateOrganizationSettings,
  linkParentToStudent,
  getOrganizationStats,
} from "../controllers/organizationController.js";
import { 
  extractTenant, 
  enforceTenantIsolation, 
  requireTenantRole,
  checkSubscriptionLimits 
} from "../middlewares/tenantMiddleware.js";

const router = express.Router();

// Apply tenant middleware to all routes
router.use(extractTenant);
router.use(enforceTenantIsolation);

// Organization Details
router.get("/details", getOrganizationDetails);
router.get("/stats", getOrganizationStats);

// User Management (Admin only)
router.post(
  "/users/invite", 
  requireTenantRole(["school_admin", "college_admin"]),
  checkSubscriptionLimits,
  inviteUser
);

router.get(
  "/users", 
  requireTenantRole(["school_admin", "college_admin", "school_teacher", "college_faculty", "college_hod"]),
  getOrganizationUsers
);

router.put(
  "/users/:userId/role", 
  requireTenantRole(["school_admin", "college_admin"]),
  updateUserRole
);

router.put(
  "/users/:userId/deactivate", 
  requireTenantRole(["school_admin", "college_admin"]),
  deactivateUser
);

// Parent-Student Linking
router.post(
  "/link-parent-student", 
  requireTenantRole(["school_admin", "college_admin", "school_teacher", "college_faculty"]),
  linkParentToStudent
);

// Organization Settings
router.put(
  "/settings", 
  requireTenantRole(["school_admin", "college_admin"]),
  updateOrganizationSettings
);

export default router;