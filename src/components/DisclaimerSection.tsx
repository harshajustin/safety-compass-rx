import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerSection = () => {
  return (
    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex gap-3">
      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="text-base text-gray-700">
        <p className="font-medium mb-1">Medical Disclaimer</p>
        <p>
          This tool is provided for informational purposes only and should not replace professional medical advice. 
          Always consult with a qualified healthcare provider regarding medication decisions. 
          The analysis is based on available data and may not account for all possible drug interactions or individual patient factors.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerSection;
