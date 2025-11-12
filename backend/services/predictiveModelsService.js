import Prediction from '../models/Prediction.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import AssignmentAttempt from '../models/AssignmentAttempt.js';
import ActivityLog from '../models/ActivityLog.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import mongoose from 'mongoose';

// ============= SCHOOL PERFORMANCE RISK =============

export const predictSchoolPerformanceRisk = async (organizationId) => {
  try {
    const organization = await Organization.findById(organizationId).lean();
    if (!organization) {
      throw new Error('Organization not found');
    }
    
    // Gather metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    const [
      totalStudents,
      activeStudents,
      totalTeachers,
      recentActivity,
      assignmentCompletion,
      paymentHistory
    ] = await Promise.all([
      User.countDocuments({ role: 'school_student', orgId: organizationId }),
      User.countDocuments({
        role: 'school_student',
        orgId: organizationId,
        lastLogin: { $gte: thirtyDaysAgo }
      }),
      User.countDocuments({ role: 'teacher', orgId: organizationId }),
      ActivityLog.countDocuments({
        userId: { $in: await User.find({ orgId: organizationId }).select('_id').lean().then(users => users.map(u => u._id)) },
        timestamp: { $gte: thirtyDaysAgo }
      }),
      AssignmentAttempt.aggregate([
        {
          $match: {
            studentId: { $in: await User.find({ role: 'school_student', orgId: organizationId }).select('_id').lean().then(users => users.map(u => u._id)) },
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: ['$submittedAt', 1, 0] } }
          }
        }
      ]),
      PaymentTransaction.find({
        organizationId: organizationId,
        status: 'completed',
        createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 3)) }
      }).lean()
    ]);
    
    const activityRate = totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0;
    const completionRate = assignmentCompletion[0]?.total > 0 
      ? (assignmentCompletion[0].completed / assignmentCompletion[0].total) * 100 
      : 0;
    const avgMonthlyRevenue = paymentHistory.length > 0
      ? paymentHistory.reduce((sum, t) => sum + (t.amount || 0), 0) / 3
      : 0;
    
    // Calculate risk score
    let riskScore = 0;
    const factors = [];
    
    if (activityRate < 30) {
      riskScore += 30;
      factors.push({
        factor: 'Low Activity Rate',
        weight: 30,
        impact: 'negative',
        value: `${activityRate.toFixed(1)}%`
      });
    } else if (activityRate < 50) {
      riskScore += 15;
      factors.push({
        factor: 'Moderate Activity Rate',
        weight: 15,
        impact: 'negative',
        value: `${activityRate.toFixed(1)}%`
      });
    }
    
    if (completionRate < 40) {
      riskScore += 25;
      factors.push({
        factor: 'Low Assignment Completion',
        weight: 25,
        impact: 'negative',
        value: `${completionRate.toFixed(1)}%`
      });
    }
    
    if (totalTeachers === 0 || totalStudents / totalTeachers > 50) {
      riskScore += 20;
      factors.push({
        factor: 'Teacher-to-Student Ratio',
        weight: 20,
        impact: 'negative',
        value: `${totalStudents}:${totalTeachers}`
      });
    }
    
    if (avgMonthlyRevenue === 0 || avgMonthlyRevenue < 1000) {
      riskScore += 25;
      factors.push({
        factor: 'Low Revenue',
        weight: 25,
        impact: 'negative',
        value: `$${avgMonthlyRevenue.toFixed(2)}`
      });
    }
    
    const result = riskScore >= 70 ? 'high_risk' : riskScore >= 40 ? 'medium_risk' : 'low_risk';
    
    const recommendations = [];
    if (riskScore >= 70) {
      recommendations.push({
        action: 'Immediate Intervention Required',
        priority: 'urgent',
        description: 'School shows multiple risk indicators. Consider assigning support team.',
        estimatedImpact: 'High'
      });
    }
    if (activityRate < 30) {
      recommendations.push({
        action: 'Increase Student Engagement',
        priority: 'high',
        description: 'Low activity rate detected. Launch engagement campaigns.',
        estimatedImpact: 'Medium'
      });
    }
    
    const prediction = new Prediction({
      predictionType: 'school_performance',
      targetId: organizationId,
      targetType: 'school',
      prediction: {
        result,
        score: riskScore,
        confidence: 85
      },
      metrics: {
        activityRate,
        completionRate,
        teacherStudentRatio: totalStudents / (totalTeachers || 1),
        avgMonthlyRevenue
      },
      factors,
      recommendations,
      organizationId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Valid for 7 days
    });
    
    await prediction.save();
    
    return await Prediction.findById(prediction._id)
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error predicting school performance risk:', error);
    throw error;
  }
};

// ============= SUBSCRIPTION RENEWAL PREDICTION =============

export const predictSubscriptionRenewal = async (organizationId) => {
  try {
    const organization = await Organization.findById(organizationId).lean();
    if (!organization) {
      throw new Error('Organization not found');
    }
    
    // Gather subscription metrics
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    
    const [
      totalPayments,
      recentPayments,
      paymentDelays,
      userGrowth,
      featureUsage
    ] = await Promise.all([
      PaymentTransaction.countDocuments({
        organizationId,
        status: 'completed'
      }),
      PaymentTransaction.countDocuments({
        organizationId,
        status: 'completed',
        createdAt: { $gte: sixMonthsAgo }
      }),
      PaymentTransaction.countDocuments({
        organizationId,
        status: 'failed',
        createdAt: { $gte: sixMonthsAgo }
      }),
      User.countDocuments({
        orgId: organizationId,
        createdAt: { $gte: sixMonthsAgo }
      }),
      ActivityLog.countDocuments({
        userId: { $in: await User.find({ orgId: organizationId }).select('_id').lean().then(users => users.map(u => u._id)) },
        timestamp: { $gte: sixMonthsAgo }
      })
    ]);
    
    // Calculate renewal probability
    let renewalScore = 70; // Base score
    const factors = [];
    
    if (recentPayments > 0 && totalPayments > 0) {
      const paymentConsistency = (recentPayments / (totalPayments / 6 * 6)) * 100;
      if (paymentConsistency > 90) {
        renewalScore += 15;
        factors.push({
          factor: 'High Payment Consistency',
          weight: 15,
          impact: 'positive',
          value: `${paymentConsistency.toFixed(1)}%`
        });
      } else if (paymentConsistency < 50) {
        renewalScore -= 20;
        factors.push({
          factor: 'Low Payment Consistency',
          weight: 20,
          impact: 'negative',
          value: `${paymentConsistency.toFixed(1)}%`
        });
      }
    }
    
    const failureRate = totalPayments > 0 ? (paymentDelays / totalPayments) * 100 : 0;
    if (failureRate > 20) {
      renewalScore -= 25;
      factors.push({
        factor: 'High Payment Failure Rate',
        weight: 25,
        impact: 'negative',
        value: `${failureRate.toFixed(1)}%`
      });
    }
    
    if (userGrowth > 10) {
      renewalScore += 10;
      factors.push({
        factor: 'Positive User Growth',
        weight: 10,
        impact: 'positive',
        value: `+${userGrowth} users`
      });
    }
    
    const result = renewalScore >= 75 ? 'likely_to_renew' : renewalScore >= 50 ? 'moderate_renewal' : 'unlikely_to_renew';
    
    const recommendations = [];
    if (renewalScore < 50) {
      recommendations.push({
        action: 'Engage with Retention Campaign',
        priority: 'high',
        description: 'Low renewal probability. Consider offering incentives or addressing concerns.',
        estimatedImpact: 'High'
      });
    }
    
    const prediction = new Prediction({
      predictionType: 'subscription_renewal',
      targetId: organizationId,
      targetType: 'organization',
      prediction: {
        result,
        score: renewalScore,
        probability: renewalScore / 100,
        confidence: 80
      },
      metrics: {
        paymentConsistency: recentPayments / (totalPayments / 6 * 6) * 100,
        failureRate,
        userGrowth,
        featureUsage
      },
      factors,
      recommendations,
      organizationId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Valid for 30 days
    });
    
    await prediction.save();
    
    return await Prediction.findById(prediction._id)
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error predicting subscription renewal:', error);
    throw error;
  }
};

// ============= CHEATING DETECTION =============

export const detectCheating = async (examId, studentId) => {
  try {
    // Get exam attempts
    const attempts = await AssignmentAttempt.find({
      assignmentId: examId,
      studentId: studentId
    }).sort({ createdAt: -1 }).lean();
    
    if (attempts.length === 0) {
      throw new Error('No exam attempts found');
    }
    
    const latestAttempt = attempts[0];
    
    // Analyze for cheating indicators
    let suspicionScore = 0;
    const factors = [];
    
    // Check time spent vs questions
    const timePerQuestion = latestAttempt.timeSpent 
      ? latestAttempt.timeSpent / (latestAttempt.answers?.length || 1)
      : null;
    
    if (timePerQuestion && timePerQuestion < 10) {
      suspicionScore += 30;
      factors.push({
        factor: 'Unusually Fast Completion',
        weight: 30,
        impact: 'negative',
        value: `${timePerQuestion.toFixed(1)}s per question`
      });
    }
    
    // Check answer pattern (too many correct answers in suspicious pattern)
    const answers = latestAttempt.answers || [];
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const suspiciousPattern = answers.length > 0 && correctAnswers / answers.length > 0.95;
    
    if (suspiciousPattern && answers.length > 20) {
      suspicionScore += 25;
      factors.push({
        factor: 'Suspiciously High Accuracy',
        weight: 25,
        impact: 'negative',
        value: `${((correctAnswers / answers.length) * 100).toFixed(1)}%`
      });
    }
    
    // Check for tab switching (if available in metadata)
    if (latestAttempt.metadata?.tabSwitches > 10) {
      suspicionScore += 20;
      factors.push({
        factor: 'Multiple Tab Switches',
        weight: 20,
        impact: 'negative',
        value: `${latestAttempt.metadata.tabSwitches} switches`
      });
    }
    
    // Compare with historical performance
    if (attempts.length > 1) {
      const avgScore = attempts.slice(1).reduce((sum, a) => sum + (a.score || 0), 0) / (attempts.length - 1);
      const scoreImprovement = (latestAttempt.score || 0) - avgScore;
      
      if (scoreImprovement > 40) {
        suspicionScore += 25;
        factors.push({
          factor: 'Significant Score Improvement',
          weight: 25,
          impact: 'negative',
          value: `+${scoreImprovement.toFixed(1)} points`
        });
      }
    }
    
    const result = suspicionScore >= 50 ? 'suspicious' : suspicionScore >= 30 ? 'moderate_suspicion' : 'normal';
    
    const recommendations = [];
    if (suspicionScore >= 50) {
      recommendations.push({
        action: 'Review Exam Attempt',
        priority: 'high',
        description: 'High suspicion of cheating. Manual review recommended.',
        estimatedImpact: 'High'
      });
    }
    
    const prediction = new Prediction({
      predictionType: 'cheating_detection',
      targetId: examId,
      targetType: 'exam',
      prediction: {
        result,
        score: suspicionScore,
        confidence: 75
      },
      metrics: {
        timePerQuestion,
        accuracy: answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0,
        tabSwitches: latestAttempt.metadata?.tabSwitches || 0
      },
      factors,
      recommendations,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    await prediction.save();
    
    return await Prediction.findById(prediction._id).lean();
  } catch (error) {
    console.error('Error detecting cheating:', error);
    throw error;
  }
};

// ============= TEACHER TRAINING NEEDS =============

export const identifyTrainingNeeds = async (teacherId) => {
  try {
    const teacher = await User.findById(teacherId).lean();
    if (!teacher || teacher.role !== 'teacher') {
      throw new Error('Teacher not found');
    }
    
    // Gather teacher metrics
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
    
    const [
      assignmentsCreated,
      studentEngagement,
      feedbackReceived,
      recentActivity
    ] = await Promise.all([
      AssignmentAttempt.countDocuments({
        createdBy: teacherId,
        createdAt: { $gte: threeMonthsAgo }
      }),
      ActivityLog.countDocuments({
        userId: { $in: await User.find({ linkedIds: { teacherIds: teacherId } }).select('_id').lean().then(users => users.map(u => u._id)) },
        timestamp: { $gte: threeMonthsAgo }
      }),
      // Simulated feedback score (would come from feedback system)
      0,
      ActivityLog.countDocuments({
        userId: teacherId,
        timestamp: { $gte: threeMonthsAgo }
      })
    ]);
    
    // Calculate training need score
    let trainingNeedScore = 0;
    const factors = [];
    const trainingAreas = [];
    
    if (assignmentsCreated < 5) {
      trainingNeedScore += 30;
      trainingAreas.push('Assignment Creation');
      factors.push({
        factor: 'Low Assignment Creation',
        weight: 30,
        impact: 'negative',
        value: `${assignmentsCreated} assignments`
      });
    }
    
    if (studentEngagement < 50) {
      trainingNeedScore += 25;
      trainingAreas.push('Student Engagement');
      factors.push({
        factor: 'Low Student Engagement',
        weight: 25,
        impact: 'negative',
        value: `${studentEngagement} activities`
      });
    }
    
    if (recentActivity < 20) {
      trainingNeedScore += 20;
      trainingAreas.push('Platform Usage');
      factors.push({
        factor: 'Low Platform Activity',
        weight: 20,
        impact: 'negative',
        value: `${recentActivity} activities`
      });
    }
    
    const result = trainingNeedScore >= 50 ? 'high_need' : trainingNeedScore >= 30 ? 'moderate_need' : 'low_need';
    
    const recommendations = [];
    if (trainingNeedScore >= 50) {
      recommendations.push({
        action: 'Comprehensive Training Program',
        priority: 'high',
        description: `Teacher needs training in: ${trainingAreas.join(', ')}`,
        estimatedImpact: 'High'
      });
    } else if (trainingNeedScore >= 30) {
      recommendations.push({
        action: 'Targeted Training Session',
        priority: 'medium',
        description: `Focus on: ${trainingAreas[0] || 'General Platform Usage'}`,
        estimatedImpact: 'Medium'
      });
    }
    
    const prediction = new Prediction({
      predictionType: 'training_need',
      targetId: teacherId,
      targetType: 'teacher',
      prediction: {
        result,
        score: trainingNeedScore,
        confidence: 80
      },
      metrics: {
        assignmentsCreated,
        studentEngagement,
        recentActivity
      },
      factors,
      recommendations,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    
    await prediction.save();
    
    return await Prediction.findById(prediction._id)
      .populate('targetId', 'fullName name email')
      .lean();
  } catch (error) {
    console.error('Error identifying training needs:', error);
    throw error;
  }
};

// ============= WORKLOAD FORECAST =============

export const forecastWorkload = async (organizationId = null, timePeriod = 'month') => {
  try {
    const now = new Date();
    let forecastDate = new Date();
    
    if (timePeriod === 'month') {
      forecastDate.setMonth(forecastDate.getMonth() + 1);
    } else if (timePeriod === 'quarter') {
      forecastDate.setMonth(forecastDate.getMonth() + 3);
    }
    
    // Get historical workload data
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
    
    const orgFilter = organizationId ? { organizationId: new mongoose.Types.ObjectId(organizationId) } : {};
    
    const [
      historicalMessages,
      historicalTickets,
      historicalIncidents,
      userGrowth
    ] = await Promise.all([
      ActivityLog.countDocuments({
        activityType: 'communication',
        timestamp: { $gte: threeMonthsAgo }
      }),
      // Support tickets (would use SupportTicket model if available)
      0,
      // Incidents (would use Incident model if available)
      0,
      User.countDocuments({
        createdAt: { $gte: threeMonthsAgo },
        ...(organizationId ? { orgId: organizationId } : {})
      })
    ]);
    
    // Calculate trend
    const monthlyAvg = historicalMessages / 3;
    const growthFactor = userGrowth / 100; // Simplified growth factor
    
    // Forecast workload
    const predictedMessages = monthlyAvg * (1 + growthFactor);
    const predictedTickets = historicalTickets * (1 + growthFactor);
    const predictedIncidents = historicalIncidents * (1 + growthFactor);
    
    const totalWorkload = predictedMessages + predictedTickets + predictedIncidents;
    
    // Determine workload level
    let workloadLevel = 'normal_workload';
    let workloadScore = 50;
    
    if (totalWorkload > 1000) {
      workloadLevel = 'high';
      workloadScore = 80;
    } else if (totalWorkload < 300) {
      workloadLevel = 'low';
      workloadScore = 20;
    }
    
    const factors = [
      {
        factor: 'User Growth Trend',
        weight: 30,
        impact: growthFactor > 0.1 ? 'negative' : 'positive',
        value: `+${(growthFactor * 100).toFixed(1)}%`
      },
      {
        factor: 'Historical Average',
        weight: 40,
        impact: 'neutral',
        value: `${monthlyAvg.toFixed(0)} per month`
      }
    ];
    
    const recommendations = [];
    if (workloadLevel === 'high') {
      recommendations.push({
        action: 'Scale Resources',
        priority: 'high',
        description: 'High workload predicted. Consider adding support staff or automating processes.',
        estimatedImpact: 'High'
      });
    }
    
    const prediction = new Prediction({
      predictionType: 'workload_forecast',
      targetId: organizationId || new mongoose.Types.ObjectId(),
      targetType: organizationId ? 'organization' : 'system',
      prediction: {
        result: workloadLevel,
        score: workloadScore,
        confidence: 75
      },
      metrics: {
        predictedMessages,
        predictedTickets,
        predictedIncidents,
        totalWorkload,
        growthFactor
      },
      factors,
      recommendations,
      organizationId: organizationId || undefined,
      expiresAt: forecastDate
    });
    
    await prediction.save();
    
    return await Prediction.findById(prediction._id)
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error forecasting workload:', error);
    throw error;
  }
};

// Get all predictions
export const getPredictions = async (filters = {}) => {
  try {
    const {
      predictionType = 'all',
      targetType = 'all',
      organizationId = null,
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    
    if (predictionType !== 'all') {
      query.predictionType = predictionType;
    }
    
    if (targetType !== 'all') {
      query.targetType = targetType;
    }
    
    if (organizationId) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    const total = await Prediction.countDocuments(query);
    
    const predictions = await Prediction.find(query)
      .sort({ predictedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('targetId')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return {
      predictions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting predictions:', error);
    throw error;
  }
};

// Get prediction statistics
export const getPredictionStats = async () => {
  try {
    const [
      totalPredictions,
      byType,
      highRiskSchools,
      suspiciousExams,
      teachersNeedingTraining,
      recentPredictions
    ] = await Promise.all([
      Prediction.countDocuments(),
      Prediction.aggregate([
        { $group: { _id: '$predictionType', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      Prediction.countDocuments({
        predictionType: 'school_performance',
        'prediction.result': 'high_risk'
      }),
      Prediction.countDocuments({
        predictionType: 'cheating_detection',
        'prediction.result': 'suspicious'
      }),
      Prediction.countDocuments({
        predictionType: 'training_need',
        'prediction.result': { $in: ['high_need', 'moderate_need'] }
      }),
      Prediction.find()
        .sort({ predictedAt: -1 })
        .limit(10)
        .lean()
    ]);
    
    return {
      total: totalPredictions,
      byType: byType || [],
      highRiskSchools: highRiskSchools || 0,
      suspiciousExams: suspiciousExams || 0,
      teachersNeedingTraining: teachersNeedingTraining || 0,
      recentPredictions: recentPredictions || []
    };
  } catch (error) {
    console.error('Error getting prediction stats:', error);
    throw error;
  }
};

export default {
  predictSchoolPerformanceRisk,
  predictSubscriptionRenewal,
  detectCheating,
  identifyTrainingNeeds,
  forecastWorkload,
  getPredictions,
  getPredictionStats
};

