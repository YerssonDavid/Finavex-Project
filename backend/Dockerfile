# ============================================
# Stage 1: Build
# ============================================
FROM maven:3.9.9-eclipse-temurin-21 AS builder

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
FROM eclipse-temurin:21-jre AS runtime

RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init curl && \
    rm -rf /var/lib/apt/lists/*

# Crear usuario no-root para seguridad (sintaxis Debian)
RUN groupadd -r spring && useradd -r -g spring spring

WORKDIR /app
COPY --from=builder --chown=spring:spring /build/target/dependencies/ ./
COPY --from=builder --chown=spring:spring /build/target/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /build/target/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /build/target/application/ ./

USER spring
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]

