// Mock Campaign Approval Controller
// This provides mock data without requiring database connections

// Create approval request (Mock)
export const createApprovalRequest = async (req, res) => {
  try {
    console.log('createApprovalRequest (MOCK) called with:', req.body);
    
    const {
      campaignId,
      schoolId,
      approvalType,
      campaignDetails,
      schoolReadiness
    } = req.body;

    // Mock approval request
    const mockApproval = {
      _id: 'mock_approval_' + Date.now(),
      campaignId: campaignId || 'mock_campaign_1',
      schoolId: schoolId || 'mock_school_1',
      schoolName: 'Mock School Name',
      schoolType: 'government',
      approvalType: approvalType || 'pilot',
      status: 'pending',
      requestedBy: 'mock_user_1',
      schoolAdmin: {
        userId: 'mock_school_admin_1',
        name: 'Dr. John Smith',
        email: 'principal@mockschool.edu',
        phone: '+91-9876543210',
        designation: 'Principal'
      },
      approvalWorkflow: {
        steps: [
          {
            stepName: 'School Admin Review',
            stepOrder: 1,
            status: 'pending',
            assignedTo: 'mock_school_admin_1'
          },
          {
            stepName: 'Infrastructure Assessment',
            stepOrder: 2,
            status: 'pending',
            assignedTo: 'mock_school_admin_1'
          },
          {
            stepName: 'Final Approval',
            stepOrder: 3,
            status: 'pending',
            assignedTo: 'mock_school_admin_1'
          }
        ],
        currentStep: 0,
        totalSteps: 3
      },
      campaignDetails: campaignDetails || {
        title: 'Mock Campaign Title',
        description: 'Mock campaign description',
        objectives: ['Objective 1', 'Objective 2'],
        targetStudents: 100,
        duration: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        budgetAllocation: 50000,
        healCoinsAllocation: 10000,
        requirements: ['Requirement 1', 'Requirement 2'],
        deliverables: ['Deliverable 1', 'Deliverable 2']
      },
      schoolReadiness: schoolReadiness || {
        infrastructure: {
          hasInternet: true,
          hasComputers: true,
          hasProjector: true,
          hasAudioSystem: true,
          computerCount: 20,
          internetSpeed: '50 Mbps'
        },
        staff: {
          principalApproval: true,
          teacherSupport: 5,
          itSupport: true,
          coordinatorAssigned: true,
          coordinatorName: 'Ms. Jane Doe',
          coordinatorContact: '+91-9876543211'
        },
        students: {
          targetGradeLevels: ['6', '7', '8'],
          estimatedParticipation: 100,
          parentConsent: true,
          specialNeeds: false,
          specialNeedsCount: 0
        },
        logistics: {
          preferredTiming: 'Morning',
          availableDays: ['Monday', 'Tuesday', 'Wednesday'],
          spaceAvailable: true,
          spaceCapacity: 50,
          securityArrangements: true
        }
      },
      organizationId: 'mock_org_1',
      createdBy: 'mock_user_1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Approval request created successfully',
      data: mockApproval
    });
  } catch (error) {
    console.error('Error creating approval request (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create approval request',
      error: error.message
    });
  }
};

// Get approval requests (Mock)
export const getApprovalRequests = async (req, res) => {
  try {
    console.log('getApprovalRequests (MOCK) called with:', req.query);
    
    const { page = 1, limit = 10, status, approvalType } = req.query;

    // Mock approvals data
    const mockApprovals = [
      {
        _id: 'mock_approval_1',
        campaignId: {
          _id: 'mock_campaign_1',
          title: 'Financial Literacy Drive',
          description: 'Teaching financial literacy to students',
          status: 'active'
        },
        schoolId: {
          _id: 'mock_school_1',
          name: 'Delhi Public School',
          type: 'government',
          address: 'New Delhi, India'
        },
        schoolName: 'Delhi Public School',
        schoolType: 'government',
        approvalType: 'pilot',
        status: 'pending',
        requestedBy: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        schoolAdmin: {
          userId: {
            _id: 'mock_school_admin_1',
            name: 'Dr. Smith',
            email: 'principal@dps.edu'
          },
          name: 'Dr. Smith',
          email: 'principal@dps.edu',
          phone: '+91-9876543210',
          designation: 'Principal'
        },
        approvalWorkflow: {
          currentStep: 1,
          totalSteps: 3,
          steps: [
            {
              stepName: 'School Admin Review',
              stepOrder: 1,
              status: 'completed',
              assignedTo: 'mock_school_admin_1',
              completedAt: new Date()
            },
            {
              stepName: 'Infrastructure Assessment',
              stepOrder: 2,
              status: 'in_progress',
              assignedTo: 'mock_school_admin_1'
            },
            {
              stepName: 'Final Approval',
              stepOrder: 3,
              status: 'pending',
              assignedTo: 'mock_school_admin_1'
            }
          ]
        },
        campaignDetails: {
          title: 'Financial Literacy Drive',
          targetStudents: 150,
          duration: 30
        },
        approvalProgress: 33,
        createdAt: new Date('2024-01-15')
      },
      {
        _id: 'mock_approval_2',
        campaignId: {
          _id: 'mock_campaign_2',
          title: 'Mental Wellness Program',
          description: 'Mental health awareness program',
          status: 'pilot'
        },
        schoolId: {
          _id: 'mock_school_2',
          name: 'Mumbai High School',
          type: 'private',
          address: 'Mumbai, India'
        },
        schoolName: 'Mumbai High School',
        schoolType: 'private',
        approvalType: 'full_rollout',
        status: 'approved',
        requestedBy: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        schoolAdmin: {
          userId: {
            _id: 'mock_school_admin_2',
            name: 'Ms. Johnson',
            email: 'principal@mhs.edu'
          },
          name: 'Ms. Johnson',
          email: 'principal@mhs.edu',
          phone: '+91-9876543212',
          designation: 'Principal'
        },
        approvalWorkflow: {
          currentStep: 3,
          totalSteps: 3,
          steps: [
            {
              stepName: 'School Admin Review',
              stepOrder: 1,
              status: 'completed',
              assignedTo: 'mock_school_admin_2',
              completedAt: new Date()
            },
            {
              stepName: 'Infrastructure Assessment',
              stepOrder: 2,
              status: 'completed',
              assignedTo: 'mock_school_admin_2',
              completedAt: new Date()
            },
            {
              stepName: 'Final Approval',
              stepOrder: 3,
              status: 'completed',
              assignedTo: 'mock_school_admin_2',
              completedAt: new Date()
            }
          ]
        },
        campaignDetails: {
          title: 'Mental Wellness Program',
          targetStudents: 200,
          duration: 45
        },
        approvalProgress: 100,
        decision: {
          approvedBy: 'mock_user_1',
          approvedAt: new Date('2024-01-20'),
          validityPeriod: 365,
          expiresAt: new Date('2025-01-20')
        },
        createdAt: new Date('2024-01-10')
      },
      {
        _id: 'mock_approval_3',
        campaignId: {
          _id: 'mock_campaign_3',
          title: 'Values Education Initiative',
          description: 'Teaching values and ethics',
          status: 'draft'
        },
        schoolId: {
          _id: 'mock_school_3',
          name: 'Bangalore International School',
          type: 'aided',
          address: 'Bangalore, India'
        },
        schoolName: 'Bangalore International School',
        schoolType: 'aided',
        approvalType: 'pilot',
        status: 'rejected',
        requestedBy: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        schoolAdmin: {
          userId: {
            _id: 'mock_school_admin_3',
            name: 'Dr. Kumar',
            email: 'principal@bis.edu'
          },
          name: 'Dr. Kumar',
          email: 'principal@bis.edu',
          phone: '+91-9876543213',
          designation: 'Principal'
        },
        approvalWorkflow: {
          currentStep: 2,
          totalSteps: 3,
          steps: [
            {
              stepName: 'School Admin Review',
              stepOrder: 1,
              status: 'completed',
              assignedTo: 'mock_school_admin_3',
              completedAt: new Date()
            },
            {
              stepName: 'Infrastructure Assessment',
              stepOrder: 2,
              status: 'completed',
              assignedTo: 'mock_school_admin_3',
              completedAt: new Date()
            },
            {
              stepName: 'Final Approval',
              stepOrder: 3,
              status: 'rejected',
              assignedTo: 'mock_school_admin_3',
              completedAt: new Date()
            }
          ]
        },
        campaignDetails: {
          title: 'Values Education Initiative',
          targetStudents: 120,
          duration: 60
        },
        approvalProgress: 100,
        decision: {
          approvedBy: 'mock_school_admin_3',
          approvedAt: new Date('2024-01-25'),
          rejectionReason: 'Insufficient infrastructure for the program requirements',
          validityPeriod: 0
        },
        createdAt: new Date('2024-01-05')
      }
    ];

    // Filter based on query parameters
    let filteredApprovals = mockApprovals;
    
    if (status && status !== 'all') {
      filteredApprovals = filteredApprovals.filter(approval => approval.status === status);
    }
    
    if (approvalType && approvalType !== 'all') {
      filteredApprovals = filteredApprovals.filter(approval => approval.approvalType === approvalType);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedApprovals = filteredApprovals.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedApprovals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredApprovals.length,
        totalPages: Math.ceil(filteredApprovals.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching approval requests (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval requests',
      error: error.message
    });
  }
};

// Get approval by ID (Mock)
export const getApprovalById = async (req, res) => {
  try {
    console.log('getApprovalById (MOCK) called with:', req.params);
    
    const { approvalId } = req.params;

    // Mock approval details
    const mockApproval = {
      _id: approvalId,
      campaignId: {
        _id: 'mock_campaign_1',
        title: 'Financial Literacy Drive',
        description: 'Teaching financial literacy to students',
        status: 'active',
        timeline: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        budget: {
          totalBudget: 100000,
          allocatedBudget: 80000
        }
      },
      schoolId: {
        _id: 'mock_school_1',
        name: 'Delhi Public School',
        type: 'government',
        address: 'New Delhi, India',
        contactPerson: 'mock_school_admin_1'
      },
      schoolName: 'Delhi Public School',
      schoolType: 'government',
      approvalType: 'pilot',
      status: 'pending',
      requestedBy: {
        _id: 'mock_user_1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      schoolAdmin: {
        userId: {
          _id: 'mock_school_admin_1',
          name: 'Dr. Smith',
          email: 'principal@dps.edu'
        },
        name: 'Dr. Smith',
        email: 'principal@dps.edu',
        phone: '+91-9876543210',
        designation: 'Principal'
      },
      approvalWorkflow: {
        currentStep: 1,
        totalSteps: 3,
        steps: [
          {
            stepName: 'School Admin Review',
            stepOrder: 1,
            status: 'completed',
            assignedTo: 'mock_school_admin_1',
            completedAt: new Date(),
            comments: 'Initial review completed successfully'
          },
          {
            stepName: 'Infrastructure Assessment',
            stepOrder: 2,
            status: 'in_progress',
            assignedTo: 'mock_school_admin_1',
            comments: 'Assessing school infrastructure requirements'
          },
          {
            stepName: 'Final Approval',
            stepOrder: 3,
            status: 'pending',
            assignedTo: 'mock_school_admin_1'
          }
        ]
      },
      campaignDetails: {
        title: 'Financial Literacy Drive',
        description: 'Comprehensive financial literacy program for students',
        objectives: [
          'Teach basic financial concepts',
          'Develop money management skills',
          'Promote financial responsibility'
        ],
        targetStudents: 150,
        duration: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        budgetAllocation: 50000,
        healCoinsAllocation: 10000,
        requirements: [
          'Computer lab with internet access',
          'Projector and audio system',
          'Trained teacher coordinator'
        ],
        deliverables: [
          'Student certificates',
          'Progress reports',
          'Impact assessment'
        ]
      },
      schoolReadiness: {
        infrastructure: {
          hasInternet: true,
          hasComputers: true,
          hasProjector: true,
          hasAudioSystem: true,
          computerCount: 25,
          internetSpeed: '100 Mbps'
        },
        staff: {
          principalApproval: true,
          teacherSupport: 8,
          itSupport: true,
          coordinatorAssigned: true,
          coordinatorName: 'Ms. Jane Doe',
          coordinatorContact: '+91-9876543211'
        },
        students: {
          targetGradeLevels: ['6', '7', '8'],
          estimatedParticipation: 150,
          parentConsent: true,
          specialNeeds: true,
          specialNeedsCount: 5
        },
        logistics: {
          preferredTiming: 'Morning (9 AM - 12 PM)',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          spaceAvailable: true,
          spaceCapacity: 60,
          securityArrangements: true
        }
      },
      organizationId: 'mock_org_1',
      createdBy: 'mock_user_1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: mockApproval
    });
  } catch (error) {
    console.error('Error fetching approval request (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval request',
      error: error.message
    });
  }
};

// Update workflow step (Mock)
export const updateWorkflowStep = async (req, res) => {
  try {
    console.log('updateWorkflowStep (MOCK) called with:', req.params, req.body);
    
    const { approvalId } = req.params;
    const { stepIndex, status, comments, attachments } = req.body;

    // Mock workflow update
    const mockApproval = {
      _id: approvalId,
      status: 'pending',
      approvalWorkflow: {
        currentStep: stepIndex + 1,
        totalSteps: 3,
        steps: [
          {
            stepName: 'School Admin Review',
            stepOrder: 1,
            status: 'completed',
            assignedTo: 'mock_school_admin_1',
            completedAt: new Date(),
            comments: 'Initial review completed'
          },
          {
            stepName: 'Infrastructure Assessment',
            stepOrder: 2,
            status: status,
            assignedTo: 'mock_school_admin_1',
            comments: comments || 'Assessment in progress',
            attachments: attachments || []
          },
          {
            stepName: 'Final Approval',
            stepOrder: 3,
            status: 'pending',
            assignedTo: 'mock_school_admin_1'
          }
        ]
      },
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Workflow step updated successfully',
      data: mockApproval
    });
  } catch (error) {
    console.error('Error updating workflow step (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update workflow step',
      error: error.message
    });
  }
};

// Make approval decision (Mock)
export const makeApprovalDecision = async (req, res) => {
  try {
    console.log('makeApprovalDecision (MOCK) called with:', req.params, req.body);
    
    const { approvalId } = req.params;
    const { decision, reason, conditions, validityPeriod } = req.body;

    // Mock approval decision
    const mockApproval = {
      _id: approvalId,
      status: decision,
      decision: {
        approvedBy: 'mock_user_1',
        approvedAt: new Date(),
        rejectionReason: decision === 'rejected' ? reason : null,
        conditions: conditions || [],
        validityPeriod: validityPeriod || 365,
        expiresAt: decision === 'approved' ? 
          new Date(Date.now() + (validityPeriod || 365) * 24 * 60 * 60 * 1000) : null
      },
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: `Campaign ${decision} successfully`,
      data: mockApproval
    });
  } catch (error) {
    console.error('Error making approval decision (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to make approval decision',
      error: error.message
    });
  }
};

// Update pilot results (Mock)
export const updatePilotResults = async (req, res) => {
  try {
    console.log('updatePilotResults (MOCK) called with:', req.params, req.body);
    
    const { approvalId } = req.params;
    const { pilotResults } = req.body;

    // Mock pilot results update
    const mockApproval = {
      _id: approvalId,
      pilotResults: {
        isPilotCompleted: true,
        pilotStartDate: new Date('2024-01-20'),
        pilotEndDate: new Date(),
        pilotDuration: 30,
        pilotParticipants: 120,
        pilotMetrics: {
          participationRate: 95.5,
          completionRate: 87.2,
          engagementScore: 8.5,
          satisfactionScore: 9.1,
          technicalIssues: 2,
          dropoutRate: 4.5
        },
        feedback: {
          schoolAdmin: 'Excellent program, students were very engaged',
          teachers: 'Great learning materials and methodology',
          students: 'Fun and educational, learned a lot about money',
          parents: 'Very happy with the program, children are more responsible with money'
        },
        recommendations: [
          'Extend program duration to 6 weeks',
          'Add more interactive activities',
          'Include parent workshops'
        ],
        lessonsLearned: [
          'Students respond well to gamified learning',
          'Parent involvement increases engagement',
          'Technology integration is crucial for success'
        ],
        scalabilityAssessment: {
          canScale: true,
          challenges: ['Teacher training requirements', 'Infrastructure needs'],
          requirements: ['Additional teacher training', 'More computer labs'],
          estimatedCapacity: 500
        }
      },
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Pilot results updated successfully',
      data: mockApproval
    });
  } catch (error) {
    console.error('Error updating pilot results (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pilot results',
      error: error.message
    });
  }
};

// Get approval statistics (Mock)
export const getApprovalStats = async (req, res) => {
  try {
    console.log('getApprovalStats (MOCK) called with:', req.query);
    
    // Mock statistics
    const mockStats = {
      statusBreakdown: [
        { _id: 'pending', count: 5 },
        { _id: 'approved', count: 12 },
        { _id: 'rejected', count: 3 },
        { _id: 'expired', count: 1 }
      ],
      approvalTypes: [
        { _id: 'pilot', count: 8 },
        { _id: 'full_rollout', count: 10 },
        { _id: 'renewal', count: 3 }
      ],
      schoolTypes: [
        { _id: 'government', count: 12 },
        { _id: 'private', count: 6 },
        { _id: 'aided', count: 3 }
      ],
      totalApprovals: 21
    };

    res.json({
      success: true,
      data: mockStats
    });
  } catch (error) {
    console.error('Error fetching approval stats (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval statistics',
      error: error.message
    });
  }
};

export default {
  createApprovalRequest,
  getApprovalRequests,
  getApprovalById,
  updateWorkflowStep,
  makeApprovalDecision,
  updatePilotResults,
  getApprovalStats
};
