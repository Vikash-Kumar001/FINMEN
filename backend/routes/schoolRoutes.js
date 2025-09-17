import express from 'express';
import {
  getSchoolStats,
  getSchoolActivities,
  getSchoolClasses,
  getSchoolStudents,
  getSchoolTeachers,
  getTeacherStats,
  getTeacherClasses,
  getTeacherAssignments,
  getTeacherTimetable,
  getStudentStats,
  getStudentAssignments,
  getStudentTimetable,
  getStudentGrades,
  getStudentAnnouncements,
  getParentChildren,
  getChildStats,
  getParentActivities,
  getParentFees,
  getParentAnnouncements,
  createSchoolStudent,
  createSchoolTeacher,
  createSchoolParent
} from '../controllers/schoolController.js';
import { extractTenant, enforceTenantIsolation } from '../middlewares/tenantMiddleware.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(extractTenant);
router.use(enforceTenantIsolation);

// School Admin Routes
router.get('/stats', requireAuth, getSchoolStats);
router.get('/activities', requireAuth, getSchoolActivities);
router.get('/classes', requireAuth, getSchoolClasses);
router.get('/students', requireAuth, getSchoolStudents);
router.get('/teachers', requireAuth, getSchoolTeachers);

// School Teacher Routes
router.get('/teacher/stats', requireAuth, getTeacherStats);
router.get('/teacher/classes', requireAuth, getTeacherClasses);
router.get('/teacher/assignments', requireAuth, getTeacherAssignments);
router.get('/teacher/timetable', requireAuth, getTeacherTimetable);

// School Student Routes
router.get('/student/stats', requireAuth, getStudentStats);
router.get('/student/assignments', requireAuth, getStudentAssignments);
router.get('/student/timetable', requireAuth, getStudentTimetable);
router.get('/student/grades', requireAuth, getStudentGrades);
router.get('/student/announcements', requireAuth, getStudentAnnouncements);

// School Parent Routes
router.get('/parent/children', requireAuth, getParentChildren);
router.get('/parent/child/:childId/stats', requireAuth, getChildStats);
router.get('/parent/activities', requireAuth, getParentActivities);
router.get('/parent/fees', requireAuth, getParentFees);
router.get('/parent/announcements', requireAuth, getParentAnnouncements);

// School Admin Creation Routes
router.post('/student', requireAuth, async (req, res, next) => {
  if (req.user.role !== 'school_admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  return createSchoolStudent(req, res, next);
});

router.post('/teacher', requireAuth, async (req, res, next) => {
  if (req.user.role !== 'school_admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  return createSchoolTeacher(req, res, next);
});

router.post('/parent', requireAuth, async (req, res, next) => {
  if (req.user.role !== 'school_admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  return createSchoolParent(req, res, next);
});

export default router;