const { response, request } = require('express');
//Importar Modelo
const Convocatoria = require('../models/convocatoria');
const AplicacionVoluntariado = require('../models/aplicacionVoluntariado');
const ContadoresConvocatoria = require('../models/contadoresConvocatoria');
const VoluntariadoActivo = require('../models/voluntariados');

//Fundacion
const getAplicaciones = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        const query = { convocatoria: id };
        const aplicaciones = await AplicacionVoluntariado.find(query);
        return res.json({ aplicaciones });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Admin
const getAplicacionesId = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        const aplicacion = await AplicacionVoluntariado.findById(id)
        .populate('voluntario', 'nombre correo telefono')
        .populate('convocatoria', 'titulo lugar');
        return res.json({ aplicacion });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Voluntario
const getAplicacionesVoluntario = async (req = request, res = response) => {
    try {
        const id = req.usuario.id;
        const query = { voluntario: id };
        const aplicaciones = await AplicacionVoluntariado.find(query);
        return res.json({ aplicaciones });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//admin
const getAllAplicaciones = async (req = request, res = response) => {
    try {
        const aplicaciones = await AplicacionVoluntariado.find();
        return res.json({ aplicaciones });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//User
const postAplicacion = async (req = request, res = response) => {
    try {
        const body = {
            voluntario: req.usuario.id,
            convocatoria: req.params.id,
        };
        //Validar que exista la convocatoria
        const convocatoria = await Convocatoria.findById(req.params.id);
        if (!convocatoria) return res.status(404).json({ msg: 'No existe la convocatoria' });
        //Validar que exista cupo disponible
        if (convocatoria.cupo <= 0) return res.status(400).json({ msg: 'No hay cupo disponible' });
        //Validar que el voluntario no se encuentre aplicado a la convocatoria
        const aplicacion = await AplicacionVoluntariado.findOne({ voluntario: req.usuario.id, convocatoria: req.params.id });
        if (aplicacion) return res.status(400).json({ msg: 'Ya se encuentra aplicado a esta convocatoria' });
        //Validar que exista el contador de la convocatoria
        const contador = await ContadoresConvocatoria.findOne({ convocatoria: req.params.id });
        if (!contador) return res.status(404).json({ msg: 'No existe el contador de la convocatoria' });
        //Modificar el contador de la convocatoria
        await ContadoresConvocatoria.findByIdAndUpdate(contador.id, {
            $inc: { aplicaciones_recibidas: 1, aplicaciones_pendientes: 1 }
        });
        //Crear la aplicacion
        const aplicacionVoluntariado = new AplicacionVoluntariado(body);
        await aplicacionVoluntariado.save();
        return res.json({ msg: 'Realizo su aplicación correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

//User
const deleteAplicacion = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        //Validar que exista la aplicacion
        const aplicacion = await AplicacionVoluntariado.findById(id);
        if (!aplicacion) return res.status(404).json({ msg: 'No existe la aplicacion' });
        //Validar que el usuario sea el dueño de la aplicacion
        if (aplicacion.voluntario.toString() !== req.usuario.id) return res.status(401).json({ msg: 'No tiene permisos para eliminar esta aplicacion' });
        //Validar que la aplicacion no este aceptada
        if (aplicacion.estado === 'Aceptado') return res.status(400).json({ msg: 'No puede eliminar una aplicacion aceptada' });
        //Validar que exista el contador de la convocatoria
        const contador = await ContadoresConvocatoria.findOne({ convocatoria: aplicacion.convocatoria });
        if (!contador) return res.status(404).json({ msg: 'No existe el contador de la convocatoria' });
        //Modificar el contador de la convocatoria
        await ContadoresConvocatoria.findByIdAndUpdate(contador.id, {
            $inc: { aplicaciones_recibidas: -1, aplicaciones_pendientes: -1 }
        });
        //Eliminar la aplicacion
        await AplicacionVoluntariado.findByIdAndDelete(id);
        return res.json({ msg: 'Elimino su aplicación correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const aceptarAplicacion = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        //Validar que exista la aplicacion
        const aplicacion = await AplicacionVoluntariado.findById(id);
        if (!aplicacion) return res.status(404).json({ msg: 'No existe la aplicacion' });
        //Validar que la aplicacion no este aceptada
        if (aplicacion.estado === 'Aceptado') return res.status(400).json({ msg: 'La aplicacion ya se encuentra aceptada' });
        //Modificar el contador de la convocatoria
        const contador = await ContadoresConvocatoria.findOne({ convocatoria: aplicacion.convocatoria });
        await ContadoresConvocatoria.findByIdAndUpdate(contador.id, { $inc: { aplicaciones_aceptadas: 1, aplicaciones_pendientes: -1 } });
        //Modificar la aplicacion
        await AplicacionVoluntariado.findByIdAndUpdate(id, { estado: 'Aceptado' });
        //Crear un nuevo registro en voluntariados_activos
        const voluntariadoActivo = new VoluntariadoActivo({ 
            voluntario: aplicacion.voluntario, 
            convocatoria_voluntariado: aplicacion.convocatoria, 
            fechaHoraInicio: Date.now(), 
            fechaHoraFin: null 
        });
        await voluntariadoActivo.save();
        //Disminuir el cupo de la convocatoria
        const convo = await Convocatoria.findByIdAndUpdate(aplicacion.convocatoria, { $inc: { cupo: -1 } });
        //Cambiar el estado de la convocatoria a false si el cupo es 0
        if (convo.cupo === 1) await Convocatoria.findByIdAndUpdate(aplicacion.convocatoria, { estado: false });
        return res.json({ msg: 'Acepto la aplicación correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const rechazarAplicacion = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        //Validar que exista la aplicacion
        const aplicacion = await AplicacionVoluntariado.findById(id);
        if (!aplicacion) return res.status(404).json({ msg: 'No existe la aplicacion' });
        //Validar que la aplicacion no este aceptada
        if (aplicacion.estado === 'Rechazado') return res.status(400).json({ msg: 'La aplicacion ya se encuentra rechazada' });
        //Modificar el contador de la convocatoria
        const contador = await ContadoresConvocatoria.findOne({ convocatoria: aplicacion.convocatoria });
        await ContadoresConvocatoria.findByIdAndUpdate(contador.id, { $inc: { aplicaciones_rechazadas: 1, aplicaciones_pendientes: -1 } });
        //Modificar la aplicacion
        await AplicacionVoluntariado.findByIdAndUpdate(id, { estado: 'Rechazado' });
        return res.json({ msg: 'Rechazo la aplicación correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

module.exports = {
    getAplicaciones,
    getAplicacionesVoluntario,
    getAllAplicaciones,
    getAplicacionesId,
    postAplicacion,
    deleteAplicacion,
    aceptarAplicacion,
    rechazarAplicacion
};
