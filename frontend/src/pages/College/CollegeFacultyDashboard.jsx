import React from 'react';

const CollegeFacultyDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">College Faculty Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your courses and track student progress</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-indigo-600">150</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Courses</h3>
            <p className="text-3xl font-bold text-green-600">5</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignments</h3>
            <p className="text-3xl font-bold text-purple-600">25</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance</h3>
            <p className="text-3xl font-bold text-orange-600">92%</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
              <p className="text-sm font-medium text-blue-900">New Assignment</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
              <p className="text-sm font-medium text-green-900">Mark Attendance</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
              <p className="text-sm font-medium text-purple-900">Grade Assignments</p>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
              <p className="text-sm font-medium text-orange-900">View Reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeFacultyDashboard;