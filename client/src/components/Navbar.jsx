import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Menu, X, Settings, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gray-900/80 backdrop-blur-xl border-b border-emerald-500/30 shadow-2xl shadow-emerald-500/10 mx-4 mt-4 rounded-2xl' 
        : 'bg-gray-900/60 backdrop-blur-md border-b border-emerald-500/20'
    }`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-2'
      }`}>
        <div className="flex justify-between items-center h-16">
          {/* Logo - No Background */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group cursor-pointer focus:outline-none bg-transparent border-0"
            style={{ userSelect: "none" }}
            title="Go to Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg group-hover:bg-emerald-500/40 transition-all duration-300"></div>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="SynkroNow Logo" 
                  className="w-10 h-10 object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-transparent leading-tight">
                SynkroNow
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase hidden sm:block">
                Sync Your Success
              </span>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dashboard Link - Only for Admin */}
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/10 group"
              >
                <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
                <span>Dashboard</span>
              </Link>
            )}
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-4 py-2.5 bg-gray-800/50 rounded-xl border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-white leading-tight">{user.name}</span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    {user.role === 'admin' ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                        Admin
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        User
                      </>
                    )}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-xl border-2 border-emerald-500/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fadeIn">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    {user.accessCode && (
                      <div className="flex items-center gap-2 mt-2 px-2 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Code:</span>
                        <span className="text-xs text-emerald-400 font-mono font-bold">{user.accessCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-colors group"
                    >
                      <Settings size={18} className="text-emerald-400 group-hover:rotate-90 transition-transform duration-300" />
                      <span className="font-medium">Edit Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors group"
                    >
                      <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            {isMenuOpen ? (
              <X size={20} className="text-emerald-400" />
            ) : (
              <Menu size={20} className="text-emerald-400" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-2 animate-fadeIn border-t border-gray-800/50 mt-2">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/10 border-2 border-transparent hover:border-emerald-500/30"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}

            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-xl border-2 border-gray-700/50">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">{user.name}</span>
                <span className="text-xs text-emerald-400">{user.role}</span>
              </div>
            </div>

            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/10 border-2 border-transparent hover:border-emerald-500/30"
            >
              <Settings size={18} />
              <span>Edit Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-3 rounded-xl transition-all border-2 border-red-500/30 font-semibold"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
