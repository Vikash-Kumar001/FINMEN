import React from 'react';

const CollegeStudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">College Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your academic progress and college activities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">CGPA</h3>
            <p className="text-3xl font-bold text-indigo-600">8.5</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance</h3>
            <p className="text-3xl font-bold text-green-600">95%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Credits</h3>
            <p className="text-3xl font-bold text-purple-600">120</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignments</h3>
            <p className="text-3xl font-bold text-orange-600">15</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Courses</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Data Structures</p>
                <p className="text-sm text-gray-500">CS201 • 4 credits</p>
              </div>
              <span className="px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">A</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Algorithms</p>
                <p className="text-sm text-gray-500">CS301 • 3 credits</p>
              </div>
              <span className="px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">A-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeStudentDashboard;