# Adjuntar Fotos Rápido para WhatsApp Web

Extensión de Chrome para mandar imágenes por WhatsApp Web sin buscarlas cada vez.

- **Galería por proyecto.** Guarda logos, promociones, catálogos u horarios en proyectos separados (uno por negocio, sucursal o cliente) y pégalos en cualquier chat con un clic.
- **Desde tu sistema.** Si tienes un sistema web que abre WhatsApp con el mensaje escrito (pedido listo, cita, cobranza), la extensión adjunta la imagen sola y el mensaje sale como una imagen con su texto.
- **Tú decides cuándo enviar.** La extensión deja todo listo, pero nunca presiona Enviar.
- **Privada.** Todo se guarda en tu computadora. No hay servidores, cuentas, analíticas ni publicidad.

> Herramienta independiente. No está afiliada a WhatsApp ni a Meta.

## Instalar

**Desde la Chrome Web Store:** busca «Adjuntar Fotos Rápido para WhatsApp Web» y presiona *Agregar a Chrome*.

**Desde el código (modo desarrollador):**

1. Descarga o clona este repositorio.
2. Abre `chrome://extensions` y activa **Modo de desarrollador**.
3. Presiona **Cargar descomprimida** y elige la carpeta `extension/`.

Funciona en Chrome, Edge, Brave y otros navegadores basados en Chromium, en computadora. No funciona en la app de escritorio de WhatsApp ni en el celular.

## Uso rápido

1. Fija la extensión: ícono de rompecabezas 🧩 → alfiler junto a **Adjuntar Fotos Rápido**.
2. Abre la extensión, crea un proyecto con **+** y agrega imágenes (botón **+** de la galería o arrastrándolas).
3. Entra a un chat en [WhatsApp Web](https://web.whatsapp.com), abre la extensión, elige el proyecto y toca la imagen.
4. Revisa la vista previa y presiona **Enviar** en WhatsApp.

## Documentación

| Documento | Para qué |
|---|---|
| [docs/USO.md](docs/USO.md) | Guía completa para quien usa la extensión todos los días. |
| [docs/PROYECTOS.md](docs/PROYECTOS.md) | Cómo organizar varios proyectos y que cada uno mande sus propias imágenes. |
| [docs/INTEGRACION.md](docs/INTEGRACION.md) | Para desarrolladores: cómo tu sistema web adjunta una imagen al mensaje. |
| [ejemplos/sistema.html](ejemplos/sistema.html) | Página de ejemplo lista para probar la integración. |
| [docs/PUBLICAR.md](docs/PUBLICAR.md) | Cómo empaquetar y publicar una versión nueva en la Chrome Web Store. |
| [PRIVACIDAD.md](PRIVACIDAD.md) | Política de privacidad. |
| [CHANGELOG.md](CHANGELOG.md) | Cambios por versión. |

## Desarrollo

```bash
npm install          # instala Playwright para las pruebas
npx playwright install chromium
npm test             # prueba la extensión en un Chromium sin ventana, contra un chat simulado
npm run empaquetar   # crea dist/adjuntar-fotos-rapido-<versión>.zip
```

Las pruebas no se conectan a WhatsApp: levantan un chat simulado en `https://web.whatsapp.com` (redirigido a `127.0.0.1`) y un sistema de ejemplo en `http://localhost:3591`. Necesitan `openssl` para el certificado temporal y los puertos 8443 y 3591 libres.

### Estructura

```
extension/          Código de la extensión (lo que se sube a la tienda)
  manifest.json
  popup.html|css|js Ventana de la extensión: proyectos, galería y sitios permitidos
  almacen.js        Proyectos e imágenes en chrome.storage.local
  wa.js             Script en WhatsApp Web (mundo aislado): recibe pedidos y la imagen pendiente
  wa-main.js        Script en WhatsApp Web (mundo de la página): pega la imagen y el texto
  puente.js         Script en los sitios permitidos: recibe la imagen que manda tu sistema
  fondo.js          Service worker: ayuda al instalar y limpieza de permisos
  ayuda.html        Guía que se abre al instalar
docs/               Documentación
ejemplos/           Ejemplo de integración
pruebas/            Pruebas automáticas y servidor simulado
scripts/            Empaquetado
tienda/             Textos e imágenes para la ficha de la Chrome Web Store
```

## Licencia

[MIT](LICENSE)
