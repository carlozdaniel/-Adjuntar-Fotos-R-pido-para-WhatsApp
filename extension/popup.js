const $ = (s) => document.querySelector(s);
const MAX_LADO = 1600;
const TIPOS = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
let pestana;
let estado;
let enWa = false;

const actual = () => estado.proyectos.find((p) => p.id === estado.actual);
const guardar = () => Almacen.guardar(estado);

const mensaje = (txt, error) => {
  const m = $('#msg');
  m.hidden = !txt;
  m.className = `aviso${error ? ' error' : ''}`;
  m.textContent = txt || '';
};

const leerDataUrl = (file) => new Promise((ok, mal) => {
  const fr = new FileReader();
  fr.onload = () => ok(fr.result);
  fr.onerror = () => mal(fr.error);
  fr.readAsDataURL(file);
});

async function reducir(file) {
  if (file.size < 900 * 1024 || file.type === 'image/gif') return leerDataUrl(file);
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX_LADO / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  return c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
}

function pintarProyectos() {
  const sel = $('#proyecto');
  sel.replaceChildren(...estado.proyectos.map((p) => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = `${p.nombre} (${p.imagenes.length})`;
    return o;
  }));
  sel.value = estado.actual;
  $('#borrar').disabled = estado.proyectos.length < 2;
  $('#pie').value = actual().texto || '';
}

function pintarGaleria() {
  const p = actual();
  const g = $('#galeria');
  g.replaceChildren();
  p.imagenes.forEach((im) => {
    const b = document.createElement('button');
    b.className = 'img';
    b.title = enWa ? `Pegar "${im.nombre}" en el chat abierto` : im.nombre;
    const img = document.createElement('img');
    img.alt = im.nombre;
    img.src = im.datos;
    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = im.nombre;
    const x = document.createElement('span');
    x.className = 'x';
    x.title = 'Quitar';
    x.textContent = '✕';
    b.append(img, n, x);
    b.addEventListener('click', async (e) => {
      if (e.target === x) {
        p.imagenes = p.imagenes.filter((i) => i.id !== im.id);
        await guardar();
        pintarProyectos();
        return pintarGaleria();
      }
      pegarEnChat(im);
    });
    g.append(b);
  });
  const mas = document.createElement('label');
  mas.className = 'agregar';
  mas.htmlFor = 'archivo';
  mas.title = 'Agregar imágenes';
  mas.textContent = '+';
  g.append(mas);
}

async function agregar(files) {
  const p = actual();
  const validos = [...files].filter((f) => TIPOS.includes(f.type));
  if (!validos.length) return mensaje('Solo se aceptan imágenes PNG, JPG, GIF o WebP.', true);
  try {
    for (const f of validos) p.imagenes.push({ id: Almacen.nuevoId(), nombre: f.name.replace(/\.\w+$/, '') || 'imagen', datos: await reducir(f) });
    await guardar();
    mensaje(validos.length < files.length ? 'Algunos archivos no eran imágenes y se omitieron.' : '', validos.length < files.length);
  } catch {
    mensaje('No se pudo agregar la imagen. Prueba con otra.', true);
    estado = await Almacen.cargar();
  }
  pintarProyectos();
  pintarGaleria();
}

async function enviarAPestana(datos) {
  try {
    return await chrome.tabs.sendMessage(pestana.id, datos);
  } catch {
    // WhatsApp Web ya estaba abierto antes de instalar o actualizar la extensión.
    await chrome.scripting.executeScript({ target: { tabId: pestana.id }, files: ['wa-main.js'], world: 'MAIN' });
    await chrome.scripting.executeScript({ target: { tabId: pestana.id }, files: ['wa.js'] });
    return chrome.tabs.sendMessage(pestana.id, datos);
  }
}

async function pegarEnChat(im) {
  if (!enWa) return mensaje('Abre WhatsApp Web, entra al chat y vuelve a abrir esta ventana para pegar la imagen.', true);
  mensaje('Pegando…');
  try {
    const r = await enviarAPestana({ tipo: 'pegar', imagen: im.datos, nombre: im.nombre, texto: $('#pie').value.trim() });
    if (r?.ok) window.close();
    else mensaje(r?.error || 'No se pudo pegar la imagen.', true);
  } catch {
    mensaje('Recarga la pestaña de WhatsApp Web e inténtalo de nuevo.', true);
  }
}

let accionNombre = null;
function pedirNombre(accion) {
  accionNombre = accion;
  $('#confirmar').hidden = true;
  $('#form-nombre').hidden = false;
  $('#nombre').value = accion === 'renombrar' ? actual().nombre : '';
  $('#nombre').focus();
}

$('#form-nombre').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = $('#nombre').value.trim().slice(0, 40);
  if (!nombre) return;
  if (accionNombre === 'renombrar') actual().nombre = nombre;
  else {
    const p = Almacen.proyecto(nombre);
    estado.proyectos.push(p);
    estado.actual = p.id;
  }
  $('#form-nombre').hidden = true;
  await guardar();
  pintarProyectos();
  pintarGaleria();
});
$('#cancelar').addEventListener('click', () => { $('#form-nombre').hidden = true; });
$('#nuevo').addEventListener('click', () => pedirNombre('nuevo'));
$('#renombrar').addEventListener('click', () => pedirNombre('renombrar'));

$('#borrar').addEventListener('click', () => {
  if (estado.proyectos.length < 2) return;
  const p = actual();
  $('#form-nombre').hidden = true;
  $('#confirmar-txt').textContent = `¿Eliminar "${p.nombre}" y sus ${p.imagenes.length} imágenes?`;
  $('#confirmar').hidden = false;
});
$('#no-borrar').addEventListener('click', () => { $('#confirmar').hidden = true; });
$('#si-borrar').addEventListener('click', async () => {
  estado.proyectos = estado.proyectos.filter((p) => p.id !== estado.actual);
  estado.actual = estado.proyectos[0].id;
  $('#confirmar').hidden = true;
  await guardar();
  pintarProyectos();
  pintarGaleria();
});

$('#proyecto').addEventListener('change', async (e) => {
  estado.actual = e.target.value;
  pintarProyectos();
  pintarGaleria();
  mensaje('');
  await guardar();
});

let pausaTexto;
$('#pie').addEventListener('input', (e) => {
  actual().texto = e.target.value;
  clearTimeout(pausaTexto);
  pausaTexto = setTimeout(guardar, 400);
});

$('#archivo').addEventListener('change', async (e) => {
  await agregar(e.target.files);
  e.target.value = '';
});

const galeria = $('#galeria');
galeria.addEventListener('dragover', (e) => { e.preventDefault(); galeria.classList.add('encima'); });
galeria.addEventListener('dragleave', () => galeria.classList.remove('encima'));
galeria.addEventListener('drop', (e) => {
  e.preventDefault();
  galeria.classList.remove('encima');
  if (e.dataTransfer.files.length) agregar(e.dataTransfer.files);
});

const patron = (url) => `${url.protocol}//${url.hostname}/*`;
const idScript = (p) => `puente-${p.replace(/[^a-z0-9]/gi, '_')}`;

async function pintarPermitidos() {
  const lista = (await chrome.scripting.getRegisteredContentScripts()).filter((s) => s.id.startsWith('puente-'));
  $('#sec-permitidos').hidden = !lista.length;
  $('#permitidos').replaceChildren(...lista.map((s) => {
    const fila = document.createElement('div');
    fila.className = 'sitio';
    const nombre = document.createElement('span');
    nombre.textContent = s.matches[0].replace(/\/\*$/, '');
    const quitar = document.createElement('button');
    quitar.className = 'btn';
    quitar.textContent = 'Quitar';
    quitar.addEventListener('click', async () => {
      await chrome.scripting.unregisterContentScripts({ ids: [s.id] });
      await chrome.permissions.remove({ origins: s.matches });
      pintarSitio();
      pintarPermitidos();
    });
    fila.append(nombre, quitar);
    return fila;
  }));
}

async function pintarSitio() {
  let url = null;
  try { url = new URL(pestana?.url || ''); } catch {}
  const web = url && /^https?:$/.test(url.protocol) && !enWa;
  const local = url && ['localhost', '127.0.0.1'].includes(url.hostname);
  $('#sec-sitio').hidden = !web || local;
  if (!web || local) return;
  const p = patron(url);
  const ya = (await chrome.scripting.getRegisteredContentScripts({ ids: [idScript(p)] })).length > 0;
  $('#origen').textContent = url.hostname;
  $('#permitir').textContent = ya ? 'Permitido ✓' : 'Permitir';
  $('#permitir').disabled = ya;
  $('#permitir').onclick = async () => {
    if (!(await chrome.permissions.request({ origins: [p] }))) return;
    await chrome.scripting.registerContentScripts([{ id: idScript(p), matches: [p], js: ['puente.js'], runAt: 'document_start' }]);
    await chrome.scripting.executeScript({ target: { tabId: pestana.id }, files: ['puente.js'] }).catch(() => {});
    pintarSitio();
    pintarPermitidos();
  };
}

async function iniciar() {
  [pestana] = await chrome.tabs.query({ active: true, currentWindow: true });
  try { enWa = new URL(pestana?.url || '').hostname === 'web.whatsapp.com'; } catch { enWa = false; }
  $('#ayuda-galeria').textContent = enWa
    ? 'Elige el proyecto y toca una imagen para pegarla en el chat abierto. Luego presiona Enviar en WhatsApp.'
    : 'Agrega imágenes con + o arrastrándolas aquí. Para pegarlas, abre esta ventana estando en un chat de WhatsApp Web.';
  estado = await Almacen.cargar();
  pintarProyectos();
  pintarGaleria();
  pintarSitio();
  pintarPermitidos();
}

iniciar();
