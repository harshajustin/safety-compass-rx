
import React from 'react';

const testimonials = [
  {
    quote: "This tool has dramatically improved our medication review process and helped us catch several potential interactions we might have missed.",
    author: "Dr. Sarah Johnson",
    title: "Chief Pharmacist",
    organization: "Memorial Healthcare"
  },
  {
    quote: "The visual reports make it easy to explain potential risks to patients. It's become an essential part of our patient education process.",
    author: "Dr. Michael Chen",
    title: "Primary Care Physician",
    organization: "Westside Medical Group"
  },
  {
    quote: "As a nursing director, I've seen this tool improve our medication administration safety across the entire department.",
    author: "Lisa Rodriguez, RN",
    title: "Director of Nursing",
    organization: "Sunnyvale Hospital"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Healthcare Professionals</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what medical experts are saying about our drug interaction analysis system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
            >
              <div className="mb-4">
                <svg width="45" height="36" className="text-blue-300" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.4 36C10.3333 36 7.73333 34.9333 5.6 32.8C3.46667 30.6667 2.4 28.0667 2.4 25C2.4 21.8667 3.46667 19.2 5.6 17C7.73333 14.8 10.3333 13.7333 13.4 13.7333C16.4667 13.7333 19.0667 14.8 21.2 17C23.3333 19.2 24.4 21.8667 24.4 25C24.4 26.3333 24.2667 27.6 24 28.8C23.7333 30 23.3333 31.1333 22.8 32.2L34.4 32.2C35.2 32.2 35.8667 32.4667 36.4 33C36.9333 33.5333 37.2 34.2 37.2 35C37.2 35.8 36.9333 36.4667 36.4 37C35.8667 37.5333 35.2 37.8 34.4 37.8H13.4V36ZM34.4 36C31.3333 36 28.7333 34.9333 26.6 32.8C24.4667 30.6667 23.4 28.0667 23.4 25C23.4 21.8667 24.4667 19.2 26.6 17C28.7333 14.8 31.3333 13.7333 34.4 13.7333C37.4667 13.7333 40.0667 14.8 42.2 17C44.3333 19.2 45.4 21.8667 45.4 25C45.4 28.1333 44.3333 30.7333 42.2 32.8C40.0667 34.9333 37.4667 36 34.4 36ZM13.4 30.4C14.8 30.4 16 29.8667 17 28.8C18 27.7333 18.5 26.4667 18.5 25C18.5 23.5333 18 22.3333 17 21.4C16 20.4667 14.8 20 13.4 20C12 20 10.8 20.4667 9.8 21.4C8.8 22.3333 8.3 23.5333 8.3 25C8.3 26.4667 8.8 27.7333 9.8 28.8C10.8 29.8667 12 30.4 13.4 30.4ZM34.4 30.4C35.8 30.4 37 29.8667 38 28.8C39 27.7333 39.5 26.4667 39.5 25C39.5 23.5333 39 22.3333 38 21.4C37 20.4667 35.8 20 34.4 20C33 20 31.8 20.4667 30.8 21.4C29.8 22.3333 29.3 23.5333 29.3 25C29.3 26.4667 29.8 27.7333 30.8 28.8C31.8 29.8667 33 30.4 34.4 30.4Z" fill="currentColor"/>
                </svg>
              </div>
              <blockquote className="mb-6 text-gray-700 italic">{testimonial.quote}</blockquote>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-600 text-sm">{testimonial.title}, {testimonial.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
