
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeaderSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Title Area */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-md">
            <Stethoscope className="h-5 w-5" /> 
          </div>
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
          <Button asChild variant="default" className="ml-4 bg-blue-600 hover:bg-blue-700">
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
        <div className="md:hidden bg-white border-b border-gray-200 shadow-md animate-fade-in">
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
