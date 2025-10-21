import { useState, useEffect } from 'react';
import { Users, Mail, Key, Trash2, Loader, Shield, User, X, AlertTriangle } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

// Modern Confirmation Modal Component
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  userName = ""
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-red-500/20 max-w-md w-full overflow-hidden animate-scale-in">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 animate-pulse">
              <AlertTriangle size={32} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white text-center mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-400 text-center mb-2 leading-relaxed">
            {message}
          </p>
          
          {userName && (
            <p className="text-white text-center font-semibold mb-6 text-lg">
              "{userName}"
            </p>
          )}

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm text-center">
              ⚠️ This action cannot be undone!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white font-semibold rounded-xl transition-all duration-200 border border-gray-700 hover:border-gray-600"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/users/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const openDeleteModal = (userId, userName) => {
    // Directly open the modal without any browser confirm
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: '' });
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/users/${deleteModal.userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateAccessCode = async (userId, currentName) => {
    const accessCode = prompt(`Enter new access code for ${currentName}:`);
    if (!accessCode) return;

    try {
      await API.patch(`/users/${userId}/access-code`, { accessCode });
      toast.success('Access code updated successfully');
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Failed to update access code:', error);
      toast.error('Failed to update access code');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-emerald-400" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete"
        userName={deleteModal.userName}
        confirmText="Delete User"
        cancelText="Cancel"
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-xl border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-500/20 p-4 rounded-xl">
                <Users className="text-blue-400" size={32} />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Admins</p>
                <p className="text-3xl font-bold text-white">{stats.adminCount}</p>
              </div>
              <div className="bg-purple-500/20 p-4 rounded-xl">
                <Shield className="text-purple-400" size={32} />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Regular Users</p>
                <p className="text-3xl font-bold text-white">{stats.userCount}</p>
              </div>
              <div className="bg-green-500/20 p-4 rounded-xl">
                <User className="text-green-400" size={32} />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">With Access Code</p>
                <p className="text-3xl font-bold text-white">{stats.usersWithAccessCode}</p>
              </div>
              <div className="bg-orange-500/20 p-4 rounded-xl">
                <Key className="text-orange-400" size={32} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-emerald-500/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users size={24} className="text-emerald-400" />
            User Management ({users.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Access Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-400">
                      <Mail size={16} className="mr-2 text-emerald-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/50'
                    }`}>
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1">
                          <Shield size={14} />
                          Admin
                        </span>
                      ) : (
                        'User'
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {user.accessCode ? (
                        <span className="font-mono bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/50 text-emerald-400">
                          {user.accessCode}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">Not assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateAccessCode(user._id, user.name)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-500/10 rounded-lg"
                        title="Update Access Code"
                      >
                        <Key size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user._id, user.name)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
