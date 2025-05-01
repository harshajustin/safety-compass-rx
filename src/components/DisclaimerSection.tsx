
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerSection = () => {
  return (
    <div className="mt-8 p-8 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start gap-5">
        <div className="bg-amber-100 p-3 rounded-full">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-xl mb-3 text-gray-800">Medical Disclaimer</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              This tool is provided for informational purposes only and should not replace professional medical advice. 
              Always consult with a qualified healthcare provider regarding medication decisions.
            </p>
            <p> 
              The analysis is based on available data and may not account for all possible drug interactions or individual patient factors.
              Healthcare professionals should use their clinical judgment in conjunction with the information provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerSection;
