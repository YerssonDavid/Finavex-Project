# 🤖 Guía Completa: Integración con IA en FINAVEX

## 📋 Índice
1. [Introducción - ¿Qué estamos construyendo?](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Los DTOs - Los Mensajeros](#los-dtos---los-mensajeros)
4. [AiClient - El Traductor](#aiclient---el-traductor)
5. [AssistendAIBot - El Orquestador](#assistendaibot---el-orquestador)
6. [AIController - La Puerta de Entrada](#aicontroller---la-puerta-de-entrada)
7. [Flujo Completo de una Petición](#flujo-completo-de-una-petición)
8. [Conceptos Clave de la API de OpenAI/Azure](#conceptos-clave-de-la-api)

---

## 🎯 Introducción

### ¿Qué estamos construyendo?

Imagina que tienes un **restaurante** (tu aplicación FINAVEX) y quieres contratar un **chef experto** (la IA de Azure/OpenAI) que no trabaja en tu cocina, sino en otro lugar. Para comunicarte con él necesitas:

1. **Un teléfono** (WebClient) para llamarlo
2. **Un idioma común** (JSON) para entenderse
3. **Un formato de pedido** (DTOs) para que no haya confusiones
4. **Un mesero** (Controller) que reciba los pedidos de los clientes
5. **Un gerente** (Service) que coordine todo

Eso es exactamente lo que hemos construido.

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FINAVEX BACKEND                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌─────────────────┐    ┌────────────────┐             │
│  │              │    │                 │    │                │             │
│  │ AIController │───▶│ AssistendAIBot  │───▶│   AiClient     │────────┐    │
│  │  (Puerta)    │    │  (Orquestador)  │    │  (Traductor)   │        │    │
│  │              │    │                 │    │                │        │    │
│  └──────────────┘    └─────────────────┘    └────────────────┘        │    │
│         ▲                                                              │    │
│         │                                                              ▼    │
│  ┌──────────────┐                                            ┌─────────────┐
│  │  RequestAI   │                                            │  INTERNET   │
│  │  ResponseAI  │◀───────────────────────────────────────────│             │
│  │  AiResponse  │         (DTOs - Los Mensajeros)            │  Azure AI   │
│  └──────────────┘                                            │  API        │
│                                                              └─────────────┘
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ubicación de los archivos:

```
src/main/java/com/semillero/Finavex/
├── controllers/
│   └── aiControllers/
│       └── AIController.java          ← Recibe peticiones HTTP
├── services/
│   └── assistendAI/
│       └── AssistendAIBot.java        ← Lógica de negocio
├── infraestructure/
│   └── infraestructureAI/
│       └── AiClient.java              ← Comunicación con Azure AI
└── dto/
    └── aiDto/
        ├── RequestAI.java             ← Lo que el usuario envía
        ├── ResponseAI.java            ← Lo que le devolvemos al usuario
        └── AiResponse.java            ← Lo que Azure AI nos responde
```

---

## 📦 Los DTOs - Los Mensajeros

### ¿Qué es un DTO?

**DTO = Data Transfer Object** (Objeto de Transferencia de Datos)

> 🎯 **Analogía**: Imagina que los DTOs son como **sobres de correo**. 
> - El sobre tiene un formato específico (remitente, destinatario, sello)
> - Dentro va el contenido (la carta)
> - Todos entienden cómo leer un sobre

Los DTOs definen **la estructura exacta** de los datos que viajan entre las diferentes capas de tu aplicación.

---

### 📥 RequestAI.java - "El Pedido del Cliente"

```java
package com.semillero.Finavex.dto.aiDto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                    // Genera getters, setters, toString, equals, hashCode
@AllArgsConstructor      // Constructor con todos los parámetros
@NoArgsConstructor       // Constructor vacío (necesario para deserialización JSON)
@Builder                 // Patrón Builder para crear objetos fácilmente
public class RequestAI {
    
    @NotBlank(message="Mensaje invalido!")  // Validación: no puede estar vacío
    private String question;                 // La pregunta del usuario
}
```

#### ¿Para qué sirve?

Cuando un usuario envía una petición HTTP como esta:

```json
POST /AI/chat/question
{
    "question": "¿Qué es un CDT?"
}
```

Spring automáticamente **deserializa** (convierte) ese JSON en un objeto `RequestAI`:

```java
RequestAI request = new RequestAI();
request.setQuestion("¿Qué es un CDT?");
```

#### ¿Por qué usar validaciones?

```java
@NotBlank(message="Mensaje invalido!")
```

Esto evita que alguien envíe:
```json
{ "question": "" }        // ❌ Rechazado
{ "question": "   " }     // ❌ Rechazado (solo espacios)
{ }                       // ❌ Rechazado (sin question)
```

---

### 📤 ResponseAI.java - "La Respuesta para el Cliente"

```java
package com.semillero.Finavex.dto.aiDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseAI {
    private String response;           // La respuesta de la IA
    private LocalDateTime timeResponse; // Cuándo se generó (opcional)
}
```

#### ¿Para qué sirve?

Es lo que **le devolvemos al usuario** después de procesar su pregunta:

```json
{
    "response": "Un CDT (Certificado de Depósito a Término) es un producto financiero...",
    "timeResponse": "2024-12-29T20:30:00"
}
```

#### ¿Por qué usar @Builder?

El patrón Builder permite crear objetos de forma elegante:

```java
// Sin Builder (tedioso)
ResponseAI response = new ResponseAI();
response.setResponse("Hola");
response.setTimeResponse(LocalDateTime.now());

// Con Builder (elegante) ✅
ResponseAI response = ResponseAI.builder()
        .response("Hola")
        .timeResponse(LocalDateTime.now())
        .build();
```

---

### 🔄 AiResponse.java - "El Traductor de Azure"

Este es el DTO más interesante. Azure AI responde con un JSON **muy complejo**:

```json
{
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1677858242,
    "model": "gpt-4o-mini",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "¡Hola! ¿Cómo puedo ayudarte hoy?"
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 12,
        "total_tokens": 21
    }
}
```

Pero nosotros **solo queremos el contenido** (`"¡Hola! ¿Cómo puedo ayudarte hoy?"`).

```java
package com.semillero.Finavex.dto.aiDto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)  // ⭐ CLAVE: Ignora campos que no nos interesan
public class AiResponse {
    private List<Choice> choices;            // Lista de respuestas

    // Clase interna para "choices"
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private Message message;             // El mensaje dentro de cada choice
    }

    // Clase interna para "message"
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Message {
        private String role;                 // "assistant", "user", "system"
        private String content;              // ⭐ El texto que queremos
    }

    // Método helper para extraer directamente el contenido
    public String getContent() {
        if (choices != null && !choices.isEmpty()) {
            return choices.get(0).getMessage().getContent();
        }
        return null;
    }
}
```

#### ¿Qué hace `@JsonIgnoreProperties(ignoreUnknown = true)`?

> 🎯 **Analogía**: Es como un **filtro de café**. El JSON de Azure tiene mucha información (granos + agua), pero tú solo quieres el café (el contenido del mensaje). Este filtro ignora todo lo demás.

Sin esta anotación, si Azure agrega un campo nuevo a su respuesta, tu aplicación **explotaría** con un error. Con ella, simplemente lo ignora.

#### ¿Por qué clases estáticas internas?

La estructura del JSON de Azure es **anidada**:

```
AiResponse
└── choices[] (Lista)
    └── Choice
        └── message
            └── Message
                ├── role: "assistant"
                └── content: "¡Hola!"  ← ESTO QUEREMOS
```

Las clases internas (`Choice`, `Message`) representan exactamente esa estructura anidada.

---

## 🌐 AiClient - El Traductor

### ¿Qué es el AiClient?

> 🎯 **Analogía**: Es como un **intérprete bilingüe** que:
> 1. Recibe lo que quieres decir en "español" (objetos Java)
> 2. Lo traduce a "inglés" (JSON para Azure)
> 3. Hace la llamada telefónica (HTTP POST)
> 4. Recibe la respuesta en "inglés" (JSON de Azure)
> 5. Te la traduce de vuelta a "español" (objeto Java)

```java
package com.semillero.Finavex.infraestructure.infraestructureAI;

import com.semillero.Finavex.dto.aiDto.AiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component  // Spring lo gestiona como un Bean (singleton)
@Slf4j      // Logger automático
public class AiClient {

    private final WebClient webClient;  // El "teléfono" para llamar a Azure

    // Constructor con inyección de dependencias
    public AiClient(
            WebClient.Builder builder,
            @Value("${API_URL_BASE_AI}") String baseUrl  // Lee de variables de entorno
    ) {
        this.webClient = builder
                .baseUrl(baseUrl)  // URL base: https://models.inference.ai.azure.com
                .defaultHeader(HttpHeaders.AUTHORIZATION,
                        "Bearer " + System.getenv("API_AI_GPT"))  // API Key
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String chat(String systemPrompt, String userPrompt) {
        // ... explicado abajo
    }
}
```

### Desglose del Constructor

```java
public AiClient(
        WebClient.Builder builder,                    // 1️⃣
        @Value("${API_URL_BASE_AI}") String baseUrl   // 2️⃣
) {
    this.webClient = builder
            .baseUrl(baseUrl)                         // 3️⃣
            .defaultHeader(HttpHeaders.AUTHORIZATION,
                    "Bearer " + System.getenv("API_AI_GPT"))  // 4️⃣
            .defaultHeader(HttpHeaders.CONTENT_TYPE, 
                    MediaType.APPLICATION_JSON_VALUE)  // 5️⃣
            .build();
}
```

| #  | Qué hace | Analogía |
|----|----------|----------|
| 1️⃣ | Spring inyecta un `WebClient.Builder` | Te dan las piezas para armar el teléfono |
| 2️⃣ | Lee la URL de las variables de entorno | El número de teléfono del chef |
| 3️⃣ | Configura la URL base | Guardas el número en marcado rápido |
| 4️⃣ | Agrega el token de autorización | Tu contraseña para que te contesten |
| 5️⃣ | Define que hablamos en JSON | El idioma acordado |

---

### El método `chat()` - El Corazón de la Comunicación

```java
public String chat(String systemPrompt, String userPrompt) {

    // 1️⃣ Construir el cuerpo de la petición
    Map<String, Object> requestBody = Map.of(
            "model", "gpt-4o-mini",           // Qué modelo usar
            "messages", List.of(
                    Map.of(
                            "role", "system",           // Instrucciones para la IA
                            "content", systemPrompt
                    ),
                    Map.of(
                            "role", "user",             // Lo que pregunta el usuario
                            "content", userPrompt
                    )
            ),
            "temperature", 0.7,               // Creatividad (0-1)
            "max_tokens", 500                 // Máximo de palabras en respuesta
    );

    // 2️⃣ Hacer la petición HTTP
    AiResponse response = webClient.post()           // Método POST
            .uri("/chat/completions")                 // Endpoint
            .bodyValue(requestBody)                   // El cuerpo JSON
            .retrieve()                               // Ejecutar
            .bodyToMono(AiResponse.class)            // Convertir respuesta a objeto
            .block();                                 // Esperar (síncrono)

    // 3️⃣ Extraer y devolver solo el contenido
    return response != null ? response.getContent() : null;
}
```

### ¿Qué son los "roles" en la API de OpenAI?

| Rol | Propósito | Ejemplo |
|-----|-----------|---------|
| `system` | Define la **personalidad** y **reglas** de la IA | "Eres un asistente financiero de FINAVEX..." |
| `user` | Lo que el **usuario pregunta** | "¿Qué es un CDT?" |
| `assistant` | Lo que la **IA responde** (lo usas para historial) | "Un CDT es..." |

> 🎯 **Analogía del System Prompt**: 
> Imagina que contratas a un actor. El `system` prompt es el **guión** que le das:
> - "Eres un mayordomo inglés, formal, que solo habla de finanzas"
> - El actor (IA) actuará según ese guión en todas las conversaciones

### ¿Qué es `temperature`?

Controla la **creatividad** de las respuestas:

| Valor | Comportamiento | Uso ideal |
|-------|----------------|-----------|
| 0.0 | Muy determinista, siempre igual | Datos factuales, código |
| 0.5 | Balanceado | Uso general |
| 0.7 | Creativo pero coherente | Asistentes, chat ✅ |
| 1.0 | Muy creativo, impredecible | Escritura creativa |

### ¿Qué es `max_tokens`?

Limita la **longitud de la respuesta**:
- 1 token ≈ 4 caracteres en inglés
- 1 token ≈ 2-3 caracteres en español
- 500 tokens ≈ 350-400 palabras

---

## 🎭 AssistendAIBot - El Orquestador

### ¿Qué es el Service?

> 🎯 **Analogía**: Es el **gerente del restaurante**. No cocina (eso lo hace AiClient), no atiende mesas (eso lo hace Controller), pero **coordina todo** y toma las decisiones de negocio.

```java
package com.semillero.Finavex.services.assistendAI;

import com.semillero.Finavex.dto.aiDto.RequestAI;
import com.semillero.Finavex.dto.aiDto.ResponseAI;
import com.semillero.Finavex.infraestructure.infraestructureAI.AiClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service  // Marca esta clase como un servicio de Spring
public class AssistendAIBot {
    
    private final AiClient aiClient;  // Dependencia inyectada

    // Constructor para inyección de dependencias
    public AssistendAIBot(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    // ⭐ El System Prompt - La "personalidad" del asistente
    private static final String SYSTEM_PROMPT = """
            Eres un asistente de finanzas personales, te pedirán consejos, 
            Guias y probablemente algo de información sobre el sector 
            financiero en COLOMBIA.
            
            Vas a responder de la manera más amable en nombre de FINAVEX, 
            que es la app para el manejo de finanzas personales.
            
            Se conciso con las respuestas, explícalas de la mejor manera, 
            como si la persona fuera novata.
            
            Si el usuario pregunta sobre otros temas, responde amablemente 
            que solo puedes ayudar con temas financieros.
            
            Puedes nombrar FINAVEX pero con un 🚀 al final
            """;

    public ResponseEntity<ResponseAI> explain(RequestAI request) {

        // 1️⃣ Llamar al AiClient con el system prompt y la pregunta
        String response = aiClient.chat(SYSTEM_PROMPT, request.getQuestion());

        // 2️⃣ Validar que hay respuesta
        if (response == null || response.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // 3️⃣ Construir y devolver la respuesta
        return ResponseEntity.ok(
                ResponseAI.builder()
                        .response(response)
                        .build()
        );
    }
}
```

### ¿Por qué el System Prompt está aquí y no en AiClient?

| Ubicación | Propósito |
|-----------|-----------|
| **AiClient** | Solo se encarga de la **comunicación técnica** (HTTP, JSON). Es **reutilizable** para diferentes propósitos. |
| **AssistendAIBot** | Define la **lógica de negocio** y la **personalidad** del asistente. Es **específico** para este caso de uso. |

> 🎯 **Analogía**: AiClient es como el **teléfono** (solo transmite). AssistendAIBot es **quien decide qué decir**.

---

## 🚪 AIController - La Puerta de Entrada

### ¿Qué es el Controller?

> 🎯 **Analogía**: Es el **mesero** del restaurante. Recibe al cliente (petición HTTP), toma su pedido (RequestAI), lo lleva a la cocina (Service), y regresa con la comida (ResponseAI).

```java
package com.semillero.Finavex.controllers.aiControllers;

import com.semillero.Finavex.dto.aiDto.RequestAI;
import com.semillero.Finavex.dto.aiDto.ResponseAI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController                      // Indica que es un controlador REST
@RequestMapping("/AI/chat")          // Ruta base: /AI/chat
@RequiredArgsConstructor             // Genera constructor para inyección
public class AIController {

    private final AssistendAIBot assistendAIBot;  // Servicio inyectado

    @PostMapping("/question")        // POST /AI/chat/question
    public ResponseEntity<ResponseAI> askQuestion(@RequestBody RequestAI question) {
        return assistendAIBot.explain(question);
    }
}
```

### Anotaciones importantes:

| Anotación | Significado |
|-----------|-------------|
| `@RestController` | Combina `@Controller` + `@ResponseBody`. Todo lo que retorne se convierte a JSON |
| `@RequestMapping("/AI/chat")` | Prefijo de URL para todos los endpoints de este controller |
| `@PostMapping("/question")` | Este método responde a `POST /AI/chat/question` |
| `@RequestBody` | "El cuerpo de la petición HTTP conviértelo a este objeto" |

---

## 🔄 Flujo Completo de una Petición

Veamos paso a paso qué sucede cuando un usuario hace una pregunta:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE UNA PETICIÓN                               │
└─────────────────────────────────────────────────────────────────────────────┘

1️⃣ USUARIO ENVÍA PETICIÓN
   ──────────────────────
   POST /AI/chat/question
   Content-Type: application/json
   
   {
       "question": "¿Qué es un CDT?"
   }
                    │
                    ▼
2️⃣ AICONTROLLER RECIBE
   ──────────────────────
   @PostMapping("/question")
   public ResponseEntity<ResponseAI> askQuestion(@RequestBody RequestAI question)
   
   → Spring deserializa JSON → RequestAI { question: "¿Qué es un CDT?" }
   → Llama a assistendAIBot.explain(question)
                    │
                    ▼
3️⃣ ASSISTENDAIBOT PROCESA
   ────────────────────────
   - Toma el SYSTEM_PROMPT (personalidad del bot)
   - Toma la pregunta del usuario
   - Llama a aiClient.chat(SYSTEM_PROMPT, question)
                    │
                    ▼
4️⃣ AICLIENT TRADUCE Y ENVÍA
   ─────────────────────────
   Construye el JSON para Azure:
   {
       "model": "gpt-4o-mini",
       "messages": [
           {"role": "system", "content": "Eres un asistente financiero..."},
           {"role": "user", "content": "¿Qué es un CDT?"}
       ],
       "temperature": 0.7,
       "max_tokens": 500
   }
   
   → POST https://models.inference.ai.azure.com/chat/completions
                    │
                    ▼
5️⃣ AZURE AI RESPONDE
   ───────────────────
   {
       "choices": [{
           "message": {
               "role": "assistant",
               "content": "Un CDT (Certificado de Depósito a Término) es un 
                          producto financiero que te permite invertir tu 
                          dinero por un plazo determinado... 🚀"
           }
       }]
   }
                    │
                    ▼
6️⃣ AICLIENT EXTRAE CONTENIDO
   ──────────────────────────
   - Deserializa JSON → AiResponse
   - Llama a response.getContent()
   - Retorna: "Un CDT (Certificado de Depósito a Término) es..."
                    │
                    ▼
7️⃣ ASSISTENDAIBOT EMPAQUETA
   ─────────────────────────
   ResponseAI.builder()
       .response("Un CDT (Certificado de Depósito a Término) es...")
       .build()
   
   → ResponseEntity.ok(responseAI)
                    │
                    ▼
8️⃣ AICONTROLLER RETORNA
   ──────────────────────
   Spring serializa ResponseAI → JSON
                    │
                    ▼
9️⃣ USUARIO RECIBE RESPUESTA
   ─────────────────────────
   HTTP 200 OK
   Content-Type: application/json
   
   {
       "response": "Un CDT (Certificado de Depósito a Término) es un 
                   producto financiero que te permite invertir tu 
                   dinero por un plazo determinado... 🚀",
       "timeResponse": null
   }
```

---

## 📚 Conceptos Clave de la API

### WebClient vs RestTemplate

| Característica | RestTemplate (viejo) | WebClient (moderno) ✅ |
|----------------|---------------------|----------------------|
| Estilo | Bloqueante | Reactivo (puede ser síncrono) |
| Performance | Menor | Mayor |
| Futuro | Deprecado en Spring 6 | Recomendado |
| Manejo de errores | Excepciones | Operadores reactivos |

### ¿Por qué usamos `.block()`?

```java
.bodyToMono(AiResponse.class)
.block();  // ← Esto
```

`WebClient` es **reactivo** por defecto (no bloqueante). Pero como tu aplicación es tradicional (no usa WebFlux completamente), usamos `.block()` para esperar la respuesta de forma síncrona.

> 🎯 **Analogía**: Es como decir "voy a esperar en la línea hasta que me contesten" en lugar de "llámame cuando tengas la respuesta".

### Variables de Entorno utilizadas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `API_URL_BASE_AI` | URL base de la API | `https://models.inference.ai.azure.com` |
| `API_AI_GPT` | Token de autenticación | `ghp_xxxxxxxxxxxx` |

---

## 🎓 Resumen Final

### Lo que aprendiste:

1. **DTOs** son como sobres de correo con formato específico
2. **RequestAI** recibe la pregunta del usuario
3. **ResponseAI** devuelve la respuesta al usuario
4. **AiResponse** traduce el JSON complejo de Azure
5. **AiClient** es el traductor/comunicador con Azure
6. **AssistendAIBot** es el orquestador con la lógica de negocio
7. **AIController** es la puerta de entrada HTTP
8. **System Prompt** define la personalidad del asistente

### Arquitectura en una línea:

```
Usuario → Controller → Service → Infrastructure → Azure AI → y de vuelta
           (puerta)    (cerebro)   (traductor)      (chef)
```

---

## 🚀 ¡Ahora eres capaz de...!

- ✅ Entender cómo se comunica tu app con APIs de IA
- ✅ Modificar el System Prompt para cambiar la personalidad del bot
- ✅ Agregar nuevos endpoints de IA
- ✅ Debuggear problemas de comunicación con Azure
- ✅ Extender la funcionalidad (historial de chat, streaming, etc.)

---

*Documentación creada para FINAVEX 🚀 - Diciembre 2024*

