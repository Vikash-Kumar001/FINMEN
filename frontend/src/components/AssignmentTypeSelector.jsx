import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText,
  ClipboardList, 
  GraduationCap, 
  Briefcase,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';

const AssignmentTypeSelector = ({ onTypeSelect, onTemplateSelect, selectedType }) => {

  const assignmentTypes = [
    {
      id: 'homework',
      name: 'Homework',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      description: 'Practice exercises and problem-solving',
      duration: '30-60 min'
    },
    {
      id: 'quiz',
      name: 'Quiz',
      icon: ClipboardList,
      color: 'from-green-500 to-emerald-500',
      description: 'Quick assessment with multiple choice questions',
      duration: '15-30 min'
    },
    {
      id: 'test',
      name: 'Test',
      icon: FileText,
      color: 'from-red-500 to-rose-500',
      description: 'Comprehensive evaluation with various question types',
      duration: '60-120 min'
    },
    {
      id: 'classwork',
      name: 'Classwork',
      icon: Users,
      color: 'from-purple-500 to-indigo-500',
      description: 'Interactive activities for in-class participation',
      duration: '30-45 min'
    },
    {
      id: 'project',
      name: 'Project',
      icon: Briefcase,
      color: 'from-orange-500 to-amber-500',
      description: 'Long-term research and creative assignments',
      duration: 'Multiple days'
    }
  ];

  const handleTypeSelect = (type) => {
    onTypeSelect(type);
    // Skip template selection and go directly to blank assignment
    onTemplateSelect(null);
  };

  // Template selection removed - go directly to blank assignment creation

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Assignment Type</h3>
        <p className="text-gray-600">Select the type of assignment you want to create</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {assignmentTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelect(type.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? `bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-500`
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color} mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <h4 className="font-bold text-gray-900 mb-2 text-sm">{type.name}</h4>
                <p className="text-xs text-gray-600 mb-2 leading-tight">{type.description}</p>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{type.duration}</span>
                </div>
                
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentTypeSelector;
