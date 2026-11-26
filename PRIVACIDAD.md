# Política de privacidad · Adjuntar Fotos Rápido para WhatsApp Web

Última actualización: 26 de noviembre de 2026

## Resumen

La extensión no recopila, no vende y no envía tus datos a nadie. Todo lo que guardas se queda en tu computadora.

## Qué datos maneja y dónde quedan

| Dato | Para qué | Dónde se guarda |
|---|---|---|
| Imágenes que agregas a tus proyectos | Pegarlas en un chat cuando tú lo pidas | `chrome.storage.local` de tu navegador |
| Nombres de proyecto y texto de pie | Organizar tus imágenes | `chrome.storage.local` de tu navegador |
| Imagen, teléfono y texto que manda un sistema que tú permitiste | Adjuntar esa imagen al chat de ese teléfono | `chrome.storage.local`, se borra al usarse o a los 3 minutos ya no se usa |
| Lista de sitios que permitiste | Saber en qué sitios recibir imágenes | Configuración de Chrome |

Nada de esto sale de tu navegador hacia servidores del desarrollador ni de terceros. La extensión no tiene servidor propio.

## Lo que la extensión no hace

- No lee ni guarda tus conversaciones, contactos ni mensajes.
- No envía mensajes: solo deja la imagen y el texto listos; tú presionas Enviar.
- No usa analíticas, cookies de seguimiento ni publicidad.
- No comparte ni vende datos.

## Permisos

| Permiso | Motivo |
|---|---|
| `storage`, `unlimitedStorage` | Guardar tus imágenes y proyectos en tu computadora sin el límite de 10 MB. |
| `activeTab`, `scripting` | Pegar la imagen en la pestaña de WhatsApp Web cuando tocas una imagen, y conectar los sitios que permites. |
| `https://web.whatsapp.com/*` | Pegar la imagen y el texto en el chat abierto. |
| Sitios opcionales (`http://*/*`, `https://*/*`) | Solo se piden para el sitio que tú eliges al presionar **Permitir**, y se quitan con **Quitar**. |

## Cómo borrar tus datos

Quita las imágenes o proyectos desde la ventana de la extensión, o desinstala la extensión: Chrome borra todo su almacenamiento.

## Contacto

Dudas o reportes: abre un *issue* en el repositorio del proyecto en GitHub.
