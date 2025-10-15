<h1 align="center">🌍 PAL MUNDO - Sistema de Gestión y Logística de Contratos y Servicios</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19.2.11-DD0031?logo=angular&logoColor=white" alt="Angular Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/Estado-En%20Desarrollo-green" alt="Status Badge"/>
  <img src="https://img.shields.io/badge/Licencia-MIT-yellow" alt="License Badge"/>
</p>

---

<h2>🧭 Descripción General</h2>

**PAL MUNDO** es un sistema integral desarrollado en **Angular** para la **gestión, control y logística de contratos y servicios turísticos**.  
Su propósito es **automatizar la creación, seguimiento y administración de contratos de servicio**, optimizando los procesos de **ventas, reportes y control operativo** dentro de la empresa.

El sistema permite manejar tanto **viajes programados** como **servicios individuales** tales como:
🚗 Renta de autos · ✈️ Vuelos · 🏨 Hoteles · 🚢 Cruceros · 🛣️ Circuitos internacionales · 🚌 Charters carreteros · 📑 Trámites de visa

Cada servicio genera automáticamente un **contrato en formato PDF**, con número de folio único, datos del cliente, información del servicio y cláusulas de la empresa.

---

<h2>⚙️ Funcionalidades Principales</h2>

<ul>
  <li>📋 <b>Gestión de clientes:</b> registro con datos personales, contacto y seguimiento.</li>
  <li>🧾 <b>Contratos de servicio:</b> generación automática en PDF con folio único.</li>
  <li>🧍‍♂️ <b>Pasajeros:</b> control de pasajeros asociados a cada viaje.</li>
  <li>💰 <b>Pagos y abonos:</b> seguimiento de anticipos, pagos parciales y saldos pendientes.</li>
  <li>🚌 <b>Gestión de transporte:</b> asignación de vehículos, choferes y capacidad por viaje.</li>
  <li>📆 <b>Reportes dinámicos:</b> ventas diarias, dinero recaudado, pasajeros deudores y viajes programados.</li>
  <li>🔔 <b>Notificaciones automáticas:</b> alertas de baja ocupación o viajes próximos.</li>
  <li>📊 <b>KPI de ventas:</b> visualización en tiempo real de contratos y montos generados por día.</li>
</ul>

---

<h2>🧩 Módulos del Sistema</h2>

| # | Módulo | Descripción |
|---|---------|-------------|
| 1 | **Clientes** | Gestión de información de clientes y sus contratos asociados. |
| 2 | **Viajes** | Creación y administración de viajes turísticos. |
| 3 | **Catálogo de Viajes** | Publicación y mantenimiento de viajes programados. |
| 4 | **Ventas** | Registro de contratos, generación de PDFs y control de anticipos. |
| 5 | **Transporte** | Administración de vehículos, choferes y disponibilidad. |
| 6 | **Reportes** | Reportes PDF de ventas, recaudaciones y pasajeros. |
| 7 | **Mis Transportes** | Asignación y visualización de unidades activas. |
| 8 | **Pagos** | Registro y control de abonos de clientes. |
| 9 | **Administración** | Consulta global de contratos y control administrativo. |

---

<h2>🏗️ Arquitectura del Sistema</h2>

El sistema se basa en una arquitectura modular y relacional que permite escalabilidad y consistencia en los datos.

**Entidades Principales:**
- 🧍 CLIENTES  
- 🌎 VIAJES  
- 🚐 TRANSPORTES  
- 📑 CONTRATOS  
- 💸 PAGOS  
- 🧳 PASAJEROS  
- 📦 TIPOS_SERVICIO  

<h2>📊 Reportes y Métricas</h2>

<ul>
  <li>💵 <b>Dinero recaudado por período:</b> suma de anticipos y pagos en un rango de fechas.</li>
  <li>📅 <b>Ventas por día:</b> contratos generados y total de ingresos diarios.</li>
  <li>👥 <b>Pasajeros por viaje:</b> control de ocupación y capacidad.</li>
  <li>🚨 <b>Pasajeros deudores:</b> clientes con pagos pendientes después de la fecha límite.</li>
</ul>

Los reportes pueden visualizarse y descargarse en formato **PDF**, con filtros de fechas personalizables.

---

<h2>💻 Tecnologías Utilizadas</h2>

| Tecnología | Descripción |
|-------------|-------------|
| **Angular** | Framework principal para la interfaz de usuario. |
| **TypeScript** | Tipado estático y robustez en el código. |
| **HTML / CSS** | Estructura y estilos responsivos. |
| **PDFMake / jsPDF** | Generación de contratos y reportes PDF. |
| **RxJS** | Manejo reactivo de datos y suscripciones. |
| **Bootstrap / Tailwind** | Diseño limpio y adaptable. |

---

<h2>🚀 Instalación y Ejecución</h2>

```bash
# Clonar el repositorio
git clone https://github.com/usuario/palmundo.git

# Entrar al proyecto
cd palmundo

# Instalar dependencias
npm install

# Ejecutar en entorno de desarrollo
ng serve

# Abrir en el navegador
http://localhost:4200/
