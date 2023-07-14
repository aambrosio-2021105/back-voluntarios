//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAdmin, postAdmin, putAdmin, deleteAdmin,getAplicacionFundacion,getAdminFundaciones,getConvocatorias,getVolunrariados,deleteFundacion } = require('../controllers/admin');
const { emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole } = require('../middlewares/validar-roles');

const { getFile, deleteFile } = require('../controllers/voluntario');
const { getAllAdminsFundaciones } = require('../controllers/adminFundacion');
const uploadMiddleware = require('../middlewares/MulterMiddlewares');

const router = Router();
 
router.get('/mostrar',[
    validarJWT,
    esAdminAppRole
] ,getAdmin);

//ver cantidad de convocatorias 
router.get('/convocatoria',[
    validarJWT,
    esAdminAppRole
] ,getConvocatorias);
//ver cantidad de voluntariado en curso
router.get('/voluntariado',[
    validarJWT,
    esAdminAppRole
] ,getVolunrariados);
//ver voluntarios
router.get('/mostrarVoluntario',[
    validarJWT,
    esAdminAppRole
] ,getFile);
//eliminar voluntario
router.delete('/eliminarVoluntario/:id', [
    validarJWT,
    esAdminAppRole,
    validarCampos
] ,deleteFile);
//ver fundaciones
router.get('/mostrarFundaciones',[
    validarJWT,
    esAdminAppRole
] ,getAllAdminsFundaciones);
//eliminar fundaciones
router.delete('/eliminarFundacion/:id', [
    validarJWT,
    esAdminAppRole,
    validarCampos
] ,deleteFundacion);
//cantidad de fundaciones
router.get('/mostrarFundacionCount',[
    validarJWT,
    esAdminAppRole
] ,getAdminFundaciones);
//cantidad de aplicaciones por fundacion    
router.get('/mostrarAplicacionesF/:id',[
    validarJWT,
    esAdminAppRole
] ,getAplicacionFundacion);

router.post('/agregar', [
    uploadMiddleware.fields([
        { name: 'fotoPerfil', maxCount: 1 },
        { name: 'fotoFondo', maxCount: 1 },]),
    validarCampos,
] ,postAdmin);

router.put('/editar', [
    validarJWT,
    uploadMiddleware.fields([
        { name: 'fotoPerfil', maxCount: 1 },
        { name: 'fotoFondo', maxCount: 1 },]),
    esAdminAppRole,
    validarCampos
] ,putAdmin);


router.delete('/eliminar', [
    validarJWT,
    esAdminAppRole,
    validarCampos
] ,deleteAdmin);

// ROUTER
module.exports = router;