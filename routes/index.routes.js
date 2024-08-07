const router = require("express").Router()

router.use("/user", require('./user.route'))
router.use("/auth", require('./auth.route'))
router.use("/password", require('./password.route'))
router.use("/course", require('./course.route'))
router.use("/lesson", require('./lesson.route'))
router.use("/news", require('./news.route'))
router.use("/contact", require('./contact.route'))
router.use('/exam', require('./exam.route'))
router.use('/job', require('./job.route'))
router.use("/subscribe",require("./subscription.route"))
router.use("/certificate",require("./certificate.route"))
router.use("/cv",require("./cv.route"))

module.exports = router