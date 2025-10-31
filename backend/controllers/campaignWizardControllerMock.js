// Mock Campaign Wizard Controller
// This provides mock data without requiring database connections

// Get Campaign Templates (Mock)
export const getTemplates = async (req, res) => {
  try {
    console.log('getTemplates (MOCK) called with:', req.query);
    
    const { category, gradeLevel, templateType } = req.query;

    // Mock templates data
    const mockTemplates = [
      {
        _id: 'template_1',
        name: 'Financial Literacy Basics',
        description: 'Comprehensive financial literacy program covering budgeting, saving, and basic investment concepts for students.',
        category: 'finance',
        gradeLevel: '6-8',
        templateType: 'public',
        estimatedDuration: {
          totalMinutes: 120,
          sessions: 4,
          sessionDuration: 30
        },
        rewardStructure: {
          baseReward: 50,
          bonusReward: 25,
          participationReward: 10
        },
        nepCompetencies: [
          {
            competency: 'Financial Literacy',
            domain: 'Financial Management',
            grade: '6-8',
            learningOutcome: 'Understand basic financial concepts'
          }
        ],
        usageStats: {
          timesUsed: 15,
          successRate: 85,
          averageCompletionRate: 78,
          averageEngagementScore: 82
        },
        status: 'approved'
      },
      {
        _id: 'template_2',
        name: 'Mental Wellness & Mindfulness',
        description: 'Mental health awareness and mindfulness practices to help students manage stress and build emotional resilience.',
        category: 'mental_health',
        gradeLevel: '6-8',
        templateType: 'public',
        estimatedDuration: {
          totalMinutes: 90,
          sessions: 3,
          sessionDuration: 30
        },
        rewardStructure: {
          baseReward: 40,
          bonusReward: 20,
          participationReward: 10
        },
        nepCompetencies: [
          {
            competency: 'Emotional Intelligence',
            domain: 'Personal Development',
            grade: '6-8',
            learningOutcome: 'Develop emotional awareness and regulation skills'
          }
        ],
        usageStats: {
          timesUsed: 22,
          successRate: 92,
          averageCompletionRate: 85,
          averageEngagementScore: 88
        },
        status: 'approved'
      },
      {
        _id: 'template_3',
        name: 'Environmental Conservation',
        description: 'Environmental awareness program focusing on sustainability, climate change, and conservation practices.',
        category: 'environmental',
        gradeLevel: '6-8',
        templateType: 'public',
        estimatedDuration: {
          totalMinutes: 150,
          sessions: 5,
          sessionDuration: 30
        },
        rewardStructure: {
          baseReward: 60,
          bonusReward: 30,
          participationReward: 15
        },
        nepCompetencies: [
          {
            competency: 'Environmental Awareness',
            domain: 'Environmental Studies',
            grade: '6-8',
            learningOutcome: 'Understand environmental challenges and solutions'
          }
        ],
        usageStats: {
          timesUsed: 8,
          successRate: 88,
          averageCompletionRate: 82,
          averageEngagementScore: 85
        },
        status: 'approved'
      },
      {
        _id: 'template_4',
        name: 'AI & Digital Literacy',
        description: 'Introduction to artificial intelligence, digital citizenship, and responsible technology use.',
        category: 'ai_literacy',
        gradeLevel: '6-8',
        templateType: 'public',
        estimatedDuration: {
          totalMinutes: 180,
          sessions: 6,
          sessionDuration: 30
        },
        rewardStructure: {
          baseReward: 70,
          bonusReward: 35,
          participationReward: 15
        },
        nepCompetencies: [
          {
            competency: 'Digital Literacy',
            domain: 'Technology',
            grade: '6-8',
            learningOutcome: 'Understand AI concepts and digital citizenship'
          }
        ],
        usageStats: {
          timesUsed: 12,
          successRate: 80,
          averageCompletionRate: 75,
          averageEngagementScore: 78
        },
        status: 'approved'
      },
      {
        _id: 'template_5',
        name: 'Values & Ethics',
        description: 'Character building and ethical decision-making program focusing on core values and moral development.',
        category: 'values',
        gradeLevel: '6-8',
        templateType: 'public',
        estimatedDuration: {
          totalMinutes: 100,
          sessions: 4,
          sessionDuration: 25
        },
        rewardStructure: {
          baseReward: 45,
          bonusReward: 20,
          participationReward: 10
        },
        nepCompetencies: [
          {
            competency: 'Ethical Reasoning',
            domain: 'Values Education',
            grade: '6-8',
            learningOutcome: 'Develop ethical decision-making skills'
          }
        ],
        usageStats: {
          timesUsed: 18,
          successRate: 90,
          averageCompletionRate: 88,
          averageEngagementScore: 85
        },
        status: 'approved'
      }
    ];

    // Filter templates based on query parameters
    let filteredTemplates = mockTemplates;
    
    if (category && category !== 'all') {
      filteredTemplates = filteredTemplates.filter(t => t.category === category);
    }
    
    if (gradeLevel) {
      filteredTemplates = filteredTemplates.filter(t => t.gradeLevel === gradeLevel);
    }
    
    if (templateType) {
      filteredTemplates = filteredTemplates.filter(t => t.templateType === templateType);
    }

    res.json({
      success: true,
      data: filteredTemplates
    });
  } catch (error) {
    console.error('Error fetching templates (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
};

// Define Campaign Scope (Mock)
export const defineScope = async (req, res) => {
  try {
    console.log('defineScope (MOCK) called with:', req.body);
    
    const {
      title,
      description,
      scopeType,
      targetSchools,
      targetDistricts,
      gradeLevels,
      maxParticipants,
      minParticipants,
      objectives,
      priority
    } = req.body;

    // Mock campaign creation
    const mockCampaign = {
      _id: 'mock_campaign_' + Date.now(),
      title,
      description,
      scope: {
        type: scopeType,
        targetSchools: targetSchools || [],
        targetDistricts: targetDistricts || [],
        gradeLevels: gradeLevels || [],
        maxParticipants: maxParticipants || 1000,
        minParticipants: minParticipants || 10
      },
      objectives: objectives || [],
      priority: priority || 'medium',
      workflowStage: 'scope',
      status: 'scope_defined',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Campaign scope defined successfully',
      data: mockCampaign,
      nextStep: 'templates'
    });
  } catch (error) {
    console.error('Error defining scope (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to define campaign scope',
      error: error.message
    });
  }
};

// Select Templates (Mock)
export const selectTemplates = async (req, res) => {
  try {
    console.log('selectTemplates (MOCK) called with:', req.body);
    
    const { campaignId, templateIds, customTemplateRequest } = req.body;

    // Mock template selection response
    const mockResponse = {
      campaign: {
        _id: campaignId,
        templates: templateIds.map(id => ({
          templateId: id,
          templateName: `Template ${id}`,
          category: 'finance',
          weight: 1,
          isRequired: false
        })),
        customTemplateRequest: customTemplateRequest || null,
        workflowStage: 'templates',
        status: 'templates_selected',
        updatedAt: new Date()
      },
      templates: templateIds.map(id => ({
        _id: id,
        name: `Template ${id}`,
        description: 'Mock template description',
        category: 'finance'
      }))
    };

    res.json({
      success: true,
      message: 'Templates selected successfully',
      data: mockResponse,
      nextStep: 'pilot'
    });
  } catch (error) {
    console.error('Error selecting templates (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to select templates',
      error: error.message
    });
  }
};

// Configure Pilot (Mock)
export const configurePilot = async (req, res) => {
  try {
    console.log('configurePilot (MOCK) called with:', req.body);
    
    const {
      campaignId,
      pilotRequired,
      pilotSchools,
      pilotDuration,
      pilotStartDate,
      pilotEndDate,
      pilotObjectives,
      pilotMetrics
    } = req.body;

    // Mock pilot configuration
    const mockCampaign = {
      _id: campaignId,
      pilot: {
        required: pilotRequired || false,
        schools: pilotSchools || [],
        duration: pilotDuration || 14,
        startDate: pilotStartDate ? new Date(pilotStartDate) : null,
        endDate: pilotEndDate ? new Date(pilotEndDate) : null,
        objectives: pilotObjectives || [],
        metrics: pilotMetrics || {},
        status: 'not_started'
      },
      workflowStage: 'pilot',
      status: pilotRequired ? 'pilot' : 'approved',
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Pilot configuration saved successfully',
      data: mockCampaign,
      nextStep: 'budget'
    });
  } catch (error) {
    console.error('Error configuring pilot (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to configure pilot',
      error: error.message
    });
  }
};

// Set Budget (Mock)
export const setBudget = async (req, res) => {
  try {
    console.log('setBudget (MOCK) called with:', req.body);
    
    const {
      campaignId,
      budgetType,
      totalBudget,
      healCoinsPool,
      perStudentRewardCap,
      budgetBreakdown,
      fundingSource
    } = req.body;

    // Mock budget configuration
    const mockCampaign = {
      _id: campaignId,
      budget: {
        type: budgetType,
        totalBudget: totalBudget || 0,
        allocatedBudget: totalBudget || 0,
        spentBudget: 0,
        remainingBudget: totalBudget || 0,
        currency: 'INR',
        budgetBreakdown: budgetBreakdown || [],
        fundingSource: fundingSource || 'organization'
      },
      healCoins: {
        totalFunded: healCoinsPool || 0,
        spent: 0,
        remaining: healCoinsPool || 0,
        exchangeRate: 1,
        rewardStructure: {
          participation: 10,
          completion: 50,
          excellence: 100
        }
      },
      workflowStage: 'budget',
      status: 'budget_set',
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Budget configuration saved successfully',
      data: mockCampaign,
      nextStep: 'approval'
    });
  } catch (error) {
    console.error('Error setting budget (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set budget',
      error: error.message
    });
  }
};

// Request Approvals (Mock)
export const requestApprovals = async (req, res) => {
  try {
    console.log('requestApprovals (MOCK) called with:', req.body);
    
    const {
      campaignId,
      approvalType,
      requiredApprovals,
      approvalDeadline
    } = req.body;

    // Mock approval requests
    const mockApprovalRequests = [
      {
        _id: 'approval_1',
        campaignId: campaignId,
        approvalType: approvalType || 'school_admin',
        status: 'pending',
        requestedAt: new Date(),
        expiresAt: approvalDeadline ? new Date(approvalDeadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockCampaign = {
      _id: campaignId,
      timeline: {
        approvalDeadline: approvalDeadline ? new Date(approvalDeadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      workflowStage: 'approval',
      status: 'pending_approval',
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Approval requests created successfully',
      data: {
        campaign: mockCampaign,
        approvalRequests: mockApprovalRequests
      },
      nextStep: 'monitoring'
    });
  } catch (error) {
    console.error('Error requesting approvals (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request approvals',
      error: error.message
    });
  }
};

// Launch Campaign (Mock)
export const launchCampaign = async (req, res) => {
  try {
    console.log('launchCampaign (MOCK) called with:', req.body);
    
    const { campaignId, launchDate } = req.body;

    // Mock campaign launch
    const mockCampaign = {
      _id: campaignId,
      status: 'active',
      workflowStage: 'active',
      timeline: {
        rolloutDate: launchDate ? new Date(launchDate) : new Date()
      },
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Campaign launched successfully',
      data: mockCampaign,
      nextStep: 'reporting'
    });
  } catch (error) {
    console.error('Error launching campaign (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to launch campaign',
      error: error.message
    });
  }
};

// Get Monitoring Data (Mock)
export const getMonitoringData = async (req, res) => {
  try {
    console.log('getMonitoringData (MOCK) called with:', req.params);
    
    const { campaignId } = req.params;

    // Mock monitoring data
    const mockMonitoringData = {
      campaign: {
        _id: campaignId,
        title: 'Financial Literacy Campaign',
        description: 'Comprehensive financial literacy program',
        status: 'active',
        duration: 30,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      realTimeMetrics: {
        totalParticipants: 1250,
        activeParticipants: 980,
        completedParticipants: 650,
        engagementRate: 78,
        completionRate: 52,
        averageSessionDuration: 25
      },
      schoolBreakdown: [
        { schoolId: '1', participants: 300, completionRate: 65, engagementScore: 82 },
        { schoolId: '2', participants: 250, completionRate: 58, engagementScore: 75 },
        { schoolId: '3', participants: 400, completionRate: 72, engagementScore: 85 },
        { schoolId: '4', participants: 300, completionRate: 45, engagementScore: 68 }
      ],
      gradeBreakdown: [
        { grade: '6', participants: 300, completionRate: 68, averageScore: 85 },
        { grade: '7', participants: 450, completionRate: 72, averageScore: 88 },
        { grade: '8', participants: 500, completionRate: 58, averageScore: 82 }
      ],
      recentActivity: [
        {
          timestamp: new Date(),
          type: 'completion',
          message: 'Student completed Financial Literacy module',
          studentId: 'mock_student_1'
        },
        {
          timestamp: new Date(Date.now() - 3600000),
          type: 'engagement',
          message: 'High engagement detected in Grade 7',
          grade: '7'
        },
        {
          timestamp: new Date(Date.now() - 7200000),
          type: 'completion',
          message: '50 students completed the budgeting challenge',
          count: 50
        }
      ]
    };

    res.json({
      success: true,
      data: mockMonitoringData
    });
  } catch (error) {
    console.error('Error fetching monitoring data (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monitoring data',
      error: error.message
    });
  }
};

// Generate Report (Mock)
export const generateReport = async (req, res) => {
  try {
    console.log('generateReport (MOCK) called with:', req.params);
    
    const { campaignId, reportType = 'comprehensive' } = req.params;

    // Mock report generation
    const mockReport = {
      campaign: {
        title: 'Financial Literacy Campaign',
        description: 'Comprehensive financial literacy program',
        status: 'active',
        duration: 30,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      metrics: {
        totalParticipants: 1250,
        completionRate: 52,
        engagementRate: 78,
        satisfactionScore: 8.5,
        knowledgeImprovement: 35
      },
      nepMapping: {
        competenciesCovered: 5,
        domains: ['Financial Management', 'Digital Literacy'],
        gradeLevels: ['6', '7', '8']
      },
      certificates: {
        totalIssued: 650,
        byCategory: [
          { category: 'finance', count: 400 },
          { category: 'completion', count: 250 }
        ]
      },
      impact: {
        schoolsReached: 4,
        studentsImpacted: 1250,
        budgetUtilization: '65.5',
        healCoinsDistributed: 32500
      },
      recommendations: [
        'Continue similar campaigns in other schools',
        'Expand to additional grade levels',
        'Increase HealCoins rewards for better engagement'
      ]
    };

    res.json({
      success: true,
      data: mockReport,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Error generating report (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};
