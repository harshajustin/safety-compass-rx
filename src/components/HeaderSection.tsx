
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Menu, X, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HeaderSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, isLoading, logout } = useAuth();

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const renderAuthSection = () => {
    if (isLoading) {
      return <Button variant="ghost" size="sm" disabled>Loading...</Button>;
    }
    if (currentUser) {
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
            <AvatarFallback>{currentUser.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      );
    } else {
      return (
        <a href="http://localhost:3001/auth/google" className="ml-4">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
        </a>
      );
    }
  };

  const renderMobileAuthSection = () => {
    if (isLoading) {
      return <Button variant="ghost" disabled className="w-full justify-start">Loading...</Button>;
    }
    if (currentUser) {
      return (
        <>
          <div className="flex items-center gap-3 px-1 py-2 text-gray-700">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
              <AvatarFallback>{currentUser.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{currentUser.displayName}</span>
          </div>
          <Button variant="ghost" onClick={logout} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
             <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </>
      );
    } else {
      return (
        <a href="http://localhost:3001/auth/google" className="block w-full">
           <Button className="w-full mt-2">
              <LogIn className="mr-2 h-4 w-4" /> Sign In with Google
           </Button>
        </a>
      );
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-transparent'
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
        
        {/* Desktop Navigation & Auth */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/how-to-use" className="text-sm font-medium text-gray-600 hover:text-blue-600">How to Use</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600">Contact</Link>
            {currentUser && (
               <Link to="/add-testimonial" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                 Add Testimonial
               </Link>
            )}
          </nav>
          {renderAuthSection()}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
             {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
           </Button>
         </div>
       </div>
      
       {/* Mobile Menu */}
       {isMobileMenuOpen && (
         <div className="md:hidden bg-white border-b border-gray-200 shadow-md animate-fade-in">
           <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
             <Link to="/" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
             <Link to="/how-to-use" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>How to Use</Link>
             <Link to="/contact" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
             {currentUser && (
               <Link to="/add-testimonial" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                 Add Testimonial
               </Link>
             )}
             {renderMobileAuthSection()}
           </nav>
         </div>
       )}
     </header>
  );
};

export default HeaderSection;
