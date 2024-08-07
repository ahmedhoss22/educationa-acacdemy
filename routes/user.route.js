const userCtrl = require("../controller/user.controller")
const auth = require("../services/auth.service")
const photoUpload = require("../services/uploadImage.service")
const validateObjectId = require("../services/validateObjectId.service")
const router = require("express").Router()

router.get("/data", auth.authenticate, userCtrl.getUserData)
router.get("/allUsers", auth.verifyAdminToken, userCtrl.getAllUserData)

router.get("/instructor", userCtrl.getInstructorsData)
router.post("/:token/verify-email", userCtrl.verifyEmail)
router.get("/", auth.verifyAdminToken, userCtrl.getAllUsers)

router.post("/new", userCtrl.newUser)


router.get("/count", auth.verifyAdminToken, userCtrl.getAllUsersCount)
router.get("/:id/activate", validateObjectId, auth.verifyAdminToken, userCtrl.activateUserAccount)
router.put('/:id/update-by-admin', validateObjectId, auth.verifyAdminToken, userCtrl.adminUpdateUser)
router.route("/:id")
    .get(validateObjectId, auth.authenticate, userCtrl.getUserProfile)
    .put(validateObjectId, auth.authenticate, photoUpload.single("image"), userCtrl.updateUser)
    .delete(validateObjectId, auth.verifyTokenAuthorization, userCtrl.deleteUser)

module.exports = router