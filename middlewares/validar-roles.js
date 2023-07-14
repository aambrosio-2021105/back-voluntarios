const { request, response } = require('express');

//Verificador si es admin
const esAdminAppRole = (req = request, res = response, next) => {
    //Si no viene el usuario
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se require verificar el role sin validar el token primero'
        });
    }

    //Verificar que le rol sea ADMIN_ROLE
    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_APP' ) {
        return res.status(500).json({
            msg: `${ nombre } no es Administrador de la APP- No tiene acceso a esta función`
        });
    }

    next();
}

const esAdminFundacionRole = (req = request, res = response, next) => {
    //Si no viene el usuario
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se require verificar el role sin validar el token primero'
        });
    }

    //Verificar que le rol sea ADMIN_ROLE
    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_FUNDACION' ) {
        return res.status(500).json({
            msg: `${ nombre } no es Administrador de la fundacion - No tiene acceso a esta función`
        });
    }

    next();
}

const esVoluntarioRole = (req = request, res = response, next) => {
    //Si no viene el usuario
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se require verificar el role sin validar el token primero'
        });
    }

    //Verificar que le rol sea usuario
    const { rol, nombre } = req.usuario;

    if ( rol !== 'VOLUNTARIO_ROLE' ) {
        return res.status(500).json({
            msg: `${ nombre } no es un voluntario - No tiene acceso a esta función`
        });
    }

    next();
}


const NoEsAdminRole = (req = request, res = response, next) => {

    //Si no viene el usuario
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se require verificar el role sin validar el token primero'
        });
    }

    //Verificar que le rol sea ADMIN_ROLE
    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_APP' ||  rol !== 'ADMIN_FUNDACION') {
        return res.status(500).json({
            msg: `${ nombre } es Administrador - No tiene acceso a esta función`
        });
    }

    next();


}


//Operador rest u operador spread 
const tieneRole = ( ...roles ) => {

    return (req = request, res= response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!roles.includes( req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${ roles }`
            })

        }

        next();

    }

}


module.exports = {
    tieneRole,
    esAdminAppRole,
    esAdminFundacionRole,
    esVoluntarioRole,
    NoEsAdminRole
}