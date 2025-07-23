import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Plus, Trash2, Edit2, Check, X, Coins, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchSavingsGoals, saveSavingsGoals, addContribution, deleteSavingsGoal } from '../../services/studentService';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-toastify';

const SavingsGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    category: 'Other',
    priority: 'Medium',
    notes: '',
  });

  const categories = ['Electronics', 'Travel', 'Education', 'Entertainment', 'Clothing', 'Emergency', 'Other'];
  const priorities = ['Low', 'Medium', 'High'];

  useEffect(() => {
    const loadSavingsGoals = async () => {
      try {
        setLoading(true);
        const data = await fetchSavingsGoals();
        if (data && Array.isArray(data)) {
          setGoals(data);
        }
        logActivity({
          activityType: 'page_view',
          description: 'Viewed savings goals',
          metadata: {
            page: '/student/savings-goals',
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } catch (error) {
        console.error('Error loading savings goals:', error);
        toast.error('Failed to load savings goals');
      } finally {
        setLoading(false);
      }
    };

    loadSavingsGoals();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let updatedGoals;

      if (editingGoalId) {
        updatedGoals = goals.map((goal) =>
          goal._id === editingGoalId ? { ...newGoal, _id: goal._id } : goal
        );
        setEditingGoalId(null);
        logActivity({
          activityType: 'financial_action',
          description: 'Updated savings goal',
          metadata: {
            action: 'update_savings_goal',
            goalName: newGoal.name,
            targetAmount: newGoal.targetAmount,
            category: newGoal.category,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } else {
        const goalToAdd = { ...newGoal };
        updatedGoals = [...goals, goalToAdd];
        logActivity({
          activityType: 'financial_action',
          description: 'Created new savings goal',
          metadata: {
            action: 'create_savings_goal',
            goalName: newGoal.name,
            targetAmount: newGoal.targetAmount,
            category: newGoal.category,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      }

      await saveSavingsGoals(updatedGoals);
      setGoals(updatedGoals);
      toast.success(editingGoalId ? 'Goal updated successfully!' : 'New goal added successfully!');

      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: 0,
        deadline: '',
        category: 'Other',
        priority: 'Medium',
        notes: '',
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const handleEditGoal = (goal) => {
    setNewGoal({ ...goal });
    setEditingGoalId(goal.id);
    setShowAddForm(true);
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteSavingsGoal(id);
      setGoals(goals.filter((goal) => goal._id !== id));
      toast.success('Goal deleted successfully!');

      const deletedGoal = goals.find((goal) => goal._id === id);
      if (deletedGoal) {
        logActivity({
          activityType: 'financial_action',
          description: 'Deleted savings goal',
          metadata: {
            action: 'delete_savings_goal',
            goalName: deletedGoal.name,
            targetAmount: deletedGoal.targetAmount,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleContribute = async (id, amount) => {
    try {
      const goalToUpdate = goals.find((goal) => goal._id === id);
      if (!goalToUpdate) return;

      const newAmount = Math.min(goalToUpdate.targetAmount, goalToUpdate.currentAmount + amount);
      await addContribution(id, amount);

      setGoals(
        goals.map((goal) => {
          if (goal._id === id) {
            return { ...goal, currentAmount: newAmount };
          }
          return goal;
        })
      );

      toast.success(`Added $${amount} to ${goalToUpdate.name}!`);

      logActivity({
        activityType: 'financial_action',
        description: 'Added contribution to savings goal',
        metadata: {
          action: 'add_contribution',
          goalName: goalToUpdate.name,
          contributionAmount: amount,
          newTotal: newAmount,
          progress: calculateProgress(newAmount, goalToUpdate.targetAmount),
          timestamp: new Date().toISOString(),
        },
        pageUrl: window.location.pathname,
      });
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error('Failed to add contribution');
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const getProgressColor = (progress) => {
    if (progress < 25) return 'from-red-500 to-red-400';
    if (progress < 50) return 'from-orange-500 to-yellow-400';
    if (progress < 75) return 'from-blue-500 to-cyan-400';
    return 'from-green-500 to-emerald-400';
  };

  const getTotalSaved = () => {
    return goals.reduce((total, goal) => total + goal.currentAmount, 0);
  };

  const getTotalTarget = () => {
    return goals.reduce((total, goal) => total + goal.targetAmount, 0);
  };

  const getOverallProgress = () => {
    const total = getTotalTarget();
    return total > 0 ? Math.round((getTotalSaved() / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center text-yellow-600 hover:text-yellow-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Savings Goals</h1>
          <p className="text-lg text-gray-600">Set and track your savings goals</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Goals</p>
              <p className="text-2xl font-bold text-gray-800">{goals.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Coins className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Saved</p>
              <p className="text-2xl font-bold text-gray-800">${getTotalSaved().toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Progress</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-800 mr-2">{getOverallProgress()}%</p>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(getOverallProgress())}`}
                    style={{ width: `${getOverallProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 flex justify-end"
        >
          <button
            onClick={() => {
              setEditingGoalId(null);
              setNewGoal({
                name: '',
                targetAmount: '',
                currentAmount: 0,
                deadline: '',
                category: 'Other',
                priority: 'Medium',
                notes: '',
              });
              setShowAddForm(!showAddForm);
            }}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${showAddForm ? 'bg-gray-200 text-gray-700' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
          >
            {showAddForm ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add New Goal
              </>
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-200">
                <h2 className="text-xl font-bold mb-4">
                  {editingGoalId ? 'Edit Savings Goal' : 'Create New Savings Goal'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name*</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., New Laptop"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount*</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 1000"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) || '' })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 200"
                      value={newGoal.currentAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, currentAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Date*</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Additional details about your goal"
                      rows="3"
                      value={newGoal.notes}
                      onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddGoal}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {editingGoalId ? 'Update Goal' : 'Save Goal'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                const progressColor = getProgressColor(progress);
                const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

                return (
                  <motion.div
                    key={goal.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className={`h-2 bg-gradient-to-r ${progressColor}`} style={{ width: `${progress}%` }}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditGoal(goal)}
                            className="p-1 text-gray-500 hover:text-yellow-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal._id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress: {progress}%</span>
                          <span>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${progressColor}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm">{goal.category}</span>
                        </div>
                      </div>
                      {goal.notes && (
                        <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {goal.notes}
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div className="text-sm font-medium">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${goal.priority === 'High'
                              ? 'bg-red-100 text-red-800'
                              : goal.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'}`}
                          >
                            {goal.priority} Priority
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleContribute(goal._id, 10)}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200"
                          >
                            +$10
                          </button>
                          <button
                            onClick={() => handleContribute(goal._id, 50)}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200"
                          >
                            +$50
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Target className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Savings Goals Yet</h3>
              <p className="text-gray-600 mb-6">Create your first savings goal to start tracking your progress!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SavingsGoals;