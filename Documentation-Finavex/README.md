# Finavex
![Logo-App](Img/LogoApp.png)

>[!NOTE]
Aplicación Web para el manejo de las finanzas personales. Logrando un hito en la gestión 


[![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-yellow)]()
[![Versión](https://img.shields.io/badge/versión-1.0.0-blue)]()
[![Licencia](https://img.shields.io/badge/licencia-MIT-green)]()

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Solución de Problemas](#-solución-de-problemas)
- [Changelog](#-changelog)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 📖 Descripción General

Descripción detallada del proyecto, incluyendo:
- Propósito y objetivos
- Problema que resuelve
- Público objetivo
- Contexto del proyecto

### Capturas de Pantalla

![Pantalla Principal](./docs/images/screenshot-1.png)
*Descripción de la imagen*

---

## ✨ Características Principales

- ✅ **Característica 1**: Descripción breve
- ✅ **Característica 2**: Descripción breve
- ✅ **Característica 3**: Descripción breve
- ✅ **Característica 4**: Descripción breve
- 🔄 **En desarrollo**: Características futuras

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Framework**: React.js, 
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS

### Backend
- **Framework**: Spring Boot, Spring Security
- **Lenguaje**: Java
- **Base de Datos**: PostgreSQL
- **ORM**: *Pendiente*
- **Autenticación**: JWT

### DevOps & Herramientas
- **Control de Versiones**: Git & GitHub
- **CI/CD**: GitHub Actions o Jenkins
- **Contenedores**: Docker & Docker Compose
- **Cloud**: Azure o heroku
- **Testing**: JUnit

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v18.x o superior)
- npm
- Git
- Docker (opcional)
- PostgreSQL v17

```bash
# Verificar versiones
node --version
npm --version
git --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/nombre-proyecto.git
cd nombre-proyecto
```

### 2. Instalar dependencias

#### Frontend
```bash
cd frontend
npm install
# o
yarn install
```

#### Backend
```bash
cd backend
npm install
# o
yarn install
```

### 3. Configurar base de datos

```bash
# Crear base de datos
createdb nombre_db

# Ejecutar migraciones
npm run migrate
# o
npm run db:push
```

---

## ⚙️ Configuración

### Variables de Entorno

Las variables de entorno se gestionaran con Doppler en la ejecución se ejecutara con Doppler CLI

Crea un archivo `.env` en la raíz del proyecto:

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=NombreApp
VITE_ENVIRONMENT=development
```

#### Backend (.env)
```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db

# Autenticación
JWT_SECRET=tu-secret-key-seguro
JWT_EXPIRES_IN=7d

# APIs Externas
API_KEY=tu-api-key
```

### Configuración de Docker (Opcional)

```bash
# Construir y levantar contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 💻 Uso

### Desarrollo

#### Iniciar Frontend
```bash
cd frontend
npm run dev
# La aplicación estará disponible en http://localhost:5173
```

#### Iniciar Backend
```bash
cd backend
npm run dev
# El servidor estará disponible en http://localhost:3000
```

### Producción

```bash
# Build del frontend
npm run build

# Iniciar servidor de producción
npm run start
```

### Comandos Útiles

```bash
# Ejecutar linter
npm run lint

# Ejecutar tests
npm run test

# Generar documentación
npm run docs

# Limpiar dependencias
npm run clean
```

---

## 📁 Estructura del Proyecto

```
proyecto/
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── features/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.ts
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── images/
│   ├── api/
│   └── guides/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```

---

## 📡 API Documentation

### Endpoints Principales

#### Autenticación

**POST** `/api/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Usuario Ejemplo"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Usuarios

**GET** `/api/users` - Obtener todos los usuarios
**GET** `/api/users/:id` - Obtener usuario por ID
**PUT** `/api/users/:id` - Actualizar usuario
**DELETE** `/api/users/:id` - Eliminar usuario

[Ver documentación completa de la API](./docs/api/README.md)

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### Estructura de Tests

```
tests/
├── unit/
├── integration/
└── e2e/
```

---

## 🚢 Despliegue

### Despliegue en Vercel (Frontend)

```bash
npm install -g vercel
vercel --prod
```

### Despliegue en Heroku (Backend)

```bash
heroku create nombre-app
git push heroku main
heroku run npm run migrate
```

### Despliegue con Docker

```bash
# Build de la imagen
docker build -t nombre-app:latest .

# Ejecutar contenedor
docker run -p 3000:3000 nombre-app:latest
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- Seguir ESLint/Prettier configurado
- Escribir tests para nuevas features
- Documentar cambios importantes
- Usar commits semánticos (feat, fix, docs, style, refactor, test, chore)

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verificar que la base de datos esté corriendo
# Verificar las credenciales en .env
```

### Error: "Port already in use"
```bash
# Cambiar el puerto en .env o matar el proceso
lsof -ti:3000 | xargs kill -9
```

### Problemas con dependencias
```bash
# Limpiar cache e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Changelog

### [1.0.0] - 2025-10-01
#### Agregado
- Funcionalidad inicial
- Sistema de autenticación
- CRUD completo de usuarios

#### Cambiado
- Mejoras en la UI

#### Corregido
- Bug en el login

[Ver historial completo de cambios](./CHANGELOG.md)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📧 Contacto

**Nombre del Desarrollador/Equipo**

- Email: contacto@ejemplo.com
- Website: https://ejemplo.com
- LinkedIn: [linkedin.com/in/usuario](https://linkedin.com/in/usuario)
- GitHub: [@usuario](https://github.com/usuario)

**Links del Proyecto**

- Repositorio: [https://github.com/usuario/proyecto](https://github.com/usuario/proyecto)
- Demo en vivo: [https://proyecto-demo.vercel.app](https://proyecto-demo.vercel.app)
- Documentación: [https://docs.proyecto.com](https://docs.proyecto.com)

---

## 🙏 Agradecimientos

- [Recurso o librería utilizada](https://ejemplo.com)
- Inspiración del proyecto
- Colaboradores

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub