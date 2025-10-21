import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Activity,
  FolderKanban,
  ListTodo
} from 'lucide-react';
import API from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (user.role === 'admin') {
        // Admin sees PROJECTS and ALL tasks
        const [projectsRes, tasksRes] = await Promise.all([
          API.get('/projects'),
          API.get('/tasks/all')
        ]);
        
        const tasks = tasksRes.data;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        
        setStats({
          totalProjects: projectsRes.data.length,
          totalTasks: tasks.length,
          completedTasks: completed,
          pendingTasks: pending,
          inProgressTasks: inProgress
        });
      } else {
        // Regular user sees only THEIR tasks
        const { data } = await API.get('/tasks/my-tasks');
        const completed = data.filter(t => t.status === 'completed').length;
        const pending = data.filter(t => t.status === 'pending').length;
        const inProgress = data.filter(t => t.status === 'in-progress').length;
        
        setStats({
          totalProjects: 0,
          totalTasks: data.length,
          completedTasks: completed,
          pendingTasks: pending,
          inProgressTasks: inProgress
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const statCards = user.role === 'admin' 
    ? [
        { title: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', shadow: 'hover:shadow-purple-400/20' },
        { title: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', shadow: 'hover:shadow-emerald-400/20' },
        { title: 'Completed', value: stats.completedTasks, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', shadow: 'hover:shadow-green-400/20' },
        { title: 'In Progress', value: stats.inProgressTasks, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', shadow: 'hover:shadow-blue-400/20' },
      ]
    : [
        { title: 'Total Tasks', value: stats.totalTasks, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', shadow: 'hover:shadow-emerald-400/20' },
        { title: 'Completed', value: stats.completedTasks, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', shadow: 'hover:shadow-green-400/20' },
        { title: 'In Progress', value: stats.inProgressTasks, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', shadow: 'hover:shadow-blue-400/20' },
        { title: 'Pending', value: stats.pendingTasks, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', shadow: 'hover:shadow-yellow-400/20' },
      ];

  return (
    <div className="min-h-screen bg-gray-900 py-8 pt-25">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="glass-card rounded-2xl px-8 py-10 mb-10 border border-emerald-500/20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-emerald-400">
            Welcome back, <span className="text-green-400">{user.name.toUpperCase()}!</span> 👋
          </h1>
          <p className="text-lg text-gray-300 mt-2 mb-0">
            {user.role === 'admin' ? 'Manage your team and track progress' : 'Track your tasks and collaborate with your team'}
          </p>
        </div>

        {/* Stats Grid - Clickable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {statCards.map((stat, index) => (
            <Link
              key={stat.title}
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className={`glass-card flex flex-col items-center gap-2 text-center p-8 border ${stat.border} hover:border-opacity-60 transition-all group shadow-lg ${stat.shadow} cursor-pointer`}
            >
              <div className={`${stat.bg} p-4 rounded-full mb-1`}>
                <stat.icon className={`${stat.color} group-hover:scale-110 transition-transform drop-shadow`} size={42} />
              </div>
              <p className="text-sm text-gray-300 tracking-widest mb-1 font-semibold uppercase">{stat.title}</p>
              <div className="text-4xl font-extrabold text-white">{stat.value}</div>
            </Link>
          ))}
        </div>

        {/* Go Deeper Section */}
        <div className="glass-card rounded-2xl p-10 border border-emerald-500/30 text-center mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Ready to <span className="text-emerald-400">Dive Deeper?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Explore your complete dashboard to manage {user.role === 'admin' ? 'projects, tasks' : 'tasks'}, collaborate with your team, and track all your progress in one place.
            </p>
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-400/30"
            >
              <Activity size={20} />
              Go to Full Dashboard
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-8 border border-emerald-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Activity className="text-emerald-400 mr-3" size={28} />
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Welcome to the Employee Management Portal</span>
              </div>
              <span className="text-gray-500 text-sm">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
