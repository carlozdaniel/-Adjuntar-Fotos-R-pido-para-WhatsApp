# Integración con tu sistema web

Tu página le pasa a la extensión una imagen, un teléfono y un texto. Después abre WhatsApp Web con ese teléfono y texto, y la extensión adjunta la imagen al chat. El usuario revisa y presiona Enviar.

```
Tu sistema ──postMessage──▶ puente.js ──storage──▶ wa.js / wa-main.js ──▶ chat con imagen + texto
             (misma página)            (máx. 3 min)   (WhatsApp Web)
```

## Requisitos

- La página está en `http://localhost` o `http://127.0.0.1` (cualquier puerto), **o** el usuario presionó **Permitir** en la extensión estando en tu sitio.
- WhatsApp se abre en WhatsApp Web, en el mismo navegador.

## 1. Detectar la extensión

```js
const version = document.documentElement.dataset.waImagen; // "1.1.0" o undefined
```

El atributo `data-wa-imagen` se pone en `<html>` en cuanto carga la página. Si no está, abre WhatsApp como siempre (solo texto).

## 2. Mandar la imagen y abrir el chat

```js
function enviarConImagen({ telefono, texto = '', imagen, nombre = 'imagen' }) {
  const id = crypto.randomUUID();
  return new Promise((resolve) => {
    const escuchar = (e) => {
      if (e.source !== window || e.data?.waImagen !== 'respuesta' || e.data.id !== id) return;
      removeEventListener('message', escuchar);
      resolve(e.data); // { ok: true } o { ok: false, error: 'mensaje' }
    };
    addEventListener('message', escuchar);
    postMessage({ waImagen: 'enviar', id, telefono, texto, imagen, nombre }, location.origin);
  });
}

async function avisarPorWhatsApp(telefono, texto, imagen) {
  const tel = telefono.replace(/\D/g, '');
  const url = `https://web.whatsapp.com/send?phone=${tel}&text=${encodeURIComponent(texto)}`;
  const ventana = window.open('about:blank', 'whatsapp'); // dentro del clic, para que Chrome no la bloquee
  if (document.documentElement.dataset.waImagen && imagen) {
    const r = await enviarConImagen({ telefono: tel, texto, imagen });
    if (!r.ok) console.warn('Sin imagen:', r.error);
  }
  ventana.location = url;
}
```

Abre la ventana dentro del mismo clic del usuario (como en el ejemplo) o Chrome puede bloquearla.

## Campos

| Campo | Obligatorio | Descripción |
|---|---|---|
| `telefono` | sí | Con lada de país. Se quitan espacios y símbolos (`+52 55 1234 5678` → `525512345678`). Debe coincidir con el `phone=` de la URL que abres. |
| `imagen` | sí | Data URL (`data:image/png;base64,…`), un `Blob`/`File`, o una URL **del mismo sitio** (`/uploads/foto.jpg`). PNG, JPG, GIF o WebP, máximo 5 MB. |
| `texto` | no | Pie de la imagen. Usa el mismo texto que pones en la URL. |
| `nombre` | no | Nombre del archivo que recibe el contacto. Sin extensión se agrega la del tipo de imagen. |
| `id` | sí | Cualquier texto único; la respuesta trae el mismo `id`. |

## Respuestas

| `ok` | `error` | Causa |
|---|---|---|
| `true` | — | La imagen quedó lista para el siguiente chat de ese teléfono. |
| `false` | `Teléfono inválido` | Menos de 8 dígitos. |
| `false` | `No se pudo descargar la imagen` | La URL no respondió 200 o es de otro dominio sin CORS. |
| `false` | `La imagen debe ser PNG, JPG, GIF o WebP` | Otro tipo de archivo. |
| `false` | `La imagen pesa más de 5 MB` | Redúcela antes de mandarla. |

## Reglas

- La imagen espera **3 minutos** como máximo y se usa **una sola vez**.
- Solo se adjunta si el chat que se abre es del **mismo teléfono**.
- Cada llamada reemplaza a la anterior que no se haya usado.
- Si WhatsApp tarda en abrir el chat, la extensión espera hasta 90 segundos.
- Si no se puede adjuntar, el mensaje queda como texto normal: nunca se pierde.
- La extensión **nunca** presiona Enviar.

## Varios proyectos

Cada sistema decide su imagen; no hay que registrar nada en la extensión. Ver [PROYECTOS.md](PROYECTOS.md).

## Probar

Abre [`ejemplos/sistema.html`](../ejemplos/sistema.html) con un servidor local:

```bash
npx serve ejemplos      # o: python3 -m http.server -d ejemplos 8080
```

y entra a `http://localhost:3000/sistema.html` (o el puerto que indique). Como es `localhost`, no hace falta permitir el sitio.

## Seguridad

- La extensión solo escucha mensajes de la **misma página** (`event.source === window`) y responde solo a su origen.
- Solo corre en `localhost`, `127.0.0.1` y los sitios que el usuario permitió. Al quitar un sitio se borra también el permiso de Chrome.
- La imagen pendiente se guarda en `chrome.storage.local` de la extensión, no en la página.
