import express from "express";
import {
  companySignup,
  companyLogin,
  getCompanyOrganizations,
  updateCompanyProfile,
  clearTestData,
  registerOrganization,
} from "../controllers/companyController.js";

const router = express.Router();

// Company Authentication
router.post("/signup", companySignup);
router.post("/login", companyLogin);

// Organization Management (requires company authentication)
// router.post("/organizations", createOrganization); // Removed non-existent function
router.get("/organizations", getCompanyOrganizations);

// Company Profile
router.put("/profile", updateCompanyProfile);

// Development only - Clear test data
router.delete("/clear-test-data", clearTestData);

// Add the new registration route
router.post("/register-organization", registerOrganization);

export default router;