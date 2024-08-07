const express = require("express");
const router = express.Router();
const certificateController = require("../controller/certificate.controller");
const photoUpload = require("../services/uploadImage.service")
router.route("/")
    .get(certificateController.getAllCertificates)
    .post( photoUpload.single("certificateImage"),certificateController.createCertificate)
router.route("/:id")
    .get(certificateController.getCertificateById)
    .delete(certificateController.deleteCertificate);

module.exports = router;