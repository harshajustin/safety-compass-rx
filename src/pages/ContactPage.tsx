
import React from 'react';
import ContactForm from '@/components/ContactForm';
import HeaderSection from '@/components/HeaderSection';
import FooterSection from '@/components/FooterSection';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderSection />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our drug interaction analysis tool? We're here to help.
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Get in Touch</h3>
              <p className="mt-2 text-muted-foreground">
                We value your feedback and questions. Our team is ready to assist you.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="mt-2 text-muted-foreground">harshajustin2@gmail.com</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Support Hours</h3>
              <p className="mt-2 text-muted-foreground">Monday - Friday: 9AM - 5PM EST</p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default ContactPage;
