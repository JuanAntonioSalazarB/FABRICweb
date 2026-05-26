# Documentación del Proyecto: FABRIC Cloud Engineering

Este documento detalla la arquitectura, estructura de directorios y el propósito de cada archivo dentro de la plataforma web de **FABRIC**. La aplicación está desarrollada sobre **Next.js 15 (App Router)** utilizando **React 19**, **TypeScript** y **Tailwind CSS (v4)**.

---

## 🛠️ Arquitectura y Tecnologías Core

1. **Framework**: Next.js 15.2.6 (App Router) con Turbopack para compilación rápida.
2. **Base de Datos**: MongoDB Atlas integrado mediante Mongoose, con pooling de conexiones optimizado para serverless.
3. **Servicios de Terceros**:
   - **OpenAI API (GPT-4o)**: Motor de la consola de consulta e ingeniería integrada (AI Consultant).
   - **Resend**: Despacho automatizado de correos de confirmación de diagnóstico, waitlist y office-hours.
4. **Diseño Visual**: Estilo premium con base oscura, acentos dorados (`#C9A96E`), tipografía serif sofisticada, animaciones de entrada fluidas (Intersection Observer) e interfaces responsivas completas.

---

## 📂 Estructura General del Proyecto

```text
PRUEBA 1/
├── public/                 # Recursos estáticos (Logos, imágenes)
│   └── img/
│       └── logo.png        # Logotipo principal de la marca
├── src/
│   ├── app/                # Enrutamiento, Server Actions y Estilos Globales
│   │   ├── actions/        # Server Actions (Base de datos, IA y autenticación)
│   │   │   ├── auth.ts      # Acciones de autenticación de admin (cookies de sesión)
│   │   │   ├── chat.ts      # Acciones del consultor de IA
│   │   │   ├── dashboard.ts # Acciones de control y consultas del panel admin
│   │   │   └── leads.ts     # Acciones para persistir leads, test y agendamientos
│   │   ├── aplicar/        # Ruta: Formulario post-waitlist
│   │   ├── casos/          # Rutas: Artículos técnicos individuales
│   │   ├── comparator/     # Rutas: Simuladores y calculadoras financieras
│   │   ├── dashboard/      # Ruta: Panel de administración integrado
│   │   ├── diagnostico/    # Ruta: Autodiagnóstico de estabilidad
│   │   ├── doctrina/       # Ruta: Filosofía de ingeniería
│   │   ├── login/          # Ruta: Acceso restringido del administrador
│   │   ├── office-hours/   # Ruta: Agenda de sesiones de consultoría
│   │   ├── transparencia/  # Ruta: Métricas y auditorías públicas
│   │   ├── globals.css     # Estilos CSS globales y variables de Tailwind v4
│   │   ├── layout.tsx      # Envoltura global HTML y fuentes tipográficas
│   │   └── page.tsx        # Orquestador principal de la Landing Page
│   ├── components/         # Componentes modulares de React
│   │   ├── modals/         # Modals y wizards superpuestos reutilizables
│   │   └── sections/       # Secciones individuales de la Landing Page
│   └── lib/                # Configuración y modelos de bases de datos
├── next.config.ts          # Configuración del compilador de Next.js
├── tsconfig.json           # Configuración del compilador de TypeScript
└── package.json            # Script del proyecto y dependencias de NPM
```

---

## 📄 Detalle de Archivos y Componentes

### 1. Secciones de la Landing Page (`src/components/sections/`)
La página de inicio se divide en 12 secciones independientes para maximizar la legibilidad y facilitar el mantenimiento del código:

* **[Hero.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Hero.tsx)**: Presentación premium de la marca con video/animación de fondo y los CTAs principales para agendar diagnósticos o abrir el simulador de costos.
* **[Comparadores.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Comparadores.tsx)**: Tarjetas de acceso rápido a los simuladores de TCO de ERP y costos de red en la nube.
* **[Terminal.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Terminal.tsx)**: Consola de comandos interactiva que simula un entorno SSH conectando a un consultor de IA. Maneja su propio historial de mensajes de forma reactiva y soporta streaming de respuestas.
* **[Doctrina.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Doctrina.tsx)**: Muestra los pilares no negociables de la metodología de la empresa y la garantía de cierre bajo contrato.
* **[Casos.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Casos.tsx)**: Tablas de cumplimiento métrico y enlaces a los papers técnicos de remediaciones exitosas (Casos APE Plazas y Aplazo).
* **[Industrias.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Industrias.tsx)**: Define el enfoque vertical exclusivo en tres sectores (Fintech, Real Estate e Inmobiliario, Logística).
* **[FabricOS.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/FabricOS.tsx)**: Acordeón interactivo que describe los niveles de la arquitectura técnica (H2H, SLA Engine, CFDI SAT, GL Reporting).
* **[Lifecycle.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Lifecycle.tsx)**: Flujograma del ciclo de vida del proyecto (Audit ➔ Remediate ➔ Stabilize ➔ Transition ➔ Evolve).
* **[Referencias.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Referencias.tsx)**: Lista de criterios mínimos requeridos para calificar como cliente y botón para agendar sesiones técnicas.
* **[Transparencia.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Transparencia.tsx)**: Métricas públicas de desempeño, latencias del timbrado SAT e ingestas de lotes XML bancarios.
* **[Investigacion.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Investigacion.tsx)**: Enlaces para solicitar whitepapers con descarga controlada para correos corporativos.
* **[Admision.tsx](file:///Users/antoniosalazar/Documents/WEB-Concurso/PRUEBA%201/src/components/sections/Admision.tsx)**: Formulario de waitlist integrado directamente con MongoDB mediante Server Actions. Valida que el email no provenga de proveedores gratuitos (gmail, hotmail, etc.).

---

### 2. Modales e Interfaces de Usuario (`src/components/modals/`)
Estos archivos contienen la lógica y los formularios complejos que se abren como ventanas emergentes en la Landing Page, o como envolturas dentro de sus respectivas rutas individuales (DRY):

* **`ErpTcoCalculatorView.tsx`**: Calculadora financiera interactiva de TCO. Permite estimar costos de soporte, infraestructura y licencias a 10 años.
* **`CloudCostCalculatorView.tsx`**: Comparador financiero de infraestructura en la nube (OCI virtual machines, BYOL y costos de transferencia de salida) versus AWS, Azure y Google Cloud.
* **`DiagnosticoWizardView.tsx`**: Asistente de autodiagnóstico de 12 preguntas que calcula dinámicamente un puntaje de riesgo para implementaciones de ERP.
* **`OfficeHoursView.tsx`**: Agenda interactiva que calcula los próximos 5 días hábiles e integra la selección de horas y registro de sesiones.
* **`CasoApePlazasView.tsx` y `CasoAplazoView.tsx`**: Desglose de arquitectura técnica de remediación e implementaciones SAT/Fintech.
* **`DoctrinaView.tsx`**: Detalle extendido de las garantías operativas.
* **`TransparenciaView.tsx`**: Manual de verificación metodológica de logs de integración.

---

### 3. Backend e Integración de Datos (`src/lib/` & `src/app/actions/`)
* **`src/lib/mongodb.ts`**: Utiliza un patrón singleton global en desarrollo para evitar agotar el pool de conexiones de MongoDB tras recargas calientes de código de Next.js (Fast Refresh).
* **`src/lib/models.ts`**: Define los esquemas de Mongoose para la recolección de datos:
  - `Lead`: Registro de waitlist y descargas.
  - `Assessment`: Respuestas detalladas del test de diagnóstico e indicador de nivel de riesgo.
  - `Booking`: Agenda de sesiones Office Hours con fecha y bloque horario.
  - `Settings`: Almacena la configuración dinámica del prompt de ChatGPT (System Prompt), la base de conocimiento local (Local Knowledge) de FabricSoft, la temperatura, el modelo utilizado, y la URL de webhooks para Slack.
* **`src/app/actions/auth.ts`**: Lógica de verificación de credenciales de administrador y administración de cookies de sesión HTTP-only seguras.
* **`src/app/actions/dashboard.ts`**: Recuperación de estadísticas globales, listado de solicitudes, eliminación de registros, y guardado/carga del prompt del sistema, conocimiento local y webhook.
* **`src/app/actions/leads.ts`**: Acciones del servidor para persistir leads, diagnósticos y agendamientos en la base de datos, despachando correos automáticos usando **Resend** y notificaciones a Slack/Discord si hay un Webhook activo.
* **`src/app/actions/chat.ts`**: Consulta a la API de OpenAI inyectando tanto el prompt de sistema personalizado como el bloque de conocimiento de FabricSoft cargados desde MongoDB. Si no hay base de datos o están vacíos, recae sobre el prompt inmutable por defecto.

---

### 4. Estilos y Configuración Global (`src/app/`)
* **`globals.css`**: Configuración de Tailwind CSS v4, declaración de fuentes personalizadas y estilos globales para efectos de vidrio (glassmorphism), botones dorados con bordes animados (`btn-primary-accent`) e indicaciones de navegación.
* **`layout.tsx`**: Establece las variables de CSS para tipografías de Google Fonts (`Cormorant Garamond` para encabezados elegantes, `Inter` para texto base y `JetBrains Mono` para elementos técnicos).
* **`page.tsx`**: Envoltura principal de la Landing Page. Implementa:
  - Un indicador dinámico de barra de progreso superior.
  - Un menú lateral de navegación por puntos (Scrollspy) calibrado responsivamente.
  - El observador de intersección (`IntersectionObserver`) que ejecuta animaciones suaves al hacer scroll.
  - El manejador centralizado de modales superpuestos de la landing page.
* **`login/page.tsx`**: Portal de acceso administrativo. Cuenta con una tarjeta con efecto de vidrio esmerilado, toggle para mostrar/ocultar contraseña, y control de estados de carga al verificar sesión con cookies seguras.
* **`dashboard/page.tsx`**: Panel de control administrativo premium de 5 pestañas:
  - **Inicio**: Gráficos de telemetría SVG interactivos para leads y tests con filtros de visualización, barras de distribución de escenarios y severidad de riesgo, y flujo de actividad en tiempo real.
  - **Clientes & Tests**: Buscador avanzado de registros de waitlist y diagnósticos detallados, permitiendo inspeccionar respuestas específicas de auditoría a través de un modal popup HUD y borrar entradas obsoletas.
  - **Reuniones**: Lista de cancelaciones e información detallada de citas agendadas de Office Hours.
  - **Cerebro IA**: Editor interactivo doble para el Prompt del Sistema (ChatGPT Core) y el Conocimiento Local de FabricSoft, selector de modelos GPT, deslizador de temperatura (creatividad), diagrama visual de apilamiento de contexto, y terminal interactiva de simulación en tiempo real.
  - **Integraciones**: Indicadores visuales de estado de conexión (MongoDB, OpenAI, Resend) y configurador de Slack Webhook para alertas en tiempo real.

---

## 🛠️ Instrucciones de Desarrollo y Construcción

### Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto con las siguientes claves:

```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/fabric
OPENAI_API_KEY=sk-proj-xxxx...
RESEND_API_KEY=re_xxxx...
ADMIN_USER=admin
ADMIN_PASS=fabric2026!
```

### Comandos de Ejecución
* **Modo Desarrollo**:
  ```bash
  npm run dev
  ```
* **Compilación de Producción**:
  ```bash
  npm run build
  ```
* **Iniciar Servidor en Producción**:
  ```bash
  npm run start
  ```
