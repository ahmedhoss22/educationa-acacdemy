const express = require('express');
const router = express.Router();
const upload = require ('../services/upload.js')
const auth = require("../services/auth.service")

const {createCv,  showCv, updateCv, deleteCv} = require('../controller/cv.control.js');

router.post('/create',auth.authenticate,upload.single('image') ,createCv);
 router.get('/show/:id',auth.verifyTokenOnlyUser, showCv);
router.put('/update/:id', auth.verifyTokenOnlyUser, updateCv);
router.delete('/delete/:id', deleteCv);








module.exports = router




