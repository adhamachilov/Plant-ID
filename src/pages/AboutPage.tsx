import React from 'react';
import { Leaf, Award, Users, Code, Zap, Clock, Star, ImageIcon, Camera, BookOpen } from 'lucide-react';
import AnimatedElement from '../components/AnimatedElement';
import { useDeviceContext } from '../contexts/DeviceContext';

// Add global styles for the timeline dot pulse animation
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .timeline-dot {
      animation: pulse-glow 2s infinite;
    }
  `}} />
);

const AboutPage: React.FC = () => {
  const { isMobile, isTablet } = useDeviceContext();
  const isMobileOrTablet = isMobile || isTablet;
  const stats = [
    {
      icon: <Leaf className="h-6 w-6 text-emerald-400" />,
      value: '*To Be Updated*',
      label: 'Plant Species'
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-400" />,
      value: '*To Be Updated*',
      label: 'Active Users'
    },
    {
      icon: <Star className="h-6 w-6 text-emerald-400" />,
      value: '95%',
      label: 'Accuracy Rate'
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-400" />,
      value: '< 5s',
      label: 'Recognition Time'
    }
  ];

  const timeline = [
    {
      year: '2024',
      title: 'The Seed Was Planted',
      description: 'After years of exploring coding and AI, I, Adham Abdiyev, began developing a solution to a simple but common problem—identifying plants with a photo.'
    },
    {
      year: 'April 2025',
      title: 'Plant-ID Website Built',
      description: 'In just one month, I single-handedly built the Plant-ID platform—a web-based tool that uses AI to identify plants from user-uploaded images.'
    },
    {
      year: 'May 2025',
      title: 'Launched & Received First Feedback',
      description: 'Plant-ID officially launched. Early users tested the platform, praised its simplicity, and shared valuable feedback that sparked immediate improvements and database expansion.'
    },
    {
      year: 'Next Steps',
      title: 'AI Upgrades & Community Building',
      description: 'I\'m now focused on improving recognition accuracy with better AI models and building a community around the platform by connecting with gardening enthusiasts, schools, and botanical organizations worldwide.'
    }
  ];

  const team = [
    {
      name: 'Adham Abdiyev',
      role: 'Founder & CEO',
      bio: 'Self-taught Full-stack Developer with the intention of bringing real-world AI solutions to everyday users.'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Add the global styles */}
      <GlobalStyles />
      
      <div className="container mx-auto px-4">
        {/* Hero Section - Simplified */}
        <AnimatedElement>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 text-center">
            About <span className="text-emerald-400">PlantID</span>
          </h1>
          <p className="text-emerald-100 text-center max-w-2xl mx-auto mb-8">
            Connecting people with nature through technology
          </p>
        </AnimatedElement>

        {/* Bento Grid Layout - Highly optimized for mobile */}
        {isMobileOrTablet ? (
          <div className="grid grid-cols-2 auto-rows-auto gap-3 mt-6">
            {/* Our Mission - Prominent */}
            <AnimatedElement delay={0.1} className="col-span-2 rounded-xl overflow-hidden">
              <div className="bg-emerald-950/50 backdrop-blur-md p-5 h-full">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900/60 flex items-center justify-center mr-3">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-emerald-100 text-sm">
                  Making botanical knowledge accessible through AI technology that identifies plants from photos instantly.
                </p>
              </div>
            </AnimatedElement>
            
            {/* Stats in small boxes */}
            {stats.map((stat, index) => (
              <AnimatedElement key={index} delay={0.1 + (index * 0.05)} className="rounded-xl overflow-hidden">
                <div className="bg-emerald-950/30 backdrop-blur-sm p-4 text-center h-full flex flex-col justify-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-emerald-900/60 flex items-center justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-emerald-300 text-xs">{stat.label}</div>
                </div>
              </AnimatedElement>
            ))}
            
            {/* Technology features */}
            <AnimatedElement delay={0.3} className="col-span-2 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-900/20 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center text-center">
                  <Zap className="h-6 w-6 text-emerald-400 mb-1" />
                  <h3 className="text-sm font-semibold text-white mb-1">AI Recognition</h3>
                  <p className="text-emerald-100 text-xs">95% accuracy from a single photo</p>
                </div>
                <div className="bg-emerald-900/20 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center text-center">
                  <Code className="h-6 w-6 text-emerald-400 mb-1" />
                  <h3 className="text-sm font-semibold text-white mb-1">Machine Learning</h3>
                  <p className="text-emerald-100 text-xs">Self-improving AI models</p>
                </div>
                <div className="bg-emerald-900/20 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center text-center">
                  <Award className="h-6 w-6 text-emerald-400 mb-1" />
                  <h3 className="text-sm font-semibold text-white mb-1">Database</h3>
                  <p className="text-emerald-100 text-xs">Expertly curated information</p>
                </div>
              </div>
            </AnimatedElement>
            
            {/* How it works */}
            <AnimatedElement delay={0.35} className="col-span-2 rounded-xl overflow-hidden">
              <div className="bg-emerald-950/40 backdrop-blur-sm p-4">
                <h3 className="text-lg font-bold text-white mb-3 text-center">How It Works</h3>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/60 flex items-center justify-center mb-1">
                      <Camera className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-emerald-200">Take a photo</p>
                  </div>
                  <div className="text-emerald-400">→</div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/60 flex items-center justify-center mb-1">
                      <Zap className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-emerald-200">AI analyzes</p>
                  </div>
                  <div className="text-emerald-400">→</div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/60 flex items-center justify-center mb-1">
                      <BookOpen className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-emerald-200">Get results</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            
            {/* Timeline - Compact for mobile */}
            <AnimatedElement delay={0.4} className="col-span-2 rounded-xl overflow-hidden">
              <div className="bg-emerald-950/30 backdrop-blur-sm p-4">
                <h3 className="text-lg font-bold text-white mb-3 text-center">Our Journey</h3>
                <div className="space-y-3">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 timeline-dot mr-3 flex-shrink-0"></div>
                      <div>
                        <div className="text-emerald-400 text-xs font-bold">{item.year}</div>
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <p className="text-emerald-100 text-xs">{item.description.substring(0, 80)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedElement>
            
            {/* Team section */}
            <AnimatedElement delay={0.45} className="col-span-2 rounded-xl overflow-hidden">
              <div className="bg-emerald-950/30 backdrop-blur-sm p-4 text-center">
                <h3 className="text-lg font-bold text-white mb-3">Our Team</h3>
                {team.map((member, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-700/30 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-white">{member.name}</h4>
                      <p className="text-emerald-400 text-xs">{member.role}</p>
                      <p className="text-emerald-100 text-xs">{member.bio.substring(0, 60)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedElement>
          </div>
        ) : (
          /* Desktop Layout - Original layout with some adjustments */
          <>
            {/* Our Mission */}
            <AnimatedElement delay={0.2} className="mt-12">
              <div className="bg-emerald-950/50 backdrop-blur-md rounded-xl p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-2/5 flex justify-center">
                    <div className="relative w-64 h-64 rounded-full bg-emerald-900/60 flex items-center justify-center">
                      <Leaf className="w-32 h-32 text-emerald-400" />
                      <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="md:w-3/5">
                    <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                    <div className="space-y-4 text-emerald-100">
                      <p>
                        We believe in making botanical knowledge accessible to everyone, regardless of their expertise level. Our mission is to bridge the gap between technology and nature, helping people identify and learn about the plants around them.
                      </p>
                      <p>
                        Using advanced AI technology, we've created a platform that can identify plants from a simple photo, providing accurate information about care requirements, growth habits, and interesting facts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            {/* Stats Section */}
            <AnimatedElement delay={0.3} className="mt-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-emerald-950/30 backdrop-blur-sm p-5 rounded-lg text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/60 flex items-center justify-center mb-3">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-emerald-300 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedElement>

            {/* Technology Section */}
            <AnimatedElement delay={0.4} className="mt-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Technology</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-lg bg-emerald-900/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/60 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Recognition</h3>
                  <p className="text-emerald-100">
                    Our advanced convolutional neural networks can identify thousands of plant species with over 95% accuracy from just a single photo.
                  </p>
                </div>
                <div className="p-5 rounded-lg bg-emerald-900/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/60 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Machine Learning</h3>
                  <p className="text-emerald-100">
                    Our models continuously improve through machine learning, analyzing millions of images to enhance recognition capabilities.
                  </p>
                </div>
                <div className="p-5 rounded-lg bg-emerald-900/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/60 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Botanical Database</h3>
                  <p className="text-emerald-100">
                    Built in collaboration with botanists, our database contains detailed information about care, growth habits, and interesting facts.
                  </p>
                </div>
              </div>
            </AnimatedElement>

            {/* Timeline */}
            <AnimatedElement delay={0.5} className="mt-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Journey</h2>
              <div className="space-y-6 relative">
                {/* Line connector */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-emerald-700/50 md:-translate-x-px"></div>
                
                {timeline.map((item, index) => (
                  <div key={index} className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-4 md:gap-8 relative`}>
                    {/* Dot on timeline with pulsing animation */}
                    <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full bg-emerald-500 md:-translate-x-2 timeline-dot"></div>
                    
                    {/* Content */}
                    <div className="md:w-1/2 pl-6 md:pl-0 md:px-6">
                      <div className="bg-emerald-950/30 backdrop-blur-sm p-5 rounded-lg border-l-4 border-emerald-500">
                        <div className="text-emerald-400 font-bold mb-1">{item.year}</div>
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-emerald-100">{item.description}</p>
                      </div>
                    </div>
                    
                    {/* Empty space for the other side */}
                    <div className="md:w-1/2"></div>
                  </div>
                ))}
              </div>
            </AnimatedElement>
            
            {/* Team Section */}
            <AnimatedElement delay={0.6} className="mt-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Team</h2>
              <div className="flex justify-center">
                {team.map((member, index) => (
                  <div key={index} className="bg-emerald-950/30 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-800/30 max-w-sm">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-700/30 mb-4 flex items-center justify-center">
                      <Users className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-emerald-400 mb-3">{member.role}</p>
                    <p className="text-emerald-100 text-sm">{member.bio}</p>
                  </div>
                ))}
              </div>
            </AnimatedElement>
          </>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
