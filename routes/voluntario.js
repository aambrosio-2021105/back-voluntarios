//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const express = require('express');
const { esRoleValido, emailExiste, existeUsuarioPorId, requiredFilesMiddleware } = require('../helpers/db-validators');
const {postFile,getFile,putFile,deleteFile, getFileArchivo,ruta,getVoluntarioById} = require('../controllers/voluntario');
const uploadMiddleware = require('../middlewares/MulterMiddlewares');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const path = require('path');

const publicFolderPath = path.join(__dirname, 'public');


router.use('/archivos', express.static(path.join(publicFolderPath, 'archivos')));

router.use('/archivos', (req, res, next) => {
    console.log('La ruta de los archivos estáticos es:', path.join(publicFolderPath, 'archivos'));
    next();
  });

router.get("/fileVoluntario/:nombre", getFileArchivo);

router.get("/voluntario", getFile);

router.get("/voluntarioById",[
    validarJWT,validarCampos] ,getVoluntarioById);

router.post("/save",[
  
    uploadMiddleware.fields([
      {name: 'CV', maxCount: 1},
      { name: 'DPI', maxCount: 1 },
      { name: 'antecedentes', maxCount: 1 },
      { name: 'fotoPerfil', maxCount: 1 },
      { name: 'fotoFondo', maxCount: 1 },]),
   
],postFile);

router.put('/editar/:id', [uploadMiddleware.fields([
  {name: 'CV', maxCount: 1},
  { name: 'DPI', maxCount: 1 },
  { name: 'antecedentes', maxCount: 1 },
  { name: 'fotoPerfil', maxCount: 1 },
  { name: 'fotoFondo', maxCount: 1 },]) ],putFile);

router.delete('/eliminar/:id', [
] ,deleteFile);
module.exports = router;