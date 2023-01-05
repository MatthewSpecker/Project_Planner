const Project = require('../models/projectModel');

module.exports.index = async (req, res) => {
    const projects = await Project.find({});
    res.render('projects/index', { projects })
}

module.exports.renderNewForm = (req, res) => {
    res.render('projects/new');
}

module.exports.createProject = async (req, res, next) => {
    const project = new Project(req.body.project);
    project.users = [req.user._id];
    project.adminUsers = [req.user._id];
    project.category = [
        'Questions',
        'To Do',
        'Pending',
        'Blocked',
        'Done'
    ];
    await project.save();
    req.flash('success', 'Successfully made a new project!');
    res.redirect(`/projects/${project._id}`);
}

module.exports.showProject = async (req, res) => {
    const project = await Project.findById(req.params.idProject).
        populate('users').
        populate('adminUsers').
        populate({
            path: 'tasks',
            populate: { path: 'author' }
        });
    if (!project) {
        req.flash('error', 'Cannot find the project!');
        return res.redirect('/projects');
    }
    res.render('projects/show', { project });
}

module.exports.renderEditForm = async (req, res) => {
    const { idProject } = req.params;
    const project = await Project.findById(idProject);
    if (!project) {
        req.flash('error', 'Cannot find that project!');
        return res.redirect('/projects');
    }

    res.render('projects/edit', { project });
}

module.exports.updateProject = async (req, res) => {
    const { idProject } = req.params;
    const project = await Project.findByIdAndUpdate(idProject, { ...req.body.project });
    await project.save();
    req.flash('success', 'Successfully updated project!');
    res.redirect(`/projects/${project._id}`)
}

module.exports.deleteProject = async (req, res) => {
    const { idProject } = req.params;
    await Project.findByIdAndDelete(idProject);
    req.flash('success', 'Successfully deleted project')
    res.redirect('/projects');
}