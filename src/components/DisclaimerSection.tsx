
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerSection = () => {
  return (
    <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm flex gap-4">
      <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="text-base text-gray-700">
        <p className="font-medium text-lg mb-2">Medical Disclaimer</p>
        <p className="mb-3 text-gray-600">
          This tool is provided for informational purposes only and should not replace professional medical advice. 
          Always consult with a qualified healthcare provider regarding medication decisions.
        </p>
        <p className="text-gray-600"> 
          The analysis is based on available data and may not account for all possible drug interactions or individual patient factors.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerSection;
