import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getPublicJobOpenings,
  getPublicJobOpening,
  streamJobOpenings,
} from '../controllers/jobOpeningController.js';
import {
  submitJobApplication,
} from '../controllers/jobApplicationController.js';

const router = express.Router();

const resumesDir = path.resolve('uploads/resumes');

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(resumesDir, { recursive: true });
    cb(null, resumesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '';
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const allowedResumeMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/rtf',
  'text/plain',
  'application/vnd.oasis.opendocument.text',
];

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedResumeMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF or Word documents are allowed.'));
    }
  },
});

const resumeUploadMiddleware = (req, res, next) => {
  resumeUpload.single('resumeFile')(req, res, (err) => {
    if (err) {
      console.error('Resume upload error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload resume file.',
      });
    }
    next();
  });
};

router.get('/openings', getPublicJobOpenings);
router.get('/openings/stream', streamJobOpenings);
router.get('/openings/:jobId', getPublicJobOpening);
router.post('/openings/:jobId/apply', resumeUploadMiddleware, submitJobApplication);

export default router;
