import SchoolStudent from '../models/School/SchoolStudent.js';
import SchoolClass from '../models/School/SchoolClass.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import UserProgress from '../models/UserProgress.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import UnifiedGameProgress from '../models/UnifiedGameProgress.js';
import ActivityLog from '../models/ActivityLog.js';
import MoodLog from '../models/MoodLog.js';
import Notification from '../models/Notification.js';
import Assignment from '../models/Assignment.js';
import Timetable from '../models/Timetable.js';
import Announcement from '../models/Announcement.js';
import Template from '../models/Template.js';
import Subscription from '../models/Subscription.js';
import ConsentRecord from '../models/ConsentRecord.js';
import DataRetentionPolicy from '../models/DataRetentionPolicy.js';
import ComplianceAuditLog from '../models/ComplianceAuditLog.js';
import RolePermission from '../models/RolePermission.js';
import EscalationChain from '../models/EscalationChain.js';
import EscalationCase from '../models/EscalationCase.js';
import NEPCompetency from '../models/NEPCompetency.js';
import NEPCoverageLog from '../models/NEPCoverageLog.js';
import SupportTicket from '../models/SupportTicket.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// School Admin Dashboard Stats
export const getSchoolStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalParents,
      totalFees,
      attendanceRate
    ] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      SchoolClass.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_parent' }),
      SchoolStudent.aggregate([
        { $match: { tenantId } },
        { $group: { _id: null, total: { $sum: '$fees.totalFees' } } }
      ]),
      SchoolStudent.aggregate([
        { $match: { tenantId } },
        { $group: { _id: null, avg: { $avg: '$attendance.percentage' } } }
      ])
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalParents,
      totalFees: totalFees[0]?.total || 0,
      attendanceRate: Math.round(attendanceRate[0]?.avg || 0)
    });
  } catch (error) {
    console.error('Error fetching school stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// School Activities
export const getSchoolActivities = async (req, res) => {
  try {
    const { tenantId } = req;

    // Mock activities - in real app, this would come from ActivityLog model
    const activities = [
      {
        title: 'New student enrolled',
        description: 'John Doe enrolled in Class 10A',
        time: '2 hours ago'
      },
      {
        title: 'Fee payment received',
        description: '₹15,000 received from Jane Smith',
        time: '4 hours ago'
      },
      {
        title: 'Parent meeting scheduled',
        description: 'PTM scheduled for Class 8B',
        time: '1 day ago'
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Error fetching school activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// School Classes
export const getSchoolClasses = async (req, res) => {
  try {
    const { tenantId } = req;

    const classes = await SchoolClass.find({ tenantId })
      .populate('sections.classTeacher', 'name email')
      .select('classNumber stream sections academicYear');

    const classesWithStats = classes.map(cls => ({
      name: `Class ${cls.classNumber}${cls.stream ? ` ${cls.stream}` : ''}`,
      students: cls.sections.reduce((sum, section) => sum + section.currentStrength, 0),
      sections: cls.sections.length,
      academicYear: cls.academicYear
    }));

    res.json(classesWithStats);
  } catch (error) {
    console.error('Error fetching school classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// School Students
// Create Student (School Admin)
export const createSchoolStudent = async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
     const { name, email, password, classId, section, academicYear, admissionNumber } = req.body;
     if (!name || !email || !password || !classId || !section || !academicYear || !admissionNumber) {
       return res.status(400).json({ message: 'Missing required fields' });
     }
     // Hash password
     const bcrypt = (await import('bcryptjs')).default;
     const hashedPassword = await bcrypt.hash(password, 10);
     // Create user
     const user = await User.create({
       name,
       email,
       password: hashedPassword,
       role: 'school_student',
       tenantId: req.tenantId
     });
     // Create SchoolStudent record
     const schoolStudent = await SchoolStudent.create({
       userId: user._id,
       classId,
       section,
       academicYear,
       admissionNumber,
       tenantId: req.tenantId
     });
    res.status(201).json({ user, schoolStudent });
  } catch (error) {
    console.error('Error creating school student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getSchoolStudents = async (req, res) => {
  try {
    const { tenantId } = req;

    const students = await SchoolStudent.find({ tenantId })
      .populate('userId', 'name email avatar')
      .populate('classId', 'classNumber stream')
      .select('admissionNumber rollNumber section academicYear parentIds');

    const studentsWithDetails = students.map(student => ({
      id: student._id,
      name: student.userId.name,
      email: student.userId.email,
      avatar: student.userId.avatar,
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber,
      class: `Class ${student.classId.classNumber}${student.classId.stream ? ` ${student.classId.stream}` : ''}`,
      section: student.section,
      academicYear: student.academicYear
    }));

    res.json(studentsWithDetails);
  } catch (error) {
    console.error('Error fetching school students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// School Teachers
// Create Teacher (School Admin)
export const createSchoolTeacher = async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { name, email, password, subject } = req.body;
    if (!name || !email || !password || !subject) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Hash password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'school_teacher',
      subject,
      tenantId: req.tenantId
    });
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating school teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getSchoolTeachers = async (req, res) => {
  try {
    const { tenantId } = req;
    const { subject, status } = req.query;

    const query = { tenantId, role: 'school_teacher' };
    if (subject) query.subject = subject;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const teachers = await User.find(query)
      .select('name email avatar phone subject isActive createdAt metadata')
      .lean();

    // Enhance with additional data
    const enhancedTeachers = await Promise.all(teachers.map(async (teacher) => {
      const [totalClasses, totalStudents] = await Promise.all([
        SchoolClass.countDocuments({ 
          tenantId,
          'sections.classTeacher': teacher._id
        }),
        SchoolStudent.countDocuments({ 
          tenantId,
          classId: { $in: teacher.assignedClasses || [] }
        })
      ]);

      return {
        ...teacher,
        totalClasses,
        totalStudents,
        experience: teacher.metadata?.experience || 0,
        qualification: teacher.metadata?.qualification || 'N/A',
        joiningDate: teacher.metadata?.joiningDate || teacher.createdAt
      };
    }));

    res.json({ teachers: enhancedTeachers });
  } catch (error) {
    console.error('Error fetching school teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get teacher statistics for admin dashboard
export const getAdminTeacherStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [total, activeTeachers, totalClasses, teachersData] = await Promise.all([
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      User.countDocuments({ tenantId, role: 'school_teacher', isActive: true }),
      SchoolClass.countDocuments({ tenantId }),
      User.find({ tenantId, role: 'school_teacher' }).select('metadata').lean()
    ]);

    // Calculate average experience
    const avgExperience = teachersData.length > 0 
      ? Math.round(teachersData.reduce((sum, t) => sum + (t.metadata?.experience || 0), 0) / teachersData.length)
      : 0;

    res.json({
      total,
      active: activeTeachers,
      inactive: total - activeTeachers,
      totalClasses,
      avgExperience
    });
  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get individual teacher details
export const getTeacherDetailsById = async (req, res) => {
  try {
    const { tenantId } = req;
    const { teacherId } = req.params;

    const teacher = await User.findOne({ _id: teacherId, tenantId, role: 'school_teacher' })
      .select('name email phone avatar subject isActive createdAt lastActive metadata')
      .lean();

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Get assigned classes with student count
    const assignedClasses = await SchoolClass.find({
      tenantId,
      'sections.classTeacher': teacher._id
    }).select('classNumber stream sections academicYear').lean();

    const classesWithStudents = await Promise.all(assignedClasses.map(async (cls) => {
      const studentCount = await SchoolStudent.countDocuments({
        tenantId,
        classId: cls._id
      });
      return {
        ...cls,
        students: studentCount
      };
    }));

    // Get total students under this teacher
    const totalStudents = await SchoolStudent.countDocuments({
      tenantId,
      classId: { $in: assignedClasses.map(c => c._id) }
    });

    const teacherData = {
      ...teacher,
      experience: teacher.metadata?.experience || 0,
      qualification: teacher.metadata?.qualification || 'N/A',
      joiningDate: teacher.metadata?.joiningDate || teacher.createdAt,
      totalClasses: assignedClasses.length,
      totalStudents,
      assignedClasses: classesWithStudents,
      attendance: 95, // Mock data - would come from attendance tracking
      metrics: {
        student_satisfaction: 85,
        assignment_completion: 92,
        class_performance: 78
      }
    };

    res.json({ teacher: teacherData });
  } catch (error) {
    console.error('Error fetching teacher details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new teacher (Enhanced)
export const createTeacher = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, email, phone, subject, qualification, experience, joiningDate, password } = req.body;

    if (!name || !email || !subject) {
      return res.status(400).json({ message: 'Missing required fields: name, email, and subject are required' });
    }

    // Check if teacher already exists
    const existingTeacher = await User.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher with this email already exists' });
    }

    // Create user account
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password || 'teacher123', 10);
    
    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'school_teacher',
      tenantId,
      orgId,
      phone,
      subject,
      isActive: true,
      metadata: {
        qualification: qualification || '',
        experience: parseInt(experience) || 0,
        joiningDate: joiningDate || new Date(),
      }
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'teacher_created',
      targetType: 'teacher',
      targetId: teacher._id,
      targetName: name,
      description: `New teacher ${name} added for subject ${subject}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        phone: teacher.phone
      }
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { tenantId } = req;
    const { teacherId } = req.params;

    // Find the teacher
    const teacher = await User.findOne({ _id: teacherId, tenantId, role: 'school_teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const teacherName = teacher.name;
    const teacherEmail = teacher.email;

    // Check if teacher is assigned to any classes
    const assignedClasses = await SchoolClass.countDocuments({
      tenantId,
      $or: [
        { 'sections.classTeacher': teacherId },
        { 'subjects.teachers': teacherId }
      ]
    });

    if (assignedClasses > 0) {
      return res.status(400).json({
        message: `Cannot delete teacher. This teacher is assigned to ${assignedClasses} class(es). Please reassign or remove assignments first.`
      });
    }

    // Delete the teacher account
    await User.findByIdAndDelete(teacherId);

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'teacher_deleted',
      targetType: 'teacher',
      targetId: teacherId,
      targetName: teacherName,
      description: `Teacher ${teacherName} (${teacherEmail}) permanently deleted`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export teachers to CSV
export const exportTeachers = async (req, res) => {
  try {
    const { tenantId } = req;
    const { subject, status, format = 'csv' } = req.query;

    const query = { tenantId, role: 'school_teacher' };
    if (subject) query.subject = subject;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const teachers = await User.find(query)
      .select('name email phone subject isActive createdAt metadata')
      .lean();

    if (format === 'csv') {
      // Create CSV content
      let csv = 'Name,Email,Phone,Subject,Qualification,Experience,Joining Date,Status\n';
      
      teachers.forEach(teacher => {
        csv += `"${teacher.name}","${teacher.email}","${teacher.phone || 'N/A'}","${teacher.subject || 'N/A'}","${teacher.metadata?.qualification || 'N/A'}","${teacher.metadata?.experience || 0}","${teacher.metadata?.joiningDate ? new Date(teacher.metadata.joiningDate).toLocaleDateString() : 'N/A'}","${teacher.isActive ? 'Active' : 'Inactive'}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=teachers-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({ teachers });
    }
  } catch (error) {
    console.error('Error exporting teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher Dashboard Stats
export const getTeacherStats = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const [
      totalStudents,
      totalClasses,
      attendanceRate,
      assignmentsGraded
    ] = await Promise.all([
      SchoolStudent.countDocuments({ 
        tenantId,
        classId: { $in: user.assignedClasses || [] }
      }),
      SchoolClass.countDocuments({ 
        tenantId,
        'sections.classTeacher': user._id
      }),
      SchoolStudent.aggregate([
        { $match: { tenantId } },
        { $group: { _id: null, avg: { $avg: '$attendance.percentage' } } }
      ]),
      // Mock data - in real app, this would come from Assignment model
      25
    ]);

    res.json({
      totalStudents,
      totalClasses,
      attendanceRate: Math.round(attendanceRate[0]?.avg || 0),
      assignmentsGraded
    });
  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher Classes
export const getTeacherClasses = async (req, res) => {
  try {
    const { tenantId, user, isLegacyUser } = req;

    // Build query based on user type
    const query = {
      'sections.classTeacher': user._id
    };
    
    // Add tenantId filter for multi-tenant users
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
    } else if (isLegacyUser) {
      query.allowLegacy = true; // Flag to bypass tenantId requirement
    }

    const classes = await SchoolClass.find(query)
      .populate('sections.classTeacher', 'name email')
      .select('classNumber stream sections academicYear')
      .catch(err => {
        console.error('SchoolClass query error:', err);
        return [];
      });

    // If no classes found, return mock data for demo purposes
    if (classes.length === 0) {
      return res.json([
        {
          name: 'Class 10A',
          students: 42,
          sections: 2,
          academicYear: '2024-25',
          avg: 85
        },
        {
          name: 'Class 9B',
          students: 38,
          sections: 2,
          academicYear: '2024-25',
          avg: 82
        },
        {
          name: 'Class 8A',
          students: 35,
          sections: 1,
          academicYear: '2024-25',
          avg: 88
        }
      ]);
    }

    const classesWithStats = classes.map(cls => ({
      name: `Class ${cls.classNumber}${cls.stream ? ` ${cls.stream}` : ''}`,
      students: cls.sections.reduce((sum, section) => sum + section.currentStrength, 0),
      sections: cls.sections.length,
      academicYear: cls.academicYear,
      avg: 85 // TODO: Calculate from student performance
    }));

    res.json(classesWithStats);
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Teacher Assignments
export const getTeacherAssignments = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const assignments = await Assignment.find({
      tenantId,
      teacherId: user._id,
      isActive: true
    })
      .sort({ dueDate: 1 })
      .limit(10)
      .lean();

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher Timetable
export const getTeacherTimetable = async (req, res) => {
  try {
    const { tenantId, user } = req;

    // Get current day
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = daysOfWeek[new Date().getDay()];

    const timetables = await Timetable.find({
      tenantId,
      'schedule.periods.teacherId': user._id,
      isActive: true
    }).lean();

    // Extract today's schedule for this teacher
    const todaySchedule = [];
    timetables.forEach(tt => {
      const daySchedule = tt.schedule.find(s => s.day === today);
      if (daySchedule) {
        daySchedule.periods.forEach(period => {
          if (period.teacherId && period.teacherId.toString() === user._id.toString()) {
            todaySchedule.push({
              subject: period.subject,
              class: tt.className,
              section: tt.section,
              time: period.startTime,
              room: period.room,
              startTime: period.startTime,
              endTime: period.endTime
            });
          }
        });
      }
    });

    res.json(todaySchedule);
  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Dashboard Stats
export const getStudentStats = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const student = await SchoolStudent.findOne({ 
      tenantId, 
      userId: user._id 
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      attendance: student.attendance?.percentage || 0,
      assignmentsCompleted: student.academicInfo?.assignmentsCompleted || 0,
      averageScore: student.academicInfo?.averageScore || 0,
      rank: student.academicInfo?.classRank || 0
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Assignments
export const getStudentAssignments = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Assignment model
    const assignments = [
      {
        title: 'Math Homework - Algebra',
        subject: 'Mathematics',
        dueDate: '2024-01-15',
        status: 'completed'
      },
      {
        title: 'Science Project - Photosynthesis',
        subject: 'Science',
        dueDate: '2024-01-20',
        status: 'pending'
      },
      {
        title: 'English Essay - Climate Change',
        subject: 'English',
        dueDate: '2024-01-18',
        status: 'overdue'
      }
    ];

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Timetable
export const getStudentTimetable = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Timetable model
    const timetable = [
      {
        subject: 'Mathematics',
        time: '09:00 AM',
        teacher: 'Mr. Smith',
        room: 'Room 101'
      },
      {
        subject: 'Science',
        time: '10:30 AM',
        teacher: 'Ms. Johnson',
        room: 'Lab 2'
      },
      {
        subject: 'English',
        time: '02:00 PM',
        teacher: 'Mr. Brown',
        room: 'Room 102'
      }
    ];

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching student timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Grades
export const getStudentGrades = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Grade model
    const grades = [
      {
        subject: 'Mathematics',
        assignment: 'Algebra Test',
        score: 85
      },
      {
        subject: 'Science',
        assignment: 'Physics Quiz',
        score: 92
      },
      {
        subject: 'English',
        assignment: 'Essay Writing',
        score: 78
      }
    ];

    res.json(grades);
  } catch (error) {
    console.error('Error fetching student grades:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Announcements
export const getStudentAnnouncements = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Announcement model
    const announcements = [
      {
        title: 'Holiday Notice',
        message: 'School will be closed on January 26th for Republic Day',
        date: '2024-01-20'
      },
      {
        title: 'Exam Schedule',
        message: 'Mid-term exams will start from February 1st',
        date: '2024-01-18'
      }
    ];

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching student announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Dashboard - Get Children
// Create Parent (School Admin)
export const createSchoolParent = async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { name, email, password, childId } = req.body;
    if (!name || !email || !password || !childId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Hash password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'school_parent',
      tenantId: req.tenantId
    });
    // Link parent to child
    await SchoolStudent.findByIdAndUpdate(childId, { $push: { parentIds: user._id } });
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating school parent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getParentChildren = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const children = await SchoolStudent.find({ 
      tenantId,
      parentIds: user._id
    })
    .populate('userId', 'name email avatar')
    .populate('classId', 'classNumber stream')
    .select('admissionNumber rollNumber section academicYear');

    const childrenWithDetails = children.map(child => ({
      id: child._id,
      name: child.userId.name,
      email: child.userId.email,
      avatar: child.userId.avatar,
      class: `Class ${child.classId.classNumber}${child.classId.stream ? ` ${child.classId.stream}` : ''}`,
      section: child.section,
      academicYear: child.academicYear
    }));

    res.json(childrenWithDetails);
  } catch (error) {
    console.error('Error fetching parent children:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Dashboard - Child Stats
export const getChildStats = async (req, res) => {
  try {
    const { tenantId } = req;
    const { childId } = req.params;

    const child = await SchoolStudent.findOne({ 
      tenantId, 
      _id: childId 
    });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json({
      attendance: child.attendance?.percentage || 0,
      averageScore: child.academicInfo?.averageScore || 0,
      assignmentsCompleted: child.academicInfo?.assignmentsCompleted || 0,
      rank: child.academicInfo?.classRank || 0
    });
  } catch (error) {
    console.error('Error fetching child stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Activities
export const getParentActivities = async (req, res) => {
  try {
    // Mock data - in real app, this would come from ActivityLog model
    const activities = [
      {
        title: 'Assignment submitted',
        description: 'Math homework submitted by John',
        time: '2 hours ago'
      },
      {
        title: 'Attendance marked',
        description: 'Present in all classes today',
        time: '4 hours ago'
      },
      {
        title: 'Grade received',
        description: 'Science test - 92%',
        time: '1 day ago'
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Error fetching parent activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Fees
export const getParentFees = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Fee model
    const fees = [
      {
        description: 'Tuition Fee - January',
        amount: 5000,
        dueDate: '2024-01-31',
        status: 'paid'
      },
      {
        description: 'Transport Fee - January',
        amount: 2000,
        dueDate: '2024-01-31',
        status: 'pending'
      },
      {
        description: 'Library Fee - January',
        amount: 500,
        dueDate: '2024-01-31',
        status: 'paid'
      }
    ];

    res.json(fees);
  } catch (error) {
    console.error('Error fetching parent fees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Announcements
export const getParentAnnouncements = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Announcement model
    const announcements = [
      {
        title: 'Parent-Teacher Meeting',
        message: 'PTM scheduled for Class 10A on January 25th at 2 PM',
        date: '2024-01-20'
      },
      {
        title: 'Fee Payment Reminder',
        message: 'Please pay the pending fees before the due date',
        date: '2024-01-18'
      }
    ];

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching parent announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students for teacher (search and filter)
export const getAllStudentsForTeacher = async (req, res) => {
  try {
    const { tenantId, user, isLegacyUser } = req;

    // Build query based on user type
    const query = {};
    
    // Add tenantId filter for multi-tenant users
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
      query.role = 'school_student';
    } else {
      // For legacy users, get all students
      query.role = { $in: ['student', 'school_student'] };
    }

    const students = await User.find(query)
      .select('name email role tenantId orgId createdAt')
      .lean()
      .catch(err => {
        console.error('User query error:', err);
        return [];
      });

    // Get additional data for each student
    const enrichedStudents = await Promise.all(students.map(async (student) => {
      try {
        // Get progress data
        const progress = await UserProgress.findOne({ userId: student._id }).lean();
        
        // Get wallet data
        const wallet = await Wallet.findOne({ userId: student._id }).lean();

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          class: 'N/A', // TODO: Get from student profile or class assignment
          rollNumber: 'N/A', // TODO: Get from student profile
          level: progress?.level || 1,
          xp: progress?.xp || 0,
          healCoins: wallet?.balance || 0,
          streak: progress?.streak || 0,
          createdAt: student.createdAt
        };
      } catch (error) {
        console.error(`Error enriching student ${student._id}:`, error);
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          class: 'N/A',
          rollNumber: 'N/A',
          level: 1,
          xp: 0,
          healCoins: 0,
          streak: 0,
          createdAt: student.createdAt
        };
      }
    }));

    // Get unique classes for filtering
    const classes = [...new Set(enrichedStudents.map(s => s.class).filter(c => c !== 'N/A'))];

    res.json({
      students: enrichedStudents,
      classes: classes.length > 0 ? classes : ['Class 8', 'Class 9', 'Class 10'] // Fallback
    });
  } catch (error) {
    console.error('Error fetching all students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get individual student analytics for teacher (EXACT copy of parent analytics logic)
export const getStudentAnalyticsForTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tenantId, isLegacyUser, user: teacher } = req;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Fetch student data
    const student = await User.findById(studentId).select('name email role tenantId createdAt dob avatar academic institution linkedIds').lean();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify tenant isolation (if applicable)
    if (!isLegacyUser && tenantId && student.tenantId !== tenantId) {
      return res.status(403).json({ message: 'Access denied to this student' });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch all required data in parallel (SAME AS PARENT)
    const [
      userProgress,
      gameProgress,
      wallet,
      transactions,
      moodLogs,
      activityLogs,
      notifications
    ] = await Promise.all([
      UserProgress.findOne({ userId: studentId }),
      UnifiedGameProgress.find({ userId: studentId }),
      Wallet.findOne({ userId: studentId }),
      Transaction.find({ 
        userId: studentId,
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 }).limit(10),
      MoodLog.find({ 
        userId: studentId,
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 }).limit(7),
      ActivityLog.find({
        userId: studentId,
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 }),
      Notification.find({
        userId: studentId,
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 }).limit(10)
    ]);

    // 1. Calculate Overall Mastery % & Trend (SAME AS PARENT)
    const pillarsData = {};
    const pillarNames = [
      'Financial Literacy', 'Brain Health', 'UVLS', 
      'Digital Citizenship', 'Moral Values', 'AI for All',
      'Health - Male', 'Health - Female', 'Entrepreneurship', 
      'Civic Responsibility'
    ];

    pillarNames.forEach(pillar => {
      const pillarGames = gameProgress.filter(g => g.category === pillar);
      if (pillarGames.length > 0) {
        const totalProgress = pillarGames.reduce((sum, g) => sum + (g.progress || 0), 0);
        pillarsData[pillar] = Math.round(totalProgress / pillarGames.length);
      }
    });

    const overallMastery = Object.keys(pillarsData).length > 0
      ? Math.round(Object.values(pillarsData).reduce((a, b) => a + b, 0) / Object.keys(pillarsData).length)
      : 0;

    // 2. Weekly Engagement Minutes & Sessions Breakdown (SAME AS PARENT)
    const weeklyEngagement = {
      totalMinutes: 0,
      gamesMinutes: 0,
      lessonsMinutes: 0,
      totalSessions: (activityLogs || []).length,
      gameSessions: 0,
      lessonSessions: 0
    };

    (activityLogs || []).forEach(log => {
      const duration = log.duration || 5;
      weeklyEngagement.totalMinutes += duration;
      
      if (log.activityType === 'game' || log.action?.includes('game')) {
        weeklyEngagement.gamesMinutes += duration;
        weeklyEngagement.gameSessions++;
      } else {
        weeklyEngagement.lessonsMinutes += duration;
        weeklyEngagement.lessonSessions++;
      }
    });

    // 3. Last 7 Mood Entries Summary & Alerts (SAME AS PARENT)
    const moodSummary = {
      entries: (moodLogs || []).map(log => ({
        date: log.createdAt,
        mood: log.mood,
        score: log.score || 3,
        note: log.note || '',
        emoji: log.emoji || '😊'
      })),
      averageScore: (moodLogs || []).length > 0
        ? ((moodLogs || []).reduce((sum, log) => sum + (log.score || 3), 0) / (moodLogs || []).length).toFixed(1)
        : 3.0,
      alerts: []
    };

    // 4. Recent Achievements (SAME AS PARENT)
    const achievements = [];
    (gameProgress || []).forEach(game => {
      if (game.achievements && game.achievements.length > 0) {
        game.achievements.forEach(achievement => {
          achievements.push({
            game: game.game,
            category: game.category,
            achievement: achievement,
            unlockedAt: game.lastPlayed,
            type: 'badge'
          });
        });
      }
      
      if (game.completed) {
        achievements.push({
          game: game.game,
          category: game.category,
          achievement: 'Completion Certificate',
          unlockedAt: game.completedAt || game.lastPlayed,
          type: 'certificate'
        });
      }
    });

    achievements.sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt));
    const recentAchievements = achievements.slice(0, 10);

    // 5. HealCoins Earned & Recent Spends (SAME AS PARENT)
    const coinsEarned = transactions.filter(t => t.type === 'credit');
    const coinsSpent = transactions.filter(t => t.type === 'debit');
    
    const healCoins = {
      currentBalance: wallet?.balance || 0,
      weeklyEarned: coinsEarned.reduce((sum, t) => sum + t.amount, 0),
      weeklySpent: coinsSpent.reduce((sum, t) => sum + Math.abs(t.amount), 0),
      recentTransactions: transactions.slice(0, 5).map(t => ({
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.createdAt
      }))
    };

    // 6. Calculate coins (SAME AS PARENT)
    const weeklyCoins = (transactions || [])
      .filter(t => t.type === 'earned' && new Date(t.createdAt) >= sevenDaysAgo)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const monthlyCoins = (transactions || [])
      .filter(t => t.type === 'earned' && new Date(t.createdAt) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // 7. Games completed per pillar (SAME AS PARENT)
    const gamesPerPillar = {};
    pillarNames.forEach(pillar => {
      gamesPerPillar[pillar] = (gameProgress || []).filter(g => 
        g.completed && g.category === pillar
      ).length;
    });

    // Build home support plan
    const homeSupportPlan = [
      {
        title: 'Complete Daily Practice',
        description: 'Encourage consistent learning habits with daily exercises',
        priority: 'high',
        pillar: 'Routine',
        actionable: 'Set aside 20 minutes daily for practice'
      },
      {
        title: 'Review Key Concepts',
        description: 'Reinforce understanding of recently learned topics',
        priority: 'medium',
        pillar: 'Learning',
        actionable: 'Review 2-3 concepts from last week'
      },
      {
        title: 'Track Progress Together',
        description: 'Monitor achievements and celebrate milestones',
        priority: 'low',
        pillar: 'Motivation',
        actionable: 'Weekly review of progress and goals'
      }
    ];

    // 8. Generate Conversation Prompts based on mood (SAME AS PARENT)
    const conversationPrompts = [];
    if (moodSummary.averageScore < 3) {
      conversationPrompts.push({
        icon: '💙',
        prompt: `"How was your day today, ${student.name}? I noticed you might be feeling a bit down lately."`,
        context: 'Low mood detected this week'
      });
      conversationPrompts.push({
        icon: '🤗',
        prompt: `"Is there anything on your mind that you'd like to talk about?"`,
        context: 'Open-ended support'
      });
    } else if (moodSummary.averageScore >= 4) {
      conversationPrompts.push({
        icon: '🎉',
        prompt: `"You seem to be in a great mood lately! What's been making you happy?"`,
        context: 'Positive mood trend'
      });
      conversationPrompts.push({
        icon: '🌟',
        prompt: `"What's been your favorite part about learning this week?"`,
        context: 'Engagement follow-up'
      });
    } else {
      conversationPrompts.push({
        icon: '😊',
        prompt: `"How was your day today, ${student.name}? Tell me what you learned!"`,
        context: 'General check-in'
      });
      conversationPrompts.push({
        icon: '🎯',
        prompt: `"What are you most excited to learn about next?"`,
        context: 'Goal setting'
      });
    }

    // 9. Strengths and Needs Support (AI-based analysis - SAME AS PARENT)
    const pillarEntries = Object.entries(pillarsData);
    const sortedPillars = pillarEntries.sort((a, b) => b[1] - a[1]);
    
    const strengths = sortedPillars
      .slice(0, 3)
      .map(([pillar, percentage]) => {
        const strengthMap = {
          'Financial Literacy': 'Financial Planning',
          'Brain Health': 'Problem Solving',
          'UVLS': 'Emotional Intelligence',
          'Digital Citizenship & Online Safety': 'Digital Safety',
          'Moral Values': 'Ethical Decision Making',
          'AI for All': 'AI Literacy',
          'Health - Male': 'Health Awareness',
          'Health - Female': 'Health Awareness',
          'Entrepreneurship & Higher Education': 'Entrepreneurial Thinking',
          'Civic Responsibility & Global Citizenship': 'Global Awareness'
        };
        return strengthMap[pillar] || pillar;
      });

    const needsSupport = sortedPillars
      .slice(-3)
      .map(([pillar, percentage]) => {
        const supportMap = {
          'Financial Literacy': 'Advanced Financial Planning',
          'Brain Health': 'Time Management',
          'UVLS': 'Leadership Skills',
          'Digital Citizenship & Online Safety': 'Advanced Coding',
          'Moral Values': 'Ethical Leadership',
          'AI for All': 'Advanced Coding',
          'Health - Male': 'Health Management',
          'Health - Female': 'Health Management',
          'Entrepreneurship & Higher Education': 'Business Strategy',
          'Civic Responsibility & Global Citizenship': 'Community Leadership'
        };
        return supportMap[pillar] || pillar;
      });

    // 10. Activity Timeline (SAME AS PARENT)
    const activityTimeline = (activityLogs || []).map(log => ({
      action: log.action || 'Activity',
      game: log.game || 'Unknown',
      category: log.category || 'General',
      duration: log.duration || 5,
      timestamp: log.timestamp || log.createdAt,
      xpEarned: log.xpEarned || 0
    }));

    // 11. Messages (SAME AS PARENT)
    const messages = (notifications || [])
      .filter(n => n.type === 'message')
      .slice(0, 5)
      .map(n => ({
        type: n.type,
        title: n.title,
        message: n.message,
        sender: 'System',
        timestamp: n.createdAt,
        read: n.read || false,
        requiresAction: n.title?.toLowerCase().includes('permission') || n.title?.toLowerCase().includes('consent')
      }));

    // 12. Detailed Progress Report Data (SAME AS PARENT)
    const detailedProgressReport = {
      weeklyCoins,
      monthlyCoins,
      totalTimeMinutes: weeklyEngagement.totalMinutes,
      dayStreak: userProgress?.streak || 0,
      gamesPerPillar,
      strengths,
      needsSupport
    };

    // 13. Wallet & Rewards Data (SAME AS PARENT)
    const redemptions = (transactions || [])
      .filter(t => t.type === 'spent' && t.description?.toLowerCase().includes('redemption'))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(t => ({
        item: t.description?.replace('Redemption: ', '') || 'Unknown Item',
        date: t.createdAt,
        coins: Math.abs(t.amount || 0),
        value: Math.abs(t.amount || 0) * 0.67
      }));

    const totalValueSaved = redemptions
      .filter(r => new Date(r.date) >= thirtyDaysAgo)
      .reduce((sum, r) => sum + r.value, 0);

    const walletRewards = {
      currentHealCoins: healCoins.currentBalance || 0,
      recentRedemptions: redemptions,
      totalValueSaved
    };

    // 14. Digital Twin Growth Data (SAME AS PARENT)
    const calculateWeeklyProgress = (gameProgress, category) => {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weeklyData = [0, 0, 0, 0];
      
      const categoryGames = (gameProgress || []).filter(g => g.category === category);
      
      categoryGames.forEach(game => {
        if (game.completed && game.lastPlayed) {
          const playDate = new Date(game.lastPlayed);
          const weekIndex = Math.min(Math.floor((Date.now() - playDate.getTime()) / (7 * 24 * 60 * 60 * 1000)), 3);
          if (weekIndex >= 0 && weekIndex < 4) {
            weeklyData[weekIndex] += (game.progress || 0) * 0.1;
          }
        }
      });
      
      for (let i = 1; i < 4; i++) {
        if (weeklyData[i] === 0) {
          weeklyData[i] = Math.min(weeklyData[i-1] + Math.random() * 5 + 2, 100);
        }
      }
      
      return weeklyData.map(val => Math.round(Math.min(val, 100)));
    };

    const digitalTwinData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      finance: calculateWeeklyProgress(gameProgress, 'Finance'),
      mentalWellness: calculateWeeklyProgress(gameProgress, 'Mental Wellness'),
      values: calculateWeeklyProgress(gameProgress, 'Values'),
      aiSkills: calculateWeeklyProgress(gameProgress, 'AI Skills')
    };

    // 15. Skills Distribution Data (SAME AS PARENT)
    const totalGames = (gameProgress || []).length;
    const categoryCounts = {};
    
    (gameProgress || []).forEach(game => {
      if (game.completed) {
        categoryCounts[game.category] = (categoryCounts[game.category] || 0) + 1;
      }
    });

    const totalCompleted = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
    
    const skillsDistribution = {
      finance: totalCompleted > 0 ? Math.round((categoryCounts['Finance'] || 0) / totalCompleted * 100) : 32,
      mentalWellness: totalCompleted > 0 ? Math.round((categoryCounts['Mental Wellness'] || 0) / totalCompleted * 100) : 28,
      values: totalCompleted > 0 ? Math.round((categoryCounts['Values'] || 0) / totalCompleted * 100) : 22,
      aiSkills: totalCompleted > 0 ? Math.round((categoryCounts['AI Skills'] || 0) / totalCompleted * 100) : 18
    };

    // 16. Child Card Info (SAME AS PARENT)
    const childCard = {
      name: student.name,
      avatar: student.avatar || '/avatars/avatar1.png',
      email: student.email,
      grade: student.academic?.grade || student.institution || 'Not specified',
      age: student.dob ? Math.floor((Date.now() - new Date(student.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
      teacherContact: null // Teacher viewing student, so no teacher contact shown
    };

    // 17. Snapshot KPIs (SAME AS PARENT)
    const snapshotKPIs = {
      totalGamesCompleted: (gameProgress || []).filter(g => g.completed).length,
      totalTimeSpent: weeklyEngagement.totalMinutes,
      averageDailyEngagement: Math.round(weeklyEngagement.totalMinutes / 7),
      achievementsUnlocked: recentAchievements.length,
      currentStreak: userProgress?.streak || 0,
      moodTrend: parseFloat(moodSummary.averageScore) >= 3.5 ? 'positive' : parseFloat(moodSummary.averageScore) >= 2.5 ? 'neutral' : 'concerning'
    };

    // Return EXACT same structure as parent endpoint
    res.json({
      childCard,
      snapshotKPIs,
      detailedProgressReport,
      walletRewards,
      childName: student.name,
      overallMastery: {
        percentage: overallMastery,
        byPillar: pillarsData
      },
      digitalTwinData,
      skillsDistribution,
      weeklyEngagement,
      moodSummary: {
        ...moodSummary,
        conversationPrompts
      },
      activityTimeline,
      homeSupportPlan,
      messages,
      recentAchievements,
      healCoins,
      level: userProgress?.level || 1,
      xp: userProgress?.xp || 0,
      streak: userProgress?.streak || 0,
      // Also include student object for backward compatibility
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar || '/avatars/avatar1.png',
        grade: student.academic?.grade || student.institution || 'Not specified',
        institution: student.institution || 'School Name',
        age: student.dob ? Math.floor((Date.now() - new Date(student.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        level: userProgress?.level || 1,
        xp: userProgress?.xp || 0,
        healCoins: wallet?.balance || 0,
        streak: userProgress?.streak || 0
      },
      // Include analytics object for components that expect it
      analytics: {
        overallMastery,
        weeklyEngagement: weeklyEngagement.totalMinutes,
        totalSessions: weeklyEngagement.totalSessions,
        moodSummary: moodSummary.entries,
        conversationPrompts,
        activityLogs: activityTimeline,
        homeSupportPlan,
        digitalTwinData,
        skillsDistribution,
        notifications,
        recentTransactions: transactions
      }
    });
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get class mastery by pillar
export const getClassMasteryByPillar = async (req, res) => {
  try {
    const { tenantId, user, isLegacyUser } = req;

    // Get all students in teacher's classes
    const query = {};
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
      query.role = 'school_student';
    } else {
      query.role = { $in: ['student', 'school_student'] };
    }

    const students = await User.find(query).select('_id').lean();
    const studentIds = students.map(s => s._id);

    // Get game progress for all students
    const gameProgress = await UnifiedGameProgress.find({ 
      userId: { $in: studentIds } 
    }).lean();

    // Calculate mastery by pillar
    const pillarNames = [
      'Financial Literacy', 'Brain Health', 'UVLS', 
      'Digital Citizenship', 'Moral Values', 'AI for All'
    ];

    const classMastery = {};
    pillarNames.forEach(pillar => {
      const pillarGames = gameProgress.filter(g => g.category === pillar);
      if (pillarGames.length > 0) {
        const avgProgress = pillarGames.reduce((sum, g) => sum + (g.progress || 0), 0) / pillarGames.length;
        classMastery[pillar] = Math.round(avgProgress);
      } else {
        classMastery[pillar] = 0;
      }
    });

    res.json(classMastery);
  } catch (error) {
    console.error('Error fetching class mastery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students at risk
export const getStudentsAtRisk = async (req, res) => {
  try {
    const { tenantId, isLegacyUser } = req;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get all students
    const query = {};
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
      query.role = 'school_student';
    } else {
      query.role = { $in: ['student', 'school_student'] };
    }

    const students = await User.find(query).select('_id name avatar').lean();
    const atRiskStudents = [];

    // Check each student for risk factors
    for (const student of students) {
      // Check engagement
      const recentActivities = await ActivityLog.find({
        userId: student._id,
        createdAt: { $gte: sevenDaysAgo }
      }).lean();

      const totalMinutes = recentActivities.reduce((sum, log) => sum + (log.duration || 0), 0);

      // Check mood
      const recentMoods = await MoodLog.find({
        userId: student._id,
        createdAt: { $gte: sevenDaysAgo }
      }).lean();

      const avgMood = recentMoods.length > 0
        ? recentMoods.reduce((sum, log) => sum + (log.score || 3), 0) / recentMoods.length
        : 3;

      // Flag if low engagement (< 30 min/week) or low mood (< 2.5)
      if (totalMinutes < 30) {
        atRiskStudents.push({
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          reason: 'Low engagement',
          riskLevel: 'High',
          metric: `${totalMinutes}min/week`
        });
      } else if (avgMood < 2.5) {
        atRiskStudents.push({
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          reason: 'Low mood pattern',
          riskLevel: 'Medium',
          metric: `Avg mood: ${avgMood.toFixed(1)}`
        });
      }
    }

    res.json({ students: atRiskStudents.slice(0, 10) }); // Top 10 at-risk students
  } catch (error) {
    console.error('Error fetching students at risk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get average session engagement
export const getSessionEngagement = async (req, res) => {
  try {
    const { tenantId, isLegacyUser } = req;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get all students
    const query = {};
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
      query.role = 'school_student';
    } else {
      query.role = { $in: ['student', 'school_student'] };
    }

    const students = await User.find(query).select('_id').lean();
    const studentIds = students.map(s => s._id);

    // Get activity logs
    const activityLogs = await ActivityLog.find({
      userId: { $in: studentIds },
      createdAt: { $gte: sevenDaysAgo }
    }).lean();

    // Calculate engagement percentages
    const totalSessions = activityLogs.length;
    const gameSessions = activityLogs.filter(log => 
      log.activityType === 'game' || log.action?.includes('game')
    ).length;
    const lessonSessions = totalSessions - gameSessions;

    const engagement = {
      games: totalSessions > 0 ? Math.round((gameSessions / totalSessions) * 100) : 0,
      lessons: totalSessions > 0 ? Math.round((lessonSessions / totalSessions) * 100) : 0,
      overall: totalSessions > 0 ? Math.round(((gameSessions + lessonSessions) / totalSessions) * 100) : 0
    };

    res.json(engagement);
  } catch (error) {
    console.error('Error fetching session engagement:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending grading tasks
export const getPendingTasks = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const assignments = await Assignment.find({
      tenantId,
      teacherId: user._id,
      status: { $in: ['pending', 'in_progress'] },
      isActive: true
    })
      .sort({ priority: -1, dueDate: 1 })
      .lean();

    const tasks = assignments.map(assignment => ({
      _id: assignment._id,
      title: assignment.title,
      class: assignment.className,
      section: assignment.section,
      dueDate: new Date(assignment.dueDate).toLocaleDateString(),
      priority: assignment.priority,
      type: assignment.type,
      status: assignment.status,
      submissions: assignment.submissions?.length || 0,
      totalStudents: assignment.submissions?.length || 0
    }));

    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get top 5 students leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { tenantId, isLegacyUser } = req;

    // Get all students
    const query = {};
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
      query.role = 'school_student';
    } else {
      query.role = { $in: ['student', 'school_student'] };
    }

    const students = await User.find(query).select('_id name avatar').lean();
    
    // Get progress and wallet for each student
    const leaderboardData = await Promise.all(
      students.map(async (student) => {
        const [progress, wallet] = await Promise.all([
          UserProgress.findOne({ userId: student._id }).lean(),
          Wallet.findOne({ userId: student._id }).lean()
        ]);

        return {
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          class: 'N/A', // TODO: Get from student profile
          totalXP: progress?.xp || 0,
          level: progress?.level || 1,
          healCoins: wallet?.balance || 0,
          streak: progress?.streak || 0
        };
      })
    );

    // Sort by total XP and take top 5
    const topStudents = leaderboardData
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, 5);

    res.json({ leaderboard: topStudents });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students for a specific class
export const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const { tenantId, isLegacyUser } = req;

    // For now, return all students (in real app, filter by class)
    const query = {};
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
      query.role = 'school_student';
    } else {
      query.role = { $in: ['student', 'school_student'] };
    }

    const students = await User.find(query).select('_id name email avatar lastActive').lean();

    // Enrich with progress data
    const enrichedStudents = await Promise.all(
      students.map(async (student, index) => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [progress, wallet, gameProgress, recentMoods, recentActivities] = await Promise.all([
          UserProgress.findOne({ userId: student._id }).lean(),
          Wallet.findOne({ userId: student._id }).lean(),
          UnifiedGameProgress.find({ userId: student._id }).lean(),
          MoodLog.find({ userId: student._id, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(1).lean(),
          ActivityLog.find({ userId: student._id, createdAt: { $gte: sevenDaysAgo } }).lean()
        ]);

        // Calculate pillar mastery
        const pillarsData = {};
        const pillarNames = ['Financial Literacy', 'Brain Health', 'UVLS', 'Digital Citizenship', 'Moral Values', 'AI for All'];
        
        pillarNames.forEach(pillar => {
          const pillarGames = gameProgress.filter(g => g.category === pillar);
          if (pillarGames.length > 0) {
            const totalProgress = pillarGames.reduce((sum, g) => sum + (g.progress || 0), 0);
            pillarsData[pillar] = Math.round(totalProgress / pillarGames.length);
          }
        });

        const pillarMastery = Object.keys(pillarsData).length > 0
          ? Math.round(Object.values(pillarsData).reduce((a, b) => a + b, 0) / Object.keys(pillarsData).length)
          : 0;

        // Get recent mood
        const latestMood = recentMoods[0];
        const moodScore = latestMood?.score || 3;
        const moodEmojis = {
          1: '😢',
          2: '😔',
          3: '😊',
          4: '😄',
          5: '🤩'
        };

        const totalMinutes = recentActivities.reduce((sum, log) => sum + (log.duration || 0), 0);
        const avgMood = recentMoods.length > 0 ? recentMoods.reduce((sum, log) => sum + (log.score || 3), 0) / recentMoods.length : 3;
        const flagged = totalMinutes < 30 || avgMood < 2.5;

        // Format last active
        const lastActive = student.lastActive 
          ? formatTimeAgo(student.lastActive)
          : 'Never';

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          rollNumber: index + 1,
          level: progress?.level || 1,
          xp: progress?.xp || 0,
          coins: wallet?.balance || 0,
          streak: progress?.streak || 0,
          pillarMastery,
          moodScore,
          moodEmoji: moodEmojis[moodScore] || '😊',
          lastActive,
          flagged
        };
      })
    );

    res.json({ students: enrichedStudents });
  } catch (error) {
    console.error('Error fetching class students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get teacher messages/inbox
export const getTeacherMessages = async (req, res) => {
  try {
    const { tenantId, user: teacherId } = req;

    // Get notifications addressed to teacher
    const notifications = await Notification.find({
      userId: teacherId._id,
      type: { $in: ['message', 'announcement', 'alert'] }
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Get announcements for teachers
    const announcements = await Announcement.find({
      tenantId,
      targetAudience: { $in: ['all', 'teachers'] },
      isActive: true,
      publishDate: { $lte: new Date() },
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: new Date() } }
      ]
    })
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(10)
      .lean();

    // Combine and format messages
    const messages = [
      ...notifications.map(n => ({
        _id: n._id,
        subject: n.title || 'New Message',
        message: n.message,
        sender: n.metadata?.senderName || 'System',
        time: formatTimeAgo(n.createdAt),
        read: n.read || false,
        type: 'notification'
      })),
      ...announcements.map(a => ({
        _id: a._id,
        subject: a.title,
        message: a.message,
        sender: a.createdByName || 'Administration',
        time: formatTimeAgo(a.publishDate),
        read: a.readBy?.some(r => r.userId.toString() === teacherId._id.toString()) || false,
        type: 'announcement',
        priority: a.priority,
        isPinned: a.isPinned
      }))
    ].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get class missions analytics
export const getClassMissions = async (req, res) => {
  try {
    // Mock data - in real app, would come from Mission/Assignment model
    const missions = {
      total: 20,
      completed: 12,
      inProgress: 5,
      notStarted: 3
    };

    res.json(missions);
  } catch (error) {
    console.error('Error fetching class missions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Assignment/Task
export const createAssignment = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const assignmentData = req.body;

    // Get orgId if available
    let orgId = user.orgId || null;
    if (!orgId && tenantId) {
      const org = await Organization.findOne({ tenantId });
      if (org) {
        orgId = org._id;
      }
    }

    const assignmentToCreate = {
      ...assignmentData,
      tenantId: tenantId || 'default',
      teacherId: user._id
    };

    if (orgId) {
      assignmentToCreate.orgId = orgId;
    }

    const assignment = await Assignment.create(assignmentToCreate);

    res.status(201).json({ 
      success: true,
      assignment, 
      message: 'Assignment created successfully' 
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create assignment', 
      error: error.message 
    });
  }
};

// Update Assignment/Task
export const updateAssignment = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { assignmentId } = req.params;
    const updates = req.body;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, tenantId, teacherId: user._id },
      updates,
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ assignment, message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Assignment/Task
export const deleteAssignment = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { assignmentId } = req.params;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, tenantId, teacherId: user._id },
      { isActive: false },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { user } = req;
    const { messageId } = req.params;
    const { type } = req.body; // 'notification' or 'announcement'

    if (type === 'announcement') {
      const announcement = await Announcement.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: { userId: user._id, readAt: new Date() } } },
        { new: true }
      );
      return res.json({ success: true, announcement });
    } else {
      const notification = await Notification.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );
      return res.json({ success: true, notification });
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create sample data for testing
export const createSampleData = async (req, res) => {
  try {
    const { tenantId, user } = req;

    // Get orgId if available, otherwise null is fine (we made it optional)
    let orgId = user.orgId || null;
    
    // If no orgId, try to find existing organization
    if (!orgId && tenantId) {
      const org = await Organization.findOne({ tenantId });
      if (org) {
        orgId = org._id;
      }
    }

    // Create sample assignments
    const sampleAssignments = [];
    
    const assignmentTemplates = [
      {
        title: 'Math Quiz - Algebra',
        description: 'Complete algebra problems from chapter 5',
        subject: 'Mathematics',
        className: 'Class 10A',
        section: 'A',
        priority: 'high',
        type: 'grading',
        days: 7
      },
      {
        title: 'Science Project Review',
        description: 'Review and approve science fair projects',
        subject: 'Science',
        className: 'Class 9B',
        section: 'B',
        priority: 'medium',
        type: 'approval',
        days: 10
      },
      {
        title: 'English Essay Grading',
        description: 'Grade essays on climate change',
        subject: 'English',
        className: 'Class 8A',
        section: 'A',
        priority: 'low',
        type: 'grading',
        days: 14
      }
    ];

    for (const template of assignmentTemplates) {
      const assignment = {
        tenantId: tenantId || 'default',
        title: template.title,
        description: template.description,
        subject: template.subject,
        className: template.className,
        section: template.section,
        teacherId: user._id,
        dueDate: new Date(Date.now() + template.days * 24 * 60 * 60 * 1000),
        priority: template.priority,
        type: template.type,
        status: 'pending'
      };
      
      if (orgId) {
        assignment.orgId = orgId;
      }
      
      sampleAssignments.push(assignment);
    }

    const assignments = await Assignment.insertMany(sampleAssignments);

    // Create sample announcements
    const sampleAnnouncements = [];
    
    const announcementTemplates = [
      {
        title: 'Parent-Teacher Meeting',
        message: 'PTM scheduled for all classes on January 25th at 2 PM. Please ensure your availability.',
        type: 'meeting',
        priority: 'high',
        targetAudience: 'teachers',
        isPinned: true
      },
      {
        title: 'Fee Payment Reminder',
        message: 'Reminder: Quarterly fee payment deadline is approaching. Please inform parents.',
        type: 'fee',
        priority: 'normal',
        targetAudience: 'all',
        isPinned: false
      }
    ];

    for (const template of announcementTemplates) {
      const announcement = {
        tenantId: tenantId || 'default',
        title: template.title,
        message: template.message,
        type: template.type,
        priority: template.priority,
        targetAudience: template.targetAudience,
        createdBy: user._id,
        createdByName: user.name,
        createdByRole: user.role,
        isPinned: template.isPinned
      };
      
      if (orgId) {
        announcement.orgId = orgId;
      }
      
      sampleAnnouncements.push(announcement);
    }

    const announcements = await Announcement.insertMany(sampleAnnouncements);

    res.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        assignments: assignments.length,
        announcements: announcements.length,
        assignmentIds: assignments.map(a => a._id),
        announcementIds: announcements.map(a => a._id)
      }
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create sample data', 
      error: error.message
    });
  }
};

// Get teacher settings
export const getTeacherSettings = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id).select('preferences');
    
    const settings = {
      classroom: teacher.preferences?.classroom || {},
      notifications: teacher.preferences?.notifications || {},
      privacy: teacher.preferences?.privacy || {},
      display: teacher.preferences?.display || {}
    };

    res.json(settings);
  } catch (error) {
    console.error('Error fetching teacher settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

// Update teacher settings
export const updateTeacherSettings = async (req, res) => {
  try {
    const { classroom, notifications, privacy, display } = req.body;
    
    const update = {};
    if (classroom) update['preferences.classroom'] = classroom;
    if (notifications) update['preferences.notifications'] = notifications;
    if (privacy) update['preferences.privacy'] = privacy;
    if (display) update['preferences.display'] = display;

    await User.findByIdAndUpdate(req.user._id, { $set: update });

    res.json({ 
      success: true,
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating teacher settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update settings', 
      error: error.message 
    });
  }
};

// Get detailed student info for slide-over panel
export const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [student, activityLogs, moodLogs] = await Promise.all([
      User.findById(studentId).select('name email avatar teacherNotes flaggedForCounselor flaggedReason consentFlags').lean(),
      ActivityLog.find({ userId: studentId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(10).lean(),
      MoodLog.find({ userId: studentId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(5).lean()
    ]);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Format timeline
    const timeline = [
      ...activityLogs.map(log => ({
        type: log.activityType || 'activity',
        action: log.action || 'Activity',
        details: log.details || log.game || '',
        time: formatTimeAgo(log.createdAt),
        timestamp: log.createdAt
      })),
      ...moodLogs.map(log => ({
        type: 'mood',
        action: `Logged mood: ${log.mood || 'Happy'}`,
        details: `Score: ${log.score || 3}/5${log.note ? ` - ${log.note}` : ''}`,
        time: formatTimeAgo(log.createdAt),
        timestamp: log.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

    // Get recent mood
    const recentMood = moodLogs[0] ? {
      mood: moodLogs[0].mood,
      score: moodLogs[0].score,
      emoji: moodLogs[0].emoji || '😊',
      note: moodLogs[0].note
    } : null;

    res.json({
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar
      },
      timeline,
      notes: student.teacherNotes || [],
      flagged: student.flaggedForCounselor || false,
      flagReason: student.flaggedReason || '',
      recentMood,
      consentFlags: student.consentFlags || {}
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save teacher note for student
export const saveStudentNote = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { note } = req.body;
    const teacherId = req.user._id;

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Initialize teacherNotes if not exists
    if (!student.teacherNotes) {
      student.teacherNotes = [];
    }

    // Add new note
    student.teacherNotes.push({
      text: note,
      teacher: req.user.name,
      teacherId,
      date: new Date()
    });

    await student.save();

    res.json({
      success: true,
      message: 'Note saved successfully',
      note: student.teacherNotes[student.teacherNotes.length - 1]
    });
  } catch (error) {
    console.error('Error saving student note:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle student flag for counselor
export const toggleStudentFlag = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { flagged, reason } = req.body;

    const student = await User.findByIdAndUpdate(
      studentId,
      {
        flaggedForCounselor: flagged,
        flaggedReason: reason || '',
        flaggedBy: req.user._id,
        flaggedAt: flagged ? new Date() : null
      },
      { new: true }
    ).select('flaggedForCounselor flaggedReason');

    res.json({
      success: true,
      message: flagged ? 'Student flagged for counselor' : 'Flag removed',
      flagged: student.flaggedForCounselor
    });
  } catch (error) {
    console.error('Error toggling student flag:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send message to student
export const sendStudentMessage = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { message } = req.body;
    const teacherId = req.user._id;

    // Create notification for student
    await Notification.create({
      userId: studentId,
      type: 'message',
      title: `Message from ${req.user.name}`,
      message: message,
      metadata: {
        senderName: req.user.name,
        senderId: teacherId,
        sentAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate invite link
export const generateInviteLink = async (req, res) => {
  try {
    const { classId, className } = req.body;
    const teacherId = req.user._id;
    const { tenantId } = req;

    // Create a unique invite code
    const inviteCode = `${tenantId || 'public'}-${classId}-${Date.now()}`;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/join-class?code=${inviteCode}&class=${classId}&teacher=${teacherId}`;

    // Store invite code in database (optional - for tracking)
    await User.findByIdAndUpdate(teacherId, {
      $push: {
        'metadata.inviteCodes': {
          code: inviteCode,
          classId,
          className,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      }
    });

    res.json({
      success: true,
      inviteLink,
      inviteCode
    });
  } catch (error) {
    console.error('Error generating invite link:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send email invites
export const sendEmailInvites = async (req, res) => {
  try {
    const { emails, inviteLink, className } = req.body;
    const teacherName = req.user.name;

    // In a real application, you would use an email service like SendGrid, Mailgun, etc.
    // For now, we'll just simulate sending emails
    
    // Here's where you would integrate with your email service:
    // await emailService.sendBulkInvites({
    //   emails,
    //   inviteLink,
    //   teacherName,
    //   className
    // });

    console.log(`Sending invites to: ${emails.join(', ')}`);
    console.log(`Invite link: ${inviteLink}`);
    console.log(`Class: ${className}`);
    console.log(`Teacher: ${teacherName}`);

    // For demo purposes, we'll just return success
    res.json({
      success: true,
      message: `Invites sent to ${emails.length} email(s)`,
      emailsSent: emails.length
    });
  } catch (error) {
    console.error('Error sending email invites:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get teacher's student groups
export const getTeacherGroups = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { tenantId } = req;

    // Get groups from teacher's metadata or a separate Groups collection
    const teacher = await User.findById(teacherId).select('metadata').lean();
    const groups = teacher?.metadata?.studentGroups || [];

    res.json({
      success: true,
      groups
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create student group
export const createStudentGroup = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const teacherId = req.user._id;

    const newGroup = {
      _id: new Date().getTime().toString(),
      name,
      description,
      color: color || '#8B5CF6',
      students: [],
      createdAt: new Date(),
      createdBy: teacherId
    };

    await User.findByIdAndUpdate(teacherId, {
      $push: {
        'metadata.studentGroups': newGroup
      }
    });

    res.json({
      success: true,
      message: 'Group created successfully',
      group: newGroup
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student's groups
export const updateStudentGroups = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { groups } = req.body;

    await User.findByIdAndUpdate(studentId, {
      $set: { 'metadata.groups': groups }
    });

    res.json({
      success: true,
      message: 'Student groups updated successfully'
    });
  } catch (error) {
    console.error('Error updating student groups:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search students by registration number or phone
export const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    const { tenantId, isLegacyUser } = req;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search by registration number, phone, or email
    const searchQuery = {
      $or: [
        { registrationNumber: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      role: { $in: ['student', 'school_student'] }
    };

    if (!isLegacyUser && tenantId) {
      searchQuery.tenantId = tenantId;
    }

    const students = await User.find(searchQuery)
      .select('name email phone registrationNumber avatar')
      .limit(20)
      .lean();

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign existing students to class
export const assignStudentsToClass = async (req, res) => {
  try {
    const { classId, className, studentIds } = req.body;
    const teacherId = req.user._id;

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: 'No students selected' });
    }

    // Update each student's class information
    await Promise.all(
      studentIds.map(studentId =>
        User.findByIdAndUpdate(studentId, {
          $addToSet: {
            'metadata.classes': {
              classId,
              className,
              teacherId,
              assignedAt: new Date()
            }
          }
        })
      )
    );

    res.json({
      success: true,
      message: `${studentIds.length} student(s) assigned to ${className}`,
      count: studentIds.length
    });
  } catch (error) {
    console.error('Error assigning students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate pre-filled registration link
export const generateRegistrationLink = async (req, res) => {
  try {
    const { classId, className } = req.body;
    const teacherId = req.user._id;
    const { tenantId } = req;

    // Create a unique registration code
    const registrationCode = `REG-${tenantId || 'public'}-${classId}-${Date.now()}`;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const registrationLink = `${baseUrl}/register?code=${registrationCode}&class=${classId}&className=${encodeURIComponent(className)}&teacher=${teacherId}`;

    // Store registration code
    await User.findByIdAndUpdate(teacherId, {
      $push: {
        'metadata.registrationCodes': {
          code: registrationCode,
          classId,
          className,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        }
      }
    });

    res.json({
      success: true,
      registrationLink,
      registrationCode
    });
  } catch (error) {
    console.error('Error generating registration link:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk upload students from CSV
export const bulkUploadStudents = async (req, res) => {
  try {
    const { classId, className } = req.body;
    const teacherId = req.user._id;
    const { tenantId, isLegacyUser } = req;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse CSV file
    const csvData = req.file.buffer.toString('utf8');
    const lines = csvData.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      return res.status(400).json({ message: 'CSV file is empty' });
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['reg_no', 'first_name', 'last_name', 'dob', 'phone', 'email', 'grade', 'section'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        message: `Missing required columns: ${missingHeaders.join(', ')}`
      });
    }

    // Parse rows
    const successResults = [];
    const errorResults = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const student = {};

        headers.forEach((header, index) => {
          student[header] = values[index] || '';
        });

        // Validate required fields
        if (!student.reg_no || !student.first_name || !student.last_name || !student.email || !student.phone) {
          errorResults.push({
            row: i,
            error: 'Missing required fields',
            data: student
          });
          continue;
        }

        // Check if student already exists
        const existingStudent = await User.findOne({
          $or: [
            { registrationNumber: student.reg_no },
            { email: student.email }
          ]
        });

        if (existingStudent) {
          // Assign existing student to class
          await User.findByIdAndUpdate(existingStudent._id, {
            $addToSet: {
              'metadata.classes': {
                classId,
                className,
                teacherId,
                assignedAt: new Date()
              }
            }
          });

          successResults.push({
            row: i,
            action: 'assigned_existing',
            studentId: existingStudent._id,
            name: existingStudent.name
          });
        } else {
          // Create new student
          const newStudent = await User.create({
            name: `${student.first_name} ${student.last_name}`,
            email: student.email,
            phone: student.phone,
            registrationNumber: student.reg_no,
            dateOfBirth: student.dob,
            role: 'school_student',
            tenantId: !isLegacyUser ? tenantId : undefined,
            password: `${student.reg_no}@2024`, // Default password
            metadata: {
              grade: student.grade,
              section: student.section,
              classes: [{
                classId,
                className,
                teacherId,
                assignedAt: new Date()
              }]
            }
          });

          successResults.push({
            row: i,
            action: 'created_new',
            studentId: newStudent._id,
            name: newStudent.name
          });
        }
      } catch (error) {
        errorResults.push({
          row: i,
          error: error.message,
          data: {}
        });
      }
    }

    res.json({
      success: true,
      successCount: successResults.length,
      errorCount: errorResults.length,
      successRows: successResults,
      errors: errorResults,
      message: `Imported ${successResults.length} students successfully`
    });
  } catch (error) {
    console.error('Error bulk uploading students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assignment Wizard Endpoints

// Get assignment templates
export const getAssignmentTemplates = async (req, res) => {
  try {
    const { tenantId } = req;
    
    // Mock templates for now - in production, fetch from database
    const templates = [
      {
        _id: "1",
        title: "Math Quiz - Algebra Basics",
        description: "15 questions covering basic algebra concepts",
        category: "math",
        subject: "Mathematics",
        questionCount: 15,
        duration: 30,
        premium: false
      },
      {
        _id: "2",
        title: "Science Test - Photosynthesis",
        description: "Comprehensive test on photosynthesis",
        category: "science",
        subject: "Biology",
        questionCount: 20,
        duration: 45,
        premium: false
      },
      {
        _id: "3",
        title: "English Grammar Assessment",
        description: "Advanced grammar and composition",
        category: "english",
        subject: "English",
        questionCount: 25,
        duration: 40,
        premium: true
      }
    ];

    res.json({ success: true, templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get question bank
export const getQuestionBank = async (req, res) => {
  try {
    const { tenantId } = req;
    
    // Mock question bank - in production, fetch from database
    const questions = [
      {
        _id: "q1",
        title: "Algebra Fundamentals",
        category: "Algebra",
        questionCount: 30,
        difficulty: "medium"
      },
      {
        _id: "q2",
        title: "Geometry Basics",
        category: "Geometry",
        questionCount: 25,
        difficulty: "easy"
      },
      {
        _id: "q3",
        title: "Cell Biology",
        category: "Biology",
        questionCount: 40,
        difficulty: "medium"
      },
      {
        _id: "q4",
        title: "Grammar Rules",
        category: "English",
        questionCount: 35,
        difficulty: "hard"
      }
    ];

    res.json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching question bank:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Inavora catalog
export const getInavoraCatalog = async (req, res) => {
  try {
    // Mock Inavora modules - in production, fetch from Inavora API
    const modules = [
      {
        _id: "inv1",
        title: "Financial Literacy - Budgeting",
        provider: "Inavora",
        duration: 20,
        module_id: "FL-001",
        previewUrl: "https://inavora.com/preview/FL-001"
      },
      {
        _id: "inv2",
        title: "Brain Health - Memory Techniques",
        provider: "Inavora",
        duration: 25,
        module_id: "BH-002",
        previewUrl: "https://inavora.com/preview/BH-002"
      },
      {
        _id: "inv3",
        title: "Digital Citizenship - Online Safety",
        provider: "Inavora",
        duration: 30,
        module_id: "DC-003",
        previewUrl: "https://inavora.com/preview/DC-003"
      }
    ];

    res.json({ success: true, modules });
  } catch (error) {
    console.error("Error fetching Inavora catalog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get available badges
export const getAvailableBadges = async (req, res) => {
  try {
    const badges = [
      { _id: "b1", name: "Quick Learner", description: "Complete assignment under time" },
      { _id: "b2", name: "Perfect Score", description: "Get 100% on assignment" },
      { _id: "b3", name: "Persistence", description: "Complete all attempts" },
      { _id: "b4", name: "Early Bird", description: "Submit before half time" },
      { _id: "b5", name: "Team Player", description: "Help others learn" },
      { _id: "b6", name: "Champion", description: "Top 3 in class" }
    ];

    res.json({ success: true, badges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get students for assignment
export const getStudentsForAssignment = async (req, res) => {
  try {
    const { classIds, scopeType } = req.body;
    const { tenantId, isLegacyUser } = req;

    let query = { role: { $in: ['student', 'school_student'] } };
    
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
    }

    // If specific classes, filter by class
    if (scopeType === "single_class" || scopeType === "multiple_classes") {
      query['metadata.classes.classId'] = { $in: classIds };
    }

    const students = await User.find(query)
      .select('name email avatar')
      .lean();

    res.json({ success: true, students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// AI suggest students based on weak pillars
export const aiSuggestStudents = async (req, res) => {
  try {
    const { classIds } = req.body;
    const { tenantId, isLegacyUser } = req;

    // Get students in classes
    let query = {
      role: { $in: ['student', 'school_student'] },
      'metadata.classes.classId': { $in: classIds }
    };
    
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
    }

    const students = await User.find(query).select('name').lean();

    // Fetch game progress for each student to identify weak pillars
    const suggestions = await Promise.all(
      students.map(async (student) => {
        const gameProgress = await UnifiedGameProgress.find({ userId: student._id }).lean();
        
        // Calculate performance per pillar
        const pillars = {};
        const pillarNames = ['Financial Literacy', 'Brain Health', 'UVLS', 'Digital Citizenship', 'Moral Values', 'AI for All'];
        
        pillarNames.forEach(pillar => {
          const pillarGames = gameProgress.filter(g => g.category === pillar);
          if (pillarGames.length > 0) {
            const avgProgress = pillarGames.reduce((sum, g) => sum + (g.progress || 0), 0) / pillarGames.length;
            pillars[pillar] = avgProgress;
          }
        });

        // Find weak pillars (< 50% progress)
        const weakPillars = Object.entries(pillars)
          .filter(([_, progress]) => progress < 50)
          .map(([pillar, _]) => pillar);

        // Only suggest if student has weak pillars
        if (weakPillars.length > 0) {
          return {
            studentId: student._id,
            studentName: student.name,
            weakPillars,
            confidence: Math.round(70 + Math.random() * 25) // 70-95% confidence
          };
        }
        return null;
      })
    );

    const filteredSuggestions = suggestions.filter(s => s !== null);

    res.json({
      success: true,
      suggestions: filteredSuggestions
    });
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create advanced assignment
export const createAdvancedAssignment = async (req, res) => {
  try {
    const { scope, template, modules, rules, participants, rewards, status } = req.body;
    const teacherId = req.user._id;
    const { tenantId, isLegacyUser } = req;

    // Validate required fields
    if (!scope || !template || !modules || !rules) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: scope, template, modules, and rules are required" 
      });
    }

    // Get orgId if available
    let orgId = req.user.orgId || null;
    if (!orgId && tenantId) {
      const org = await Organization.findOne({ tenantId });
      if (org) {
        orgId = org._id;
      }
    }

    // Create assignment document
    const assignmentData = {
      title: template.title,
      description: template.description,
      subject: template.subject,
      teacherId,
      tenantId: tenantId || 'default-tenant',
      className: typeof scope.classes[0] === 'object' ? scope.classes[0].name : (scope.classes[0] || 'General'),
      
      // Scope
      scope: scope.type,
      scopeClasses: scope.classes,
      approvalRequired: scope.approvalRequired,
      
      // Template
      templateType: template.type,
      templateId: template.selectedTemplate?._id,
      
      // Modules
      modules: modules.items.map(item => ({
        type: item.type,
        id: item._id || item.id,
        title: item.title,
        module_id: item._id || item.id,
        questionCount: item.questionCount,
        duration: item.duration
      })),
      
      // Rules
      startTime: new Date(rules.startTime),
      endTime: new Date(rules.endTime),
      dueDate: new Date(rules.endTime),
      assignedDate: new Date(),
      maxAttempts: rules.maxAttempts,
      randomizeQuestions: rules.randomizeQuestions,
      gradingType: rules.gradingType,
      accessibility: rules.accessibility,
      
      // Participants
      participantMode: participants.mode,
      selectedStudents: participants.selectedStudents,
      filterTags: participants.filterTags,
      aiSuggestions: participants.aiSuggestions,
      
      // Rewards
      healCoinsReward: rewards.healCoins * rewards.bonusMultiplier,
      badges: rewards.badges,
      certificate: rewards.certificate,
      
      // Status
      status: scope.approvalRequired ? 'pending_approval' : (status || 'published'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (orgId) {
      assignmentData.orgId = orgId;
    }

    const assignment = await Assignment.create(assignmentData);

    // If requires approval, create approval task
    if (scope.approvalRequired) {
      // Create approval notification for admin
      await Notification.create({
        userId: orgId, // Send to org admin
        type: 'approval_request',
        title: 'Assignment Approval Required',
        message: `Teacher ${req.user.name} has submitted "${template.title}" for approval`,
        metadata: {
          assignmentId: assignment._id,
          teacherId,
          scope: scope.type
        }
      });
    }

    res.json({
      success: true,
      message: scope.approvalRequired ? 'Assignment submitted for approval' : 'Assignment published successfully',
      assignment
    });
  } catch (error) {
    console.error("Error creating advanced assignment:", error);
    console.error("Request body:", JSON.stringify(req.body, null, 2));
    
    // Return more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: "Validation failed", 
        errors: validationErrors,
        details: error.errors
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// ============= NEW SCHOOL ADMIN ANALYTICS ENDPOINTS =============

// 1. Active students vs enrolled (adoption %)
export const getStudentAdoption = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, section } = req.query;

    // Build query filter
    const filter = { tenantId, isActive: true };
    if (classId) filter.classId = classId;
    if (section) filter.section = section;

    const totalEnrolled = await SchoolStudent.countDocuments(filter);
    
    // Active students are those who have logged in within the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all student user IDs
    const students = await SchoolStudent.find(filter).select('userId');
    const studentUserIds = students.map(s => s.userId);

    // Count active users
    const activeStudents = await User.countDocuments({
      _id: { $in: studentUserIds },
      lastActive: { $gte: thirtyDaysAgo }
    });

    const adoptionRate = totalEnrolled > 0 
      ? ((activeStudents / totalEnrolled) * 100).toFixed(2) 
      : 0;

    res.json({
      totalEnrolled,
      activeStudents,
      inactiveStudents: totalEnrolled - activeStudents,
      adoptionRate: parseFloat(adoptionRate)
    });
  } catch (error) {
    console.error('Error fetching student adoption:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Average pillar mastery school-wide (with grade filters)
export const getSchoolPillarMastery = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, section } = req.query;

    // Build query filter
    const filter = { tenantId, isActive: true };
    if (classId) filter.classId = classId;
    if (section) filter.section = section;

    const students = await SchoolStudent.find(filter).select('pillars classId section');

    if (students.length === 0) {
      return res.json({
        averages: {
          uvls: 0,
          dcos: 0,
          moral: 0,
          ehe: 0,
          crgc: 0,
          overall: 0
        },
        totalStudents: 0,
        byClass: []
      });
    }

    // Calculate averages
    const totals = {
      uvls: 0,
      dcos: 0,
      moral: 0,
      ehe: 0,
      crgc: 0
    };

    const classTotals = {};

    students.forEach(student => {
      if (student.pillars) {
        totals.uvls += student.pillars.uvls || 0;
        totals.dcos += student.pillars.dcos || 0;
        totals.moral += student.pillars.moral || 0;
        totals.ehe += student.pillars.ehe || 0;
        totals.crgc += student.pillars.crgc || 0;

        // Track by class
        const classKey = `${student.classId}-${student.section}`;
        if (!classTotals[classKey]) {
          classTotals[classKey] = {
            classId: student.classId,
            section: student.section,
            count: 0,
            uvls: 0,
            dcos: 0,
            moral: 0,
            ehe: 0,
            crgc: 0
          };
        }
        classTotals[classKey].count++;
        classTotals[classKey].uvls += student.pillars.uvls || 0;
        classTotals[classKey].dcos += student.pillars.dcos || 0;
        classTotals[classKey].moral += student.pillars.moral || 0;
        classTotals[classKey].ehe += student.pillars.ehe || 0;
        classTotals[classKey].crgc += student.pillars.crgc || 0;
      }
    });

    const count = students.length;
    const averages = {
      uvls: parseFloat((totals.uvls / count).toFixed(2)),
      dcos: parseFloat((totals.dcos / count).toFixed(2)),
      moral: parseFloat((totals.moral / count).toFixed(2)),
      ehe: parseFloat((totals.ehe / count).toFixed(2)),
      crgc: parseFloat((totals.crgc / count).toFixed(2))
    };
    
    averages.overall = parseFloat(
      ((averages.uvls + averages.dcos + averages.moral + averages.ehe + averages.crgc) / 5).toFixed(2)
    );

    // Calculate class averages
    const byClass = Object.values(classTotals).map(cls => ({
      classId: cls.classId,
      section: cls.section,
      studentCount: cls.count,
      averages: {
        uvls: parseFloat((cls.uvls / cls.count).toFixed(2)),
        dcos: parseFloat((cls.dcos / cls.count).toFixed(2)),
        moral: parseFloat((cls.moral / cls.count).toFixed(2)),
        ehe: parseFloat((cls.ehe / cls.count).toFixed(2)),
        crgc: parseFloat((cls.crgc / cls.count).toFixed(2))
      }
    }));

    res.json({
      averages,
      totalStudents: count,
      byClass
    });
  } catch (error) {
    console.error('Error fetching pillar mastery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Number of flagged wellbeing cases (open vs resolved)
export const getWellbeingCases = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, section, severity } = req.query;

    // Build query filter
    const filter = { tenantId, isActive: true };
    if (classId) filter.classId = classId;
    if (section) filter.section = section;

    const students = await SchoolStudent.find(filter)
      .select('wellbeingFlags userId classId section')
      .populate('userId', 'name email');

    let allFlags = [];
    students.forEach(student => {
      if (student.wellbeingFlags && student.wellbeingFlags.length > 0) {
        student.wellbeingFlags.forEach(flag => {
          allFlags.push({
            studentId: student._id,
            studentName: student.userId?.name,
            studentEmail: student.userId?.email,
            classId: student.classId,
            section: student.section,
            ...flag.toObject()
          });
        });
      }
    });

    // Filter by severity if provided
    if (severity) {
      allFlags = allFlags.filter(flag => flag.severity === severity);
    }

    const openCases = allFlags.filter(flag => flag.status === 'open');
    const inProgressCases = allFlags.filter(flag => flag.status === 'in_progress');
    const resolvedCases = allFlags.filter(flag => flag.status === 'resolved');

    // Count by type
    const byType = {};
    allFlags.forEach(flag => {
      if (!byType[flag.type]) {
        byType[flag.type] = { open: 0, in_progress: 0, resolved: 0, total: 0 };
      }
      byType[flag.type][flag.status]++;
      byType[flag.type].total++;
    });

    // Count by severity
    const bySeverity = {
      low: allFlags.filter(f => f.severity === 'low').length,
      medium: allFlags.filter(f => f.severity === 'medium').length,
      high: allFlags.filter(f => f.severity === 'high').length
    };

    res.json({
      total: allFlags.length,
      open: openCases.length,
      inProgress: inProgressCases.length,
      resolved: resolvedCases.length,
      byType,
      bySeverity,
      recentCases: allFlags
        .sort((a, b) => new Date(b.flaggedAt) - new Date(a.flaggedAt))
        .slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching wellbeing cases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Teacher adoption (DAU/MAU) & pending training completions
export const getTeacherAdoption = async (req, res) => {
  try {
    const { tenantId } = req;

    const totalTeachers = await User.countDocuments({ 
      tenantId, 
      role: 'school_teacher' 
    });

    // Daily Active Users (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const dau = await User.countDocuments({
      tenantId,
      role: 'school_teacher',
      lastActive: { $gte: oneDayAgo }
    });

    // Monthly Active Users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const mau = await User.countDocuments({
      tenantId,
      role: 'school_teacher',
      lastActive: { $gte: thirtyDaysAgo }
    });

    // Get training completions
    const teachers = await User.find({
      tenantId,
      role: 'school_teacher'
    }).select('trainingModules name email');

    let totalModules = 0;
    let completedModules = 0;
    let pendingModules = 0;
    let inProgressModules = 0;

    const teacherTrainingStatus = teachers.map(teacher => {
      const modules = teacher.trainingModules || [];
      const completed = modules.filter(m => m.status === 'completed').length;
      const pending = modules.filter(m => m.status === 'not_started').length;
      const inProgress = modules.filter(m => m.status === 'in_progress').length;

      totalModules += modules.length;
      completedModules += completed;
      pendingModules += pending;
      inProgressModules += inProgress;

      return {
        teacherId: teacher._id,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        totalModules: modules.length,
        completedModules: completed,
        pendingModules: pending,
        inProgressModules: inProgress,
        completionRate: modules.length > 0 
          ? parseFloat(((completed / modules.length) * 100).toFixed(2))
          : 0
      };
    });

    const dauRate = totalTeachers > 0 
      ? parseFloat(((dau / totalTeachers) * 100).toFixed(2)) 
      : 0;
    
    const mauRate = totalTeachers > 0 
      ? parseFloat(((mau / totalTeachers) * 100).toFixed(2)) 
      : 0;

    const overallTrainingCompletion = totalModules > 0
      ? parseFloat(((completedModules / totalModules) * 100).toFixed(2))
      : 0;

    res.json({
      totalTeachers,
      dau,
      dauRate,
      mau,
      mauRate,
      training: {
        totalModules,
        completedModules,
        pendingModules,
        inProgressModules,
        completionRate: overallTrainingCompletion
      },
      teacherTrainingStatus: teacherTrainingStatus.sort((a, b) => a.completionRate - b.completionRate)
    });
  } catch (error) {
    console.error('Error fetching teacher adoption:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. NEP alignment index (percent of competencies covered)
export const getNEPAlignment = async (req, res) => {
  try {
    const { tenantId } = req;

    // NEP 2020 defines 5 core pillars we're tracking
    const nepPillars = ['uvls', 'dcos', 'moral', 'ehe', 'crgc'];
    
    // Get average pillar mastery across all students
    const students = await SchoolStudent.find({ tenantId, isActive: true })
      .select('pillars');

    if (students.length === 0) {
      return res.json({
        alignmentIndex: 0,
        pillarsAboveThreshold: 0,
        totalPillars: 5,
        pillarsMastery: {},
        nepComplianceLevel: 'Not Started'
      });
    }

    const pillarTotals = {
      uvls: 0,
      dcos: 0,
      moral: 0,
      ehe: 0,
      crgc: 0
    };

    students.forEach(student => {
      if (student.pillars) {
        pillarTotals.uvls += student.pillars.uvls || 0;
        pillarTotals.dcos += student.pillars.dcos || 0;
        pillarTotals.moral += student.pillars.moral || 0;
        pillarTotals.ehe += student.pillars.ehe || 0;
        pillarTotals.crgc += student.pillars.crgc || 0;
      }
    });

    const count = students.length;
    const pillarsMastery = {
      uvls: parseFloat((pillarTotals.uvls / count).toFixed(2)),
      dcos: parseFloat((pillarTotals.dcos / count).toFixed(2)),
      moral: parseFloat((pillarTotals.moral / count).toFixed(2)),
      ehe: parseFloat((pillarTotals.ehe / count).toFixed(2)),
      crgc: parseFloat((pillarTotals.crgc / count).toFixed(2))
    };

    // NEP considers a competency "covered" if average mastery is above 60%
    const threshold = 60;
    const pillarsAboveThreshold = Object.values(pillarsMastery).filter(
      value => value >= threshold
    ).length;

    // Calculate overall alignment index (0-100)
    const alignmentIndex = parseFloat(
      ((pillarsAboveThreshold / nepPillars.length) * 100).toFixed(2)
    );

    // Determine compliance level
    let nepComplianceLevel = 'Not Started';
    if (alignmentIndex >= 80) nepComplianceLevel = 'Excellent';
    else if (alignmentIndex >= 60) nepComplianceLevel = 'Good';
    else if (alignmentIndex >= 40) nepComplianceLevel = 'Developing';
    else if (alignmentIndex > 0) nepComplianceLevel = 'Beginning';

    res.json({
      alignmentIndex,
      pillarsAboveThreshold,
      totalPillars: nepPillars.length,
      pillarsMastery,
      nepComplianceLevel,
      recommendations: generateNEPRecommendations(pillarsMastery)
    });
  } catch (error) {
    console.error('Error fetching NEP alignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to generate NEP recommendations
const generateNEPRecommendations = (pillarsMastery) => {
  const recommendations = [];
  const pillarNames = {
    uvls: 'Understanding Values & Life Skills',
    dcos: 'Digital Citizenship & Online Safety',
    moral: 'Moral & Spiritual Education',
    ehe: 'Environmental & Health Education',
    crgc: 'Cultural Roots & Global Citizenship'
  };

  Object.entries(pillarsMastery).forEach(([pillar, mastery]) => {
    if (mastery < 60) {
      recommendations.push({
        pillar: pillarNames[pillar],
        currentMastery: mastery,
        priority: mastery < 40 ? 'high' : 'medium',
        suggestion: `Increase focus on ${pillarNames[pillar]} activities and assessments`
      });
    }
  });

  return recommendations.sort((a, b) => a.currentMastery - b.currentMastery);
};

// ============= NEW COMPREHENSIVE SCHOOL ADMIN ENDPOINTS =============

// 1. Get organization campuses
export const getOrganizationCampuses = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    if (!orgId) {
      return res.json({ campuses: [], mainCampus: null });
    }

    const organization = await Organization.findOne({ _id: orgId, tenantId })
      .populate('campuses.principal', 'name email');

    if (!organization) {
      return res.json({ campuses: [], mainCampus: null });
    }

    res.json({
      campuses: organization.campuses || [],
      mainCampus: organization.campuses?.find(c => c.isMain),
    });
  } catch (error) {
    console.error('Error fetching campuses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Add new campus
export const addCampus = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, code, location, contactInfo, principalId } = req.body;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    const organization = await Organization.findOne({ _id: orgId, tenantId });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const campusId = `CAMPUS_${Date.now()}`;
    const newCampus = {
      campusId,
      name,
      code,
      location,
      contactInfo,
      principal: principalId,
      isMain: !organization.campuses || organization.campuses.length === 0,
      isActive: true,
      studentCount: 0,
      teacherCount: 0,
    };

    if (!organization.campuses) {
      organization.campuses = [];
    }
    organization.campuses.push(newCampus);
    await organization.save();

    res.json({
      success: true,
      message: 'Campus added successfully',
      campus: newCampus,
    });
  } catch (error) {
    console.error('Error adding campus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get comprehensive KPIs
export const getComprehensiveKPIs = async (req, res) => {
  try {
    const { tenantId } = req;
    const { campusId } = req.query;

    const filter = { tenantId, isActive: true };
    if (campusId) filter.campusId = campusId;

    // Get all key metrics in parallel
    const [
      totalStudents,
      activeStudents30d,
      totalTeachers,
      activeTeachers30d,
      totalClasses,
      avgAttendance,
      pendingAssignments,
      wellbeingFlags,
      avgPillarMastery,
    ] = await Promise.all([
      SchoolStudent.countDocuments(filter),
      SchoolStudent.find(filter).populate({
        path: 'userId',
        match: { lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }).then(students => students.filter(s => s.userId).length),
      User.countDocuments({ tenantId, role: 'school_teacher', ...(campusId && { campusId }) }),
      User.countDocuments({
        tenantId,
        role: 'school_teacher',
        lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        ...(campusId && { campusId }),
      }),
      SchoolClass.countDocuments({ tenantId }),
      SchoolStudent.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: '$attendance.percentage' } } },
      ]),
      Assignment.countDocuments({
        tenantId,
        status: { $in: ['pending_approval', 'pending'] },
      }),
      SchoolStudent.aggregate([
        { $match: filter },
        { $unwind: '$wellbeingFlags' },
        { $match: { 'wellbeingFlags.status': { $in: ['open', 'in_progress'] } } },
        { $count: 'total' },
      ]),
      SchoolStudent.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            avgUvls: { $avg: '$pillars.uvls' },
            avgDcos: { $avg: '$pillars.dcos' },
            avgMoral: { $avg: '$pillars.moral' },
            avgEhe: { $avg: '$pillars.ehe' },
            avgCrgc: { $avg: '$pillars.crgc' },
          },
        },
      ]),
    ]);

    const studentAdoptionRate = totalStudents > 0
      ? ((activeStudents30d / totalStudents) * 100).toFixed(2)
      : 0;

    const teacherAdoptionRate = totalTeachers > 0
      ? ((activeTeachers30d / totalTeachers) * 100).toFixed(2)
      : 0;

    const avgPillar = avgPillarMastery[0] || {};
    const overallPillarMastery = avgPillar._id
      ? ((avgPillar.avgUvls + avgPillar.avgDcos + avgPillar.avgMoral + avgPillar.avgEhe + avgPillar.avgCrgc) / 5).toFixed(2)
      : 0;

    res.json({
      students: {
        total: totalStudents,
        active: activeStudents30d,
        adoptionRate: parseFloat(studentAdoptionRate),
      },
      teachers: {
        total: totalTeachers,
        active: activeTeachers30d,
        adoptionRate: parseFloat(teacherAdoptionRate),
      },
      classes: {
        total: totalClasses,
      },
      attendance: {
        average: avgAttendance[0]?.avg ? avgAttendance[0].avg.toFixed(2) : 0,
      },
      pendingApprovals: pendingAssignments,
      wellbeingCases: wellbeingFlags[0]?.total || 0,
      pillarMastery: {
        overall: parseFloat(overallPillarMastery),
        breakdown: {
          uvls: avgPillar.avgUvls || 0,
          dcos: avgPillar.avgDcos || 0,
          moral: avgPillar.avgMoral || 0,
          ehe: avgPillar.avgEhe || 0,
          crgc: avgPillar.avgCrgc || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching comprehensive KPIs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get heatmap data (adoption & pillar coverage by grade & campus)
export const getHeatmapData = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    // If no organization, return default campus
    let campuses = [{ campusId: 'default', name: 'Main Campus', isMain: true, isActive: true }];
    
    if (orgId) {
      const organization = await Organization.findOne({ _id: orgId, tenantId });
      if (organization && organization.campuses && organization.campuses.length > 0) {
        campuses = organization.campuses;
      }
    }

    const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Get all classes for grade mapping
    const classes = await SchoolClass.find({ tenantId }).select('classNumber');
    const classMap = {};
    classes.forEach(cls => {
      classMap[cls._id.toString()] = cls.classNumber;
    });

    // Build heatmap data
    const heatmapData = {
      adoption: [],
      pillars: [],
    };

    for (const campus of campuses) {
      for (const grade of grades) {
        // Find students by matching class numbers to grades
        const classIds = Object.keys(classMap).filter(id => classMap[id] === grade);

        const students = await SchoolStudent.find({
          tenantId,
          campusId: campus.campusId,
          classId: { $in: classIds.map(id => id) },
          isActive: true,
        }).populate('userId');

        const totalStudents = students.length;
        const activeStudents = students.filter(
          s => s.userId && s.userId.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        const adoptionRate = totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0;

        // Calculate average pillar mastery
        let pillarSum = 0;
        let pillarCount = 0;

        students.forEach(student => {
          if (student.pillars) {
            pillarSum += (student.pillars.uvls || 0) +
                        (student.pillars.dcos || 0) +
                        (student.pillars.moral || 0) +
                        (student.pillars.ehe || 0) +
                        (student.pillars.crgc || 0);
            pillarCount += 5;
          }
        });

        const avgPillarMastery = pillarCount > 0 ? pillarSum / pillarCount : 0;

        heatmapData.adoption.push({
          campus: campus.name,
          campusId: campus.campusId,
          grade: `Grade ${grade}`,
          gradeNumber: grade,
          value: parseFloat(adoptionRate.toFixed(2)),
          total: totalStudents,
          active: activeStudents,
        });

        heatmapData.pillars.push({
          campus: campus.name,
          campusId: campus.campusId,
          grade: `Grade ${grade}`,
          gradeNumber: grade,
          value: parseFloat(avgPillarMastery.toFixed(2)),
          studentCount: totalStudents,
        });
      }
    }

    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Get pending approvals queue
export const getPendingApprovals = async (req, res) => {
  try {
    const { tenantId } = req;
    const { type, limit = 20, page = 1 } = req.query;

    const filter = {
      tenantId,
      status: 'pending_approval',
    };

    if (type) {
      filter.scope = type;
    }

    const [assignments, total] = await Promise.all([
      Assignment.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('teacherId', 'name email')
        .populate('classId', 'classNumber stream'),
      Assignment.countDocuments(filter),
    ]);

    // Get templates pending approval
    const templatesFilter = {
      approvalStatus: 'pending',
    };
    if (!type || type === 'template') {
      templatesFilter.tenantId = tenantId;
    }

    const pendingTemplates = await Template.find(templatesFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name email');

    res.json({
      assignments: assignments.map(a => ({
        id: a._id,
        type: 'assignment',
        title: a.title,
        description: a.description,
        scope: a.scope,
        teacher: a.teacherId,
        class: a.classId,
        createdAt: a.createdAt,
        priority: a.priority || 'medium',
        requiresApproval: a.approvalRequired,
      })),
      templates: pendingTemplates.map(t => ({
        id: t._id,
        type: 'template',
        title: t.title,
        description: t.description,
        category: t.category,
        creator: t.createdBy,
        createdAt: t.createdAt,
        isPremium: t.isPremium,
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Approve/Reject assignment or template
export const approveOrRejectItem = async (req, res) => {
  try {
    const { itemId, type, action, reason } = req.body;
    const userId = req.user?._id;

    let result;

    if (type === 'assignment') {
      const assignment = await Assignment.findById(itemId);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      if (action === 'approve') {
        assignment.status = 'approved';
        assignment.approvedBy = userId;
        assignment.approvedAt = new Date();
      } else {
        assignment.status = 'rejected';
        assignment.rejectionReason = reason;
      }

      await assignment.save();
      result = assignment;
    } else if (type === 'template') {
      const template = await Template.findById(itemId);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      if (action === 'approve') {
        template.approvalStatus = 'approved';
        template.approvedBy = userId;
      } else {
        template.approvalStatus = 'rejected';
      }

      await template.save();
      result = template;
    }

    res.json({
      success: true,
      message: `${type} ${action}d successfully`,
      item: result,
    });
  } catch (error) {
    console.error('Error approving/rejecting item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Get all staff (teachers, admin, etc.)
export const getAllStaff = async (req, res) => {
  try {
    const { tenantId } = req;
    const { campusId, role, search, page = 1, limit = 20 } = req.query;

    const filter = {
      tenantId,
      role: { $in: ['school_teacher', 'school_admin', 'school_accountant', 'school_librarian'] },
    };

    if (campusId) filter.campusId = campusId;
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [staff, total] = await Promise.all([
      User.find(filter)
        .select('name email role campusId subjects position lastActive trainingModules createdAt')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      staff: staff.map(s => ({
        id: s._id,
        name: s.name,
        email: s.email,
        role: s.role,
        campusId: s.campusId,
        subjects: s.subjects,
        position: s.position,
        lastActive: s.lastActive,
        trainingProgress: s.trainingModules
          ? (s.trainingModules.filter(m => m.status === 'completed').length / s.trainingModules.length) * 100
          : 0,
        createdAt: s.createdAt,
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Assign teacher to class
export const assignTeacherToClass = async (req, res) => {
  try {
    const { teacherId, classId, section, isClassTeacher } = req.body;
    const { tenantId } = req;

    const teacher = await User.findOne({ _id: teacherId, tenantId, role: 'school_teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const schoolClass = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!schoolClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find or create section
    let targetSection = schoolClass.sections.find(s => s.sectionName === section);
    if (!targetSection) {
      schoolClass.sections.push({
        sectionName: section,
        classTeacher: isClassTeacher ? teacherId : null,
        subjects: [],
        currentStrength: 0,
        maxStrength: 40,
      });
      targetSection = schoolClass.sections[schoolClass.sections.length - 1];
    } else if (isClassTeacher) {
      targetSection.classTeacher = teacherId;
    }

    await schoolClass.save();

    res.json({
      success: true,
      message: 'Teacher assigned successfully',
      class: schoolClass,
    });
  } catch (error) {
    console.error('Error assigning teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 9. Get templates
export const getTemplates = async (req, res) => {
  try {
    const { tenantId } = req;
    const { category, type, search, page = 1, limit = 20 } = req.query;

    const filter = {
      $or: [
        { tenantId },
        { isGlobal: true },
      ],
      isActive: true,
      approvalStatus: 'approved',
    };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [templates, total] = await Promise.all([
      Template.find(filter)
        .select('-questions') // Don't send full questions in list
        .sort({ usageCount: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('createdBy', 'name'),
      Template.countDocuments(filter),
    ]);

    res.json({
      templates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 10. Create template
export const createTemplate = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const userId = req.user?._id;
    const templateData = req.body;

    const template = await Template.create({
      ...templateData,
      tenantId,
      orgId,
      createdBy: userId,
      approvalStatus: templateData.isPublic ? 'pending' : 'approved',
    });

    res.json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get template by ID
export const getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;

    const template = await Template.findOne({ _id: templateId })
      .populate('createdBy', 'name email');

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve template
export const approveTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const userId = req.user?._id;

    const template = await Template.findOne({ _id: templateId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.approvalStatus = 'approved';
    template.approvedBy = userId;
    await template.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: template.orgId,
      userId,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'template_approved',
      targetType: 'template',
      targetId: template._id,
      targetName: template.title,
      description: `Template "${template.title}" approved`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Notify creator
    if (template.createdBy) {
      await Notification.create({
        userId: template.createdBy,
        type: 'template_approved',
        title: 'Template Approved',
        message: `Your template "${template.title}" has been approved and is now available.`,
        metadata: {
          templateId: template._id,
          approvedBy: userId,
        },
      });
    }

    res.json({
      success: true,
      message: 'Template approved successfully',
      template,
    });
  } catch (error) {
    console.error('Error approving template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject template
export const rejectTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const { reason } = req.body;
    const userId = req.user?._id;

    const template = await Template.findOne({ _id: templateId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.approvalStatus = 'rejected';
    template.rejectionReason = reason || 'Template does not meet requirements';
    await template.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: template.orgId,
      userId,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'template_rejected',
      targetType: 'template',
      targetId: template._id,
      targetName: template.title,
      description: `Template "${template.title}" rejected: ${reason}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Notify creator
    if (template.createdBy) {
      await Notification.create({
        userId: template.createdBy,
        type: 'template_rejected',
        title: 'Template Rejected',
        message: `Your template "${template.title}" was not approved. Reason: ${reason}`,
        metadata: {
          templateId: template._id,
          reason,
        },
      });
    }

    res.json({
      success: true,
      message: 'Template rejected',
      template,
    });
  } catch (error) {
    console.error('Error rejecting template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 11. Update template
export const updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const updates = req.body;

    const template = await Template.findOne({ _id: templateId, tenantId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    Object.assign(template, updates);
    await template.save();

    res.json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 12. Delete template
export const deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;

    const template = await Template.findOne({ _id: templateId, tenantId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.isActive = false;
    await template.save();

    res.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export templates with NEP competency data
export const exportTemplates = async (req, res) => {
  try {
    const { tenantId } = req;
    const { format = 'csv', category, includeNEP = 'true' } = req.query;

    const filter = {
      $or: [
        { tenantId },
        { isGlobal: true },
      ],
      isActive: true,
      approvalStatus: 'approved',
    };

    if (category) filter.category = category;

    // Get all templates with NEP competencies
    const templates = await Template.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    if (format === 'json') {
      // Return JSON format
      const exportData = templates.map(template => ({
        id: template._id,
        title: template.title,
        description: template.description,
        category: template.category,
        subject: template.subject,
        gradeLevel: template.gradeLevel,
        type: template.type,
        isPremium: template.isPremium,
        price: template.price,
        duration: template.duration,
        totalMarks: template.totalMarks,
        tags: template.tags,
        nepCompetencies: template.metadata?.nepLinks || [],
        pillarAlignment: template.metadata?.pillarAlignment || [],
        visibility: template.isPublic ? 'public' : 'school-only',
        usageCount: template.usageCount,
        createdBy: template.createdBy?.name || 'Unknown',
        createdAt: template.createdAt,
      }));

      res.json({
        success: true,
        templates: exportData,
        count: exportData.length,
      });
    } else {
      // Generate CSV
      const csvHeaders = 'ID,Title,Description,Category,Subject,Grade Levels,Type,Is Premium,Price,Duration (min),Total Marks,Tags,NEP Competencies,Pillar Alignment,Visibility,Usage Count,Created By,Created At\n';
      
      const csvRows = templates.map(template => {
        const nepLinks = template.metadata?.nepLinks || [];
        const pillarAlignment = template.metadata?.pillarAlignment || [];
        
        return [
          template._id,
          `"${template.title.replace(/"/g, '""')}"`,
          `"${(template.description || '').replace(/"/g, '""')}"`,
          template.category,
          template.subject || '',
          `"${(template.gradeLevel || []).join(', ')}"`,
          template.type || '',
          template.isPremium ? 'Yes' : 'No',
          template.price || 0,
          template.duration || 0,
          template.totalMarks || 0,
          `"${(template.tags || []).join(', ')}"`,
          `"${nepLinks.join(', ')}"`,
          `"${pillarAlignment.join(', ')}"`,
          template.isPublic ? 'Public' : 'School-only',
          template.usageCount || 0,
          template.createdBy?.name || 'Unknown',
          template.createdAt.toISOString(),
        ].join(',');
      }).join('\n');

      const csv = csvHeaders + csvRows;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=templates-export-${Date.now()}.csv`);
      res.send(csv);
    }
  } catch (error) {
    console.error('Error exporting templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 13. Get subscription details
export const getSubscriptionDetails = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    let subscription = await Subscription.findOne({ tenantId, orgId });

    // Create default subscription if not exists
    if (!subscription) {
      subscription = await Subscription.create({
        tenantId,
        orgId,
        plan: {
          name: 'free',
          displayName: 'Free Plan',
          price: 0,
          billingCycle: 'monthly',
        },
        limits: {
          maxStudents: 100,
          maxTeachers: 10,
          maxClasses: 10,
          maxCampuses: 1,
          maxStorage: 5,
          maxTemplates: 50,
          features: {
            advancedAnalytics: false,
            aiAssistant: false,
            customBranding: false,
            apiAccess: false,
            prioritySupport: false,
            whiteLabel: false,
          },
        },
        status: 'trial',
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
    }

    // Update current usage
    const [students, teachers, classes, templates, organization] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      SchoolClass.countDocuments({ tenantId }),
      Template.countDocuments({ tenantId }),
      Organization.findOne({ _id: orgId, tenantId }),
    ]);

    const campuses = organization?.campuses?.length || 1;

    subscription.usage = {
      students,
      teachers,
      classes,
      campuses,
      storage: 0, // TODO: Calculate actual storage
      templates,
    };
    await subscription.save();

    res.json({
      subscription,
      daysUntilExpiry: subscription.daysUntilExpiry(),
      usagePercentages: {
        students: (students / subscription.limits.maxStudents * 100).toFixed(2),
        teachers: (teachers / subscription.limits.maxTeachers * 100).toFixed(2),
        classes: (classes / subscription.limits.maxClasses * 100).toFixed(2),
        campuses: (campuses / subscription.limits.maxCampuses * 100).toFixed(2),
        templates: (templates / subscription.limits.maxTemplates * 100).toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 14. Upgrade subscription
export const upgradeSubscription = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { plan, billingCycle } = req.body;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    const subscription = await Subscription.findOne({ tenantId, orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Define plan limits
    const planLimits = {
      free: {
        maxStudents: 100,
        maxTeachers: 10,
        maxClasses: 10,
        maxCampuses: 1,
        maxStorage: 5,
        maxTemplates: 50,
        price: 0,
      },
      basic: {
        maxStudents: 500,
        maxTeachers: 50,
        maxClasses: 50,
        maxCampuses: 2,
        maxStorage: 50,
        maxTemplates: 200,
        price: 4999,
      },
      standard: {
        maxStudents: 2000,
        maxTeachers: 200,
        maxClasses: 200,
        maxCampuses: 5,
        maxStorage: 200,
        maxTemplates: 500,
        price: 14999,
      },
      premium: {
        maxStudents: 10000,
        maxTeachers: 1000,
        maxClasses: 1000,
        maxCampuses: 20,
        maxStorage: 1000,
        maxTemplates: 2000,
        price: 49999,
      },
      enterprise: {
        maxStudents: -1, // Unlimited
        maxTeachers: -1,
        maxClasses: -1,
        maxCampuses: -1,
        maxStorage: -1,
        maxTemplates: -1,
        price: 0, // Custom pricing
      },
    };

    const limits = planLimits[plan];
    if (!limits) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    subscription.plan.name = plan;
    subscription.plan.displayName = plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
    subscription.plan.price = limits.price;
    subscription.plan.billingCycle = billingCycle || 'monthly';
    subscription.limits = {
      ...limits,
      features: {
        advancedAnalytics: ['standard', 'premium', 'enterprise'].includes(plan),
        aiAssistant: ['premium', 'enterprise'].includes(plan),
        customBranding: ['standard', 'premium', 'enterprise'].includes(plan),
        apiAccess: ['premium', 'enterprise'].includes(plan),
        prioritySupport: ['premium', 'enterprise'].includes(plan),
        whiteLabel: plan === 'enterprise',
      },
    };

    subscription.status = 'active';
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days for monthly

    // Create invoice
    subscription.invoices.push({
      invoiceId: `INV-${Date.now()}`,
      amount: limits.price,
      currency: 'INR',
      status: 'paid',
      paidAt: new Date(),
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${billingCycle}`,
    });

    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription upgraded successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= POLICY & COMPLIANCE ENDPOINTS =============

// 1. Get consent records
export const getConsentRecords = async (req, res) => {
  try {
    const { tenantId } = req;
    const { userId, status, consentType, page = 1, limit = 20 } = req.query;

    const filter = { tenantId };
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (consentType) filter.consentType = consentType;

    const [consents, total] = await Promise.all([
      ConsentRecord.find(filter)
        .populate('userId', 'name email role')
        .populate('guardianId', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit)),
      ConsentRecord.countDocuments(filter),
    ]);

    // Get statistics
    const stats = await ConsentRecord.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      granted: 0,
      denied: 0,
      withdrawn: 0,
      expired: 0,
      pending: 0,
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    // Check for expiring consents (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringConsents = await ConsentRecord.countDocuments({
      tenantId,
      status: 'granted',
      expiresAt: { $lte: thirtyDaysFromNow, $gte: new Date() },
    });

    res.json({
      consents,
      statistics: {
        total,
        ...statusCounts,
        expiringSOon: expiringConsents,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching consent records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Create consent record
export const createConsentRecord = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const consentData = req.body;

    const consent = await ConsentRecord.create({
      ...consentData,
      tenantId,
      orgId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: consent.status === 'granted' ? 'consent_granted' : 'consent_denied',
      targetType: 'consent',
      targetId: consent._id,
      targetName: consent.consentType,
      description: `Consent ${consent.status} for ${consent.consentType}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Consent record created successfully',
      consent,
    });
  } catch (error) {
    console.error('Error creating consent record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Withdraw consent
export const withdrawConsent = async (req, res) => {
  try {
    const { consentId } = req.params;
    const { reason } = req.body;
    const { tenantId } = req;

    const consent = await ConsentRecord.findOne({ _id: consentId, tenantId });
    if (!consent) {
      return res.status(404).json({ message: 'Consent record not found' });
    }

    await consent.withdraw(reason);

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'consent_withdrawn',
      targetType: 'consent',
      targetId: consent._id,
      targetName: consent.consentType,
      description: `Consent withdrawn for ${consent.consentType}. Reason: ${reason}`,
      metadata: { reason },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Consent withdrawn successfully',
      consent,
    });
  } catch (error) {
    console.error('Error withdrawing consent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get data retention policies
export const getDataRetentionPolicies = async (req, res) => {
  try {
    const { tenantId } = req;
    const { dataType, isActive } = req.query;

    const filter = { tenantId };
    if (dataType) filter.dataType = dataType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const policies = await DataRetentionPolicy.find(filter)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      total: policies.length,
      active: policies.filter(p => p.isActive).length,
      autoEnforced: policies.filter(p => p.autoEnforce).length,
      totalRecordsAffected: policies.reduce((sum, p) => sum + p.recordsAffected, 0),
      totalRecordsDeleted: policies.reduce((sum, p) => sum + p.recordsDeleted, 0),
      totalRecordsArchived: policies.reduce((sum, p) => sum + p.recordsArchived, 0),
    };

    res.json({
      policies,
      statistics: stats,
    });
  } catch (error) {
    console.error('Error fetching data retention policies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Create data retention policy
export const createDataRetentionPolicy = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const policyData = req.body;

    const policy = await DataRetentionPolicy.create({
      ...policyData,
      tenantId,
      orgId,
      createdBy: req.user._id,
    });

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'policy_created',
      targetType: 'policy',
      targetId: policy._id,
      targetName: policy.name,
      description: `Data retention policy created for ${policy.dataType}`,
      metadata: { policyData },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Data retention policy created successfully',
      policy,
    });
  } catch (error) {
    console.error('Error creating data retention policy:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Update data retention policy
export const updateDataRetentionPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { tenantId } = req;
    const updates = req.body;

    const policy = await DataRetentionPolicy.findOne({ _id: policyId, tenantId });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const oldData = policy.toObject();
    Object.assign(policy, updates);
    policy.lastModifiedBy = req.user._id;
    await policy.save();

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'policy_updated',
      targetType: 'policy',
      targetId: policy._id,
      targetName: policy.name,
      description: `Data retention policy updated for ${policy.dataType}`,
      changes: { before: oldData, after: policy.toObject() },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Notify admins and parents about policy change
    const changeDescription = `Retention period changed from ${oldData.retentionPeriod?.value} ${oldData.retentionPeriod?.unit} to ${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`;
    
    // Notify school admins
    const admins = await User.find({ tenantId, role: 'school_admin' });
    const adminNotifications = await Promise.all(
      admins.map(admin =>
        Notification.create({
          userId: admin._id,
          type: 'policy_change',
          title: 'Policy Updated',
          message: `Data retention policy updated: ${policy.name} - ${changeDescription}`,
          metadata: {
            policyId: policy._id,
            policyName: policy.name,
            policyType: policy.dataType,
            retentionPeriod: `${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`,
            changeDescription,
            requiresParentNotification: true,
          },
          priority: 'high',
        })
      )
    );

    // Notify parents about policy change
    const parents = await User.find({ tenantId, role: 'parent' });
    const organization = await Organization.findById(req.user?.orgId);
    const parentNotifications = await Promise.all(
      parents.map(parent =>
        Notification.create({
          userId: parent._id,
          type: 'policy_change_parent',
          title: 'Data Policy Update',
          message: `Important: ${organization?.name || 'School'} has updated its data retention policy. ${changeDescription}. Please review the updated privacy policy.`,
          metadata: {
            policyId: policy._id,
            policyName: policy.name,
            retentionPeriod: `${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`,
            actionRequired: 'Please acknowledge',
            schoolName: organization?.name,
          },
          priority: 'high',
        })
      )
    );

    // Emit real-time notifications via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      admins.forEach((admin, index) => {
        io.to(admin._id.toString()).emit('notification', adminNotifications[index]);
      });
      parents.forEach((parent, index) => {
        io.to(parent._id.toString()).emit('notification', parentNotifications[index]);
      });
    }

    res.json({
      success: true,
      message: 'Policy updated successfully. Notifications sent to admins and parents.',
      policy,
      notificationStats: {
        adminsNotified: adminNotifications.length,
        parentsNotified: parentNotifications.length,
      },
    });
  } catch (error) {
    console.error('Error updating policy:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Delete data retention policy
export const deleteDataRetentionPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { tenantId } = req;

    const policy = await DataRetentionPolicy.findOne({ _id: policyId, tenantId });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    policy.isActive = false;
    await policy.save();

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'policy_deleted',
      targetType: 'policy',
      targetId: policy._id,
      targetName: policy.name,
      description: `Data retention policy deactivated for ${policy.dataType}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Policy deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Get audit logs
export const getAuditLogs = async (req, res) => {
  try {
    const { tenantId } = req;
    const { 
      userId, action, targetType, startDate, endDate, 
      isPIIAccess, requiresReview, page = 1, limit = 50 
    } = req.query;

    const filter = { tenantId };
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (targetType) filter.targetType = targetType;
    if (isPIIAccess) filter.isPIIAccess = isPIIAccess === 'true';
    if (requiresReview) filter.requiresReview = requiresReview === 'true';
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      ComplianceAuditLog.find(filter)
        .populate('userId', 'name email role')
        .populate('reviewedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit)),
      ComplianceAuditLog.countDocuments(filter),
    ]);

    // Get statistics
    const [actionStats, targetStats, piiAccessCount] = await Promise.all([
      ComplianceAuditLog.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      ComplianceAuditLog.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$targetType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ComplianceAuditLog.countDocuments({ tenantId, isPIIAccess: true }),
    ]);

    res.json({
      logs,
      statistics: {
        total,
        piiAccessCount,
        topActions: actionStats,
        byTargetType: targetStats,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 9. Export audit logs
export const exportAuditLogs = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate, format = 'json' } = req.query;

    const filter = { tenantId };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await ComplianceAuditLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .lean();

    // Log this export action
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'data_exported',
      targetType: 'system',
      description: `Audit logs exported (${logs.length} records)`,
      metadata: { recordCount: logs.length, format, startDate, endDate },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (format === 'csv') {
      // Convert to CSV
      const csv = convertLogsToCSV(logs);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
      return res.send(csv);
    }

    res.json({
      success: true,
      logs,
      exportedAt: new Date(),
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 10. Get compliance dashboard summary
export const getComplianceDashboard = async (req, res) => {
  try {
    const { tenantId } = req;

    const [
      totalConsents,
      activeConsents,
      expiringConsents,
      totalPolicies,
      activePolicies,
      recentAuditLogs,
      piiAccessLogs,
      consentsByType,
    ] = await Promise.all([
      ConsentRecord.countDocuments({ tenantId }),
      ConsentRecord.countDocuments({ tenantId, status: 'granted' }),
      ConsentRecord.countDocuments({
        tenantId,
        status: 'granted',
        expiresAt: { 
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          $gte: new Date()
        },
      }),
      DataRetentionPolicy.countDocuments({ tenantId }),
      DataRetentionPolicy.countDocuments({ tenantId, isActive: true }),
      ComplianceAuditLog.find({ tenantId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'name email'),
      ComplianceAuditLog.countDocuments({
        tenantId,
        isPIIAccess: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      ConsentRecord.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$consentType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Compliance score calculation (0-100)
    let complianceScore = 0;
    const totalStudents = await SchoolStudent.countDocuments({ tenantId });
    
    if (totalStudents > 0) {
      const studentsWithConsent = await ConsentRecord.distinct('userId', {
        tenantId,
        status: 'granted',
        consentType: 'data_collection',
      });
      
      complianceScore = (studentsWithConsent.length / totalStudents) * 100;
    }

    res.json({
      summary: {
        consents: {
          total: totalConsents,
          active: activeConsents,
          expiringSoon: expiringConsents,
          pending: await ConsentRecord.countDocuments({ tenantId, status: 'pending' }),
        },
        policies: {
          total: totalPolicies,
          active: activePolicies,
        },
        auditLogs: {
          recentCount: recentAuditLogs.length,
          piiAccessCount30d: piiAccessLogs,
        },
        complianceScore: parseFloat(complianceScore.toFixed(2)),
      },
      consentsByType,
      recentAuditLogs,
    });
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 11. Enforce data retention policy
export const enforceDataRetention = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { tenantId } = req;
    const { dryRun = false } = req.body;

    const policy = await DataRetentionPolicy.findOne({ _id: policyId, tenantId });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    let affectedRecords = [];
    let deletedCount = 0;
    let archivedCount = 0;

    const retentionDays = policy.getRetentionDays();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Find records to process based on data type
    let recordsToProcess = [];

    switch (policy.dataType) {
      case 'activity_logs':
        recordsToProcess = await ActivityLog.find({
          timestamp: { $lt: cutoffDate },
        }).limit(1000);
        break;
      case 'audit_logs':
        recordsToProcess = await ComplianceAuditLog.find({
          tenantId,
          createdAt: { $lt: cutoffDate },
          requiresReview: false,
        }).limit(1000);
        break;
      case 'consent_records':
        recordsToProcess = await ConsentRecord.find({
          tenantId,
          status: { $in: ['denied', 'withdrawn', 'expired'] },
          createdAt: { $lt: cutoffDate },
        }).limit(1000);
        break;
      default:
        return res.status(400).json({ message: 'Data type not supported for auto-enforcement' });
    }

    if (!dryRun) {
      for (const record of recordsToProcess) {
        if (policy.actionAfterExpiry === 'delete') {
          await record.deleteOne();
          deletedCount++;
        } else if (policy.actionAfterExpiry === 'archive') {
          // In a real system, you'd move this to archive storage
          record.isArchived = true;
          await record.save();
          archivedCount++;
        }
      }

      // Update policy stats
      policy.recordsAffected += recordsToProcess.length;
      policy.recordsDeleted += deletedCount;
      policy.recordsArchived += archivedCount;
      policy.lastEnforcedAt = new Date();
      await policy.save();

      // Log enforcement
      await ComplianceAuditLog.logAction({
        tenantId,
        orgId: req.user?.orgId,
        userId: req.user._id,
        userRole: req.user.role,
        userName: req.user.name,
        action: 'policy_enforced',
        targetType: 'policy',
        targetId: policy._id,
        targetName: policy.name,
        description: `Data retention policy enforced: ${deletedCount} deleted, ${archivedCount} archived`,
        metadata: { deletedCount, archivedCount, totalProcessed: recordsToProcess.length },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    res.json({
      success: true,
      message: dryRun ? 'Dry run completed' : 'Policy enforced successfully',
      results: {
        totalRecordsFound: recordsToProcess.length,
        deleted: deletedCount,
        archived: archivedCount,
        dryRun,
      },
    });
  } catch (error) {
    console.error('Error enforcing data retention:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 12. Get user consent status
export const getUserConsentStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tenantId } = req;

    const consents = await ConsentRecord.find({ tenantId, userId })
      .sort({ createdAt: -1 });

    const consentStatus = {};
    consents.forEach(consent => {
      if (!consentStatus[consent.consentType] || 
          new Date(consent.createdAt) > new Date(consentStatus[consent.consentType].createdAt)) {
        consentStatus[consent.consentType] = {
          status: consent.status,
          grantedAt: consent.grantedAt,
          expiresAt: consent.expiresAt,
          isValid: consent.isValid(),
        };
      }
    });

    res.json({
      userId,
      consents: consentStatus,
      totalConsents: consents.length,
      activeConsents: consents.filter(c => c.isValid()).length,
    });
  } catch (error) {
    console.error('Error fetching user consent status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 13. Generate compliance report
export const generateComplianceReport = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const [
      consentStats,
      policyStats,
      auditStats,
      dataAccessStats,
      userStats,
    ] = await Promise.all([
      ConsentRecord.aggregate([
        { $match: { tenantId, ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      DataRetentionPolicy.aggregate([
        { $match: { tenantId } },
        {
          $group: {
            _id: null,
            totalPolicies: { $sum: 1 },
            totalRecordsDeleted: { $sum: '$recordsDeleted' },
            totalRecordsArchived: { $sum: '$recordsArchived' },
          },
        },
      ]),
      ComplianceAuditLog.aggregate([
        { $match: { tenantId, ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      ComplianceAuditLog.countDocuments({
        tenantId,
        isPIIAccess: true,
        ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
      }),
      SchoolStudent.countDocuments({ tenantId }),
    ]);

    const report = {
      generatedAt: new Date(),
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present',
      },
      consent: {
        summary: consentStats,
        totalUsers: userStats,
      },
      dataRetention: policyStats[0] || {
        totalPolicies: 0,
        totalRecordsDeleted: 0,
        totalRecordsArchived: 0,
      },
      auditTrail: {
        topActions: auditStats,
        piiAccessCount: dataAccessStats,
      },
      recommendations: generateComplianceRecommendations(consentStats, policyStats, userStats),
    };

    // Log report generation
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'audit_performed',
      targetType: 'system',
      description: 'Compliance report generated',
      metadata: { startDate, endDate },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json(report);
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper: Generate compliance recommendations
const generateComplianceRecommendations = (consentStats, policyStats, totalUsers) => {
  const recommendations = [];
  
  const pendingConsents = consentStats.find(s => s._id === 'pending')?.count || 0;
  const grantedConsents = consentStats.find(s => s._id === 'granted')?.count || 0;
  
  if (pendingConsents > totalUsers * 0.2) {
    recommendations.push({
      type: 'consent',
      severity: 'high',
      message: `${pendingConsents} pending consents require attention`,
      action: 'Send reminder emails to complete consent forms',
    });
  }
  
  if (grantedConsents < totalUsers * 0.8) {
    recommendations.push({
      type: 'consent',
      severity: 'medium',
      message: 'Consent coverage is below 80%',
      action: 'Implement consent collection workflow for new users',
    });
  }
  
  const activePolicies = policyStats[0]?.totalPolicies || 0;
  if (activePolicies < 5) {
    recommendations.push({
      type: 'policy',
      severity: 'medium',
      message: 'Limited data retention policies in place',
      action: 'Create comprehensive data retention policies for all data types',
    });
  }
  
  return recommendations;
};

// Helper: Convert logs to CSV
const convertLogsToCSV = (logs) => {
  const headers = ['Timestamp', 'User', 'Action', 'Target Type', 'Description', 'Status', 'IP Address'];
  const rows = logs.map(log => [
    new Date(log.createdAt).toISOString(),
    log.userId?.name || 'Unknown',
    log.action,
    log.targetType || '',
    log.description || '',
    log.status,
    log.ipAddress || '',
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
};

// ============= ENHANCED ASSIGNMENT APPROVAL SYSTEM =============

// 1. Get assignment preview for approval
export const getAssignmentPreview = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId })
      .populate('teacherId', 'name email')
      .populate('classId', 'classNumber stream')
      .populate('modules.id');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Get affected students count
    const affectedStudentsCount = assignment.selectedStudents?.length || 0;

    res.json({
      assignment,
      metadata: {
        affectedStudentsCount,
        estimatedDuration: assignment.modules?.reduce((sum, m) => sum + (m.duration || 0), 0) || 0,
        totalMarks: assignment.totalMarks,
        requiresApproval: assignment.approvalRequired,
      },
    });
  } catch (error) {
    console.error('Error fetching assignment preview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Approve assignment with notification
export const approveAssignmentWithNotification = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;
    const { comments } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId })
      .populate('teacherId', 'name email')
      .populate('classId', 'name grade section');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Approve and publish - make visible to intended scope
    assignment.status = 'published';
    assignment.isPublished = true;
    assignment.publishedAt = new Date();
    assignment.approvedBy = req.user._id;
    assignment.approvedAt = new Date();
    await assignment.save();

    // Get all students in the target class/scope
    let targetStudents = [];
    if (assignment.classId) {
      // Find all students in this class
      const students = await User.find({
        tenantId,
        role: 'student',
        classId: assignment.classId._id,
      });
      targetStudents = students;
    }

    // Send notification to teacher
    await Notification.create({
      userId: assignment.teacherId._id,
      type: 'assignment_approved',
      title: 'Assignment Approved',
      message: `Your assignment "${assignment.title}" has been approved and published to ${assignment.classId?.name || 'students'}.${comments ? ` Admin comment: ${comments}` : ''}`,
      metadata: {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        approvedBy: req.user.name,
        comments,
        publishedTo: assignment.classId?.name,
        studentCount: targetStudents.length,
      },
      priority: 'high',
    });

    // Send notifications to all students in the scope
    if (targetStudents.length > 0) {
      const studentNotifications = targetStudents.map(student => ({
        userId: student._id,
        type: 'assignment_new',
        title: 'New Assignment Available',
        message: `New assignment "${assignment.title}" has been published for ${assignment.classId?.name}. Due date: ${assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'Not set'}`,
        metadata: {
          assignmentId: assignment._id,
          assignmentTitle: assignment.title,
          teacherName: assignment.teacherId?.name,
          className: assignment.classId?.name,
          dueDate: assignment.dueDate,
          subject: assignment.subject,
        },
        priority: 'medium',
      }));

      await Notification.insertMany(studentNotifications);

      // Emit real-time notifications to students via Socket.IO
      const io = req.app?.get('io');
      if (io) {
        targetStudents.forEach((student, index) => {
          io.to(student._id.toString()).emit('notification', studentNotifications[index]);
        });
      }
    }

    // Emit to teacher
    const io = req.app?.get('io');
    if (io) {
      io.to(assignment.teacherId._id.toString()).emit('assignment_approved', {
        assignmentId: assignment._id,
        title: assignment.title,
        studentsNotified: targetStudents.length,
      });
    }

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'assignment_approved',
      targetType: 'assignment',
      targetId: assignment._id,
      targetName: assignment.title,
      description: `Assignment approved and published to ${targetStudents.length} students in ${assignment.classId?.name || 'class'}`,
      metadata: { 
        comments,
        studentsNotified: targetStudents.length,
        className: assignment.classId?.name,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Assignment approved and teacher notified',
      assignment,
    });
  } catch (error) {
    console.error('Error approving assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Request changes to assignment
export const requestAssignmentChanges = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;
    const { changes, comments } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId })
      .populate('teacherId', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = 'changes_requested';
    assignment.requestedChanges = {
      requestedBy: req.user._id,
      requestedAt: new Date(),
      changes,
      comments,
    };
    await assignment.save();

    // Notify teacher
    await Notification.create({
      userId: assignment.teacherId._id,
      type: 'assignment_changes_requested',
      title: 'Assignment Changes Requested',
      message: `Changes requested for "${assignment.title}". ${comments}`,
      metadata: {
        assignmentId: assignment._id,
        requestedBy: req.user.name,
        changes,
        comments,
      },
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'assignment_changes_requested',
      targetType: 'assignment',
      targetId: assignment._id,
      description: `Changes requested for assignment`,
      metadata: { changes, comments },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Changes requested and teacher notified',
    });
  } catch (error) {
    console.error('Error requesting changes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Reject assignment
export const rejectAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;
    const { reason } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId })
      .populate('teacherId', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = 'rejected';
    assignment.rejectionReason = reason;
    assignment.rejectedBy = req.user._id;
    assignment.rejectedAt = new Date();
    await assignment.save();

    // Notify teacher
    await Notification.create({
      userId: assignment.teacherId._id,
      type: 'assignment_rejected',
      title: 'Assignment Rejected',
      message: `Your assignment "${assignment.title}" was rejected. Reason: ${reason}`,
      metadata: {
        assignmentId: assignment._id,
        rejectedBy: req.user.name,
        reason,
      },
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'assignment_rejected',
      targetType: 'assignment',
      targetId: assignment._id,
      description: `Assignment rejected`,
      metadata: { reason },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Assignment rejected and teacher notified',
    });
  } catch (error) {
    console.error('Error rejecting assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ENHANCED TEMPLATE MANAGEMENT =============

// 5. Upload and tag template
export const uploadTemplateWithTags = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const {
      title, description, category, subject, gradeLevel,
      type, isPremium, price, content, questions,
      // New tagging fields
      pillarTags, nepLinks, visibility, duration, totalMarks
    } = req.body;

    const template = await Template.create({
      tenantId,
      orgId,
      title,
      description,
      category,
      subject,
      gradeLevel,
      type,
      isPremium,
      price,
      content,
      questions,
      duration,
      totalMarks,
      // Tagging
      tags: pillarTags || [],
      metadata: {
        nepLinks: nepLinks || [],
        pillarAlignment: pillarTags || [],
      },
      // Visibility
      isPublic: visibility === 'public',
      isGlobal: visibility === 'global',
      // Creator
      createdBy: req.user._id,
      approvalStatus: visibility === 'public' ? 'pending' : 'approved',
    });

    res.json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Update template with tags
export const updateTemplateWithTags = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const { pillarTags, nepLinks, visibility, ...updates } = req.body;

    const template = await Template.findOne({ _id: templateId, tenantId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    Object.assign(template, updates);
    
    if (pillarTags) {
      template.tags = pillarTags;
      template.metadata = template.metadata || {};
      template.metadata.pillarAlignment = pillarTags;
    }
    
    if (nepLinks) {
      template.metadata = template.metadata || {};
      template.metadata.nepLinks = nepLinks;
    }
    
    if (visibility) {
      template.isPublic = visibility === 'public';
      template.isGlobal = visibility === 'global';
      if (visibility === 'public' && template.approvalStatus !== 'approved') {
        template.approvalStatus = 'pending';
      }
    }

    await template.save();

    res.json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ROLE MANAGEMENT =============

// 7. Get all role permissions
export const getRolePermissions = async (req, res) => {
  try {
    const { tenantId } = req;

    const roles = await RolePermission.find({ tenantId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Get default roles if none exist
    if (roles.length === 0) {
      const defaultRoles = await createDefaultRoles(tenantId, req.user.orgId, req.user._id);
      return res.json({ roles: defaultRoles });
    }

    res.json({ roles });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Create custom role
export const createCustomRole = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { roleName, roleType, displayName, description, permissions, campusRestrictions } = req.body;

    const role = await RolePermission.create({
      tenantId,
      orgId,
      roleName,
      roleType,
      displayName,
      description,
      permissions,
      campusRestrictions,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: 'Role created successfully',
      role,
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 9. Update role permissions
export const updateRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { tenantId } = req;
    const { permissions, campusRestrictions } = req.body;

    const role = await RolePermission.findOne({ _id: roleId, tenantId });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (permissions) {
      role.permissions = { ...role.permissions, ...permissions };
    }
    
    if (campusRestrictions) {
      role.campusRestrictions = campusRestrictions;
    }

    await role.save();

    res.json({
      success: true,
      message: 'Role permissions updated',
      role,
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 10. Create user with role
export const createUserWithRole = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, email, password, roleType, campusId, permissions } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: roleType,
      tenantId,
      orgId,
      campusId,
    });

    // Create or assign role permission
    let rolePermission = await RolePermission.findOne({ tenantId, roleType });
    if (!rolePermission && permissions) {
      rolePermission = await RolePermission.create({
        tenantId,
        orgId,
        roleName: roleType,
        roleType,
        permissions,
        createdBy: req.user._id,
      });
    }

    res.json({
      success: true,
      message: 'User created with role successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
      },
    });
  } catch (error) {
    console.error('Error creating user with role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ESCALATION CHAIN MANAGEMENT =============

// 11. Get escalation chains
export const getEscalationChains = async (req, res) => {
  try {
    const { tenantId } = req;

    const chains = await EscalationChain.find({ tenantId, isActive: true })
      .populate('levels.userId', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ chains });
  } catch (error) {
    console.error('Error fetching escalation chains:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 12. Create escalation chain
export const createEscalationChain = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, triggerType, description, levels, conditions } = req.body;

    const chain = await EscalationChain.create({
      tenantId,
      orgId,
      name,
      triggerType,
      description,
      levels,
      conditions,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: 'Escalation chain created successfully',
      chain,
    });
  } catch (error) {
    console.error('Error creating escalation chain:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 13. Update escalation chain
export const updateEscalationChain = async (req, res) => {
  try {
    const { chainId } = req.params;
    const { tenantId } = req;
    const updates = req.body;

    const chain = await EscalationChain.findOne({ _id: chainId, tenantId });
    if (!chain) {
      return res.status(404).json({ message: 'Escalation chain not found' });
    }

    Object.assign(chain, updates);
    await chain.save();

    res.json({
      success: true,
      message: 'Escalation chain updated',
      chain,
    });
  } catch (error) {
    console.error('Error updating escalation chain:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 14. Trigger escalation
export const triggerEscalation = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const {
      studentId, triggerType, description, severity,
      relatedWellbeingFlagId, relatedAssignmentId
    } = req.body;

    // Find matching escalation chain
    const chain = await EscalationChain.findOne({
      tenantId,
      triggerType,
      isActive: true,
    }).populate('levels.userId', 'name email');

    if (!chain) {
      return res.status(404).json({ message: 'No escalation chain found for this trigger type' });
    }

    // Create escalation case
    const escalationCase = await EscalationCase.create({
      tenantId,
      orgId,
      chainId: chain._id,
      studentId,
      triggerType,
      triggerDescription: description,
      severity,
      relatedWellbeingFlagId,
      relatedAssignmentId,
      currentLevel: 1,
      escalationHistory: [{
        level: 1,
        assignedTo: chain.levels[0]?.userId?._id,
        assignedAt: new Date(),
      }],
    });

    // Send notification to first level
    if (chain.levels[0]?.userId) {
      await Notification.create({
        userId: chain.levels[0].userId._id,
        type: 'escalation_alert',
        title: `Escalation Alert: ${chain.name}`,
        message: description,
        metadata: {
          caseId: escalationCase.caseId,
          studentId,
          severity,
          level: 1,
        },
      });

      // Track notification
      escalationCase.notificationsSent.push({
        recipientId: chain.levels[0].userId._id,
        method: chain.levels[0].notificationMethod || 'email',
        sentAt: new Date(),
      });
      await escalationCase.save();
    }

    // Update chain stats
    chain.timesTriggered += 1;
    chain.lastTriggeredAt = new Date();
    await chain.save();

    res.json({
      success: true,
      message: 'Escalation triggered successfully',
      case: escalationCase,
    });
  } catch (error) {
    console.error('Error triggering escalation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 15. Get active escalation cases
export const getEscalationCases = async (req, res) => {
  try {
    const { tenantId } = req;
    const { status, campusId, severity } = req.query;

    const filter = { tenantId };
    if (status) filter.status = status;
    if (campusId) filter.campusId = campusId;
    if (severity) filter.severity = severity;

    const cases = await EscalationCase.find(filter)
      .populate('studentId', 'name email')
      .populate('chainId', 'name triggerType')
      .populate('escalationHistory.assignedTo', 'name email role')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = {
      total: cases.length,
      active: cases.filter(c => c.status === 'active').length,
      resolved: cases.filter(c => c.status === 'resolved').length,
      escalated: cases.filter(c => c.status === 'escalated').length,
      bySeverity: {
        low: cases.filter(c => c.severity === 'low').length,
        medium: cases.filter(c => c.severity === 'medium').length,
        high: cases.filter(c => c.severity === 'high').length,
        critical: cases.filter(c => c.severity === 'critical').length,
      },
    };

    res.json({
      cases,
      statistics: stats,
    });
  } catch (error) {
    console.error('Error fetching escalation cases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 16. Resolve escalation case
export const resolveEscalationCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { tenantId } = req;
    const { resolutionNotes } = req.body;

    const escalationCase = await EscalationCase.findOne({ _id: caseId, tenantId });
    if (!escalationCase) {
      return res.status(404).json({ message: 'Escalation case not found' });
    }

    escalationCase.status = 'resolved';
    escalationCase.resolvedBy = req.user._id;
    escalationCase.resolvedAt = new Date();
    escalationCase.resolutionNotes = resolutionNotes;
    escalationCase.resolutionTime = Math.floor((new Date() - escalationCase.createdAt) / 60000); // minutes

    await escalationCase.save();

    res.json({
      success: true,
      message: 'Escalation case resolved',
      case: escalationCase,
    });
  } catch (error) {
    console.error('Error resolving case:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper: Create default roles
const createDefaultRoles = async (tenantId, orgId, createdBy) => {
  const defaultRoles = [
    {
      roleName: 'School Admin',
      roleType: 'school_admin',
      displayName: 'School Administrator',
      description: 'Full access to all features and campuses',
      permissions: {
        viewDashboard: true,
        viewAnalytics: true,
        viewAllCampuses: true,
        createStudent: true,
        editStudent: true,
        deleteStudent: true,
        viewStudentPII: true,
        createStaff: true,
        editStaff: true,
        deleteStaff: true,
        assignClasses: true,
        approveAssignments: true,
        createAssignments: true,
        viewAllAssignments: true,
        createTemplates: true,
        editTemplates: true,
        deleteTemplates: true,
        approveTemplates: true,
        publishTemplates: true,
        viewWellbeingCases: true,
        createWellbeingFlags: true,
        resolveWellbeingCases: true,
        accessCounselingData: true,
        viewFinancials: true,
        manageSubscription: true,
        manageSettings: true,
        manageCampuses: true,
        manageRoles: true,
        viewComplianceData: true,
        manageConsents: true,
        managePolicies: true,
        viewAuditLogs: true,
        viewEmergencyAlerts: true,
        createEmergencyAlerts: true,
        manageEscalation: true,
      },
    },
    {
      roleName: 'Campus Admin',
      roleType: 'campus_admin',
      displayName: 'Campus Administrator',
      description: 'Full access to assigned campus only',
      permissions: {
        viewDashboard: true,
        viewAnalytics: true,
        viewOwnCampusOnly: true,
        createStudent: true,
        editStudent: true,
        viewStudentPII: true,
        createStaff: true,
        editStaff: true,
        assignClasses: true,
        approveAssignments: true,
        viewAllAssignments: true,
        createTemplates: true,
        editTemplates: true,
        viewWellbeingCases: true,
        createWellbeingFlags: true,
        resolveWellbeingCases: true,
        viewEmergencyAlerts: true,
        createEmergencyAlerts: true,
      },
    },
    {
      roleName: 'Counselor',
      roleType: 'counselor',
      displayName: 'School Counselor',
      description: 'Access to wellbeing and counseling features',
      permissions: {
        viewDashboard: true,
        viewAnalytics: true,
        viewStudentPII: true,
        viewWellbeingCases: true,
        createWellbeingFlags: true,
        resolveWellbeingCases: true,
        accessCounselingData: true,
        viewEmergencyAlerts: true,
      },
    },
  ];

  const createdRoles = await RolePermission.insertMany(
    defaultRoles.map(role => ({ ...role, tenantId, orgId, createdBy }))
  );

  return createdRoles;
};

// 17. Assign role to user
export const assignRoleToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tenantId } = req;
    const { roleType, campusId } = req.body;

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = roleType;
    if (campusId) {
      user.campusId = campusId;
    }
    await user.save();

    res.json({
      success: true,
      message: 'Role assigned successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
      },
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= NEP COMPETENCY TRACKING & EXPORT =============

// 1. Get all NEP competencies
export const getNEPCompetencies = async (req, res) => {
  try {
    const { grade, pillar, search } = req.query;

    const filter = { isActive: true };
    if (grade) filter.grade = parseInt(grade);
    if (pillar) filter.pillar = pillar;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { competencyId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const competencies = await NEPCompetency.find(filter).sort({ grade: 1, pillar: 1, competencyId: 1 });

    res.json({
      competencies,
      total: competencies.length,
    });
  } catch (error) {
    console.error('Error fetching NEP competencies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Create NEP competency
export const createNEPCompetency = async (req, res) => {
  try {
    const competencyData = req.body;

    const competency = await NEPCompetency.create(competencyData);

    res.json({
      success: true,
      message: 'NEP competency created successfully',
      competency,
    });
  } catch (error) {
    console.error('Error creating NEP competency:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Log NEP coverage (when assignment/template is used)
export const logNEPCoverage = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const {
      activityId, activityType, activityTitle, studentId, classId,
      grade, section, competenciesCovered, coverageHours, startDate, endDate
    } = req.body;

    const coverageLog = await NEPCoverageLog.create({
      tenantId,
      orgId,
      activityId,
      activityType,
      activityTitle,
      studentId,
      classId,
      grade,
      section,
      competenciesCovered,
      coverageHours,
      startDate,
      endDate,
      assignedBy: req.user._id,
    });

    res.json({
      success: true,
      message: 'NEP coverage logged successfully',
      coverageLog,
    });
  } catch (error) {
    console.error('Error logging NEP coverage:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get NEP coverage report
export const getNEPCoverageReport = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate, grade, campusId } = req.query;

    const filter = { tenantId };
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    
    if (grade) filter.grade = parseInt(grade);
    if (campusId) filter.campusId = campusId;

    const coverageLogs = await NEPCoverageLog.find(filter)
      .populate('activityId')
      .populate('studentId', 'name')
      .populate('classId', 'classNumber')
      .sort({ startDate: -1 });

    // Aggregate by competency
    const competencyMap = {};
    coverageLogs.forEach(log => {
      log.competenciesCovered.forEach(comp => {
        if (!competencyMap[comp.competencyId]) {
          competencyMap[comp.competencyId] = {
            competencyId: comp.competencyId,
            pillar: comp.pillar,
            totalCoverageHours: 0,
            activitiesCount: 0,
            studentsCount: new Set(),
            activities: [],
          };
        }
        competencyMap[comp.competencyId].totalCoverageHours += log.coverageHours || 0;
        competencyMap[comp.competencyId].activitiesCount++;
        if (log.studentId) {
          competencyMap[comp.competencyId].studentsCount.add(log.studentId.toString());
        }
        competencyMap[comp.competencyId].activities.push({
          activityId: log.activityId,
          activityTitle: log.activityTitle,
          grade: log.grade,
          coverageHours: log.coverageHours,
          startDate: log.startDate,
        });
      });
    });

    // Convert to array and calculate percentages
    const competencyCoverage = Object.values(competencyMap).map(comp => ({
      ...comp,
      studentsCount: comp.studentsCount.size,
      activities: comp.activities.slice(0, 5), // Limit to 5 for response
    }));

    // Get all competencies for the grade
    let allCompetencies = [];
    if (grade) {
      allCompetencies = await NEPCompetency.find({ grade: parseInt(grade), isActive: true });
    }

    const coveragePercentage = allCompetencies.length > 0
      ? (Object.keys(competencyMap).length / allCompetencies.length) * 100
      : 0;

    res.json({
      summary: {
        totalActivities: coverageLogs.length,
        competenciesCovered: Object.keys(competencyMap).length,
        totalCompetencies: allCompetencies.length,
        coveragePercentage: parseFloat(coveragePercentage.toFixed(2)),
        totalCoverageHours: coverageLogs.reduce((sum, log) => sum + (log.coverageHours || 0), 0),
      },
      competencyCoverage,
      recentActivities: coverageLogs.slice(0, 10),
    });
  } catch (error) {
    console.error('Error fetching NEP coverage report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Export NEP coverage as CSV
export const exportNEPCoverageCSV = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate, grade, campusId } = req.query;

    const filter = { tenantId };
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    
    if (grade) filter.grade = parseInt(grade);
    if (campusId) filter.campusId = campusId;

    const coverageLogs = await NEPCoverageLog.find(filter)
      .populate('activityId')
      .sort({ startDate: -1 });

    // Format for CSV export
    const csvData = [];
    coverageLogs.forEach(log => {
      const competencyIds = log.competenciesCovered.map(c => c.competencyId).join('; ');
      csvData.push({
        grade: log.grade || 'N/A',
        activity_id: log.activityId || log.activityTitle || 'N/A',
        activity_title: log.activityTitle || 'N/A',
        activity_type: log.activityType,
        NEP_competencies: competencyIds,
        coverage_hours: log.coverageHours || 0,
        start_date: log.startDate ? new Date(log.startDate).toISOString().split('T')[0] : '',
        end_date: log.endDate ? new Date(log.endDate).toISOString().split('T')[0] : '',
        status: log.status,
        section: log.section || 'N/A',
      });
    });

    // Convert to CSV
    const headers = ['grade', 'activity_id', 'activity_title', 'activity_type', 'NEP_competencies', 'coverage_hours', 'start_date', 'end_date', 'status', 'section'];
    const rows = csvData.map(row => headers.map(h => row[h] || '').join(','));
    const csv = [headers.join(','), ...rows].join('\n');

    // Log export
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'data_exported',
      targetType: 'system',
      description: `NEP coverage report exported (${coverageLogs.length} records)`,
      metadata: { format: 'CSV', startDate, endDate, grade, recordCount: coverageLogs.length },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=nep-coverage-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting NEP coverage CSV:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Export NEP coverage as JSON (for PDF generation on frontend)
export const exportNEPCoverageJSON = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate, grade, campusId } = req.query;

    const filter = { tenantId };
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    
    if (grade) filter.grade = parseInt(grade);
    if (campusId) filter.campusId = campusId;

    const coverageLogs = await NEPCoverageLog.find(filter)
      .populate('studentId', 'name email')
      .populate('classId', 'classNumber stream')
      .sort({ startDate: -1 });

    // Get competency details
    const competencyIds = [...new Set(
      coverageLogs.flatMap(log => log.competenciesCovered.map(c => c.competencyId))
    )];

    const competencies = await NEPCompetency.find({
      competencyId: { $in: competencyIds }
    });

    const competencyLookup = {};
    competencies.forEach(comp => {
      competencyLookup[comp.competencyId] = comp;
    });

    // Format data for export
    const exportData = coverageLogs.map(log => ({
      grade: log.grade,
      activity_id: log.activityId?.toString() || log.activityTitle,
      activity_title: log.activityTitle,
      activity_type: log.activityType,
      NEP_competencies: log.competenciesCovered.map(c => ({
        competencyId: c.competencyId,
        title: competencyLookup[c.competencyId]?.title || c.competencyId,
        pillar: c.pillar,
        coverage: c.coveragePercentage,
        mastery: c.masteryLevel,
      })),
      coverage_hours: log.coverageHours,
      start_date: log.startDate,
      end_date: log.endDate,
      student: log.studentId?.name,
      class: log.classId?.classNumber,
      section: log.section,
      status: log.status,
    }));

    // Summary statistics
    const summary = {
      totalActivities: coverageLogs.length,
      totalCompetenciesCovered: competencyIds.length,
      totalCoverageHours: coverageLogs.reduce((sum, log) => sum + (log.coverageHours || 0), 0),
      byPillar: {
        uvls: competencyIds.filter(id => id.includes('UVLS')).length,
        dcos: competencyIds.filter(id => id.includes('DCOS')).length,
        moral: competencyIds.filter(id => id.includes('MORAL')).length,
        ehe: competencyIds.filter(id => id.includes('EHE')).length,
        crgc: competencyIds.filter(id => id.includes('CRGC')).length,
      },
      dateRange: {
        start: startDate || 'All time',
        end: endDate || 'Present',
      },
      grade: grade || 'All grades',
    };

    // Log export
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'data_exported',
      targetType: 'system',
      description: `NEP coverage report exported (${coverageLogs.length} records)`,
      metadata: { format: 'JSON', startDate, endDate, grade, recordCount: coverageLogs.length },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      summary,
      data: exportData,
      exportedAt: new Date(),
      format: 'standardized_nep_export',
    });
  } catch (error) {
    console.error('Error exporting NEP coverage JSON:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Seed default NEP competencies
export const seedNEPCompetencies = async (req, res) => {
  try {
    // Check if competencies already exist
    const existingCount = await NEPCompetency.countDocuments();
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'NEP competencies already seeded',
        count: existingCount,
      });
    }

    // Sample NEP competencies for each pillar and grade
    const sampleCompetencies = [];
    const pillars = ['uvls', 'dcos', 'moral', 'ehe', 'crgc'];
    const pillarNames = {
      uvls: 'Understanding Values & Life Skills',
      dcos: 'Digital Citizenship & Online Safety',
      moral: 'Moral & Spiritual Education',
      ehe: 'Environmental & Health Education',
      crgc: 'Cultural Roots & Global Citizenship',
    };

    for (let grade = 1; grade <= 12; grade++) {
      pillars.forEach((pillar, pillarIdx) => {
        for (let i = 1; i <= 5; i++) {
          const competencyId = `NEP-${grade}-${pillar.toUpperCase()}-${String(i).padStart(3, '0')}`;
          sampleCompetencies.push({
            competencyId,
            title: `${pillarNames[pillar]} Competency ${i} for Grade ${grade}`,
            description: `Develop ${pillarNames[pillar].toLowerCase()} through practical activities and assessments`,
            grade,
            pillar,
            learningOutcome: `Students will demonstrate understanding of ${pillarNames[pillar].toLowerCase()}`,
            assessmentCriteria: [
              'Can explain key concepts',
              'Can apply in real situations',
              'Shows critical thinking',
            ],
            difficulty: i <= 2 ? 'foundation' : i <= 4 ? 'intermediate' : 'advanced',
            recommendedHours: i * 2,
            domain: 'cognitive',
            bloomLevel: i <= 2 ? 'understand' : i <= 4 ? 'apply' : 'analyze',
            nepReference: {
              document: 'NEP 2020',
              section: `Grade ${grade} - ${pillarNames[pillar]}`,
              page: grade * 10 + pillarIdx,
            },
          });
        }
      });
    }

    const created = await NEPCompetency.insertMany(sampleCompetencies);

    res.json({
      success: true,
      message: `${created.length} NEP competencies seeded successfully`,
      count: created.length,
    });
  } catch (error) {
    console.error('Error seeding NEP competencies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Update template with NEP competencies
export const updateTemplateNEPCompetencies = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const { competencyIds, nepLinks } = req.body;

    const template = await Template.findOne({ _id: templateId, tenantId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Validate competency IDs exist
    const competencies = await NEPCompetency.find({
      competencyId: { $in: competencyIds }
    });

    if (!template.metadata) {
      template.metadata = {};
    }

    template.metadata.nepCompetencies = competencyIds;
    template.metadata.nepLinks = nepLinks || template.metadata.nepLinks || [];
    
    // Auto-tag pillars based on competencies
    const pillars = [...new Set(competencies.map(c => c.pillar))];
    template.tags = [...new Set([...(template.tags || []), ...pillars])];

    await template.save();

    res.json({
      success: true,
      message: 'Template NEP competencies updated',
      template,
      competenciesLinked: competencies.length,
    });
  } catch (error) {
    console.error('Error updating template NEP competencies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 9. Update assignment with NEP competencies
export const updateAssignmentNEPCompetencies = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;
    const { competencyIds } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Validate competency IDs
    const competencies = await NEPCompetency.find({
      competencyId: { $in: competencyIds }
    });

    if (!assignment.metadata) {
      assignment.metadata = {};
    }

    assignment.metadata = assignment.metadata || {};
    assignment.metadata.nepCompetencies = competencyIds;

    await assignment.save();

    // When assignment is published, log coverage
    if (assignment.status === 'published') {
      const estimatedHours = (assignment.modules?.reduce((sum, m) => sum + (m.duration || 0), 0) || 60) / 60;
      
      await NEPCoverageLog.create({
        tenantId,
        orgId: req.user?.orgId,
        activityId: assignment._id,
        activityType: 'assignment',
        activityTitle: assignment.title,
        classId: assignment.classId,
        grade: parseInt(assignment.className?.match(/\d+/)?.[0]) || null,
        section: assignment.section,
        competenciesCovered: competencyIds.map(id => {
          const comp = competencies.find(c => c.competencyId === id);
          return {
            competencyId: id,
            pillar: comp?.pillar || 'uvls',
            coveragePercentage: 100,
            masteryLevel: 'introduced',
          };
        }),
        coverageHours: estimatedHours,
        startDate: assignment.assignedDate || new Date(),
        endDate: assignment.dueDate,
        assignedBy: assignment.teacherId,
        status: 'scheduled',
      });
    }

    res.json({
      success: true,
      message: 'Assignment NEP competencies updated',
      assignment,
      competenciesLinked: competencies.length,
    });
  } catch (error) {
    console.error('Error updating assignment NEP competencies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 10. Get NEP dashboard summary
export const getNEPDashboard = async (req, res) => {
  try {
    const { tenantId } = req;
    const { grade } = req.query;

    const filter = { tenantId };
    if (grade) filter.grade = parseInt(grade);

    // Get competencies for grade
    const allCompetencies = await NEPCompetency.find({
      ...(grade && { grade: parseInt(grade) }),
      isActive: true,
    });

    // Get coverage logs
    const coverageLogs = await NEPCoverageLog.find(filter);

    // Calculate coverage by pillar
    const pillarCoverage = {
      uvls: { total: 0, covered: 0, hours: 0 },
      dcos: { total: 0, covered: 0, hours: 0 },
      moral: { total: 0, covered: 0, hours: 0 },
      ehe: { total: 0, covered: 0, hours: 0 },
      crgc: { total: 0, covered: 0, hours: 0 },
    };

    allCompetencies.forEach(comp => {
      pillarCoverage[comp.pillar].total++;
    });

    const coveredCompetencies = new Set();
    coverageLogs.forEach(log => {
      log.competenciesCovered.forEach(comp => {
        coveredCompetencies.add(comp.competencyId);
        pillarCoverage[comp.pillar].hours += log.coverageHours || 0;
      });
    });

    coveredCompetencies.forEach(compId => {
      const comp = allCompetencies.find(c => c.competencyId === compId);
      if (comp) {
        pillarCoverage[comp.pillar].covered++;
      }
    });

    // Calculate percentages
    Object.keys(pillarCoverage).forEach(pillar => {
      const data = pillarCoverage[pillar];
      data.percentage = data.total > 0 ? (data.covered / data.total) * 100 : 0;
    });

    res.json({
      summary: {
        totalCompetencies: allCompetencies.length,
        coveredCompetencies: coveredCompetencies.size,
        coveragePercentage: allCompetencies.length > 0 
          ? (coveredCompetencies.size / allCompetencies.length) * 100 
          : 0,
        totalHours: coverageLogs.reduce((sum, log) => sum + (log.coverageHours || 0), 0),
      },
      pillarCoverage,
      recentActivities: coverageLogs.slice(-10),
    });
  } catch (error) {
    console.error('Error fetching NEP dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ADDITIONAL HELPER ENDPOINTS =============

// Get organization info
export const getOrganizationInfo = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    const organization = await Organization.findById(orgId);
    
    res.json({
      organization: {
        name: organization?.name || 'School',
        email: organization?.settings?.contactInfo?.email || organization?.contactInfo?.email || '',
        address: organization?.settings?.address || '',
        phone: organization?.settings?.contactInfo?.phone || organization?.contactInfo?.phone || '',
        website: organization?.settings?.website || '',
        principalName: organization?.settings?.principalName || ''
      }
    });
  } catch (error) {
    console.error('Error fetching organization info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update organization info
export const updateOrganizationInfo = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, email, phone, address, website, principalName } = req.body;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Update fields
    if (name) organization.name = name;
    
    if (!organization.settings) organization.settings = {};
    if (!organization.contactInfo) organization.contactInfo = {};
    
    if (email) {
      organization.contactInfo.email = email;
      if (!organization.settings.contactInfo) organization.settings.contactInfo = {};
      organization.settings.contactInfo.email = email;
    }
    if (phone) {
      organization.contactInfo.phone = phone;
      if (!organization.settings.contactInfo) organization.settings.contactInfo = {};
      organization.settings.contactInfo.phone = phone;
    }
    if (address) organization.settings.address = address;
    if (website) organization.settings.website = website;
    if (principalName) organization.settings.principalName = principalName;

    await organization.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'organization_updated',
      targetType: 'organization',
      targetId: organization._id,
      description: 'Organization information updated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Organization updated successfully',
      organization,
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update campus
export const updateCampus = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { campusId } = req.params;
    const { name, code, location, contactInfo } = req.body;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const campusIndex = organization.campuses?.findIndex(c => c.campusId === campusId);
    if (campusIndex === -1 || campusIndex === undefined) {
      return res.status(404).json({ message: 'Campus not found' });
    }

    const campus = organization.campuses[campusIndex];

    // Update campus fields
    if (name) campus.name = name;
    if (code) campus.code = code;
    if (location) campus.location = location;
    if (contactInfo) campus.contactInfo = contactInfo;

    organization.campuses[campusIndex] = campus;
    organization.markModified('campuses');
    await organization.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'campus_updated',
      targetType: 'campus',
      targetId: campusId,
      targetName: name,
      description: `Campus "${name}" updated`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Campus updated successfully',
      campus,
    });
  } catch (error) {
    console.error('Error updating campus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete campus
export const deleteCampus = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { campusId } = req.params;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const campus = organization.campuses?.find(c => c.campusId === campusId);
    if (!campus) {
      return res.status(404).json({ message: 'Campus not found' });
    }

    if (campus.isMain) {
      return res.status(400).json({ message: 'Cannot delete main campus' });
    }

    // Remove campus
    organization.campuses = organization.campuses.filter(c => c.campusId !== campusId);
    organization.markModified('campuses');
    await organization.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'campus_deleted',
      targetType: 'campus',
      targetId: campusId,
      description: `Campus "${campus.name}" deleted`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Campus deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting campus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update preferences
export const updatePreferences = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const preferences = req.body;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Update preferences in organization settings
    if (!organization.settings) organization.settings = {};
    organization.settings.preferences = {
      ...(organization.settings.preferences || {}),
      ...preferences
    };
    organization.markModified('settings');
    await organization.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'preferences_updated',
      targetType: 'organization',
      targetId: organization._id,
      description: 'System preferences updated',
      metadata: preferences,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: organization.settings.preferences,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent activity
export const getRecentActivity = async (req, res) => {
  try {
    const { tenantId } = req;
    const limit = parseInt(req.query.limit) || 20;

    const activities = await ComplianceAuditLog.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('action userName targetType targetName description createdAt');

    const formattedActivities = activities.map(activity => ({
      title: activity.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: activity.description || `${activity.userName} performed ${activity.action} on ${activity.targetType}`,
      timestamp: activity.createdAt,
      userName: activity.userName,
    }));

    res.json({
      success: true,
      activities: formattedActivities,
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get top performing students
export const getTopPerformers = async (req, res) => {
  try {
    const { tenantId } = req;
    const limit = parseInt(req.query.limit) || 10;

    const students = await SchoolStudent.find({ tenantId })
      .populate('userId', 'name email')
      .sort({ 'pillars.uvls': -1 })
      .limit(limit);

    const performers = students.map(student => ({
      name: student.userId?.name || student.name,
      grade: student.grade,
      section: student.section,
      score: Math.round(
        ((student.pillars?.uvls || 0) + (student.pillars?.dcos || 0) + (student.pillars?.moral || 0) + (student.pillars?.ehe || 0) + (student.pillars?.crgc || 0)) / 5
      ),
    }));

    res.json({
      success: true,
      students: performers,
    });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get weekly trend
export const getWeeklyTrend = async (req, res) => {
  try {
    const { tenantId } = req;

    // Get last 7 days of data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trend = await AnalyticsEvent.aggregate([
      {
        $match: {
          tenantId,
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      trend: trend.map(t => ({
        date: t._id,
        events: t.count,
      })),
    });
  } catch (error) {
    console.error('Error fetching weekly trend:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all classes with enhanced data
export const getAllClasses = async (req, res) => {
  try {
    const { tenantId } = req;
    const { grade, stream } = req.query;

    const filter = { tenantId, isActive: true };
    if (grade && grade !== 'all') filter.classNumber = parseInt(grade);
    if (stream && stream !== 'all') filter.stream = stream;

    const classes = await SchoolClass.find(filter)
      .populate('sections.classTeacher', 'name email subject')
      .populate('subjects.teachers', 'name email subject')
      .lean();

    // Enhance with student count
    const classesWithCounts = await Promise.all(classes.map(async (cls) => {
      const studentCount = await SchoolStudent.countDocuments({
        tenantId,
        classId: cls._id
      });

      return {
        ...cls,
        totalStudents: studentCount
      };
    }));

    res.json({
      success: true,
      classes: classesWithCounts,
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get class statistics
export const getClassStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [totalClasses, classesData] = await Promise.all([
      SchoolClass.countDocuments({ tenantId, isActive: true }),
      SchoolClass.find({ tenantId, isActive: true }).lean()
    ]);

    const totalSections = classesData.reduce((sum, cls) => sum + (cls.sections?.length || 0), 0);
    const totalSubjects = classesData.reduce((sum, cls) => sum + (cls.subjects?.length || 0), 0);
    
    const totalStudents = await SchoolStudent.countDocuments({ tenantId, isActive: true });

    res.json({
      success: true,
      total: totalClasses,
      totalSections,
      totalSubjects,
      totalStudents
    });
  } catch (error) {
    console.error('Error fetching class stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single class details
export const getClassDetails = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;

    const classData = await SchoolClass.findOne({ _id: classId, tenantId })
      .populate('sections.classTeacher', 'name email phone subject')
      .populate('subjects.teachers', 'name email phone subject')
      .lean();

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get students in this class
    const students = await SchoolStudent.find({ tenantId, classId })
      .populate('userId', 'name email phone')
      .limit(100)
      .lean();

    const studentsData = students.map(s => ({
      _id: s._id,
      name: s.userId?.name || s.name,
      email: s.userId?.email || s.email,
      rollNumber: s.rollNumber,
      section: s.section,
      grade: s.grade
    }));

    res.json({
      success: true,
      class: {
        ...classData,
        students: studentsData,
        totalStudents: students.length
      }
    });
  } catch (error) {
    console.error('Error fetching class details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new class
export const createClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { classNumber, stream, sections, subjects, academicYear } = req.body;

    if (!classNumber || !academicYear || !sections || sections.length === 0) {
      return res.status(400).json({ 
        message: 'Missing required fields: classNumber, academicYear, and at least one section are required' 
      });
    }

    // Validate stream for classes 11-12
    if (parseInt(classNumber) >= 11 && !stream) {
      return res.status(400).json({ message: 'Stream is required for classes 11 and 12' });
    }

    // Check if class already exists
    const existingClass = await SchoolClass.findOne({
      tenantId,
      classNumber: parseInt(classNumber),
      stream: stream || null,
      academicYear
    });

    if (existingClass) {
      return res.status(400).json({ 
        message: 'A class with this number, stream, and academic year already exists' 
      });
    }

    // Create the class
    const newClass = await SchoolClass.create({
      tenantId,
      orgId,
      classNumber: parseInt(classNumber),
      stream: stream || undefined,
      sections: sections.map(s => ({
        name: s.name,
        capacity: s.capacity || 40,
        currentStrength: 0,
        classTeacher: s.classTeacher || undefined
      })),
      subjects: subjects || [],
      academicYear,
      isActive: true
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'class_created',
      targetType: 'class',
      targetId: newClass._id,
      targetName: `Class ${classNumber}${stream ? ` - ${stream}` : ''}`,
      description: `New class created: Class ${classNumber}${stream ? ` - ${stream}` : ''} for ${academicYear}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      class: newClass
    });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add students to class
export const addStudentsToClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;
    const { studentIds, section } = req.body;

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: 'No students provided' });
    }

    // Get class details
    const classData = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Determine section - use provided or first available section
    const targetSection = section || classData.sections[0]?.name;
    if (!targetSection) {
      return res.status(400).json({ message: 'No sections available in this class' });
    }

    // Update students
    const updatePromises = studentIds.map(studentId =>
      SchoolStudent.findOneAndUpdate(
        { _id: studentId, tenantId },
        {
          classId: classId,
          grade: classData.classNumber,
          section: targetSection,
          academicYear: classData.academicYear
        },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Update section strength
    const sectionIndex = classData.sections.findIndex(s => s.name === targetSection);
    if (sectionIndex !== -1) {
      const currentCount = await SchoolStudent.countDocuments({
        tenantId,
        classId,
        section: targetSection
      });
      classData.sections[sectionIndex].currentStrength = currentCount;
      await classData.save();
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'students_added_to_class',
      targetType: 'class',
      targetId: classId,
      targetName: `Class ${classData.classNumber}`,
      description: `${studentIds.length} student(s) added to Class ${classData.classNumber} - Section ${targetSection}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `${studentIds.length} student(s) added successfully`
    });
  } catch (error) {
    console.error('Error adding students to class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;
    const updates = req.body;

    const classData = await SchoolClass.findOneAndUpdate(
      { _id: classId, tenantId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({
      success: true,
      message: 'Class updated successfully',
      class: classData
    });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;

    // Check if class has students
    const studentCount = await SchoolStudent.countDocuments({ tenantId, classId });
    if (studentCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete class with ${studentCount} student(s). Please reassign or remove students first.` 
      });
    }

    const classData = await SchoolClass.findOneAndDelete({ _id: classId, tenantId });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'class_deleted',
      targetType: 'class',
      targetId: classId,
      targetName: `Class ${classData.classNumber}`,
      description: `Class ${classData.classNumber}${classData.stream ? ` - ${classData.stream}` : ''} deleted`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students with filters
export const getStudentsWithFilters = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, grade, section, status } = req.query;

    const filter = { tenantId };
    if (section && section !== 'all') filter.section = section;

    // If filtering by grade, first find classes with that grade
    if (grade && grade !== 'all') {
      const classes = await SchoolClass.find({ 
        tenantId, 
        classNumber: parseInt(grade) 
      }).select('_id');
      
      if (classes.length > 0) {
        filter.classId = { $in: classes.map(c => c._id) };
      } else {
        // No classes found for this grade, return empty
        return res.json({
          success: true,
          students: [],
        });
      }
    } else if (classId && classId !== 'all') {
      filter.classId = classId;
    }

    const students = await SchoolStudent.find(filter)
      .populate('userId', 'name email lastActive')
      .populate('classId', 'classNumber stream')
      .limit(100)
      .sort({ createdAt: -1 }); // Show newest first

    let filteredStudents = students.map(s => ({
      ...s.toObject(),
      _id: s._id,
      name: s.userId?.name || 'N/A',
      email: s.userId?.email || 'N/A',
      rollNumber: s.rollNumber || 'N/A',
      section: s.section || 'A',
      grade: s.classId?.classNumber || 0,
      lastActive: s.userId?.lastActive || null,
      isActive: s.userId?.lastActive ? s.userId.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
      avgScore: Math.round(
        ((s.pillars?.uvls || 0) + (s.pillars?.dcos || 0) + (s.pillars?.moral || 0) + (s.pillars?.ehe || 0) + (s.pillars?.crgc || 0)) / 5
      ),
    }));

    if (status === 'active') {
      filteredStudents = filteredStudents.filter(s => s.isActive);
    } else if (status === 'inactive') {
      filteredStudents = filteredStudents.filter(s => !s.isActive);
    } else if (status === 'flagged') {
      filteredStudents = filteredStudents.filter(s => s.wellbeingFlags?.length > 0);
    }

    res.json({
      success: true,
      students: filteredStudents,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get admin student statistics
export const getAdminStudentStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [total, active, flagged] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      SchoolStudent.find({ tenantId }).populate('userId').then(students =>
        students.filter(s => s.userId?.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      ),
      SchoolStudent.countDocuments({ tenantId, 'wellbeingFlags.0': { $exists: true } }),
    ]);

    res.json({
      total,
      active,
      flagged,
      inactive: total - active,
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new student
export const createStudent = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, email, rollNumber, grade, section, phone, password, gender } = req.body;

    if (!name || !email || !rollNumber || !grade || !password || !gender) {
      return res.status(400).json({ message: 'Missing required fields: name, email, rollNumber, grade, gender, and password are required' });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if student with roll number already exists
    const existingStudent = await SchoolStudent.findOne({ tenantId, rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }

    // Generate admission number (unique)
    const currentYear = new Date().getFullYear();
    const admissionNumber = `ADM${currentYear}${Date.now().toString().slice(-6)}`;

    // Get current academic year
    const academicYear = `${currentYear}-${currentYear + 1}`;

    // Find or create a default class for this grade
    let classId;
    const existingClass = await SchoolClass.findOne({ 
      tenantId, 
      classNumber: parseInt(grade),
      academicYear 
    });

    if (existingClass) {
      classId = existingClass._id;
    } else {
      // Create a default class if it doesn't exist
      const newClass = await SchoolClass.create({
        tenantId,
        orgId,
        classNumber: parseInt(grade),
        sections: [{ name: section || 'A', capacity: 40, currentStrength: 0 }],
        subjects: [],
        academicYear,
        isActive: true
      });
      classId = newClass._id;
    }

    // Create user account with provided password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'school_student',
      tenantId,
      orgId,
      phone,
    });

    // Create a default parent user (placeholder)
    const parentEmail = `parent_${user._id}@temp.school`;
    const parentUser = await User.create({
      name: `Parent of ${name}`,
      email: parentEmail,
      password: hashedPassword,
      role: 'school_parent',
      tenantId,
      orgId,
      phone: phone || '',
    });

    // Create student profile
    const student = await SchoolStudent.create({
      tenantId,
      orgId,
      userId: user._id,
      admissionNumber,
      rollNumber,
      classId,
      section: section || 'A',
      academicYear,
      parentIds: [parentUser._id],
      personalInfo: {
        dateOfBirth: null,
        gender: gender || null,
        bloodGroup: null,
      },
      academicInfo: {
        admissionDate: new Date(),
        previousSchool: null,
        tcNumber: null,
        subjects: []
      },
      fees: {
        totalFees: 0,
        paidAmount: 0,
        pendingAmount: 0
      },
      attendance: {
        totalDays: 0,
        presentDays: 0,
        percentage: 0
      },
      isActive: true,
      wellbeingFlags: [],
      pillars: {
        uvls: 0,
        dcos: 0,
        moral: 0,
        ehe: 0,
        crgc: 0,
      },
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'student_created',
      targetType: 'student',
      targetId: student._id,
      targetName: name,
      description: `New student ${name} (${rollNumber}) added to Grade ${grade}-${section || 'A'}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      student: {
        _id: student._id,
        name,
        email,
        rollNumber,
        admissionNumber,
        grade: parseInt(grade),
        section: section || 'A',
        academicYear,
        gender
      },
      loginCredentials: {
        email,
        note: 'Student can now login using their email and the password provided'
      }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    console.error('Error details:', error.message);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset student password
export const resetStudentPassword = async (req, res) => {
  try {
    const { tenantId } = req;
    const { studentId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Find the student
    const student = await SchoolStudent.findOne({ _id: studentId, tenantId })
      .populate('userId', 'name email');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const userId = student.userId?._id;
    if (!userId) {
      return res.status(400).json({ message: 'No user account found for this student' });
    }

    // Hash new password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'password_changed',
      targetType: 'student',
      targetId: studentId,
      targetName: student.userId?.name || 'Unknown Student',
      description: `Password reset for student ${student.userId?.name} by admin`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { tenantId } = req;
    const { studentId } = req.params;

    // Find the student and populate user data
    const student = await SchoolStudent.findOne({ _id: studentId, tenantId })
      .populate('userId', 'name email');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentName = student.userId?.name || 'Unknown Student';
    const rollNumber = student.rollNumber;
    const userId = student.userId?._id;

    // Delete the student profile (using proper query with tenantId)
    await SchoolStudent.findOneAndDelete({ _id: studentId, tenantId });

    // Delete the associated user account
    if (userId) {
      await User.findByIdAndDelete(userId);
    }

    // Delete associated parent placeholder accounts
    if (student.parentIds && student.parentIds.length > 0) {
      for (const parentId of student.parentIds) {
        const parent = await User.findById(parentId);
        // Only delete if it's a placeholder parent (email contains @temp.school)
        if (parent && parent.email.includes('@temp.school')) {
          await User.findByIdAndDelete(parentId);
        }
      }
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'student_deleted',
      targetType: 'student',
      targetId: studentId,
      targetName: studentName,
      description: `Student ${studentName} (${rollNumber}) permanently deleted`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get individual student details (School Admin)
export const getSchoolStudentDetails = async (req, res) => {
  try {
    const { tenantId } = req;
    const { studentId } = req.params;

    const student = await SchoolStudent.findOne({ _id: studentId, tenantId })
      .populate('userId', 'name email phone lastActive')
      .populate('classId', 'name grade section');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentData = {
      ...student.toObject(),
      name: student.userId?.name || student.name,
      email: student.userId?.email || student.email,
      phone: student.userId?.phone || student.phone,
      lastActive: student.userId?.lastActive || student.lastActive,
      isActive: student.userId?.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      avgScore: Math.round(
        ((student.pillars?.uvls || 0) + (student.pillars?.dcos || 0) + (student.pillars?.moral || 0) + (student.pillars?.ehe || 0) + (student.pillars?.crgc || 0)) / 5
      ),
    };

    res.json({
      success: true,
      student: studentData,
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export students
export const exportStudents = async (req, res) => {
  try {
    const { tenantId } = req;
    const { format = 'csv', grade, section, status } = req.query;

    const filter = { tenantId };
    if (grade && grade !== 'all') filter.grade = parseInt(grade);
    if (section && section !== 'all') filter.section = section;

    const students = await SchoolStudent.find(filter)
      .populate('userId', 'name email lastActive')
      .sort({ grade: 1, section: 1, rollNumber: 1 });

    let filteredStudents = students.map(s => ({
      name: s.userId?.name || s.name,
      email: s.userId?.email || s.email,
      rollNumber: s.rollNumber,
      grade: s.grade,
      section: s.section,
      phone: s.phone,
      isActive: s.userId?.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      avgScore: Math.round(
        ((s.pillars?.uvls || 0) + (s.pillars?.dcos || 0) + (s.pillars?.moral || 0) + (s.pillars?.ehe || 0) + (s.pillars?.crgc || 0)) / 5
      ),
      attendance: s.attendance?.percentage || 0,
      lastActive: s.userId?.lastActive || s.lastActive,
    }));

    if (status === 'active') {
      filteredStudents = filteredStudents.filter(s => s.isActive);
    } else if (status === 'inactive') {
      filteredStudents = filteredStudents.filter(s => !s.isActive);
    } else if (status === 'flagged') {
      filteredStudents = filteredStudents.filter(s => s.wellbeingFlags?.length > 0);
    }

    if (format === 'csv') {
      const csvHeaders = 'Name,Email,Roll Number,Grade,Section,Phone,Avg Score,Attendance,Status,Last Active\n';
      const csvRows = filteredStudents.map(s =>
        [
          `"${s.name}"`,
          s.email,
          s.rollNumber,
          s.grade,
          s.section,
          s.phone || '',
          s.avgScore,
          s.attendance,
          s.isActive ? 'Active' : 'Inactive',
          s.lastActive ? new Date(s.lastActive).toLocaleDateString() : 'Never',
        ].join(',')
      ).join('\n');

      const csv = csvHeaders + csvRows;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=students-export-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        students: filteredStudents,
        count: filteredStudents.length,
      });
    }
  } catch (error) {
    console.error('Error exporting students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get engagement trend
export const getEngagementTrend = async (req, res) => {
  try {
    const { tenantId } = req;
    const { days = 7 } = req.query;

    const daysNum = parseInt(days);
    const trend = [];
    
    for (let i = daysNum - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const [studentCount, teacherCount] = await Promise.all([
        User.countDocuments({
          tenantId,
          role: { $in: ['student', 'school_student'] },
          lastActive: { $gte: date, $lt: nextDay }
        }),
        User.countDocuments({
          tenantId,
          role: 'school_teacher',
          lastActive: { $gte: date, $lt: nextDay }
        })
      ]);

      trend.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        students: studentCount,
        teachers: teacherCount
      });
    }

    res.json({
      success: true,
      trend
    });
  } catch (error) {
    console.error('Error fetching engagement trend:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get performance by grade
export const getPerformanceByGrade = async (req, res) => {
  try {
    const { tenantId } = req;

    const grades = await SchoolStudent.aggregate([
      { $match: { tenantId, isActive: true } },
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 },
          avgUvls: { $avg: '$pillars.uvls' },
          avgDcos: { $avg: '$pillars.dcos' },
          avgMoral: { $avg: '$pillars.moral' },
          avgEhe: { $avg: '$pillars.ehe' },
          avgCrgc: { $avg: '$pillars.crgc' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const gradesData = grades.map(g => ({
      grade: g._id,
      studentCount: g.count,
      avgScore: Math.round(
        ((g.avgUvls || 0) + (g.avgDcos || 0) + (g.avgMoral || 0) + (g.avgEhe || 0) + (g.avgCrgc || 0)) / 5
      ),
      pillars: {
        uvls: Math.round(g.avgUvls || 0),
        dcos: Math.round(g.avgDcos || 0),
        moral: Math.round(g.avgMoral || 0),
        ehe: Math.round(g.avgEhe || 0),
        crgc: Math.round(g.avgCrgc || 0)
      }
    }));

    res.json({
      success: true,
      grades: gradesData
    });
  } catch (error) {
    console.error('Error fetching performance by grade:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export analytics report
export const exportAnalyticsReport = async (req, res) => {
  try {
    const { tenantId } = req;
    const { campusId, grade, timeRange, format = 'csv' } = req.query;

    const filter = { tenantId, isActive: true };
    if (campusId && campusId !== 'all') filter.campusId = campusId;
    if (grade && grade !== 'all') filter.grade = parseInt(grade);

    // Fetch comprehensive analytics data
    const [students, pillarMastery, wellbeing, adoption, teachers] = await Promise.all([
      SchoolStudent.countDocuments(filter),
      SchoolStudent.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            avgUvls: { $avg: '$pillars.uvls' },
            avgDcos: { $avg: '$pillars.dcos' },
            avgMoral: { $avg: '$pillars.moral' },
            avgEhe: { $avg: '$pillars.ehe' },
            avgCrgc: { $avg: '$pillars.crgc' }
          }
        }
      ]),
      SchoolStudent.aggregate([
        { $match: filter },
        { $unwind: '$wellbeingFlags' },
        {
          $group: {
            _id: '$wellbeingFlags.status',
            count: { $sum: 1 }
          }
        }
      ]),
      SchoolStudent.find(filter).populate('userId').then(students =>
        students.filter(s => s.userId?.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      ),
      User.countDocuments({ tenantId, role: 'school_teacher' })
    ]);

    const pillars = pillarMastery[0] || {};
    const avgPillarScore = Math.round(
      ((pillars.avgUvls || 0) + (pillars.avgDcos || 0) + (pillars.avgMoral || 0) + 
       (pillars.avgEhe || 0) + (pillars.avgCrgc || 0)) / 5
    );

    if (format === 'csv') {
      const csv = `School Analytics Report
Generated: ${new Date().toLocaleString()}
Time Range: ${timeRange || 'All Time'}
${campusId && campusId !== 'all' ? `Campus ID: ${campusId}` : 'All Campuses'}
${grade && grade !== 'all' ? `Grade: ${grade}` : 'All Grades'}

SUMMARY METRICS
Total Students,${students}
Active Students (30 days),${adoption}
Student Adoption Rate,${students > 0 ? ((adoption / students) * 100).toFixed(2) : 0}%
Total Teachers,${teachers}
Average Pillar Mastery,${avgPillarScore}%

PILLAR BREAKDOWN
UVLS,${Math.round(pillars.avgUvls || 0)}%
DCOS,${Math.round(pillars.avgDcos || 0)}%
Moral,${Math.round(pillars.avgMoral || 0)}%
EHE,${Math.round(pillars.avgEhe || 0)}%
CRGC,${Math.round(pillars.avgCrgc || 0)}%

WELLBEING CASES
${wellbeing.map(w => `${w._id},${w.count}`).join('\n')}
`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-report-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        report: {
          generated: new Date(),
          timeRange: timeRange || 'All Time',
          filters: { campusId, grade },
          summary: {
            totalStudents: students,
            activeStudents: adoption,
            adoptionRate: students > 0 ? parseFloat(((adoption / students) * 100).toFixed(2)) : 0,
            totalTeachers: teachers,
            avgPillarMastery: avgPillarScore
          },
          pillars: {
            uvls: Math.round(pillars.avgUvls || 0),
            dcos: Math.round(pillars.avgDcos || 0),
            moral: Math.round(pillars.avgMoral || 0),
            ehe: Math.round(pillars.avgEhe || 0),
            crgc: Math.round(pillars.avgCrgc || 0)
          },
          wellbeing: wellbeing.reduce((acc, w) => {
            acc[w._id] = w.count;
            return acc;
          }, {})
        }
      });
    }
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get staff stats
export const getStaffStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [totalTeachers, activeToday, trainingData] = await Promise.all([
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      User.countDocuments({
        tenantId,
        role: 'school_teacher',
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      User.find({ tenantId, role: 'school_teacher' }),
    ]);

    const completedTraining = trainingData.filter(t =>
      t.trainingModules?.every(m => m.completed)
    ).length;

    res.json({
      totalTeachers,
      activeToday,
      trainingComplete: totalTeachers > 0 ? Math.round((completedTraining / totalTeachers) * 100) : 0,
      pendingReviews: 0,
      active: activeToday,
    });
  } catch (error) {
    console.error('Error fetching staff stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ENHANCED BILLING & SUBSCRIPTION MANAGEMENT =============

// 1. Get enhanced subscription details with all features
export const getEnhancedSubscriptionDetails = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    let subscription = await Subscription.findOne({ tenantId, orgId });

    // Create default trial subscription if not exists
    if (!subscription) {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);
      
      subscription = await Subscription.create({
        tenantId,
        orgId,
        plan: {
          name: 'trial',
          displayName: 'Trial Plan',
          price: 0,
          billingCycle: 'monthly',
        },
        limits: {
          maxStudents: 100,
          maxTeachers: 10,
          maxClasses: 10,
          maxCampuses: 1,
          maxStorage: 5,
          maxTemplates: 50,
          features: {
            advancedAnalytics: true, // Trial gets all features
            aiAssistant: true,
            customBranding: false,
            apiAccess: false,
            prioritySupport: false,
            whiteLabel: false,
            premiumTemplates: true,
          },
        },
        status: 'trial',
        trialEndDate,
        startDate: new Date(),
      });
    }

    // Get current usage
    const [students, teachers, classes, campuses, templates, activeStudents, premiumTemplatesCount] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      SchoolClass.countDocuments({ tenantId }),
      Organization.findOne({ _id: orgId, tenantId }).then(org => org?.campuses?.length || 1),
      Template.countDocuments({ tenantId }),
      SchoolStudent.find({ tenantId }).populate('userId').then(students => 
        students.filter(s => s.userId && s.userId.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      ),
      Template.countDocuments({ isPremium: true, isActive: true }),
    ]);

    subscription.usage = {
      students,
      teachers,
      classes,
      campuses,
      storage: 0,
      templates,
    };
    await subscription.save();

    // Calculate next billing date
    let nextBillingDate = null;
    if (subscription.status === 'active' && subscription.endDate) {
      nextBillingDate = subscription.endDate;
    } else if (subscription.status === 'trial' && subscription.trialEndDate) {
      nextBillingDate = subscription.trialEndDate;
    }

    // Get payment status
    const lastInvoice = subscription.invoices?.length > 0 
      ? subscription.invoices[subscription.invoices.length - 1]
      : null;

    // Calculate days remaining
    const daysRemaining = subscription.daysUntilExpiry();

    // Get available premium templates based on plan
    const availablePremiumTemplates = subscription.limits.features.premiumTemplates 
      ? premiumTemplatesCount 
      : 0;

    res.json({
      subscription,
      enhancedDetails: {
        planName: subscription.plan.displayName,
        planType: subscription.plan.name,
        price: subscription.plan.price,
        billingCycle: subscription.plan.billingCycle,
        status: subscription.status,
        nextBillingDate,
        daysRemaining,
        isTrial: subscription.status === 'trial',
        trialEndDate: subscription.trialEndDate,
        
        // Active counts
        activeStudentCount: activeStudents,
        totalStudentCount: students,
        activeTeacherCount: teachers,
        
        // Features
        features: subscription.limits.features,
        availablePremiumTemplates,
        
        // Usage percentages
        usagePercentages: {
          students: (students / subscription.limits.maxStudents * 100).toFixed(2),
          teachers: (teachers / subscription.limits.maxTeachers * 100).toFixed(2),
          classes: (classes / subscription.limits.maxClasses * 100).toFixed(2),
          campuses: (campuses / subscription.limits.maxCampuses * 100).toFixed(2),
          templates: (templates / subscription.limits.maxTemplates * 100).toFixed(2),
        },
        
        // Invoices
        invoices: subscription.invoices || [],
        lastPaymentStatus: lastInvoice?.status || 'none',
        lastPaymentDate: lastInvoice?.paidAt || null,
        lastPaymentAmount: lastInvoice?.amount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching enhanced subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Request trial extension
export const requestTrialExtension = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { requestedDays, reason } = req.body;

    const subscription = await Subscription.findOne({ tenantId, orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (subscription.status !== 'trial') {
      return res.status(400).json({ message: 'Trial extension only available for trial accounts' });
    }

    // Get current usage
    const currentUsage = {
      students: subscription.usage.students,
      teachers: subscription.usage.teachers,
      classes: subscription.usage.classes,
    };

    // Create support ticket for trial extension
    const ticket = await SupportTicket.create({
      tenantId,
      orgId,
      type: 'trial_extension',
      subject: `Trial Extension Request - ${requestedDays} days`,
      description: reason,
      priority: 'high',
      trialExtensionDetails: {
        currentTrialEndDate: subscription.trialEndDate,
        requestedExtensionDays: requestedDays,
        reason,
        currentUsage,
      },
      createdBy: req.user._id,
      creatorName: req.user.name,
      creatorEmail: req.user.email,
      approvalRequired: true,
      messages: [{
        sender: req.user._id,
        senderName: req.user.name,
        senderRole: req.user.role,
        message: `Trial extension request: ${reason}`,
        timestamp: new Date(),
      }],
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'trial_extension_requested',
      targetType: 'system',
      targetId: ticket._id,
      description: `Trial extension requested for ${requestedDays} days`,
      metadata: { ticketId: ticket.ticketId, requestedDays, reason },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Trial extension request submitted successfully',
      ticket,
    });
  } catch (error) {
    console.error('Error requesting trial extension:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get support tickets
export const getSupportTickets = async (req, res) => {
  try {
    const { tenantId } = req;
    const { status, type } = req.query;

    const filter = { tenantId };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const tickets = await SupportTicket.find(filter)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      pending: tickets.filter(t => t.approvalRequired && !t.approvedBy).length,
    };

    res.json({
      tickets,
      statistics: stats,
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Approve trial extension (admin action)
export const approveTrialExtension = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { tenantId } = req;
    const { extensionDays, comments } = req.body;

    const ticket = await SupportTicket.findOne({ _id: ticketId, tenantId, type: 'trial_extension' });
    if (!ticket) {
      return res.status(404).json({ message: 'Trial extension request not found' });
    }

    const subscription = await Subscription.findOne({ tenantId, orgId: ticket.orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Extend trial
    const currentEndDate = new Date(subscription.trialEndDate);
    currentEndDate.setDate(currentEndDate.getDate() + (extensionDays || ticket.trialExtensionDetails.requestedExtensionDays));
    subscription.trialEndDate = currentEndDate;
    await subscription.save();

    // Update ticket
    ticket.status = 'resolved';
    ticket.approvedBy = req.user._id;
    ticket.approvedAt = new Date();
    ticket.resolvedBy = req.user._id;
    ticket.resolvedAt = new Date();
    ticket.resolution = `Trial extended by ${extensionDays} days. ${comments || ''}`;
    ticket.messages.push({
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: `Trial extension approved. Extended by ${extensionDays} days. ${comments || ''}`,
      timestamp: new Date(),
      isInternal: false,
    });
    await ticket.save();

    // Send notification to requester
    await Notification.create({
      userId: ticket.createdBy,
      type: 'trial_extension_approved',
      title: 'Trial Extension Approved',
      message: `Your trial has been extended by ${extensionDays} days. New end date: ${currentEndDate.toLocaleDateString()}`,
      metadata: {
        ticketId: ticket.ticketId,
        extensionDays,
        newEndDate: currentEndDate,
      },
    });

    res.json({
      success: true,
      message: 'Trial extension approved',
      ticket,
      newTrialEndDate: currentEndDate,
    });
  } catch (error) {
    console.error('Error approving trial extension:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Get invoice details
export const getInvoiceDetails = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    const subscription = await Subscription.findOne({ tenantId, orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const invoice = subscription.invoices.find(inv => inv.invoiceId === invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const organization = await Organization.findById(orgId);

    res.json({
      invoice,
      organization: {
        name: organization.name,
        address: organization.settings?.address,
        contactInfo: organization.settings?.contactInfo,
      },
      subscription: {
        planName: subscription.plan.displayName,
        billingCycle: subscription.plan.billingCycle,
      },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Update payment method
export const updatePaymentMethod = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { paymentMethod } = req.body;

    const subscription = await Subscription.findOne({ tenantId, orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.paymentMethod = paymentMethod;
    await subscription.save();

    res.json({
      success: true,
      message: 'Payment method updated successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Get plan comparison
export const getPlanComparison = async (req, res) => {
  try {
    const plans = [
      {
        name: 'trial',
        displayName: 'Trial Plan',
        price: 0,
        duration: '30 days',
        limits: {
          maxStudents: 100,
          maxTeachers: 10,
          maxClasses: 10,
          maxCampuses: 1,
          maxStorage: 5,
          maxTemplates: 50,
        },
        features: {
          advancedAnalytics: true,
          aiAssistant: true,
          customBranding: false,
          apiAccess: false,
          prioritySupport: false,
          whiteLabel: false,
          premiumTemplates: true,
          nepTracking: true,
          complianceTools: true,
          escalationChains: true,
        },
      },
      {
        name: 'basic',
        displayName: 'Basic Plan',
        price: 4999,
        priceAnnual: 49990,
        limits: {
          maxStudents: 500,
          maxTeachers: 50,
          maxClasses: 50,
          maxCampuses: 2,
          maxStorage: 50,
          maxTemplates: 200,
        },
        features: {
          advancedAnalytics: true,
          aiAssistant: false,
          customBranding: false,
          apiAccess: false,
          prioritySupport: false,
          whiteLabel: false,
          premiumTemplates: true,
          nepTracking: true,
          complianceTools: true,
          escalationChains: true,
        },
      },
      {
        name: 'standard',
        displayName: 'Standard Plan',
        price: 14999,
        priceAnnual: 149990,
        limits: {
          maxStudents: 2000,
          maxTeachers: 200,
          maxClasses: 200,
          maxCampuses: 5,
          maxStorage: 200,
          maxTemplates: 500,
        },
        features: {
          advancedAnalytics: true,
          aiAssistant: true,
          customBranding: true,
          apiAccess: false,
          prioritySupport: true,
          whiteLabel: false,
          premiumTemplates: true,
          nepTracking: true,
          complianceTools: true,
          escalationChains: true,
        },
      },
      {
        name: 'premium',
        displayName: 'Premium Plan',
        price: 49999,
        priceAnnual: 499990,
        limits: {
          maxStudents: 10000,
          maxTeachers: 1000,
          maxClasses: 1000,
          maxCampuses: 20,
          maxStorage: 1000,
          maxTemplates: 2000,
        },
        features: {
          advancedAnalytics: true,
          aiAssistant: true,
          customBranding: true,
          apiAccess: true,
          prioritySupport: true,
          whiteLabel: false,
          premiumTemplates: true,
          nepTracking: true,
          complianceTools: true,
          escalationChains: true,
        },
      },
      {
        name: 'enterprise',
        displayName: 'Enterprise Plan',
        price: 0,
        priceText: 'Custom Pricing',
        limits: {
          maxStudents: -1,
          maxTeachers: -1,
          maxClasses: -1,
          maxCampuses: -1,
          maxStorage: -1,
          maxTemplates: -1,
        },
        features: {
          advancedAnalytics: true,
          aiAssistant: true,
          customBranding: true,
          apiAccess: true,
          prioritySupport: true,
          whiteLabel: true,
          premiumTemplates: true,
          nepTracking: true,
          complianceTools: true,
          escalationChains: true,
          dedicatedSupport: true,
          customIntegrations: true,
        },
      },
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plan comparison:', error);
    res.status(500).json({ message: 'Server error' });
  }
};