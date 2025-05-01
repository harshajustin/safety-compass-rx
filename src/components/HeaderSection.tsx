
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeaderSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // Apply sticky positioning and glassmorphism styles
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Title Area */}
        <Link to="/" className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-blue-600" /> 
          <h1 className="text-lg font-semibold text-gray-800">Drug Interaction Analysis</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/how-to-use" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            How to Use
          </Link>
          <Button asChild variant="outline" className="ml-4">
            <Link to="/app">Open App</Link>
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-md">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/how-to-use" 
              className="text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How to Use
            </Link>
            <Button asChild className="w-full mt-2">
              <Link 
                to="/app" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Open App
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderSection;
