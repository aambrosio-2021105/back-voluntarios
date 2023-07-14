const { Schema, model } = require('mongoose');

const convocatoriaSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria' ]
    },
    lugar: {
        type: String,
        required: [true, 'El lugar es obligatorio' ]
    },
    cupo: {
        type: Number,
        required: [true, 'El cupo es obligatorio' ]
    },
    fecha_inicio: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria' ]
    },
    fecha_fin: {
        type: Date,
        required: [true, 'La fecha de fin es obligatoria' ]
    },
    imagen: {
        type: String,
        required: [true, 'La imagen es obligatoria' ]
    },
    fundacion: {
        type: Schema.Types.ObjectId,
        ref: 'Fundacion',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Convocatoria', convocatoriaSchema);