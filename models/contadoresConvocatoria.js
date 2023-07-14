const { Schema, model } = require('mongoose');

const contadoresConvocatoriaSchema = Schema({
    convocatoria: {
        type: Schema.Types.ObjectId,
        ref: 'Convocatoria',
        required: true
    },
    aplicaciones_recibidas: {
        type: Number,
        default: 0
    },
    aplicaciones_aceptadas: {
        type: Number,
        default: 0
    },
    aplicaciones_rechazadas: {
        type: Number,
        default: 0
    },
    aplicaciones_pendientes: {
        type: Number,
        default: 0
    }
});

module.exports = model('ContadoresConvocatoria', contadoresConvocatoriaSchema);