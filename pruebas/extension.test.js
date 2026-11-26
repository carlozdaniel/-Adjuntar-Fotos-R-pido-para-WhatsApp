const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const dir = __dirname;
const EXT = path.resolve(dir, '..', 'extension');
const MUESTRAS = path.join(dir, 'muestras');
const errores = [];
let fallos = 0;
const ok = (c, m) => { console.log(`${c ? 'OK  ' : 'FALLA'} ${m}`); if (!c) fallos++; };
const vigilar = (p, nombre) => {
  p.on('console', (m) => { if (m.type() === 'error') errores.push(`${nombre}: ${m.text()}`); });
  p.on('pageerror', (e) => errores.push(`${nombre}: ${e.message}`));
};

(async () => {
  require('./servidor-simulado.js');
  const grandeRuta = path.join(fs.mkdtempSync(path.join(require('os').tmpdir(), 'fotos-rapido-img-')), 'grande.jpg');
  const perfil = fs.mkdtempSync(path.join(dir, 'perfil-'));
  const ctx = await chromium.launchPersistentContext(perfil, {
    headless: true,
    executablePath: process.env.CHROMIUM || undefined,
    channel: process.env.CHROMIUM ? undefined : 'chromium',
    args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, '--host-resolver-rules=MAP web.whatsapp.com:443 127.0.0.1:8443', '--ignore-certificate-errors'],
  });
  let [sw] = ctx.serviceWorkers();
  if (!sw) sw = await ctx.waitForEvent('serviceworker');
  sw.on('console', (m) => { if (m.type() === 'error') errores.push(`sw: ${m.text()}`); });
  const id = sw.url().split('/')[2];
  await new Promise((r) => setTimeout(r, 1000));
  const bienvenida = ctx.pages().find((p) => p.url().includes('ayuda.html'));
  ok(!!bienvenida, 'abre la ayuda al instalar');

  const lienzo = await ctx.newPage();
  const b64 = await lienzo.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 2400; c.height = 1800;
    const g = c.getContext('2d');
    const d = g.createImageData(c.width, c.height);
    for (let i = 0; i < d.data.length; i++) d.data[i] = (i % 4 === 3) ? 255 : Math.random() * 255;
    g.putImageData(d, 0, 0);
    return c.toDataURL('image/jpeg', 0.95).split(',')[1];
  });
  fs.writeFileSync(grandeRuta, Buffer.from(b64, 'base64'));
  await lienzo.close();

  // Migración desde la versión 1.0 (imágenes sin proyecto).
  const viejo = fs.readFileSync(path.join(MUESTRAS, 'logo.png')).toString('base64');
  await sw.evaluate((d) => chrome.storage.local.set({ imagenes: [{ nombre: 'viejo', datos: `data:image/png;base64,${d}` }] }), viejo);

  const pop = await ctx.newPage();
  vigilar(pop, 'popup');
  await pop.goto(`chrome-extension://${id}/popup.html`);
  await pop.waitForSelector('#proyecto option', { state: 'attached' });
  ok((await pop.textContent('#proyecto option')) === 'General (1)', 'migra las imágenes viejas al proyecto General');
  ok(await pop.isDisabled('#borrar'), 'no deja borrar el único proyecto');

  await pop.click('#nuevo');
  await pop.fill('#nombre', 'Óptica');
  await pop.click('#form-nombre button[type=submit]');
  await pop.waitForFunction(() => document.querySelector('#proyecto').selectedOptions[0]?.textContent === 'Óptica (0)');
  await pop.setInputFiles('#archivo', [path.join(MUESTRAS, 'logo.png'), grandeRuta, path.join(MUESTRAS, 'no-imagen.txt')]);
  await pop.waitForFunction(() => document.querySelectorAll('#galeria .img').length === 2);
  ok(!(await pop.isHidden('#msg')), 'avisa que omitió el archivo que no es imagen');
  const est = await sw.evaluate(() => chrome.storage.local.get(['proyectos', 'actual']));
  const optica = est.proyectos.find((p) => p.nombre === 'Óptica');
  const grande = optica.imagenes.find((i) => i.nombre === 'grande');
  ok(grande && grande.datos.length * 0.75 < 1.5 * 1024 * 1024, `reduce la imagen grande (${Math.round(grande.datos.length * 0.75 / 1024)} KB)`);
  ok(est.actual === optica.id, 'recuerda el proyecto elegido');

  await pop.fill('#pie', 'Horario: 9 a 7');
  await pop.waitForTimeout(600);
  await pop.click('#renombrar');
  await pop.fill('#nombre', 'Óptica Centro');
  await pop.click('#form-nombre button[type=submit]');
  await pop.selectOption('#proyecto', { label: 'General (1)' });
  ok((await pop.inputValue('#pie')) === '', 'cada proyecto tiene su texto');
  await pop.selectOption('#proyecto', { label: 'Óptica Centro (2)' });
  ok((await pop.inputValue('#pie')) === 'Horario: 9 a 7', 'guarda el texto del proyecto');

  await pop.click('#nuevo');
  await pop.fill('#nombre', 'Borrar');
  await pop.click('#form-nombre button[type=submit]');
  await pop.click('#borrar');
  ok(!(await pop.isHidden('#confirmar')), 'pide confirmar antes de borrar');
  await pop.click('#si-borrar');
  await pop.waitForFunction(() => document.querySelectorAll('#proyecto option').length === 2);
  ok(true, 'borra el proyecto');

  // Quitar una imagen.
  await pop.selectOption('#proyecto', { label: 'General (1)' });
  await pop.hover('#galeria .img');
  await pop.click('#galeria .img .x');
  await pop.waitForFunction(() => document.querySelectorAll('#galeria .img').length === 0);
  ok(true, 'quita una imagen');

  // Fuera de WhatsApp, tocar una imagen avisa sin fallar.
  await pop.selectOption('#proyecto', { label: 'Óptica Centro (2)' });
  await pop.click('#galeria .img');
  ok((await pop.textContent('#msg')).includes('WhatsApp Web'), 'fuera de WhatsApp explica qué hacer');

  // Pegar en un chat abierto (lo que hace el popup al tocar una imagen).
  const wa = await ctx.newPage();
  vigilar(wa, 'wa');
  await wa.goto('https://web.whatsapp.com/?chat=1');
  await wa.waitForSelector('#caja');
  await wa.fill('#caja', 'borrador escrito');
  const tab = await sw.evaluate(async () => (await chrome.tabs.query({ url: 'https://web.whatsapp.com/*' }))[0].id);
  const logo = optica.imagenes.find((i) => i.nombre === 'logo');
  const r1 = await sw.evaluate(([t, im]) => chrome.tabs.sendMessage(t, { tipo: 'pegar', imagen: im.datos, nombre: im.nombre, texto: 'Hola' }), [tab, logo]);
  ok(r1?.ok, 'pega la imagen en el chat');
  ok((await wa.textContent('.vista .pie')) === 'Hola', 'el texto va como pie de la imagen');
  ok((await wa.getAttribute('.vista', 'data-nombre')) === 'logo.png', 'nombre del archivo con extensión');

  // Inyectar otra vez (pestaña abierta antes de instalar) no duplica.
  await sw.evaluate(async (t) => {
    await chrome.scripting.executeScript({ target: { tabId: t }, files: ['wa-main.js'], world: 'MAIN' });
    await chrome.scripting.executeScript({ target: { tabId: t }, files: ['wa.js'] });
  }, tab);
  await wa.evaluate(() => document.querySelectorAll('.vista').forEach((v) => v.remove()));
  const r2 = await sw.evaluate(([t, im]) => chrome.tabs.sendMessage(t, { tipo: 'pegar', imagen: im.datos, nombre: im.nombre, texto: '' }), [tab, logo]);
  ok(r2?.ok && (await wa.locator('.vista').count()) === 1, 'reinyectar no pega dos veces');
  ok((await wa.textContent('.vista .pie')) === '', 'sin texto propio no inventa pie');

  // Sin chat abierto.
  const wa2 = await ctx.newPage();
  vigilar(wa2, 'wa2');
  await wa2.goto('https://web.whatsapp.com/');
  await wa2.waitForTimeout(500);
  const tab2 = await sw.evaluate(async () => (await chrome.tabs.query({ url: 'https://web.whatsapp.com/' }))[0].id);
  const r3 = await sw.evaluate(([t, im]) => chrome.tabs.sendMessage(t, { tipo: 'pegar', imagen: im.datos, nombre: im.nombre, texto: '' }), [tab2, logo]);
  ok(r3?.ok === false && /chat/.test(r3.error), `sin chat abierto avisa (${r3?.error})`);

  // Sistema en localhost: deja la imagen lista y al abrir el chat se adjunta sola.
  const sis = await ctx.newPage();
  vigilar(sis, 'sistema');
  await sis.goto('http://localhost:3591/');
  ok((await sis.evaluate(() => document.documentElement.dataset.waImagen)) === '1.1.0', 'el sistema detecta la extensión');
  const malo = await sis.evaluate(() => enviarConImagen({ telefono: '12', texto: 'x', imagen: '/logo.png' }));
  ok(malo.ok === false && /Teléfono/.test(malo.error), 'rechaza un teléfono inválido');
  const bien = await sis.evaluate(() => enviarConImagen({ telefono: '+52 55 1234 5678', texto: 'Tu pedido está listo', imagen: '/logo.png', nombre: 'pedido' }));
  ok(bien.ok, 'acepta la imagen del sistema por URL');
  const wa3 = await ctx.newPage();
  vigilar(wa3, 'wa3');
  await wa3.goto('https://web.whatsapp.com/send?phone=525512345678&text=Tu%20pedido%20est%C3%A1%20listo');
  await wa3.waitForSelector('.vista', { timeout: 15000 });
  await wa3.waitForFunction(() => document.querySelector('.vista .pie').textContent, null, { timeout: 5000 }).catch(() => {});
  ok((await wa3.textContent('.vista .pie')) === 'Tu pedido está listo', 'la imagen llega con el texto del mensaje');
  ok((await wa3.textContent('#caja')) === '', 'el texto no queda duplicado en la caja');
  const queda = await sw.evaluate(() => chrome.storage.local.get('pendiente'));
  ok(!queda.pendiente, 'la imagen pendiente se usa una sola vez');

  // Otro teléfono no recibe la imagen.
  await sis.evaluate(() => enviarConImagen({ telefono: '5215500000000', texto: 'a', imagen: '/logo.png' }));
  const wa4 = await ctx.newPage();
  vigilar(wa4, 'wa4');
  await wa4.goto('https://web.whatsapp.com/send?phone=5219999999999&text=b');
  await wa4.waitForTimeout(3500);
  ok((await wa4.locator('.vista').count()) === 0, 'no adjunta la imagen a otro teléfono');

  // Ayuda sin errores.
  const ay = await ctx.newPage();
  vigilar(ay, 'ayuda');
  await ay.goto(`chrome-extension://${id}/ayuda.html`);
  await ay.waitForTimeout(300);

  ok(errores.length === 0, `sin errores de consola${errores.length ? ':\n  ' + errores.join('\n  ') : ''}`);
  await ctx.close();
  fs.rmSync(perfil, { recursive: true, force: true });
  console.log(fallos ? `\n${fallos} fallas` : '\nTodo bien');
  process.exit(fallos ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
