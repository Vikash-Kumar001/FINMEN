import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

// Company Signup
export const companySignup = async (req, res) => {
  try {
    const { name, email, password, contactInfo, type, academicInfo, schoolId } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required" 
      });
    }

    // Check if company already exists with same email and type
    const existingCompany = await Company.findOne({ 
      email: email.toLowerCase(),
      type: type || 'company'
    });
    if (existingCompany) {
      return res.status(400).json({ 
        message: `${type === 'school' ? 'School' : 'Company'} with this email already exists`,
        error: 'DUPLICATE_EMAIL'
      });
    }

    // Check if institution ID already exists
    if (schoolId) {
      const existingInstitution = await Company.findOne({ 
        institutionId: schoolId 
      });
      if (existingInstitution) {
        return res.status(400).json({ 
          message: `School ID already exists`,
          error: 'DUPLICATE_INSTITUTION_ID'
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create company with institution type
    const company = await Company.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      contactInfo: contactInfo || {},
      type: type || 'company',
      academicInfo: academicInfo || {},
      institutionId: schoolId
    });

    // Create organization based on type
    let organization;
    if (type === 'school') {
      organization = new Organization({
        name,
        type: 'school',
        companyId: company._id,
        tenantId: 'temp', // Set temporary tenantId to match schema
        settings: {
          classes: academicInfo?.classes || [],
          streams: academicInfo?.streams || [],
          board: academicInfo?.board || '',
          establishedYear: academicInfo?.establishedYear || '',
          totalStudents: academicInfo?.totalStudents || 0,
          totalTeachers: academicInfo?.totalTeachers || 0
        }
      });
      // Save to generate the _id first
      await organization.save();
      // Set the correct tenantId and save again
      organization.tenantId = `school_${organization._id.toString()}`;
      await organization.save();
    }

    // Create admin user for the organization
    const adminRole = type === 'school' ? 'school_admin' : 'admin';
    const adminUser = await User.create({
      name: `${name} Admin`,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: adminRole,
      orgId: organization?._id,
      tenantId: organization?._id,
      isApproved: true
    });

    // Generate token for admin user
    const token = generateToken(adminUser._id);

    res.status(201).json({
      message: `${type === 'school' ? 'School' : 'Company'} registered successfully`,
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        orgId: adminUser.orgId,
        tenantId: adminUser.tenantId
      },
      organization: {
        id: organization?._id,
        name: organization?.name,
        type: organization?.type
      }
    });
  } catch (error) {
    console.error("Company signup error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return res.status(400).json({ 
          message: "Email already exists",
          error: 'DUPLICATE_EMAIL'
        });
      } else if (field === 'institutionId') {
        return res.status(400).json({ 
          message: "Institution ID already exists",
          error: 'DUPLICATE_INSTITUTION_ID'
        });
      }
    }
    
    res.status(500).json({ 
      message: "Server error during registration",
      error: error.message 
    });
  }
};

// Company Login
export const companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find company
    const company = await Company.findOne({ email: email.toLowerCase() })
      .populate('organizations');

    if (!company) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if company is active
    if (!company.isActive) {
      return res.status(403).json({ message: "Company account is deactivated" });
    }

    // Generate token
    const token = generateToken(company._id);

    res.status(200).json({
      message: "Login successful",
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        organizations: company.organizations,
        subscriptionPlan: company.subscriptionPlan,
        subscriptionExpiry: company.subscriptionExpiry,
      },
    });
  } catch (error) {
    console.error("Company login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Enhanced Organization Registration with Auto-Setup
export const registerOrganization = async (req, res) => {
  try {
    const { 
      organizationName,
      organizationType, // "school"
      adminName,
      adminEmail,
      adminPassword,
      contactInfo = {}
    } = req.body;

    // Validation
    if (!organizationName || !organizationType || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ 
        message: "All required fields must be provided" 
      });
    }

    if (!['school'].includes(organizationType)) {
      return res.status(400).json({ 
        message: "Organization type must be 'school'" 
      });
    }

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Admin email already exists" });
    }

    // Create company
    const company = await Company.create({
      name: organizationName,
      email: adminEmail.toLowerCase(),
      password: await bcrypt.hash(adminPassword, 12),
      contactInfo,
      type: organizationType
    });

    // Create organization
    const organization = new Organization({
      name: organizationName,
      type: organizationType,
      companyId: company._id,
      settings: {
        academicYear: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Generate tenantId
    await organization.save();
    organization.tenantId = `${organizationType}_${organization._id.toString()}`;
    await organization.save();

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const adminRole = organizationType === "school" ? "school_admin" : "admin";

    const admin = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: adminRole,
      orgId: organization._id,
      tenantId: organization.tenantId,
      isVerified: true,
      approvalStatus: "approved",
      contactInfo
    });

    // Add admin to organization
    organization.admins = [admin._id];
    await organization.save();

    // Update company's organizations
    company.organizations = [organization._id];
    await company.save();

    // Auto-setup based on organization type
    if (organizationType === "school") {
      await setupSchoolDefaults(organization._id, organization.tenantId);
    }

    // Generate token for admin user
    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Registration successful",
      organization: {
        id: organization._id,
        name: organization.name,
        type: organization.type,
        tenantId: organization.tenantId,
      },
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token
      },
      redirectUrl: organizationType === "school" ? "/school/admin" : "/admin/dashboard"
    });
  } catch (error) {
    console.error("Organization registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Helper function to setup default classes for schools
async function setupSchoolDefaults(orgId, tenantId) {
  const SchoolClass = mongoose.model('SchoolClass');
  
  // Create classes 1-12
  for (let classNumber = 1; classNumber <= 12; classNumber++) {
    // For classes 11-12, create separate classes for each stream
    if (classNumber >= 11) {
      const streams = ["Science", "Commerce", "Arts"];
      
      for (const stream of streams) {
        await SchoolClass.create({
          tenantId,
          orgId,
          classNumber,
          stream,
          sections: [{ name: "A", capacity: 40 }],
          subjects: [
            { name: "English" },
            ...(stream === "Science" ? [
              { name: "Physics" },
              { name: "Chemistry" },
              { name: "Mathematics" },
              { name: "Biology" }
            ] : stream === "Commerce" ? [
              { name: "Accountancy" },
              { name: "Business Studies" },
              { name: "Economics" },
              { name: "Mathematics" }
            ] : [ // Arts
              { name: "History" },
              { name: "Geography" },
              { name: "Political Science" },
              { name: "Sociology" }
            ])
          ]
        });
      }
    } else {
      // For classes 1-10, create regular classes
      await SchoolClass.create({
        tenantId,
        orgId,
        classNumber,
        sections: [{ name: "A", capacity: 40 }],
        subjects: [
          { name: "English" },
          { name: "Mathematics" },
          { name: "Science" },
          { name: "Social Studies" },
          classNumber >= 6 ? { name: "Second Language" } : null
        ].filter(Boolean)
      });
    }
  }
}

// Get Company Organizations
export const getCompanyOrganizations = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id)
      .populate({
        path: 'organizations',
        select: 'name type tenantId isActive userCount maxUsers createdAt',
        match: { isActive: true }
      });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        subscriptionPlan: company.subscriptionPlan,
        subscriptionExpiry: company.subscriptionExpiry,
      },
      organizations: company.organizations,
    });
  } catch (error) {
    console.error("Get organizations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Company Profile
export const updateCompanyProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { name, contactInfo } = req.body;
    
    const company = await Company.findByIdAndUpdate(
      decoded.id,
      { 
        ...(name && { name }),
        ...(contactInfo && { contactInfo })
      },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company profile updated successfully",
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        contactInfo: company.contactInfo,
      },
    });
  } catch (error) {
    console.error("Update company profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Clear test data (for development only)
export const clearTestData = async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: "Not allowed in production" });
    }

    await Company.deleteMany({ type: 'school' });
    await Organization.deleteMany({ type: 'school' });
    await User.deleteMany({ role: 'school_admin' });

    res.json({ message: "Test data cleared successfully" });
  } catch (error) {
    console.error("Clear test data error:", error);
    res.status(500).json({ message: "Error clearing test data" });
  }
};