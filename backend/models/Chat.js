import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['comment', 'error', 'update'],
    default: 'comment'
  }
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
