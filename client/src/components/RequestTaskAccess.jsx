import { useState } from 'react';
import { Search, Key, Sparkles, Send } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const RequestTaskAccess = ({ onRequestSent }) => {
  const [taskCode, setTaskCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await API.post('/tasks/request', {  // ✅ CHANGED FROM /tasks/request-access
        taskCode: taskCode.trim().toUpperCase(), 
        message 
      });
      toast.success('✅ Access request sent successfully!');
      setTaskCode('');
      setMessage('');
      if (onRequestSent) onRequestSent();
    } catch (error) {
      console.error('Request error:', error);
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
      
      <div className="relative glass-card rounded-2xl p-8 border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <Key className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              Request Task Access
              <Sparkles size={20} className="text-emerald-400 animate-pulse" />
            </h3>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 ml-15">
          Enter a task code to request access. The admin will review your request.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Code Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <span className="text-emerald-400">●</span>
              Task Code
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={taskCode}
                onChange={(e) => setTaskCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 pl-12 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white uppercase font-mono text-lg font-bold placeholder-gray-600 transition-all"
                placeholder="E.G., TASK-1234"
                maxLength={20}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="text-gray-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Enter the unique task identifier</p>
          </div>
          
          {/* Message Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <span className="text-emerald-400">●</span>
              Message <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white placeholder-gray-600 transition-all resize-none"
              placeholder="Why do you want to work on this task?"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">Explain your interest in this task</p>
              <p className="text-xs text-gray-500">{message.length}/500 characters</p>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sending Request...</span>
              </>
            ) : (
              <>
                <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                <span>Request Access</span>
              </>
            )}
          </button>
        </form>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-green-500/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default RequestTaskAccess;
