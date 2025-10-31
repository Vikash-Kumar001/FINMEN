import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Save, Send, CheckCircle, AlertCircle,
  School, Users, Target, DollarSign, Shield, Rocket, BarChart3,
  Plus, X, Upload, Download, Eye, Edit, Trash2, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import campaignWizardService from '../../services/campaignWizardService';

const CampaignWizardEnhanced = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    // Step 1: Scope
    title: '',
    description: '',
    scopeType: 'single_school',
    targetSchools: [],
    targetDistricts: [],
    gradeLevels: [],
    maxParticipants: 1000,
    minParticipants: 10,
    objectives: [],
    priority: 'medium',
    
    // Step 2: Templates
    selectedTemplates: [],
    customTemplateRequest: null,
    
    // Step 3: Pilot
    pilotRequired: false,
    pilotSchools: [],
    pilotDuration: 14,
    pilotStartDate: '',
    pilotEndDate: '',
    pilotObjectives: [],
    
    // Step 4: Budget
    budgetType: 'healcoins_pool',
    totalBudget: 0,
    healCoinsPool: 0,
    perStudentRewardCap: 50,
    budgetBreakdown: [],
    fundingSource: 'organization',
    
    // Step 5: Approvals
    approvalType: 'school_admin',
    requiredApprovals: [],
    approvalDeadline: '',
    
    // Step 6: Launch
    launchDate: '',
    
    // Step 7: Reporting
    reportSettings: {
      frequency: 'weekly',
      recipients: [],
      includeNEPMapping: true,
      includeCertificates: true
    }
  });

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignId, setCampaignId] = useState(null);

  const steps = [
    { id: 1, title: 'Scope', icon: Target, description: 'Define campaign scope and target audience' },
    { id: 2, title: 'Templates', icon: Users, description: 'Select learning templates and content' },
    { id: 3, title: 'Pilot', icon: School, description: 'Configure pilot testing if required' },
    { id: 4, title: 'Budget', icon: DollarSign, description: 'Set budget and HealCoins allocation' },
    { id: 5, title: 'Approvals', icon: Shield, description: 'Request necessary approvals' },
    { id: 6, title: 'Launch', icon: Rocket, description: 'Launch and monitor campaign' },
    { id: 7, title: 'Reporting', icon: BarChart3, description: 'Configure reporting and analytics' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await campaignWizardService.getTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await campaignWizardService.saveCampaign(campaignData);
      setCampaignId(response.data.campaignId);
      toast.success('Campaign saved successfully!');
    } catch (error) {
      toast.error('Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await campaignWizardService.createCampaign(campaignData);
      toast.success('Campaign created successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignData = (updates) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ScopeStep data={campaignData} updateData={updateCampaignData} />;
      case 2:
        return <TemplatesStep data={campaignData} updateData={updateCampaignData} templates={templates} />;
      case 3:
        return <PilotStep data={campaignData} updateData={updateCampaignData} />;
      case 4:
        return <BudgetStep data={campaignData} updateData={updateCampaignData} />;
      case 5:
        return <ApprovalsStep data={campaignData} updateData={updateCampaignData} />;
      case 6:
        return <LaunchStep data={campaignData} updateData={updateCampaignData} />;
      case 7:
        return <ReportingStep data={campaignData} updateData={updateCampaignData} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Campaign</h2>
            <p className="text-gray-600 text-lg">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between min-w-max space-x-12">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStep - 1;
                const isCurrent = index === currentStep - 1;
                
                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300 ${
                      isCompleted ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' :
                      isCurrent ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-200 scale-110' :
                      'border-gray-300 text-gray-400 hover:border-gray-400 hover:bg-gray-50'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : (
                        <StepIcon className="w-7 h-7" />
                      )}
                    </div>
                    <div className="ml-4 min-w-0">
                      <p className={`text-sm font-bold transition-colors duration-300 ${
                        isCurrent ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-tight max-w-36">
                        {step.description}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-20 h-1 mx-8 transition-colors duration-300 rounded-full ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl mx-auto"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-8 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Previous</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 border border-gray-200 shadow-sm"
            >
              <Save className="w-5 h-5" />
              <span className="font-medium">Save Draft</span>
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Create Campaign
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Step 1: Scope
const ScopeStep = ({ data, updateData }) => {
  const [newObjective, setNewObjective] = useState('');

  const addObjective = () => {
    if (newObjective.trim()) {
      updateData({ objectives: [...data.objectives, newObjective.trim()] });
      setNewObjective('');
    }
  };

  const removeObjective = (index) => {
    updateData({ objectives: data.objectives.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Define Campaign Scope</h3>
        <p className="text-gray-600 text-lg">Set the scope and target audience for your campaign.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Campaign Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter campaign title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe the campaign objectives and goals"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Scope Type</label>
            <select
              value={data.scopeType}
              onChange={(e) => updateData({ scopeType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="single_school">Single School</option>
              <option value="multi_school">Multiple Schools</option>
              <option value="district">District-wide</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Grade Levels</label>
            <div className="flex flex-wrap gap-3">
              {['6', '7', '8', '9', '10', '11', '12'].map(grade => (
                <button
                  key={grade}
                  onClick={() => {
                    const updated = data.gradeLevels.includes(grade)
                      ? data.gradeLevels.filter(g => g !== grade)
                      : [...data.gradeLevels, grade];
                    updateData({ gradeLevels: updated });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    data.gradeLevels.includes(grade)
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Min Participants</label>
              <input
                type="number"
                value={data.minParticipants}
                onChange={(e) => updateData({ minParticipants: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Max Participants</label>
              <input
                type="number"
                value={data.maxParticipants}
                onChange={(e) => updateData({ maxParticipants: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Priority</label>
            <select
              value={data.priority}
              onChange={(e) => updateData({ priority: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-lg font-semibold text-gray-800 mb-4">Campaign Objectives</label>
        <div className="space-y-4">
          {data.objectives.map((objective, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="flex-1 text-sm font-medium text-gray-800">{objective}</span>
              <button
                onClick={() => removeObjective(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-3">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addObjective()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Add objective"
            />
            <button
              onClick={addObjective}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Templates
const TemplatesStep = ({ data, updateData, templates }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customRequest, setCustomRequest] = useState({
    description: '',
    requirements: '',
    assets: []
  });

  const categories = ['all', 'finance', 'mental_health', 'values', 'ai_literacy', 'environmental', 'health', 'safety'];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const toggleTemplate = (template) => {
    const isSelected = data.selectedTemplates.some(t => t.templateId === template._id);
    if (isSelected) {
      updateData({
        selectedTemplates: data.selectedTemplates.filter(t => t.templateId !== template._id)
      });
    } else {
      updateData({
        selectedTemplates: [...data.selectedTemplates, {
          templateId: template._id,
          templateName: template.name,
          category: template.category
        }]
      });
    }
  };

  const requestCustomTemplate = () => {
    updateData({ customTemplateRequest: customRequest });
    toast.success('Custom template request submitted!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Learning Templates</h3>
        <p className="text-gray-600 mb-6">Choose from available templates or request custom content creation.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Categories' : category.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Selected Templates */}
      {data.selectedTemplates.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">Selected Templates ({data.selectedTemplates.length})</h4>
          <div className="flex flex-wrap gap-2">
            {data.selectedTemplates.map((template, index) => (
              <span key={index} className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm">
                {template.templateName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => {
          const isSelected = data.selectedTemplates.some(t => t.templateId === template._id);
          return (
            <div
              key={template._id}
              onClick={() => toggleTemplate(template)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                {isSelected && <CheckCircle className="w-5 h-5 text-purple-500" />}
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {template.category}
                </span>
                <span className="text-xs text-gray-500">
                  Grade {template.gradeLevel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Template Request */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-800 mb-4">Request Custom Template</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={customRequest.description}
              onChange={(e) => setCustomRequest({ ...customRequest, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe the custom template requirements"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specific Requirements</label>
            <textarea
              value={customRequest.requirements}
              onChange={(e) => setCustomRequest({ ...customRequest, requirements: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="List specific requirements or learning objectives"
            />
          </div>
          <button
            onClick={requestCustomTemplate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Request Custom Template
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Pilot
const PilotStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Configure Pilot Testing</h3>
        <p className="text-gray-600 mb-6">Set up pilot testing for large-scale campaigns.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.pilotRequired}
              onChange={(e) => updateData({ pilotRequired: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Require pilot testing</span>
          </label>
        </div>

        {data.pilotRequired && (
          <div className="space-y-4 pl-6 border-l-2 border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Duration (days)</label>
                <input
                  type="number"
                  value={data.pilotDuration}
                  onChange={(e) => updateData({ pilotDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Schools</label>
                <input
                  type="text"
                  value={data.pilotSchools.join(', ')}
                  onChange={(e) => updateData({ pilotSchools: e.target.value.split(', ').filter(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter school names or IDs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Start Date</label>
                <input
                  type="date"
                  value={data.pilotStartDate}
                  onChange={(e) => updateData({ pilotStartDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot End Date</label>
                <input
                  type="date"
                  value={data.pilotEndDate}
                  onChange={(e) => updateData({ pilotEndDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Objectives</label>
              <textarea
                value={data.pilotObjectives.join('\n')}
                onChange={(e) => updateData({ pilotObjectives: e.target.value.split('\n').filter(o => o.trim()) })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="List pilot testing objectives (one per line)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 4: Budget
const BudgetStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Set Budget & HealCoins</h3>
        <p className="text-gray-600 mb-6">Configure budget allocation and HealCoins distribution.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Type</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="budgetType"
                value="healcoins_pool"
                checked={data.budgetType === 'healcoins_pool'}
                onChange={(e) => updateData({ budgetType: e.target.value })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">HealCoins Pool (Fixed amount)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="budgetType"
                value="per_student_cap"
                checked={data.budgetType === 'per_student_cap'}
                onChange={(e) => updateData({ budgetType: e.target.value })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Per-Student Reward Cap</span>
            </label>
          </div>
        </div>

        {data.budgetType === 'healcoins_pool' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HealCoins Pool</label>
              <input
                type="number"
                value={data.healCoinsPool}
                onChange={(e) => updateData({ healCoinsPool: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter HealCoins amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget (₹)</label>
              <input
                type="number"
                value={data.totalBudget}
                onChange={(e) => updateData({ totalBudget: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter budget amount"
              />
            </div>
          </div>
        )}

        {data.budgetType === 'per_student_cap' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Per-Student Reward Cap</label>
              <input
                type="number"
                value={data.perStudentRewardCap}
                onChange={(e) => updateData({ perStudentRewardCap: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="HealCoins per student"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Total</label>
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                {data.perStudentRewardCap * data.maxParticipants} HealCoins
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Funding Source</label>
          <select
            value={data.fundingSource}
            onChange={(e) => updateData({ fundingSource: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="organization">Organization</option>
            <option value="external_sponsor">External Sponsor</option>
            <option value="government_grant">Government Grant</option>
            <option value="corporate_partnership">Corporate Partnership</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Step 5: Approvals
const ApprovalsStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Request Approvals</h3>
        <p className="text-gray-600 mb-6">Configure approval workflow for campaign launch.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Approval Type</label>
          <select
            value={data.approvalType}
            onChange={(e) => updateData({ approvalType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="school_admin">School Admin Approval</option>
            <option value="district_admin">District Admin Approval</option>
            <option value="central_admin">Central Admin Approval</option>
            <option value="teacher">Teacher Approval</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Approval Deadline</label>
          <input
            type="date"
            value={data.approvalDeadline}
            onChange={(e) => updateData({ approvalDeadline: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Approval Requirements</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• School admin consent required for each participating school</li>
            <li>• Central admin approval required for multi-district campaigns</li>
            <li>• Parent consent forms may be required for certain activities</li>
            <li>• Budget approval from finance department</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Step 6: Launch
const LaunchStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Launch Campaign</h3>
        <p className="text-gray-600 mb-6">Set launch date and configure monitoring settings.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Launch Date</label>
          <input
            type="date"
            value={data.launchDate}
            onChange={(e) => updateData({ launchDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Live Monitoring Dashboard</h4>
          <p className="text-sm text-green-700 mb-3">
            Once launched, you'll have access to real-time monitoring including:
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Attempts and completion rates by school & grade</li>
            <li>• Engagement metrics and time spent</li>
            <li>• Real-time participant activity</li>
            <li>• Performance alerts and notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Step 7: Reporting
const ReportingStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Configure Reporting</h3>
        <p className="text-gray-600 mb-6">Set up automated reporting and analytics.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Frequency</label>
          <select
            value={data.reportSettings.frequency}
            onChange={(e) => updateData({ 
              reportSettings: { ...data.reportSettings, frequency: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Report Content</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.reportSettings.includeNEPMapping}
                onChange={(e) => updateData({ 
                  reportSettings: { ...data.reportSettings, includeNEPMapping: e.target.checked }
                })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Include NEP competency mapping</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.reportSettings.includeCertificates}
                onChange={(e) => updateData({ 
                  reportSettings: { ...data.reportSettings, includeCertificates: e.target.checked }
                })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Include certificates issued</span>
            </label>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">CSR Impact Report Features</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Downloadable PDF reports with comprehensive metrics</li>
            <li>• NEP competency mapping and alignment analysis</li>
            <li>• Certificate issuance tracking and verification</li>
            <li>• School-wise and grade-wise performance breakdown</li>
            <li>• Budget utilization and ROI analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CampaignWizardEnhanced;
