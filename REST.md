# API de Juegos

## Información General

Esta API permite manejar juegos, incluyendo la creación, edición, eliminación y obtención de información sobre juegos.

### Base URL

`http://localhost:3000`

## Endpoints

### Obtener Juegos

#### GET `/juegos`

Obtiene una lista de juegos con soporte para paginación y búsqueda.

**Parámetros de consulta:**

- `limit` (opcional): Límite de resultados a devolver.
- `next` (opcional): ID del juego a partir del cual obtener los siguientes resultados.
- `prev` (opcional): ID del juego a partir del cual obtener los resultados anteriores.
- `search` (opcional): Término de búsqueda para buscar juegos por nombre.

**Respuesta Exitosa:**

- Código: 200 OK
- Cuerpo:
  ```json
  {
    "results": [
      {
        "_id": "60b8d2955f627e2e9c1a1f85",
        "header_image": "url_de_imagen",
        "name": "Nombre del juego",
        "short_description": "Descripción breve",
        "price": 29.99,
        "release_date": "2023-05-01",
        "categories": ["Action", "Adventure"],
        "genres": ["RPG", "Strategy"]
      }
    ],
    "next": "60b8d2955f627e2e9c1a1f84",
    "prev": null
  }
  ```

**Errores:**

- Código: 400 Bad Request
- Código: 500 Internal Server Error


**Errores:**

* Código: 400 Bad Request
* Código: 500 Internal Server Error

### Obtener Juego por Nombre

#### GET `/juegos/{name}`

Obtiene un juego por su nombre.

**Parámetros de ruta:**

* `name` (requerido): Nombre del juego.

**Respuesta Exitosa:**

* Código: 200 OK
* Cuerpo:
```json
 {
    "_id": "60b8d2955f627e2e9c1a1f85",
    "header_image": "url_de_imagen",
    "name": "Nombre del juego",
    "short_description": "Descripción breve",
    "price": 29.99,
    "release_date": "2023-05-01",
    "categories": ["Action", "Adventure"],
    "genres": ["RPG", "Strategy"]
  }
```

**Errores:**

* Código: 404 Not Found
* Código: 500 Internal Server Error

### Eliminar Juego por ID

#### DELETE `/juegos/{id}`

Elimina un juego por su ID.

**Parámetros de ruta:**

* `id` (requerido): ID del juego.

**Respuesta Exitosa:**

* Código: 200 OK

**Errores:**

* Código: 404 Not Found
* Código: 500 Internal Server Error

### Crear un Nuevo Juego

#### POST `/new_game`

Crea un nuevo juego con los datos proporcionados.

**Cuerpo de la Solicitud:**
```json
{
  "header_image": "url_de_imagen",
  "name": "Nombre del juego",
  "short_description": "Descripción breve",
  "price": 29.99,
  "release_date": "2023-05-01",
  "categories": "Action, Adventure",
  "genres": "RPG, Strategy"
}
```

**Respuesta Exitosa:**

* Código: 201 Created
* Cuerpo:
```json
{
    "message": "Juego creado con éxito"
}
 ```

**Errores:**

* Código: 400 Bad Request
* Código: 500 Internal Server Error

### Obtener Noticias de Juegos

#### GET `/noticias`

Obtiene noticias de juegos desde una API externa.

**Parámetros de consulta:**

* `count` (opcional): Número de noticias a obtener.

**Respuesta Exitosa:**

* Código: 200 OK
* Cuerpo: XML con las noticias obtenidas.

**Errores:**

* Código: 500 Internal Server Error

### Obtener Información de un Juego por ID para Editar

#### GET `/edit_juego/{id}`

Obtiene la información de un juego por su ID.

**Parámetros de ruta:**

* `id` (requerido): ID del juego.

**Respuesta Exitosa:**

* Código: 200 OK
* Cuerpo:
```json
  {
    "_id": "60b8d2955f627e2e9c1a1f85",
    "header_image": "url_de_imagen",
    "name": "Nombre del juego",
    "short_description": "Descripción breve",
    "price": 29.99,
    "release_date": "2023-05-01",
    "categories": ["Action", "Adventure"],
    "genres": ["RPG", "Strategy"]
  }
  ```

**Errores:**

* Código: 404 Not Found
* Código: 500 Internal Server Error

### Guardar Cambios en la Información de un Juego

#### POST `/edit_juego/{id}`

Guarda los cambios en la información de un juego.

**Parámetros de ruta:**

* `id` (requerido): ID del juego.

**Cuerpo de la Solicitud:**
```json
{
  "name": "Nuevo Nombre del Juego",
  "short_description": "Nueva descripción breve del juego",
  "price": 29.99,
  "release_date": "2024-06-01",
  "categories": "Action, Adventure",
  "genres": "RPG, Strategy"
}
```

**Respuesta Exitosa:**

* Código: 200 OK
* Cuerpo:
```json
  {
    "message": "Juego editado con éxito"
  }
```

**Errores:**

* Código: 404 Not Found
* Código: 500 Internal Server Error

### Obtener Información de un Juego por ID

#### GET `/info_juegos/{id}`

Obtiene la información de un juego por su ID.

**Parámetros de ruta:**

* `id` (requerido): ID del juego.

**Respuesta Exitosa:**

* Código: 200 OK
* Cuerpo:
```json
 {
    "_id": "60b8d2955f627e2e9c1a1f85",
    "header_image": "url_de_imagen",
    "name": "Nombre del juego",
    "short_description": "Descripción breve",
    "price": 29.99,
    "release_date": "2023-05-01",
    "categories": ["Action", "Adventure"],
    "genres": ["RPG", "Strategy"]
  }
```

**Errores:**

* Código: 404 Not Found
* Código: 500 Internal Server Error

## Esquemas de Datos

### Juego
```json
{
  "_id": "string",
  "header_image": "string",
  "name": "string",
  "short_description": "string",
  "price": "number",
  "release_date": "string (date)",
  "categories": ["string"],
  "genres": ["string"]
}
```
