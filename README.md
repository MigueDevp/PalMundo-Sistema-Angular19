<h1 align="center">🌍 <b>PAL MUNDO</b> - Sistema de Gestión y Logística de Contratos y Servicios</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19.2.11-DD0031?logo=angular&logoColor=white" alt="Angular Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/Estado-En%20Desarrollo-green" alt="Status Badge"/>
  <img src="https://img.shields.io/badge/Licencia-MIT-yellow" alt="License Badge"/>
</p>

---

<h2>🧭 Descripción General</h2>

<p align="justify">
<b>PAL MUNDO</b> es un sistema integral desarrollado en <b>Angular</b> para la <b>gestión, control y logística de contratos y servicios turísticos</b>.  
Su propósito es <b>automatizar la creación, seguimiento y administración de contratos de servicio</b>, optimizando los procesos de <b>ventas, reportes y control operativo</b> dentro de la empresa.
</p>

<p>
El sistema permite administrar tanto <b>viajes programados</b> como <b>servicios individuales</b>, tales como:
</p>

<p align="center">
🚗 Renta de autos · ✈️ Vuelos · 🏨 Hoteles · 🚢 Cruceros · 🛣️ Circuitos internacionales · 🚌 Charters carreteros · 📑 Trámites de visa
</p>

<p>
Cada servicio genera automáticamente un <b>contrato en formato PDF</b> con número de folio único, datos del cliente, información del servicio y cláusulas corporativas de la empresa.
</p>

---

<h2>⚙️ Funcionalidades Principales</h2>

<ul>
  <li>📋 <b>Gestión de clientes:</b> registro con datos personales, contacto y seguimiento.</li>
  <li>🧾 <b>Contratos de servicio:</b> generación automática en PDF con folio único.</li>
  <li>🧍‍♂️ <b>Pasajeros:</b> control y vinculación con cada contrato de viaje.</li>
  <li>💰 <b>Pagos y abonos:</b> seguimiento de anticipos, pagos parciales y saldos pendientes.</li>
  <li>🚌 <b>Gestión de transporte:</b> asignación de vehículos, choferes y control de capacidad.</li>
  <li>📆 <b>Reportes dinámicos:</b> ventas diarias, dinero recaudado y pasajeros deudores.</li>
  <li>🔔 <b>Notificaciones automáticas:</b> alertas sobre viajes próximos o baja ocupación.</li>
  <li>📊 <b>Indicadores de desempeño (KPI):</b> monitoreo visual en tiempo real de ventas y montos generados.</li>
</ul>

---

<h2>🧩 Módulos del Sistema</h2>

<table>
  <tr>
    <th>#</th>
    <th>Módulo</th>
    <th>Descripción</th>
  </tr>
  <tr><td>1</td><td>👤 <b>Clientes</b></td><td>Gestión completa de clientes y sus contratos asociados.</td></tr>
  <tr><td>2</td><td>🌍 <b>Viajes</b></td><td>Creación y administración de viajes turísticos programados.</td></tr>
  <tr><td>3</td><td>📚 <b>Catálogo de Viajes</b></td><td>Publicación, edición y control de disponibilidad de viajes.</td></tr>
  <tr><td>4</td><td>💼 <b>Ventas</b></td><td>Registro de contratos, generación PDF y control de anticipos.</td></tr>
  <tr><td>5</td><td>🚐 <b>Transporte</b></td><td>Administración de unidades, choferes y su disponibilidad.</td></tr>
  <tr><td>6</td><td>📈 <b>Reportes</b></td><td>Reportes PDF de ventas, recaudaciones y pasajeros.</td></tr>
  <tr><td>7</td><td>🚌 <b>Mis Transportes</b></td><td>Asignación y visualización de vehículos activos.</td></tr>
  <tr><td>8</td><td>💸 <b>Pagos</b></td><td>Registro y control de abonos de clientes.</td></tr>
  <tr><td>9</td><td>⚙️ <b>Administración</b></td><td>Consulta global de contratos, reportes y control administrativo.</td></tr>
</table>

---

<h2>📊 Reportes y Métricas</h2>

<ul>
  <li>💵 <b>Dinero recaudado por período:</b> resumen de ingresos por rango de fechas.</li>
  <li>📅 <b>Ventas por día:</b> cantidad de contratos y montos generados.</li>
  <li>👥 <b>Pasajeros por viaje:</b> control de ocupación y capacidad.</li>
  <li>🚨 <b>Pasajeros deudores:</b> seguimiento de pagos pendientes.</li>
</ul>

<p align="justify">
Todos los reportes se pueden visualizar y descargar en formato <b>PDF</b>, con filtros personalizables por fecha y tipo de servicio.
</p>

---

<h2>💻 Tecnologías Utilizadas</h2>

<table>
  <tr><th>Tecnología</th><th>Descripción</th></tr>
  <tr><td>🅰️ <b>Angular</b></td><td>Framework principal para la interfaz de usuario.</td></tr>
  <tr><td>🔷 <b>TypeScript</b></td><td>Lenguaje con tipado estático para mayor robustez.</td></tr>
  <tr><td>🧩 <b>HTML / CSS</b></td><td>Estructura visual y estilos responsivos.</td></tr>
  <tr><td>📄 <b>PDFMake / jsPDF</b></td><td>Generación dinámica de contratos y reportes.</td></tr>
  <tr><td>🔁 <b>RxJS</b></td><td>Manejo reactivo de datos y suscripciones.</td></tr>
  <tr><td>🎨 <b>Bootstrap / Tailwind</b></td><td>Diseño moderno, limpio y adaptable.</td></tr>
</table>

---

<h2>🚀 Instalación y Ejecución</h2>

<pre>
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
</pre>

---

<h3 align="center">💼 Desarrollado por Miguel A. Ramirez | <b>Grupo PAL MUNDO</b> | Departamento de Ingeniería de Software</h3>
<p align="center">© 2025 - Todos los derechos reservados.</p>