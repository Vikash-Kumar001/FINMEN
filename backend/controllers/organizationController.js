import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import SchoolClass from "../models/School/SchoolClass.js";
import SchoolStudent from "../models/School/SchoolStudent.js";
import { generateToken } from "../utils/jwt.js";
import { sendInvitationEmail } from "../utils/mailer.js";

// Get Organization Details
export const getOrganizationDetails = async (req, res) => {
  try {
    const organization = await Organization.findById(req.user.orgId)
      .populate('admins', 'name email role')
      .populate('companyId', 'name subscriptionPlan subscriptionExpiry');

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Get user counts by role
    const userCounts = await User.aggregate([
      { $match: { tenantId: req.tenantId, isActive: { $ne: false } } },
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const roleStats = {};
    userCounts.forEach(item => {
      roleStats[item._id] = item.count;
    });

    res.status(200).json({
      organization: {
        id: organization._id,
        name: organization.name,
        type: organization.type,
        tenantId: organization.tenantId,
        settings: organization.settings,
        isActive: organization.isActive,
        userCount: organization.userCount,
        maxUsers: organization.maxUsers,
        createdAt: organization.createdAt,
      },
      company: organization.companyId,
      admins: organization.admins,
      roleStats,
    });
  } catch (error) {
    console.error("Get organization details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Invite User to Organization
// Modify the inviteUser function to enforce parent linking for students
export const inviteUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      role, 
      additionalInfo = {} 
    } = req.body;

    // Validation
    if (!name || !email || !role) {
      return res.status(400).json({ 
        message: "Name, email, and role are required" 
      });
    }

    // Validate role based on organization type
    const organization = req.organization;
    const validRoles = ["school_admin", "school_teacher", "school_student", "school_parent", 
         "school_accountant", "school_librarian", "school_transport_staff"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Invalid role for ${organization.type}` 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      tenantId: req.tenantId 
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists in this organization" });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      orgId: organization._id,
      tenantId: req.tenantId,
      isVerified: true,
      approvalStatus: "approved",
      ...additionalInfo,
    });

    // Update organization user count
    await Organization.findByIdAndUpdate(
      organization._id,
      { $inc: { userCount: 1 } }
    );

    // Send invitation email with temporary password
    try {
      await sendInvitationEmail(
        email, 
        name, 
        organization.name, 
        role, 
        tempPassword
      );
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
      // Don't fail the user creation if email fails
    }

    res.status(201).json({
      message: "User invited successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
      tempPassword, // Include in response for admin reference
    });
  } catch (error) {
    console.error("Invite user error:", error);
    res.status(500).json({ message: "Server error during user invitation" });
  }
};

// Get Organization Users
export const getOrganizationUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    
    const query = { tenantId: req.tenantId };
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -otp -otpExpiresAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get organization users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const organization = req.organization;
    const validRoles = ["school_admin", "school_teacher", "school_student", "school_parent", 
         "school_accountant", "school_librarian", "school_transport_staff"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Invalid role for ${organization.type}` 
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, tenantId: req.tenantId },
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Deactivate User
export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: userId, tenantId: req.tenantId },
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update organization user count
    await Organization.findByIdAndUpdate(
      req.user.orgId,
      { $inc: { userCount: -1 } }
    );

    res.status(200).json({
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    console.error("Deactivate user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Organization Settings
export const updateOrganizationSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    const organization = await Organization.findByIdAndUpdate(
      req.user.orgId,
      { 
        $set: { 
          'settings': { 
            ...req.organization.settings, 
            ...settings 
          } 
        } 
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Organization settings updated successfully",
      settings: organization.settings,
    });
  } catch (error) {
    console.error("Update organization settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Link Parent to Student
export const linkParentToStudent = async (req, res) => {
  try {
    const { parentId, studentId } = req.body;

    if (!parentId || !studentId) {
      return res.status(400).json({ 
        message: "Parent ID and Student ID are required" 
      });
    }

    // Verify both users exist in the same tenant
    const parent = await User.findOne({
      _id: parentId, 
      tenantId: req.tenantId,
      role: { $in: ['school_parent'] }
    });

    const student = await User.findOne({
      _id: studentId, 
      tenantId: req.tenantId,
      role: { $in: ['school_student'] }
    });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update parent's linked children
    if (!parent.linkedIds.childIds.includes(studentId)) {
      parent.linkedIds.childIds.push(studentId);
      await parent.save();
    }

    // Update student's linked parents
    if (!student.linkedIds.parentIds.includes(parentId)) {
      student.linkedIds.parentIds.push(parentId);
      await student.save();
    }

    // Update student record in respective collection
    await SchoolStudent.findOneAndUpdate(
      { userId: studentId, tenantId: req.tenantId },
      { $addToSet: { parentIds: parentId } }
    );

    res.status(200).json({
      message: "Parent linked to student successfully",
      parent: {
        id: parent._id,
        name: parent.name,
        email: parent.email,
      },
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Link parent to student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Organization Dashboard Stats
export const getOrganizationStats = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const orgType = req.organization.type;

    // Common stats
    const [totalUsers, activeUsers] = await Promise.all([
      User.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, isActive: { $ne: false } })
    ]);

    // School-specific stats
    const [totalClasses, totalStudents, totalTeachers] = await Promise.all([
      SchoolClass.countDocuments({ tenantId, isActive: true }),
      SchoolStudent.countDocuments({ tenantId, isActive: true }),
      User.countDocuments({ tenantId, role: "school_teacher" })
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      organizationType: orgType,
      totalClasses,
      totalStudents,
      totalTeachers,
    };

    res.status(200).json({ stats });
  } catch (error) {
    console.error("Get organization stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};