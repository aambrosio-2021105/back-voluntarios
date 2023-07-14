const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importar Modelo
const adminFundacion = require("../models/adminFundacion");

const getFundacionNombre = async (req = request, res = response) => {
    try {
        const regex = new RegExp(req.params.nombre, 'i');
        const fundaciones = await adminFundacion.find({ nombre: regex });
        return res.json({ fundaciones });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const path = require('path');
const fs = require('fs');

const getAdminFundacion = async (req = request, res = response) => {
    try {
        const query = { _id: req.usuario.id };
        const fundacion = await adminFundacion.findById(query);
        return res.json({ fundacion });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const getAllAdminsFundaciones = async (req = request, res = response) => {
    try {
        const fundaciones = await adminFundacion.find();
        return res.json({ fundaciones });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const eliminarArchivos = (nombre)=>{  
    const publicFolderPath = path.join(__dirname, '../public/archivos');
    const ruta = nombre
    const partes = ruta.split('/');
    const ultimaPalabra = partes[partes.length - 1];
    console.log(ultimaPalabra);
    let rutaEliminar = `${publicFolderPath}\\${ultimaPalabra}`
    fs.unlink(rutaEliminar, (error) => {
        if (error) {
          console.error('Error al eliminar el archivo:', error);
        } else {
        
        }
      });
  }
  
const eliminar = (objetos) => {
    const { fotoPerfil, fotoFondo } = objetos;
    fotoPerfil === undefined ? [] : [eliminarArchivos(fotoPerfil[0].filename)]
    fotoFondo === undefined ? [] : [eliminarArchivos(fotoFondo[0].filename)]
} 

const postAdminFundacion = async (req = request, res = response) => {
    try {
        const archivos = req.files;
        const { ...data } = req.body;
        
        //Encriptar password
        if (archivos.fotoPerfil === undefined) {
            eliminar(req.files)
            return res.status(400).json({
                msg: 'Agregue su foto perfil por favor'
            });
        }
        if (archivos.fotoFondo === undefined) {
            eliminar(req.files)
            return res.status(400).json({
                msg: 'Agregue su foto fondo por favor'
            });
        }
        if (data.nombre === '') {
            eliminar(req.files)
            return res.status(400).json({
                msg: 'Agregue su nombre de fundacion por favor'
            });
        }
        if (data.acerda_de === '') {
            eliminar(req.files)
            return res.status(400).json({
                msg: 'Agregue su acerda_de de fundacion por favor'
            });
        }
       
        if (data.correo === '') {
            eliminar(req.files)
            return res.status(400).json({
                msg: 'Agregue su correo de fundacion por favor'
            });
        }
        let dataCorreo = data.correo
        const existeEmail = await adminFundacion.findOne({ dataCorreo });

        if (existeEmail) {
            eliminar(req.files);
            return res.status(400).json({
                msg: `El correo ${correo} ya esta registrado`
            });
        }
        if (data.password === '') {
            eliminar(req.files)
            return res.status(400).json({
                msg: 'Agregue su password de fundacion por favor'
            });
        }
        let fotoPerfilFilename = '';
        let fotoFondoFilename = '';

        fotoPerfilFilename = `http://localhost:8080/archivos/${req.files.fotoPerfil[0].filename}`
        fotoFondoFilename = `http://localhost:8080/archivos/${req.files.fotoFondo[0].filename}`
        
        const fundacionDB = new adminFundacion({ ...data });
        const salt = bcrypt.genSaltSync();

        fundacionDB.fotoPerfil = (fotoPerfilFilename)
        fundacionDB.fotoFondo = (fotoFondoFilename);
        fundacionDB.password = bcrypt.hashSync(fundacionDB.password, salt);
        //Guardar en BD
        await fundacionDB.save();
        return res.json({ msg: 'Fundación creada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
}

const putAdminFundacion = async (req = request, res = response) => {
    try {
        const id = req.usuario.id;
        const archivos = req.files;
     
        const { _id, rol, ...data } = req.body;
        const {fotoPerfil, fotoFondo} = await adminFundacion.findById(id);
        let fotoPFile = fotoPerfil;
        let fotoFFile = fotoFondo;
        if (data.password) {
            //Encriptar password
            const salt = bcrypt.genSaltSync();
            data.password = bcrypt.hashSync(data.password, salt);
        }
        //Guardar en BD
        await adminFundacion.findByIdAndUpdate(id, data);
        
        if (archivos.fotoFondo!==undefined ) {
            eliminarArchivos(fotoFondo);
            fotoFFile = `http://localhost:8080/archivos/${archivos.fotoFondo[0].filename}` 
        }
        if (archivos.fotoPerfil!==undefined ) {
            eliminarArchivos(fotoPerfil);
            fotoPFile = `http://localhost:8080/archivos/${archivos.fotoPerfil[0].filename}` 
        }

        data.fotoFondo= fotoFFile;
        data.fotoPerfil = fotoPFile;
       await adminFundacion.findByIdAndUpdate(id, data);
        return res.json({ msg: 'Fundación modificada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}
const contarFundaciones = async (req = request, res = response) => {
    try {
        cantidadFundaciones = await adminFundacion.countDocuments();
        return res.json({ cantidadFundaciones });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const deleteAdminFundacion = async (req = request, res = response) => {
    try {
        const id = req.usuario.id;
        const fundacion = await adminFundacion.findById(id);
        const { fotoFondo,fotoPerfil } = fundacion;
        eliminarArchivos(fotoFondo);
        eliminarArchivos(fotoPerfil);

        await adminFundacion.findByIdAndDelete(id);
    return res.json({ msg: 'Fundación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

module.exports = {
    getFundacionNombre,
    getAdminFundacion,
    getAllAdminsFundaciones,
    postAdminFundacion,
    putAdminFundacion,
    deleteAdminFundacion,
    contarFundaciones,
};
