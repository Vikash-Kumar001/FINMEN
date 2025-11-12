import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Generate password for new users
const generatePassword = (length = 12) => {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
};

// Automated role assignment based on user data
const assignRole = (userData, context = {}) => {
  // If role is explicitly provided, use it
  if (userData.role) {
    return userData.role;
  }
  
  // Auto-detect based on context
  const email = (userData.email || '').toLowerCase();
  const name = (userData.name || userData.fullName || '').toLowerCase();
  
  // Check if it's a teacher (common indicators)
  if (
    context.organizationType === 'school' &&
    (userData.designation?.toLowerCase().includes('teacher') ||
     userData.position?.toLowerCase().includes('teacher') ||
     userData.department?.toLowerCase().includes('faculty') ||
     context.roleHint === 'teacher')
  ) {
    return 'school_teacher';
  }
  
  // Check if it's a parent
  if (
    userData.relation === 'parent' ||
    userData.guardianEmail ||
    context.roleHint === 'parent' ||
    name.includes('parent')
  ) {
    return 'school_parent';
  }
  
  // Check if it's a school admin
  if (
    userData.designation?.toLowerCase().includes('admin') ||
    userData.position?.toLowerCase().includes('principal') ||
    userData.position?.toLowerCase().includes('coordinator') ||
    context.roleHint === 'admin'
  ) {
    return 'school_admin';
  }
  
  // Default to student for school contexts
  if (context.organizationType === 'school') {
    return 'school_student';
  }
  
  // Default role
  return 'student';
};

// Bulk onboarding from CSV/JSON data
export const bulkOnboardUsers = async (userDataList, options = {}) => {
  try {
    const {
      organizationId,
      tenantId,
      defaultRole,
      sendWelcomeEmail = false,
      skipDuplicates = true,
      updateExisting = false
    } = options;
    
    const results = {
      total: userDataList.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };
    
    // Get organization for context
    const organization = organizationId 
      ? await Organization.findById(organizationId).lean()
      : null;
    
    const processedUsers = [];
    
    for (let i = 0; i < userDataList.length; i++) {
      const userData = userDataList[i];
      
      try {
        // Validate required fields
        if (!userData.email) {
          results.errors.push({
            index: i,
            email: userData.email || 'N/A',
            error: 'Email is required'
          });
          results.skipped++;
          continue;
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          if (updateExisting) {
            // Update existing user
            Object.assign(existingUser, {
              name: userData.name || userData.fullName || existingUser.name,
              fullName: userData.fullName || userData.name || existingUser.fullName,
              phone: userData.phone || existingUser.phone,
              dateOfBirth: userData.dateOfBirth 
                ? new Date(userData.dateOfBirth) 
                : existingUser.dateOfBirth,
              orgId: organizationId || existingUser.orgId,
              tenantId: tenantId || existingUser.tenantId,
              role: userData.role || existingUser.role,
              registrationNumber: userData.registrationNumber || existingUser.registrationNumber,
              metadata: {
                ...existingUser.metadata,
                ...userData.metadata,
                importedAt: new Date(),
                importedBy: options.importedBy
              }
            });
            
            await existingUser.save();
            results.updated++;
            processedUsers.push(existingUser);
          } else {
            results.skipped++;
            results.errors.push({
              index: i,
              email: userData.email,
              error: 'User already exists'
            });
          }
          continue;
        }
        
        // Auto-assign role
        const role = userData.role || defaultRole || assignRole(userData, {
          organizationType: organization?.type,
          roleHint: userData.roleHint
        });
        
        // Create new user
        const newUser = new User({
          name: userData.name || userData.fullName || userData.email.split('@')[0],
          fullName: userData.fullName || userData.name || userData.email.split('@')[0],
          email: userData.email,
          password: userData.password || generatePassword(), // Will be hashed by middleware
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,
          dob: userData.dateOfBirth || userData.dob,
          orgId: organizationId,
          tenantId: tenantId || organization?.tenantId,
          role,
          registrationNumber: userData.registrationNumber,
          guardianEmail: userData.guardianEmail,
          institution: userData.institution || organization?.name,
          academic: userData.academic || {},
          metadata: {
            ...userData.metadata,
            bulkImported: true,
            importedAt: new Date(),
            importedBy: options.importedBy,
            source: options.source || 'manual'
          }
        });
        
        await newUser.save();
        results.created++;
        processedUsers.push(newUser);
        
        // Send welcome email if enabled (placeholder for actual email service)
        if (sendWelcomeEmail && newUser.email) {
          // TODO: Integrate with email service
          console.log(`Welcome email queued for ${newUser.email}`);
        }
        
      } catch (error) {
        results.errors.push({
          index: i,
          email: userData.email || 'N/A',
          error: error.message
        });
        results.skipped++;
      }
    }
    
    return {
      ...results,
      processedUsers: processedUsers.map(u => ({
        _id: u._id,
        email: u.email,
        name: u.name,
        role: u.role
      }))
    };
  } catch (error) {
    console.error('Error in bulkOnboardUsers:', error);
    throw error;
  }
};

// HRIS Integration - Sync teacher roster
export const syncTeacherRoster = async (hrisData, options = {}) => {
  try {
    const {
      organizationId,
      tenantId,
      updateExisting = true,
      deactivateMissing = false
    } = options;
    
    const organization = organizationId 
      ? await Organization.findById(organizationId).lean()
      : null;
    
    if (!organization) {
      throw new Error('Organization not found');
    }
    
    const results = {
      synced: 0,
      created: 0,
      updated: 0,
      deactivated: 0,
      errors: []
    };
    
    const hrisTeacherIds = hrisData.map(t => t.employeeId || t.id).filter(Boolean);
    
    // Get existing teachers
    const existingTeachers = await User.find({
      orgId: organizationId,
      role: 'school_teacher',
      tenantId: tenantId || organization.tenantId
    });
    
    // Sync each teacher from HRIS
    for (const teacherData of hrisData) {
      try {
        const employeeId = teacherData.employeeId || teacherData.id;
        const email = teacherData.email;
        
        if (!email) {
          results.errors.push({
            employeeId,
            error: 'Email is required'
          });
          continue;
        }
        
        // Find existing teacher by email or employee ID
        let teacher = await User.findOne({
          $or: [
            { email },
            { 'metadata.employeeId': employeeId }
          ],
          orgId: organizationId
        });
        
        if (teacher) {
          // Update existing teacher
          Object.assign(teacher, {
            name: teacherData.name || teacherData.fullName || teacher.name,
            fullName: teacherData.fullName || teacherData.name || teacher.fullName,
            email,
            phone: teacherData.phone || teacher.phone,
            role: 'school_teacher',
            orgId: organizationId,
            tenantId: tenantId || organization.tenantId,
            metadata: {
              ...teacher.metadata,
              employeeId,
              department: teacherData.department,
              designation: teacherData.designation,
              hrisSynced: true,
              lastHrisSync: new Date()
            },
            professional: {
              ...teacher.professional,
              department: teacherData.department,
              designation: teacherData.designation,
              employeeId
            }
          });
          
          await teacher.save();
          results.updated++;
        } else {
          // Create new teacher
          teacher = new User({
            name: teacherData.name || teacherData.fullName || email.split('@')[0],
            fullName: teacherData.fullName || teacherData.name || email.split('@')[0],
            email,
            password: generatePassword(),
            phone: teacherData.phone,
            role: 'school_teacher',
            orgId: organizationId,
            tenantId: tenantId || organization.tenantId,
            metadata: {
              employeeId,
              department: teacherData.department,
              designation: teacherData.designation,
              hrisSynced: true,
              lastHrisSync: new Date()
            },
            professional: {
              department: teacherData.department,
              designation: teacherData.designation,
              employeeId
            }
          });
          
          await teacher.save();
          results.created++;
        }
        
        results.synced++;
      } catch (error) {
        results.errors.push({
          employeeId: teacherData.employeeId || teacherData.id,
          email: teacherData.email,
          error: error.message
        });
      }
    }
    
    // Deactivate teachers not in HRIS if enabled
    if (deactivateMissing) {
      const missingTeachers = existingTeachers.filter(t => {
        const employeeId = t.metadata?.employeeId;
        return employeeId && !hrisTeacherIds.includes(employeeId);
      });
      
      for (const teacher of missingTeachers) {
        // In a real system, you might set a deactivated flag
        // For now, we'll just mark in metadata
        teacher.metadata = {
          ...teacher.metadata,
          hrisMissing: true,
          lastHrisSync: new Date()
        };
        await teacher.save();
        results.deactivated++;
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in syncTeacherRoster:', error);
    throw error;
  }
};

// Graduation and class promotion automation
export const processGraduationAndPromotion = async (options = {}) => {
  try {
    const {
      organizationId,
      tenantId,
      academicYear,
      promoteFromClass,
      promoteToClass,
      graduateClass,
      dryRun = false
    } = options;
    
    const results = {
      promoted: 0,
      graduated: 0,
      errors: []
    };
    
    // Build query for students
    const query = {
      role: { $in: ['school_student', 'student'] },
      ...(organizationId && { orgId: organizationId }),
      ...(tenantId && { tenantId })
    };
    
    // Add class filter if provided
    if (promoteFromClass || graduateClass) {
      const classFilter = promoteFromClass || graduateClass;
      query['academic.class'] = classFilter;
      query['metadata.class'] = classFilter;
    }
    
    const students = await User.find(query);
    
    for (const student of students) {
      try {
        const currentClass = student.academic?.class || student.metadata?.class;
        
        if (graduateClass && currentClass === graduateClass) {
          // Graduate student
          if (!dryRun) {
            student.metadata = {
              ...student.metadata,
              graduated: true,
              graduationDate: new Date(),
              graduationClass: currentClass,
              graduationYear: academicYear || new Date().getFullYear()
            };
            
            // Optionally archive or deactivate
            // student.role = 'alumni'; // If you have an alumni role
            
            await student.save();
          }
          results.graduated++;
        } else if (promoteFromClass && promoteToClass && currentClass === promoteFromClass) {
          // Promote student
          if (!dryRun) {
            student.academic = {
              ...student.academic,
              class: promoteToClass,
              previousClass: currentClass,
              promotionDate: new Date(),
              academicYear: academicYear || new Date().getFullYear()
            };
            
            student.metadata = {
              ...student.metadata,
              class: promoteToClass,
              previousClass: currentClass,
              promotedAt: new Date()
            };
            
            await student.save();
          }
          results.promoted++;
        }
      } catch (error) {
        results.errors.push({
          studentId: student._id,
          email: student.email,
          error: error.message
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in processGraduationAndPromotion:', error);
    throw error;
  }
};

// Parent/Student linking and verification
export const linkParentStudent = async (parentData, studentData, options = {}) => {
  try {
    const {
      verifyByEmail = true,
      autoCreate = false,
      linkType = 'both' // 'parent', 'student', 'both'
    } = options;
    
    // Find or create parent
    let parent = await User.findOne({ email: parentData.email });
    
    if (!parent && autoCreate) {
      parent = new User({
        name: parentData.name || parentData.fullName || parentData.email.split('@')[0],
        fullName: parentData.fullName || parentData.name || parentData.email.split('@')[0],
        email: parentData.email,
        password: generatePassword(),
        phone: parentData.phone,
        role: 'school_parent'
      });
      await parent.save();
    }
    
    if (!parent) {
      throw new Error('Parent not found and auto-create disabled');
    }
    
    // Find or create student
    let student = await User.findOne({ email: studentData.email });
    
    if (!student && autoCreate) {
      student = new User({
        name: studentData.name || studentData.fullName || studentData.email.split('@')[0],
        fullName: studentData.fullName || studentData.name || studentData.email.split('@')[0],
        email: studentData.email,
        password: generatePassword(),
        phone: studentData.phone,
        role: 'school_student',
        guardianEmail: parent.email,
        orgId: parentData.orgId,
        tenantId: parentData.tenantId
      });
      await student.save();
    }
    
    if (!student) {
      throw new Error('Student not found and auto-create disabled');
    }
    
    // Link parent and student
    if (linkType === 'parent' || linkType === 'both') {
      // Add student to parent's childIds
      if (!parent.linkedIds) parent.linkedIds = {};
      if (!parent.linkedIds.childIds) parent.linkedIds.childIds = [];
      
      if (!parent.linkedIds.childIds.some(id => id.toString() === student._id.toString())) {
        parent.linkedIds.childIds.push(student._id);
      }
      
      // Add student email to parent's childEmail
      if (!parent.childEmail) parent.childEmail = [];
      if (!parent.childEmail.includes(student.email)) {
        parent.childEmail.push(student.email);
      }
      
      await parent.save();
    }
    
    if (linkType === 'student' || linkType === 'both') {
      // Add parent to student's parentIds
      if (!student.linkedIds) student.linkedIds = {};
      if (!student.linkedIds.parentIds) student.linkedIds.parentIds = [];
      
      if (!student.linkedIds.parentIds.some(id => id.toString() === parent._id.toString())) {
        student.linkedIds.parentIds.push(parent._id);
      }
      
      // Set guardian email
      student.guardianEmail = parent.email;
      
      await student.save();
    }
    
    // Verification
    const verification = {
      verified: false,
      method: null,
      verifiedAt: null,
      verifiedBy: null
    };
    
    if (verifyByEmail) {
      // In a real system, send verification email
      // For now, we'll auto-verify if emails match expected pattern
      if (parent.email && student.guardianEmail === parent.email) {
        verification.verified = true;
        verification.method = 'email';
        verification.verifiedAt = new Date();
      }
    }
    
    // Store verification in metadata
    if (verification.verified) {
      parent.metadata = {
        ...parent.metadata,
        childVerified: {
          ...parent.metadata?.childVerified,
          [student.email]: verification
        }
      };
      await parent.save();
    }
    
    return {
      success: true,
      parent: {
        _id: parent._id,
        email: parent.email,
        name: parent.name
      },
      student: {
        _id: student._id,
        email: student.email,
        name: student.name
      },
      verification
    };
  } catch (error) {
    console.error('Error in linkParentStudent:', error);
    throw error;
  }
};

// Bulk parent-student linking
export const bulkLinkParentStudent = async (linkDataList, options = {}) => {
  try {
    const results = {
      total: linkDataList.length,
      linked: 0,
      errors: []
    };
    
    for (let i = 0; i < linkDataList.length; i++) {
      const linkData = linkDataList[i];
      
      try {
        await linkParentStudent(
          { email: linkData.parentEmail, ...linkData.parentData },
          { email: linkData.studentEmail, ...linkData.studentData },
          options
        );
        results.linked++;
      } catch (error) {
        results.errors.push({
          index: i,
          parentEmail: linkData.parentEmail,
          studentEmail: linkData.studentEmail,
          error: error.message
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in bulkLinkParentStudent:', error);
    throw error;
  }
};

// Get lifecycle statistics
export const getLifecycleStats = async (filters = {}) => {
  try {
    const { organizationId, tenantId } = filters;
    
    const query = {};
    if (organizationId) query.orgId = organizationId;
    if (tenantId) query.tenantId = tenantId;
    
    const [
      totalUsers,
      students,
      teachers,
      parents,
      pendingVerifications,
      bulkImported,
      hrisSynced
    ] = await Promise.all([
      User.countDocuments(query),
      User.countDocuments({ ...query, role: { $in: ['student', 'school_student'] } }),
      User.countDocuments({ ...query, role: 'school_teacher' }),
      User.countDocuments({ ...query, role: { $in: ['parent', 'school_parent'] } }),
      User.countDocuments({ 
        ...query, 
        role: { $in: ['parent', 'school_parent'] },
        'metadata.childVerified': { $exists: false }
      }),
      User.countDocuments({ 
        ...query,
        'metadata.bulkImported': true
      }),
      User.countDocuments({
        ...query,
        'metadata.hrisSynced': true
      })
    ]);
    
    return {
      totalUsers,
      byRole: {
        students,
        teachers,
        parents,
        others: totalUsers - students - teachers - parents
      },
      pendingVerifications,
      bulkImported,
      hrisSynced
    };
  } catch (error) {
    console.error('Error in getLifecycleStats:', error);
    throw error;
  }
};

export default {
  bulkOnboardUsers,
  syncTeacherRoster,
  processGraduationAndPromotion,
  linkParentStudent,
  bulkLinkParentStudent,
  getLifecycleStats,
  assignRole
};

