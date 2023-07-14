const { Schema, model, default: mongoose } = require('mongoose');

const voluntariadosdSchema =new Schema({
    convocatoria_voluntariado: {
        type: Schema.Types.ObjectId,
        ref: 'convocatoria_voluntariado ',
        required: false
    },
    voluntario : {
        type: Schema.Types.ObjectId,
        ref: 'voluntario  ',
        required: false
    },
    estado: {
        type: Boolean,
        default:true
    },
    fechaHoraInicio: {
        type: Date,
        required: true
    },
    fechaHoraFin: {
        type: Date,
        required: true
    },
});

module.exports = model('Voluntariados', voluntariadosdSchema);