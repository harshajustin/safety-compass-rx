
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { Mail } from 'lucide-react';

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // In a real application, this would send data to a backend endpoint
      // For now, we'll simulate success and show what would be emailed
      console.log('Form data to be sent:', data);
      
      // Email template that would be sent (for demonstration)
      const emailTemplate = `
        To: harshajustin2@gmail.com
        Subject: New Contact Form Submission
        
        Name: ${data.name}
        Email: ${data.email}
        
        Message:
        ${data.message}
      `;
      
      console.log('Email that would be sent:', emailTemplate);
      
      // Show success message
      toast.success('Message sent successfully!', {
        description: 'Thank you for contacting us. We will get back to you soon.',
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message', {
        description: 'Please try again later or email us directly.',
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="How can we help you?" 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            <Mail className="mr-2 h-4 w-4" /> Send Message
          </Button>
          
          <FormDescription className="text-center">
            We'll never share your information with anyone else.
          </FormDescription>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
