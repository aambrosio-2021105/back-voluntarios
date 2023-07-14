const { request, response } = require('express');
const Voluntariados = require('../models/voluntariados');
const express = require('express');

const getVolunrariados = async (req = request, res = response) => {
    try {
        const query = { estado: true }
        const listaVoluntariados = await Voluntariados.find(query)

        res.json({
            msg: 'get Api - Controlador Voluntariados',
            listaVoluntariados
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo listar el Evento",
            err,
        });
    }
}
const postVoluntariados = async (req = request, res = response) => {
    try {
        const {
            convocatoria_voluntariado,
            voluntario,
            estado,
            fechaHoraStart,
            fechaHoraEnd,
            horaInicio,
            horaFinal } = req.body;

        const fechaHoraInicio = new Date(fechaHoraStart.concat('T', horaInicio));
        const fechaHoraFin = new Date(fechaHoraEnd.concat('T', horaFinal));


        // Generar la data a guardar
        const data = {
            convocatoria_voluntariado,
            voluntario,
            estado,
            fechaHoraInicio,
            fechaHoraFin
        }

        const voluntariadosDb = new Voluntariados(data);
        //Guardar en DB
        await voluntariadosDb.save();

        res.status(201).json(voluntariadosDb);
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo guardar el Evento",
            err,
        });
    }

}

const putVoluntariados = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { convocatoria_voluntariado,
            voluntario,
            estado,
            fechaHoraStart,
            fechaHoraEnd,
            horaInicio,
            horaFinal } = req.body;
        const fechaHoraInicio = new Date(fechaHoraStart.concat('T', horaInicio));
        const fechaHoraFin = new Date(fechaHoraEnd.concat('T', horaFinal));
        
        console.log(convocatoria_voluntariado);
        console.log(voluntario);
        console.log(estado);
        console.log(fechaHoraInicio);
        console.log(fechaHoraFin);
        
        const datos = {
            convocatoria_voluntariado,
            voluntario,
            estado,
            fechaHoraInicio,
            fechaHoraFin,
        }
        const voluntariadoEditar = await Voluntariados.findByIdAndUpdate(id,datos)
        console.log(voluntariadoEditar);
        res.status(201).json({ msg: 'Evento Editado: ', voluntariadoEditar });
    } catch (err) {
        console.log(err);
        res.status(404).send({
            msg: "No se pudo editar el voluntariado",
            err,
        });
    }
}
const deleteVoluntariados = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        //Editar o actualiar la cateogira: Estado FALSE
        const voluntariadosDb = await Voluntariados.findByIdAndDelete(id);

        res.status(201).json({ msg: 'Rol borrado: ', voluntariadosDb });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo eliminar el evento",
            err,
        });
    }
}
const contarVoluntariados = async (req = request, res = response) => {
    try {
        cantidadVoluntariados = await Voluntariados.countDocuments();
        return res.json({cantidadVoluntariados });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

module.exports = {
    getVolunrariados,
    deleteVoluntariados,
    postVoluntariados,
    putVoluntariados,
    contarVoluntariados
}