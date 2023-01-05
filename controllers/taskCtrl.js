const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

module.exports.renderNewForm = async (req, res) => {
    const { idProject } = req.params;
    const project = await Project.findById(idProject);
    res.render('tasks/new', { project });
}

module.exports.createTask = async (req, res, next) => {
    const { idProject } = req.params;
    const task = new Task(req.body.task);
    task.author = req.user._id;
    const project = await Project.findById(idProject);
    project.tasks.push(task);
    await project.save();
    await task.save();

    req.flash('success', 'Successfully made a new task!');
    res.redirect(`/projects/${idProject}/tasks/${task._id}`);
}

module.exports.showTask = async (req, res) => {
    const { idProject, idTask } = req.params;
    const task = await Task.findById(idTask).populate('author');
    const project = await Project.findById(idProject);
    if (!task) {
        req.flash('error', 'Cannot find the task!');
        return res.redirect(`/projects/${idProject}/tasks`);
    }
    res.render('tasks/show', { project, task });
}

module.exports.renderEditForm = async (req, res) => {
    const { idProject, idTask } = req.params;
    const project = await Project.findById(idProject);
    const task = await Task.findById(idTask);
    if (!task) {
        req.flash('error', 'Cannot find that task!');
        return res.redirect(`/projects/${idProject}/tasks`);
    }

    res.render('tasks/edit', { project, task });
}

module.exports.updateTask = async (req, res) => {
    const { idProject, idTask } = req.params;
    const task = await Task.findByIdAndUpdate(idTask, { ...req.body.task });
    await task.save();
    const project = await Project.findByIdAndUpdate(idProject, {} );
    await project.save();
    req.flash('success', 'Successfully updated task!');
    res.redirect(`/projects/${idProject}/tasks/${task._id}`)
}

module.exports.deleteTask = async (req, res) => {
    const { idProject, idTask } = req.params;
    await Task.findByIdAndDelete(idTask);
    req.flash('success', 'Successfully deleted task')
    res.redirect(`/projects/${idProject}`);
}