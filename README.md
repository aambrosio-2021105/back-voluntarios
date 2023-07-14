# RestServer IN6BM

Este es un restServer con conección a mongoDB

Renombrar el archivo example.env a .env, esto es con la intención de tener las variables de entorno
configuradas en le proyecto, se estara agregando más en el futuro.

Para instalar los modulos de node ejecutar el comando
```
npm install
```

Se utiliza el siguiente comando para ejecutar el proyecto
```
npm run dev
```
La carpeta CONTROLLERS Maneja CONTROLADORES
La carpeta DATABASE Maneja Configuracion de la Base de datos (NO MODIFICAR)
La carpeta de HELPERS maneja generar-jwt y validaciones en la DB (NO MODIFICAR GENERAR-JWT)
La carpeta de Middlewares maneja Validar-campos, validar-JWT Y validar-ROLES (NO MODIFICAR)
La carpeta de MODELS maneja modelos
La Carpeta de MongoDB maneja colecciones de MongoDB 
La Carpeta De POSTMAN maneja Solicitudes HTTP
La Carpeta PUBLIC maneja HTML (No Importa por ahora)
La carpeta ROUTES Maneja RUTAS.
El nombre de la DB es : gestor_voluntariados
La secret Key es : Est03sMyPubl1cK3y2o23 
El puerto del servidor es: 8080

