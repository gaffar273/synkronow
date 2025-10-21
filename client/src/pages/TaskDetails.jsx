import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import ChatBox from '../components/ChatBox';
import { GitBranch, Calendar, User, CheckCircle, Clock, Code, ArrowLeft, Loader, AlertCircle, Save, Github } from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/tasks/${id}`);
      setTask(data);
      setGithubLink(data.githubRepoLink || '');
      setStatus(data.status);
    } catch (error) {
      console.error('Failed to load task:', error);
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put(`/tasks/${id}`, { githubRepoLink: githubLink, status });
      toast.success('✅ Task updated successfully!');
      fetchTask();
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig = {
    'pending': { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    'in-progress': { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', dot: 'bg-blue-500' },
    'completed': { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', dot: 'bg-green-500' }
  };

  const priorityConfig = {
    'low': { color: 'text-gray-400', icon: '🔵' },
    'medium': { color: 'text-blue-400', icon: '🟡' },
    'high': { color: 'text-orange-400', icon: '🟠' },
    'urgent': { color: 'text-red-400', icon: '🔴' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="animate-spin text-emerald-400" size={48} />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Task not found</h2>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const statusStyle = statusConfig[task.status] || statusConfig['pending'];
  const priorityStyle = priorityConfig[task.priority || 'medium'];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Task Header Card */}
        <div className="glass-card rounded-2xl p-8 mb-6 border-2 border-emerald-500/30">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{task.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
                  <Code size={18} className="text-emerald-400" />
                  <span className="font-mono font-bold text-emerald-400 text-lg">{task.taskCode}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}>
                  <span className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}></span>
                  <span className="font-semibold">{task.status}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 ${priorityStyle.color}`}>
                  <span>{priorityStyle.icon}</span>
                  <span className="capitalize font-semibold">{task.priority || 'medium'} Priority</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{task.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Due Date</p>
                <p className="text-white font-bold">{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <User size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Assigned By</p>
                <p className="text-white font-bold">{task.assignedBy?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Created</p>
                <p className="text-white font-bold">{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Task Form */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
          
          <div className="relative glass-card rounded-2xl p-8 border-2 border-emerald-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Update Task</h2>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              {/* GitHub Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  GitHub Repository Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-4 pl-12 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Github className="text-gray-500" size={20} />
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white font-semibold transition-all"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">🚀 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={updating}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] group"
              >
                {updating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Update Task</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Chat Discussion */}
        <ChatBox taskId={id} />
      </div>
    </div>
  );
};

export default TaskDetails;
