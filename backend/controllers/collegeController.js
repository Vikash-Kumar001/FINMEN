import CollegeStudent from '../models/College/CollegeStudent.js';
import Department from '../models/College/Department.js';
import Course from '../models/College/Course.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// College Admin Dashboard Stats
export const getCollegeStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      totalFees,
      placementRate
    ] = await Promise.all([
      CollegeStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'college_faculty' }),
      Department.countDocuments({ tenantId }),
      Course.countDocuments({ tenantId }),
      CollegeStudent.aggregate([
        { $match: { tenantId } },
        { $group: { _id: null, total: { $sum: '$fees.totalFees' } } }
      ]),
      CollegeStudent.aggregate([
        { $match: { tenantId, 'placement.isPlaced': true } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ])
    ]);

    const totalStudentsCount = await CollegeStudent.countDocuments({ tenantId });
    const placementRateValue = totalStudentsCount > 0 ? 
      Math.round((placementRate[0]?.count || 0) / totalStudentsCount * 100) : 0;

    res.json({
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      totalFees: totalFees[0]?.total || 0,
      placementRate: placementRateValue
    });
  } catch (error) {
    console.error('Error fetching college stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// College Activities
export const getCollegeActivities = async (req, res) => {
  try {
    // Mock activities - in real app, this would come from ActivityLog model
    const activities = [
      {
        title: 'New student enrolled',
        description: 'John Doe enrolled in Computer Science Engineering',
        time: '2 hours ago'
      },
      {
        title: 'Placement drive completed',
        description: 'Microsoft placement drive - 15 students selected',
        time: '4 hours ago'
      },
      {
        title: 'Faculty meeting scheduled',
        description: 'Department meeting scheduled for tomorrow',
        time: '1 day ago'
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Error fetching college activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// College Departments
export const getCollegeDepartments = async (req, res) => {
  try {
    const { tenantId } = req;

    const departments = await Department.find({ tenantId })
      .populate('hod', 'name email')
      .select('name hod students faculty academicYear');

    const departmentsWithStats = departments.map(dept => ({
      name: dept.name,
      students: dept.students || 0,
      faculty: dept.faculty || 0,
      hod: dept.hod?.name || 'Not assigned',
      academicYear: dept.academicYear
    }));

    res.json(departmentsWithStats);
  } catch (error) {
    console.error('Error fetching college departments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// College Students
export const getCollegeStudents = async (req, res) => {
  try {
    const { tenantId } = req;

    const students = await CollegeStudent.find({ tenantId })
      .populate('userId', 'name email avatar')
      .populate('courseId', 'name code')
      .select('enrollmentNumber rollNumber year semester parentIds');

    const studentsWithDetails = students.map(student => ({
      id: student._id,
      name: student.userId.name,
      email: student.userId.email,
      avatar: student.userId.avatar,
      enrollmentNumber: student.enrollmentNumber,
      rollNumber: student.rollNumber,
      course: student.courseId.name,
      year: student.year,
      semester: student.semester
    }));

    res.json(studentsWithDetails);
  } catch (error) {
    console.error('Error fetching college students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// College Faculty
export const getCollegeFaculty = async (req, res) => {
  try {
    const { tenantId } = req;

    const faculty = await User.find({ tenantId, role: 'college_faculty' })
      .select('name email avatar phone department');

    res.json(faculty);
  } catch (error) {
    console.error('Error fetching college faculty:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// College Placement Stats
export const getCollegePlacementStats = async (req, res) => {
  try {
    const { tenantId } = req;

    // Mock data - in real app, this would come from Placement model
    const placementStats = {
      totalApplications: 150,
      placedStudents: 120,
      placementRate: 80,
      averagePackage: 8.5,
      topCompanies: ['Microsoft', 'Google', 'Amazon', 'TCS', 'Infosys']
    };

    res.json(placementStats);
  } catch (error) {
    console.error('Error fetching college placement stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Faculty Dashboard Stats
export const getFacultyStats = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const [
      totalStudents,
      totalCourses,
      averageAttendance,
      assignmentsGraded
    ] = await Promise.all([
      CollegeStudent.countDocuments({ 
        tenantId,
        courseId: { $in: user.assignedCourses || [] }
      }),
      Course.countDocuments({ 
        tenantId,
        'subjects.facultyId': user._id
      }),
      CollegeStudent.aggregate([
        { $match: { tenantId } },
        { $group: { _id: null, avg: { $avg: '$attendance.percentage' } } }
      ]),
      // Mock data - in real app, this would come from Assignment model
      35
    ]);

    res.json({
      totalStudents,
      totalCourses,
      averageAttendance: Math.round(averageAttendance[0]?.avg || 0),
      assignmentsGraded
    });
  } catch (error) {
    console.error('Error fetching faculty stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Faculty Courses
export const getFacultyCourses = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const courses = await Course.find({ 
      tenantId,
      'subjects.facultyId': user._id
    })
    .populate('departmentId', 'name')
    .select('name code type duration subjects');

    const coursesWithStats = courses.map(course => ({
      name: course.name,
      code: course.code,
      department: course.departmentId.name,
      students: course.currentStrength || 0,
      subjects: course.subjects.length
    }));

    res.json(coursesWithStats);
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Faculty Assignments
export const getFacultyAssignments = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Assignment model
    const assignments = [
      {
        title: 'Data Structures Assignment',
        course: 'CS201',
        dueDate: '2024-01-15',
        status: 'graded'
      },
      {
        title: 'Algorithm Design Project',
        course: 'CS301',
        dueDate: '2024-01-20',
        status: 'pending'
      },
      {
        title: 'Database Design Lab',
        course: 'CS401',
        dueDate: '2024-01-18',
        status: 'graded'
      }
    ];

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching faculty assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Faculty Timetable
export const getFacultyTimetable = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Timetable model
    const timetable = [
      {
        course: 'Data Structures',
        time: '09:00 AM',
        room: 'Lab 1'
      },
      {
        course: 'Algorithms',
        time: '10:30 AM',
        room: 'Room 201'
      },
      {
        course: 'Database Systems',
        time: '02:00 PM',
        room: 'Lab 2'
      }
    ];

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching faculty timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Faculty Research Projects
export const getFacultyResearchProjects = async (req, res) => {
  try {
    // Mock data - in real app, this would come from ResearchProject model
    const projects = [
      {
        title: 'Machine Learning in Healthcare',
        description: 'Research on applying ML algorithms in medical diagnosis',
        status: 'active',
        duration: '2 years'
      },
      {
        title: 'Blockchain Security',
        description: 'Study of security vulnerabilities in blockchain systems',
        status: 'completed',
        duration: '1 year'
      },
      {
        title: 'IoT Sensor Networks',
        description: 'Development of efficient sensor network protocols',
        status: 'active',
        duration: '3 years'
      }
    ];

    res.json(projects);
  } catch (error) {
    console.error('Error fetching faculty research projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Dashboard Stats
export const getStudentStats = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const student = await CollegeStudent.findOne({ 
      tenantId, 
      userId: user._id 
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      attendance: student.attendance?.percentage || 0,
      assignmentsCompleted: student.academicInfo?.assignmentsCompleted || 0,
      cgpa: student.academicInfo?.cgpa || 0,
      creditsEarned: student.academicInfo?.creditsEarned || 0
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Courses
export const getStudentCourses = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const student = await CollegeStudent.findOne({ 
      tenantId, 
      userId: user._id 
    }).populate('courseId', 'name code');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Mock data - in real app, this would come from Course model
    const courses = [
      {
        name: 'Data Structures',
        code: 'CS201',
        credits: 4,
        grade: 'A'
      },
      {
        name: 'Algorithms',
        code: 'CS301',
        credits: 3,
        grade: 'A-'
      },
      {
        name: 'Database Systems',
        code: 'CS401',
        credits: 4,
        grade: 'B+'
      }
    ];

    res.json(courses);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Assignments
export const getStudentAssignments = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Assignment model
    const assignments = [
      {
        title: 'Data Structures Assignment',
        course: 'CS201',
        dueDate: '2024-01-15',
        status: 'completed'
      },
      {
        title: 'Algorithm Design Project',
        course: 'CS301',
        dueDate: '2024-01-20',
        status: 'pending'
      },
      {
        title: 'Database Design Lab',
        course: 'CS401',
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
        course: 'Data Structures',
        time: '09:00 AM',
        faculty: 'Dr. Smith',
        room: 'Lab 1'
      },
      {
        course: 'Algorithms',
        time: '10:30 AM',
        faculty: 'Prof. Johnson',
        room: 'Room 201'
      },
      {
        course: 'Database Systems',
        time: '02:00 PM',
        faculty: 'Dr. Brown',
        room: 'Lab 2'
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
        course: 'Data Structures',
        assignment: 'Mid-term Exam',
        score: 85
      },
      {
        course: 'Algorithms',
        assignment: 'Project Submission',
        score: 92
      },
      {
        course: 'Database Systems',
        assignment: 'Lab Assignment',
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
        title: 'Exam Schedule Released',
        message: 'Mid-term exam schedule has been released. Check the notice board.',
        date: '2024-01-20'
      },
      {
        title: 'Placement Drive',
        message: 'Microsoft placement drive on January 25th. Register by January 23rd.',
        date: '2024-01-18'
      }
    ];

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching student announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Placement Info
export const getStudentPlacementInfo = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Placement model
    const placementInfo = {
      upcomingCompanies: 8,
      placementRate: 85,
      averagePackage: 8.5
    };

    res.json(placementInfo);
  } catch (error) {
    console.error('Error fetching student placement info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Dashboard - Get Children
export const getParentChildren = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const children = await CollegeStudent.find({ 
      tenantId,
      parentIds: user._id
    })
    .populate('userId', 'name email avatar')
    .populate('courseId', 'name code')
    .select('enrollmentNumber rollNumber year semester parentIds');

    const childrenWithDetails = children.map(child => ({
      id: child._id,
      name: child.userId.name,
      email: child.userId.email,
      avatar: child.userId.avatar,
      course: child.courseId.name,
      year: child.year,
      semester: child.semester
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

    const child = await CollegeStudent.findOne({ 
      tenantId, 
      _id: childId 
    });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json({
      cgpa: child.academicInfo?.cgpa || 0,
      attendance: child.attendance?.percentage || 0,
      creditsEarned: child.academicInfo?.creditsEarned || 0,
      assignmentsCompleted: child.academicInfo?.assignmentsCompleted || 0
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
        description: 'Data Structures assignment submitted by John',
        time: '2 hours ago'
      },
      {
        title: 'Attendance marked',
        description: 'Present in all classes today',
        time: '4 hours ago'
      },
      {
        title: 'Grade received',
        description: 'Algorithms project - 92%',
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
        description: 'Tuition Fee - Semester 1',
        amount: 25000,
        dueDate: '2024-01-31',
        status: 'paid'
      },
      {
        description: 'Hostel Fee - Semester 1',
        amount: 15000,
        dueDate: '2024-01-31',
        status: 'pending'
      },
      {
        description: 'Library Fee - Semester 1',
        amount: 2000,
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
        message: 'PTM scheduled for Computer Science Department on January 25th at 2 PM',
        date: '2024-01-20'
      },
      {
        title: 'Fee Payment Reminder',
        message: 'Please pay the pending semester fees before the due date',
        date: '2024-01-18'
      }
    ];

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching parent announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Placement Info
export const getParentPlacementInfo = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Placement model
    const placementInfo = {
      upcomingCompanies: 8,
      placementRate: 85,
      averagePackage: 8.5
    };

    res.json(placementInfo);
  } catch (error) {
    console.error('Error fetching parent placement info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};