# 🏗️ ARQUITECTURA: Repositorio Compartido vs Repositorios Separados

## 📌 Resumen Ejecutivo

| Aspecto | Repositorio Compartido | Repositorios Separados |
|---------|----------------------|----------------------|
| **Definición** | Mismo repo para entidades relacionadas | Cada entidad tiene su propio repo |
| **Coupling** | Alto acoplamiento | Bajo acoplamiento |
| **Complejidad** | Más simple inicialmente | Más estructura |
| **Escalabilidad** | Limitada | Excelente |
| **Recomendación** | ❌ No recomendado | ✅ MEJOR PRÁCTICA |

---

## 1️⃣ ¿QUÉ ES UN REPOSITORIO COMPARTIDO?

### Concepto
Es cuando **intentas usar un solo repositorio para manejar múltiples entidades relacionadas**:

```java
// ❌ INCORRECTO: Repositorio compartido
@Repository
public interface SavingsRepository extends JpaRepository<SavingsMoneyUsers, Long> {
    
    // Métodos para SavingsMoneyUsers
    List<SavingsMoneyUsers> findByUserId(Long userId);
    
    // Métodos para User (❌ NO DEBERÍAN ESTAR AQUÍ)
    boolean existsByEmail(String email);
    User findByEmail(String email);
    
    // Métodos para ambas entidades mezcladas
}
```

### Problemas

```
┌─────────────────────────────────────────┐
│ SavingsRepository                       │
├─────────────────────────────────────────┤
│ // Para SavingsMoneyUsers               │
│ - findByUserId()                        │
│ - findByAmount()                        │
│                                         │
│ // Para User (❌ NO PERTENECEN AQUÍ)   │
│ - existsByEmail()                       │
│ - findByEmail()                         │
│ - findByDocumentNumber()                │
│                                         │
│ // Responsabilidades MÚLTIPLES          │
│ // Acoplamiento fuerte                  │
│ // Difícil de mantener                  │
└─────────────────────────────────────────┘
```

---

## 2️⃣ REPOSITORIOS SEPARADOS (✅ CORRECTO)

### Concepto
Cada entidad tiene **su propio repositorio especializado**:

```java
// ✅ CORRECTO: Repositorio para User
@Repository
public interface UserR extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByDocumentNumber(String documentNumber);
}

// ✅ CORRECTO: Repositorio para SavingsMoneyUsers
@Repository
public interface SavingsUser extends JpaRepository<SavingsMoneyUsers, Long> {
    List<SavingsMoneyUsers> findByUserId(Long userId);
    List<SavingsMoneyUsers> findByUser(User user);
}
```

### Estructura

```
┌──────────────────────┐        ┌──────────────────────┐
│    UserRepository    │        │  SavingsRepository   │
├──────────────────────┤        ├──────────────────────┤
│ - findByEmail()      │        │ - findByUserId()     │
│ - existsByEmail()    │        │ - findByAmount()     │
│ - findByPhone()      │        │ - save()             │
│ - deleteById()       │        │ - deleteById()       │
│                      │        │                      │
│ Responsabilidad:     │        │ Responsabilidad:     │
│ Gestionar Users      │        │ Gestionar Savings    │
└──────────────────────┘        └──────────────────────┘
         ▲                                ▲
         │                                │
         └────────── SEPARACIÓN ──────────┘
           Bajo acoplamiento, alta cohesión
```

---

## 3️⃣ COMPARACIÓN DETALLADA

### 🔴 REPOSITORIO COMPARTIDO (ANTIPATRÓN)

```java
// ❌ MALO: Todo en un repositorio
@Repository
public interface MovementsRepository extends JpaRepository<SavingsMoneyUsers, Long> {
    
    // Métodos para SavingsMoneyUsers
    List<SavingsMoneyUsers> findByUserId(Long userId);
    List<SavingsMoneyUsers> findByAmount(BigDecimal amount);
    
    // Métodos para User (❌ CONFUSIÓN)
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    
    // ¿A qué entidad buscan?
    // ¿De quién es la responsabilidad?
}
```

**Problemas:**

1. **Violación del Single Responsibility Principle (SRP)**
   - El repositorio tiene **múltiples razones para cambiar**
   - Si cambias User → afecta SavingsRepository
   - Si cambias SavingsMoneyUsers → afecta UserRepository

2. **Confusión semántica**
   ```java
   movementsRepository.existsByEmail("juan@example.com");
   // ¿Está verificando si existe un User o un SavingsMoneyUsers con ese email?
   ```

3. **Acoplamiento fuerte**
   ```
   SavingsService depende de → SavingsRepository
   SavingsRepository conoce de → User, SavingsMoneyUsers
   
   Si cambio User → rompe SavingsRepository → rompe SavingsService
   ```

4. **Difícil testing**
   ```java
   @Test
   public void testSavings() {
       // ¿Mockeo métodos de User o SavingsMoneyUsers?
       // El mock es demasiado complejo
       when(repository.existsByEmail(...)).thenReturn(true);
       when(repository.findByUserId(...)).thenReturn(list);
   }
   ```

---

### 🟢 REPOSITORIOS SEPARADOS (✅ CORRECTO)

```java
// ✅ BUENO: Repositorio enfocado en User
@Repository
public interface UserR extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

// ✅ BUENO: Repositorio enfocado en SavingsMoneyUsers
@Repository
public interface SavingsUser extends JpaRepository<SavingsMoneyUsers, Long> {
    List<SavingsMoneyUsers> findByUserId(Long userId);
    List<SavingsMoneyUsers> findByUser(User user);
}
```

**Beneficios:**

1. **Single Responsibility Principle (SRP)**
   ```
   UserRepository → Solo gestiona Users
   SavingsRepository → Solo gestiona SavingsMoneyUsers
   
   Cada uno tiene UNA razón para cambiar
   ```

2. **Claridad semántica**
   ```java
   userRepository.existsByEmail("juan@example.com");  // ✅ Claro
   savingsRepository.findByUserId(1L);                 // ✅ Claro
   ```

3. **Bajo acoplamiento**
   ```
   SavingsService depende de → SavingsRepository
   SavingsRepository depende de → SavingsMoneyUsers
   
   Si cambio User → NO afecta SavingsRepository
   ```

4. **Testing simplificado**
   ```java
   @Test
   public void testSavings() {
       // Mock solo lo que necesitas
       when(savingsRepository.findByUserId(1L))
           .thenReturn(List.of(saving));
       
       // UserRepository es un mock separado
       when(userRepository.findByEmail("juan@example.com"))
           .thenReturn(Optional.of(user));
   }
   ```

---

## 4️⃣ FLUJO EN TU APLICACIÓN

### ❌ CON REPOSITORIO COMPARTIDO

```
RequestRegistrySavingsUser
            │
            ▼
RegistrySavingsUser (Servicio)
            │
            ├─→ savingsRepository.existsByEmail()  ❌ Confuso
            ├─→ savingsRepository.findByEmail()    ❌ Confuso
            ├─→ savingsRepository.save()           ✅ Correcto
            │
            └─→ RESULTADO: Repositorio sobrecargado
```

### ✅ CON REPOSITORIOS SEPARADOS (TU CASO ACTUAL)

```
RequestRegistrySavingsUser
            │
            ▼
RegistrySavingsUser (Servicio)
            │
            ├─→ userRepository.findByEmail()    ✅ Claro
            │   (buscar el usuario propietario)
            │
            ├─→ savingsRepository.save()        ✅ Claro
            │   (guardar el ahorro)
            │
            └─→ RESULTADO: Responsabilidades claras
```

---

## 5️⃣ PATRÓN DE DISEÑO

### Patrón: Inyección de Dependencias Múltiples

```java
@Service
@RequiredArgsConstructor
public class RegistrySavingsUser {
    
    // ✅ Cada repositorio tiene su responsabilidad
    private final UserR userRepository;
    private final SavingsUser savingsRepository;
    
    public ResponseRegistrySavingsUser registrySavingsUser(
            RequestRegistrySavingsUser request) {
        
        // 1. UserRepository → gestiona búsqueda de usuarios
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("..."));
        
        // 2. SavingsRepository → gestiona ahorros
        SavingsMoneyUsers saving = new SavingsMoneyUsers();
        saving.setUser(user);
        saving.setAmount(request.amount());
        
        savingsRepository.save(saving);
        
        return new ResponseRegistrySavingsUser(true);
    }
}
```

**Ventajas:**
- Dos inyecciones separadas
- Cada una con su propósito
- Fácil de testear

---

## 6️⃣ CASOS DE USO ARQUITECTÓNICOS

### 📊 Caso 1: Obtener ahorros de un usuario

```java
// ✅ CORRECTO CON REPOSITORIOS SEPARADOS
public List<SavingsDTO> obtenerAhorrosUsuario(String email) {
    
    // 1. Usar UserRepository para validar el usuario
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UserNotFoundException("Usuario no existe"));
    
    // 2. Usar SavingsRepository para obtener ahorros
    List<SavingsMoneyUsers> savings = savingsRepository
        .findByUserId(user.getId());
    
    return savings.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
}
```

**Si tuvieras repositorio compartido:**
```java
// ❌ CONFUSO: ¿Cuál es la responsabilidad?
List<SavingsMoneyUsers> savings = movementsRepository
    .findByEmailAndUserId("juan@example.com", 1L);
// No existe este método naturalmente
```

---

### 📊 Caso 2: Actualizar un ahorro

```java
// ✅ CORRECTO
public void actualizarAhorro(Long savingId, BigDecimal nuevoMonto) {
    
    // Solo el repositorio de savings es responsable
    SavingsMoneyUsers saving = savingsRepository
        .findById(savingId)
        .orElseThrow(() -> new NotFoundException("..."));
    
    saving.setAmount(nuevoMonto);
    savingsRepository.save(saving);
}
```

---

### 📊 Caso 3: Eliminar un usuario y sus ahorros

```java
// ✅ CORRECTO CON ORQUESTACIÓN
@Service
public class UserDeleteService {
    
    private final UserR userRepository;
    private final SavingsUser savingsRepository;
    
    public void eliminarUsuarioConAhorros(Long userId) {
        // 1. Obtener ahorros (SavingsRepository)
        List<SavingsMoneyUsers> savings = savingsRepository
            .findByUserId(userId);
        
        // 2. Eliminar ahorros (SavingsRepository)
        savingsRepository.deleteAll(savings);
        
        // 3. Eliminar usuario (UserRepository)
        userRepository.deleteById(userId);
        // O usar cascade en la entidad
    }
}
```

Con `cascade = CascadeType.ALL` en la entidad, Hibernate lo maneja automáticamente.

---

## 7️⃣ PRINCIPIOS SOLID APLICADOS

### Single Responsibility (SRP)
```
UserRepository → Una razón para cambiar: cambios en User
SavingsRepository → Una razón para cambiar: cambios en SavingsMoneyUsers
```

### Open/Closed Principle (OCP)
```
Puedo agregar nuevos repositorios sin modificar los existentes
Ejemplo: nueva entidad ExpensesMoneyUsers con su propio repositorio
```

### Dependency Inversion (DIP)
```java
// ✅ Inyectar abstracciones (interfaces)
public RegistrySavingsUser(
    UserR userRepository,          // Interfaz
    SavingsUser savingsRepository  // Interfaz
) {}

// No depender de implementaciones concretas
```

---

## 8️⃣ DIAGRAMA DE ARQUITECTURA

### ❌ COMPARTIDO (Mala práctica)
```
┌─────────────────────────────────────────────┐
│           Application Layer                 │
├─────────────────────────────────────────────┤
│  RegistrySavingsService                     │
│  UserService                                │
│  ReportService                              │
│  (todos dependiendo del mismo repo)         │
└─────────────┬───────────────────────────────┘
              │ (muy acoplado)
              ▼
┌─────────────────────────────────────────────┐
│    MovementsRepository (SOBRECARGADO)       │
│  - existsByEmail()                          │
│  - findByEmail()                            │
│  - findByUserId()                           │
│  - findByAmount()                           │
│  - deleteById()                             │
│  (responsabilidades múltiples)              │
└─────────────┬───────────────────────────────┘
              │
              ▼
      ┌──────────────────┐
      │   Database       │
      └──────────────────┘
```

### ✅ SEPARADOS (Mejor práctica)
```
┌──────────────────────────────────────────┐
│      Application Layer                   │
├──────────────────────────────────────────┤
│  RegistrySavingsService                  │
│  UserService                             │
│  ReportService                           │
└────┬─────────────────────────────┬───────┘
     │ (bajo acoplamiento)         │
     ▼                             ▼
┌──────────────────┐        ┌──────────────────┐
│  UserRepository  │        │SavingsRepository │
├──────────────────┤        ├──────────────────┤
│ - findByEmail()  │        │ - findByUserId() │
│ - existsByEmail()│        │ - findByAmount() │
│ - deleteById()   │        │ - save()         │
└────┬─────────────┘        └────┬─────────────┘
     │                           │
     └───────────┬───────────────┘
                 ▼
        ┌──────────────────┐
        │   Database       │
        └──────────────────┘
```

---

## 9️⃣ EN DOCKER: ¿CAMBIA ALGO?

**NO. La arquitectura es INDEPENDIENTE del despliegue.**

```yaml
# docker-compose.yaml
services:
  app:
    build: .
    environment:
      # Las variables de entorno se cargan desde Doppler
      DB_HOST: postgres
    depends_on:
      - postgres
```

Aunque despliegues en Docker:
- ✅ Sigue siendo mejor tener repositorios separados
- ✅ El container ejecuta la misma lógica
- ✅ Las migraciones de Flyway son iguales

```
Docker Container
    ↓
Application (con UserRepository + SavingsRepository)
    ↓
Database (mismo esquema)
```

---

## 🔟 RESUMEN FINAL

### Tu situación actual (CORRECTA):

```java
@Service
public class RegistrySavingsUser {
    private final SavingsUser savingUser;        // ✅ Para SavingsMoneyUsers
    private final UserR userR;                   // ✅ Para User
}
```

**Esto está BIEN porque:**
1. Cada repositorio tiene su responsabilidad clara
2. Bajo acoplamiento
3. Fácil de mantener y testear
4. Sigue SOLID principles
5. Escalable para nuevas entidades

### Lo que debes evitar:

```java
// ❌ NO HAGAS ESTO
@Repository
public interface SavingsUser extends JpaRepository<SavingsMoneyUsers, Long> {
    boolean existsByEmail(String email);  // ❌ NO PERTENECE AQUÍ
    Optional<User> findByEmail(String email);  // ❌ NO PERTENECE AQUÍ
}
```

---

## 📚 REFERENCIAS ARQUITECTÓNICAS

- **Repository Pattern**: Separa la lógica de acceso a datos
- **Single Responsibility Principle**: Cada repositorio, una responsabilidad
- **Dependency Inversion**: Inyectar interfaces, no implementaciones
- **Domain-Driven Design**: Cada entidad con su repository

¡Tu arquitectura actual es correcta! 🎉

