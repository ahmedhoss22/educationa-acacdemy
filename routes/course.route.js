const express = require('express');
const router = express.Router();

const { createCourse, showCourses, showCourse, updateCourse, deleteCourse, enroll } = require('../controller/course.control');
const upload = require('../services/upload')
const auth = require("../services/auth.service")

router.post('/create',  auth.verifyAdminOrInstructorRole, upload.single('file'), createCourse);
router.get('/', auth.authenticate, showCourses);
router.route("/:id")
    .get(auth.authenticate, showCourse)
    .put(upload.single('image'), auth.verifyAdminOrInstructorRole, updateCourse)
    .patch(auth.authenticate, enroll)
    .delete(auth.verifyAdminOrInstructorRole, deleteCourse)

module.exports = router;