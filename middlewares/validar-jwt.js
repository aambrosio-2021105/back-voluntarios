const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Admin = require('../models/adminApp');
const Fundacion  = require('../models/adminFundacion');
const Voluntario = require('../models/voluntario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
  
    // Si no viene el token
    if (!token) {
      return res.status(401).json({
        msg: 'No hay token en la petición'
      });
    }
  
    try {
      const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);
  
      // Leer al usuario que corresponda el uid
      const models = [Admin, Fundacion, Voluntario]; // Arreglo de modelos
  
      // Verificar si es Admin App, si no busca en fundacion, si no en voluntario
      let usuario = null;
      for (const model of models) {
        usuario = await model.findById(uid);
        if (usuario) {
          break;
        }
      }
  
      // Verificar si el uid del usuario no existe
      if (!usuario) {
        return res.status(401).json({
          msg: 'Token no válido - usuario no existe en DB físicamente'
        });
      }
  
      req.usuario = usuario;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        msg: 'Token no válido'
      });
    }
  };
  
  // Export the validarJWT function
  module.exports = validarJWT;
  

module.exports = {
    validarJWT
}
