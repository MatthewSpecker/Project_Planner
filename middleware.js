const { taskSchema, projectSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Task = require('./models/taskModel');
const Project = require('./models/projectModel');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login')
    }

    next();
}

module.exports.validateProject = (req, res, next) => {
    const { error } = projectSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAdmin = async (req, res, next) => {
    const { idProject } = req.params;
    const project = await Project.findById(idProject);
    let permission = false;
    for (admin of project.adminUsers) {
        if (admin._id.equals(req.user._id)) {
            permission = true;
        }
    }
    if (!permission) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/projects/${idProject}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { idTask } = req.params;
    const task = await Task.findById(idTask);
    if (!task.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/tasks/${idTask}`);
    }
    next();
}