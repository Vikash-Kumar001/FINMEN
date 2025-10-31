import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Camera, Image, User as Contact, MapPin, X
} from 'lucide-react';

const AttachMenu = ({ onClose, onSelect, position }) => {
  const options = [
    { icon: FileText, label: 'Document', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Camera, label: 'Camera', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Image, label: 'Gallery', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Contact, label: 'Contact', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { icon: MapPin, label: 'Location', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const handleClick = (option) => {
    onSelect(option.label.toLowerCase());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 sm:p-4 w-[95vw] sm:w-[90vw] md:w-[450px] mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-900">Attach File</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="flex gap-2">
          {options.map((option, index) => (
            <motion.button
              key={option.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleClick(option)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg ${option.bg} hover:opacity-80 transition-all active:scale-95`}
            >
              <option.icon className={`w-5 h-5 ${option.color}`} />
              <span className="text-xs font-medium text-gray-700">{option.label}</span>
            </motion.button>
          ))}
        </div>

        {/* File Size Notice */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Maximum file size: 25MB
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AttachMenu;

