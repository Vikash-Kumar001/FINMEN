import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Award, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinancialLiteracy = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    {
      title: 'Introduction to Personal Finance',
      description: 'Learn the basics of managing your money and understanding financial terms.',
      icon: <BookOpen className="w-6 h-6" />,
      completed: true,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">What is Personal Finance?</h3>
          <p>Personal finance is the management of your money and financial decisions. It includes budgeting, saving, investing, and planning for your financial future.</p>
          
          <h3 className="text-xl font-bold mt-6">Why is Financial Literacy Important?</h3>
          <p>Being financially literate helps you make informed decisions about your money, avoid debt, save for goals, and build wealth over time.</p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
            <h4 className="font-bold text-blue-800">Key Takeaways:</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Financial literacy is essential for making good money decisions</li>
              <li>Understanding basic financial concepts helps you build wealth</li>
              <li>Starting early with good financial habits leads to long-term success</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Budgeting Fundamentals',
      description: 'Create and manage a personal budget to track income and expenses.',
      icon: <Award className="w-6 h-6" />,
      completed: false,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Creating Your First Budget</h3>
          <p>A budget is a plan for your money. It helps you track income, plan expenses, and save for future goals.</p>
          
          <h3 className="text-xl font-bold mt-6">The 50/30/20 Rule</h3>
          <p>A simple budgeting method where you allocate:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>50%</strong> of income to needs (housing, food, utilities)</li>
            <li><strong>30%</strong> to wants (entertainment, dining out)</li>
            <li><strong>20%</strong> to savings and debt repayment</li>
          </ul>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6">
            <h4 className="font-bold text-green-800">Practice Exercise:</h4>
            <p>Try creating a simple monthly budget listing your income sources and categorizing your expenses.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Saving and Investing Basics',
      description: 'Learn how to save money and start investing for your future.',
      icon: <CheckCircle className="w-6 h-6" />,
      completed: false,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">The Power of Saving</h3>
          <p>Saving money creates financial security and helps you prepare for emergencies and future goals.</p>
          
          <h3 className="text-xl font-bold mt-6">Introduction to Investing</h3>
          <p>Investing allows your money to grow over time. Even small amounts can grow significantly through compound interest.</p>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mt-6">
            <h4 className="font-bold text-purple-800">Investment Options for Beginners:</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Savings accounts</li>
              <li>Certificates of deposit (CDs)</li>
              <li>Index funds</li>
              <li>Retirement accounts</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

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
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Financial Literacy</h1>
          <p className="text-lg text-gray-600">Learn the basics of personal finance and money management</p>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with modules */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-5 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Learning Modules</h2>
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveModule(index)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${activeModule === index ? 'bg-blue-100 border-blue-300 border' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 ${module.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main content area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6">{modules[activeModule].title}</h2>
              
              {modules[activeModule].content}
              
              <div className="mt-8 flex justify-between">
                <button 
                  onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                  disabled={activeModule === 0}
                  className={`px-4 py-2 rounded-lg ${activeModule === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Previous Module
                </button>
                
                <button 
                  onClick={() => setActiveModule(Math.min(modules.length - 1, activeModule + 1))}
                  disabled={activeModule === modules.length - 1}
                  className={`px-4 py-2 rounded-lg ${activeModule === modules.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Next Module
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FinancialLiteracy;