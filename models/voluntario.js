const { Schema, model, default: mongoose } = require('mongoose');

const uploadSchema =new Schema({
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
    telefono: {
        type: Number,
       
    },
    direccion: {
        type: String,
        default: true
    }, 
    rol: {
        type: String,
        default: false
    }, 
    array_historial_voluntariados: {
        type: Array,
        default: []
    },
    DPI: {
        type: String,
        required: true
    },
    CV: {
        type: String,
        required: true
    },
    antecedentes: {
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

module.exports = model('voluntario', uploadSchema);