import Task from '../models/Task.js';
import Project from '../models/Project.js';
import TaskRequest from '../models/TaskRequest.js';
import User from '../models/User.js';

// Generate unique task code
const generateTaskCode = async () => {
  const prefix = 'TASK';
  let isUnique = false;
  let taskCode;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    taskCode = `${prefix}-${randomNum}`;
    
    const existing = await Task.findOne({ taskCode });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }
  
  if (!isUnique) {
    taskCode = `${prefix}-${Date.now().toString().slice(-6)}`;
  }
  
  return taskCode;
};

// Create task - Only in projects owned by current admin
export const createTask = async (req, res) => {
  try {
    const { projectId, title, description, dueDate, priority, assignToEmails } = req.body;

    // Verify project exists AND is owned by current admin
    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Generate unique task code
    const taskCode = await generateTaskCode();

    const taskData = {
      projectId,
      title,
      description,
      taskCode,
      assignedBy: req.user._id,
      dueDate,
      priority: priority || 'medium'
    };

    // Add email assignments if provided
    if (assignToEmails && assignToEmails.length > 0) {
      taskData.assignedByEmail = assignToEmails.map(email => ({ email }));
    }

    const task = await Task.create(taskData);

    // If emails provided, assign to those users
    if (assignToEmails && assignToEmails.length > 0) {
      const users = await User.find({ email: { $in: assignToEmails } });
      if (users.length > 0) {
        task.assignedTo = users.map(u => u._id);
        await task.save();
      }
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name projectCode');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks - Only tasks from projects created by current admin
export const getAllTasks = async (req, res) => {
  try {
    // Get all projects created by this admin
    const adminProjects = await Project.find({ createdBy: req.user._id });
    const projectIds = adminProjects.map(p => p._id);

    // Get tasks only from those projects
    const tasks = await Task.find({ projectId: { $in: projectIds } })
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name projectCode')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get tasks by project - Only if admin owns the project
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    const tasks = await Task.find({ projectId })
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks by project error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's tasks
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name projectCode')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get task by ID - Only if from admin's project
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name projectCode');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If user is admin, verify they own the project
    if (req.user.role === 'admin') {
      const project = await Project.findOne({
        _id: task.projectId._id,
        createdBy: req.user._id
      });

      if (!project) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get task by code
export const getTaskByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const upperCode = code.toUpperCase().trim();

    const task = await Task.findOne({ taskCode: upperCode })
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name projectCode');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task by code error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update task - Only if from admin's project or user is assigned
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, githubRepoLink, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id).populate('projectId');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If user is admin, verify they own the project
    if (req.user.role === 'admin') {
      const project = await Project.findOne({
        _id: task.projectId._id,
        createdBy: req.user._id
      });

      if (!project) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      // If user, verify they are assigned to task
      if (!task.assignedTo.includes(req.user._id)) {
        return res.status(403).json({ message: 'You are not assigned to this task' });
      }
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (githubRepoLink !== undefined) task.githubRepoLink = githubRepoLink;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    // If task is completed, set completedAt
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name projectCode');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete task - Only if admin owns the project
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify admin owns the project
    const project = await Project.findOne({
      _id: task.projectId._id,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.deleteOne();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Request task access - User requests to join a task by code
export const requestTaskAccess = async (req, res) => {
  try {
    const { taskCode, message } = req.body;

    if (!taskCode) {
      return res.status(400).json({ message: 'Task code is required' });
    }

    // Find task by code
    const task = await Task.findOne({ taskCode: taskCode.toUpperCase().trim() });

    if (!task) {
      return res.status(404).json({ message: 'Task not found with this code' });
    }

    // Check if user already assigned
    if (task.assignedTo.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already assigned to this task' });
    }

    // Check if request already exists
    const existingRequest = await TaskRequest.findOne({
      taskId: task._id,
      requestedBy: req.user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this task' });
    }

    // Create request
    const taskRequest = await TaskRequest.create({
      taskCode: task.taskCode,
      taskId: task._id,
      requestedBy: req.user._id,
      message: message || ''
    });

    const populatedRequest = await TaskRequest.findById(taskRequest._id)
      .populate('requestedBy', 'name email accessCode')
      .populate('taskId', 'title taskCode');

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Request task access error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all task requests - Only for tasks from admin's projects
export const getAllTaskRequests = async (req, res) => {
  try {
    // Get all projects created by this admin
    const adminProjects = await Project.find({ createdBy: req.user._id });
    const projectIds = adminProjects.map(p => p._id);

    // Get tasks only from those projects
    const adminTasks = await Task.find({ projectId: { $in: projectIds } });
    const taskIds = adminTasks.map(t => t._id);

    // Get requests only for those tasks
    const requests = await TaskRequest.find({ taskId: { $in: taskIds } })
      .populate('requestedBy', 'name email accessCode')
      .populate('taskId', 'title taskCode')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get task requests error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Respond to task request - Only if admin owns the project
// Respond to task request - FIXED with null checks
export const respondToTaskRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const taskRequest = await TaskRequest.findById(requestId)
      .populate('taskId')
      .populate('requestedBy');

    if (!taskRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (taskRequest.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }

    // Check if taskId exists
    if (!taskRequest.taskId) {
      return res.status(404).json({ message: 'Associated task not found' });
    }

    // Get full task details
    const task = await Task.findById(taskRequest.taskId._id).populate('projectId');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if project exists
    if (!task.projectId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify admin owns the project
    const project = await Project.findOne({
      _id: task.projectId._id,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied. You do not own this project.' });
    }

    taskRequest.status = status;
    taskRequest.respondedAt = new Date();
    taskRequest.respondedBy = req.user._id;

    // If approved, add user to task
    if (status === 'approved' && taskRequest.requestedBy) {
      if (!task.assignedTo.includes(taskRequest.requestedBy._id)) {
        task.assignedTo.push(taskRequest.requestedBy._id);
        await task.save();
      }
    }

    await taskRequest.save();

    const updatedRequest = await TaskRequest.findById(requestId)
      .populate('requestedBy', 'name email accessCode')
      .populate('taskId', 'title taskCode')
      .populate('respondedBy', 'name email');

    res.json(updatedRequest);
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    // Get admin's projects
    const projects = await Project.find({ createdBy: req.user._id });
    const projectIds = projects.map(p => p._id);

    // Get tasks from admin's projects
    const tasks = await Task.find({ projectId: { $in: projectIds } });
    const taskIds = tasks.map(t => t._id);

    // Get requests for admin's tasks
    const requests = await TaskRequest.find({ taskId: { $in: taskIds } });

    const stats = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      pendingRequests: requests.filter(r => r.status === 'pending').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
};
