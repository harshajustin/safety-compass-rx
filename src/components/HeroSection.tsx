
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-50 to-white pointer-events-none" aria-hidden="true" />
      
      {/* Hero content */}
      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="flex flex-col space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full max-w-max">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Trusted by Medical Professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              <span className="block">Analyze Drug Interactions</span>
              <span className="block text-blue-600">Safely & Accurately</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-lg">
              Our comprehensive system helps healthcare professionals identify potential drug interactions and ensure patient safety.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3"
              >
                <Link to="/app">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-blue-200 hover:bg-blue-50"
              >
                <Link to="/how-to-use">
                  Learn More
                </Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Evidence-based analysis</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">HIPAA Compliant</span>
              </div>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20" />
              <div className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
                  alt="Medical professional analyzing drug interactions" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-blue-100 blur-2xl opacity-70" />
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-purple-100 blur-2xl opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
