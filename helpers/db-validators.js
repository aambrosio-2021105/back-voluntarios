const Admin = require('../models/adminApp');
const Fundacion  = require('../models/adminFundacion');
const Voluntario = require('../models/voluntario');
const Convocatoria = require('../models/convocatoria');
//Este archivo maneja validaciones 
const { json } = require('express');
const UIploadModel = require('../models/voluntario');

const requiredFilesMiddleware = (req, res, next,file) => {
    const expectedFiles = ['CV', 'DPI', 'antecedentes', 'fotoPerfil', 'fotoFondo'];
    console.log(file);
    const receivedFiles = req.files
    console.log(receivedFiles);
    const missingFiles = expectedFiles.filter(file => !receivedFiles.includes(file));
  
    if (missingFiles.length === 0) {
      // Todos los archivos esperados están presentes
      next();
    } else {
      // Al menos uno de los archivos esperados está faltando
      const error = new Error('Faltan archivos requeridos');
      error.status = 400;
      error.missingFiles = missingFiles;
      next(error);
    }
  };

const emailExistente = async( correo = '' ) => {
    console.log("SE ENTRO");
    //Verificamos si el correo ya existe en la DB
    const existeEmail = await UIploadModel.findOne( { correo } );
    console.log(existeEmail);
    //Si existe (es true) lanzamos excepción
    if ( existeEmail ) {
        return  res.status(400).json({
                 msg: 'Usuario / Password no son correctos - (El correo no existe jaja)'
         });
    }

}

const emailExiste = async( correo = '' ) => {
    const models = [Admin, Fundacion, Voluntario]; // Arreglo de modelos
    // Verificar si es Admin App, si no busca en fundacion, si no en voluntario
    let existeEmail = null;
    for (const model of models) {
        existeEmail = await model.findOne({ correo });
        if (existeEmail) {
            break;
        }
    }

    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado en la DB`);
    }

}


const existeUsuarioPorId = async(id) => {
    const models = [Admin, Fundacion, Voluntario]; // Arreglo de modelos
    // Verificar si el usuario existe.
    let existeUser = null;
    for (const model of models) {
        existeUser = await model.findById(id);
        if (existeUser) {
            break;
        }
    }
    
    if (!existeUser) {
        throw new Error(`El id ${id} no existe en la DB`);
    }
}

//Verificador si la convocatoria es de la fundacion que esta intentado acceder
const esConvocatoriaDeLaFundacion = async (id, idFundacion) => {
    const convocatoria = await Convocatoria.findById(id);
    if (convocatoria.fundacion.toString() !== idFundacion) return false;
    return true;
}

module.exports = {
    emailExiste,
    existeUsuarioPorId,
    esConvocatoriaDeLaFundacion,
    emailExistente,
    requiredFilesMiddleware
}