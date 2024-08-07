const auth = require("../controller/auth.controller")
const router = require("express").Router()

router.post("/register", auth.registerUser)
router.post("/login", auth.loginUser)
router.post("/admin", auth.registerAdmin)

module.exports = router 