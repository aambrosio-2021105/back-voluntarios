const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/archivos");

  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}_${path.extname(file.originalname)}`);
  },
});
let arreglo = []
const fileFilter = (req, file,cb) => {

  arreglo.push(file);
    cb(null, true);
  }


const uploadMiddleware = multer({ storage, fileFilter });

module.exports = uploadMiddleware;
