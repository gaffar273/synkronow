import { Heart } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 border-t border-emerald-500/20 mt-auto overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center gap-6 mb-6">
          {/* Logo - No Background */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg group-hover:bg-emerald-500/40 transition-all duration-300"></div>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="SynkroNow Logo" 
                  className="w-10 h-10 object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-transparent leading-tight">
                SynkroNow
              </span>
              <span className="text-xs text-gray-500 font-medium">Sync Your Success</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm text-center max-w-md">
            Empowering teams with modern workforce management and seamless collaboration.
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 font-medium">
              Privacy Policy
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 font-medium">
              Terms of Service
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 font-medium">
              Support
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 font-medium">
              Contact
            </a>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-500 flex items-center gap-2">
            © 2025 <span className="text-emerald-400 font-semibold">SynkroNow</span>
            <span className="hidden sm:inline">• All rights reserved</span>
          </p>
          <p className="text-gray-500 flex items-center gap-1.5">
            Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by the SynkroNow Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
