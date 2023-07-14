const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const Admin = require('../models/adminApp');
const Fundacion  = require('../models/adminFundacion');
const Voluntario = require('../models/voluntario');


const login = async (req = request, res = response) => {
    const { correo, password } = req.body;
    try {
        const models = [Admin, Fundacion, Voluntario]; // Arreglo de modelos
        // Verificar si es Admin App, si no busca en fundacion, si no en voluntario
        let usuario = null;
        for (const model of models) {
            usuario = await model.findOne({ correo: correo });
            if (usuario) {
                break;
            }
        }
        
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (Usuario no registrado correo)'
            });
        }

        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (password incorrecta)'
            });
        }

        // Generate JWT
        const token = await generarJWT(usuario.id, usuario.nombre, usuario.rol);


        return res.json({
            msg: 'Login PATH',
            correo,
            password,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador (BackEnd)'
        });
    }
};

module.exports = {
    login
};
