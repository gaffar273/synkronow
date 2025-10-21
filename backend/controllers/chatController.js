import Chat from '../models/Chat.js';

export const getTaskChats = async (req, res) => {
  try {
    const chats = await Chat.find({ taskId: req.params.taskId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const { taskId, message, messageType } = req.body;

    const chat = await Chat.create({
      taskId,
      sender: req.user._id,
      message,
      messageType: messageType || 'comment'
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate('sender', 'name email');

    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
