
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const FooterSection = ({ results = null }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-blue-400" />
              <span className="text-white font-semibold text-lg">Drug Interaction Analysis</span>
            </Link>
            <p className="text-gray-400">
              Advanced medication interaction analysis for healthcare professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
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
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
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
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">
            © {currentYear} Drug Interaction Analysis System. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-400">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
