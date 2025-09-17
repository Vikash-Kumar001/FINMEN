import SchoolStudent from '../models/School/SchoolStudent.js';
import SchoolClass from '../models/School/SchoolClass.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
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

    const teachers = await User.find({ tenantId, role: 'school_teacher' })
      .select('name email avatar phone');

    res.json(teachers);
  } catch (error) {
    console.error('Error fetching school teachers:', error);
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
    const { tenantId, user } = req;

    const classes = await SchoolClass.find({ 
      tenantId,
      'sections.classTeacher': user._id
    })
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
    console.error('Error fetching teacher classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher Assignments
export const getTeacherAssignments = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Assignment model
    const assignments = [
      {
        title: 'Math Homework - Algebra',
        class: 'Class 10A',
        dueDate: '2024-01-15',
        status: 'graded'
      },
      {
        title: 'Science Project - Photosynthesis',
        class: 'Class 9B',
        dueDate: '2024-01-20',
        status: 'pending'
      },
      {
        title: 'English Essay - Climate Change',
        class: 'Class 8A',
        dueDate: '2024-01-18',
        status: 'graded'
      }
    ];

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher Timetable
export const getTeacherTimetable = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Timetable model
    const timetable = [
      {
        subject: 'Mathematics',
        class: 'Class 10A',
        time: '09:00 AM',
        room: 'Room 101'
      },
      {
        subject: 'Science',
        class: 'Class 9B',
        time: '10:30 AM',
        room: 'Lab 2'
      },
      {
        subject: 'Mathematics',
        class: 'Class 8A',
        time: '02:00 PM',
        room: 'Room 102'
      }
    ];

    res.json(timetable);
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