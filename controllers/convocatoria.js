const { response, request } = require('express');
//Importar Modelos
const Convocatoria = require('../models/convocatoria');
const Fundacion = require('../models/adminFundacion');
const ContadoresConvocatoria = require('../models/contadoresConvocatoria');
//Creacion de los contadores de la convocatoria
const { postContadoresConvocatoriaPrimeraVez } = require('../controllers/contadoresConvocatoria');
//Evaluar si la convocatoria es de la fundacion que esta intentado acceder
const { esConvocatoriaDeLaFundacion } = require('../helpers/db-validators');
//Fundacion
const path = require('path');
const fs = require('fs');

const getConvocatorias = async (req = request, res = response) => {
    try {
        const query = { fundacion: req.usuario.id , estado: true };
        const convocatorias = await Convocatoria.find(query);
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const getConvocatoriasCerradas = async (req = request, res = response) => {
    try {
        const query = { fundacion: req.usuario.id, estado: false };
        const convocatorias = await Convocatoria.find(query);
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const getConvocatoriasById = async (req = request, res = response) => {
    try {

        const { id } = req.params;
        const convocatorias = await Convocatoria.findById(id);
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Voluntario
const getConvocatoriasLugar = async (req = request, res = response) => {
    try {
        const regexTitulo = new RegExp(req.params.titulo, 'i');
        let convocatorias = [];
        if (req.params.lugar === null){
            convocatorias = await Convocatoria.find({
                $and: [
                    { titulo: regexTitulo },
                    { estado: true }
                ]
            });
        }else{
            const regexLugar = new RegExp(req.params.lugar, 'i');
            convocatorias = await Convocatoria.find({
                $and: [
                    { lugar: regexLugar },
                    { titulo: regexTitulo },
                    { estado: true }
                ]
            });
        }
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Voluntario
const getConvocatoriasActivas = async (req = request, res = response) => {
    try {
        const query = { estado: true };
        const convocatorias = await Convocatoria.find(query);
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Admin
const getAllConvocatorias = async (req = request, res = response) => {
    try {
        const convocatorias = await Convocatoria.find()
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Admin
const getConvocatoriaNombre = async (req = request, res = response) => {
    try {
        const regexNombre = new RegExp(req.params.nombre, 'i');
        const convocatorias = await Convocatoria.find({ titulo: regexNombre });
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion

const eliminarArchivos = (nombre)=>{
    console.log(nombre);

    const publicFolderPath = path.join(__dirname, '../public/archivos');
    const ruta = nombre
    const partes = ruta.split('/');
    const ultimaPalabra = partes[partes.length - 1];
    let rutaEliminar = `${publicFolderPath}\\${ultimaPalabra}`
    fs.unlink(rutaEliminar, (error) => {
        if (error) {
          console.error('Error al eliminar el archivo:', error);
        } else {
        
        }
      });
  }

  const postConvocatoria = async (req = request, res = response) => {
    
    try {
        const archivos= req.files;
        const { ...data } = req.body;
        console.log(data);
        if(req.files.imagen === undefined){
           
            return res.status(400).json({
                msg: 'Agregue su foto por favor'
              });
        } 
        if (data.titulo ==='') {
            eliminarArchivos(archivos.imagen[0].filename)
            return res.status(400).json({
                msg: 'Agregue su nombre de fundacion por favor'
              });
        }
        if (data.descripcion ==='') {
            eliminarArchivos(archivos.imagen[0].filename)
            return res.status(400).json({
                msg: 'Agregue descripcion por favor'
              });
        }
        if (data.lugar ==='') {
            eliminarArchivos(archivos.imagen[0].filename)
            return res.status(400).json({
                msg: 'Agregue su lugar por favor'
              });
        }
        
        
        const fecha_inicio = new Date(data.fechaHoraStart.concat("T", data.horaInicio));
        const fecha_fin = new Date(data.fechaHoraEnd.concat("T", data.horaFinal));
  
        let fileImagen = `http://localhost:8080/archivos/${archivos.imagen[0].filename}`

        const body = {
            ...data,
            fundacion: req.usuario.id,
            fecha_inicio,
            fecha_fin,
            imagen:fileImagen
        };
        const convocatoriaDB = new Convocatoria(body);
        //Aumentar la cantidad de convocatorias de la fundacion
        await Fundacion.findByIdAndUpdate(req.usuario.id, { $inc: { convocatorias_realizadas: 1 } });
        //Crear aplicacionFundacion
        await postContadoresConvocatoriaPrimeraVez(convocatoriaDB._id);
        //Guardar en BD
        await convocatoriaDB.save();
        return res.json({ msg: 'Convocatoria creada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const putConvocatoria = async (req = request, res = response) => {
    try {
    
        const archivos= req.files;
        const { id } = req.params;
        //Verificar si la convocatoria es de la fundacion que esta intentado acceder
        const convocatoriaPropia = await esConvocatoriaDeLaFundacion(id, req.usuario.id);
        if (!convocatoriaPropia){
            eliminarArchivos(archivos.imagen[0].filename);
            return res.status(401).json({ msg: 'No tiene permiso para editar esta convocatoria' });
        }
        const convocatoriaEdi = await Convocatoria.findById(id)
        let imagenFile = convocatoriaEdi.imagen
      
        if (archivos.imagen!==undefined ) {
            eliminarArchivos(imagenFile);
            imagenFile = `http://localhost:8080/archivos/${archivos.imagen[0].filename}`
        }
        //Actualizar convocatoria
       
        const { _id, fundacion, estado, ...data } = req.body;
        console.log(data);
        const fecha_inicio = new Date(data.fechaHoraStart.concat("T", data.horaInicio));
        

        const fecha_fin = new Date(data.fechaHoraEnd.concat("T", data.horaFinal));
     
        const body = {
            ...data,
            fecha_inicio,
            fecha_fin,
            imagen:imagenFile
        };
        await Convocatoria.findByIdAndUpdate(id, body);
        return res.json({ msg: 'Convocatoria modificada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const deleteConvocatoria = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        //Verificar si la convocatoria es de la fundacion que esta intentado acceder
        const convocatoriaPropia = await esConvocatoriaDeLaFundacion(id, req.usuario.id);
        if (!convocatoriaPropia) return res.status(401).json({ msg: 'No tiene permiso para eliminar esta convocatoria' });
        //Eliminar convocatoria
        const convocatoria = await Convocatoria.findById(id);
        eliminarArchivos(convocatoria.imagen);
        await Convocatoria.findByIdAndDelete(id);
        await ContadoresConvocatoria.findOneAndDelete({ convocatoria: id });
        return res.json({ msg: 'Convocatoria eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const contarConvocatoria = async (req = request, res = response) => {
    try {
        cantidadConvocatorias = await Convocatoria.countDocuments();
        return res.json({ cantidadConvocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
  }

module.exports = {
    getConvocatorias,
    getConvocatoriasCerradas,
    getConvocatoriasLugar,
    getConvocatoriasActivas,
    getAllConvocatorias,
    getConvocatoriaNombre,
    postConvocatoria,
    putConvocatoria,
    deleteConvocatoria,
    contarConvocatoria,
    getConvocatoriasById
};