# Docker Setup para Finavex Frontend

## 📋 Descripción

Este Dockerfile está configurado para construir y ejecutar la aplicación Next.js de Finavex Frontend en un contenedor Docker. Utiliza **Bun** como gestor de paquetes, el mismo que se usa en desarrollo, garantizando consistencia entre los entornos.

## 🏗️ Arquitectura del Dockerfile

El Dockerfile utiliza un enfoque de **multi-stage build** para optimizar el tamaño final del contenedor:

### **Stage 1: Dependencies**
- Base: `oven/bun:latest`
- Instala las dependencias de proyecto usando `bun install`

### **Stage 2: Builder**
- Base: `oven/bun:latest`
- Copia dependencias del stage anterior
- Compila la aplicación con `bun run build`
- Genera `.next` (build de Next.js)

### **Stage 3: Production**
- Base: `oven/bun:latest` (optimizado)
- Copia solo los artefactos necesarios
- Instala `dumb-init` para manejo adecuado de señales
- Ejecuta la aplicación en modo producción

## 🚀 Cómo usar

### Opción 1: Usando Docker Compose (Recomendado)

```bash
# Construir e iniciar el contenedor
docker-compose up --build

# En segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La aplicación estará disponible en: `http://localhost:3000`

### Opción 2: Usando Docker directamente

```bash
# Construir la imagen
docker build -t finavex-frontend:latest .

# Ejecutar el contenedor
docker run -p 3000:3000 \
  --name finavex-frontend \
  -e NODE_ENV=production \
  finavex-frontend:latest

# En segundo plano
docker run -d -p 3000:3000 \
  --name finavex-frontend \
  -e NODE_ENV=production \
  finavex-frontend:latest
```

## 📦 Dependencias incluidas

El contenedor incluye exactamente las mismas dependencias que se usan en desarrollo:

### Production Dependencies:
- `next@^16.1.6`
- `react@^19.2.1`
- `react-dom@^19.2.1`
- Todas las librerías Radix UI y utilidades de UI
- `tailwindcss` y herramientas de estilos
- `zod` para validación
- `react-hook-form` para formularios
- Y más...

### Development Dependencies:
Se incluyen en el build pero no en la imagen final, optimizando el tamaño.

## 🔧 Variables de entorno

La aplicación utiliza las siguientes variables de entorno:

```bash
NODE_ENV=production  # Configurado automáticamente
```

Si necesitas agregar más variables de entorno, puedes:

1. Pasar al contenedor:
```bash
docker run -e VAR_NAME=value ...
```

2. O en docker-compose.yml:
```yaml
environment:
  - VAR_NAME=value
```

## 📊 Health Check

El contenedor incluye un health check que verifica cada 30 segundos si la aplicación está respondiendo en `http://localhost:3000`.

## 🗑️ Comandos útiles

```bash
# Listar imágenes
docker images | grep finavex

# Ver contenedores en ejecución
docker ps | grep finavex

# Ver logs
docker logs finavex-frontend

# Ejecutar comando dentro del contenedor
docker exec -it finavex-frontend bun --version

# Detener contenedor
docker stop finavex-frontend

# Eliminar contenedor
docker rm finavex-frontend

# Eliminar imagen
docker rmi finavex-frontend:latest
```

## 📈 Optimizaciones implementadas

✅ **Multi-stage build**: Reduce significativamente el tamaño de la imagen final  
✅ **Bun**: Más rápido que npm/yarn en instalación y ejecución  
✅ **dumb-init**: Manejo apropiado de señales (SIGTERM, SIGKILL)  
✅ **.dockerignore**: Excluye archivos innecesarios durante el build  
✅ **Frozen lockfile**: Garantiza reproducibilidad de builds  
✅ **Health check**: Monitoreo de la salud del contenedor  

## 🔍 Solución de problemas

### El contenedor se detiene inmediatamente
```bash
# Ver logs de error
docker logs finavex-frontend

# Reconstruir sin caché
docker build --no-cache -t finavex-frontend:latest .
```

### Puerto 3000 ya en uso
```bash
# Cambiar el puerto en docker-compose.yml o usar:
docker run -p 3001:3000 finavex-frontend:latest
```

### Problemas de dependencias
```bash
# Limpiar bun cache y reconstruir
docker build --no-cache -t finavex-frontend:latest .
```

## 🎯 Próximos pasos

Para producción, considera:

1. Usar un servidor web (nginx) frente a Next.js
2. Implementar CI/CD para builds automáticos
3. Usar registries privados para almacenar imágenes
4. Configurar orquestación con Kubernetes (si es necesario)

---

Para más información sobre Next.js y Docker, consulta la [documentación oficial](https://nextjs.org/docs/deployment/docker).

