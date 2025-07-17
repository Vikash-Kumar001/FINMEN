import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, PieChart, DollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchBudgetData, saveBudgetData } from '../../services/studentService';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-toastify';

const BudgetPlanner = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newIncome, setNewIncome] = useState({ name: '', amount: '' });
  const [newExpense, setNewExpense] = useState({ category: 'Food', name: '', amount: '' });
  const [activeTab, setActiveTab] = useState('overview');

  const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const balance = totalIncome - totalExpenses;

  const expenseCategories = ['Food', 'Entertainment', 'Transportation', 'Education', 'Clothing', 'Savings', 'Other'];

  const categoryTotals = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += Number(expense.amount);
    return acc;
  }, {});

  const addIncome = () => {
    if (newIncome.name && newIncome.amount) {
      const incomeItem = { id: Date.now(), ...newIncome };
      setIncomes([...incomes, incomeItem]);
      setNewIncome({ name: '', amount: '' });
      
      // Log income added activity
      logActivity({
        activityType: "financial_action",
        description: "Added income to budget",
        metadata: {
          action: "add_income",
          incomeName: incomeItem.name,
          incomeAmount: incomeItem.amount,
          timestamp: new Date().toISOString()
        },
        pageUrl: window.location.pathname
      });
    }
  };

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const expenseItem = { id: Date.now(), ...newExpense };
      setExpenses([...expenses, expenseItem]);
      setNewExpense({ category: 'Food', name: '', amount: '' });
      
      // Log expense added activity
      logActivity({
        activityType: "financial_action",
        description: "Added expense to budget",
        metadata: {
          action: "add_expense",
          expenseName: expenseItem.name,
          expenseAmount: expenseItem.amount,
          expenseCategory: expenseItem.category,
          timestamp: new Date().toISOString()
        },
        pageUrl: window.location.pathname
      });
    }
  };

  const removeIncome = (id) => {
    const incomeToRemove = incomes.find(income => income.id === id);
    setIncomes(incomes.filter(income => income.id !== id));
    
    // Log income removed activity
    if (incomeToRemove) {
      logActivity({
        activityType: "financial_action",
        description: "Removed income from budget",
        metadata: {
          action: "remove_income",
          incomeName: incomeToRemove.name,
          incomeAmount: incomeToRemove.amount,
          timestamp: new Date().toISOString()
        },
        pageUrl: window.location.pathname
      });
    }
  };

  const removeExpense = (id) => {
    const expenseToRemove = expenses.find(expense => expense.id === id);
    setExpenses(expenses.filter(expense => expense.id !== id));
    
    // Log expense removed activity
    if (expenseToRemove) {
      logActivity({
        activityType: "financial_action",
        description: "Removed expense from budget",
        metadata: {
          action: "remove_expense",
          expenseName: expenseToRemove.name,
          expenseAmount: expenseToRemove.amount,
          expenseCategory: expenseToRemove.category,
          timestamp: new Date().toISOString()
        },
        pageUrl: window.location.pathname
      });
    }
  };

  // Load budget data on component mount
  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        setLoading(true);
        const data = await fetchBudgetData();
        if (data.incomes) setIncomes(data.incomes);
        if (data.expenses) setExpenses(data.expenses);
        
        // Log page view activity
        logActivity({
          activityType: "page_view",
          description: "Viewed budget planner",
          metadata: {
            page: "/student/budget-planner",
            timestamp: new Date().toISOString()
          },
          pageUrl: window.location.pathname
        });
      } catch (error) {
        console.error('Error loading budget data:', error);
        toast.error('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, []);

  const saveBudget = async () => {
    try {
      await saveBudgetData({ incomes, expenses });
      toast.success('Budget saved successfully!');
      
      // Log budget saved activity
      logActivity({
        activityType: "financial_action",
        description: "Saved budget plan",
        metadata: {
          action: "save_budget",
          totalIncome: totalIncome,
          totalExpenses: totalExpenses,
          balance: balance,
          incomeCount: incomes.length,
          expenseCount: expenses.length,
          timestamp: new Date().toISOString()
        },
        pageUrl: window.location.pathname
      });
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 sm:p-6 lg:p-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
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
            className="flex items-center text-green-600 hover:text-green-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Budget Planner</h1>
          <p className="text-lg text-gray-600">Create and manage your personal budget</p>
        </motion.div>

        {/* Budget Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <ArrowDownCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-gray-800">${totalIncome.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <ArrowUpCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'income' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'expenses' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-green-600" />
                Budget Overview
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expense Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Expense Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(categoryTotals).map(([category, total]) => (
                      <div key={category} className="flex items-center">
                        <div className="w-1/3 font-medium">{category}</div>
                        <div className="w-2/3">
                          <div className="relative pt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-green-600">
                                  ${total.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs font-semibold inline-block text-green-600">
                                  {totalExpenses > 0 ? ((total / totalExpenses) * 100).toFixed(0) : 0}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                              <div
                                style={{ width: `${totalExpenses > 0 ? (total / totalExpenses) * 100 : 0}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Savings Potential */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Savings Potential</h3>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="mb-2">Based on your current budget:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span>
                          {balance > 0 
                            ? `You have a surplus of $${balance.toFixed(2)} that could be saved or invested.` 
                            : `You have a deficit of $${Math.abs(balance).toFixed(2)}. Consider reducing expenses or increasing income.`}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span>
                          {totalIncome > 0 
                            ? `You're spending ${((totalExpenses / totalIncome) * 100).toFixed(0)}% of your income.` 
                            : 'Add some income sources to calculate your spending ratio.'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span>
                          Aim to save at least 20% of your income for future goals.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <ArrowDownCircle className="w-5 h-5 mr-2 text-green-600" />
                Income Sources
              </h2>
              
              {/* Add Income Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-md font-semibold mb-3">Add New Income</h3>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Income source"
                    className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded"
                    value={newIncome.name}
                    onChange={(e) => setNewIncome({...newIncome, name: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-32 p-2 border border-gray-300 rounded"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                  />
                  <button
                    onClick={addIncome}
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
              
              {/* Income List */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Source</th>
                      <th className="py-3 px-6 text-right">Amount</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {incomes.map((income) => (
                      <tr key={income.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{income.name}</td>
                        <td className="py-3 px-6 text-right">${Number(income.amount).toFixed(2)}</td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => removeIncome(income.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {incomes.length === 0 && (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-gray-500">
                          No income sources added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-6 text-left">Total</td>
                      <td className="py-3 px-6 text-right text-green-600">${totalIncome.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <ArrowUpCircle className="w-5 h-5 mr-2 text-red-600" />
                Expenses
              </h2>
              
              {/* Add Expense Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-md font-semibold mb-3">Add New Expense</h3>
                <div className="flex flex-wrap gap-3">
                  <select
                    className="p-2 border border-gray-300 rounded w-40"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  >
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Expense name"
                    className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-32 p-2 border border-gray-300 rounded"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  />
                  <button
                    onClick={addExpense}
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
              
              {/* Expenses List */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Category</th>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-right">Amount</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{expense.category}</td>
                        <td className="py-3 px-6 text-left">{expense.name}</td>
                        <td className="py-3 px-6 text-right">${Number(expense.amount).toFixed(2)}</td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => removeExpense(expense.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {expenses.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-4 text-center text-gray-500">
                          No expenses added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-6 text-left" colSpan="2">Total</td>
                      <td className="py-3 px-6 text-right text-red-600">${totalExpenses.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 flex justify-end"
        >
          <button
            onClick={saveBudget}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Budget
          </button>
        </motion.div>
      </div>
      )}
    </div>
  );
};

export default BudgetPlanner;