
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Twitter, Facebook, Linkedin } from 'lucide-react';

const FooterSection = ({ results = null }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-6 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-500 text-white p-1.5 rounded-md">
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="text-white font-semibold text-xl">Drug Interaction Analysis</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Advanced medication interaction analysis system for healthcare professionals. 
              Helping ensure patient safety through comprehensive drug compatibility review.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-medium mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Open App
                </Link>
              </li>
              <li>
                <Link to="/how-to-use" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  How to Use
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-white text-lg font-medium mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">
            © {currentYear} Drug Interaction Analysis System. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0 text-gray-500">
            Made with care for healthcare professionals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
