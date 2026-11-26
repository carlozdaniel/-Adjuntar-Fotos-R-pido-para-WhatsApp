// Simula la caja de mensajes de WhatsApp Web (https, mapeado con --host-resolver-rules) y un sistema en localhost.
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'muestras');
const { execFileSync } = require('child_process');
const os = require('os');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fotos-rapido-'));
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', path.join(tmp, 'clave.pem'), '-out', path.join(tmp, 'cert.pem'), '-days', '1', '-subj', '/CN=web.whatsapp.com'], { stdio: 'ignore' });
process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }));

const WA = `<!doctype html><meta charset="utf-8"><title>Chat simulado</title>
<div id="side"><div contenteditable="true" id="buscar">buscar</div></div>
<div id="main"></div>
<script>
const q = new URLSearchParams(location.search);
function abrirChat(texto) {
  const f = document.createElement('footer');
  const caja = document.createElement('div');
  caja.contentEditable = 'true';
  caja.id = 'caja';
  f.append(caja);
  document.getElementById('main').append(f);
  if (texto) caja.innerText = texto;
  window.enviados = 0;
  document.addEventListener('paste', (e) => {
    const t = e.target.closest('[contenteditable]');
    if (!t) return;
    const file = e.clipboardData.files[0];
    if (file) {
      e.preventDefault();
      const ov = document.createElement('div');
      ov.className = 'vista';
      ov.dataset.nombre = file.name;
      ov.dataset.tipo = file.type;
      ov.dataset.bytes = file.size;
      const pie = document.createElement('div');
      pie.contentEditable = 'true';
      pie.className = 'pie';
      ov.append(pie);
      document.body.append(ov);
    } else {
      e.preventDefault();
      t.innerText += e.clipboardData.getData('text/plain');
    }
  });
}
if (location.pathname === '/send') setTimeout(() => abrirChat(q.get('text') || ''), 1500);
else if (q.get('chat')) abrirChat('');
</script>`;

const SISTEMA = `<!doctype html><meta charset="utf-8"><title>Sistema</title>
<img id="logo" src="/logo.png">
<script>
window.enviarConImagen = ({ telefono, texto, imagen, nombre = 'imagen' }) => {
  const id = crypto.randomUUID();
  return new Promise((resolve) => {
    const escuchar = (e) => {
      if (e.source !== window || e.data?.waImagen !== 'respuesta' || e.data.id !== id) return;
      removeEventListener('message', escuchar);
      resolve(e.data);
    };
    addEventListener('message', escuchar);
    postMessage({ waImagen: 'enviar', id, telefono, texto, imagen, nombre }, location.origin);
  });
};
</script>`;

https.createServer({ key: fs.readFileSync(path.join(tmp, 'clave.pem')), cert: fs.readFileSync(path.join(tmp, 'cert.pem')) }, (req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(WA);
}).listen(8443);

http.createServer((req, res) => {
  if (req.url === '/logo.png') {
    res.writeHead(200, { 'content-type': 'image/png' });
    return res.end(fs.readFileSync(path.join(dir, 'logo.png')));
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(SISTEMA);
}).listen(3591);
