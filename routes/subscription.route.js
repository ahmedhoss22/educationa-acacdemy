const subscription= require("../controller/subscription.control")
const express = require("express")
const router = express.Router()

router.post("/",subscription.addSubscriber)

module.exports = router