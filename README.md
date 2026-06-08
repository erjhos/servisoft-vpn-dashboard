# ServiSoft VPN Multicloud Dashboard

## 📋 Descripción

Aplicación web para la gestión y monitoreo de arquitectura VPN Site-to-Site en entorno Multicloud.

Integra Amazon Web Services (AWS), Microsoft Azure y Google Cloud Platform (GCP) mediante túneles VPN IPsec con protocolo de enrutamiento dinámico BGP.

## 👥 Equipo

- **Yomali Crisol Jarquin Velásquez** (2104-4539)
- **Kathy Esmeralda Espinoza Gómez** (2104-9445)
- **Ervin Antonio Chavarría Canales** (2104-2526)

**Carrera:** Ingeniería en Telemática  
**Tutor:** Yamil Durán  
**Año:** 2026

## 🚀 Inicio Rápido

### Requisitos

- Node.js v16+ (https://nodejs.org/)
- npm v7+
- Git

### Instalación

#### 1. Clonar repositorio

```bash
git clone https://github.com/erjhos/servisoft-vpn-dashboard.git
cd servisoft-vpn-dashboard
```

#### 2. Backend

```bash
cd backend
npm install
npm run dev
```

El backend estará disponible en: `http://localhost:5000`

#### 3. Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
servisoft-vpn-dashboard/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── VpnTunnel.js
│   │   └── Metric.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vpnTunnels.js
│   │   ├── metrics.js
│   │   ├── bgpRoutes.js
│   │   └── reports.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- MongoDB
- JWT Authentication
- Mongoose ORM

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- React Router

## 📊 Características

✅ Dashboard de monitoreo en tiempo real  
✅ Gestión de túneles VPN  
✅ Visualización de métricas  
✅ Rutas BGP  
✅ Generación de reportes  
✅ Autenticación JWT  
✅ Sistema de roles  

## 🔐 Credenciales Demo

**Email:** admin@servisoft.com  
**Contraseña:** cualquiera

## 📝 Cronograma

- **Fase 1** (01/03 - 29/03): Análisis y diseño
- **Fase 2** (01/04 - 28/04): Configuración y implementación
- **Fase 3** (01/05 - 29/05): Pruebas y validación
- **Fase 4** (01/06 - 20/06): Documentación y defensa

## 📞 Contacto

Tutor: Yamil Durán  
Email: yamil.duran@unan.edu.ni  
Teléfono: 8722-2063
