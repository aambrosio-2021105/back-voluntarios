const { response, request } = require("express");
const bcrypt = require("bcryptjs");
//Importación de l modelo
const path = require("path");
const adminApp = require("../models/adminApp");
const adminFundacion = require("../models/adminFundacion");
const voluntariados = require("../models/voluntariados");
const convocatoria = require("../models/convocatoria");
const aplicacionVoluntariado = require("../models/aplicacionVoluntariado");
const fs = require("fs");

const getAdmin = async (req = request, res = response) => {
  try {
    const { id } = req.usuario;

    const adminapp = await adminApp.findById(id);
    console.log(adminapp);
    return res.json({
      msg: "get Api - Controlador Admin",
      adminapp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const eliminarUpdate = (nombre) => {
  const cvFilePath = path.resolve("public/archivos", nombre);
  fs.unlink(cvFilePath, (error) => {});
};

const getVolunrariados = async (req = request, res = response) => {
  try {
    const query = { estado: true };
    const listaVoluntariados = await voluntariados.count(query);

    res.json({
      msg: "get Api - Controlador Voluntariados",
      listaVoluntariados,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar el Evento",
      err,
    });
  }
};
const getConvocatorias = async (req = request, res = response) => {
  try {
    const query = { estado: true };
    const listaConvocatoria = await convocatoria.count(query);

    res.json({
      msg: "get Api - Controlador Convocatoria",
      listaConvocatoria,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar el Evento",
      err,
    });
  }
};
//get cantidad de fundaciones
const getAdminFundaciones = async (req = request, res = response) => {
  try {
    const cantidadFundacion = await adminFundacion.count();

    return res.json({
      msg: "get Api - Controlador Admin",
      cantidadFundacion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAplicacionFundacion = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const convocatorias = await convocatoria.find({ fundacion: id });
    let cantidad = 0;
    for (let x = 0; x < convocatorias.length; x++) {
      const element = convocatorias[x]._id;

      const aplicaciones = await aplicacionVoluntariado.find({
        convocatoria: element.toString(),
      });

      cantidad = aplicaciones.length;
    }

    return res.json({
      msg: "get Api - Cantidad de aplicaciones",
      cantidad,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const eliminarArchivos = (nombre) => {
  const publicFolderPath = path.join(__dirname, "../public/archivos");
  const ruta = nombre;
  const partes = ruta.split("/");
  const ultimaPalabra = partes[partes.length - 1];
  let rutaEliminar = `${publicFolderPath}\\${ultimaPalabra}`;
  fs.unlink(rutaEliminar, (error) => {
    if (error) {
      console.error("Error al eliminar el archivo:", error);
    } else {
    }
  });
};
const eliminar = (objetos) => {
  const { fotoPerfil, fotoFondo } = objetos;
  fotoPerfil === undefined ? [] : [eliminarArchivos(fotoPerfil)];
  fotoFondo === undefined ? [] : [eliminarArchivos(fotoFondo)];
};
const postAdmin = async (req = request, res = response) => {
  //Desestructuración
  const { nombre, correo, password } = req.body;
  const { fotoPerfil, fotoFondo } = req.files;
  const rol = req.body.rol || "ADMIN_APP";

  if (fotoPerfil === undefined) {
    eliminar(req.files);

    return res.status(400).json({
      msg: "Agregue su foto de perfil por favor",
    });
  }
  if (fotoFondo === undefined) {
    eliminar(req.files);
    return res.status(400).json({
      msg: "Agregue su foto de fondo por favor",
    });
  }
  let fotoPerfilFilename = fotoPerfil[0].filename;
  let fotoFondoFilename = fotoFondo[0].filename;
  fotoPerfilFilename = `http://localhost:8080/archivos/${fotoFondo[0].filename}`;
  fotoFondoFilename = `http://localhost:8080/archivos/${fotoPerfil[0].filename}`;
  const adminAppGuardadoDB = new adminApp({
    nombre,
    correo,
    password,
    rol,
    fotoPerfil: fotoPerfilFilename,
    fotoFondo: fotoFondoFilename,
  });

  //Encriptar password
  const salt = bcrypt.genSaltSync();
  adminAppGuardadoDB.password = bcrypt.hashSync(password, salt);

  //Guardar en BD
  await adminAppGuardadoDB.save();

  res.json({
    msg: "Post Api - Post Admin",
    adminAppGuardadoDB,
  });
};

const putAdmin = async (req = request, res = response) => {
  //Req.params sirve para traer parametros de las rutas
  const id = req.usuario.id;
  const archivos = req.files;
  const { nombre, correo, password, rol } = req.body;
  //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)
  //Si la password existe o viene en el req.body, la encripta
  const { fotoPerfil, fotoFondo } = await adminApp.findById(id);
  let fileFotoP = fotoPerfil;
  let fileFotoF = fotoFondo;

  if (archivos.fotoFondo !== undefined) {
    eliminarUpdate(fotoFondo);
    fileFotoF = `http://localhost:8080/archivos/${archivos.fotoFondo[0].filename}`;
  }
  if (archivos.fotoPerfil !== undefined) {
    eliminarUpdate(fotoPerfil);
    fileFotoP = `http://localhost:8080/archivos/${archivos.fotoPerfil[0].filename}`;
  }
  const datos = {
    nombre,
    correo,
    password,
    rol,
    fotoPerfil: fileFotoP,
    fotoFondo: fileFotoF,
  };

  const adminAppEditado = await adminApp.findByIdAndUpdate(id, datos);
  return res.json({
    msg: "PUT editar Admin",
    usuarioEditado: adminAppEditado,
  });
};

const deleteAdmin = async (req = request, res = response) => {
  //Req.params sirve para traer parametros de las rutas
  const { id } = req.usuario;
  const admin = await adminApp.findById(id);

  const { fotoFondo, fotoPerfil } = admin;
  //Eliminar cambiando el estado a false
  const adminAppEliminado = await adminApp.findByIdAndDelete(id);
  const arreglo = [fotoFondo, fotoPerfil];

  for (let x = 0; x < arreglo.length; x++) {
    const element = arreglo[x];

    eliminarArchivos(element);
  }

  return res.json({
    msg: "DELETE eliminar AdminApp",
    adminAppEliminado,
  });
};

const deleteFundacion = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    await adminFundacion.findByIdAndDelete(id);
    return res.json({ msg: "Fundación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAdmin,
  postAdmin,
  putAdmin,
  deleteAdmin,
  getAdminFundaciones,
  deleteFundacion,
  getVolunrariados,
  getConvocatorias,
  getAplicacionFundacion,
};

// CONTROLADOR
