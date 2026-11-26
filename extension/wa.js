(() => {
  if (globalThis.__fotosRapidoWa) return;
  globalThis.__fotosRapidoWa = true;

  const pedir = (datos, ms) => new Promise((ok) => {
    const id = crypto.randomUUID();
    const fin = (r) => {
      clearTimeout(reloj);
      window.removeEventListener('message', escuchar);
      ok(r);
    };
    const escuchar = (e) => {
      if (e.source === window && e.data?.waImagen === 'resultado' && e.data.id === id) fin(e.data);
    };
    const reloj = setTimeout(() => fin({ ok: false, error: 'WhatsApp Web no respondió. Recarga la pestaña e inténtalo de nuevo.' }), ms);
    window.addEventListener('message', escuchar);
    window.postMessage({ waImagen: 'adjuntar', id, ...datos }, location.origin);
  });

  const listo = () => new Promise((ok) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ok, { once: true });
    else ok();
  });

  const tel = (new URLSearchParams(location.search).get('phone') || '').replace(/\D/g, '');
  if (tel) {
    chrome.storage.local.get('pendiente', async ({ pendiente: p }) => {
      if (!p || Date.now() - p.t > 180000 || p.telefono !== tel) return;
      await chrome.storage.local.remove('pendiente');
      await listo();
      pedir({ imagen: p.imagen, nombre: p.nombre, texto: p.texto, esperarChat: true }, 120000);
    });
  }

  chrome.runtime.onMessage.addListener((m, _remitente, responder) => {
    if (m?.tipo !== 'pegar') return;
    pedir({ imagen: m.imagen, nombre: m.nombre, texto: m.texto, esperarChat: false }, 20000).then(responder);
    return true;
  });
})();
