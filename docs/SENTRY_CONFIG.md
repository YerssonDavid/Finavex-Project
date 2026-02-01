# Configuración de Sentry en Finavex

## Descripción General

Sentry está configurado opcionalmente en la aplicación. Puede ser desactivado en desarrollo y habilitado en producción.

## Configuración por Entorno

### Desarrollo (Dev)

En desarrollo, Sentry está **desactivado por defecto** para evitar errores de configuración.

Para habilitarlo en desarrollo, establece:
```bash
doppler set SENTRY_ENABLED=true
doppler set SENTRY_DSN=<tu-sentry-dsn>
```

O ejecuta con Doppler:
```bash
doppler run -- mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=dev
```

### Producción (Prod)

En producción, Sentry está **habilitado por defecto**.

Asegúrate de tener configuradas las siguientes variables en Doppler:

```bash
doppler set SENTRY_ENABLED=true
doppler set SENTRY_DSN=https://your-sentry-dsn@ingest.sentry.io/project-id
```

## Variables de Entorno Requeridas

| Variable | Descripción | Requerida | Entorno |
|----------|-------------|-----------|---------|
| `SENTRY_DSN` | Data Source Name de Sentry | No en dev, Sí en prod | Ambos |
| `SENTRY_ENABLED` | Habilitar/Deshabilitar Sentry | No | Ambos |

## Archivos de Configuración

- `src/main/resources/sentry.properties` - Configuración por defecto (desactivada)
- `src/main/resources/application-dev.yaml` - Configuración para desarrollo
- `src/main/resources/application-prod.yaml` - Configuración para producción

## Cómo Funciona

1. **Lectura de Propiedades**: Las propiedades se leen primero desde `sentry.properties`, luego se sobrescriben con las del YAML del perfil activo.

2. **Variables de Entorno**: Las propiedades con `${}` se reemplazan por variables de entorno de Doppler.

3. **Desactivación**: Si `SENTRY_ENABLED=false`, el SDK de Sentry se carga pero no envía eventos.

## Ejecución sin Errores de Sentry

### Sin Doppler (desarrollo local):
```bash
# Con Sentry desactivado (por defecto)
mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=dev
```

### Con Doppler (cualquier entorno):
```bash
doppler run -- mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=dev
```

## Solución de Problemas

### Error: "Failed to load Sentry configuration"
- ✅ Ahora está solucionado. El archivo `sentry.properties` existe y tiene `enabled=false` por defecto.

### Error: "DSN is required"
- Establece `SENTRY_ENABLED=false` o proporciona un `SENTRY_DSN` válido via Doppler.

### Error: "Invalid token (http status: 401)"
- El `SENTRY_DSN` es inválido o expiró. Verifica que sea correcto en Doppler.

## Próximos Pasos

1. ✅ Archivo `sentry.properties` creado
2. ✅ `application-dev.yaml` configurado (Sentry desactivado)
3. ✅ `application-prod.yaml` configurado (Sentry habilitado)
4. 📝 Agregar `SENTRY_DSN` en Doppler para producción
5. 📝 Ejecutar pruebas sin Doppler o con `SENTRY_ENABLED=false`
