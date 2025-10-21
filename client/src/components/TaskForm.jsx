import { useState } from 'react';
import { Save, X } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const TaskForm = ({ projectId, onTaskCreated, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignToEmails: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailList = formData.assignToEmails
        .split(',')
        .map(e => e.trim())
        .filter(e => e);

      const { data } = await API.post('/tasks', {
        ...formData,
        projectId,
        assignToEmails: emailList.length > 0 ? emailList : undefined
      });

      toast.success('✅ Task created successfully!');
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        assignToEmails: ''
      });
      if (onTaskCreated) onTaskCreated(data);
      if (onClose) onClose();
    } catch (error) {
      console.error('Create task error:', error);
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
      
      <div className="relative glass-card rounded-2xl p-8 border-2 border-blue-500/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Task</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white transition-all"
              placeholder="e.g., Design homepage mockup"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white transition-all resize-none"
              placeholder="Describe the task in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white transition-all"
              >
                <option value="low">🔵 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Assign to Users (Optional)
            </label>
            <input
              type="text"
              value={formData.assignToEmails}
              onChange={(e) => setFormData({ ...formData, assignToEmails: e.target.value })}
              className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white transition-all"
              placeholder="user1@email.com, user2@email.com"
            />
            <p className="text-xs text-gray-500 mt-2">Separate multiple emails with commas</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                <span>Create Task</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
