import { Calendar, GitBranch, Clock, Code, AlertCircle, Copy, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const TaskCard = ({ task }) => {
  const statusConfig = {
    'pending': {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      dot: 'bg-yellow-500'
    },
    'in-progress': {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      dot: 'bg-blue-500'
    },
    'completed': {
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      text: 'text-green-400',
      dot: 'bg-green-500'
    }
  };

  const priorityConfig = {
    'low': { 
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
      icon: '🔵'
    },
    'medium': { 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      icon: '🟡'
    },
    'high': { 
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      icon: '🟠'
    },
    'urgent': { 
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      icon: '🔴'
    }
  };

  const status = statusConfig[task.status] || statusConfig['pending'];
  const priority = priorityConfig[task.priority || 'medium'];

  const copyTaskCode = () => {
    navigator.clipboard.writeText(task.taskCode);
    toast.success('Task code copied!');
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="group relative">
      {/* Card Container */}
      <div className="glass-card rounded-2xl p-6 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 h-full flex flex-col">
        
        {/* Overdue Badge */}
        {isOverdue && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            OVERDUE
          </div>
        )}

        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {task.title}
              </h3>
            </div>
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.bg} ${status.border} ${status.text} text-xs font-semibold whitespace-nowrap`}>
              <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`}></span>
              {task.status}
            </div>
          </div>

          {/* Task Code */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
              <Code size={16} className="text-emerald-400" />
              <span className="font-mono font-bold text-emerald-400 text-sm">{task.taskCode}</span>
              <button 
                onClick={copyTaskCode}
                className="hover:text-emerald-300 transition-colors text-emerald-400"
                title="Copy task code"
              >
                <Copy size={14} />
              </button>
            </div>
            
            {/* Priority Badge */}
            <div className={`flex items-center gap-1.5 ${priority.bg} px-3 py-1.5 rounded-lg text-xs font-semibold ${priority.color}`}>
              <span>{priority.icon}</span>
              <span className="capitalize">{task.priority || 'medium'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
          {task.description}
        </p>

        {/* Info Grid */}
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-800">
          {/* Due Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={16} className="text-emerald-400" />
              <span>Due Date</span>
            </div>
            <span className={`font-semibold ${isOverdue ? 'text-red-400' : 'text-white'}`}>
              {new Date(task.dueDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>

          {/* Assigned By */}
          {task.assignedBy && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <User size={16} className="text-emerald-400" />
                <span>Assigned By</span>
              </div>
              <span className="font-semibold text-white truncate ml-2">
                {task.assignedBy.name}
              </span>
            </div>
          )}

          {/* GitHub Link */}
          {task.githubRepoLink && (
            <div className="flex items-center gap-2 text-sm">
              <GitBranch size={16} className="text-purple-400" />
              <a 
                href={task.githubRepoLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-purple-400 hover:text-purple-300 hover:underline truncate transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View Repository
              </a>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={16} className="text-emerald-400" />
              <span>Created</span>
            </div>
            <span className="font-semibold text-gray-300">
              {new Date(task.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={`/task/${task._id}`}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105 group"
        >
          <span>View Details</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default TaskCard;
