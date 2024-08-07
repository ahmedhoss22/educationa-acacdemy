const router= require("express").Router()
const auth = require("../services/auth.service")
const examCtl = require("../controller/exam.controller")


router.route("/")
    .post(auth.verifyAdminOrInstructorRole,examCtl.createExam)
    .get(auth.authenticate,examCtl.getAmdinExams)
    
router.route("/:id")
    .patch(auth.verifyAdminOrInstructorRole,examCtl.updateExam)
    .put(auth.verifyAdminOrInstructorRole,examCtl.deleteExam)

router.get("/all",examCtl.getAllExams)
module.exports = router