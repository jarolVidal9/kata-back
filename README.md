# Kata Back - Backend API

Backend para sistema de encuestas desarrollado con Express y TypeScript.

## 🚀 Tecnologías

- Node.js
- Express
- TypeScript
- TypeORM
- MySQL
- CORS

## 📁 Estructura del Proyecto

```
src/
├── modules/           # Módulos de la aplicación
│   ├── auth/         # Autenticación y autorización
│   ├── survey/       # Gestión de encuestas
│   ├── question/     # Gestión de preguntas
│   └── response/     # Gestión de respuestas
├── shared/           # Código compartido
│   ├── middlewares/  # Middlewares personalizados
│   ├── errors/       # Manejo de errores
│   └── utils/        # Utilidades
├── config/           # Configuración
└── app.ts           # Configuración de Express
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install
```

## 🗄️ Configuración de Base de Datos

**Importante**: Asegúrate de crear la base de datos `kata_encuestas` antes de ejecutar el servidor.

```bash
# Modo desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

### TypeORM

- **Sincronización automática** en desarrollo: Las tablas se crean automáticamente
- **Logging SQL** habilitado en desarrollo
- **Entidades** ubicadas en `src/modules/**/*.entity.tssql -u root -p -e "CREATE DATABASE kata_encuestas"
```

### Variables de entorno

El archivo `.env` ya incluye la configuración de la base de datos:

```
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rorr
DB_NAME=kata_encuestas
```

## 🏃 Ejecución

```bash
# Modo desarrollo con hot-reload
npm run dev

# Compilar TypeScript
El archivo `.env` incluye:

```
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rorr
DB_NAME=kata_encuestas

## 📝 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```
PORT=3000
NODE_ENV=development
```

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario

### Surveys
- `GET /api/surveys` - Listar encuestas
- `GET /api/surveys/:id` - Obtener una encuesta
- `POST /api/surveys` - Crear encuesta
- `PUT /api/surveys/:id` - Actualizar encuesta
- `DELETE /api/surveys/:id` - Eliminar encuesta

### Questions
- `GET /api/questions` - Listar preguntas
- `POST /api/questions` - Crear pregunta

### Responses
- `GET /api/responses` - Listar respuestas
- `POST /api/responses` - Enviar respuesta

## 🧪 Testing

```bash
npm test
```

## 📦 Build

```bash
npm run build
```

El código compilado se generará en la carpeta `dist/`.
