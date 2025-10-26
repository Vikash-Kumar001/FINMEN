import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Monitor, 
  Calendar, 
  Clock, 
  Users, 
  Target,
  CheckCircle,
  ArrowRight,
  Upload,
  Link,
  BookOpen,
  Lightbulb
} from 'lucide-react';

const ProjectAssignmentBuilder = ({ 
  projectData, 
  onProjectDataChange, 
  questions = [], 
  onQuestionsChange 
}) => {
  const [projectMode, setProjectMode] = useState(projectData?.mode || 'instructions');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const handleModeChange = (mode) => {
    setProjectMode(mode);
    onProjectDataChange({ ...projectData, mode });
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      question: type === 'research_question' ? 'Research Task' : 
               type === 'presentation' ? 'Presentation Task' : 
               'Reflection Task',
      points: 10,
      required: true,
      timeLimit: 0
    };

    if (type === 'research_question') {
      newQuestion.researchGuidelines = '';
      newQuestion.sources = [];
      newQuestion.wordCount = 500;
    } else if (type === 'presentation') {
      newQuestion.duration = 10; // minutes
      newQuestion.slides = 10;
      newQuestion.requirements = '';
    } else if (type === 'reflection') {
      newQuestion.wordCount = 300;
      newQuestion.prompts = [];
    }

    onQuestionsChange([...questions, newQuestion]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updatedQuestion };
    onQuestionsChange(updated);
  };

  const deleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    onQuestionsChange(updated);
  };

  const renderInstructionsMode = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Instructions Only Mode
        </h3>
        <p className="text-blue-700 mb-4">
          Students will complete this project outside the platform and submit their work manually.
        </p>
      </div>

      {/* Project Details */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Project Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={projectData?.title || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, title: e.target.value })}
              placeholder="e.g., Climate Change Research Project"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={projectData?.subject || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, subject: e.target.value })}
              placeholder="e.g., Environmental Science"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Description *
          </label>
          <textarea
            value={projectData?.description || ''}
            onChange={(e) => onProjectDataChange({ ...projectData, description: e.target.value })}
            placeholder="Describe the project objectives and what students need to accomplish..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Project Guidelines */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Project Guidelines</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              value={projectData?.instructions || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, instructions: e.target.value })}
              placeholder="Provide detailed step-by-step instructions for the project..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deliverables
            </label>
            <textarea
              value={projectData?.deliverables || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, deliverables: e.target.value })}
              placeholder="List what students need to submit (e.g., Research paper, Presentation slides, Video, etc.)"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resources & References
            </label>
            <textarea
              value={projectData?.resources || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, resources: e.target.value })}
              placeholder="Provide helpful resources, websites, books, or references..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Timeline & Requirements */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Timeline & Requirements</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Deadline *
            </label>
            <input
              type="datetime-local"
              value={projectData?.deadline || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, deadline: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Duration (days)
            </label>
            <input
              type="number"
              min="1"
              value={projectData?.duration || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, duration: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 7"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Group Size
            </label>
            <select
              value={projectData?.groupSize || 'individual'}
              onChange={(e) => onProjectDataChange({ ...projectData, groupSize: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="individual">Individual</option>
              <option value="pairs">Pairs (2)</option>
              <option value="small">Small Group (3-4)</option>
              <option value="large">Large Group (5+)</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Submission Requirements
          </label>
          <textarea
            value={projectData?.submissionRequirements || ''}
            onChange={(e) => onProjectDataChange({ ...projectData, submissionRequirements: e.target.value })}
            placeholder="Specify how students should submit their work (file formats, naming conventions, etc.)"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderVirtualMode = () => (
    <div className="space-y-6">
      <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Virtual Mode
        </h3>
        <p className="text-green-700 mb-4">
          Students will complete this project entirely on the platform with interactive tools and assessments.
        </p>
      </div>

      {/* Project Overview */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Project Overview</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={projectData?.title || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, title: e.target.value })}
              placeholder="e.g., Interactive Science Experiment"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={projectData?.subject || ''}
              onChange={(e) => onProjectDataChange({ ...projectData, subject: e.target.value })}
              placeholder="e.g., Physics"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Description *
          </label>
          <textarea
            value={projectData?.description || ''}
            onChange={(e) => onProjectDataChange({ ...projectData, description: e.target.value })}
            placeholder="Describe the virtual project and what students will accomplish..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Virtual Project Components */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Project Components</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addQuestion('research_question')}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors text-left"
          >
            <BookOpen className="w-8 h-8 text-green-600 mb-2" />
            <h5 className="font-semibold text-gray-900">Research Task</h5>
            <p className="text-sm text-gray-600">Add research-based questions</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addQuestion('presentation')}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors text-left"
          >
            <Monitor className="w-8 h-8 text-green-600 mb-2" />
            <h5 className="font-semibold text-gray-900">Presentation</h5>
            <p className="text-sm text-gray-600">Add presentation tasks</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addQuestion('reflection')}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors text-left"
          >
            <Lightbulb className="w-8 h-8 text-green-600 mb-2" />
            <h5 className="font-semibold text-gray-900">Reflection</h5>
            <p className="text-sm text-gray-600">Add reflection tasks</p>
          </motion.button>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-900">Project Tasks ({questions.length})</h5>
            {questions.map((question, index) => (
              <div key={question.id || index} className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium text-gray-900">
                      {question.type === 'research_question' && 'Research Task'}
                      {question.type === 'presentation' && 'Presentation Task'}
                      {question.type === 'reflection' && 'Reflection Task'}
                    </h6>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{question.points} pts</span>
                      <button
                        onClick={() => deleteQuestion(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Task Description *
                    </label>
                    <textarea
                      value={question.question || ''}
                      onChange={(e) => updateQuestion(index, { question: e.target.value })}
                      placeholder="Describe what students need to do for this task..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Points
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={question.points || 0}
                        onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Required
                      </label>
                      <select
                        value={question.required ? 'true' : 'false'}
                        onChange={(e) => updateQuestion(index, { required: e.target.value === 'true' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Project Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeChange('instructions')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              projectMode === 'instructions'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <FileText className={`w-8 h-8 mb-3 ${projectMode === 'instructions' ? 'text-blue-600' : 'text-gray-400'}`} />
            <h4 className="font-bold text-gray-900 mb-2">Instructions Only</h4>
            <p className="text-sm text-gray-600">Students complete project outside platform</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeChange('virtual')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              projectMode === 'virtual'
                ? 'bg-green-50 border-green-500'
                : 'bg-white border-gray-200 hover:border-green-300'
            }`}
          >
            <Monitor className={`w-8 h-8 mb-3 ${projectMode === 'virtual' ? 'text-green-600' : 'text-gray-400'}`} />
            <h4 className="font-bold text-gray-900 mb-2">Virtual Mode</h4>
            <p className="text-sm text-gray-600">Students complete project on platform</p>
          </motion.button>
        </div>
      </div>

      {/* Mode-specific content */}
      {projectMode === 'instructions' ? renderInstructionsMode() : renderVirtualMode()}
    </div>
  );
};

export default ProjectAssignmentBuilder;
