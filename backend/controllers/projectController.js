import Project from '../models/Project.js';
import Task from '../models/Task.js';

// Generate unique project code
const generateProjectCode = async () => {
  const prefix = 'PROJ';
  let isUnique = false;
  let projectCode;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    projectCode = `${prefix}-${randomNum}`;
    
    const existing = await Project.findOne({ projectCode });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }
  
  if (!isUnique) {
    projectCode = `${prefix}-${Date.now().toString().slice(-6)}`;
  }
  
  return projectCode;
};

// Create project - Only for current admin
export const createProject = async (req, res) => {
  try {
    const { name, description, deadline } = req.body;

    const projectCode = await generateProjectCode();

    const project = await Project.create({
      name,
      description,
      projectCode,
      deadline,
      createdBy: req.user._id  // Set current admin as creator
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all projects - Only projects created by current admin
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })  // Filter by creator
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get project by ID - Only if created by current admin
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id  // Ensure ownership
    }).populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    const tasks = await Task.find({ projectId: project._id })
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({ ...project.toObject(), tasks });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update project - Only if created by current admin
export const updateProject = async (req, res) => {
  try {
    const { name, description, status, deadline } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id  // Ensure ownership
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;
    if (deadline) project.deadline = deadline;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email');

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete project - Only if created by current admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id  // Ensure ownership
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Delete all tasks in this project
    await Task.deleteMany({ projectId: project._id });

    await project.deleteOne();

    res.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: error.message });
  }
};
