// Importar el módulo multer
const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const path = require("path");
// Configurar el middleware de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   
    cb(null, './public/archivos');
  },
  filename: (req, file, cb) => {
    console.log(file);
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png","application/pdf"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
  }
});

// Crear la instancia de multer con la configuración
const upload = multer({ storage });

// Exportar el middleware de upload
module.exports = upload;