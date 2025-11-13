import User from '../models/User.js';
import Organization from '../models/Organization.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import SchoolClass from '../models/School/SchoolClass.js';
import bcrypt from 'bcrypt';

const isStudentRole = (role) => role === 'student' || role === 'school_student';

const mapOrganizationToSchoolProfile = (organization) => {
  if (!organization) return null;
  return {
    id: organization._id,
    name: organization.name,
    tenantId: organization.tenantId,
    linkingCode: organization.linkingCode,
    linkingCodeIssuedAt: organization.linkingCodeIssuedAt,
    contactInfo: organization.settings?.contactInfo || {},
  };
};

const buildStudentSchoolDetails = async (user, organization) => {
  const baseDetails = {
    schoolName: organization?.name || null,
    teacherName: null,
    teacherId: null,
    classGrade: null,
    classNumber: null,
    section: null,
    stream: null,
    academicYear: null,
    admissionNumber: null,
    rollNumber: null,
  };

  if (
    !user ||
    !isStudentRole(user.role) ||
    !user.orgId ||
    !user.tenantId
  ) {
    return baseDetails;
  }

  try {
    const studentRecord = await SchoolStudent.findOne({
      tenantId: user.tenantId,
      userId: user._id,
      orgId: user.orgId,
    })
      .select('admissionNumber rollNumber classId section academicYear')
      .lean();

    if (!studentRecord) {
      return baseDetails;
    }

    let classDoc = null;
    if (studentRecord.classId) {
      classDoc = await SchoolClass.findById(studentRecord.classId)
        .populate({
          path: 'sections.classTeacher',
          select: 'name fullName email',
        })
        .lean();
    }

    const details = { ...baseDetails };
    details.admissionNumber = studentRecord.admissionNumber || null;
    details.rollNumber = studentRecord.rollNumber || null;
    details.section = studentRecord.section || null;
    details.academicYear = studentRecord.academicYear || null;

    if (classDoc) {
      details.classNumber = classDoc.classNumber ?? null;
      details.stream = classDoc.stream ?? null;
      if (!details.academicYear) {
        details.academicYear = classDoc.academicYear ?? null;
      }

      if (Array.isArray(classDoc.sections) && details.section) {
        const matchingSection = classDoc.sections.find(
          (section) =>
            section.name?.toString() === details.section?.toString()
        );

        if (matchingSection) {
          const teacher = matchingSection.classTeacher;
          if (teacher) {
            details.teacherName =
              teacher.fullName || teacher.name || teacher.email || null;
            details.teacherId =
              teacher._id?.toString?.() ||
              (typeof teacher === 'string' ? teacher : null);
          }
        }
      }

      const parts = [];
      if (details.classNumber !== null && details.classNumber !== undefined) {
        parts.push(`Class ${details.classNumber}`);
      }
      if (details.stream) {
        parts.push(details.stream);
      }
      if (details.section) {
        parts.push(`Section ${details.section}`);
      }

      details.classGrade = parts.length ? parts.join(' · ') : null;
    }

    return details;
  } catch (error) {
    console.error('Failed to build student school details:', error);
    return baseDetails;
  }
};

const buildTeacherSchoolDetails = async (user, organization) => {
  const baseDetails = {
    schoolName: organization?.name || null,
    totalClasses: 0,
    totalSections: 0,
    totalStudents: 0,
    totalSubjects: 0,
    subjects: [],
    classes: [],
    lastUpdated: new Date(),
  };

  if (
    !user ||
    user.role !== 'school_teacher' ||
    !user.orgId ||
    !user.tenantId
  ) {
    return baseDetails;
  }

  try {
    const classQuery = {
      tenantId: user.tenantId,
      orgId: user.orgId,
      isActive: true,
      $or: [
        { 'sections.classTeacher': user._id },
        { 'subjects.teachers': user._id },
      ],
    };

    const classDocs = await SchoolClass.find(classQuery)
      .select(
        'classNumber stream sections subjects academicYear orgId tenantId isActive'
      )
      .lean();

    if (!classDocs?.length) {
      return baseDetails;
    }

    const subjectsSet = new Set();
    const classesEnriched = await Promise.all(
      classDocs.map(async (classDoc) => {
        const classLabelParts = [];
        if (classDoc.classNumber !== undefined && classDoc.classNumber !== null) {
          classLabelParts.push(`Class ${classDoc.classNumber}`);
        }
        if (classDoc.stream) {
          classLabelParts.push(classDoc.stream);
        }

        const sections = Array.isArray(classDoc.sections)
          ? classDoc.sections
          : [];

        const relevantSections = sections.filter((section) =>
          section?.classTeacher?.toString?.() === user._id.toString()
        );

        const subjects = Array.isArray(classDoc.subjects)
          ? classDoc.subjects.filter((subject) =>
              Array.isArray(subject?.teachers)
                ? subject.teachers.some(
                    (teacherId) => teacherId?.toString?.() === user._id.toString()
                  )
                : false
            )
          : [];

        subjects.forEach((subject) => {
          if (subject?.name) {
            subjectsSet.add(subject.name);
          }
        });

        let sectionSummaries = await Promise.all(
          relevantSections.map(async (section) => {
            const studentCount = await SchoolStudent.countDocuments({
              tenantId: user.tenantId,
              orgId: user.orgId,
              classId: classDoc._id,
              section: section.name,
            }).catch(() => 0);

            return {
              name: section.name,
              studentCount,
              capacity: section.capacity ?? null,
              role: 'Class Teacher',
              currentStrength: section.currentStrength ?? null,
            };
          })
        );

        if (!sectionSummaries.length) {
          const totalStudents = await SchoolStudent.countDocuments({
            tenantId: user.tenantId,
            orgId: user.orgId,
            classId: classDoc._id,
          }).catch(() => 0);

          sectionSummaries = [
            {
              name: 'All Sections',
              studentCount: totalStudents,
              capacity: null,
              role: 'Subject Teacher',
              currentStrength: null,
            },
          ];
        }

        const subjectSummaries = subjects.map((subject) => ({
          name: subject.name,
          code: subject.code || null,
          isOptional: Boolean(subject.isOptional),
        }));

        return {
          id: classDoc._id,
          label: classLabelParts.join(' · ') || 'Class Assignment',
          academicYear: classDoc.academicYear || null,
          sections: sectionSummaries,
          subjects: subjectSummaries,
        };
      })
    );

    const totals = classesEnriched.reduce(
      (acc, classInfo) => {
        acc.totalClasses += 1;
        acc.totalSections += classInfo.sections.length;
        acc.totalStudents += classInfo.sections.reduce(
          (sectionTotal, section) => sectionTotal + (section.studentCount || 0),
          0
        );
        return acc;
      },
      { totalClasses: 0, totalSections: 0, totalStudents: 0 }
    );

    return {
      ...baseDetails,
      schoolName: baseDetails.schoolName,
      totalClasses: totals.totalClasses,
      totalSections: totals.totalSections,
      totalStudents: totals.totalStudents,
      totalSubjects: subjectsSet.size,
      subjects: Array.from(subjectsSet),
      classes: classesEnriched,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Failed to build teacher school details:', error);
    return baseDetails;
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiresAt -otpType');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Generate linking code for school_students if missing (similar to organization linking codes)
    if (user.role === 'school_student' && !user.linkingCode) {
      try {
        const prefix = 'SST';
        user.linkingCode = await User.generateUniqueLinkingCode(prefix);
        user.linkingCodeIssuedAt = new Date();
        await user.save();
      } catch (err) {
        console.error('Failed to generate linking code for school_student:', err);
      }
    }
    
    const baseProfile = {
      fullName: user.fullName || user.name,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || user.city || '',
      website: user.website || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      dateOfBirth: user.dateOfBirth || user.dob || null,
      dob: user.dob || null,
      role: user.role || '',
      createdAt: user.createdAt || null,
      subject: user.subject || '', // Include subject for school teachers
      academic: user.academic || {},
      linkingCode: user.linkingCode || null, // Include linking code for all users
      linkingCodeIssuedAt: user.linkingCodeIssuedAt || null,
      preferences: user.preferences || {
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'friends', contactInfo: 'friends', academicInfo: 'private' },
        sound: { effects: true, music: true, volume: 75 }
      },
    };

    const profileData = {
      ...baseProfile,
      ...(!isStudentRole(user.role)
        ? { professional: user.professional || {} }
        : {}),
      metadata: user.metadata || {},
    };

    // Include admin-specific fields
    if (user.role === 'admin') {
      profileData.adminLevel = user.adminLevel || 'standard';
      profileData.permissions = user.permissions || [];
    }

    let organization = null;
    if (user.orgId) {
      try {
        organization = await Organization.findById(user.orgId);
        if (organization) {
          if (!organization.linkingCode) {
            organization.linkingCode = await Organization.generateUniqueLinkingCode("SC");
            organization.linkingCodeIssuedAt = new Date();
            await organization.save();
          }

          const schoolProfile = mapOrganizationToSchoolProfile(organization);
          if (schoolProfile) {
            profileData.school = schoolProfile;
            profileData.schoolLinkingCode = schoolProfile.linkingCode;
            profileData.schoolLinkingCodeIssuedAt = schoolProfile.linkingCodeIssuedAt;
          }
        }
      } catch (orgError) {
        console.error('Failed to load organization for profile:', orgError);
      }
    }

    if (isStudentRole(user.role)) {
      const schoolDetails = await buildStudentSchoolDetails(
        user,
        organization || profileData.school
      );
      profileData.schoolDetails = schoolDetails;

      // Include linked parent information for students
      if (user.linkedIds?.parentIds && user.linkedIds.parentIds.length > 0) {
        try {
          const parents = await User.find({
            _id: { $in: user.linkedIds.parentIds },
            role: { $in: ['parent', 'school_parent'] }
          }).select('_id name fullName email linkingCode').lean();

          profileData.linkedParents = parents.map(parent => ({
            id: parent._id,
            name: parent.fullName || parent.name || parent.email,
            email: parent.email,
            linkingCode: parent.linkingCode,
          }));
        } catch (err) {
          console.error('Failed to load linked parents:', err);
          profileData.linkedParents = [];
        }
      } else {
        profileData.linkedParents = [];
      }
    } else if (user.role === 'school_teacher') {
      const teacherDetails = await buildTeacherSchoolDetails(
        user,
        organization || profileData.school
      );
      profileData.teacherDetails = teacherDetails;
    }

    res.status(200).json({
      data: profileData,
      ...profileData,
    });
  } catch (err) {
    console.error('❌ Get profile error:', err);
    res.status(500).json({ message: 'Failed to load profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const body = req.body || {};

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Basic fields
    ['name', 'dob', 'institution', 'username', 'city', 'language', 'guardianEmail', 'phone', 'location', 'website', 'bio', 'avatar']
      .forEach((field) => {
        if (body[field] !== undefined) user[field] = body[field];
      });

    // Handle dateOfBirth - convert string to Date if provided
    if (body.dateOfBirth !== undefined) {
      if (body.dateOfBirth === '' || body.dateOfBirth === null) {
        user.dateOfBirth = null;
        user.dob = null;
      } else {
        const dobDate = new Date(body.dateOfBirth);
        if (!isNaN(dobDate.getTime())) {
          user.dateOfBirth = dobDate;
          user.dob = body.dateOfBirth; // Keep string format for backward compatibility
        }
      }
    }

    // Nested objects from tabs
    if (body.personal) Object.assign(user, body.personal);
    if (body.academic) user.academic = { ...(user.academic || {}), ...body.academic };

    if (user.role !== 'student' && user.role !== 'school_student') {
      if (body.professional) {
        user.professional = { ...(user.professional || {}), ...body.professional };
      }
    } else if (user.professional !== undefined && Object.keys(user.professional || {}).length > 0) {
      user.professional = undefined;
      user.markModified?.('professional');
    }
    if (body.preferences) user.preferences = { ...(user.preferences || {}), ...body.preferences };

    await user.save();

    let organization = null;
    try {
      if (user.orgId) {
        organization = await Organization.findById(user.orgId);
        if (organization && !organization.linkingCode) {
          organization.linkingCode = await Organization.generateUniqueLinkingCode("SC");
          organization.linkingCodeIssuedAt = new Date();
          await organization.save();
        }
      }
    } catch (orgError) {
      console.error('Failed to refresh organization for profile update:', orgError);
    }

    const schoolProfile = mapOrganizationToSchoolProfile(organization);
    let schoolDetails = null;
    let teacherDetails = null;

    if (isStudentRole(user.role)) {
      schoolDetails = await buildStudentSchoolDetails(
        user,
        organization || schoolProfile
      );
    } else if (user.role === 'school_teacher') {
      teacherDetails = await buildTeacherSchoolDetails(
        user,
        organization || schoolProfile
      );
    }

    const payload = {
      userId: user._id,
      fullName: user.fullName || user.name,
      name: user.name,
      email: user.email,
      role: user.role,
      institution: user.institution,
      city: user.city,
      location: user.location || user.city,
      avatar: user.avatar,
      dob: user.dob,
      dateOfBirth: user.dateOfBirth || user.dob,
      username: user.username,
      language: user.language,
      guardianEmail: user.guardianEmail,
      phone: user.phone,
      website: user.website,
      bio: user.bio,
      academic: user.academic,
      ...(user.role !== 'student' && user.role !== 'school_student'
        ? { professional: user.professional }
        : {}),
      preferences: user.preferences,
      updatedAt: user.updatedAt,
      ...(schoolProfile ? { school: schoolProfile } : {}),
      ...(schoolDetails ? { schoolDetails } : {}),
      ...(teacherDetails ? { teacherDetails } : {}),
    };

    // Emit real-time updates via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('admin:profile:update', payload);
      io.to(user._id.toString()).emit('user:profile:updated', payload);
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        fullName: user.fullName || user.name,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        website: user.website,
        bio: user.bio,
        academic: user.academic,
        preferences: user.preferences,
        ...(schoolProfile ? { school: schoolProfile } : {}),
        ...(schoolDetails ? { schoolDetails } : {}),
        ...(teacherDetails ? { teacherDetails } : {}),
      },
    });
  } catch (err) {
    console.error('❌ Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const updateUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If file uploaded via multer
    if (req.file) {
      // Expose via /uploads/avatars/<filename>
      const publicPath = `/uploads/avatars/${req.file.filename}`;
      user.avatar = publicPath;
      await user.save();
      
      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to('admin').emit('admin:profile:update', {
          userId: user._id,
          avatar: user.avatar
        });
        io.to(user._id.toString()).emit('user:profile:updated', {
          userId: user._id,
          avatar: user.avatar
        });
      }
      
      return res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
    }

    // Support URL avatar update via body.avatar
    const { avatar } = req.body || {};
    if (!avatar) return res.status(400).json({ message: 'avatar is required' });

    user.avatar = avatar;
    await user.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('admin:profile:update', {
        userId: user._id,
        avatar: user.avatar
      });
      io.to(user._id.toString()).emit('user:profile:updated', {
        userId: user._id,
        avatar: user.avatar
      });
    }

    res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
  } catch (err) {
    console.error('❌ Avatar update error:', err);
    res.status(500).json({ message: 'Failed to update avatar' });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user has a password (not Google login)
    if (!user.password) {
      return res.status(400).json({ message: 'Cannot change password for Google login accounts' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Password update error:', err);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings preferences');
    
    const defaultSettings = {
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notifyOnApproval: true,
        notifyOnAssignment: true,
        notifyOnWellbeing: true,
        notifyOnSystemUpdates: true,
        notifyOnNewStudent: false,
        notifyOnAttendanceAlert: true,
        digestFrequency: 'daily'
      },
      privacy: {
        showEmailToTeachers: true,
        showPhoneToTeachers: false,
        allowDataExport: true,
        twoFactorAuth: false,
        sessionTimeout: 30
      },
      display: {
        theme: 'light',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        timezone: 'Asia/Kolkata',
        compactMode: false,
        animationsEnabled: true,
        soundEnabled: false
      }
    };

    res.json({
      settings: {
        notifications: { ...defaultSettings.notifications, ...(user.settings?.notifications || user.preferences?.notifications || {}) },
        privacy: { ...defaultSettings.privacy, ...(user.settings?.privacy || {}) },
        display: { ...defaultSettings.display, ...(user.settings?.display || user.preferences || {}) }
      }
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const { section, settings } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.settings) user.settings = {};
    
    if (section === 'notifications') {
      user.settings.notifications = { ...(user.settings.notifications || {}), ...settings };
    } else if (section === 'privacy') {
      user.settings.privacy = { ...(user.settings.privacy || {}), ...settings };
    } else if (section === 'display') {
      user.settings.display = { ...(user.settings.display || {}), ...settings };
      // Also update user.preferences for backward compatibility
      user.preferences = { ...(user.preferences || {}), ...settings };
    }

    user.markModified('settings');
    user.markModified('preferences');
    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

// Export user data
export const exportUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiresAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exportData = {
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        joiningDate: user.createdAt
      },
      settings: user.settings || {},
      preferences: user.preferences || {},
      academic: user.academic || {},
      professional: user.professional || {},
      metadata: {
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
        lastActive: user.lastActive,
        exportedAt: new Date()
      }
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({ message: 'Failed to export data' });
  }
};

// Get admin profile stats
export const getAdminProfileStats = async (req, res) => {
  try {
    const { tenantId } = req;
    
    // Import models
    const SchoolStudent = (await import('../models/School/SchoolStudent.js')).default;
    const Assignment = (await import('../models/Assignment.js')).default;
    
    const [totalStudents, totalTeachers, assignmentsApproved] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      Assignment.countDocuments({ 
        tenantId,
        status: 'approved',
        approvedBy: req.user._id
      })
    ]);

    // Calculate days active
    const joinDate = req.user.createdAt || new Date();
    const daysActive = Math.floor((new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24));

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        assignmentsApproved,
        daysActive
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        assignmentsApproved: 0,
        daysActive: 0
      }
    });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If file uploaded via multer
    if (req.file) {
      const publicPath = `/uploads/avatars/${req.file.filename}`;
      user.avatar = publicPath;
      await user.save();
      return res.status(200).json({ 
        message: 'Avatar uploaded successfully',
        avatarUrl: user.avatar 
      });
    }

    res.status(400).json({ message: 'No file uploaded' });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};

// 👥 GET /api/user/students — Get all students (for admin)
export const getAllStudents = async (req, res) => {
  try {
    // Check if user is admin or school_admin
    if (!['admin', 'school_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access student data' });
    }
    
    // Get all students
    const students = await User.find({ role: 'student' })
      .select('name email avatar institution city dob lastActive createdAt');
    
    res.status(200).json(students);
  } catch (err) {
    console.error('❌ Get students error:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};