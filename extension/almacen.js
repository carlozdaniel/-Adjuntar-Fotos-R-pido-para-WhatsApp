// Proyectos guardados en chrome.storage.local: { proyectos: [{ id, nombre, texto, imagenes: [{ id, nombre, datos }] }], actual }
const Almacen = (() => {
  const nuevoId = () => crypto.randomUUID();
  const proyecto = (nombre, imagenes = []) => ({ id: nuevoId(), nombre, texto: '', imagenes });

  async function cargar() {
    const d = await chrome.storage.local.get(['proyectos', 'actual', 'imagenes']);
    let proyectos = Array.isArray(d.proyectos) ? d.proyectos : null;
    let cambio = false;
    if (!proyectos) {
      const viejas = Array.isArray(d.imagenes) ? d.imagenes.map((im) => ({ id: nuevoId(), nombre: im.nombre, datos: im.datos })) : [];
      proyectos = [proyecto('General', viejas)];
      cambio = true;
    }
    if (!proyectos.length) {
      proyectos.push(proyecto('General'));
      cambio = true;
    }
    const actual = proyectos.some((p) => p.id === d.actual) ? d.actual : proyectos[0].id;
    const estado = { proyectos, actual };
    if (cambio || actual !== d.actual) {
      await guardar(estado);
      if (d.imagenes) await chrome.storage.local.remove('imagenes');
    }
    return estado;
  }

  const guardar = ({ proyectos, actual }) => chrome.storage.local.set({ proyectos, actual });

  return { cargar, guardar, proyecto, nuevoId };
})();
