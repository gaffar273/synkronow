import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, MessageCircle, Loader } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ChatBox = ({ taskId }) => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('comment');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchChats();
  }, [taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/chats/${taskId}`);
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const { data } = await API.post('/chats', {
        taskId,
        message,
        messageType
      });
      setChats([...chats, data]);
      setMessage('');
      toast.success('Message sent!');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle size={14} className="text-red-400" />;
      case 'update':
        return <MessageCircle size={14} className="text-blue-400" />;
      default:
        return <MessageCircle size={14} className="text-gray-400" />;
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'error':
        return 'border-red-500/30 bg-red-500/5';
      case 'update':
        return 'border-blue-500/30 bg-blue-500/5';
      default:
        return 'border-gray-700/30 bg-gray-800/20';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/30">
      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <MessageCircle className="text-emerald-400" size={28} />
        Discussion
      </h3>
      
      <div className="border border-gray-700 rounded-xl bg-gray-900/50 h-[500px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="animate-spin text-emerald-400" size={32} />
            </div>
          ) : chats.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No messages yet. Start the discussion!</p>
            </div>
          ) : (
            <>
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`flex ${chat.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl border ${
                      chat.sender._id === user._id
                        ? 'bg-gradient-to-br from-emerald-600 to-green-700 text-white border-emerald-500/50'
                        : `${getMessageTypeColor(chat.messageType)} text-gray-200 border`
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {getMessageIcon(chat.messageType)}
                      <span className="text-xs font-semibold opacity-90">{chat.sender.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        chat.messageType === 'error' ? 'bg-red-500/30' :
                        chat.messageType === 'update' ? 'bg-blue-500/30' :
                        'bg-gray-700/30'
                      }`}>
                        {chat.messageType}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{chat.message}</p>
                    <span className="text-xs opacity-75 mt-2 block">
                      {new Date(chat.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4 bg-gray-800/30">
          <div className="flex gap-2 mb-3">
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="comment">💬 Comment</option>
              <option value="error">❌ Error</option>
              <option value="update">📢 Update</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
