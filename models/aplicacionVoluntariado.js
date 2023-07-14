const { Schema, model } = require('mongoose');

const aplicacionVoluntariadoSchema = Schema({
    voluntario: {
        type: Schema.Types.ObjectId,
        ref: 'Voluntario',
        required: true
    },
    convocatoria: {
        type: Schema.Types.ObjectId,
        ref: 'Convocatoria',
        required: true
    },
    estado: {
        type: String,
        default: 'Pendiente'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('AplicacionVoluntariado', aplicacionVoluntariadoSchema);