const { Schema, model } = require('mongoose');

const adminAppSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio' ]
    },
    rol: {
        type: String,
        required: true
    },
    fotoPerfil: {
        type: String,
        required: true
    },
    fotoFondo: {
        type: String,
        required: true
    }
});


module.exports = model('AdminApp', adminAppSchema);