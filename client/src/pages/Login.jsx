import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Navigate based on role
        
          navigate('/');
        
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main card */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-emerald-500/20 relative overflow-hidden">
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          
          {/* Icon container */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transform transition-transform hover:scale-105">
                <LogIn size={36} className="text-white" />
              </div>
              {/* Decorative corner accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400/50 rounded-tl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400/50 rounded-br-lg"></div>
            </div>
          </div>
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-lg">
              Sign in to continue to your portal
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className={`transition-colors ${focusedField === 'email' ? 'text-emerald-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/60 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:bg-gray-800/80 text-white placeholder-gray-500 transition-all duration-200 outline-none"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Password
                </label>
                <button type="button" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className={`transition-colors ${focusedField === 'password' ? 'text-emerald-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/60 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:bg-gray-800/80 text-white placeholder-gray-500 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/80 text-gray-500 font-medium">OR</span>
            </div>
          </div>
          
          {/* Register link */}
          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={() => navigate('/register')} 
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Decorative bottom element */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Secure login powered by encryption</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
