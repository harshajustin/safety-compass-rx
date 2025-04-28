
import React from 'react';

const HeaderSection = () => {
  return (
    <header className="bg-medical-blue text-white p-4 md:p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Drug Interaction Analysis and Safety System</h1>
        <p className="text-blue-100">Analyze potential drug interactions and safety concerns</p>
      </div>
    </header>
  );
};

export default HeaderSection;
