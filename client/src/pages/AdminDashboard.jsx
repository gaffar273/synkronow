import { useState, useEffect } from 'react';
import ProjectForm from '../components/ProjectForm';
import ProjectCard from '../components/ProjectCard';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import UserList from '../components/UserList';
import TaskRequestsList from '../components/TaskRequestsList';
import API from '../utils/api';
import toast from 'react-hot-toast';
import {
  PlusCircle,
  ListTodo,
  Users,
  Bell,
  Loader,
  CheckCircle,
  Activity,
  BarChart3,
  FolderKanban,
  ArrowLeft,
  Copy,
} from 'lucide-react';

function GlassCard({ children, className = "" }) {
  return (
    <div className={`glass-card relative rounded-2xl px-6 py-6 border border-emerald-500/20 shadow-lg hover:shadow-emerald-500/30 transition-all ${className}`}>
      {children}
    </div>
  );
}

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalUsers: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    fetchProjects();
    fetchAllTasks();
    fetchStats();
    fetchPendingRequestsCount();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeProject) {
      fetchProjectDetails(activeProject._id);
    }
  }, [activeProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const { data } = await API.get('/tasks/all');
      setAllTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
  };

  const fetchProjectDetails = async (projectId) => {
    try {
      const { data } = await API.get(`/projects/${projectId}`);
      setActiveProject(data);
      setTasks(data.tasks || []);
    } catch (error) {
      toast.error('Failed to load project details');
    }
  };

  const fetchStats = async () => {
    try {
      const [projectsRes, tasksRes, usersRes] = await Promise.all([
        API.get('/projects'),
        API.get('/tasks/all'),
        API.get('/users/stats')
      ]);
      const allTasks = tasksRes.data;
      setStats({
        totalProjects: projectsRes.data.length,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === 'completed').length,
        inProgressTasks: allTasks.filter(t => t.status === 'in-progress').length,
        totalUsers: usersRes.data.totalUsers,
        pendingRequests: 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const fetchPendingRequestsCount = async () => {
    try {
      const { data } = await API.get('/tasks/requests');
      const pending = data.filter(r => r.status === 'pending').length;
      setPendingRequestsCount(pending);
    } catch (error) {
      console.error('Failed to load requests count:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, bgGradient }) => (
    <GlassCard className={`${bgGradient} hover:scale-105 cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold ${color} tracking-widest mb-1 uppercase flex items-center gap-1`}>
            <Icon size={16} /> {title}
          </p>
          <div className="text-4xl font-bold text-white mb-1">{value}</div>
          {change && <div className={`text-xs ${color} mt-1`}>{change}</div>}
        </div>
        <Icon size={48} className={`${color} opacity-20`} />
      </div>
    </GlassCard>
  );

  const TabButton = ({ id, label, icon: Icon, badge, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
        isActive
          ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border-2 border-transparent'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full min-w-[20px] flex items-center justify-center animate-pulse shadow-lg">
          {badge}
        </span>
      )}
    </button>
  );

  const copyProjectCode = () => {
    navigator.clipboard.writeText(activeProject.projectCode);
    toast.success('Project code copied!');
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 pb-24 md:pb-6 pt-25">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Manage projects, tasks, and team members</p>
          </div>
          {activeTab === 'projects' && !activeProject && (
            <button
              onClick={() => setShowProjectForm(!showProjectForm)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 cursor-pointer group"
            >
              <PlusCircle size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>{showProjectForm ? 'Hide Form' : 'Create Project'}</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-10 flex flex-wrap gap-3">
          <TabButton
            id="overview"
            label="Overview"
            icon={BarChart3}
            isActive={activeTab === 'overview'}
            onClick={() => {setActiveTab('overview'); setActiveProject(null);}}
          />
          <TabButton
            id="projects"
            label="Projects"
            icon={FolderKanban}
            badge={stats.totalProjects}
            isActive={activeTab === 'projects'}
            onClick={() => {setActiveTab('projects'); setActiveProject(null);}}
          />
          <TabButton
            id="tasks"
            label="Tasks"
            icon={ListTodo}
            badge={stats.totalTasks}
            isActive={activeTab === 'tasks'}
            onClick={() => {setActiveTab('tasks'); setActiveProject(null);}}
          />
          <TabButton
            id="requests"
            label="Requests"
            icon={Bell}
            badge={pendingRequestsCount}
            isActive={activeTab === 'requests'}
            onClick={() => {setActiveTab('requests'); setActiveProject(null);}}
          />
          <TabButton
            id="users"
            label="Users"
            icon={Users}
            badge={stats.totalUsers}
            isActive={activeTab === 'users'}
            onClick={() => {setActiveTab('users'); setActiveProject(null);}}
          />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={FolderKanban}
                color="text-purple-400"
                change="+2 this month"
                bgGradient="bg-gradient-to-br from-gray-800/90 to-purple-900/60"
              />
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={ListTodo}
                color="text-emerald-400"
                change="+12% this month"
                bgGradient="bg-gradient-to-br from-gray-800/90 to-emerald-900/60"
              />
              <StatCard
                title="Completed"
                value={stats.completedTasks}
                icon={CheckCircle}
                color="text-green-400"
                change="+8% this week"
                bgGradient="bg-gradient-to-br from-gray-800/90 to-green-900/60"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgressTasks}
                icon={Activity}
                color="text-blue-400"
                change="+3 today"
                bgGradient="bg-gradient-to-br from-gray-800/90 to-blue-900/60"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard className="p-8 group hover:bg-gradient-to-br from-emerald-600/30 to-green-800/50 hover:border-emerald-500/60 cursor-pointer">
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusCircle className="text-emerald-400" size={32} />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-white">Create Project</div>
                    <div className="text-sm text-gray-400">Start a new project</div>
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold shadow-lg transition-all hover:scale-105 hover:shadow-emerald-500/50 cursor-pointer"
                  onClick={() => {
                    setActiveTab('projects');
                    setShowProjectForm(true);
                  }}
                >
                  Get Started
                </button>
              </GlassCard>

              <GlassCard className="p-8 group hover:bg-gradient-to-br from-blue-700/30 to-blue-900/50 hover:border-blue-500/60 cursor-pointer">
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bell className="text-blue-400" size={32} />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-white">Pending Requests</div>
                    <div className="text-sm text-gray-400">{pendingRequestsCount} waiting</div>
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg transition-all hover:scale-105 hover:shadow-blue-500/50 cursor-pointer"
                  onClick={() => setActiveTab('requests')}
                >
                  Review Now
                </button>
              </GlassCard>

              <GlassCard className="p-8 group hover:bg-gradient-to-br from-purple-700/30 to-pink-900/50 hover:border-purple-500/60 cursor-pointer">
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="text-purple-400" size={32} />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-white">Manage Users</div>
                    <div className="text-sm text-gray-400">{stats.totalUsers} members</div>
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 hover:from-purple-500 hover:via-pink-500 hover:to-fuchsia-500 text-white font-bold shadow-lg transition-all hover:scale-105 hover:shadow-purple-500/50 cursor-pointer"
                  onClick={() => setActiveTab('users')}
                >
                  Manage Team
                </button>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && !activeProject && (
          <div className="animate-fade-in">
            {showProjectForm && (
              <div className="mb-8">
                <ProjectForm
                  onProjectCreated={(project) => {
                    fetchProjects();
                    fetchStats();
                    setShowProjectForm(false);
                  }}
                  onClose={() => setShowProjectForm(false)}
                />
              </div>
            )}

            <div className="mb-6 flex items-center gap-3">
              <FolderKanban size={32} className="text-emerald-400" />
              <h2 className="text-3xl font-bold text-white">
                All Projects ({projects.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="animate-spin text-emerald-400" size={56} />
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onView={(proj) => setActiveProject(proj)}
                    onDelete={(id) => {
                      setProjects(projects.filter(p => p._id !== id));
                      fetchStats();
                    }}
                  />
                ))}
              </div>
            ) : (
              <GlassCard className="p-16 text-center">
                <FolderKanban size={80} className="mx-auto mb-6 text-gray-600" />
                <h3 className="text-2xl font-bold text-gray-300 mb-3">
                  No Projects Created Yet
                </h3>
                <p className="text-gray-500 mb-8 text-lg">
                  Create your first project to get started
                </p>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 transition-all cursor-pointer"
                >
                  <PlusCircle size={24} />
                  Create First Project
                </button>
              </GlassCard>
            )}
          </div>
        )}

        {/* Project Detail View */}
        {activeTab === 'projects' && activeProject && (
          <div className="animate-fade-in">
            {/* Back Button */}
            <button
              onClick={() => setActiveProject(null)}
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Projects</span>
            </button>

            {/* Project Header */}
            <div className="glass-card rounded-2xl p-8 mb-8 border-2 border-emerald-500/30">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{activeProject.name}</h2>
                  <p className="text-gray-400">{activeProject.description}</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
                  <span className="font-mono font-bold text-emerald-400">{activeProject.projectCode}</span>
                  <button onClick={copyProjectCode} className="text-emerald-400 hover:text-emerald-300">
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {activeProject.deadline && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span>Deadline: {new Date(activeProject.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Add Task Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                <PlusCircle size={20} />
                <span>{showTaskForm ? 'Hide Form' : 'Add Task'}</span>
              </button>
            </div>

            {showTaskForm && (
              <TaskForm
                projectId={activeProject._id}
                onTaskCreated={(task) => {
                  fetchProjectDetails(activeProject._id);
                  fetchStats();
                  setShowTaskForm(false);
                }}
                onClose={() => setShowTaskForm(false)}
              />
            )}

            {/* Tasks Grid */}
            <div className="mb-6 flex items-center gap-3">
              <ListTodo size={28} className="text-blue-400" />
              <h3 className="text-2xl font-bold text-white">
                Tasks ({tasks.length})
              </h3>
            </div>

            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <ListTodo size={64} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Tasks Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first task in this project
                </p>
              </GlassCard>
            )}
          </div>
        )}

        {/* ALL TASKS Tab */}
        {activeTab === 'tasks' && (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center gap-3">
              <ListTodo size={32} className="text-blue-400" />
              <h2 className="text-3xl font-bold text-white">
                All Tasks ({allTasks.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="animate-spin text-blue-400" size={56} />
              </div>
            ) : allTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            ) : (
              <GlassCard className="p-16 text-center">
                <ListTodo size={80} className="mx-auto mb-6 text-gray-600" />
                <h3 className="text-2xl font-bold text-gray-300 mb-3">
                  No Tasks Created Yet
                </h3>
                <p className="text-gray-500 mb-8 text-lg">
                  Create tasks within projects to see them here
                </p>
              </GlassCard>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="animate-fade-in">
            <TaskRequestsList />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <UserList />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
