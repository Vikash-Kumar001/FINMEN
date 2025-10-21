import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Target, FileText, CheckCircle,
  Play, Rocket, Save, X, Plus, Minus, Calendar, Users,
  MapPin, BookOpen, Brain, Heart, Star, DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import campaignService from '../../services/campaignService';

const CampaignWizard = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignData, setCampaignData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    type: 'general',
    category: '',
    scope: {
      targetAudience: 'all_students',
      gradeLevels: [],
      regions: [],
      schools: [],
      maxParticipants: 1000,
      minParticipants: 10
    },
    timeline: {
      startDate: '',
      endDate: '',
      pilotStartDate: '',
      pilotEndDate: '',
      rolloutDate: ''
    },
    objectives: [],
    successMetrics: {
      engagementRate: 0,
      completionRate: 0,
      satisfactionScore: 0,
      knowledgeGain: 0,
      behaviorChange: 0
    },
    budget: {
      totalBudget: 0,
      currency: 'INR'
    },
    healCoins: {
      totalFunded: 0,
      rewardStructure: {
        participation: 10,
        completion: 50,
        excellence: 100
      }
    },
    templates: []
  });

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 'scope', title: 'Scope Definition', icon: Target, description: 'Define campaign scope and target audience' },
    { id: 'templates', title: 'Template Selection', icon: FileText, description: 'Select learning templates and content' },
    { id: 'approval', title: 'Approval Setup', icon: CheckCircle, description: 'Set up approval workflow and reviewers' },
    { id: 'pilot', title: 'Pilot Configuration', icon: Play, description: 'Configure pilot testing parameters' },
    { id: 'rollout', title: 'Rollout Planning', icon: Rocket, description: 'Plan full rollout and launch strategy' }
  ];

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await campaignService.getCampaignTemplates();
        setTemplates(response.data);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };
    loadTemplates();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle array changes
  const handleArrayChange = (parent, field, value, action = 'add') => {
    setCampaignData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: action === 'add' 
          ? [...prev[parent][field], value]
          : prev[parent][field].filter(item => item !== value)
      }
    }));
  };

  // Next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Create campaign
  const createCampaign = async () => {
    setLoading(true);
    try {
      const response = await campaignService.createCampaign(campaignData);
      toast.success('Campaign created successfully!');
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Scope Definition
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
              <input
                type="text"
                value={campaignData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={campaignData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the campaign objectives and approach"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
              <select
                value={campaignData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="wellness">Wellness & Mental Health</option>
                <option value="financial_literacy">Financial Literacy</option>
                <option value="values_education">Values Education</option>
                <option value="ai_skills">AI & Digital Skills</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <select
                value={campaignData.scope.targetAudience}
                onChange={(e) => handleNestedChange('scope', 'targetAudience', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all_students">All Students</option>
                <option value="specific_grades">Specific Grades</option>
                <option value="specific_schools">Specific Schools</option>
                <option value="specific_regions">Specific Regions</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={campaignData.timeline.startDate}
                  onChange={(e) => handleNestedChange('timeline', 'startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={campaignData.timeline.endDate}
                  onChange={(e) => handleNestedChange('timeline', 'endDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                <input
                  type="number"
                  value={campaignData.scope.maxParticipants}
                  onChange={(e) => handleNestedChange('scope', 'maxParticipants', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Participants</label>
                <input
                  type="number"
                  value={campaignData.scope.minParticipants}
                  onChange={(e) => handleNestedChange('scope', 'minParticipants', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Template Selection
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Learning Templates</h3>
              <p className="text-gray-600 mb-6">Choose the templates that will be used in this campaign</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template._id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    campaignData.templates.find(t => t.templateId === template._id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const isSelected = campaignData.templates.find(t => t.templateId === template._id);
                    if (isSelected) {
                      setCampaignData(prev => ({
                        ...prev,
                        templates: prev.templates.filter(t => t.templateId !== template._id)
                      }));
                    } else {
                      setCampaignData(prev => ({
                        ...prev,
                        templates: [...prev.templates, {
                          templateId: template._id,
                          templateName: template.title,
                          category: template.category,
                          weight: 1,
                          isRequired: false
                        }]
                      }));
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{template.title}</h4>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      campaignData.templates.find(t => t.templateId === template._id)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                    {campaignData.templates.find(t => t.templateId === template._id) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{template.category}</span>
                    <span>{template.estimatedDuration} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Approval Setup
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Approval Workflow</h3>
              <p className="text-gray-600 mb-6">Set up the approval process for this campaign</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Approval Deadline</label>
              <input
                type="date"
                value={campaignData.timeline.approvalDeadline}
                onChange={(e) => handleNestedChange('timeline', 'approvalDeadline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Objectives</label>
              <div className="space-y-2">
                {campaignData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => {
                        const newObjectives = [...campaignData.objectives];
                        newObjectives[index] = e.target.value;
                        handleInputChange('objectives', newObjectives);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter objective"
                    />
                    <button
                      onClick={() => {
                        const newObjectives = campaignData.objectives.filter((_, i) => i !== index);
                        handleInputChange('objectives', newObjectives);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleArrayChange('objectives', '', '')}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Objective
                </button>
              </div>
            </div>
          </div>
        );

      case 3: // Pilot Configuration
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilot Testing Configuration</h3>
              <p className="text-gray-600 mb-6">Configure pilot testing parameters before full rollout</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Start Date</label>
                <input
                  type="date"
                  value={campaignData.timeline.pilotStartDate}
                  onChange={(e) => handleNestedChange('timeline', 'pilotStartDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot End Date</label>
                <input
                  type="date"
                  value={campaignData.timeline.pilotEndDate}
                  onChange={(e) => handleNestedChange('timeline', 'pilotEndDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Success Metrics Targets</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Engagement Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={campaignData.successMetrics.engagementRate}
                    onChange={(e) => handleNestedChange('successMetrics', 'engagementRate', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Completion Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={campaignData.successMetrics.completionRate}
                    onChange={(e) => handleNestedChange('successMetrics', 'completionRate', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Satisfaction Score (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={campaignData.successMetrics.satisfactionScore}
                    onChange={(e) => handleNestedChange('successMetrics', 'satisfactionScore', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Knowledge Gain (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={campaignData.successMetrics.knowledgeGain}
                    onChange={(e) => handleNestedChange('successMetrics', 'knowledgeGain', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Rollout Planning
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rollout Planning</h3>
              <p className="text-gray-600 mb-6">Plan the full rollout and launch strategy</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rollout Date</label>
              <input
                type="date"
                value={campaignData.timeline.rolloutDate}
                onChange={(e) => handleNestedChange('timeline', 'rolloutDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget (INR)</label>
              <input
                type="number"
                value={campaignData.budget.totalBudget}
                onChange={(e) => handleNestedChange('budget', 'totalBudget', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter total budget"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HealCoins to Fund</label>
              <input
                type="number"
                value={campaignData.healCoins.totalFunded}
                onChange={(e) => handleNestedChange('healCoins', 'totalFunded', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter HealCoins amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Reward Structure (HealCoins)</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Participation</label>
                  <input
                    type="number"
                    value={campaignData.healCoins.rewardStructure.participation}
                    onChange={(e) => handleNestedChange('healCoins', 'rewardStructure', {
                      ...campaignData.healCoins.rewardStructure,
                      participation: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Completion</label>
                  <input
                    type="number"
                    value={campaignData.healCoins.rewardStructure.completion}
                    onChange={(e) => handleNestedChange('healCoins', 'rewardStructure', {
                      ...campaignData.healCoins.rewardStructure,
                      completion: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Excellence</label>
                  <input
                    type="number"
                    value={campaignData.healCoins.rewardStructure.excellence}
                    onChange={(e) => handleNestedChange('healCoins', 'rewardStructure', {
                      ...campaignData.healCoins.rewardStructure,
                      excellence: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Campaign</h2>
            <p className="text-gray-600">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= currentStep
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-purple-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={createCampaign}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Create Campaign
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignWizard;
