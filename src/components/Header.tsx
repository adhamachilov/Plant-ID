import React, { useState, useEffect } from 'react';
import { Leaf, Camera, Menu, X, Home, Search, Info, Mail, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDeviceContext } from '../contexts/DeviceContext';

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void; pathname: string }> = ({ isOpen, onClose, pathname }) => {
  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);
  
  return (
    <div 
      className={`fixed inset-0 z-[1000] transition-all duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      onClick={onClose}
    >
      {/* Darkened overlay */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'}`} />
      
      {/* Side drawer */}
      <div 
        className={`absolute top-0 bottom-0 right-0 w-[80%] max-w-sm bg-emerald-950/95 backdrop-blur-md shadow-xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-800/50">
          <div className="flex items-center space-x-3">
            <Leaf className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-semibold text-white">PlantID</span>
          </div>
          <button 
            className="p-2 rounded-full text-white hover:bg-emerald-800/50 transition-colors"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Menu links */}
        <div className="p-5 space-y-2">
          <Link 
            to="/" 
            className={`flex items-center space-x-4 p-3 rounded-lg ${pathname === '/' ? 'bg-emerald-800/50 text-emerald-400' : 'text-white hover:bg-emerald-900/40'} transition-colors`}
            onClick={onClose}
          >
            <Home className="h-5 w-5" />
            <span className="text-lg">Home</span>
          </Link>
          
          <Link 
            to="/identify" 
            className={`flex items-center space-x-4 p-3 rounded-lg ${pathname === '/identify' ? 'bg-emerald-800/50 text-emerald-400' : 'text-white hover:bg-emerald-900/40'} transition-colors`}
            onClick={onClose}
          >
            <Search className="h-5 w-5" />
            <span className="text-lg">Identify</span>
          </Link>
          
          <Link 
            to="/plants" 
            className={`flex items-center space-x-4 p-3 rounded-lg ${pathname === '/plants' ? 'bg-emerald-800/50 text-emerald-400' : 'text-white hover:bg-emerald-900/40'} transition-colors`}
            onClick={onClose}
          >
            <Leaf className="h-5 w-5" />
            <span className="text-lg">Plants</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`flex items-center space-x-4 p-3 rounded-lg ${pathname === '/about' ? 'bg-emerald-800/50 text-emerald-400' : 'text-white hover:bg-emerald-900/40'} transition-colors`}
            onClick={onClose}
          >
            <Info className="h-5 w-5" />
            <span className="text-lg">About</span>
          </Link>
          
          <Link 
            to="/contact" 
            className={`flex items-center space-x-4 p-3 rounded-lg ${pathname === '/contact' ? 'bg-emerald-800/50 text-emerald-400' : 'text-white hover:bg-emerald-900/40'} transition-colors`}
            onClick={onClose}
          >
            <Mail className="h-5 w-5" />
            <span className="text-lg">Contact</span>
          </Link>
        </div>
        
        {/* Call to action button */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-emerald-800/50">
          <Link
            to="/identify"
            className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-medium p-4 rounded-lg transition-colors w-full"
            onClick={onClose}
          >
            <Camera className="h-5 w-5" />
            <span className="text-lg">Identify Plant</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, isTablet } = useDeviceContext();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 backdrop-blur-lg bg-transparent" style={{ zIndex: 999 }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors duration-300"
          >
            <Leaf className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-semibold tracking-tight">PlantID</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="px-8 py-3 rounded-full bg-emerald-900/80 backdrop-blur-md hidden md:block">
              <nav className="flex items-center space-x-8">
                <Link to="/" className="text-white hover:text-emerald-400 transition-colors duration-300">Home</Link>
                <Link to="/identify" className="text-white hover:text-emerald-400 transition-colors duration-300">Identify</Link>
                <Link to="/plants" className="text-white hover:text-emerald-400 transition-colors duration-300">Plants</Link>
                <Link to="/about" className="text-white hover:text-emerald-400 transition-colors duration-300">About</Link>
                <Link to="/contact" className="text-white hover:text-emerald-400 transition-colors duration-300">Contact</Link>
              </nav>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/identify" 
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-medium px-4 py-2 rounded-full transition-colors duration-300"
            >
              <Camera className="h-4 w-4" />
              <span>Identify</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full text-white hover:bg-emerald-800/50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        pathname={location.pathname} 
      />
    </>
  );
};

export default Header;