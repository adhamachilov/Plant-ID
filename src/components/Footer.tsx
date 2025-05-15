import React from 'react';
import { Leaf, Mail, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="text-white pt-8 pb-8 mt-6 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-semibold tracking-tight">PlantID</span>
            </Link>
            <p className="text-emerald-300 text-sm mb-6 max-w-xs">
              Identify any plant instantly using our AI-powered technology. Get detailed care tips and interesting facts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-emerald-400 hover:text-white transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-emerald-400 hover:text-white transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-emerald-400 hover:text-white transition-colors duration-300">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/identify" className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300">
                  Identify Plants
                </Link>
              </li>
              <li>
                <Link to="/plants" className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300">
                  Plant Database
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300">
                  Care Guides
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300">
                  Plant Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Stay Updated</h3>
            <p className="text-emerald-300 text-sm mb-4">
              Subscribe to our newsletter for plant care tips and updates.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 bg-emerald-900 border border-emerald-800 rounded-l-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 px-4 py-2 font-medium rounded-r-md transition-colors duration-300"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 text-center">
          <p className="text-emerald-400 text-sm">
            © {new Date().getFullYear()} PlantID. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;