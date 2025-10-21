import { Calendar, Code, User, Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';

const ProjectCard = ({ project, onView, onDelete }) => {
  const copyProjectCode = () => {
    navigator.clipboard.writeText(project.projectCode);
    toast.success('Project code copied!');
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete project "${project.name}" and all its tasks?`)) return;
    
    try {
      await API.delete(`/projects/${project._id}`);
      toast.success('Project deleted successfully');
      if (onDelete) onDelete(project._id);
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors flex-1">
          {project.name}
        </h3>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
          title="Delete Project"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {project.description || 'No description'}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Code size={16} className="text-emerald-400" />
          <span className="font-mono font-bold text-emerald-400">{project.projectCode}</span>
          <button
            onClick={copyProjectCode}
            className="ml-auto text-gray-400 hover:text-emerald-400 transition-colors"
            title="Copy code"
          >
            <Copy size={14} />
          </button>
        </div>

        {project.deadline && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={16} className="text-blue-400" />
            <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <User size={16} className="text-purple-400" />
          <span>{project.teamMembers?.length || 0} team members</span>
        </div>
      </div>

      <button
        onClick={() => onView(project)}
        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
      >
        View Details
      </button>
    </div>
  );
};

export default ProjectCard;
