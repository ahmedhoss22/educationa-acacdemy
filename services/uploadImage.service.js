const path = require("path");
const multer = require("multer");
//photo Storage

const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    if (file) {
      let fileName = path.extname(file.originalname) 
      // cb(null, Date.now() + fileName)
      cb(null,  Date.now() + fileName);
    } else {
      cb(null, false);
    }
  },
});

let photoUpload = multer({
  storage: photoStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file format" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 }, 
});
module.exports = photoUpload;
