const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const UIploadModel = require('../models/voluntario');
const fs = require('fs');


const getVoluntarioById = async (req = request, res = response) => {
  try {

      const query = { _id: req.usuario.id };

      const voluntario = await UIploadModel.findById(query);
  
      return res.json({ voluntario });
  } catch (error) {
      res.status(500).json({ msg: error });
  }
}

const eliminar = (objetos)=>{
  
  const { CV, DPI, antecedentes, fotoPerfil, fotoFondo } = objetos;
  CV === undefined ? []:[eliminarArchivos(CV)]
  DPI === undefined ? []:[eliminarArchivos(DPI)]
  antecedentes === undefined ? []:[eliminarArchivos(antecedentes)]
  fotoPerfil === undefined ? []:[eliminarArchivos(fotoPerfil)]
  fotoFondo === undefined ? []:[eliminarArchivos(fotoFondo)]
}
const eliminarArchivos = (nombre)=>{
  
  const fondolFilePath = path.resolve('public/archivos', nombre[0].filename);
 
    fs.unlink(fondolFilePath, (error) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
      } else {
      
      }
    });
}
const postFile = async (req = request, res = response) => {
  try {
    const { CV, DPI, antecedentes, fotoPerfil, fotoFondo } = req.files;
    const { nombre, correo, password, telefono, direccion } = req.body;
    const rol= "VOLUNTARIO_ROLE";
    
    if (CV ===undefined) {
      eliminar(req.files);
      
      return res.status(400).json({
        msg: 'Agregue su CV por favor'
      });
       
    }
    if (DPI ===undefined) {
      eliminar(req.files);
      return res.status(400).json({
        msg: 'Agregue su DPI por favor'
      });
    }

    if (antecedentes ===undefined) {
      eliminar(req.files);
      return res.status(400).json({
        msg: 'Agregue sus antecedentes por por favor'
      });
    }
    if (fotoPerfil ===undefined) {
      eliminar(req.files);
      return res.status(400).json({
        msg: 'Agregue ssu foto de perfil por por favor'
      });
    }
    if (fotoFondo ===undefined) {
      eliminar(req.files);
      return res.status(400).json({
        msg: 'Agregue su foto de fondo por por favor'
      });
    }
    const CVFilename = CV[0].filename;
    const DPIFilename = DPI[0].filename;
    const antecedentesFilename = antecedentes[0].filename;
    let fotoPerfilFilename = fotoPerfil[0].filename;
    let fotoFondoFilename = fotoFondo[0].filename;
    fotoPerfilFilename= `http://localhost:8080/archivos/${fotoFondo[0].filename}`
    fotoFondoFilename=`http://localhost:8080/archivos/${fotoPerfil[0].filename}`
 
    const existeEmail = await UIploadModel.findOne({ correo });

    if (existeEmail) {
      eliminar(req.files);
      return res.status(400).json({
        msg:  `El correo ${correo} ya esta registrado`
      });
    }

    const pdfGuardadoDB = new UIploadModel(
        { nombre, 
          correo, 
          password, 
          telefono, 
          direccion, 
          rol, 
          CV:CVFilename, 
          DPI:DPIFilename, 
          antecedentes:antecedentesFilename,
          fotoPerfil:fotoPerfilFilename,
          fotoFondo:fotoFondoFilename });
    const salt = bcrypt.genSaltSync();
    pdfGuardadoDB.password = bcrypt.hashSync(password, salt)
    await pdfGuardadoDB.save();
    return res.json({
      msg: 'Post Voluntario user',
      pdfGuardadoDB
  });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: "No se pudo agregar el cliente",
      err,
    });
  }
}
//get de voluntarios
const getFile = async (req = request, res = response) => {
  try {

    const voluntario = await UIploadModel.find()

    res.json({
      msg: 'get Api - Controlador Ecvento',
      voluntario
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar el Evento",
      err,
    });
  }
}
//get de sus archivos para descargar 
const getFileArchivo = async (req = request, res = response) => {
  try {
    const { nombre } = req.params;
    const fileUrl = `${req.protocol}://${req.get('host')}/archivos/${nombre}`;
    console.log(fileUrl);
    res.json({ fileUrl });
  } catch (err) {
    res.status(404).send({
      msg: 'Error al obtener el archivo',
      error: err,
    });
  }
}
const eliminarUpdate = (nombre) =>{
  const cvFilePath = path.resolve('public/archivos', nombre);
  fs.unlink(cvFilePath, (error) => {
   
  });
}
const putFile = async (req = request, res = response) => {
  try {
  const archivos= req.files;
  const { id, nombre, correo, password, telefono, direccion, rol} = req.body;
    console.log(archivos.CV);
 
  const {CV, DPI, antecedentes, fotoPerfil, fotoFondo} = await UIploadModel.findById(id)
  let fileCV = CV;
  let fileDPI = DPI;
  let fileAntecedentes = antecedentes;
  let fileFotoP = fotoPerfil;
  let fileFotoF = fotoFondo;
  if (archivos.CV!==undefined ) {
    eliminarUpdate(CV);
    fileCV = archivos.CV[0].filename;
  }
  if (archivos.DPI!==undefined ) {
    eliminarUpdate(DPI);
    fileDPI = archivos.DPI[0].filename;
  }
  if (archivos.antecedentes!==undefined ) {
    eliminarUpdate(antecedentes);
    fileAntecedentes = archivos.antecedentes[0].filename;
  }
  if (archivos.fotoFondo!==undefined ) {
    eliminarUpdate(fotoFondo);
    fileFotoF = `http://localhost:8080/archivos/${archivos.fotoFondo[0].filename}` 
  }
  if (archivos.fotoPerfil!==undefined ) {
    eliminarUpdate(fotoPerfil);
    fileFotoP = `http://localhost:8080/archivos/${archivos.fotoPerfil[0].filename}` 
  }

  
  const datos = {
    nombre,
    correo, 
    password, 
    telefono, 
    direccion, 
    rol, 
    CV:fileCV,
    DPI:fileDPI,
    antecedentes:fileAntecedentes,
    fotoPerfil:fileFotoP,
    fotoFondo:fileFotoF
  }
  const voluntariadoEditado = await UIploadModel.findByIdAndUpdate(id, datos,{new:true});
  return res.json({
    msg: 'PUT editar user',
    voluntariadoEditado
});

} catch (err) {
  console.log(err);
  res.status(404).send({
      msg: "No se pudo editar el cliente",
      err,
    });
}

}
const deleteFile = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const voluntario = await UIploadModel.findById(id);
    const { CV, DPI, antecedentes,fotoFondo,fotoPerfil } = voluntario;
    const arreglo =[CV, DPI, antecedentes,fotoFondo,fotoPerfil]
    const voluntarioEliminado = await UIploadModel.findByIdAndDelete(id);
    for (let x = 0; x < arreglo.length; x++) {
      const element = arreglo[x];
      eliminarArchivos(element);
    }
   

    res.status(201).json({ msg: 'Voluntario borrado: ' ,voluntarioEliminado});
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo eliminar el evento",
      err,
    });
  }
}
module.exports = {
  postFile,
  getFile,
  putFile,
  deleteFile,
  getFileArchivo,
  getVoluntarioById
}