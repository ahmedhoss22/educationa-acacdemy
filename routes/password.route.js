const router = require('express').Router()

const pass = require('../controller/password.controller')
router.post("/forgot-password", pass.forgotPassword)
router.post("/:token/reset-password", pass.resetPassword)

module.exports = router