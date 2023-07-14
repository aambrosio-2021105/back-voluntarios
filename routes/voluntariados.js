const { Router } = require('express');
const { check } = require('express-validator');
const { getVolunrariados, postVoluntariados, putVoluntariados, deleteVoluntariados, contarVoluntariados } = require('../controllers/voluntariados');
const router = Router();

router.get('/',[
] ,getVolunrariados);

router.post('/agregar', [
    
] ,postVoluntariados);

router.put('/editar/:id', [
    
] ,putVoluntariados);


router.delete('/eliminar/:id', [
    
] ,deleteVoluntariados);

router.get('/contar', [
] ,contarVoluntariados);

module.exports = router;