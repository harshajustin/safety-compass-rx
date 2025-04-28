
import React from 'react';
import { SafetyAssessmentResult } from '@/types';

interface FooterSectionProps {
  results: SafetyAssessmentResult | null;
}

const FooterSection = ({ results }: FooterSectionProps) => {
  return (
    <footer className="bg-gray-100 border-t p-6 mt-12">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>Drug Interaction Analysis and Safety System (DIASS) © 2025</p>
        <p className="mt-1">Database Version: {results?.databaseVersion || '1.0.0'} | Last Updated: {results?.lastUpdated || '2025-04-28'}</p>
      </div>
    </footer>
  );
};

export default FooterSection;
