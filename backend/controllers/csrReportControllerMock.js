// Mock CSR Report Controller
// This provides mock data without requiring database connections

import mongoose from 'mongoose';

// Generate CSR Report (Mock)
export const generateCSRReport = async (req, res) => {
  try {
    console.log('generateCSRReport (MOCK) called with:', req.body);
    
    const {
      reportType,
      reportName,
      startDate,
      endDate,
      campaignIds,
      branding,
      includeTestimonials
    } = req.body;

    // Mock report generation
    const mockReport = {
      _id: 'mock_report_' + Date.now(),
      reportId: `CSR-2024-Q4-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      reportType: reportType || 'quarterly',
      reportName: reportName || `${reportType} CSR Report`,
      organizationId: 'mock_org_1',
      organizationName: 'Mock CSR Organization',
      campaignIds: campaignIds || [],
      period: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        year: new Date(startDate).getFullYear(),
        quarter: getQuarter(new Date(startDate))
      },
      metrics: {
        schoolsReached: {
          totalSchools: 45,
          activeSchools: 38,
          schoolsByRegion: [
            { region: 'Delhi', count: 15, percentage: 33.3 },
            { region: 'Mumbai', count: 10, percentage: 22.2 },
            { region: 'Bangalore', count: 20, percentage: 44.4 }
          ],
          schoolsByType: [
            { type: 'government', count: 25, percentage: 55.6 },
            { type: 'private', count: 15, percentage: 33.3 },
            { type: 'aided', count: 5, percentage: 11.1 }
          ]
        },
        studentsReached: {
          totalStudents: 1250,
          activeStudents: 980,
          studentsByGrade: [
            { grade: '6', count: 300, percentage: 24.0 },
            { grade: '7', count: 400, percentage: 32.0 },
            { grade: '8', count: 550, percentage: 44.0 }
          ],
          studentsByGender: [
            { gender: 'male', count: 650, percentage: 52.0 },
            { gender: 'female', count: 600, percentage: 48.0 }
          ]
        },
        completionRates: {
          overallCompletionRate: 78.4,
          completionByCampaign: [
            {
              campaignId: 'mock_campaign_1',
              campaignName: 'Financial Literacy Drive',
              totalParticipants: 500,
              completedParticipants: 420,
              completionRate: 84.0
            },
            {
              campaignId: 'mock_campaign_2',
              campaignName: 'Mental Wellness Challenge',
              totalParticipants: 750,
              completedParticipants: 650,
              completionRate: 86.7
            }
          ],
          completionByGrade: [
            { grade: '6', completionRate: 75.2, totalStudents: 300 },
            { grade: '7', completionRate: 80.1, totalStudents: 400 },
            { grade: '8', completionRate: 79.8, totalStudents: 550 }
          ]
        },
        learningImprovements: {
          averageImprovement: 23.5,
          improvementsByPillar: [
            {
              pillar: 'financial_literacy',
              baselineScore: 65.2,
              finalScore: 78.9,
              improvement: 13.7,
              improvementPercentage: 21.0,
              studentsAssessed: 800
            },
            {
              pillar: 'mental_health',
              baselineScore: 58.1,
              finalScore: 72.3,
              improvement: 14.2,
              improvementPercentage: 24.4,
              studentsAssessed: 750
            },
            {
              pillar: 'values',
              baselineScore: 70.5,
              finalScore: 82.1,
              improvement: 11.6,
              improvementPercentage: 16.5,
              studentsAssessed: 900
            }
          ]
        },
        certificates: {
          totalIssued: 1250,
          certificatesByType: [
            { type: 'completion', count: 800, percentage: 64.0 },
            { type: 'achievement', count: 300, percentage: 24.0 },
            { type: 'excellence', count: 150, percentage: 12.0 }
          ],
          certificatesByModule: [
            { module: 'finance', count: 400, percentage: 32.0 },
            { module: 'mental', count: 350, percentage: 28.0 },
            { module: 'values', count: 250, percentage: 20.0 },
            { module: 'ai', count: 250, percentage: 20.0 }
          ],
          pendingCertificates: 120
        },
        financialMetrics: {
          totalSpend: 500000,
          spendPerStudent: 400,
          spendByCategory: [
            { category: 'campaign_funding', amount: 300000, percentage: 60.0 },
            { category: 'student_rewards', amount: 150000, percentage: 30.0 },
            { category: 'platform_fees', amount: 50000, percentage: 10.0 }
          ],
          healCoinsDistributed: 125000,
          healCoinsPerStudent: 100,
          budgetUtilization: 85.2,
          costPerCompletion: 510
        },
        engagementMetrics: {
          averageEngagementScore: 8.2,
          averageSessionDuration: 28.5,
          averageSessionsPerStudent: 12.3,
          returnRate: 78.5,
          dropoutRate: 21.5,
          satisfactionScore: 8.7
        }
      },
      nepMapping: {
        totalCompetencies: 24,
        competenciesCovered: 18,
        coveragePercentage: 75.0,
        competenciesByGrade: [
          { grade: '6-8', totalCompetencies: 24, coveredCompetencies: 18, coveragePercentage: 75.0 }
        ],
        competenciesByModule: [
          { module: 'finance', competencies: ['Financial Literacy', 'Budgeting'], coveragePercentage: 80.0 },
          { module: 'mental', competencies: ['Emotional Intelligence', 'Stress Management'], coveragePercentage: 70.0 },
          { module: 'values', competencies: ['Ethical Reasoning', 'Social Responsibility'], coveragePercentage: 75.0 }
        ]
      },
      content: {
        executiveSummary: 'This comprehensive CSR report demonstrates significant impact across 45 schools and 1,250 students. The program achieved a 78.4% completion rate with an average learning improvement of 23.5%. A total of 1,250 certificates were issued, maintaining cost efficiency at ₹400 per student.',
        keyHighlights: [
          'Reached 45 schools across multiple regions',
          'Impacted 1,250 students with 78.4% completion rate',
          'Achieved 23.5% average improvement in learning outcomes',
          'Issued 1,250 certificates across various modules',
          'Maintained cost efficiency of ₹400 per student'
        ],
        challenges: [
          'Limited internet connectivity in rural schools',
          'Varying levels of teacher training and support',
          'Student attendance during peak agricultural seasons',
          'Language barriers in multilingual regions'
        ],
        recommendations: [
          'Expand program to additional schools in underserved regions',
          'Implement advanced analytics for better learning outcome tracking',
          'Develop specialized modules for different grade levels',
          'Establish partnerships with local NGOs for wider reach',
          'Create parent engagement programs to improve retention'
        ],
        nextSteps: [
          'Launch Q2 2024 expansion to 20 new schools',
          'Implement AI-powered personalized learning paths',
          'Develop mobile app for better student engagement',
          'Establish alumni network for mentorship programs',
          'Create impact measurement dashboard for real-time tracking'
        ],
        testimonials: includeTestimonials ? [
          {
            quote: 'The program has transformed our students\' understanding of financial literacy. We\'ve seen remarkable improvements in their decision-making skills.',
            author: 'Dr. Priya Sharma',
            role: 'Principal',
            school: 'Delhi Public School'
          },
          {
            quote: 'Our students are now more confident and aware of mental health. The program has created a positive learning environment.',
            author: 'Mr. Rajesh Kumar',
            role: 'Vice Principal',
            school: 'Mumbai High School'
          }
        ] : []
      },
      branding: branding || {
        logoUrl: '',
        primaryColor: '#8B5CF6',
        secondaryColor: '#10B981',
        fontFamily: 'Helvetica'
      },
      status: 'generating',
      generatedBy: 'mock_user_1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simulate async PDF generation
    setTimeout(() => {
      mockReport.status = 'completed';
      mockReport.generatedAt = new Date();
      mockReport.files = {
        pdfUrl: `${mockReport.reportId}.pdf`,
        pdfSize: 2048576, // 2MB
        generatedAt: new Date()
      };
    }, 2000);

    res.json({
      success: true,
      message: 'CSR report generation started',
      data: {
        reportId: mockReport.reportId,
        reportName: mockReport.reportName,
        status: mockReport.status,
        estimatedCompletionTime: '2-3 minutes'
      }
    });
  } catch (error) {
    console.error('Error generating CSR report (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate CSR report',
      error: error.message
    });
  }
};

// Get CSR Reports (Mock)
export const getCSRReports = async (req, res) => {
  try {
    console.log('getCSRReports (MOCK) called with:', req.query);
    
    const { page = 1, limit = 10, reportType, status } = req.query;

    // Mock reports data
    const mockReports = [
      {
        _id: 'mock_report_1',
        reportId: 'CSR-2024-Q4-001',
        reportType: 'quarterly',
        reportName: 'Q4 2024 CSR Report',
        organizationId: 'mock_org_1',
        organizationName: 'Mock CSR Organization',
        period: {
          startDate: new Date('2024-10-01'),
          endDate: new Date('2024-12-31'),
          year: 2024,
          quarter: 'Q4'
        },
        status: 'completed',
        generatedAt: new Date('2024-12-31'),
        files: {
          pdfUrl: 'CSR-2024-Q4-001.pdf',
          pdfSize: 2048576,
          generatedAt: new Date('2024-12-31')
        },
        sharing: {
          downloadCount: 5,
          lastDownloadedAt: new Date('2024-12-31')
        },
        createdAt: new Date('2024-12-31')
      },
      {
        _id: 'mock_report_2',
        reportId: 'CSR-2024-Q3-002',
        reportType: 'quarterly',
        reportName: 'Q3 2024 CSR Report',
        organizationId: 'mock_org_1',
        organizationName: 'Mock CSR Organization',
        period: {
          startDate: new Date('2024-07-01'),
          endDate: new Date('2024-09-30'),
          year: 2024,
          quarter: 'Q3'
        },
        status: 'completed',
        generatedAt: new Date('2024-09-30'),
        files: {
          pdfUrl: 'CSR-2024-Q3-002.pdf',
          pdfSize: 1892341,
          generatedAt: new Date('2024-09-30')
        },
        sharing: {
          downloadCount: 3,
          lastDownloadedAt: new Date('2024-10-15')
        },
        createdAt: new Date('2024-09-30')
      },
      {
        _id: 'mock_report_3',
        reportId: 'CSR-2024-ANNUAL-003',
        reportType: 'annual',
        reportName: 'Annual CSR Impact Report 2024',
        organizationId: 'mock_org_1',
        organizationName: 'Mock CSR Organization',
        period: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          year: 2024,
          quarter: 'Q4'
        },
        status: 'generating',
        generatedAt: null,
        files: null,
        sharing: {
          downloadCount: 0,
          lastDownloadedAt: null
        },
        createdAt: new Date('2024-12-31')
      }
    ];

    // Filter based on query parameters
    let filteredReports = mockReports;
    
    if (reportType) {
      filteredReports = filteredReports.filter(r => r.reportType === reportType);
    }
    
    if (status) {
      filteredReports = filteredReports.filter(r => r.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedReports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredReports.length,
        totalPages: Math.ceil(filteredReports.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching CSR reports (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CSR reports',
      error: error.message
    });
  }
};

// Get CSR Report by ID (Mock)
export const getCSRReportById = async (req, res) => {
  try {
    console.log('getCSRReportById (MOCK) called with:', req.params);
    
    const { reportId } = req.params;

    // Mock report details
    const mockReport = {
      _id: 'mock_report_1',
      reportId: reportId,
      reportType: 'quarterly',
      reportName: 'Q4 2024 CSR Report',
      organizationId: 'mock_org_1',
      organizationName: 'Mock CSR Organization',
      period: {
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-31'),
        year: 2024,
        quarter: 'Q4'
      },
      status: 'completed',
      generatedAt: new Date('2024-12-31'),
      files: {
        pdfUrl: `${reportId}.pdf`,
        pdfSize: 2048576,
        generatedAt: new Date('2024-12-31')
      },
      sharing: {
        downloadCount: 5,
        lastDownloadedAt: new Date('2024-12-31')
      },
      metrics: {
        schoolsReached: {
          totalSchools: 45,
          activeSchools: 38
        },
        studentsReached: {
          totalStudents: 1250,
          activeStudents: 980
        },
        completionRates: {
          overallCompletionRate: 78.4
        },
        learningImprovements: {
          averageImprovement: 23.5
        },
        certificates: {
          totalIssued: 1250
        },
        financialMetrics: {
          spendPerStudent: 400
        }
      },
      createdAt: new Date('2024-12-31')
    };

    res.json({
      success: true,
      data: mockReport
    });
  } catch (error) {
    console.error('Error fetching CSR report (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CSR report',
      error: error.message
    });
  }
};

// Download CSR Report PDF (Mock)
export const downloadCSRReportPDF = async (req, res) => {
  try {
    console.log('downloadCSRReportPDF (MOCK) called with:', req.params);
    
    const { reportId } = req.params;

    // Mock PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${reportId}.pdf"`);
    
    // Return a simple PDF content (in real implementation, this would be the actual PDF file)
    res.json({
      success: true,
      message: 'PDF download initiated (mock)',
      data: {
        reportId,
        downloadUrl: `/api/csr-reports/reports/${reportId}/download`
      }
    });
  } catch (error) {
    console.error('Error downloading CSR report PDF (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download CSR report PDF',
      error: error.message
    });
  }
};

// Get Report Status (Mock)
export const getReportStatus = async (req, res) => {
  try {
    console.log('getReportStatus (MOCK) called with:', req.params);
    
    const { reportId } = req.params;

    // Mock status response
    const mockStatus = {
      reportId: reportId,
      status: 'completed',
      generatedAt: new Date(),
      files: {
        pdfUrl: `${reportId}.pdf`,
        pdfSize: 2048576,
        generatedAt: new Date()
      },
      progress: 100
    };

    res.json({
      success: true,
      data: mockStatus
    });
  } catch (error) {
    console.error('Error fetching report status (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report status',
      error: error.message
    });
  }
};

// Share Report (Mock)
export const shareReport = async (req, res) => {
  try {
    console.log('shareReport (MOCK) called with:', req.params, req.body);
    
    const { reportId } = req.params;
    const { email, role, accessLevel = 'view' } = req.body;

    // Mock sharing response
    const mockSharedWith = {
      email,
      role,
      sharedAt: new Date(),
      accessLevel
    };

    res.json({
      success: true,
      message: 'Report shared successfully',
      data: {
        sharedWith: [mockSharedWith]
      }
    });
  } catch (error) {
    console.error('Error sharing report (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share report',
      error: error.message
    });
  }
};

// Helper function
function getQuarter(date) {
  const month = date.getMonth() + 1;
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
}

export default {
  generateCSRReport,
  getCSRReports,
  getCSRReportById,
  downloadCSRReportPDF,
  getReportStatus,
  shareReport
};
