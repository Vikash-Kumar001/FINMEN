import Content from '../models/Content.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

// Age-appropriateness check
const checkAgeAppropriateness = (content, userAge) => {
  const issues = [];
  
  // Check age rating
  if (content.ageRating) {
    const ageMap = {
      'all': 0,
      '3+': 3,
      '7+': 7,
      '10+': 10,
      '13+': 13,
      '16+': 16,
      '18+': 18
    };
    
    const minAge = ageMap[content.ageRating] || 0;
    if (userAge < minAge) {
      issues.push({
        type: 'age_rating',
        severity: 'high',
        message: `Content rated ${content.ageRating} but user is ${userAge} years old`
      });
    }
  }
  
  // Check explicit age range
  if (content.minAge && userAge < content.minAge) {
    issues.push({
      type: 'min_age',
      severity: 'high',
      message: `Content requires minimum age ${content.minAge} but user is ${userAge}`
    });
  }
  
  if (content.maxAge && userAge > content.maxAge) {
    issues.push({
      type: 'max_age',
      severity: 'medium',
      message: `Content is for ages up to ${content.maxAge} but user is ${userAge}`
    });
  }
  
  // Keyword-based content analysis (simplified)
  const contentText = JSON.stringify(content.content || {}).toLowerCase();
  const inappropriateKeywords = ['violence', 'explicit', 'adult'];
  const foundKeywords = inappropriateKeywords.filter(keyword => contentText.includes(keyword));
  
  if (foundKeywords.length > 0 && userAge < 13) {
    issues.push({
      type: 'content_analysis',
      severity: 'high',
      message: `Potentially inappropriate content detected for age ${userAge}`,
      keywords: foundKeywords
    });
  }
  
  return {
    isAppropriate: issues.length === 0,
    issues
  };
};

// Region restriction check
const checkRegionAccess = (content, userRegion) => {
  if (!userRegion) {
    return { allowed: true };
  }
  
  // Check blocked regions first
  if (content.blockedRegions && content.blockedRegions.includes(userRegion)) {
    return {
      allowed: false,
      reason: 'Region is blocked',
      restriction: content.regionRestrictions?.find(r => r.region === userRegion)
    };
  }
  
  // Check allowed regions (if specified, only those are allowed)
  if (content.allowedRegions && content.allowedRegions.length > 0) {
    if (!content.allowedRegions.includes(userRegion)) {
      return {
        allowed: false,
        reason: 'Region not in allowed list'
      };
    }
  }
  
  return { allowed: true };
};

// Calculate content performance metrics
const calculatePerformanceMetrics = (content) => {
  const analytics = content.analytics || {};
  
  // Engagement Score (0-100)
  const views = analytics.views || 0;
  const completions = analytics.completions || 0;
  const downloads = analytics.downloads || 0;
  const shares = analytics.shares || 0;
  const rating = analytics.averageRating || 0;
  
  // Completion rate
  const completionRate = views > 0 ? (completions / views) * 100 : 0;
  
  // Engagement components
  const viewScore = Math.min(views / 100, 1) * 30; // Max 30 points
  const completionScore = completionRate * 0.4; // Max 40 points
  const ratingScore = rating * 4; // Max 20 points (5 * 4)
  const shareScore = Math.min(shares / 10, 1) * 10; // Max 10 points
  
  const engagementScore = Math.round(viewScore + completionScore + ratingScore + shareScore);
  
  // Performance status
  let performanceStatus = 'poor';
  if (engagementScore >= 70) {
    performanceStatus = 'excellent';
  } else if (engagementScore >= 50) {
    performanceStatus = 'good';
  } else if (engagementScore >= 30) {
    performanceStatus = 'fair';
  }
  
  return {
    engagementScore,
    completionRate: Math.round(completionRate * 10) / 10,
    performanceStatus,
    views,
    completions,
    downloads,
    shares,
    averageRating: Math.round(rating * 10) / 10,
    ratingCount: analytics.ratingCount || 0
  };
};

// Get all content with filters
export const getContent = async (filters = {}) => {
  try {
    const {
      status = 'all',
      type = 'all',
      category = 'all',
      search = '',
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ageRating = 'all',
      region = 'all'
    } = filters;
    
    // Build query
    const query = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (type !== 'all') {
      query.type = type;
    }
    
    if (category !== 'all') {
      query.category = category;
    }
    
    if (ageRating !== 'all') {
      query.ageRating = ageRating;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' }},
        { description: { $regex: search, $options: 'i' }},
        { tags: { $in: [new RegExp(search, 'i')] }},
        { keywords: { $in: [new RegExp(search, 'i')] }}
      ];
    }
    
    // Count total
    const total = await Content.countDocuments(query);
    
    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Fetch content
    const contentList = await Content.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'fullName email role')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    // Enrich with performance metrics
    const enrichedContent = contentList.map(content => {
      const performance = calculatePerformanceMetrics(content);
      const regionCheck = region !== 'all' ? checkRegionAccess(content, region) : { allowed: true };
      
      return {
        ...content,
        performance,
        regionAccess: regionCheck
      };
    });
    
    return {
      content: enrichedContent,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
};

// Get content by ID
export const getContentById = async (contentId) => {
  try {
    const content = await Content.findById(contentId)
      .populate('createdBy', 'fullName email role')
      .populate('approvedBy', 'fullName email')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    const performance = calculatePerformanceMetrics(content);
    
    return {
      ...content,
      performance
    };
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
};

// Approve content
export const approveContent = async (contentId, approvedBy, comments) => {
  try {
    const content = await Content.findById(contentId);
    if (!content) {
      throw new Error('Content not found');
    }
    
    content.status = 'approved';
    content.approvedBy = approvedBy;
    content.approvedAt = new Date();
    
    // Add to audit trail
    content.auditTrail = content.auditTrail || [];
    content.auditTrail.push({
      action: 'approved',
      performedBy: approvedBy,
      performedAt: new Date(),
      changes: { status: 'approved' },
      reason: comments
    });
    
    await content.save();
    
    return await getContentById(contentId);
  } catch (error) {
    console.error('Error approving content:', error);
    throw error;
  }
};

// Reject content
export const rejectContent = async (contentId, rejectedBy, rejectionReason) => {
  try {
    const content = await Content.findById(contentId);
    if (!content) {
      throw new Error('Content not found');
    }
    
    content.status = 'rejected';
    content.rejectedBy = rejectedBy;
    content.rejectedAt = new Date();
    content.rejectionReason = rejectionReason;
    
    // Add to audit trail
    content.auditTrail = content.auditTrail || [];
    content.auditTrail.push({
      action: 'rejected',
      performedBy: rejectedBy,
      performedAt: new Date(),
      changes: { status: 'rejected' },
      reason: rejectionReason
    });
    
    await content.save();
    
    return await getContentById(contentId);
  } catch (error) {
    console.error('Error rejecting content:', error);
    throw error;
  }
};

// Check age appropriateness for user
export const checkContentAgeAppropriate = async (contentId, userAge) => {
  try {
    const content = await Content.findById(contentId).lean();
    if (!content) {
      throw new Error('Content not found');
    }
    
    const check = checkAgeAppropriateness(content, userAge);
    
    return {
      contentId: content._id,
      title: content.title,
      ageRating: content.ageRating,
      minAge: content.minAge,
      maxAge: content.maxAge,
      userAge,
      ...check
    };
  } catch (error) {
    console.error('Error checking age appropriateness:', error);
    throw error;
  }
};

// Set region restrictions
export const setRegionRestrictions = async (contentId, restrictions, setBy) => {
  try {
    const content = await Content.findById(contentId);
    if (!content) {
      throw new Error('Content not found');
    }
    
    content.allowedRegions = restrictions.allowedRegions || [];
    content.blockedRegions = restrictions.blockedRegions || [];
    
    // Add region restrictions to audit trail
    if (restrictions.blockedRegions) {
      restrictions.blockedRegions.forEach(region => {
        const existing = content.regionRestrictions?.find(r => r.region === region);
        if (!existing) {
          content.regionRestrictions = content.regionRestrictions || [];
          content.regionRestrictions.push({
            region,
            reason: restrictions.reason || 'Content restriction',
            blockedBy: setBy,
            blockedAt: new Date()
          });
        }
      });
    }
    
    // Add to audit trail
    content.auditTrail = content.auditTrail || [];
    content.auditTrail.push({
      action: 'region_restriction_set',
      performedBy: setBy,
      performedAt: new Date(),
      changes: restrictions
    });
    
    await content.save();
    
    return await getContentById(contentId);
  } catch (error) {
    console.error('Error setting region restrictions:', error);
    throw error;
  }
};

// Get content analytics
export const getContentAnalytics = async (filters = {}) => {
  try {
    const { timeRange = 'month', contentId, type = 'all', category = 'all' } = filters;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    const query = {
      createdAt: { $gte: startDate },
      status: { $in: ['approved', 'published'] }
    };
    
    if (contentId) {
      query._id = new mongoose.Types.ObjectId(contentId);
    }
    
    if (type !== 'all') {
      query.type = type;
    }
    
    if (category !== 'all') {
      query.category = category;
    }
    
    // Get top performing content
    const topContent = await Content.find(query)
      .sort({ 'analytics.engagementScore': -1 })
      .limit(10)
      .select('title type category analytics')
      .lean();
    
    // Get worst performing content
    const worstContent = await Content.find(query)
      .sort({ 'analytics.engagementScore': 1 })
      .limit(10)
      .select('title type category analytics')
      .lean();
    
    // Aggregate statistics
    const stats = await Content.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalContent: { $sum: 1 },
          totalViews: { $sum: '$analytics.views' },
          totalCompletions: { $sum: '$analytics.completions' },
          totalDownloads: { $sum: '$analytics.downloads' },
          avgEngagementScore: { $avg: '$analytics.engagementScore' },
          avgRating: { $avg: '$analytics.averageRating' }
        }
      }
    ]);
    
    // Content by type
    const byType = await Content.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalViews: { $sum: '$analytics.views' },
          avgEngagement: { $avg: '$analytics.engagementScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Content by category
    const byCategory = await Content.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$analytics.views' },
          avgEngagement: { $avg: '$analytics.engagementScore' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Performance distribution
    const performanceDistribution = {
      excellent: await Content.countDocuments({ ...query, 'analytics.engagementScore': { $gte: 70 }}),
      good: await Content.countDocuments({ ...query, 'analytics.engagementScore': { $gte: 50, $lt: 70 }}),
      fair: await Content.countDocuments({ ...query, 'analytics.engagementScore': { $gte: 30, $lt: 50 }}),
      poor: await Content.countDocuments({ ...query, 'analytics.engagementScore': { $lt: 30 }})
    };
    
    const statData = stats[0] || {};
    const overallCompletionRate = statData.totalViews > 0
      ? (statData.totalCompletions / statData.totalViews) * 100
      : 0;
    
    return {
      summary: {
        totalContent: statData.totalContent || 0,
        totalViews: statData.totalViews || 0,
        totalCompletions: statData.totalCompletions || 0,
        totalDownloads: statData.totalDownloads || 0,
        avgEngagementScore: Math.round((statData.avgEngagementScore || 0) * 10) / 10,
        avgRating: Math.round((statData.avgRating || 0) * 10) / 10,
        overallCompletionRate: Math.round(overallCompletionRate * 10) / 10
      },
      topContent: topContent.map(c => ({
        ...c,
        performance: calculatePerformanceMetrics(c)
      })),
      worstContent: worstContent.map(c => ({
        ...c,
        performance: calculatePerformanceMetrics(c)
      })),
      byType: byType || [],
      byCategory: byCategory || [],
      performanceDistribution
    };
  } catch (error) {
    console.error('Error getting content analytics:', error);
    throw error;
  }
};

// Get content governance statistics
export const getGovernanceStats = async (filters = {}) => {
  try {
    const { organizationId } = filters;
    
    const query = {};
    if (organizationId) {
      query.organizationId = organizationId;
    }
    
    const [
      totalContent,
      pendingReview,
      approved,
      rejected,
      published,
      byAgeRating,
      byRegion
    ] = await Promise.all([
      Content.countDocuments(query),
      Content.countDocuments({ ...query, status: 'pending' }),
      Content.countDocuments({ ...query, status: 'approved' }),
      Content.countDocuments({ ...query, status: 'rejected' }),
      Content.countDocuments({ ...query, status: 'published' }),
      Content.aggregate([
        { $match: query },
        { $group: { _id: '$ageRating', count: { $sum: 1 }}}
      ]),
      Content.aggregate([
        { $match: { ...query, blockedRegions: { $exists: true, $ne: [] }}},
        { $group: { _id: null, totalBlocked: { $sum: { $size: '$blockedRegions' }}}}
      ])
    ]);
    
    return {
      total: totalContent,
      pendingReview,
      approved,
      rejected,
      published,
      byAgeRating: byAgeRating || [],
      totalRegionRestrictions: byRegion[0]?.totalBlocked || 0,
      approvalRate: totalContent > 0 
        ? Math.round((approved / totalContent) * 100) 
        : 0
    };
  } catch (error) {
    console.error('Error getting governance stats:', error);
    throw error;
  }
};

export default {
  getContent,
  getContentById,
  approveContent,
  rejectContent,
  checkContentAgeAppropriate,
  setRegionRestrictions,
  getContentAnalytics,
  getGovernanceStats,
  calculatePerformanceMetrics,
  checkAgeAppropriateness,
  checkRegionAccess
};

