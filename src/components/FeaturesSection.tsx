
import React from 'react';
import { AlertTriangle, Shield, PieChart, Heart, Clock, FileText } from 'lucide-react';

const features = [
  {
    icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
    title: 'Risk Detection',
    description: 'Identify potential drug interactions that may cause adverse effects to patients.'
  },
  {
    icon: <Shield className="h-10 w-10 text-blue-500" />,
    title: 'Safety Assessment',
    description: 'Comprehensive safety analysis based on patient data and medical history.'
  },
  {
    icon: <PieChart className="h-10 w-10 text-green-500" />,
    title: 'Visual Reports',
    description: 'Generate clear visual reports for better decision-making and documentation.'
  },
  {
    icon: <Heart className="h-10 w-10 text-red-500" />,
    title: 'Patient-Centered',
    description: 'Take patient-specific factors into account for personalized analysis.'
  },
  {
    icon: <Clock className="h-10 w-10 text-purple-500" />,
    title: 'Time-Efficient',
    description: 'Quickly analyze multiple medications to save valuable clinical time.'
  },
  {
    icon: <FileText className="h-10 w-10 text-gray-500" />,
    title: 'Documentation',
    description: 'Generate and export detailed documentation for patient records.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our system provides comprehensive tools to ensure medication safety and improve patient outcomes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-white p-3 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
