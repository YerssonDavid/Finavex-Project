# Finavex

### **Estructura Frontend**

```text
frontend/app/
│
├── page.tsx               # Landing principal (ruta: /)
├── layout.tsx             # Layout global
├── globals.css            # Estilos globales
│
├── home/                  # Dashboard del usuario (ruta: /home)
│   └── page.tsx
│
├── login/                 # Página de login (ruta: /login)
│   └── page.tsx
│
├── register/              # Página de registro (ruta: /register)
│   └── page.tsx
│
├── about/                 # Página "Sobre Nosotros" (ruta: /about)
│   └── page.tsx
│
├── components/            # Componentes reutilizables
│   ├── home/              # Componentes del dashboard
│   ├── landing/           # Componentes de landing/marketing
│   ├── shared/            # Componentes compartidos
│   └── ui/                # Componentes UI base (botones, cards, etc.)
│
├── hooks/                 # Custom hooks reutilizables
│
├── lib/                   # Funciones y utilidades
│
├── public/                # Imágenes y archivos estáticos
│
├── next.config.mjs        # Configuración Next.js
├── package.json           # Dependencias del frontend
├── tsconfig.json          # Configuración TypeScript
└── postcss.config.mjs     # Configuración PostCSS
```

#### ¿Cómo agregar una nueva página?

1. Crea una carpeta dentro de `app/` con el nombre de la ruta.
2. Dentro de esa carpeta, crea un archivo `page.tsx`.
3. Next.js generará automáticamente la ruta.

**Ejemplo:**
```text
app/profile/page.tsx   → Ruta: /profile
app/dashboard/settings/page.tsx   → Ruta: /dashboard/settings
```

#### ¿Cómo agregar un componente?

- Si es específico de una página, ponlo en la carpeta correspondiente dentro de `components/`.
- Si es compartido, ponlo en `components/shared/`.
- Si es un botón, input, card, etc., ponlo en `components/ui/`.

**Ejemplo:**
```text
components/home/balance-card.tsx
components/landing/navigation.tsx
components/shared/theme-provider.tsx
components/ui/button.tsx
```

#### ¿Cómo importar componentes?

Siempre usa el alias `@/`:
```typescript
import { Button } from "@/components/ui/button"
import { BalanceCard } from "@/components/home/balance-card"
```
