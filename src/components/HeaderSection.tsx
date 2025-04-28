import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react'; // Optional: Add an icon

const HeaderSection = () => {
  return (
    // Apply sticky positioning and glassmorphism styles
    <header className="sticky top-0 z-50 w-full bg-white/50 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Title Area */}
        <Link to="/" className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-blue-600" /> 
          <h1 className="text-lg font-semibold text-gray-800">Drug Interaction Analysis and Safety System</h1>
        </Link>
        
        {/* Navigation */}
        <nav>
          <Link 
            to="/how-to-use" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            How to Use
          </Link>
          {/* Add other nav links here if needed */}
        </nav>
      </div>
    </header>
  );
};

export default HeaderSection;
