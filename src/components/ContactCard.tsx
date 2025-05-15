import React, { useState } from 'react';
import SocialIcons from './SocialIcons';
import { Mail, Send } from 'lucide-react';

const ContactCard: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
    // Show success message (in a real app)
    alert('Thank you for your message! We will get back to you soon.');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position (limited effect)
    const rotateX = ((y - rect.height / 2) / rect.height) * -10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;

    setMousePosition({ x, y });
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className="w-full rounded-2xl sm:rounded-3xl bg-emerald-950 relative overflow-hidden group perspective-1000 opacity-0 animate-fadeIn"
      style={{
        animationFillMode: 'forwards',
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s linear',
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 z-0">
        {/* Vertical lines */}
        {Array.from({ length: 13 }).map((_, i) => (
          <div 
            key={`vertical-${i}`} 
            className={`absolute left-0 right-0 h-px ${i % 3 === 0 ? 'bg-emerald-800' : 'bg-emerald-900'} ${i % 4 === 0 ? 'opacity-40' : 'opacity-20'}`} 
            style={{ top: `${(i / 12) * 100}%` }} 
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: 13 }).map((_, i) => (
          <div 
            key={`horizontal-${i}`} 
            className={`absolute top-0 bottom-0 w-px ${i % 3 === 0 ? 'bg-emerald-800' : 'bg-emerald-900'} ${i % 4 === 0 ? 'opacity-40' : 'opacity-20'}`}
            style={{ left: `${(i / 12) * 100}%` }} 
          />
        ))}
      </div>

      {/* Cursor Light Effect */}
      <div 
        className="pointer-events-none absolute -inset-px z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(5, 150, 105, 0.15), transparent 40%)`
        }}
      />

      {/* Accent Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-emerald-700 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-emerald-800 rounded-full opacity-15 blur-3xl" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 p-4 sm:p-6 pb-6 sm:pb-8">
        {/* Card Title Section */}
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center animate-slideDown"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <div className="w-40 sm:w-48 h-20 sm:h-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-800 to-emerald-700 rounded-b-3xl opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-white" />
                <span className="text-white font-semibold text-base sm:text-lg">Contact Us</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card Content - with padding to account for the title */}
        <div className="mt-20 sm:mt-24 pt-2 flex flex-col items-center">
          {/* Social Icons */}
          <SocialIcons />

          {/* Contact Form */}
          <form 
            className="mt-6 sm:mt-8 w-full max-w-md opacity-0 animate-fadeIn"
            style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}
            onSubmit={handleSubmit}
          >
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-emerald-300 mb-1 text-xs sm:text-sm font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-emerald-900/50 border border-emerald-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-emerald-300 mb-1 text-xs sm:text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-emerald-900/50 border border-emerald-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-emerald-300 mb-1 text-xs sm:text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-emerald-900/50 border border-emerald-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm sm:text-base px-3 sm:px-4 py-2.5 sm:py-3 rounded-full transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
