import mongoose from 'mongoose';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import ActivityLog from '../models/ActivityLog.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import Redemption from '../models/Redemption.js';
import adminTrackingService from '../services/adminTrackingService.js';

// Get admin reports
export const getAdminReports = async (req, res) => {
  try {
    const { reportType = 'overview', timeRange = 'month', startDate, endDate } = req.query;

    // Calculate date range
    const now = new Date();
    let startDateObj, endDateObj;

    if (startDate && endDate) {
      startDateObj = new Date(startDate);
      endDateObj = new Date(endDate);
    } else {
      switch (timeRange) {
        case 'week':
          startDateObj = new Date(now.setDate(now.getDate() - 7));
          endDateObj = new Date();
          break;
        case 'quarter':
          startDateObj = new Date(now.setMonth(now.getMonth() - 3));
          endDateObj = new Date();
          break;
        case 'year':
          startDateObj = new Date(now.setFullYear(now.getFullYear() - 1));
          endDateObj = new Date();
          break;
        case 'all':
          startDateObj = null;
          endDateObj = null;
          break;
        default: // month
          startDateObj = new Date(now.setMonth(now.getMonth() - 1));
          endDateObj = new Date();
      }
    }

    const dateFilter = startDateObj && endDateObj ? {
      $gte: startDateObj,
      $lte: endDateObj
    } : {};

    let reportData = {};

    switch (reportType) {
      case 'overview':
        {
          const [totalUsers, totalSchools, totalStudents, overviewData] = await Promise.all([
            User.countDocuments(),
            Organization.countDocuments({ type: 'school', isActive: true }),
            User.countDocuments({ role: { $in: ['student', 'school_student'] } }),
            adminTrackingService.getPlatformOverview()
          ]);

          const previousPeriodUsers = await User.countDocuments({
            createdAt: { $lt: startDateObj || new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
          });
          const growthRate = previousPeriodUsers > 0 
            ? Math.round(((totalUsers - previousPeriodUsers) / previousPeriodUsers) * 100)
            : 0;

          reportData = {
            totalUsers,
            totalSchools,
            totalStudents: totalStudents || overviewData.totalStudents,
            overview: overviewData,
            growthRate,
            activityRate: overviewData.activeUsers || 0,
            engagementRate: overviewData.activeUsers > 0 && overviewData.totalUsers > 0
              ? Math.round((overviewData.activeUsers / overviewData.totalUsers) * 100)
              : 0
          };
        }
        break;

      case 'users':
        {
          const newUsersFilter = startDateObj ? { createdAt: dateFilter } : {};
          const [totalUsers, newUsers, activeUsers, totalSessions] = await Promise.all([
            User.countDocuments(),
            User.countDocuments(newUsersFilter),
            User.countDocuments({
              lastActiveAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }),
            ActivityLog.countDocuments(startDateObj ? { timestamp: dateFilter } : {})
          ]);

          const userGrowth = totalUsers > 0 
            ? Math.round((newUsers / totalUsers) * 100)
            : 0;

          reportData = {
            totalUsers,
            newUsers,
            activeUsers,
            totalSessions,
            avgSessionTime: 15, // Placeholder - would calculate from activity logs
            userGrowth,
            studentGrowth: 0
          };
        }
        break;

      case 'schools':
        {
          const schoolsFilter = startDateObj ? { createdAt: dateFilter } : {};
          const [totalSchools, activeSchools, newSchools, overviewData] = await Promise.all([
            Organization.countDocuments({ type: 'school' }),
            Organization.countDocuments({ type: 'school', isActive: true }),
            Organization.countDocuments({ type: 'school', ...schoolsFilter }),
            adminTrackingService.getPlatformOverview()
          ]);

          // Get schools by region
          const schools = await Organization.find({ type: 'school' })
            .select('settings.address.state')
            .lean();
          
          const regionMap = {};
          schools.forEach(school => {
            const region = school.settings?.address?.state || 'Unknown';
            regionMap[region] = (regionMap[region] || 0) + 1;
          });

          const schoolsByRegion = Object.entries(regionMap).map(([region, total]) => ({
            region,
            totalSchools: total
          }));

          const schoolGrowth = totalSchools > 0 
            ? Math.round((newSchools / totalSchools) * 100)
            : 0;

          reportData = {
            totalSchools,
            activeSchools,
            newSchools,
            totalRegions: schoolsByRegion.length,
            schoolsByRegion,
            schoolGrowth
          };
        }
        break;

      case 'activity':
        {
          const activityFilter = startDateObj ? { timestamp: dateFilter } : {};
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const [totalActivities, todayActivities, activitiesByType] = await Promise.all([
            ActivityLog.countDocuments(activityFilter),
            ActivityLog.countDocuments({ timestamp: { $gte: todayStart } }),
            ActivityLog.aggregate([
              { $match: activityFilter },
              { $group: { _id: '$activityType', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ])
          ]);

          const topActivity = activitiesByType.length > 0 ? activitiesByType[0]._id : 'N/A';

          reportData = {
            totalActivities,
            todayActivities,
            topActivity,
            peakHour: '14:00', // Placeholder
            activityRate: totalActivities > 0 ? Math.round((todayActivities / totalActivities) * 100) : 0
          };
        }
        break;

      case 'compliance':
        {
          const db = mongoose.connection.db;
          const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
          const consentedStudents = await db.collection('schoolstudents').countDocuments({
            isActive: true,
            'consentFlags': { $exists: false }
          });

          reportData = {
            complianceRate: totalStudents > 0 
              ? Math.round((consentedStudents / totalStudents) * 100)
              : 99,
            privacyIncidents: 0, // Would fetch from incidents collection
            totalStudents
          };
        }
        break;

      case 'financial':
        {
          const transactionFilter = startDateObj ? { createdAt: dateFilter } : {};
          const [transactions, totalAmount] = await Promise.all([
            PaymentTransaction.countDocuments(transactionFilter),
            PaymentTransaction.aggregate([
              { $match: transactionFilter },
              { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
          ]);

          const refunds = await PaymentTransaction.countDocuments({
            ...transactionFilter,
            status: 'refunded'
          });

          const refundAmount = await PaymentTransaction.aggregate([
            { $match: { ...transactionFilter, status: 'refunded' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]);

          reportData = {
            totalTransactions: transactions,
            totalRevenue: totalAmount[0]?.total || 0,
            avgTransaction: transactions > 0 
              ? Math.round((totalAmount[0]?.total || 0) / transactions)
              : 0,
            totalRefunds: refundAmount[0]?.total || 0
          };
        }
        break;

      default:
        reportData = { message: 'Invalid report type' };
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('admin:stats:update', reportData);
    }

    res.json({
      success: true,
      data: reportData,
      reportType,
      timeRange,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report data',
      error: error.message
    });
  }
};

// Export admin reports
export const exportAdminReport = async (req, res) => {
  try {
    const { reportType = 'overview', timeRange = 'month', format = 'pdf', startDate, endDate } = req.query;

    // Fetch report data
    const reportReq = { ...req, query: { reportType, timeRange, startDate, endDate } };
    const reportRes = { json: (data) => data };
    const reportData = await getAdminReports(reportReq, reportRes);

    if (format === 'csv') {
      // Generate CSV
      const csvRows = [];
      csvRows.push('Admin Report');
      csvRows.push(`Report Type: ${reportType}`);
      csvRows.push(`Time Range: ${timeRange}`);
      csvRows.push(`Generated: ${new Date().toISOString()}`);
      csvRows.push('');
      csvRows.push('Metric,Value');

      Object.entries(reportData.data || {}).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            csvRows.push(`${key}.${subKey},${subValue}`);
          });
        } else {
          csvRows.push(`${key},${value}`);
        }
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=admin-report-${reportType}-${Date.now()}.csv`);
      res.send(csvRows.join('\n'));
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=admin-report-${reportType}-${Date.now()}.json`);
      res.json(reportData.data);
    } else {
      // PDF format - for now, return JSON (PDF generation would require a library like pdfkit)
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=admin-report-${reportType}-${Date.now()}.json`);
      res.json({
        ...reportData.data,
        format: 'pdf',
        note: 'PDF generation coming soon. Exported as JSON for now.'
      });
    }
  } catch (error) {
    console.error('Error exporting admin report:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting report',
      error: error.message
    });
  }
};

export default {
  getAdminReports,
  exportAdminReport
};

