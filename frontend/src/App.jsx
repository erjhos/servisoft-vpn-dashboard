import { useState, useEffect } from 'react';
import { BarChart3, Wifi, Activity, Route, FileText, LogOut, Plus, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [tunnels, setTunnels] = useState([]);
  const [bgpRoutes, setBgpRoutes] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    origen: 'AWS',
    destino: 'Azure',
    encriptacion: 'AES-256'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const tunnelsRes = await fetch('http://localhost:5000/api/vpn-tunnels');
      const metricsRes = await fetch('http://localhost:5000/api/metrics');
      const bgpRes = await fetch('http://localhost:5000/api/bgp-routes');
      
      setTunnels(await tunnelsRes.json());
      setStats(await metricsRes.json());
      setBgpRoutes(await bgpRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@servisoft.com', password: 'password' })
      });
      const data = await loginRes.json();
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handleAddTunnel = async () => {
    if (!formData.nombre) {
      alert('Por favor ingresa un nombre para el túnel');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/vpn-tunnels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ nombre: '', origen: 'AWS', destino: 'Azure', encriptacion: 'AES-256' });
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error adding tunnel:', error);
    }
  };

  const handleDeleteTunnel = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vpn-tunnels/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting tunnel:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>🔐 ServiSoft VPN</h1>
            <p>Sistema de Gestión Multicloud</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" defaultValue="admin@servisoft.com" />
            <input type="password" placeholder="Contraseña" defaultValue="demo" />
            <button type="submit">Iniciar Sesión</button>
          </form>
          <p className="demo-text">Demo: usa cualquier email y contraseña</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>ServiSoft VPN</h1>
          <p>Multicloud Manager</p>
        </div>

        <nav className="sidebar-nav">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={currentPage === 'dashboard' ? 'active' : ''}
          >
            <BarChart3 size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('tunnels')}
            className={currentPage === 'tunnels' ? 'active' : ''}
          >
            <Wifi size={20} /> Túneles VPN
          </button>
          <button 
            onClick={() => setCurrentPage('metrics')}
            className={currentPage === 'metrics' ? 'active' : ''}
          >
            <Activity size={20} /> Métricas
          </button>
          <button 
            onClick={() => setCurrentPage('bgp')}
            className={currentPage === 'bgp' ? 'active' : ''}
          >
            <Route size={20} /> Rutas BGP
          </button>
          <button 
            onClick={() => setCurrentPage('reports')}
            className={currentPage === 'reports' ? 'active' : ''}
          >
            <FileText size={20} /> Reportes
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <div>
            <h1>📊 Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="icon">📊</span>
                <div>
                  <p>Túneles Totales</p>
                  <h2>{stats.total || 0}</h2>
                </div>
              </div>
              <div className="stat-card">
                <span className="icon">✅</span>
                <div>
                  <p>Activos</p>
                  <h2>{stats.activos || 0}</h2>
                </div>
              </div>
              <div className="stat-card">
                <span className="icon">⏸️</span>
                <div>
                  <p>Inactivos</p>
                  <h2>{stats.inactivos || 0}</h2>
                </div>
              </div>
              <div className="stat-card">
                <span className="icon">❌</span>
                <div>
                  <p>Errores</p>
                  <h2>{stats.errores || 0}</h2>
                </div>
              </div>
            </div>

            <div className="table-container">
              <h2>Estado de Túneles VPN</h2>
              <table>
                <thead>
                  <tr>
                    <th>Túnel</th>
                    <th>Conexión</th>
                    <th>Estado</th>
                    <th>Latencia (ms)</th>
                    <th>Disponibilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {tunnels.map(tunnel => (
                    <tr key={tunnel.id}>
                      <td><strong>{tunnel.nombre}</strong></td>
                      <td>{tunnel.origen.proveedor} → {tunnel.destino.proveedor}</td>
                      <td><span className={`badge ${tunnel.estado}`}>{tunnel.estado}</span></td>
                      <td>{tunnel.latencia_ms} ms</td>
                      <td>{tunnel.disponibilidad_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentPage === 'tunnels' && (
          <div>
            <div className="page-header">
              <h1>🔗 Gestión de Túneles VPN</h1>
              <button 
                className="btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus size={20} /> Nuevo Túnel
              </button>
            </div>

            {showForm && (
              <div className="form-container">
                <h3>Crear Nuevo Túnel VPN</h3>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Nombre del túnel (ej: AWS-Azure)"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div className="form-grid">
                  <select
                    value={formData.origen}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                  >
                    <option>AWS</option>
                    <option>Azure</option>
                    <option>GCP</option>
                  </select>
                  <select
                    value={formData.destino}
                    onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  >
                    <option>Azure</option>
                    <option>AWS</option>
                    <option>GCP</option>
                  </select>
                  <select
                    value={formData.encriptacion}
                    onChange={(e) => setFormData({ ...formData, encriptacion: e.target.value })}
                  >
                    <option>AES-128</option>
                    <option>AES-192</option>
                    <option>AES-256</option>
                  </select>
                </div>
                <div className="form-buttons">
                  <button className="btn-success" onClick={handleAddTunnel}>Crear Túnel</button>
                  <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
              </div>
            )}

            <div className="tunnel-cards">
              {tunnels.map(tunnel => (
                <div key={tunnel.id} className="tunnel-card">
                  <div className="tunnel-header">
                    <h3>{tunnel.nombre}</h3>
                    <span className={`badge ${tunnel.estado}`}>{tunnel.estado}</span>
                  </div>
                  <div className="tunnel-content">
                    <p><strong>Conexión:</strong> {tunnel.origen.proveedor} → {tunnel.destino.proveedor}</p>
                    <p><strong>Protocolo:</strong> {tunnel.protocolo}</p>
                    <p><strong>Encriptación:</strong> {tunnel.encriptacion}</p>
                    <p><strong>Latencia:</strong> {tunnel.latencia_ms} ms</p>
                    <p><strong>Disponibilidad:</strong> {tunnel.disponibilidad_pct}%</p>
                  </div>
                  <div className="tunnel-actions">
                    <button className="btn-edit"><Edit2 size={18} /></button>
                    <button className="btn-delete" onClick={() => handleDeleteTunnel(tunnel.id)}><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'metrics' && (
          <div>
            <h1>📈 Métricas de Desempeño</h1>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Latencia Promedio</h3>
                <p className="metric-value">{stats.latenciaPromedio || '0'} ms</p>
              </div>
              <div className="metric-card">
                <h3>Disponibilidad Promedio</h3>
                <p className="metric-value">{stats.disponibilidadPromedio || '0'}%</p>
              </div>
              <div className="metric-card">
                <h3>Ancho de Banda Utilizado</h3>
                <p className="metric-value">78%</p>
              </div>
              <div className="metric-card">
                <h3>Paquetes Perdidos</h3>
                <p className="metric-value">0.01%</p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'bgp' && (
          <div>
            <h1>🌐 Rutas BGP</h1>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Destino</th>
                    <th>ASN</th>
                    <th>Proveedor</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bgpRoutes.map(route => (
                    <tr key={route.id}>
                      <td><code>{route.destino}</code></td>
                      <td>{route.asn}</td>
                      <td>{route.proveedor}</td>
                      <td><span className="badge establecido">{route.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentPage === 'reports' && (
          <div>
            <h1>📋 Reportes</h1>
            <div className="report-container">
              <h2>Resumen de Rendimiento - Últimas 24 horas</h2>
              <div className="report-content">
                <p><strong>Túneles Analizados:</strong> {tunnels.length}</p>
                <p><strong>Disponibilidad Promedio:</strong> {stats.disponibilidadPromedio || '0'}%</p>
                <p><strong>Latencia Máxima:</strong> {Math.max(...tunnels.map(t => t.latencia_ms), 0)} ms</p>
                <p><strong>Eventos Críticos:</strong> 0</p>
                <p><strong>Eventos de Advertencia:</strong> 1</p>
              </div>
              <button className="btn-primary">📥 Descargar Reporte PDF</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
