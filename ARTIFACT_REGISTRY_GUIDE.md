# 📦 Guía de Artifact Registry - Finavex Frontend

## ¿Qué es un Artifact Registry?

Un **Artifact Registry** es un repositorio centralizado donde almacenas y gestionas imágenes Docker, permitiendo descargarlas desde cualquier lugar para ejecutar contenedores.

---

## 🏗️ Opciones principales de Artifact Registry

### 1️⃣ **Google Cloud Artifact Registry** (GCP)
**Ruta típica:**
```
us-central1-docker.pkg.dev/PROJECT_ID/REPOSITORY_NAME/finavex-frontend:latest
```

**Estructura:**
- `us-central1-docker.pkg.dev` - Host de GCP
- `PROJECT_ID` - Tu ID de proyecto de Google Cloud
- `REPOSITORY_NAME` - Nombre del repositorio que creas
- `finavex-frontend` - Nombre de la imagen
- `latest` - Tag/versión

**Pasos:**
```bash
# 1. Instalar Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# 2. Autenticarse
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 3. Configurar autenticación de Docker
gcloud auth configure-docker us-central1-docker.pkg.dev

# 4. Crear repositorio (una sola vez)
gcloud artifacts repositories create finavex-repo \
  --repository-format=docker \
  --location=us-central1

# 5. Etiquetar la imagen
docker tag finavex-frontend:latest \
  us-central1-docker.pkg.dev/YOUR_PROJECT_ID/finavex-repo/finavex-frontend:latest

# 6. Pushear la imagen
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/finavex-repo/finavex-frontend:latest

# 7. Usar la imagen
docker run us-central1-docker.pkg.dev/YOUR_PROJECT_ID/finavex-repo/finavex-frontend:latest
```

---

### 2️⃣ **Docker Hub** (Más simple)
**Ruta típica:**
```
docker.io/USERNAME/finavex-frontend:latest
```

O simplemente:
```
USERNAME/finavex-frontend:latest
```

**Estructura:**
- `docker.io` - Registro público de Docker (opcional)
- `USERNAME` - Tu nombre de usuario de Docker Hub
- `finavex-frontend` - Nombre de la imagen
- `latest` - Tag/versión

**Pasos:**
```bash
# 1. Crear cuenta en https://hub.docker.com

# 2. Iniciar sesión en Docker
docker login

# 3. Etiquetar la imagen
docker tag finavex-frontend:latest USERNAME/finavex-frontend:latest

# 4. Pushear la imagen
docker push USERNAME/finavex-frontend:latest

# 5. Usar la imagen
docker run USERNAME/finavex-frontend:latest
```

---

### 3️⃣ **Azure Container Registry (ACR)**
**Ruta típica:**
```
myregistry.azurecr.io/finavex-frontend:latest
```

**Estructura:**
- `myregistry.azurecr.io` - Nombre de tu registro
- `finavex-frontend` - Nombre de la imagen
- `latest` - Tag/versión

**Pasos:**
```bash
# 1. Crear registro en Azure Portal o CLI
az acr create --resource-group myResourceGroup \
  --name myregistry --sku Basic

# 2. Obtener credenciales
az acr credential show --name myregistry

# 3. Iniciar sesión en Docker
docker login myregistry.azurecr.io

# 4. Etiquetar la imagen
docker tag finavex-frontend:latest \
  myregistry.azurecr.io/finavex-frontend:latest

# 5. Pushear la imagen
docker push myregistry.azurecr.io/finavex-frontend:latest

# 6. Usar la imagen
docker run myregistry.azurecr.io/finavex-frontend:latest
```

---

### 4️⃣ **AWS Elastic Container Registry (ECR)**
**Ruta típica:**
```
ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/finavex-frontend:latest
```

**Estructura:**
- `ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com` - URI de tu registro ECR
- `finavex-frontend` - Nombre del repositorio
- `latest` - Tag/versión

**Pasos:**
```bash
# 1. Instalar AWS CLI
# https://aws.amazon.com/cli/

# 2. Configurar credenciales
aws configure

# 3. Crear repositorio (una sola vez)
aws ecr create-repository --repository-name finavex-frontend --region us-east-1

# 4. Obtener token de autenticación
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# 5. Etiquetar la imagen
docker tag finavex-frontend:latest \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/finavex-frontend:latest

# 6. Pushear la imagen
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/finavex-frontend:latest

# 7. Usar la imagen
docker run ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/finavex-frontend:latest
```

---

## 🔑 Componentes de una ruta de imagen

```
REGISTRY/NAMESPACE/REPOSITORY:TAG
   ↓        ↓          ↓       ↓
docker.io  username   image   version
```

| Componente | Descripción | Ejemplo |
|-----------|-------------|---------|
| **REGISTRY** | Servidor de registro | `docker.io`, `gcr.io`, `azurecr.io` |
| **NAMESPACE** | Organización/Usuario | `mycompany`, `username`, `PROJECT_ID` |
| **REPOSITORY** | Nombre de la imagen | `finavex-frontend` |
| **TAG** | Versión de la imagen | `latest`, `v1.0.0`, `1.0` |

---

## 📝 Ejemplo completo: Google Cloud Artifact Registry

Asumiendo que tienes:
- Project ID: `mi-proyecto-123`
- Región: `us-central1`
- Repositorio: `finavex-repo`

### Pasos completos:

```bash
# 1. Construir la imagen localmente
docker build -t finavex-frontend:latest .

# 2. Configurar autenticación (primera vez)
gcloud auth login
gcloud config set project mi-proyecto-123
gcloud auth configure-docker us-central1-docker.pkg.dev

# 3. Crear repositorio en GCP (primera vez)
gcloud artifacts repositories create finavex-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Repositorio para Finavex Frontend"

# 4. Etiquetar la imagen con la ruta completa
docker tag finavex-frontend:latest \
  us-central1-docker.pkg.dev/mi-proyecto-123/finavex-repo/finavex-frontend:latest

# 5. Pushear a GCP
docker push us-central1-docker.pkg.dev/mi-proyecto-123/finavex-repo/finavex-frontend:latest

# 6. Verificar que está disponible
gcloud artifacts docker images list us-central1-docker.pkg.dev/mi-proyecto-123/finavex-repo

# 7. Usar la imagen (desde Cloud Run, Kubernetes, etc.)
docker run us-central1-docker.pkg.dev/mi-proyecto-123/finavex-repo/finavex-frontend:latest
```

---

## 🏷️ Mejores prácticas para Tags

```bash
# ✅ Recomendado: Usar versiones semánticas
docker tag finavex-frontend:latest myregistry/finavex-frontend:1.0.0
docker tag finavex-frontend:latest myregistry/finavex-frontend:1.0
docker tag finavex-frontend:latest myregistry/finavex-frontend:latest

# ✅ También es bueno: Tags descriptivos
docker tag finavex-frontend:latest myregistry/finavex-frontend:production
docker tag finavex-frontend:latest myregistry/finavex-frontend:staging
docker tag finavex-frontend:latest myregistry/finavex-frontend:dev

# ✅ Incluir commit hash para trazabilidad
docker tag finavex-frontend:latest myregistry/finavex-frontend:v1.0.0-abc123f
```

---

## 🔍 Verificar imágenes en el registro

### Google Cloud
```bash
gcloud artifacts docker images list LOCATION-docker.pkg.dev/PROJECT_ID/REPO_NAME
```

### Docker Hub
```bash
# En el navegador: https://hub.docker.com/r/USERNAME/finavex-frontend
```

### Azure
```bash
az acr repository list --name myregistry
az acr repository show-tags --name myregistry --repository finavex-frontend
```

### AWS ECR
```bash
aws ecr describe-repositories --repository-names finavex-frontend
aws ecr list-images --repository-name finavex-frontend
```

---

## 🚀 Script automatizado para GCP

Crea un archivo `push-to-gcr.sh`:

```bash
#!/bin/bash

# Variables
PROJECT_ID="tu-proyecto-id"
REGION="us-central1"
REPO_NAME="finavex-repo"
IMAGE_NAME="finavex-frontend"
TAG="latest"

# Rutas
REGISTRY="${REGION}-docker.pkg.dev"
FULL_IMAGE="${REGISTRY}/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:${TAG}"

echo "🐳 Pushing Finavex Frontend a Google Cloud Artifact Registry"
echo "📍 Ruta: ${FULL_IMAGE}"
echo ""

# 1. Construir imagen
echo "1️⃣  Construyendo imagen..."
docker build -t finavex-frontend:latest .

# 2. Etiquetar
echo "2️⃣  Etiquetando imagen..."
docker tag finavex-frontend:latest "${FULL_IMAGE}"

# 3. Pushear
echo "3️⃣  Pusheando a Artifact Registry..."
docker push "${FULL_IMAGE}"

echo ""
echo "✅ ¡Listo! Imagen disponible en:"
echo "${FULL_IMAGE}"
```

Ejecutar:
```bash
chmod +x push-to-gcr.sh
./push-to-gcr.sh
```

---

## ⚠️ Consideraciones de seguridad

- ✅ Usa **tokens de acceso** en lugar de contraseñas
- ✅ Limita **permisos** al mínimo necesario
- ✅ Usa **registries privados** para código sensible
- ✅ **Escanea imágenes** de vulnerabilidades
- ✅ Mantén credenciales en **variables de entorno**

---

## 📚 Recursos útiles

- [Google Cloud Artifact Registry](https://cloud.google.com/artifact-registry/docs)
- [Docker Hub Docs](https://docs.docker.com/docker-hub/)
- [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/)
- [AWS ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/)

