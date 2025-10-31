import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Plus, Trash2, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddStudentByEmailModal = ({
  showAddStudentByEmailModal,
  setShowAddStudentByEmailModal,
  selectedClass,
  onSuccess
}) => {
  const [emailList, setEmailList] = useState('');
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState('');

  const handleAddStudents = async () => {
    if (!emailList.trim()) {
      toast.error('Please enter at least one email address');
      return;
    }

    if (!section) {
      toast.error('Please select a section');
      return;
    }

    // Parse email list (comma or newline separated)
    const emails = emailList
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emails.length === 0) {
      toast.error('Please enter valid email addresses');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/school/admin/classes/${selectedClass._id}/students-by-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails,
          section
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Students added successfully!');
        setShowAddStudentByEmailModal(false);
        setEmailList('');
        setSection('');
        onSuccess?.();
      } else {
        toast.error(data.message || 'Failed to add students');
      }
    } catch (error) {
      console.error('Error adding students:', error);
      toast.error('Failed to add students');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowAddStudentByEmailModal(false);
    setEmailList('');
    setSection('');
  };

  return (
    <AnimatePresence>
      {showAddStudentByEmailModal && selectedClass && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Add Students by Email</h2>
                    <p className="text-sm text-white/80">
                      Class {selectedClass.classNumber}{selectedClass.stream && ` - ${selectedClass.stream}`}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Section Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Select Section *
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                    required
                  >
                    <option value="">Choose Section</option>
                    {selectedClass.sections?.map((sec, idx) => (
                      <option key={idx} value={sec.name}>
                        Section {sec.name} ({sec.currentStrength || 0}/{sec.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Student Email Addresses *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={emailList}
                      onChange={(e) => setEmailList(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold resize-none"
                      rows={6}
                      placeholder="Enter email addresses separated by commas or new lines:&#10;student1@example.com&#10;student2@example.com&#10;student3@example.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple emails with commas or new lines. Students will be automatically assigned to the selected section.
                  </p>
                </div>

                {/* Email Preview */}
                {emailList.trim() && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">Email Preview:</h4>
                    <div className="space-y-1">
                      {emailList
                        .split(/[,\n]/)
                        .map((email, idx) => email.trim())
                        .filter(email => email.length > 0)
                        .map((email, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {email}
                          </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Total: {emailList.split(/[,\n]/).filter(email => email.trim().length > 0).length} email(s)
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-600">
                    Students will be added to {section ? `Section ${section}` : 'selected section'}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddStudents}
                      disabled={!emailList.trim() || !section || loading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      {loading ? 'Adding...' : 'Add Students'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(AddStudentByEmailModal);
