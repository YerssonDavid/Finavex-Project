# ============================================
# Multi-stage Dockerfile para Finavex
# Optimizado con mejores prácticas
# ============================================

# ============================================
# Stage 1: Build
# ============================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

# Metadata
LABEL stage=builder
LABEL maintainer="Finavex Team"

# Crear directorio de trabajo
WORKDIR /build

# Copiar archivos de configuración Maven primero (mejor cache)
COPY pom.xml .
COPY .mvn/ .mvn/

# Descargar dependencias (se cachea si pom.xml no cambia)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src/ ./src/

# Compilar aplicación
# -DskipTests: Omitir tests en build (ejecutarlos en CI/CD)
# -B: Modo batch (sin output interactivo)
# -Dmaven.test.skip=true: Saltar compilación de tests
RUN mvn clean package -DskipTests -B

# Extraer layers del JAR para optimización
WORKDIR /build/target
RUN java -Djarmode=layertools -jar *.jar extract

# ============================================
# Stage 2: Runtime
# ============================================
FROM eclipse-temurin:17-jre-alpine AS runtime

# Metadata
LABEL maintainer="Finavex Team"
LABEL version="0.0.1-SNAPSHOT"
LABEL description="Finavex - Sistema de Gestión Financiera"

# Instalar dumb-init para manejo correcto de señales
# y curl para healthchecks
RUN apk add --no-cache dumb-init curl

# Crear usuario no-root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring

# Crear directorio de aplicación
WORKDIR /app

# Copiar layers en orden de menor a mayor frecuencia de cambio
# Esto optimiza el cache de Docker
COPY --from=builder --chown=spring:spring /build/target/dependencies/ ./
COPY --from=builder --chown=spring:spring /build/target/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /build/target/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /build/target/application/ ./

# Cambiar a usuario no-root
USER spring:spring

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto (sobreescribibles)
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+OptimizeStringConcat" \
    SERVER_PORT=8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando para ejecutar la aplicación usando Spring Boot Layertools
CMD ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]

