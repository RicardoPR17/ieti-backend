# FarmaYa

# BackEnd y API para la base de datos

## EQUIPO

|         **Nombres**          |
| :-------------------------: |
| Jessica Daniela Muñoz Ossa  |
|  José Ricardo Olarte Pardo  |
| Juan Francisco Terán Roman  |
| Laura Nathalia Garcia Acuña |
|   Ricardo Pulido Renteria   |


## Para la ejecución del proyecto
### Configuración del proyecto

Una vez clonas nuestro proyecto desde el repositorio de GitHub, debes correr el siguiente comando para descargar las dependencias

```bash
npm install
```

Ahora, para funcionar correctamente se debe crear un archivo *.env* en raíz con las siguientes variables de entorno:
- *PORT*: Número de puerto en el que se ejecutará nuestra API.
- *MONGO_URI*: Cadena de conexión dada por Mongo Atlas cuando creamos nuestra base de datos.
- *PRIVATE_KEY*: Cadena de texto con el contenido de la llave privada con la cual se firmarán los JWT.

**_Nota:_** Este archivo no se añade dado que la cadena de conexión a MongoDB y la llave privada son secretos compartidos entre miembros del equipo. Y pueden cambiar por las necesidades de cada persona que ejecuta el proyecto.

### Ejecución

Para ejecutar el proyecto, se debe correr el siguiente comando:

```bash
npm start
```

Para las rutas que no te brinden acceso, es porque están protegidas y requieren de un JWT en la petición. Para eso, primero registra un usuario y luego al iniciar sesión te entregarán en el cuerpo de la respuesta el JWT que podrás usar con validez de 1 hora.

En caso de ver la ejecución de las pruebas creadas con Mocha, se usa el comando:

```bash
npm test
```

### Opción de Docker

La última versión de este proyecto ya se encuentra subida en [DockerHub](https://hub.docker.com/repository/docker/jessicadmunozo/proyecto_ieti/general) en donde encontraras el comando para descargar la imagen, una vez se descarge podrás crear un contenedor cuyo puerto virtual sea el 80.

A continuación se muestran algunos pantallazos donde se muestra la ejecución local por medio de Docker.

- Creación y visualización del contenedor en funcionamiento

![Crear contenedor](contenedor.png)

- Inicio de sesión con usuario de prueba

![Inicio sesión](login.png)

- Muestra de una petición con autorización de JWT

![Con JWT](jwt.png)

- Petición sin JWT

![No autorizado](noAccess.png)


## Implementacion del Sprint 1:

https://youtu.be/lYQqcwOVmOU

## Implementacion del Sprint 2:


