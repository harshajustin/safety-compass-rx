import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames
import { Star } from 'lucide-react'; // Removed arrow imports
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"; // Import Card components

// Define the shape of a testimonial
interface Testimonial {
  id: number;
  quote: string;
  author: string;
  title: string;
  organization: string;
  image_url: string; // Changed from image to image_url to match potential DB schema
  is_featured: boolean; // Added is_featured flag
}

// Added scroll constants back
const SCROLL_SPEED = 1; 
const SCROLL_INTERVAL = 25;

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null); // Added interval ref back

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:3001/api/testimonials'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Testimonial[] = await response.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []); // Empty dependency array means this runs once on mount

  // Added Auto-scroll Effect back
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || loading || error || testimonials.length === 0) return;

    const startScrolling = () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      intervalIdRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          const maxScrollLeft = scrollWidth - clientWidth;
          if (maxScrollLeft <= 0) { stopScrolling(); return; }
          if (scrollLeft >= maxScrollLeft - 1) {
            scrollContainerRef.current.scrollLeft = 0;
          } else {
            scrollContainerRef.current.scrollLeft += SCROLL_SPEED;
          }
        }
      }, SCROLL_INTERVAL);
    };

    const stopScrolling = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    container.addEventListener('mouseenter', stopScrolling);
    container.addEventListener('mouseleave', startScrolling);
    startScrolling();

    return () => {
      stopScrolling();
      container?.removeEventListener('mouseenter', stopScrolling);
      container?.removeEventListener('mouseleave', startScrolling);
    };
  }, [loading, error, testimonials]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-blue-600 font-semibold mb-3">Testimonials</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Trusted by Healthcare Professionals</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what medical experts are saying about our drug interaction analysis system.
          </p>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            {/* You can replace this with a spinner component */}
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div ref={scrollContainerRef} className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex flex-nowrap gap-8">
              {testimonials.map((testimonial) => (
                <Card 
                  key={testimonial.id}
                  className={cn(
                    "w-96 flex-shrink-0 relative",
                    testimonial.is_featured ? "border-yellow-400 border-2" : ""
                  )}
                >
                  <CardContent className="pt-6">
                    {testimonial.is_featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full z-10">
                        <Star className="h-4 w-4" fill="white" />
                      </div>
                    )}
                    <blockquote className="text-gray-700 italic text-lg mb-0">
                      " {testimonial.quote} "
                    </blockquote>
                  </CardContent>

                  <CardFooter>
                    <div className="flex items-center w-full pt-4 border-t mt-4">
                      <img 
                        src={testimonial.image_url}
                        alt={testimonial.author} 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-gray-600">{testimonial.title}{testimonial.title && testimonial.organization ? ', ' : ''}{testimonial.organization}</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        {/* Render empty state if no testimonials and not loading/error */}
        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No testimonials available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
