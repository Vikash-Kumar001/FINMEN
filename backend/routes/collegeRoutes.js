import express from 'express';
import {
  getCollegeStats,
  getCollegeActivities,
  getCollegeDepartments,
  getCollegeStudents,
  getCollegeFaculty,
  getCollegePlacementStats,
  getFacultyStats,
  getFacultyCourses,
  getFacultyAssignments,
  getFacultyTimetable,
  getFacultyResearchProjects,
  getStudentStats,
  getStudentCourses,
  getStudentAssignments,
  getStudentTimetable,
  getStudentGrades,
  getStudentAnnouncements,
  getStudentPlacementInfo,
  getParentChildren,
  getChildStats,
  getParentActivities,
  getParentFees,
  getParentAnnouncements,
  getParentPlacementInfo
} from '../controllers/collegeController.js';
import { extractTenant, enforceTenantIsolation } from '../middlewares/tenantMiddleware.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(extractTenant);
router.use(enforceTenantIsolation);

// College Admin Routes
router.get('/admin/stats', requireAuth, getCollegeStats);
router.get('/admin/activities', requireAuth, getCollegeActivities);
router.get('/admin/departments', requireAuth, getCollegeDepartments);
router.get('/admin/students', requireAuth, getCollegeStudents);
router.get('/admin/faculty', requireAuth, getCollegeFaculty);
router.get('/admin/placement-stats', requireAuth, getCollegePlacementStats);

// College Faculty Routes
router.get('/faculty/stats', requireAuth, getFacultyStats);
router.get('/faculty/courses', requireAuth, getFacultyCourses);
router.get('/faculty/assignments', requireAuth, getFacultyAssignments);
router.get('/faculty/timetable', requireAuth, getFacultyTimetable);
router.get('/faculty/research-projects', requireAuth, getFacultyResearchProjects);

// College Student Routes
router.get('/student/stats', requireAuth, getStudentStats);
router.get('/student/courses', requireAuth, getStudentCourses);
router.get('/student/assignments', requireAuth, getStudentAssignments);
router.get('/student/timetable', requireAuth, getStudentTimetable);
router.get('/student/grades', requireAuth, getStudentGrades);
router.get('/student/announcements', requireAuth, getStudentAnnouncements);
router.get('/student/placement-info', requireAuth, getStudentPlacementInfo);

// College Parent Routes
router.get('/parent/children', requireAuth, getParentChildren);
router.get('/parent/child/:childId/stats', requireAuth, getChildStats);
router.get('/parent/activities', requireAuth, getParentActivities);
router.get('/parent/fees', requireAuth, getParentFees);
router.get('/parent/announcements', requireAuth, getParentAnnouncements);
router.get('/parent/placement-info', requireAuth, getParentPlacementInfo);

export default router;