
import React from 'react';
import { AlertTriangle, Shield, PieChart, Heart, Clock, FileText, Pill, Coffee, Wine } from 'lucide-react';

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
  },
  {
    icon: <Pill className="h-10 w-10 text-indigo-500" />,
    title: 'Drug-drug Interactions',
    description: 'Advanced detection and analysis of how medications interact with each other.'
  },
  {
    icon: <Coffee className="h-10 w-10 text-yellow-600" />,
    title: 'Drug-food Interactions',
    description: 'Identify foods that may affect medication efficacy or cause adverse reactions.'
  },
  {
    icon: <Wine className="h-10 w-10 text-red-600" />,
    title: 'Drug-alcohol Interactions',
    description: 'Analyze potential risks when combining medications with alcohol consumption.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-blue-600 font-semibold mb-3">Features</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Tools for Healthcare</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our system provides advanced features to ensure medication safety and improve patient outcomes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:translate-y-[-5px] duration-300"
            >
              <div className="mb-5 inline-flex items-center justify-center rounded-full bg-gray-50 p-4 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
