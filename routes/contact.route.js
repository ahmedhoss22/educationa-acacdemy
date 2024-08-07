const router = require("express").Router()
const contactUs= require('../controller/contact.controller')

router.post("/", contactUs.contactUsCtrl);

module.exports = router
