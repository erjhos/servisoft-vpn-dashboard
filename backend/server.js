const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// DATOS SIMULADOS (Para demostración)
// ============================================

const vpnTunnels = [
  {
    id: 1,
    nombre: 'AWS-Azure',
    estado: 'activo',
    origen: { proveedor: 'AWS', subnet: '10.0.0.0/16', ip_publica: '54.123.45.67' },
    destino: { proveedor: 'Azure', subnet: '172.16.0.0/16', ip_publica: '40.98.123.45' },
    protocolo: 'IPsec',
    encriptacion: 'AES-256',
    latencia_ms: 12,
    disponibilidad_pct: 99.8,
    ultimaActualizacion: new Date()
  },
  {
    id: 2,
    nombre: 'AWS-GCP',
    estado: 'activo',
    origen: { proveedor: 'AWS', subnet: '10.0.0.0/16', ip_publica: '54.123.45.67' },
    destino: { proveedor: 'GCP', subnet: '192.168.0.0/16', ip_publica: '35.201.123.45' },
    protocolo: 'IPsec',
    encriptacion: 'AES-256',
    latencia_ms: 8,
    disponibilidad_pct: 99.5,
    ultimaActualizacion: new Date()
  },
  {
    id: 3,
    nombre: 'Azure-GCP',
    estado: 'inactivo',
    origen: { proveedor: 'Azure', subnet: '172.16.0.0/16', ip_publica: '40.98.123.45' },
    destino: { proveedor: 'GCP', subnet: '192.168.0.0/16', ip_publica: '35.201.123.45' },
    protocolo: 'IPsec',
    encriptacion: 'AES-256',
    latencia_ms: 0,
    disponibilidad_pct: 0,
    ultimaActualizacion: new Date()
  }
];

const bgpRoutes = [
  { id: 1, destino: '10.0.0.0/16', asn: 65000, estado: 'establecido', proveedor: 'AWS', timestamp: new Date() },
  { id: 2, destino: '172.16.0.0/16', asn: 65001, estado: 'establecido', proveedor: 'Azure', timestamp: new Date() },
  { id: 3, destino: '192.168.0.0/16', asn: 65002, estado: 'establecido', proveedor: 'GCP', timestamp: new Date() }
];

const metrics = [
  { id: 1, tunnelId: 1, timestamp: new Date(), latencia: 12, jitter: 2, packetLoss: 0.01, throughput: 950 },
  { id: 2, tunnelId: 2, timestamp: new Date(), latencia: 8, jitter: 1, packetLoss: 0, throughput: 980 }
];

let usuarios = [
  { id: 1, nombre: 'Admin', email: 'admin@servisoft.com', password: 'password', rol: 'admin' }
];

// ============================================
// RUTAS - AUTENTICACIÓN
// ============================================

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Aceptar cualquier email y contraseña para demo
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzZXJ2aXNvZnQuY29tIiwicm9sIjoiYWRtaW4ifQ.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

    res.json({
      token,
      user: {
        id: 1,
        nombre: 'Admin',
        email: email || 'admin@servisoft.com',
        rol: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const newUser = {
      id: usuarios.length + 1,
      nombre,
      email,
      password,
      rol: rol || 'visualizador'
    };

    usuarios.push(newUser);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: newUser.id, nombre, email, rol: newUser.rol }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RUTAS - TÚNELES VPN
// ============================================

app.get('/api/vpn-tunnels', (req, res) => {
  res.json(vpnTunnels);
});

app.get('/api/vpn-tunnels/:id', (req, res) => {
  const tunnel = vpnTunnels.find(t => t.id === parseInt(req.params.id));
  if (!tunnel) return res.status(404).json({ error: 'Túnel no encontrado' });
  res.json(tunnel);
});

app.post('/api/vpn-tunnels', (req, res) => {
  try {
    const newTunnel = {
      id: vpnTunnels.length + 1,
      ...req.body,
      estado: 'inactivo',
      latencia_ms: 0,
      disponibilidad_pct: 0,
      ultimaActualizacion: new Date()
    };
    vpnTunnels.push(newTunnel);
    res.status(201).json(newTunnel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/vpn-tunnels/:id', (req, res) => {
  try {
    const tunnel = vpnTunnels.find(t => t.id === parseInt(req.params.id));
    if (!tunnel) return res.status(404).json({ error: 'Túnel no encontrado' });

    Object.assign(tunnel, req.body, { ultimaActualizacion: new Date() });
    res.json(tunnel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/vpn-tunnels/:id', (req, res) => {
  try {
    const index = vpnTunnels.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Túnel no encontrado' });

    const deleted = vpnTunnels.splice(index, 1);
    res.json({ message: 'Túnel eliminado', tunnel: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RUTAS - RUTAS BGP
// ============================================

app.get('/api/bgp-routes', (req, res) => {
  res.json(bgpRoutes);
});

app.post('/api/bgp-routes', (req, res) => {
  try {
    const newRoute = {
      id: bgpRoutes.length + 1,
      ...req.body,
      estado: 'establecido',
      timestamp: new Date()
    };
    bgpRoutes.push(newRoute);
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RUTAS - MÉTRICAS
// ============================================

app.get('/api/metrics', (req, res) => {
  const stats = {
    total: vpnTunnels.length,
    activos: vpnTunnels.filter(t => t.estado === 'activo').length,
    inactivos: vpnTunnels.filter(t => t.estado === 'inactivo').length,
    errores: vpnTunnels.filter(t => t.estado === 'error').length,
    latenciaPromedio: (vpnTunnels.reduce((sum, t) => sum + t.latencia_ms, 0) / vpnTunnels.length).toFixed(2),
    disponibilidadPromedio: (vpnTunnels.reduce((sum, t) => sum + t.disponibilidad_pct, 0) / vpnTunnels.length).toFixed(2)
  };
  res.json(stats);
});

app.get('/api/metrics/:tunnelId', (req, res) => {
  const tunnelMetrics = metrics.filter(m => m.tunnelId === parseInt(req.params.tunnelId));
  res.json(tunnelMetrics);
});

// ============================================
// RUTAS - REPORTES
// ============================================

app.get('/api/reports/summary', (req, res) => {
  res.json({
    periodo: 'Últimas 24 horas',
    tuneles_analizados: vpnTunnels.length,
    tiempo_activo_promedio: '99.7%',
    latencia_maxima: Math.max(...vpnTunnels.map(t => t.latencia_ms)) + ' ms',
    eventos_criticos: 0,
    eventos_advertencia: 1,
    timestamp: new Date()
  });
});

// ============================================
// RUTAS - SALUD DEL SERVIDOR
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/test', (req, res) => {
  res.json({ mensaje: '✓ Backend funcionando correctamente' });
});

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════╗`);
  console.log(`║  🚀 ServiSoft VPN Backend                  ║`);
  console.log(`║  📡 Escuchando en puerto ${PORT}                  ║`);
  console.log(`║  🌐 URL: http://localhost:${PORT}          ║`);
  console.log(`║  ✓ Todas las rutas disponibles             ║`);
  console.log(`╚════════════════════════════════════════════╝\n`);
});

module.exports = app;
