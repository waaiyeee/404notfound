import React from 'react';

const ImpactDashboard = ({ confidence, matches, anxiety }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Social Progress Report</h3>
        <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">Real-time Data</span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Confidence Card */}
        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-600 font-semibold uppercase">Confidence</p>
          <h2 className="text-3xl font-bold text-blue-900">{confidence}%</h2>
        </div>

        {/* Matches Card */}
        <div className="p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-green-600 font-semibold uppercase">Matches</p>
          <h2 className="text-3xl font-bold text-green-900">{matches}</h2>
        </div>

        {/* Anxiety Reduction Card */}
        <div className="p-4 bg-red-50 rounded-xl">
          <p className="text-sm text-red-600 font-semibold uppercase">Anxiety</p>
          <h2 className="text-3xl font-bold text-red-900">-{anxiety}%</h2>
        </div>
      </div>

      {/* Social Readiness Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Social Readiness Pathway</span>
          <span className="font-bold text-blue-600">{confidence}% Ready</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-2 italic">
          *Calculated via biometric emotional stability and communication style analysis.
        </p>
      </div>
    </div>
  );
};

export default ImpactDashboard;