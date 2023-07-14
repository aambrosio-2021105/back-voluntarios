//Importación del modelo
const ContadoresConvocatoria = require('../models/contadoresConvocatoria');

const postContadoresConvocatoriaPrimeraVez = async (id) => {
    try {
        const contadoresConvocatoria = new ContadoresConvocatoria({ convocatoria: id });
        await contadoresConvocatoria.save();
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

module.exports = {
    postContadoresConvocatoriaPrimeraVez
}