# Sistema de Registro de Movimientos (Transacciones)

## 📋 Descripción

Sistema completo para registrar ingresos y gastos en el homePersonal de Finavex. Incluye una interfaz visual con dos botones (+/-) que abren un modal para registrar transacciones.

## 📁 Archivos Creados

1. **`frontend/app/components/homePersonal/transaction-section.tsx`**
   - Componente principal con los botones de Ingreso y Gasto
   - Maneja el estado del modal
   - Contiene la lógica de envío al servidor

2. **`frontend/app/components/homePersonal/transaction-modal.tsx`**
   - Modal flotante para ingresar datos
   - Formulario con validación
   - Campos: Monto (obligatorio) y Nota (opcional)

3. **`frontend/app/types/transaction.ts`**
   - Tipos TypeScript para las transacciones
   - Interfaces para request y response

## 🔌 Cómo Conectar con tu API

### Paso 1: Configurar el endpoint

En `transaction-section.tsx`, busca la función `handleSubmitTransaction` y descomenta el código de ejemplo:

```typescript
const handleSubmitTransaction = async (amount: number, note?: string) => {
  const transactionData: Transaction = {
    type: transactionType,
    amount,
    note,
    date: new Date().toISOString(),
  }

  try {
    // Reemplaza '/api/transactions' con tu endpoint real
    const response = await fetch('https://tu-api.com/api/transactions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Si necesitas autenticación:
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(transactionData)
    })

    if (!response.ok) {
      throw new Error('Error al registrar transacción')
    }

    const data = await response.json()
    console.log('Transacción registrada exitosamente:', data)
    
    // Actualizar el estado global o recargar datos
    // Por ejemplo:
    // await refreshBalance()
    // dispatch(addTransaction(data))
    
  } catch (error) {
    console.error("❌ Error al registrar transacción:", error)
    throw error
  }
}
```

### Paso 2: Formato de datos esperado

El objeto `transactionData` que se envía al servidor tiene el siguiente formato:

```typescript
{
  type: "income" | "expense",  // Tipo de transacción
  amount: number,              // Monto en formato decimal
  note?: string,               // Nota opcional
  date: string                 // Fecha en formato ISO (2026-01-09T...)
}
```

### Paso 3: Agregar autenticación

Si tu API requiere autenticación, puedes obtener el token del contexto:

```typescript
import { useUser } from "../../context/ContextUserData"

export function TransactionSection() {
  const { userData } = useUser() // o donde guardes el token
  
  const handleSubmitTransaction = async (amount: number, note?: string) => {
    // ...
    const response = await fetch('...', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}` // o donde esté tu token
      },
      // ...
    })
  }
}
```

### Paso 4: Actualizar el balance después de registrar

Después de registrar exitosamente una transacción, deberías actualizar el balance mostrado:

```typescript
// Opción 1: Recargar desde el servidor
const refreshBalance = async () => {
  const response = await fetch('/api/balance')
  const data = await response.json()
  // Actualizar estado...
}

// Opción 2: Actualizar localmente
// Si usas Context API o Redux, actualiza el estado global
```

## 🎨 Personalización de Estilos

Los componentes están diseñados para integrarse con el tema de tu proyecto usando:
- Variables CSS de Tailwind (`bg-card`, `text-foreground`, etc.)
- Soporte para tema oscuro (`dark:`)
- Glassmorphism y backdrop-blur
- Animaciones suaves

### Cambiar colores de los botones:

En `transaction-section.tsx`, modifica las clases:

```typescript
// Botón de Ingreso (verde por defecto)
className="... from-green-500 to-emerald-600 ..."

// Botón de Gasto (rojo por defecto)
className="... from-red-500 to-rose-600 ..."
```

## 🧪 Modo de Prueba

Actualmente, el sistema está en **modo simulación**. Las transacciones se muestran en la consola pero no se envían a ningún servidor:

```typescript
// Simulación temporal (ELIMINAR cuando conectes con la API real)
await new Promise((resolve) => setTimeout(resolve, 1000))
console.log("✅ Transacción simulada:", transactionData)
```

Para activar el modo real:
1. Comenta o elimina las líneas de simulación
2. Descomenta el código de fetch
3. Reemplaza el endpoint con tu URL real

## 📊 Ejemplo de Respuesta Esperada del Servidor

```typescript
{
  "success": true,
  "message": "Transacción registrada exitosamente",
  "data": {
    "id": "uuid-123",
    "type": "income",
    "amount": 1500.50,
    "note": "Salario del mes",
    "date": "2026-01-09T10:30:00.000Z",
    "userId": "user-456"
  }
}
```

## 🔒 Seguridad

Recomendaciones:
- ✅ Siempre valida los datos en el backend
- ✅ Usa HTTPS para las peticiones
- ✅ Implementa rate limiting en tu API
- ✅ Sanitiza las notas para prevenir XSS
- ✅ Verifica la autenticación del usuario

## 🐛 Debugging

Para ver los logs de las transacciones:
1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Console"
3. Registra una transacción
4. Verás los logs con el emoji ✅ o ❌

## 📱 Responsive

Los componentes son completamente responsive:
- Mobile: Botones apilados verticalmente en el modal
- Tablet: Grid de 2 columnas
- Desktop: Layout optimizado en 3 columnas

## ✨ Características

- ✅ Validación de monto en tiempo real
- ✅ Campo de nota opcional
- ✅ Estados de carga (loading)
- ✅ Manejo de errores
- ✅ Animaciones suaves
- ✅ Tema claro/oscuro
- ✅ Glassmorphism
- ✅ Feedback visual
- ✅ TypeScript tipado

## 🚀 Próximos Pasos

1. Conectar con tu API real
2. Implementar actualización del balance en tiempo real
3. Agregar historial de transacciones
4. Implementar filtros por fecha/tipo
5. Agregar gráficos de ingresos vs gastos
6. Exportar transacciones (CSV/PDF)

