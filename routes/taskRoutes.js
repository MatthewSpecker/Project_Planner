const express = require('express');
const router = express.Router();
const tasks = require('../controllers/taskCtrl');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateTask } = require ('../middleware');
const multer = require('multer');
const upload = multer();

const Task = require('../models/taskModel');

router.route('/:idProject/tasks')
    .get(catchAsync(tasks.index))
    .post(isLoggedIn, upload.none(), validateTask, catchAsync(tasks.createTask))

router.route('/:idProject/tasks/new')
    .get(isLoggedIn, tasks.renderNewForm)
    

router.route('/:idProject/tasks/:idTask')
    .get(catchAsync(tasks.showTask))
    .put(isLoggedIn, isAuthor, upload.none(), validateTask, catchAsync(tasks.updateTask))
    .delete(isLoggedIn, isAuthor, catchAsync(tasks.deleteTask))

router.get('/:idProject/tasks/:idTask/edit', isLoggedIn, isAuthor, catchAsync(tasks.renderEditForm))

module.exports = router;