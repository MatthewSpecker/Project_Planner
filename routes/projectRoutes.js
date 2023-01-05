const express = require('express');
const router = express.Router();
const projects = require('../controllers/projectCtrl');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, validateProject } = require ('../middleware');
const multer = require('multer');
const upload = multer();

const Project = require('../models/projectModel');

router.route('/')
    .get(catchAsync(projects.index))
    .post(isLoggedIn, upload.none(), validateProject, catchAsync(projects.createProject))

router.route('/new')
    .get(isLoggedIn, projects.renderNewForm)
    

router.route('/:idProject')
    .get(catchAsync(projects.showProject))
    .put(isLoggedIn, isAdmin, upload.none(), validateProject, catchAsync(projects.updateProject))
    .delete(isLoggedIn, isAdmin, catchAsync(projects.deleteProject))

router.get('/:idProject/edit', isLoggedIn, isAdmin, catchAsync(projects.renderEditForm))

module.exports = router;