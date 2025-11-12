import JobApplication from '../models/JobApplication.js';
import JobOpening from '../models/JobOpening.js';
import fs from 'fs';

const jobApplicationSubscribers = new Set();

const sanitizeJobApplication = (application) => {
  if (!application) return null;

  return {
    id: application._id?.toString?.() || application._id,
    jobOpening: application.jobOpening?._id
      ? {
          id: application.jobOpening._id.toString(),
          title: application.jobOpening.title,
          department: application.jobOpening.department,
          location: application.jobOpening.location,
          employmentType: application.jobOpening.employmentType,
          workMode: application.jobOpening.workMode,
        }
      : application.jobOpening?.toString?.() || application.jobOpening,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    applicantPhone: application.applicantPhone,
    linkedinUrl: application.linkedinUrl,
    portfolioUrl: application.portfolioUrl,
    resumeUrl: application.resumeUrl,
    resumeFileName: application.resumeFileName,
    resumeMimeType: application.resumeMimeType,
    coverLetter: application.coverLetter,
    experienceYears: application.experienceYears,
    status: application.status,
    adminNotes: application.adminNotes,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  };
};

const sendJobApplicationEvent = (type, payload) => {
  const message = `data: ${JSON.stringify({ type, payload })}\n\n`;
  jobApplicationSubscribers.forEach((client) => {
    try {
      client.res.write(message);
    } catch (error) {
      console.error('Error broadcasting job application event:', error.message);
    }
  });
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.query;
    const query = jobId ? { jobOpening: jobId } : {};

    const applications = await JobApplication.find(query)
      .populate('jobOpening', 'title department location employmentType workMode')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications.map(sanitizeJobApplication),
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications',
    });
  }
};

export const streamJobApplications = async (req, res) => {
  try {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    res.flushHeaders?.();
    res.write('retry: 10000\n\n');

    const heartbeat = setInterval(() => {
      try {
        res.write(': heartbeat\n\n');
      } catch (error) {
        clearInterval(heartbeat);
      }
    }, 25000);

    const client = { id: Date.now(), res, heartbeat };
    jobApplicationSubscribers.add(client);

    req.on('close', () => {
      clearInterval(heartbeat);
      jobApplicationSubscribers.delete(client);
    });

    const applications = await JobApplication.find()
      .populate('jobOpening', 'title department location employmentType workMode')
      .sort({ createdAt: -1 })
      .limit(100);

    res.write(`data: ${JSON.stringify({
      type: 'job-application:init',
      payload: applications.map(sanitizeJobApplication),
    })}\n\n`);
  } catch (error) {
    console.error('Error establishing job applications stream:', error);
    res.end();
  }
};

export const submitJobApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      coverLetter,
      experienceYears,
    } = req.body;

    if (!applicantName || !applicantEmail) {
      return res.status(400).json({
        success: false,
        message: 'Applicant name and email are required.',
      });
    }

    const jobOpening = await JobOpening.findOne({
      _id: jobId,
      published: true,
      status: 'open',
    });

    if (!jobOpening) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found or not accepting applications.',
      });
    }

    const resumeUrlFromBody = resumeUrl?.trim();
    const resumeFileUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`
      : '';

    const finalResumeUrl = resumeFileUrl || resumeUrlFromBody;

    if (!finalResumeUrl) {
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        success: false,
        message: 'Please provide a resume link or upload a resume file.',
      });
    }

    const application = await JobApplication.create({
      jobOpening: jobOpening._id,
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      applicantPhone: applicantPhone?.trim(),
      linkedinUrl: linkedinUrl?.trim(),
      portfolioUrl: portfolioUrl?.trim(),
      resumeUrl: finalResumeUrl,
      resumeFileName: req.file?.originalname,
      resumeMimeType: req.file?.mimetype,
      coverLetter: coverLetter?.trim(),
      experienceYears: Number.isFinite(experienceYears)
        ? experienceYears
        : Number(experienceYears) || 0,
    });

    const populatedApplication = await application.populate('jobOpening', 'title department location employmentType workMode');
    const sanitized = sanitizeJobApplication(populatedApplication);

    sendJobApplicationEvent('job-application:new', sanitized);

    const io = req.app.get('io');
    if (io) {
      io.emit('admin:job-application:new', sanitized);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. We will contact you soon.',
      data: sanitized,
    });
  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
    console.error('Error submitting job application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
    });
  }
};

export const updateJobApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminNotes } = req.body;

    const application = await JobApplication.findById(applicationId).populate(
      'jobOpening',
      'title department location employmentType workMode'
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found',
      });
    }

    if (status) {
      application.status = status;
    }

    if (adminNotes !== undefined) {
      application.adminNotes = adminNotes;
    }

    await application.save();

    const sanitized = sanitizeJobApplication(application);
    sendJobApplicationEvent('job-application:update', sanitized);

    const io = req.app.get('io');
    if (io) {
      io.emit('admin:job-application:update', sanitized);
    }

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: sanitized,
    });
  } catch (error) {
    console.error('Error updating job application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
    });
  }
};

