import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, DollarSign, PieChart, BarChart3, Calendar, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-toastify';

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Load expenses from localStorage on component mount
  useEffect(() => {
    // Log page view when component mounts
    logActivity({
      activityType: "page_view",
      description: "Viewed expense tracker page"
    });
    
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      // Sample data for demonstration
      const sampleExpenses = [
        { id: 1, description: 'Grocery shopping', amount: 45.67, category: 'Food', date: '2023-05-15' },
        { id: 2, description: 'Movie tickets', amount: 24.99, category: 'Entertainment', date: '2023-05-18' },
        { id: 3, description: 'Gas', amount: 35.50, category: 'Transportation', date: '2023-05-20' },
        { id: 4, description: 'Electricity bill', amount: 78.35, category: 'Utilities', date: '2023-05-22' },
        { id: 5, description: 'Dinner with friends', amount: 62.80, category: 'Food', date: '2023-05-25' },
      ];
      setExpenses(sampleExpenses);
      localStorage.setItem('expenses', JSON.stringify(sampleExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    const expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddExpense(false);
    
    // Log add expense activity
    logActivity({
      activityType: "financial_action",
      description: `Added expense: ${expense.description}`,
      metadata: {
        action: "add_expense",
        expenseId: expense.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date
      }
    });
    
    toast.success('Expense added successfully!');
  };

  const handleDeleteExpense = (id) => {
    // Find the expense before removing it
    const expenseToDelete = expenses.find(expense => expense.id === id);
    
    if (expenseToDelete) {
      setExpenses(expenses.filter(expense => expense.id !== id));
      
      // Log delete expense activity
      logActivity({
        activityType: "financial_action",
        description: `Deleted expense: ${expenseToDelete.description}`,
        metadata: {
          action: "delete_expense",
          expenseId: expenseToDelete.id,
          description: expenseToDelete.description,
          amount: expenseToDelete.amount,
          category: expenseToDelete.category,
          date: expenseToDelete.date
        }
      });
      
      toast.success('Expense deleted successfully!');
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Include the end date fully

    const dateInRange = expenseDate >= startDate && expenseDate <= endDate;
    
    if (filter === 'all') return dateInRange;
    return expense.category === filter && dateInRange;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);

  const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Housing', 'Healthcare', 'Education', 'Shopping', 'Personal', 'Other'];

  const categoryTotals = categories.map(category => {
    const total = filteredExpenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { category, total };
  }).filter(item => item.total > 0);

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const csvData = filteredExpenses.map(expense => [
      expense.date,
      expense.description,
      expense.category,
      expense.amount
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = `expense_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log export activity
    logActivity({
      activityType: "financial_action",
      description: "Exported expense report",
      metadata: {
        action: "export_expenses",
        fileName: fileName,
        expenseCount: filteredExpenses.length,
        totalAmount: parseFloat(totalExpenses),
        dateRange: dateRange,
        filter: filter
      }
    });
    
    toast.success('Expense report exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
              <p className="text-lg text-gray-600">Track and manage your daily expenses</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setShowAddExpense(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
              <button
                onClick={exportToCSV}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Expense List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Expenses
                    <span className="ml-2 text-sm font-normal text-gray-500">({filteredExpenses.length})</span>
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <input 
                        type="date" 
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                      <span className="mx-2">to</span>
                      <input 
                        type="date" 
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <Filter className="w-4 h-4 text-gray-500 mr-2" />
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {filteredExpenses.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredExpenses.map(expense => (
                    <motion.div 
                      key={expense.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-semibold">
                            {expense.category.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{expense.description}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-3">{expense.category}</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 mr-4">${expense.amount.toFixed(2)}</span>
                        <button 
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No expenses found for the selected filters.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                  Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-500 mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold text-gray-900">${totalExpenses}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Spending by Category
                  </h3>
                  
                  {categoryTotals.length > 0 ? (
                    <div className="space-y-3">
                      {categoryTotals.map(({ category, total }) => {
                        const percentage = (total / parseFloat(totalExpenses) * 100).toFixed(1);
                        return (
                          <div key={category}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{category}</span>
                              <span className="font-medium">${total.toFixed(2)} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No data available</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 text-white">
                <h3 className="font-semibold mb-2">Expense Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Track all expenses, even small ones</li>
                  <li>• Categorize expenses to identify spending patterns</li>
                  <li>• Set a monthly budget for each category</li>
                  <li>• Review your expenses weekly</li>
                  <li>• Look for areas where you can cut back</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Add New Expense</h2>
            </div>
            <form onSubmit={handleAddExpense} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newExpense.description}
                  onChange={handleInputChange}
                  placeholder="What did you spend on?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={newExpense.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={newExpense.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newExpense.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;