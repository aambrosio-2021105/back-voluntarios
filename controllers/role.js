const { request, response } = require('express');
const Roles = require('../models/role');

const getRoles = async (req = request, res = response) => {
     const listarRoles = await Promise.all([
         Roles.countDocuments(),
         Roles.find()
     ]);
 
     res.json({
         msg: 'get Api - Controlador Roles',
         listarRoles
     });
}

const postRoles= async (req = request, res = response) => {
    //toUpperCase para todo a Mayusculas
    const rol = req.body.rol.toUpperCase();

    // Generar la data a guardar
    const data = { rol }

    const role = new Roles(data);
    //Guardar en DB
    await role.save();

    res.status(201).json(role);

}


const putRoles = async (req = request, res = response) => {
    const { id } = req.params;

    const { ...resto } = req.body;

    resto.rol = resto.rol.toUpperCase();

    //Editar o actualiar la cateogira
    const rolEditado = await Roles.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json({msg: 'Rol Editado: ' ,rolEditado});
}

const deleteRoles = async (req = request, res = response) => {
    const { id } = req.params;

    //Editar o actualiar la cateogira: Estado FALSE
    const rolBorrado = await Roles.findByIdAndDelete(id);

    res.status(201).json({msg: 'Rol borrado: ' ,rolBorrado});
}

module.exports = {
    getRoles,
    postRoles,
    putRoles,
    deleteRoles
}
