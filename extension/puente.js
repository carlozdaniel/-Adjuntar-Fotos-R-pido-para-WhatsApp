(() => {
  if (window.__fotosRapidoPuente) return;
  window.__fotosRapidoPuente = true;
  const VERSION = chrome.runtime.getManifest().version;
  const MAX = 5 * 1024 * 1024;
  document.documentElement.dataset.waImagen = VERSION;

  const aDataUrl = (blob) => new Promise((ok, mal) => {
    const fr = new FileReader();
    fr.onload = () => ok(fr.result);
    fr.onerror = mal;
    fr.readAsDataURL(blob);
  });

  const responder = (id, ok, error) => window.postMessage({ waImagen: 'respuesta', id, ok, error }, location.origin);

  window.addEventListener('message', async (e) => {
    if (e.source !== window || e.data?.waImagen !== 'enviar') return;
    const { id, telefono, imagen, nombre, texto } = e.data;
    try {
      const tel = String(telefono || '').replace(/\D/g, '');
      if (tel.length < 8) throw new Error('Teléfono inválido');
      let dataUrl = imagen;
      if (imagen instanceof Blob) dataUrl = await aDataUrl(imagen);
      else if (typeof imagen === 'string' && !imagen.startsWith('data:image/')) {
        const r = await fetch(new URL(imagen, location.href));
        if (!r.ok) throw new Error('No se pudo descargar la imagen');
        dataUrl = await aDataUrl(await r.blob());
      }
      if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) throw new Error('La imagen debe ser PNG, JPG, GIF o WebP');
      if (dataUrl.length * 0.75 > MAX) throw new Error('La imagen pesa más de 5 MB');
      await chrome.storage.local.set({
        pendiente: { telefono: tel, imagen: dataUrl, nombre: nombre || 'imagen', texto: texto || '', t: Date.now() },
      });
      responder(id, true);
    } catch (err) {
      responder(id, false, err.message);
    }
  });
})();
