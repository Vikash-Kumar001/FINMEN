import JobOpening from '../models/JobOpening.js';

const jobOpeningSubscribers = new Set();

const sanitizeJobOpening = (opening, forPublic = false) => {
  if (!opening) return null;
  const base = {
    id: opening._id?.toString?.() || opening._id,
    title: opening.title,
    department: opening.department,
    location: opening.location,
    employmentType: opening.employmentType,
    workMode: opening.workMode,
    description: opening.description,
    requirements: opening.requirements || [],
    responsibilities: opening.responsibilities || [],
    status: opening.status,
    statusMessage: opening.statusMessage,
    applyUrl: opening.applyUrl,
    published: opening.published,
    displayOrder: opening.displayOrder,
    createdAt: opening.createdAt,
    updatedAt: opening.updatedAt,
  };

  if (!forPublic) {
    return {
      ...base,
      createdBy: opening.createdBy?.toString?.() || opening.createdBy,
      updatedBy: opening.updatedBy?.toString?.() || opening.updatedBy,
    };
  }

  return base;
};

const parseListField = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [];
};

const streamHeartbeatInterval = 25000;

const broadcastJobOpeningsUpdate = async (app) => {
  const openings = await JobOpening.find({ published: true })
    .sort({ status: 1, displayOrder: 1, createdAt: -1 })
    .lean();

  const sanitized = openings.map((opening) => sanitizeJobOpening(opening, true));
  const payload = `data: ${JSON.stringify(sanitized)}\n\n`;

  jobOpeningSubscribers.forEach((client) => {
    try {
      client.res.write(payload);
    } catch (error) {
      console.error('Error broadcasting job openings update:', error.message);
    }
  });

  const io = app.get('io');
  if (io) {
    io.to('careers-public').emit('careers:openings:update', sanitized);
  }

  return sanitized;
};

export const getPublicJobOpenings = async (_req, res) => {
  try {
    const openings = await JobOpening.find({ published: true })
      .sort({ status: 1, displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      data: openings.map((opening) => sanitizeJobOpening(opening, true)),
    });
  } catch (error) {
    console.error('Error fetching public job openings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job openings',
    });
  }
};

export const getPublicJobOpening = async (req, res) => {
  try {
    const { jobId } = req.params;
    const opening = await JobOpening.findOne({ _id: jobId, published: true });

    if (!opening) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found',
      });
    }

    res.json({
      success: true,
      data: sanitizeJobOpening(opening, true),
    });
  } catch (error) {
    console.error('Error fetching job opening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job opening',
    });
  }
};

export const streamJobOpenings = async (req, res) => {
  try {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    res.flushHeaders?.();
    res.write('retry: 10000\n\n');

    const client = {
      id: Date.now(),
      res,
    };

    const heartbeat = setInterval(() => {
      try {
        res.write(': heartbeat\n\n');
      } catch (error) {
        clearInterval(heartbeat);
      }
    }, streamHeartbeatInterval);

    client.heartbeat = heartbeat;
    jobOpeningSubscribers.add(client);

    req.on('close', () => {
      clearInterval(heartbeat);
      jobOpeningSubscribers.delete(client);
    });

    const openings = await JobOpening.find({ published: true })
      .sort({ status: 1, displayOrder: 1, createdAt: -1 })
      .lean();

    res.write(`data: ${JSON.stringify(openings.map((opening) => sanitizeJobOpening(opening, true)))}\n\n`);
  } catch (error) {
    console.error('Error establishing job openings stream:', error);
    res.end();
  }
};

export const getAdminJobOpenings = async (_req, res) => {
  try {
    const openings = await JobOpening.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: openings.map((opening) => sanitizeJobOpening(opening, false)),
    });
  } catch (error) {
    console.error('Error fetching admin job openings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job openings',
    });
  }
};

export const createJobOpening = async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      workMode,
      description,
      requirements,
      responsibilities,
      status,
      statusMessage,
      applyUrl,
      published,
      displayOrder,
    } = req.body;

    if (!title || !department || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, department, location, and description are required.',
      });
    }

    const jobOpening = await JobOpening.create({
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      employmentType: employmentType?.trim() || 'Full-time',
      workMode: workMode?.trim() || 'Onsite',
      description: description.trim(),
      requirements: parseListField(requirements),
      responsibilities: parseListField(responsibilities),
      status: status === 'closed' ? 'closed' : 'open',
      statusMessage: statusMessage?.trim(),
      applyUrl: applyUrl?.trim(),
      published: typeof published === 'boolean' ? published : true,
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    await broadcastJobOpeningsUpdate(req.app);

    res.status(201).json({
      success: true,
      message: 'Job opening created successfully',
      data: sanitizeJobOpening(jobOpening, false),
    });
  } catch (error) {
    console.error('Error creating job opening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job opening',
    });
  }
};

export const updateJobOpening = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      title,
      department,
      location,
      employmentType,
      workMode,
      description,
      requirements,
      responsibilities,
      status,
      statusMessage,
      applyUrl,
      published,
      displayOrder,
    } = req.body;

    const jobOpening = await JobOpening.findById(jobId);

    if (!jobOpening) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found',
      });
    }

    if (title) jobOpening.title = title.trim();
    if (department) jobOpening.department = department.trim();
    if (location) jobOpening.location = location.trim();
    if (employmentType) jobOpening.employmentType = employmentType.trim();
    if (workMode) jobOpening.workMode = workMode.trim();
    if (description) jobOpening.description = description.trim();
    if (requirements !== undefined) jobOpening.requirements = parseListField(requirements);
    if (responsibilities !== undefined) jobOpening.responsibilities = parseListField(responsibilities);
    if (status) jobOpening.status = status === 'closed' ? 'closed' : 'open';

    jobOpening.statusMessage = statusMessage?.trim() || '';
    jobOpening.applyUrl = applyUrl?.trim() || '';

    if (published !== undefined) jobOpening.published = !!published;
    if (displayOrder !== undefined) {
      jobOpening.displayOrder = Number.isFinite(displayOrder) ? displayOrder : Number(displayOrder) || 0;
    }

    jobOpening.updatedBy = req.user?._id;

    await jobOpening.save();
    await broadcastJobOpeningsUpdate(req.app);

    res.json({
      success: true,
      message: 'Job opening updated successfully',
      data: sanitizeJobOpening(jobOpening, false),
    });
  } catch (error) {
    console.error('Error updating job opening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job opening',
    });
  }
};

export const deleteJobOpening = async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobOpening = await JobOpening.findById(jobId);

    if (!jobOpening) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found',
      });
    }

    await JobOpening.deleteOne({ _id: jobId });
    await broadcastJobOpeningsUpdate(req.app);

    res.json({
      success: true,
      message: 'Job opening deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job opening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job opening',
    });
  }
};

export const reorderJobOpenings = async (req, res) => {
  try {
    const { ordering } = req.body;

    if (!Array.isArray(ordering)) {
      return res.status(400).json({
        success: false,
        message: 'Ordering must be an array of job opening IDs',
      });
    }

    const updates = ordering.map((jobId, index) =>
      JobOpening.updateOne(
        { _id: jobId },
        { displayOrder: index, updatedBy: req.user?._id }
      )
    );

    await Promise.all(updates);
    await broadcastJobOpeningsUpdate(req.app);

    res.json({
      success: true,
      message: 'Job openings reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering job openings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder job openings',
    });
  }
};

