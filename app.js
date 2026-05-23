// ============================================================
//  SecuritasPRO — app.js  v2.4.1
//  Sistema de Gestión de Seguridad Privada
// ============================================================

// ── DATA STORE ──────────────────────────────────────────────
const DB = {
  company: "Seguridad Total S.A.",
  currentUser: null,
  selectedPriority: 'low',
  currentChat: null,
  map: null,
  mapMarkers: {},
  watchId: null,
  reports: [],
  inventory: [],
  messages: {},

  users: [
    { id:'admin', pass:'admin123', role:'Supervisor', name:'Carlos Andrade', lastName:'Morales', cedula:'1234567890', phone:'+57 300 123 4567', email:'c.andrade@securitas.co', shift:'mañana', status:'online', entry:'06:00', exit:'14:00', post:'Central de Monitoreo', lat:4.7110, lng:-74.0721, avatar:'https://i.pravatar.cc/80?img=11' },
    { id:'AG-001', pass:'123456', role:'Guardia', name:'Juan', lastName:'Pérez García', cedula:'9876543210', phone:'+57 311 222 3344', email:'j.perez@securitas.co', shift:'mañana', status:'online', entry:'06:00', exit:'14:00', post:'Entrada Principal', lat:4.7115, lng:-74.0730, avatar:'https://i.pravatar.cc/80?img=1' },
    { id:'AG-002', pass:'123456', role:'Guardia', name:'María', lastName:'López Torres', cedula:'1122334455', phone:'+57 312 333 4455', email:'m.lopez@securitas.co', shift:'tarde', status:'online', entry:'14:00', exit:'22:00', post:'Parqueadero Norte', lat:4.7105, lng:-74.0718, avatar:'https://i.pravatar.cc/80?img=5' },
    { id:'AG-003', pass:'123456', role:'Guardia', name:'Luis', lastName:'Martínez Cruz', cedula:'5544332211', phone:'+57 313 444 5566', email:'l.martinez@securitas.co', shift:'noche', status:'offline', entry:'22:00', exit:'06:00', post:'Torre B — Lobby', lat:4.7120, lng:-74.0725, avatar:'https://i.pravatar.cc/80?img=3' },
    { id:'AG-004', pass:'123456', role:'Guardia', name:'Ana', lastName:'Rodríguez Díaz', cedula:'6677889900', phone:'+57 314 555 6677', email:'a.rodriguez@securitas.co', shift:'tarde', status:'online', entry:'14:00', exit:'22:00', post:'Acceso Empleados', lat:4.7108, lng:-74.0712, avatar:'https://i.pravatar.cc/80?img=9' },
    { id:'AG-005', pass:'123456', role:'Guardia', name:'Pedro', lastName:'Gómez Vargas', cedula:'9900112233', phone:'+57 315 666 7788', email:'p.gomez@securitas.co', shift:'mañana', status:'online', entry:'06:00', exit:'14:00', post:'Bodega Central', lat:4.7130, lng:-74.0735, avatar:'https://i.pravatar.cc/80?img=7' },
    { id:'AG-006', pass:'123456', role:'Guardia', name:'Sandra', lastName:'Castro Ríos', cedula:'2233445566', phone:'+57 316 777 8899', email:'s.castro@securitas.co', shift:'noche', status:'online', entry:'22:00', exit:'06:00', post:'Zona de Carga', lat:4.7100, lng:-74.0740, avatar:'https://i.pravatar.cc/80?img=10' },
    { id:'AG-007', pass:'123456', role:'Jefe de Grupo', name:'Roberto', lastName:'Herrera Mendoza', cedula:'3344556677', phone:'+57 317 888 9900', email:'r.herrera@securitas.co', shift:'libre', status:'offline', entry:'—', exit:'—', post:'—', lat:4.7095, lng:-74.0705, avatar:'https://i.pravatar.cc/80?img=12' },
    { id:'AG-008', pass:'123456', role:'Guardia', name:'Patricia', lastName:'Moreno Silva', cedula:'4455667788', phone:'+57 318 999 0011', email:'p.moreno@securitas.co', shift:'mañana', status:'offline', entry:'06:00', exit:'14:00', post:'Sala de Servidores', lat:4.7125, lng:-74.0728, avatar:'https://i.pravatar.cc/80?img=6' },
    { id:'AG-009', pass:'123456', role:'Guardia', name:'Diego', lastName:'Álvarez Pinto', cedula:'5566778899', phone:'+57 319 000 1122', email:'d.alvarez@securitas.co', shift:'tarde', status:'online', entry:'14:00', exit:'22:00', post:'Recepción Sur', lat:4.7112, lng:-74.0715, avatar:'https://i.pravatar.cc/80?img=4' },
  ],

  inventoryData: [
    { id:1, name:'Radio Motorola DP4801e', qty:8, status:'Operativo', icon:'fa-walkie-talkie', responsible:'Carlos Andrade' },
    { id:2, name:'Linterna Táctica', qty:10, status:'Operativo', icon:'fa-flashlight', responsible:'Carlos Andrade' },
    { id:3, name:'Chaleco Reflectivo', qty:12, status:'Operativo', icon:'fa-vest', responsible:'Carlos Andrade' },
    { id:4, name:'Handy Backup', qty:2, status:'En Reparación', icon:'fa-walkie-talkie', responsible:'AG-007' },
    { id:5, name:'Cámara de Cuerpo', qty:5, status:'Operativo', icon:'fa-camera', responsible:'Carlos Andrade' },
    { id:6, name:'Detector de Metales', qty:3, status:'Operativo', icon:'fa-wand-magic-sparkles', responsible:'AG-001' },
    { id:7, name:'Esposa de Seguridad', qty:6, status:'Operativo', icon:'fa-link', responsible:'Carlos Andrade' },
    { id:8, name:'Tolete / Bastón', qty:8, status:'Operativo', icon:'fa-baseball-bat-ball', responsible:'Carlos Andrade' },
  ],

  reportsData: [
    { id:1, type:'Ronda de Inspección', desc:'Ronda completada sin novedades. Todas las áreas revisadas.', priority:'low', agent:'Juan Pérez García', post:'Entrada Principal', time:'08:30', date:'2026-05-22', supervisor:'Carlos Andrade' },
    { id:2, type:'Acceso No Autorizado', desc:'Persona sin identificación intentó ingresar por acceso de empleados. Fue retirada del lugar.', priority:'high', agent:'Ana Rodríguez Díaz', post:'Acceso Empleados', time:'10:15', date:'2026-05-22', supervisor:'Carlos Andrade' },
    { id:3, type:'Novedad Rutinaria', desc:'Relevo de turno efectuado correctamente. Sin novedades pendientes.', priority:'low', agent:'Pedro Gómez Vargas', post:'Bodega Central', time:'14:02', date:'2026-05-22', supervisor:'Carlos Andrade' },
    { id:4, type:'Alarma Activada', desc:'Alarma de sensor en zona B disparada. Revisada — falsa alarma por viento.', priority:'medium', agent:'María López Torres', post:'Parqueadero Norte', time:'15:45', date:'2026-05-22', supervisor:'Carlos Andrade' },
  ],

  chatData: [
    { userId:'AG-001', msgs:[
      { from:'AG-001', text:'Turno de mañana sin novedades hasta ahora.', time:'08:05', type:'text' },
      { from:'me', text:'Recibido. Mantente alerta en la entrada.', time:'08:07', type:'text' },
    ]},
    { userId:'AG-002', msgs:[
      { from:'AG-002', text:'Relevo recibido correctamente.', time:'14:01', type:'text' },
    ]},
    { userId:'AG-004', msgs:[
      { from:'AG-004', text:'Hay una persona sospechosa en zona sur.', time:'16:30', type:'text' },
      { from:'AG-004', text:'Ya se alejó del área, sin incidentes.', time:'16:35', type:'text' },
      { from:'me', text:'Ok, documenta el incidente en el reporte.', time:'16:36', type:'text' },
    ]},
  ],

  scheduleData: {
    days: ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'],
    schedule: [
      { name:'Juan Pérez',    shifts:['mañana','mañana','mañana','mañana','mañana','libre','libre'] },
      { name:'María López',   shifts:['tarde','tarde','tarde','tarde','tarde','tarde','libre'] },
      { name:'Luis Martínez', shifts:['noche','noche','noche','noche','libre','libre','noche'] },
      { name:'Ana Rodríguez', shifts:['libre','tarde','tarde','tarde','tarde','tarde','tarde'] },
      { name:'Pedro Gómez',   shifts:['mañana','mañana','libre','mañana','mañana','mañana','libre'] },
      { name:'Sandra Castro', shifts:['noche','libre','noche','noche','noche','noche','noche'] },
      { name:'Roberto Herrera',shifts:['libre','libre','mañana','mañana','tarde','tarde','libre'] },
      { name:'Patricia Moreno',shifts:['mañana','mañana','mañana','libre','mañana','libre','libre'] },
      { name:'Diego Álvarez',  shifts:['tarde','tarde','libre','tarde','tarde','tarde','tarde'] },
    ]
  }
};

// ── UTILITIES ────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const now = () => new Date();
const pad = n => String(n).padStart(2,'0');
const timeStr = () => `${pad(now().getHours())}:${pad(now().getMinutes())}`;
const dateStr = () => now().toISOString().split('T')[0];

function showToast(msg, type='info') {
  const t = $('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(t._t);
  t._t = setTimeout(()=>t.className='', 2800);
}

// ── CLOCK ────────────────────────────────────────────────────
function startClock() {
  const tick = () => {
    const d = new Date();
    $('clockTop').textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    $('dashDate').textContent = `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]} ${d.getFullYear()} — Punto: Centro Comercial Norte`;
  };
  tick();
  setInterval(tick, 1000);
}

// ── NETWORK DETECTION ────────────────────────────────────────
function initNetwork() {
  const update = () => {
    const online = navigator.onLine;
    $('netDot').className = `net-dot ${online?'online':'offline'}`;
    $('netLabel').textContent = online ? 'ONLINE' : 'OFFLINE';
    $('networkBar').className = online ? '' : 'offline';
    $('loginNetStatus').style.color = online ? 'var(--online)' : 'var(--danger)';
    $('loginNetStatus').textContent = online ? '● ONLINE' : '● OFFLINE';

    const mob = $('offlineBannerMain');
    if (mob) mob.style.display = online ? 'none' : 'block';

    // Simulate signal strength
    const bars = document.querySelectorAll('.sig-bar');
    const strength = online ? (Math.random() > 0.3 ? 4 : 3) : 0;
    bars.forEach((b, i) => b.classList.toggle('active', i < strength));

    // Try to detect wifi vs data (limited by browser)
    if (online && navigator.connection) {
      const conn = navigator.connection;
      const type = conn.effectiveType || conn.type || '';
      $('netLabel').textContent = type.includes('wifi') || type==='wifi' ? '📶 WiFi' : type ? `📡 ${type.toUpperCase()}` : 'ONLINE';
    }
  };
  window.addEventListener('online', () => { update(); showToast('✓ Conexión restaurada','success'); });
  window.addEventListener('offline', () => { update(); showToast('⚠ Sin conexión — Modo Offline','error'); });
  if (navigator.connection) navigator.connection.addEventListener('change', update);
  update();
  setInterval(update, 5000);
}

// ── AUTH ─────────────────────────────────────────────────────
function switchAuth(type) {
  document.querySelectorAll('.auth-tab').forEach((t,i)=> {
    const types = ['biometric','face','password'];
    t.classList.toggle('active', types[i]===type);
  });
  ['authBiometric','authFace','authPassword'].forEach(id => {
    $(id).classList.toggle('active', id===`auth${type.charAt(0).toUpperCase()+type.slice(1)}`);
  });
}

function setStatusMsg(id, msg, type) {
  const el = $(id);
  el.textContent = msg;
  el.className = `status-msg show ${type}`;
  setTimeout(()=> el.className='status-msg', 3000);
}

// Biometric — uses WebAuthn if available, else simulates
async function startFingerprint() {
  const btn = $('fingerprintBtn');
  btn.classList.add('scanning');
  setStatusMsg('fpStatus','Escaneando huella dactilar...','info');

  if (window.PublicKeyCredential) {
    try {
      // Quick availability check
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (available) {
        setStatusMsg('fpStatus','Usa el sensor biométrico del dispositivo','info');
        // Simulate WebAuthn get assertion
        setTimeout(()=>{ loginSuccess('AG-001'); }, 2000);
        return;
      }
    } catch(e) {}
  }
  // Fallback simulation
  setTimeout(()=>{
    btn.classList.remove('scanning');
    setStatusMsg('fpStatus','✓ Huella verificada — Acceso concedido','success');
    setTimeout(()=> loginSuccess('AG-001'), 800);
  }, 2500);
}

// Face recognition — uses camera
let faceStream = null;
async function startFaceScan() {
  const container = $('faceScanContainer');
  const video = $('faceVideo');
  const overlay = $('faceScanOverlay');
  setStatusMsg('faceStatus','Activando cámara...','info');
  try {
    faceStream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'user', width:200, height:200 } });
    video.srcObject = faceStream;
    overlay.style.display = 'none';
    container.classList.add('scanning');
    setStatusMsg('faceStatus','Analizando rostro... Mantén la vista al frente','info');
    setTimeout(()=>{
      container.classList.remove('scanning');
      setStatusMsg('faceStatus','✓ Rostro reconocido — Acceso concedido','success');
      if(faceStream){ faceStream.getTracks().forEach(t=>t.stop()); faceStream=null; }
      setTimeout(()=> loginSuccess('admin'), 800);
    }, 3500);
  } catch(e) {
    setStatusMsg('faceStatus','❌ Cámara no disponible — Usa otro método','error');
    overlay.style.display = 'flex';
  }
}

function quickLogin() {
  const id = $('agentIdQuick').value.trim().toUpperCase();
  const user = DB.users.find(u => u.id===id || u.id===id.replace('AG-','AG-'));
  if (user) { loginSuccess(user.id); }
  else { setStatusMsg('fpStatus','ID no encontrado en el sistema','error'); }
}

function doLogin() {
  const user = $('loginUser').value.trim().toUpperCase();
  const pass = $('loginPass').value;
  const found = DB.users.find(u => (u.id===user || u.id.toLowerCase()===user.toLowerCase()) && u.pass===pass);
  if (found) { loginSuccess(found.id); }
  else { setStatusMsg('passStatus','❌ Credenciales incorrectas','error'); }
}

function loginSuccess(userId) {
  DB.currentUser = DB.users.find(u => u.id===userId) || DB.users[0];
  DB.currentUser.status = 'online';
  $('loginScreen').classList.remove('active');
  $('mainScreen').classList.add('active');
  initMainApp();
  showToast(`✓ Bienvenido, ${DB.currentUser.name}`,'success');
}

function doLogout() {
  if(DB.currentUser) DB.currentUser.status = 'offline';
  DB.currentUser = null;
  if(DB.watchId) navigator.geolocation.clearWatch(DB.watchId);
  $('mainScreen').classList.remove('active');
  $('loginScreen').classList.add('active');
  showToast('Sesión cerrada','info');
}

// ── MAIN APP INIT ────────────────────────────────────────────
function initMainApp() {
  $('companyNameHeader').textContent = DB.company;
  updateUserHeader();
  renderDashboard();
  renderAgents();
  initMap();
  renderReportHistory();
  renderSchedule();
  renderInventory();
  renderChatList();
  renderProfile();
  populateReportSelects();
  setDefaultReportFields();
  startGeoWatch();
}

function updateUserHeader() {
  const u = DB.currentUser;
  if (!u) return;
  const img = $('userAvatarHeader');
  img.src = u.avatar;
  img.alt = u.name;
}

// ── PAGE NAVIGATION ──────────────────────────────────────────
function switchPage(page) {
  document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  $(`page${page.charAt(0).toUpperCase()+page.slice(1)}`).classList.add('active');
  const navEl = $(`nav-${page}`);
  if (navEl) navEl.classList.add('active');
  if (page === 'map') { setTimeout(()=> { if(DB.map) DB.map.invalidateSize(); }, 100); }
  if (page === 'chat') { $('chatNavBadge').classList.remove('show'); $('chatBadge').style.display='none'; }
}

// ── DASHBOARD ────────────────────────────────────────────────
function renderDashboard() {
  const online = DB.users.filter(u=>u.status==='online').length;
  const shifts = { mañana:0, tarde:0, noche:0, libre:0 };
  DB.users.forEach(u=>{ if(shifts[u.shift]!==undefined) shifts[u.shift]++; });
  $('statOnline').textContent = online;
  $('statReports').textContent = DB.reportsData.length;
  $('statActive').textContent = Object.values(shifts).filter((v,i)=>i<3&&v>0).length;
  $('statAlerts').textContent = DB.reportsData.filter(r=>r.priority==='high').length;

  // Recent reports
  const rList = $('recentReportsList');
  rList.innerHTML = DB.reportsData.slice(0,3).map(r => `
    <div class="report-item" onclick="switchPage('reports')">
      <div class="report-header-row">
        <span class="report-type">${r.type}</span>
        <span class="report-priority priority-${r.priority}">${r.priority.toUpperCase()}</span>
      </div>
      <div class="report-detail">${r.desc.substring(0,80)}...</div>
      <div class="report-meta-row">
        <span class="report-meta-item"><i class="fas fa-user"></i> ${r.agent.split(' ')[0]}</span>
        <span class="report-meta-item"><i class="fas fa-clock"></i> ${r.time}</span>
        <span class="report-meta-item"><i class="fas fa-map-marker-alt"></i> ${r.post}</span>
      </div>
    </div>
  `).join('');

  // Shift info
  const su = DB.users.find(u=>u.role==='Supervisor'||u.role==='Jefe de Grupo') || DB.currentUser;
  $('currentShiftInfo').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px">
      ${infoRowHTML('Responsable Turno', su.name+' '+su.lastName)}
      ${infoRowHTML('Jefe de Grupo', 'Roberto Herrera Mendoza')}
      ${infoRowHTML('Supervisor', DB.currentUser.name+' '+DB.currentUser.lastName)}
      ${infoRowHTML('Empresa Cliente', DB.company)}
      ${infoRowHTML('Guardias en Punto', DB.users.length.toString())}
      ${infoRowHTML('Turno Actual', getTurnoActual())}
    </div>
  `;
}

function infoRowHTML(key, val) {
  return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
    <span style="font-size:11px;color:var(--text-muted);font-family:'Share Tech Mono',monospace">${key}</span>
    <span style="font-size:13px;font-weight:500;color:var(--text-primary)">${val}</span>
  </div>`;
}

function getTurnoActual() {
  const h = new Date().getHours();
  if (h>=6&&h<14) return '🌅 Mañana (06:00–14:00)';
  if (h>=14&&h<22) return '🌇 Tarde (14:00–22:00)';
  return '🌙 Noche (22:00–06:00)';
}

// ── AGENTS ───────────────────────────────────────────────────
let agentsFilter = { text:'', status:'all' };
function renderAgents(filter) {
  if(filter!==undefined) agentsFilter = Object.assign(agentsFilter, filter);
  let list = DB.users;
  if (agentsFilter.text) {
    const t = agentsFilter.text.toLowerCase();
    list = list.filter(u => `${u.name} ${u.lastName} ${u.id} ${u.role}`.toLowerCase().includes(t));
  }
  if (agentsFilter.status !== 'all') {
    if (['online','offline'].includes(agentsFilter.status)) {
      list = list.filter(u => u.status===agentsFilter.status);
    } else {
      list = list.filter(u => u.shift===agentsFilter.status);
    }
  }
  $('agentsCount').textContent = `${list.length} de ${DB.users.length} guardias`;
  $('agentsList').innerHTML = list.map(agentHTML).join('');
}

function agentHTML(u) {
  const shiftClass = { mañana:'badge-day', tarde:'badge-shift', noche:'badge-night', libre:'badge-off' };
  const shiftLabel = { mañana:'☀ Mañana', tarde:'🌆 Tarde', noche:'🌙 Noche', libre:'🏖 Libre' };
  return `<div class="agent-item" onclick="openAgentModal('${u.id}')">
    <div class="agent-avatar">
      <img src="${u.avatar}" alt="${u.name}" onerror="this.src='https://i.pravatar.cc/80?img=2'">
      <div class="status-dot ${u.status}"></div>
    </div>
    <div class="agent-info">
      <div class="agent-name">${u.name} ${u.lastName}</div>
      <div class="agent-role">${u.id} — ${u.role}</div>
      <div class="agent-meta">
        <span class="agent-badge ${shiftClass[u.shift]||'badge-shift'}">${shiftLabel[u.shift]||u.shift}</span>
        <span class="agent-badge badge-shift" style="border-color:rgba(255,255,255,0.1);color:var(--text-muted)">${u.post}</span>
      </div>
    </div>
    <div class="agent-time">
      <div style="color:${u.status==='online'?'var(--online)':'var(--offline)'}">● ${u.status.toUpperCase()}</div>
      <div style="margin-top:4px">${u.entry}</div>
      <div style="font-size:9px;color:var(--text-muted)">ENTRADA</div>
    </div>
  </div>`;
}

function filterAgents(text) { renderAgents({ text }); }
function filterAgentsByStatus(status, el) {
  document.querySelectorAll('#pageAgents .tab-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderAgents({ status });
}

function openAgentModal(userId) {
  const u = DB.users.find(x=>x.id===userId);
  if (!u) return;
  const shiftColors = { mañana:'var(--warning)', tarde:'var(--accent2)', noche:'#8899bb', libre:'var(--danger)' };
  $('agentModalContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <img src="${u.avatar}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid ${u.status==='online'?'var(--online)':'var(--offline)'}" onerror="this.src='https://i.pravatar.cc/80?img=2'">
      <div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700">${u.name} ${u.lastName}</div>
        <div style="font-size:12px;color:var(--accent);font-family:'Share Tech Mono',monospace">${u.id} — ${u.role}</div>
        <div style="display:flex;gap:8px;margin-top:6px">
          <span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;background:${u.status==='online'?'rgba(0,255,136,0.1)':'rgba(255,45,85,0.1)'};color:${u.status==='online'?'var(--online)':'var(--offline)'};border:1px solid ${u.status==='online'?'rgba(0,255,136,0.3)':'rgba(255,45,85,0.3)'}">● ${u.status.toUpperCase()}</span>
          <span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;color:${shiftColors[u.shift]||'var(--accent)'};border:1px solid rgba(255,255,255,0.1)">${u.shift.toUpperCase()}</span>
        </div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:0">
      ${modalInfoRow('Cédula / ID', u.cedula, 'fa-id-card')}
      ${modalInfoRow('Teléfono', u.phone, 'fa-phone')}
      ${modalInfoRow('Correo', u.email, 'fa-envelope')}
      ${modalInfoRow('Puesto', u.post, 'fa-map-marker-alt')}
      ${modalInfoRow('Empresa', DB.company, 'fa-building')}
      ${modalInfoRow('Entrada', u.entry, 'fa-sign-in-alt')}
      ${modalInfoRow('Salida', u.exit, 'fa-sign-out-alt')}
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button onclick="openChatWith('${u.id}');closeModal('agentModal')" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--border);background:rgba(0,212,255,0.08);color:var(--accent);cursor:pointer;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700">
        <i class="fas fa-comment"></i> MENSAJE
      </button>
      <a href="tel:${u.phone}" style="flex:1;padding:12px;border-radius:10px;border:1px solid rgba(0,255,136,0.3);background:rgba(0,255,136,0.08);color:var(--accent3);cursor:pointer;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px">
        <i class="fas fa-phone"></i> LLAMAR
      </a>
    </div>
  `;
  openModal('agentModal');
}

function modalInfoRow(label, val, icon) {
  return `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
    <i class="fas ${icon}" style="color:var(--accent);width:16px;text-align:center;font-size:13px"></i>
    <span style="font-size:11px;color:var(--text-muted);font-family:'Share Tech Mono',monospace;min-width:70px">${label}</span>
    <span style="font-size:13px;font-weight:500">${val}</span>
  </div>`;
}

// ── MAP ──────────────────────────────────────────────────────
function initMap() {
  if (DB.map) return;
  DB.map = L.map('map', { zoomControl:false, attributionControl:false }).setView([4.711, -74.0721], 15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'© OSM © CartoDB', maxZoom:19
  }).addTo(DB.map);
  L.control.attribution({ prefix:false }).addTo(DB.map);
  renderMapMarkers();
  // Simulate agent movement
  setInterval(simulateAgentMovement, 8000);
}

function renderMapMarkers() {
  DB.users.filter(u=>u.lat&&u.lng).forEach(u => {
    if (DB.mapMarkers[u.id]) DB.mapMarkers[u.id].remove();
    const icon = L.divIcon({
      className: `agent-marker${u.status==='offline'?' marker-offline':''}`,
      html: `<div class="marker-inner" style="border:2px solid ${u.status==='online'?'var(--accent)':'var(--danger)'}"><img src="${u.avatar}" onerror="this.style.display='none'"></div>`,
      iconSize:[36,36], iconAnchor:[18,18]
    });
    const marker = L.marker([u.lat, u.lng], { icon }).addTo(DB.map);
    marker.bindPopup(`
      <div style="font-family:'Exo 2',sans-serif;min-width:160px">
        <b style="font-size:14px">${u.name} ${u.lastName}</b><br>
        <span style="font-size:11px;color:#666">${u.id} — ${u.role}</span><br>
        <span style="font-size:11px;color:${u.status==='online'?'green':'red'}">● ${u.status.toUpperCase()}</span><br>
        <span style="font-size:11px">${u.post}</span>
      </div>
    `);
    DB.mapMarkers[u.id] = marker;
  });
}

function simulateAgentMovement() {
  DB.users.filter(u=>u.status==='online').forEach(u => {
    u.lat += (Math.random()-.5)*0.0003;
    u.lng += (Math.random()-.5)*0.0003;
    if (DB.mapMarkers[u.id]) {
      DB.mapMarkers[u.id].setLatLng([u.lat, u.lng]);
    }
  });
}

function centerMap() {
  navigator.geolocation.getCurrentPosition(p => {
    DB.map.flyTo([p.coords.latitude, p.coords.longitude], 17);
    showToast('📍 Ubicación actual','success');
  }, ()=> {
    DB.map.flyTo([4.711, -74.0721], 15);
    showToast('📍 Ubicación del punto','info');
  });
}

function fitAllAgents() {
  const bounds = DB.users.filter(u=>u.lat&&u.lng).map(u=>[u.lat,u.lng]);
  if (bounds.length) DB.map.fitBounds(bounds, { padding:[20,20] });
}

let mapDark = true;
function toggleMapStyle() {
  mapDark = !mapDark;
  if (DB.map) {
    DB.map.eachLayer(l=>{ if(l._url) DB.map.removeLayer(l); });
    const url = mapDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(url, { maxZoom:19 }).addTo(DB.map);
  }
}

function startGeoWatch() {
  if (!navigator.geolocation) return;
  DB.watchId = navigator.geolocation.watchPosition(pos => {
    if (DB.currentUser) {
      DB.currentUser.lat = pos.coords.latitude;
      DB.currentUser.lng = pos.coords.longitude;
      if (DB.mapMarkers[DB.currentUser.id]) {
        DB.mapMarkers[DB.currentUser.id].setLatLng([pos.coords.latitude, pos.coords.longitude]);
      }
    }
  }, ()=>{}, { enableHighAccuracy:true, maximumAge:10000 });
}

// ── REPORTS ──────────────────────────────────────────────────
function renderReportHistory() {
  $('reportHistoryList').innerHTML = DB.reportsData.map(r => `
    <div class="report-item">
      <div class="report-header-row">
        <span class="report-type">${r.type}</span>
        <span class="report-priority priority-${r.priority}">${r.priority.toUpperCase()}</span>
      </div>
      <div class="report-detail">${r.desc}</div>
      <div class="report-meta-row">
        <span class="report-meta-item"><i class="fas fa-user"></i>${r.agent}</span>
        <span class="report-meta-item"><i class="fas fa-clock"></i>${r.time}</span>
        <span class="report-meta-item"><i class="fas fa-map-marker-alt"></i>${r.post}</span>
      </div>
      <div class="report-meta-row" style="margin-top:4px">
        <span class="report-meta-item"><i class="fas fa-calendar"></i>${r.date}</span>
        <span class="report-meta-item"><i class="fas fa-user-tie"></i>${r.supervisor}</span>
      </div>
    </div>
  `).join('');
}

function switchReportTab(tab, el) {
  document.querySelectorAll('#pageReports .tab-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  $('reportTabHistory').style.display = tab==='history'?'block':'none';
  $('reportTabNew').style.display = tab==='new'?'block':'none';
}

function openNewReport() {
  const tabs = document.querySelectorAll('#pageReports .tab-btn');
  switchReportTab('new', tabs[1]);
}

function setDefaultReportFields() {
  $('repDate').value = dateStr();
  $('repTime').value = timeStr();
  $('repEntrada').value = timeStr();
  if (DB.currentUser) {
    $('repUbicacion').value = DB.currentUser.post;
    $('repEmpresa').value = DB.company;
    $('repSup').value = DB.currentUser.name+' '+DB.currentUser.lastName;
  }
}

function populateReportSelects() {
  const opts = DB.users.map(u=>`<option value="${u.id}">${u.name} ${u.lastName} (${u.id})</option>`).join('');
  $('repAgent').innerHTML = opts;
  $('repSupervisor').innerHTML = opts;
  if (DB.currentUser) {
    $('repAgent').value = DB.currentUser.id;
    $('repSupervisor').value = DB.currentUser.id;
  }
}

function setPriority(p, el) {
  DB.selectedPriority = p;
  document.querySelectorAll('.priority-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
}

let capturedGeo = null;
function captureGeo() {
  $('geoStatus').textContent = 'Capturando GPS...';
  navigator.geolocation.getCurrentPosition(pos => {
    capturedGeo = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
    $('geoStatus').textContent = `✓ Lat: ${capturedGeo.lat.toFixed(6)} | Lng: ${capturedGeo.lng.toFixed(6)} | Prec: ${Math.round(capturedGeo.acc)}m`;
    $('geoStatus').style.borderColor = 'var(--accent3)';
    $('geoStatus').style.color = 'var(--accent3)';
    showToast('📍 Ubicación capturada','success');
  }, ()=> {
    capturedGeo = { lat:4.7110, lng:-74.0721, acc:50 };
    $('geoStatus').textContent = `✓ Lat: 4.711000 | Lng: -74.072100 (simulado)`;
    $('geoStatus').style.color = 'var(--warning)';
  }, { enableHighAccuracy:true, timeout:10000 });
}

$('fileInput').addEventListener('change', function() {
  const names = Array.from(this.files).map(f=>f.name).join(', ');
  $('attachedFiles').textContent = names ? `📎 ${names}` : '';
});

function submitReport() {
  const type = $('repType').value;
  const desc = $('repDesc').value.trim();
  const agentId = $('repAgent').value;
  if (!desc) { showToast('⚠ Escribe una descripción','error'); return; }
  const agent = DB.users.find(u=>u.id===agentId);
  const newReport = {
    id: DB.reportsData.length+1, type, desc,
    priority: DB.selectedPriority,
    agent: agent ? `${agent.name} ${agent.lastName}` : 'Desconocido',
    post: $('repUbicacion').value,
    time: $('repTime').value,
    date: $('repDate').value,
    supervisor: $('repSup').value,
    empresa: $('repEmpresa').value,
    entrada: $('repEntrada').value,
    salida: $('repSalida').value,
    geo: capturedGeo
  };
  DB.reportsData.unshift(newReport);
  renderReportHistory();
  renderDashboard();
  $('repDesc').value = '';
  capturedGeo = null;
  showToast('✓ Reporte enviado correctamente','success');
  // Auto switch to history
  const tabs = document.querySelectorAll('#pageReports .tab-btn');
  switchReportTab('history', tabs[0]);
  $('reportHistoryList').scrollTop = 0;
}

function registerEntry() {
  const t = timeStr();
  if (DB.currentUser) DB.currentUser.entry = t;
  showToast(`✓ Entrada registrada: ${t}`,'success');
}
function registerExit() {
  const t = timeStr();
  if (DB.currentUser) DB.currentUser.exit = t;
  showToast(`✓ Salida registrada: ${t}`,'success');
}

// ── SCHEDULE ─────────────────────────────────────────────────
function renderSchedule() {
  const { days, schedule } = DB.scheduleData;
  const colors = { mañana:'<span class="sched-cell" style="background:rgba(255,214,10,0.15);color:var(--warning)">☀ M</span>', tarde:'<span class="sched-cell" style="background:rgba(255,107,0,0.15);color:var(--accent2)">🌆 T</span>', noche:'<span class="sched-cell" style="background:rgba(107,122,153,0.2);color:#8899bb">🌙 N</span>', libre:'<span class="sched-cell" style="background:rgba(255,45,85,0.1);color:var(--danger)">🏖 L</span>' };
  const thead = `<thead><tr><th class="sched-name">Agente</th>${days.map(d=>`<th>${d}</th>`).join('')}</tr></thead>`;
  const tbody = '<tbody>'+schedule.map(row=>`
    <tr>
      <td class="sched-name" style="font-size:12px">${row.name}</td>
      ${row.shifts.map(s=>`<td>${colors[s]||s}</td>`).join('')}
    </tr>
  `).join('')+'</tbody>';
  $('scheduleTable').innerHTML = thead+tbody;
}

// ── INVENTORY ────────────────────────────────────────────────
function renderInventory() {
  $('inventoryList').innerHTML = DB.inventoryData.map(item => `
    <div class="inventory-item">
      <div class="inv-icon"><i class="fas ${item.icon}"></i></div>
      <div class="inv-info">
        <div class="inv-name">${item.name}</div>
        <div class="inv-detail">${item.status} — Resp: ${item.responsible}</div>
      </div>
      <div class="inv-count">${item.qty}</div>
    </div>
  `).join('');
}

function openAddInventoryModal() { openModal('inventoryModal'); }
function addInventoryItem() {
  const name = $('invName').value.trim();
  if (!name) { showToast('⚠ Ingresa el nombre','error'); return; }
  DB.inventoryData.push({
    id: DB.inventoryData.length+1,
    name, qty: parseInt($('invQty').value)||1,
    status: $('invStatus').value,
    icon:'fa-box', responsible: $('invResponsible').value||'N/A'
  });
  renderInventory();
  closeModal('inventoryModal');
  showToast('✓ Elemento agregado','success');
  $('invName').value=''; $('invQty').value=1; $('invResponsible').value='';
}

// ── CHAT ─────────────────────────────────────────────────────
function renderChatList() {
  $('chatList').innerHTML = DB.chatData.map(chat => {
    const u = DB.users.find(x=>x.id===chat.userId);
    if (!u) return '';
    const last = chat.msgs[chat.msgs.length-1];
    const unread = chat.msgs.filter(m=>m.from!=='me').length;
    return `<div class="chat-list-item" onclick="openChatWith('${u.id}')">
      <div style="position:relative">
        <img class="chat-avatar" src="${u.avatar}" onerror="this.src='https://i.pravatar.cc/48?img=2'">
        <div class="status-dot ${u.status}" style="position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;border:2px solid var(--bg-card)"></div>
      </div>
      <div class="chat-info">
        <div class="chat-name">${u.name} ${u.lastName}</div>
        <div class="chat-preview">${last?.text||''}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div class="chat-time">${last?.time||''}</div>
        ${unread>0?`<div class="chat-unread">${unread}</div>`:''}
      </div>
    </div>`;
  }).join('');
}

function openChatWith(userId) {
  const u = DB.users.find(x=>x.id===userId);
  if (!u) return;
  DB.currentChat = userId;
  $('chatWindowName').textContent = `${u.name} ${u.lastName}`;
  $('chatWindowStatus').textContent = `${u.status} — ${u.role}`;
  $('chatWindowAvatar').src = u.avatar;

  const chatEntry = DB.chatData.find(c=>c.userId===userId);
  const msgs = chatEntry?.msgs || [];
  $('chatMessages').innerHTML = msgs.map(msgHTML).join('');
  $('chatMessages').scrollTop = $('chatMessages').scrollHeight;
  $('chatWindow').classList.add('active');
  switchPage('chat');
}

function msgHTML(m) {
  const isSent = m.from==='me';
  if (m.type==='file') {
    return `<div class="msg ${isSent?'sent':'recv'}">
      <div class="msg-file">
        <i class="fas fa-file-alt"></i>
        <div class="msg-file-info"><div class="msg-file-name">${m.fileName}</div><div class="msg-file-size">${m.fileSize}</div></div>
        <i class="fas fa-download" style="color:var(--accent)"></i>
      </div>
      <div class="msg-time">${m.time}</div>
    </div>`;
  }
  return `<div class="msg ${isSent?'sent':'recv'}">
    <div class="msg-bubble">${m.text}</div>
    <div class="msg-time">${isSent?'✓ ':''} ${m.time}</div>
  </div>`;
}

function closeChatWindow() {
  $('chatWindow').classList.remove('active');
  DB.currentChat = null;
}

function handleChatKey(e) {
  if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function sendMessage() {
  const input = $('chatInputBox');
  const text = input.value.trim();
  if (!text || !DB.currentChat) return;
  const t = timeStr();
  let chatEntry = DB.chatData.find(c=>c.userId===DB.currentChat);
  if (!chatEntry) { chatEntry = { userId:DB.currentChat, msgs:[] }; DB.chatData.push(chatEntry); }
  chatEntry.msgs.push({ from:'me', text, time:t, type:'text' });
  const msgs = $('chatMessages');
  msgs.innerHTML += msgHTML({ from:'me', text, time:t, type:'text' });
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';
  // Simulate reply
  const u = DB.users.find(x=>x.id===DB.currentChat);
  if (u && u.status==='online') {
    setTimeout(()=>{
      const replies = ['Recibido, entendido.','Ok, en eso estoy.','Afirmativo, sin novedad.','Confirmado.'];
      const reply = replies[Math.floor(Math.random()*replies.length)];
      chatEntry.msgs.push({ from:DB.currentChat, text:reply, time:timeStr(), type:'text' });
      msgs.innerHTML += msgHTML({ from:DB.currentChat, text:reply, time:timeStr(), type:'text' });
      msgs.scrollTop = msgs.scrollHeight;
    }, 1500+Math.random()*2000);
  }
}

function attachFile() {
  if (!DB.currentChat) return;
  const input = document.createElement('input');
  input.type='file'; input.accept='*/*';
  input.onchange = () => {
    const f = input.files[0];
    if (!f) return;
    const t = timeStr();
    let chatEntry = DB.chatData.find(c=>c.userId===DB.currentChat);
    if (!chatEntry) { chatEntry = { userId:DB.currentChat, msgs:[] }; DB.chatData.push(chatEntry); }
    const msg = { from:'me', type:'file', fileName:f.name, fileSize:formatBytes(f.size), time:t };
    chatEntry.msgs.push(msg);
    $('chatMessages').innerHTML += msgHTML(msg);
    $('chatMessages').scrollTop = $('chatMessages').scrollHeight;
    showToast('📎 Archivo adjunto enviado','success');
  };
  input.click();
}

function formatBytes(b) {
  if (b<1024) return `${b} B`;
  if (b<1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}

function callAgent() {
  const u = DB.users.find(x=>x.id===DB.currentChat);
  if (u) window.location.href=`tel:${u.phone}`;
}

// ── PROFILE ──────────────────────────────────────────────────
function renderProfile() {
  const u = DB.currentUser;
  if (!u) return;
  $('profileName').textContent = `${u.name} ${u.lastName}`;
  $('profileId').textContent = u.id;
  $('profileRole').textContent = u.role;
  $('profileAvatar').src = u.avatar;
  $('profileOnlineStatus').textContent = u.status==='online' ? '● ONLINE' : '● OFFLINE';
  $('profileOnlineStatus').style.color = u.status==='online' ? 'var(--online)' : 'var(--offline)';

  $('profileInfoRows').innerHTML = [
    ['Nombre Completo', `${u.name} ${u.lastName}`,'fa-user'],
    ['Cédula / CC', u.cedula,'fa-id-card'],
    ['Teléfono', u.phone,'fa-phone'],
    ['Correo', u.email,'fa-envelope'],
    ['Usuario', u.id,'fa-at'],
  ].map(([k,v,i])=>modalInfoRow(k,v,i)).join('');

  $('profileWorkRows').innerHTML = [
    ['Rol', u.role,'fa-briefcase'],
    ['Empresa', DB.company,'fa-building'],
    ['Puesto', u.post,'fa-map-marker-alt'],
    ['Turno', u.shift,'fa-clock'],
    ['Entrada', u.entry,'fa-sign-in-alt'],
    ['Salida', u.exit,'fa-sign-out-alt'],
  ].map(([k,v,i])=>modalInfoRow(k,v,i)).join('');
}

function editProfilePhoto() {
  const input = document.createElement('input');
  input.type='file'; input.accept='image/*';
  input.onchange = () => {
    const f = input.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = e => {
      $('profileAvatar').src = e.target.result;
      $('userAvatarHeader').src = e.target.result;
      if (DB.currentUser) DB.currentUser.avatar = e.target.result;
      showToast('✓ Foto actualizada','success');
    };
    reader.readAsDataURL(f);
  };
  input.click();
}

// ── EMERGENCY ────────────────────────────────────────────────
function showEmergencyModal() { openModal('emergencyModal'); }
function sendEmergency(type) {
  const labels = { sos:'🆘 SOS enviado — Ayuda en camino', intrusion:'⚠ Alerta de intruso notificada', fire:'🔥 Alerta de incendio activada', medical:'💊 Emergencia médica reportada' };
  showToast(labels[type]||'Alerta enviada','error');
  closeModal('emergencyModal');
  // Add to reports
  DB.reportsData.unshift({
    id: DB.reportsData.length+1,
    type: `EMERGENCIA: ${type.toUpperCase()}`, desc:`Alerta de emergencia activada por ${DB.currentUser?.name||'Sistema'} a las ${timeStr()}`,
    priority:'high', agent: DB.currentUser ? `${DB.currentUser.name} ${DB.currentUser.lastName}` : 'Sistema',
    post: DB.currentUser?.post||'N/A', time:timeStr(), date:dateStr(), supervisor: DB.currentUser?.name||'Sistema'
  });
  $('statAlerts').textContent = DB.reportsData.filter(r=>r.priority==='high').length;
}

// ── MODALS ───────────────────────────────────────────────────
function openModal(id) { $(id).classList.add('show'); }
function closeModal(id) { $(id).classList.remove('show'); }

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if(e.target===el) closeModal(el.id); });
});

// ── INIT ─────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  initNetwork();
  startClock();
  setTimeout(()=>{
    $('loadingScreen').style.opacity='0';
    $('loadingScreen').style.transition='opacity .5s';
    setTimeout(()=> $('loadingScreen').style.display='none', 500);
  }, 2200);
});
