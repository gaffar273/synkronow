import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader, User, Code, Mail, MessageSquare } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const TaskRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/tasks/requests');
      setRequests(data);
      console.log('Fetched requests:', data); // Debug log
    } catch (error) {
      console.error('Failed to load requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await API.put(`/tasks/requests/${requestId}`, { status }); // ✅ CHANGED FROM PATCH TO PUT
      toast.success(`Request ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      fetchRequests();
    } catch (error) {
      console.error('Failed to respond:', error);
      toast.error('Failed to respond to request');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    approved: 'bg-green-500/20 text-green-400 border-green-500/50',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-emerald-400" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Task Access Requests ({requests.length})</h2>
        
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 bg-gray-900 px-2 py-0.5 rounded-full text-xs">
                  {requests.filter(r => r.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {filteredRequests.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-emerald-500/30">
          <Clock size={64} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No {filter !== 'all' ? filter : ''} Requests
          </h3>
          <p className="text-gray-500">
            {filter === 'pending' 
              ? 'No pending requests at the moment'
              : 'Task access requests will appear here when users request to join tasks'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <div 
              key={request._id} 
              className="glass-card rounded-xl p-6 border border-emerald-500/30 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {request.requestedBy?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-white">
                          {request.requestedBy?.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Mail size={14} />
                        {request.requestedBy?.email}
                      </div>
                    </div>
                  </div>
                  
                  {/* Task Info */}
                  {request.taskId ? (
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm mb-2">
                        <Code size={16} />
                        <span className="font-bold">{request.taskCode}</span>
                      </div>
                      <h4 className="text-white font-semibold mb-1">{request.taskId.title}</h4>
                      <p className="text-gray-400 text-sm line-clamp-2">{request.taskId.description}</p>
                    </div>
                  ) : (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-3">
                      <div className="flex items-center gap-2 text-red-400 font-mono text-sm">
                        <Code size={16} />
                        <span className="font-bold">{request.taskCode}</span>
                        <span className="text-xs">(Task may have been deleted)</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Message from user */}
                  {request.message && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={16} className="text-blue-400 mt-1" />
                        <div>
                          <p className="text-blue-400 text-xs font-semibold mb-1">User's Message:</p>
                          <p className="text-gray-300 text-sm italic">"{request.message}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Timestamps */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      Requested: {new Date(request.createdAt).toLocaleString()}
                    </div>
                    
                    {request.respondedAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle size={12} />
                        Responded: {new Date(request.respondedAt).toLocaleString()}
                        {request.respondedBy && ` by ${request.respondedBy.name}`}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                {request.status === 'pending' && request.taskId && (
                  <div className="flex gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => handleRespond(request._id, 'approved')}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-lg transition-all border border-green-500/50 font-medium"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRespond(request._id, 'rejected')}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition-all border border-red-500/50 font-medium"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                )}
                
                {request.status === 'approved' && (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <CheckCircle size={18} />
                    Access Granted
                  </div>
                )}
                
                {request.status === 'rejected' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                    <XCircle size={18} />
                    Access Denied
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskRequestsList;
