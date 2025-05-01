
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const benefits = [
  "Instant drug interaction analysis",
  "Comprehensive safety reports",
  "Patient-specific recommendations"
];

const CallToAction = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-800" />
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Start analyzing drug interactions today
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Join thousands of healthcare professionals who trust our system for accurate medication safety analysis
              </p>
              
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-white">
                    <span className="bg-blue-400/30 p-1 rounded-full mr-3">
                      <Check className="h-5 w-5" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-white text-indigo-700 hover:bg-blue-50 shadow-lg shadow-indigo-900/20"
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
                  className="border-white text-white hover:bg-blue-700/30 transition-colors"
                >
                  <Link to="/how-to-use">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl transform transition-transform duration-300 hover:scale-[1.02]">
                <img 
                  src="/lovable-uploads/e6d897c6-a416-4bf9-be82-bd93d19656d5.png" 
                  alt="Healthcare professional using tablet" 
                  className="w-full rounded-xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1631815587646-b85a1bb027e3?auto=format&fit=crop&q=80&w=600";
                    console.log("Image failed to load, using fallback");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
