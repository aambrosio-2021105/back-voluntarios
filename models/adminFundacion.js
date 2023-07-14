const { Schema, model } = require('mongoose');

const adminFundacionSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    acerca_de: {
        type: String,
        required: [true, 'La descripción es obligatoria']
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
    sitio_web: {
        type: String
    },
    telefono: {
        type: String
    },
    direccion: {
        type: String
    },
    horarios: {
        type: String
    },
    convocatorias_realizadas: {
        type: Number,
        default: 0
    },
    fotoPerfil: {
        type: String,
        required: true
    },
    fotoFondo: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
        default: 'ADMIN_FUNDACION'
    },
    redes_sociales: {
        facebook: {
            type: String
        },
        instagram: {
            type: String
        },
        twitter: {
            type: String
        }
    }
});


module.exports = model('Fundacion', adminFundacionSchema);