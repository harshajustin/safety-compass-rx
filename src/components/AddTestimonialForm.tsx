import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FormData {
  quote: string;
  author: string;
  title: string;
  organization: string;
  is_featured: boolean;
}

const AddTestimonialForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    quote: '',
    author: '',
    title: '',
    organization: '',
    is_featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === 'checkbox') return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (success) {
      timer = setTimeout(() => {
        navigate('/');
      }, 1500);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:3001/api/testimonials', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setFormData({
        quote: '',
        author: '',
        title: '',
        organization: '',
        is_featured: false,
      });
      setSuccess('Testimonial added successfully! Redirecting...');

    } catch (err: any) {
      console.error("Failed to add testimonial:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Add New Testimonial</h2>
      
      <div className="space-y-2">
        <Label htmlFor="quote">Quote*</Label>
        <Textarea
          id="quote"
          name="quote"
          value={formData.quote}
          onChange={handleChange}
          required
          placeholder="Enter the testimonial quote..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author*</Label>
        <Input
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          placeholder="e.g., Dr. Jane Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Chief of Medicine"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Input
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          placeholder="e.g., General Hospital"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is_featured"
          name="is_featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) => {
            const newCheckedState = !!checked;
            setFormData((prevData) => ({ ...prevData, is_featured: newCheckedState }));
          }}
        />
        <Label htmlFor="is_featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Featured
        </Label>
      </div>

      {error && <p className="text-red-600">Error: {error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <Button type="submit" disabled={isSubmitting || !!success}>
        {isSubmitting ? 'Adding...' : (success ? 'Added!' : 'Add Testimonial')}
      </Button>
    </form>
  );
};

export default AddTestimonialForm; 