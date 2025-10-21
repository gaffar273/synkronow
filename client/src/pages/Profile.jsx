import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Key, Save, Lock, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accessCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        accessCode: user.accessCode || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        accessCode: formData.accessCode
      };

      await API.put(`/users/${user._id}`, updateData);
      toast.success('✅ Profile updated successfully!');
      
      // Update local storage
      const updatedUser = { ...user, ...updateData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await API.put(`/users/${user._id}/password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('✅ Password changed successfully!');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to={user.role === 'admin' ? '/admin' : '/dashboard'}
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-8 mb-6 border-2 border-emerald-500/30 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-2xl shadow-emerald-500/50">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            {user.role === 'admin' ? (
              <span className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/50 font-semibold">
                <Shield size={18} />
                Administrator
              </span>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/50 font-semibold">
                <User size={18} />
                User
              </span>
            )}
          </div>
          <p className="text-gray-400">{user.email}</p>
        </div>

        {/* Edit Profile Form */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
          
          <div className="relative glass-card rounded-2xl p-8 border-2 border-emerald-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="text-emerald-400" size={28} />
              Edit Profile
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 pl-12 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white transition-all"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-4 pl-12 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                </div>
              </div>

              {user.role !== 'admin' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <span className="text-emerald-400">●</span>
                    Access Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.accessCode}
                      onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                      className="w-full px-4 py-4 pl-12 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white font-mono transition-all"
                      placeholder="Optional"
                    />
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] group"
              >
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                <span>{loading ? 'Updating...' : 'Update Profile'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
          
          <div className="relative glass-card rounded-2xl p-8 border-2 border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="text-red-400" size={28} />
              Change Password
            </h2>
            
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 text-white transition-all"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 text-white transition-all"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] group"
              >
                <Lock size={20} className="group-hover:scale-110 transition-transform" />
                <span>{loading ? 'Changing...' : 'Change Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
