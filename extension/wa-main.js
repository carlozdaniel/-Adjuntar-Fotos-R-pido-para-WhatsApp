(() => {
  if (window.__fotosRapidoMain) return;
  window.__fotosRapidoMain = true;
  const esperar = (fn, ms) => new Promise((ok, mal) => {
    const t0 = Date.now();
    const i = setInterval(() => {
      const r = fn();
      if (r) { clearInterval(i); ok(r); } else if (Date.now() - t0 > ms) { clearInterval(i); mal(); }
    }, 250);
  });
  const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
  const editables = () => [...document.querySelectorAll('div[contenteditable="true"]')].filter((el) => !el.closest('#side'));
  const texto = (el) => el.innerText.replace(/\n{2,}/g, '\n').trim();

  // Se pega en vez de teclear: un salto de línea tecleado equivale a Enter y WhatsApp enviaría el mensaje.
  const pegar = (el, datos) => {
    const dt = new DataTransfer();
    if (typeof datos === 'string') dt.setData('text/plain', datos);
    else dt.items.add(datos);
    el.focus();
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  };
  const vaciar = (el) => { el.focus(); document.execCommand('selectAll'); document.execCommand('delete'); };

  function archivo(dataUrl, nombre) {
    const [cab, b64] = dataUrl.split(',');
    const tipo = cab.match(/data:([^;]+)/)?.[1] || 'image/png';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const ext = tipo.split('/')[1] || 'png';
    return new File([bytes], /\.\w+$/.test(nombre) ? nombre : `${nombre}.${ext}`, { type: tipo });
  }

  async function adjuntar({ imagen, nombre, texto: pie, esperarChat }) {
    const caja = await esperar(() => document.querySelector('footer div[contenteditable="true"]'), esperarChat ? 90000 : 1500)
      .catch(() => null);
    if (!caja) return { ok: false, error: 'Abre un chat primero' };
    if (esperarChat && pie) await esperar(() => texto(caja), 8000).catch(() => {});
    await pausa(esperarChat ? 600 : 100);

    const borrador = texto(caja);
    const leyenda = pie || borrador;
    const antes = new Set(editables());
    if (borrador) vaciar(caja);

    pegar(caja, archivo(imagen, nombre || 'imagen'));
    const campo = await esperar(() => editables().find((el) => !antes.has(el) && !el.closest('footer')), 10000).catch(() => null);
    if (!campo) {
      if (borrador) pegar(caja, borrador);
      return { ok: false, error: 'WhatsApp no aceptó la imagen' };
    }
    await pausa(300);
    if (leyenda && !texto(campo)) pegar(campo, leyenda);
    return { ok: true };
  }

  window.addEventListener('message', async (e) => {
    if (e.source !== window || e.data?.waImagen !== 'adjuntar') return;
    let r;
    try { r = await adjuntar(e.data); } catch { r = { ok: false, error: 'Error inesperado' }; }
    window.postMessage({ waImagen: 'resultado', id: e.data.id, ...r }, location.origin);
  });
})();
