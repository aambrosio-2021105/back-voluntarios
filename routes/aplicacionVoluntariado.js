//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAplicaciones, getAplicacionesId, getAllAplicaciones, getAplicacionesVoluntario, postAplicacion, deleteAplicacion, aceptarAplicacion, rechazarAplicacion } = require('../controllers/aplicacionVoluntariado');
const { emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminFundacionRole, esVoluntarioRole, esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

//Obtener una aplicacion por id
router.get('/buscar/:id', [
    validarJWT,
    esAdminAppRole,
    validarCampos
], getAplicacionesId);

//Obtener todas las aplicaciones de una convocatoria publicada por una fundación
router.get('/mostrar/:id', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
], getAplicaciones);

//Obtener todas las aplicaciones de un voluntario
router.get('/mostrar-voluntario', [
    validarJWT,
    esVoluntarioRole,
    validarCampos
], getAplicacionesVoluntario);

//Obtener todas las aplicaciones a las convocatorias publicadas las fundaciones
router.get('/mostrar-all', [
    validarJWT,
    esAdminAppRole,
    validarCampos
], getAllAplicaciones);

//Aplicar a una convocatoria publicada por una fundación
router.post('/aplicar/:id', [
    validarJWT,
    esVoluntarioRole,
    validarCampos
], postAplicacion);

//Eliminar una aplicacion a una convocatoria
router.delete('/eliminar/:id', [
    validarJWT,
    esVoluntarioRole,
    validarCampos
], deleteAplicacion);

//Aceptar una aplicacion a una convocatoria
router.put('/aceptar/:id', [
    //  validarJWT,
    //  esAdminFundacionRole,
    validarCampos
], aceptarAplicacion);

//Rechazar una aplicacion a una convocatoria
router.put('/rechazar/:id', [
    //validarJWT,
    //esAdminFundacionRole,
    validarCampos
], rechazarAplicacion);

// ROUTER
module.exports = router;