import PlacementCompany from "../models/College/PlacementCompany.js";
import PlacementApplication from "../models/College/PlacementApplication.js";
import CollegeStudent from "../models/College/CollegeStudent.js";
import User from "../models/User.js";
import { getTenantQuery, addTenantData } from "../middlewares/tenantMiddleware.js";

// Company Management
export const addPlacementCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyType,
      industry,
      companySize,
      contactDetails,
      jobRoles,
      eligibilityCriteria,
      visitDetails,
    } = req.body;

    if (!companyName || !companyType || !industry || !contactDetails?.hrEmail) {
      return res.status(400).json({ 
        message: "Company name, type, industry, and HR email are required" 
      });
    }

    // Check if company already exists
    const existingCompany = await PlacementCompany.findOne(
      getTenantQuery(req, { companyName })
    );

    if (existingCompany) {
      return res.status(400).json({ 
        message: "Company already exists" 
      });
    }

    const companyData = addTenantData(req, {
      companyName,
      companyType,
      industry,
      companySize,
      contactDetails,
      jobRoles: jobRoles || [],
      eligibilityCriteria: eligibilityCriteria || {},
      visitDetails: visitDetails || {},
    });

    const company = await PlacementCompany.create(companyData);

    res.status(201).json({
      message: "Placement company added successfully",
      company,
    });
  } catch (error) {
    console.error("Add placement company error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlacementCompanies = async (req, res) => {
  try {
    const { status, industry, companyType, page = 1, limit = 20 } = req.query;
    
    const query = getTenantQuery(req, { isActive: true });
    
    if (status) query.status = status;
    if (industry) query.industry = industry;
    if (companyType) query.companyType = companyType;

    const companies = await PlacementCompany.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PlacementCompany.countDocuments(query);

    res.status(200).json({
      companies,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get placement companies error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePlacementCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const updates = req.body;

    const company = await PlacementCompany.findOneAndUpdate(
      getTenantQuery(req, { _id: companyId }),
      updates,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error("Update placement company error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Student Application Management
export const applyForPlacement = async (req, res) => {
  try {
    const { companyId, jobRoleId, studentDetails } = req.body;

    if (!companyId || !jobRoleId) {
      return res.status(400).json({ 
        message: "Company ID and job role ID are required" 
      });
    }

    // Get student information
    const student = await CollegeStudent.findOne(
      getTenantQuery(req, { userId: req.user._id })
    ).populate('userId', 'name email phone')
     .populate('courseId', 'name code')
     .populate('departmentId', 'name code');

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    // Verify company and job role exist
    const company = await PlacementCompany.findOne(
      getTenantQuery(req, { _id: companyId, status: "Active" })
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found or inactive" });
    }

    const jobRole = company.jobRoles.id(jobRoleId);
    if (!jobRole || !jobRole.isActive) {
      return res.status(404).json({ message: "Job role not found or inactive" });
    }

    // Check eligibility
    const eligibility = company.eligibilityCriteria;
    
    if (eligibility.minimumCGPA && student.academicInfo.cgpa < eligibility.minimumCGPA) {
      return res.status(400).json({ 
        message: `Minimum CGPA required: ${eligibility.minimumCGPA}` 
      });
    }

    if (eligibility.maxBacklogs && student.academicInfo.backlogs.length > eligibility.maxBacklogs) {
      return res.status(400).json({ 
        message: `Maximum ${eligibility.maxBacklogs} backlogs allowed` 
      });
    }

    if (eligibility.allowedCourses.length > 0 && !eligibility.allowedCourses.includes(student.courseId._id)) {
      return res.status(400).json({ 
        message: "Your course is not eligible for this placement" 
      });
    }

    // Check if already applied
    const existingApplication = await PlacementApplication.findOne(
      getTenantQuery(req, { studentId: student._id, companyId })
    );

    if (existingApplication) {
      return res.status(400).json({ 
        message: "You have already applied to this company" 
      });
    }

    // Check application limit
    if (company.visitDetails.maxApplications && 
        company.visitDetails.currentApplications >= company.visitDetails.maxApplications) {
      return res.status(400).json({ 
        message: "Application limit reached for this company" 
      });
    }

    const applicationData = addTenantData(req, {
      studentId: student._id,
      userId: req.user._id,
      companyId,
      jobRoleId,
      studentDetails: {
        name: student.userId.name,
        email: student.userId.email,
        phone: student.userId.phone,
        courseId: student.courseId._id,
        departmentId: student.departmentId._id,
        currentSemester: student.currentSemester,
        cgpa: student.academicInfo.cgpa,
        backlogs: student.academicInfo.backlogs.length,
        skills: studentDetails?.skills || [],
        resume: studentDetails?.resume || "",
        portfolioUrl: studentDetails?.portfolioUrl || "",
      },
    });

    const application = await PlacementApplication.create(applicationData);

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply for placement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const student = await CollegeStudent.findOne(
      getTenantQuery(req, { userId: req.user._id })
    );

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const applications = await PlacementApplication.find(
      getTenantQuery(req, { studentId: student._id })
    ).populate('companyId', 'companyName industry jobRoles')
     .sort({ applicationDate: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Get student applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { roundName, status, score, feedback, interviewerName, notes } = req.body;

    const application = await PlacementApplication.findOne(
      getTenantQuery(req, { _id: applicationId })
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Find the round and update it
    const roundIndex = application.selectionProcess.findIndex(
      round => round.roundName === roundName
    );

    if (roundIndex !== -1) {
      application.selectionProcess[roundIndex].status = status;
      application.selectionProcess[roundIndex].actualDate = new Date();
      if (score) application.selectionProcess[roundIndex].score = score;
      if (feedback) application.selectionProcess[roundIndex].feedback = feedback;
      if (interviewerName) application.selectionProcess[roundIndex].interviewerName = interviewerName;
      if (notes) application.selectionProcess[roundIndex].notes = notes;
    } else {
      // Add new round
      application.selectionProcess.push({
        roundName,
        status,
        actualDate: new Date(),
        score,
        feedback,
        interviewerName,
        notes,
      });
    }

    // Update overall status based on round results
    if (status === "Rejected") {
      application.overallStatus = "Rejected";
    } else if (status === "Cleared") {
      const allRounds = application.selectionProcess;
      const clearedRounds = allRounds.filter(round => round.status === "Cleared").length;
      const totalRounds = allRounds.length;
      
      if (clearedRounds === totalRounds) {
        application.overallStatus = "Selected";
      } else {
        application.overallStatus = "In Process";
      }
    }

    await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const generateOfferLetter = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { salary, joiningDate, location, designation } = req.body;

    if (!salary || !joiningDate || !designation) {
      return res.status(400).json({ 
        message: "Salary, joining date, and designation are required" 
      });
    }

    const application = await PlacementApplication.findOne(
      getTenantQuery(req, { _id: applicationId, overallStatus: "Selected" })
    ).populate('companyId', 'companyName')
     .populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({ message: "Selected application not found" });
    }

    // Update offer details
    application.offerDetails = {
      isOffered: true,
      offerDate: new Date(),
      joiningDate: new Date(joiningDate),
      salary: {
        base: salary.base || salary,
        variable: salary.variable || 0,
        total: (salary.base || salary) + (salary.variable || 0),
      },
      location,
      designation,
      offerStatus: "Pending",
    };

    await application.save();

    res.status(200).json({
      message: "Offer letter generated successfully",
      application,
    });
  } catch (error) {
    console.error("Generate offer letter error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Analytics and Reports
export const getPlacementStats = async (req, res) => {
  try {
    const { academicYear } = req.query;
    
    const matchQuery = getTenantQuery(req, {});
    if (academicYear) matchQuery.academicYear = academicYear;

    const stats = await PlacementApplication.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$overallStatus",
          count: { $sum: 1 },
          avgSalary: { $avg: "$offerDetails.salary.total" },
          maxSalary: { $max: "$offerDetails.salary.total" },
          minSalary: { $min: "$offerDetails.salary.total" },
        }
      }
    ]);

    const companyStats = await PlacementCompany.aggregate([
      { $match: getTenantQuery(req, { isActive: true }) },
      {
        $group: {
          _id: "$industry",
          count: { $sum: 1 },
          totalOffers: { $sum: "$placementStats.totalOffers" },
          avgPackage: { $avg: "$placementStats.averagePackage" },
        }
      }
    ]);

    const totalStudents = await CollegeStudent.countDocuments(
      getTenantQuery(req, { isActive: true })
    );

    const placedStudents = await PlacementApplication.countDocuments(
      getTenantQuery(req, { overallStatus: "Selected", "offerDetails.offerStatus": "Accepted" })
    );

    const placementPercentage = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

    res.status(200).json({
      stats: {
        totalStudents,
        placedStudents,
        placementPercentage: Math.round(placementPercentage * 100) / 100,
        applicationStats: stats,
        companyStats,
      },
    });
  } catch (error) {
    console.error("Get placement stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEligibleStudents = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await PlacementCompany.findOne(
      getTenantQuery(req, { _id: companyId })
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const eligibility = company.eligibilityCriteria;
    const query = getTenantQuery(req, { isActive: true });

    // Apply eligibility filters
    if (eligibility.minimumCGPA) {
      query['academicInfo.cgpa'] = { $gte: eligibility.minimumCGPA };
    }

    if (eligibility.maxBacklogs !== undefined) {
      query['$expr'] = { 
        $lte: [{ $size: "$academicInfo.backlogs" }, eligibility.maxBacklogs] 
      };
    }

    if (eligibility.allowedCourses && eligibility.allowedCourses.length > 0) {
      query.courseId = { $in: eligibility.allowedCourses };
    }

    if (eligibility.allowedDepartments && eligibility.allowedDepartments.length > 0) {
      query.departmentId = { $in: eligibility.allowedDepartments };
    }

    const eligibleStudents = await CollegeStudent.find(query)
      .populate('userId', 'name email phone')
      .populate('courseId', 'name code')
      .populate('departmentId', 'name code')
      .select('userId courseId departmentId currentSemester academicInfo placement')
      .sort({ 'academicInfo.cgpa': -1 });

    // Filter out students who already applied
    const appliedStudentIds = await PlacementApplication.find(
      getTenantQuery(req, { companyId })
    ).distinct('studentId');

    const availableStudents = eligibleStudents.filter(
      student => !appliedStudentIds.includes(student._id)
    );

    res.status(200).json({
      eligibleStudents: availableStudents,
      totalEligible: availableStudents.length,
      alreadyApplied: appliedStudentIds.length,
    });
  } catch (error) {
    console.error("Get eligible students error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlacementDashboard = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Get overall stats
    const [
      totalCompanies,
      activeCompanies,
      totalApplications,
      selectedStudents,
      totalStudents
    ] = await Promise.all([
      PlacementCompany.countDocuments(getTenantQuery(req, { isActive: true })),
      PlacementCompany.countDocuments(getTenantQuery(req, { status: "Active", isActive: true })),
      PlacementApplication.countDocuments(getTenantQuery(req, {})),
      PlacementApplication.countDocuments(getTenantQuery(req, { overallStatus: "Selected" })),
      CollegeStudent.countDocuments(getTenantQuery(req, { isActive: true }))
    ]);

    // Get recent activities
    const recentApplications = await PlacementApplication.find(
      getTenantQuery(req, {})
    ).populate('companyId', 'companyName')
     .populate('userId', 'name')
     .sort({ applicationDate: -1 })
     .limit(10);

    // Get upcoming visits
    const upcomingVisits = await PlacementCompany.find(
      getTenantQuery(req, { 
        status: "Active",
        "visitDetails.visitDate": { $gte: new Date() }
      })
    ).select('companyName visitDetails')
     .sort({ "visitDetails.visitDate": 1 })
     .limit(5);

    const placementPercentage = totalStudents > 0 ? (selectedStudents / totalStudents) * 100 : 0;

    res.status(200).json({
      dashboard: {
        stats: {
          totalCompanies,
          activeCompanies,
          totalApplications,
          selectedStudents,
          totalStudents,
          placementPercentage: Math.round(placementPercentage * 100) / 100,
        },
        recentApplications,
        upcomingVisits,
      },
    });
  } catch (error) {
    console.error("Get placement dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};