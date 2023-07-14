//Importaciones de nodejs
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {

    constructor() {
        //Configuración inicial
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:    '/api/auth',
            adminApp:   '/api/admin',
            adminFundacion:   '/api/adminFundacion',
            aplicacionVoluntariado: '/api/aplicacionVoluntariado',
            convocatoria: '/api/convocatoria',
            voluntario:   '/api/voluntario',
            voluntariados: '/api/voluntariados'
        }


        //Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

    }

    //Función de conexión
    async conectarDB() {
        await dbConection();
    }

    //Un middleware es una función que se ejecuta antes de las rutas
    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del Body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

    }


    routes() {
        this.app.use(this.paths.auth , require('../routes/auth'));
        this.app.use(this.paths.adminApp, require('../routes/admin'));
        this.app.use(this.paths.adminFundacion, require('../routes/adminFundacion'));
        this.app.use(this.paths.aplicacionVoluntariado, require('../routes/aplicacionVoluntariado'));
        this.app.use(this.paths.convocatoria, require('../routes/convocatoria'));
        this.app.use(this.paths.voluntario, require('../routes/voluntario')); 
        this.app.use(this.paths.voluntario, require('../routes/voluntario'));
        this.app.use(this.paths.voluntariados, require('../routes/voluntariados'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        })
    }


}


//Importamos la clase Server
module.exports = Server;