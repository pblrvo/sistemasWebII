# Proyecto de API de Juegos

Este proyecto es una API y un cliente web para manejar juegos, incluyendo la creación, edición, eliminación y obtención de información sobre los juegos. La API está documentada usando OpenAPI 3.0.0.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
\sistemasWebII\cliente
│
├── .env
├── app.js
├── package-lock.json
├── package.json
│
├── bin
│   └── www
│
├── public
│   ├── images
│   │   └── iconoSisteams.png
│   └── stylesheets
│       └── style.css
│
├── routes
│   ├── edit_juego.js
│   ├── index.js
│   ├── info_juego.js
│   ├── juegos-gratuitos.js
│   ├── juegos.js
│   ├── new_game.js
│   └── noticias.js
│
└── views
    ├── edit_juego.ejs
    ├── error.ejs
    ├── header.ejs
    ├── info_juego.ejs
    ├── juegos-gratuitos.ejs
    ├── juegos.ejs
    ├── new_game.ejs
    └── noticias.ejs
```

### Archivos y Directorios Principales

- **.env**: Archivo de configuración de variables de entorno.
- **app.js**: Archivo principal de la aplicación donde se configura el servidor Express y las rutas.
- **package.json**: Contiene las dependencias del proyecto y scripts de npm.
- **bin/www**: Configuración del servidor.
- **public**: Contiene archivos públicos como imágenes y hojas de estilo.
- **routes**: Contiene los archivos de rutas para las diferentes funcionalidades de la aplicación.
- **views**: Contiene las vistas EJS para renderizar las páginas HTML.

## Instalación

Para instalar y ejecutar el proyecto localmente, sigue estos pasos:

1. Clona el repositorio:

   ```bash
   git clone https://github.com/pblrvo/sistemasWebII.git
   cd sistemasWebII
   ```

2. Instala Node.js si no lo tienes instalado. Puedes descargarlo desde [aquí](https://nodejs.org/).

3. Instala las dependencias del cliente:

   ```bash
   cd cliente
   npm install
   ```

4. Instala las dependencias de la API:

   ```bash
   cd api
   npm install
   ```

## Ejecución

Para ejecutar tanto el cliente como la API, abre dos terminales y ejecuta los siguientes comandos:

1. En el directorio `cliente`:

   ```bash
   npm start
   ```

2. En el directorio `api`:

   ```bash
   npm start
   ```

La aplicación estará disponible en `http://localhost:3000/cliente/v1/juegos`.

## Documentación de la API

### Rutas y Métodos

| Endpoint            | Método | Descripción                                                         |
| ------------------- | ------ | ------------------------------------------------------------------- |
| `/juegos`           | GET    | Obtiene una lista de juegos con soporte para paginación y búsqueda. |
| `/juegos/{name}`    | GET    | Obtiene un juego por su nombre.                                     |
| `/juegos/{id}`      | DELETE | Elimina un juego por su ID.                                         |
| `/new_game`         | POST   | Crea un nuevo juego con los datos proporcionados.                   |
| `/noticias`         | GET    | Obtiene noticias de juegos desde una API externa.                   |
| `/edit_juego/{id}`  | GET    | Obtiene la información de un juego por su ID para editar.           |
| `/edit_juego/{id}`  | POST   | Guarda los cambios en la información de un juego.                   |
| `/info_juegos/{id}` | GET    | Obtiene la información de un juego por su ID.                       |

### Esquema de Datos

El esquema de datos principal para la API es el siguiente:

- **Game**:
  - `_id`: ID del juego (string)
  - `header_image`: URL de la imagen del encabezado del juego (string)
  - `name`: Nombre del juego (string)
  - `short_description`: Descripción breve del juego (string)
  - `price`: Precio del juego (number)
  - `release_date`: Fecha de lanzamiento del juego (date)
  - `categories`: Categorías del juego (array de strings)
  - `genres`: Géneros del juego (array de strings)

Para más detalles sobre la API, consulta la documentación completa en el archivo `openapi.yaml`.

## Integrantes:

- Pablo Rivero
- Alejandro Ramirez
- Alberto Daguerre
- Joaquin Moreno
