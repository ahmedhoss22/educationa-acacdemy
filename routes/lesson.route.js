const { createLesson, showlessons, showlesson, updateLesson, deleteLesson } = require('../controller/lesson.controller')
const express = require('express');
const router = express.Router()
const auth = require("../services/auth.service")
//create lesson
//get all lessons
router.route('/').post(auth.verifyAdminOrInstructorRole, createLesson).get(showlessons)

//get single lesson
//update lesson 
//delete lesson 
router.route("/:id")
    .get(auth.verifyAdminOrInstructorRole, showlesson)
    .patch(auth.verifyAdminOrInstructorRole, updateLesson)
    .delete(auth.verifyAdminOrInstructorRole, deleteLesson)


module.exports = router