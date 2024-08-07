const express = require('express');
const router = express.Router();
const auth = require("../services/auth.service")
const photoUpload = require("../services/uploadImage.service")
const {publishNews, createNews, showNews, showNew, updateNews, deleteNews ,showPublishedNews} = require('../controller/news.control');

router.route('/')
    .get(showNews)
    .post( photoUpload.single("image"), createNews)

router.put("/publish/:id",publishNews)

router.get("/published",showPublishedNews)
router.patch("/:id",auth.verifyAdminOrEditorRole, photoUpload.single("image"), updateNews)
router.route("/:id")
    .get(showNew)
    .delete(auth.verifyAdminOrEditorRole, deleteNews)

module.exports = router