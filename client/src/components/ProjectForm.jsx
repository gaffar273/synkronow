import { useState } from 'react';
import { Save, X } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const ProjectForm = ({ onProjectCreated, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/projects', formData);
      toast.success('✅ Project created successfully!');
      setFormData({ name: '', description: '', deadline: '' });
      if (onProjectCreated) onProjectCreated(data);
      if (onClose) onClose();
    } catch (error) {
      console.error('Create project error:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
      
      <div className="relative glass-card rounded-2xl p-8 border-2 border-emerald-500/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Project</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <span className="text-emerald-400">●</span>
              Project Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white transition-all"
              placeholder="e.g., Website Redesign"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <span className="text-emerald-400">●</span>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white transition-all resize-none"
              placeholder="Brief description of the project..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <span className="text-emerald-400">●</span>
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                <span>Create Project</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
