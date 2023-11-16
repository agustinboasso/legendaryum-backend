# Backend de Coin Collector App

Este es el backend de la aplicación Coin Collector, que gestiona las habitaciones, monedas y la lógica del juego.

## Tecnologías Utilizadas

- Node.js
- Express.js
- Socket.IO
- Docker

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/agustinboasso/legendaryum-backend
   ```

- Instala las dependencias:
  npm install

- Configuración
  El backend utiliza Socket.IO para la comunicación en tiempo real. Asegúrate de que la configuración de CORS esté permitida según tus necesidades.

2. **Ejecución**

- Para ejecutar el servidor:

  npm start

El servidor estará disponible en http://localhost:3000.

## Endpoints de la API

- Obtener Habitaciones

  GET /api/rooms

Devuelve la lista de habitaciones disponibles.

- Obtener Cantidad de Monedas en una Habitación

  GET /api/coins/count/:room

Devuelve la cantidad de monedas disponibles en una habitación específica.

- Obtener Monedas en una Habitación

  GET /api/coins/:room

Devuelve la lista de monedas disponibles en una habitación específica.

- Tomar una Moneda

  POST /api/grab/:id

Elimina una moneda específica del sistema.

## Configuración

El backend utiliza Socket.IO para la comunicación en tiempo real. Asegúrate de que la configuración de CORS esté permitida según tus necesidades.

## Uso de Redis

Este proyecto utiliza Redis para gestionar el tiempo de vida de las monedas. Asegúrate de tener un servidor Redis en ejecución antes de iniciar el proyecto.

## Docker

Este proyecto incluye un Dockerfile para facilitar la implementación con Docker.

- Construir la Imagen

docker build -t coin-collector-backend .

- Ejecutar el Contenedor

docker run -p 3000:3000 coin-collector-backend

## Estructura del Proyecto

.
├── src/ # Código fuente del backend
│ ├── controllers/ # Controladores de la aplicación
│ ├── models/ # Modelos de datos
│ ├── routes/ # Rutas de la API
│ ├── services/ # Lógica de negocio
│ └── app.ts # Configuración de la aplicación Express
├── Dockerfile # Configuración de Docker
├── package.json
├── README.md # Este archivo
└── ...
.
