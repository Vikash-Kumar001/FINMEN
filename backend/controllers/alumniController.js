import Alumni from "../models/Alumni.js";
import AlumniEvent from "../models/AlumniEvent.js";
import CollegeStudent from "../models/College/CollegeStudent.js";
import User from "../models/User.js";
import { getTenantQuery, addTenantData } from "../middlewares/tenantMiddleware.js";

// Alumni Profile Management
export const createAlumniProfile = async (req, res) => {
  try {
    const {
      studentId,
      graduationYear,
      degree,
      department,
      cgpa,
      currentEmployment,
      contactInfo,
      networkParticipation,
    } = req.body;

    if (!studentId || !graduationYear || !degree || !department) {
      return res.status(400).json({
        message: "Student ID, graduation year, degree, and department are required",
      });
    }

    // Verify student exists
    const student = await CollegeStudent.findOne(
      getTenantQuery(req, { _id: studentId })
    ).populate('userId', 'name email');

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if alumni profile already exists
    const existingAlumni = await Alumni.findOne(
      getTenantQuery(req, { studentId })
    );

    if (existingAlumni) {
      return res.status(400).json({
        message: "Alumni profile already exists for this student",
      });
    }

    const alumniData = addTenantData(req, {
      userId: student.userId._id,
      studentId,
      graduationYear,
      degree,
      department,
      cgpa: cgpa || student.academicInfo.cgpa,
      currentEmployment: currentEmployment || {},
      contactInfo: {
        email: student.userId.email,
        ...contactInfo,
      },
      networkParticipation: networkParticipation || {},
    });

    const alumni = await Alumni.create(alumniData);
    
    // Calculate initial profile completeness
    alumni.calculateProfileCompleteness();
    await alumni.save();

    await alumni.populate('userId', 'name email');

    res.status(201).json({
      message: "Alumni profile created successfully",
      alumni,
    });
  } catch (error) {
    console.error("Create alumni profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAlumniProfiles = async (req, res) => {
  try {
    const {
      graduationYear,
      department,
      company,
      industry,
      isActive,
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const query = getTenantQuery(req, { isActive: true });

    // Apply filters
    if (graduationYear) query.graduationYear = graduationYear;
    if (department) query.department = department;
    if (company) query["currentEmployment.companyName"] = new RegExp(company, "i");
    if (industry) query["currentEmployment.industry"] = industry;
    if (isActive !== undefined) query["networkParticipation.isActive"] = isActive === "true";

    let alumniQuery = Alumni.find(query)
      .populate('userId', 'name email')
      .populate('studentId', 'rollNumber')
      .sort({ graduationYear: -1, "userId.name": 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Apply search if provided
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const userIds = await User.find({
        name: searchRegex,
      }).distinct('_id');

      query.$or = [
        { userId: { $in: userIds } },
        { "currentEmployment.companyName": searchRegex },
        { department: searchRegex },
      ];
    }

    const alumni = await alumniQuery.exec();
    const total = await Alumni.countDocuments(query);

    res.status(200).json({
      alumni,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get alumni profiles error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAlumniProfile = async (req, res) => {
  try {
    const { alumniId } = req.params;

    const alumni = await Alumni.findOne(
      getTenantQuery(req, { _id: alumniId })
    )
      .populate('userId', 'name email')
      .populate('studentId', 'rollNumber academicInfo')
      .populate('social.connections.alumniId', 'userId graduationYear department');

    if (!alumni) {
      return res.status(404).json({ message: "Alumni profile not found" });
    }

    res.status(200).json({ alumni });
  } catch (error) {
    console.error("Get alumni profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAlumniProfile = async (req, res) => {
  try {
    const { alumniId } = req.params;
    const updateData = req.body;

    const alumni = await Alumni.findOne(
      getTenantQuery(req, { _id: alumniId })
    );

    if (!alumni) {
      return res.status(404).json({ message: "Alumni profile not found" });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        alumni[key] = updateData[key];
      }
    });

    // Recalculate profile completeness
    alumni.calculateProfileCompleteness();
    await alumni.save();

    await alumni.populate('userId', 'name email');

    res.status(200).json({
      message: "Alumni profile updated successfully",
      alumni,
    });
  } catch (error) {
    console.error("Update alumni profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Alumni Events Management
export const createAlumniEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      schedule,
      location,
      organizer,
      registration,
      agenda,
    } = req.body;

    if (!title || !description || !eventType || !schedule) {
      return res.status(400).json({
        message: "Title, description, event type, and schedule are required",
      });
    }

    const eventData = addTenantData(req, {
      title,
      description,
      eventType,
      schedule,
      location: location || {},
      organizer: {
        userId: req.user.id,
        name: req.user.name,
        email: req.user.email,
        ...organizer,
      },
      registration: registration || {},
      agenda: agenda || [],
      createdBy: req.user.id,
    });

    const event = await AlumniEvent.create(eventData);

    res.status(201).json({
      message: "Alumni event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create alumni event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAlumniEvents = async (req, res) => {
  try {
    const {
      eventType,
      status,
      upcoming,
      page = 1,
      limit = 20,
    } = req.query;

    const query = getTenantQuery(req, { isActive: true });

    if (eventType) query.eventType = eventType;
    if (status) query.status = status;
    if (upcoming === "true") {
      query["schedule.startDate"] = { $gte: new Date() };
    }

    const events = await AlumniEvent.find(query)
      .populate('organizer.userId', 'name email')
      .populate('attendees.userId', 'name email')
      .sort({ "schedule.startDate": upcoming === "true" ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AlumniEvent.countDocuments(query);

    res.status(200).json({
      events,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get alumni events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { registrationData } = req.body;

    const event = await AlumniEvent.findOne(
      getTenantQuery(req, { _id: eventId })
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.isRegistrationOpen()) {
      return res.status(400).json({ message: "Registration is closed for this event" });
    }

    // Check if user is already registered
    const existingRegistration = event.attendees.find(
      attendee => attendee.userId.toString() === req.user.id
    );

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Find alumni profile
    const alumni = await Alumni.findOne(
      getTenantQuery(req, { userId: req.user.id })
    );

    // Add attendee
    event.attendees.push({
      userId: req.user.id,
      alumniId: alumni?._id,
      registrationData: registrationData || {},
      paymentStatus: event.registration.fees.paymentRequired ? "pending" : "completed",
    });

    event.analytics.registrations += 1;
    await event.save();

    res.status(200).json({
      message: "Successfully registered for the event",
      registration: event.attendees[event.attendees.length - 1],
    });
  } catch (error) {
    console.error("Register for event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Alumni Network Features
export const getAlumniConnections = async (req, res) => {
  try {
    const { alumniId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const alumni = await Alumni.findOne(
      getTenantQuery(req, { _id: alumniId })
    )
      .populate({
        path: 'social.connections.alumniId',
        populate: {
          path: 'userId',
          select: 'name email',
        },
        select: 'userId graduationYear department currentEmployment',
      })
      .select('social.connections');

    if (!alumni) {
      return res.status(404).json({ message: "Alumni profile not found" });
    }

    const connections = alumni.social.connections
      .filter(conn => conn.status === 'accepted')
      .slice((page - 1) * limit, page * limit);

    res.status(200).json({
      connections,
      pagination: {
        current: page,
        pages: Math.ceil(alumni.social.connections.length / limit),
        total: alumni.social.connections.length,
      },
    });
  } catch (error) {
    console.error("Get alumni connections error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { targetAlumniId } = req.params;

    const [senderAlumni, targetAlumni] = await Promise.all([
      Alumni.findOne(getTenantQuery(req, { userId: req.user.id })),
      Alumni.findOne(getTenantQuery(req, { _id: targetAlumniId })),
    ]);

    if (!senderAlumni || !targetAlumni) {
      return res.status(404).json({ message: "Alumni profile not found" });
    }

    // Check if connection already exists
    const existingConnection = senderAlumni.social.connections.find(
      conn => conn.alumniId.toString() === targetAlumniId
    );

    if (existingConnection) {
      return res.status(400).json({ message: "Connection already exists" });
    }

    // Add connection to both profiles
    senderAlumni.social.connections.push({
      alumniId: targetAlumniId,
      status: 'accepted', // Auto-accept for now
    });

    targetAlumni.social.connections.push({
      alumniId: senderAlumni._id,
      status: 'accepted',
    });

    await Promise.all([senderAlumni.save(), targetAlumni.save()]);

    res.status(200).json({
      message: "Connection request sent successfully",
    });
  } catch (error) {
    console.error("Send connection request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Alumni Analytics
export const getAlumniAnalytics = async (req, res) => {
  try {
    const [alumniStats, eventStats] = await Promise.all([
      Alumni.getAlumniStats(req.organization._id, req.organization.tenantId),
      AlumniEvent.getEventStats(req.organization._id, req.organization.tenantId),
    ]);

    // Department-wise distribution
    const departmentStats = await Alumni.aggregate([
      {
        $match: getTenantQuery(req, { isActive: true }),
      },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          avgSalary: { $avg: "$currentEmployment.salary.amount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Graduation year distribution
    const yearStats = await Alumni.aggregate([
      {
        $match: getTenantQuery(req, { isActive: true }),
      },
      {
        $group: {
          _id: "$graduationYear",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Industry distribution
    const industryStats = await Alumni.aggregate([
      {
        $match: getTenantQuery(req, { isActive: true }),
      },
      {
        $group: {
          _id: "$currentEmployment.industry",
          count: { $sum: 1 },
          avgSalary: { $avg: "$currentEmployment.salary.amount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      analytics: {
        alumni: alumniStats,
        events: eventStats,
        departmentDistribution: departmentStats,
        graduationYearDistribution: yearStats,
        industryDistribution: industryStats,
      },
    });
  } catch (error) {
    console.error("Get alumni analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Alumni Directory Search
export const searchAlumniDirectory = async (req, res) => {
  try {
    const {
      search,
      department,
      graduationYear,
      company,
      industry,
      location,
      skills,
      page = 1,
      limit = 20,
    } = req.query;

    const query = getTenantQuery(req, { 
      isActive: true,
      "privacy.profileVisibility": { $in: ["public", "alumni_only"] },
    });

    // Apply filters
    if (department) query.department = department;
    if (graduationYear) query.graduationYear = graduationYear;
    if (company) query["currentEmployment.companyName"] = new RegExp(company, "i");
    if (industry) query["currentEmployment.industry"] = industry;
    if (location) {
      query.$or = [
        { "currentEmployment.workLocation.city": new RegExp(location, "i") },
        { "currentEmployment.workLocation.state": new RegExp(location, "i") },
        { "currentEmployment.workLocation.country": new RegExp(location, "i") },
      ];
    }

    // Text search
    if (search) {
      const userIds = await User.find({
        name: new RegExp(search, "i"),
      }).distinct('_id');

      query.$or = [
        { userId: { $in: userIds } },
        { "currentEmployment.companyName": new RegExp(search, "i") },
        { "currentEmployment.position": new RegExp(search, "i") },
        { department: new RegExp(search, "i") },
      ];
    }

    const alumni = await Alumni.find(query)
      .populate('userId', 'name email')
      .select('userId graduationYear department currentEmployment contactInfo social.profilePicture achievements')
      .sort({ graduationYear: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Alumni.countDocuments(query);

    res.status(200).json({
      alumni,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Search alumni directory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};