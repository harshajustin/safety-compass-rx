
import React from 'react';
import HeaderSection from '@/components/HeaderSection';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialSection from '@/components/TestimonialSection';
import CallToAction from '@/components/CallToAction';
import DisclaimerSection from '@/components/DisclaimerSection';
import FooterSection from '@/components/FooterSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeaderSection />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialSection />
        <CallToAction />
        <div className="container mx-auto px-4 py-8">
          <DisclaimerSection />
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default LandingPage;
