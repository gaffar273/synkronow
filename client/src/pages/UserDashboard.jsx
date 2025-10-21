import { useState, useEffect } from 'react';
import API from '../utils/api';
import TaskCard from '../components/TaskCard';
import RequestTaskAccess from '../components/RequestTaskAccess';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  CheckCircle,
  Activity,
  Clock,
  MessageCircle,
  UserPlus,
  Loader,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestTask, setShowRequestTask] = useState(false);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/tasks/my-tasks');
      setTasks(data);
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/20 py-8 pt-25">
      <div className="max-w-7xl mx-auto px-4">

        {/* Welcome Banner with Animation */}
        <div className="glass-card rounded-3xl px-8 py-10 mb-10 border border-emerald-500/30 text-center relative overflow-hidden group">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-4 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/30">
              <Sparkles size={16} className="text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">PRODUCTIVITY HUB</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
              Welcome back, {user.name.toUpperCase()}! 🚀
            </h1>
            <p className="text-lg text-gray-300 mt-2 mb-0 max-w-2xl mx-auto">
              Track your tasks and collaborate with your team in real-time
            </p>
          </div>
        </div>

        {/* Completion Progress Bar */}
        {tasks.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-10 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={24} className="text-emerald-400" />
                <span className="text-white font-bold text-lg">Overall Progress</span>
              </div>
              <span className="text-emerald-400 font-bold text-2xl">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000 ease-out rounded-full relative overflow-hidden"
                style={{ width: `${completionRate}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        )}

        {/* Stats as Cards with Stagger Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="glass-card flex flex-col items-center gap-2 text-center p-8 border-emerald-500/30 hover:border-emerald-500/70 transition-all group shadow-lg hover:shadow-emerald-400/40 hover:-translate-y-2 duration-300">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-4 rounded-2xl mb-2 group-hover:scale-110 transition-transform">
              <Briefcase size={42} className="text-emerald-400 drop-shadow-lg" />
            </div>
            <p className="text-xs text-gray-400 tracking-widest mb-1 font-bold uppercase">Total Tasks</p>
            <div className="text-5xl font-black text-white group-hover:text-emerald-400 transition-colors">{tasks.length}</div>
          </div>
          
          <div className="glass-card flex flex-col items-center gap-2 text-center p-8 border-green-500/30 hover:border-green-500/70 transition-all group shadow-lg hover:shadow-green-400/40 hover:-translate-y-2 duration-300">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-2xl mb-2 group-hover:scale-110 transition-transform relative">
              <CheckCircle size={42} className="text-green-400 drop-shadow-lg" />
              {tasks.filter(t => t.status === 'completed').length > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full animate-ping"></div>
              )}
            </div>
            <p className="text-xs text-gray-400 tracking-widest mb-1 font-bold uppercase">Completed</p>
            <div className="text-5xl font-black text-white group-hover:text-green-400 transition-colors">{tasks.filter(t => t.status === 'completed').length}</div>
          </div>
          
          <div className="glass-card flex flex-col items-center gap-2 text-center p-8 border-blue-500/30 hover:border-blue-500/70 transition-all group shadow-lg hover:shadow-blue-400/40 hover:-translate-y-2 duration-300">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-2xl mb-2 group-hover:scale-110 transition-transform">
              <Activity size={42} className="text-blue-400 drop-shadow-lg" />
            </div>
            <p className="text-xs text-gray-400 tracking-widest mb-1 font-bold uppercase">In Progress</p>
            <div className="text-5xl font-black text-white group-hover:text-blue-400 transition-colors">{tasks.filter(t => t.status === 'in-progress').length}</div>
          </div>
          
          <div className="glass-card flex flex-col items-center gap-2 text-center p-8 border-yellow-500/30 hover:border-yellow-500/70 transition-all group shadow-lg hover:shadow-yellow-400/30 hover:-translate-y-2 duration-300">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 p-4 rounded-2xl mb-2 group-hover:scale-110 transition-transform">
              <Clock size={42} className="text-yellow-400 drop-shadow-lg" />
            </div>
            <p className="text-xs text-gray-400 tracking-widest mb-1 font-bold uppercase">Pending</p>
            <div className="text-5xl font-black text-white group-hover:text-yellow-400 transition-colors">{tasks.filter(t => t.status === 'pending').length}</div>
          </div>
        </div>

        {/* Quick Actions with Enhanced Design */}
        <div className="flex items-center gap-3 mb-6">
          <Zap size={28} className="text-emerald-400" />
          <h2 className="text-3xl font-black text-white">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* My Tasks */}
          <a
            href="#mytasks"
            className="glass-card flex items-center gap-6 p-8 border-emerald-500/30 hover:border-emerald-500/70 transition-all group shadow-lg hover:shadow-emerald-400/30 cursor-pointer hover:-translate-y-1 duration-300"
          >
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-5 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
              <Briefcase size={40} className="text-emerald-400 drop-shadow-lg" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-2xl text-white group-hover:text-emerald-400 transition-colors mb-1">My Tasks</div>
              <div className="text-sm text-gray-400">View and manage all your assigned tasks</div>
            </div>
            <div className="text-emerald-400 font-semibold text-lg flex items-center gap-1 group-hover:gap-3 transition-all">
              →
            </div>
          </a>

          {/* Request Task */}
          <button
            onClick={() => setShowRequestTask(s => !s)}
            className="glass-card flex items-center gap-6 p-8 border-fuchsia-500/30 hover:border-fuchsia-500/70 transition-all group shadow-lg hover:shadow-fuchsia-400/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 hover:-translate-y-1 duration-300"
          >
            <div className="bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-600/20 p-5 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
              <UserPlus size={40} className="text-fuchsia-400 drop-shadow-lg" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-2xl text-white group-hover:text-fuchsia-400 transition-colors mb-1">Request Task</div>
              <div className="text-sm text-gray-400">Join a task using access code</div>
            </div>
            <div className="text-fuchsia-400 font-semibold text-lg flex items-center gap-1 group-hover:gap-3 transition-all">
              {showRequestTask ? '×' : '→'}
            </div>
          </button>
        </div>

        {showRequestTask && (
          <div className="mb-10 animate-fade-in">
            <RequestTaskAccess />
          </div>
        )}

        {/* My Tasks Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full"></div>
            <h2 className="text-3xl font-black text-white" id="mytasks">My Tasks</h2>
          </div>
          {tasks.length > 0 && (
            <span className="text-gray-400 text-sm font-semibold bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader size={48} className="animate-spin text-emerald-400 mb-4" />
            <p className="text-gray-400 text-sm">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-card p-16 text-center border border-emerald-400/20 rounded-3xl">
            <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={40} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No tasks yet!</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              You don't have any tasks assigned at the moment. Check back soon or request access to join a task.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr mb-12">
            {tasks.map((task, index) => (
              <div 
                key={task._id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;