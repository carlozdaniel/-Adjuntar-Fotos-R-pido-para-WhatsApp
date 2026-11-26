# Ficha de la Chrome Web Store

Textos listos para copiar en el panel de desarrollador.

## Detalles del producto

**Nombre** (sale del manifest): Adjuntar Fotos Rápido para WhatsApp Web

**Resumen** (sale del manifest, máx. 132): Guarda tus imágenes por proyecto y pégalas en WhatsApp Web con un clic, o deja que tu sistema las adjunte al mensaje.

**Categoría:** Herramientas (Tools)

**Idioma:** Español

**Descripción:**

```
Manda tus imágenes de siempre por WhatsApp Web sin buscarlas cada vez.

GALERÍA POR PROYECTO
Guarda logos, promociones, catálogos, horarios o formas de pago en proyectos separados: uno por negocio, sucursal o cliente. Cada proyecto tiene sus propias imágenes y su texto de pie, así nunca mandas la imagen equivocada.

UN CLIC PARA PEGAR
Entra al chat, abre la extensión, elige el proyecto y toca la imagen. Se pega en el chat junto con su texto, como una sola foto con pie. Tú revisas y presionas Enviar: la extensión nunca envía por ti.

TU SISTEMA ADJUNTA LA IMAGEN SOLO
Si usas un sistema web que abre WhatsApp con el mensaje escrito (pedidos, citas, cobranza), la extensión puede adjuntar la imagen de cada mensaje automáticamente. Solo permite el sitio una vez desde la extensión. La documentación para desarrolladores está en el sitio del proyecto.

PRIVADA
• Todo se guarda en tu computadora.
• No hay cuentas, servidores, analíticas ni publicidad.
• No lee tus conversaciones ni tus contactos.

CÓMO EMPEZAR
1. Fija la extensión desde el ícono de rompecabezas.
2. Crea un proyecto y agrega tus imágenes (botón + o arrastrándolas).
3. Abre un chat en WhatsApp Web, abre la extensión y toca la imagen.

Funciona con WhatsApp Web en Chrome y navegadores basados en Chromium de computadora.

Herramienta independiente, no afiliada a WhatsApp ni a Meta.
```

## Recursos gráficos

| Recurso | Archivo |
|---|---|
| Ícono de la tienda 128×128 | `extension/iconos/128.png` |
| Captura 1 (1280×800) | `tienda/captura-1-proyectos.png` |
| Captura 2 (1280×800) | `tienda/captura-2-chat.png` |
| Captura 3 (1280×800) | `tienda/captura-3-sistema.png` |
| Mosaico promocional pequeño 440×280 | `tienda/mosaico-440x280.png` |

## Sitios

- **Sitio web:** https://github.com/carlozdaniel/-Adjuntar-Fotos-R-pido-para-WhatsApp
- **Asistencia:** https://github.com/carlozdaniel/-Adjuntar-Fotos-R-pido-para-WhatsApp/issues
- **Política de privacidad:** https://github.com/carlozdaniel/-Adjuntar-Fotos-R-pido-para-WhatsApp/blob/main/PRIVACIDAD.md

## Prácticas de privacidad

**Propósito único:**

```
Guardar imágenes organizadas por proyecto y adjuntarlas, junto con su texto, al chat abierto de WhatsApp Web, ya sea cuando el usuario toca una imagen o cuando un sistema web que el usuario autorizó lo solicita.
```

**Justificación de permisos:**

| Permiso | Justificación |
|---|---|
| storage | Guarda en el equipo del usuario sus proyectos, imágenes y texto de pie, y por unos minutos la imagen que un sistema autorizado dejó lista para un chat. |
| unlimitedStorage | Las imágenes ocupan espacio; sin este permiso la galería se llenaría en el límite de 10 MB. Todo se guarda solo en el equipo. |
| activeTab | Al tocar una imagen en la ventana de la extensión, se pega en la pestaña de WhatsApp Web que el usuario tiene abierta. |
| scripting | Conecta la pestaña de WhatsApp Web si ya estaba abierta antes de instalar y registra el script de los sitios que el usuario permite con el botón Permitir. |
| Permiso de host (web.whatsapp.com) | Pegar la imagen y el texto en la caja de mensaje del chat abierto. No se leen conversaciones. |
| Permisos de host opcionales | Solo se piden en tiempo de ejecución para el sitio que el usuario elige al presionar Permitir, para que su sistema web pueda pasar una imagen a la extensión. Se quitan con el botón Quitar. |
| Código remoto | No. Todo el código va en el paquete. |

**Uso de datos:** no se recopila ningún tipo de dato del usuario. Marcar las tres certificaciones:

- No vendo ni transfiero datos de usuarios a terceros fuera de los casos de uso aprobados.
- No uso ni transfiero datos de usuarios para fines no relacionados con el propósito único.
- No uso ni transfiero datos de usuarios para determinar la solvencia crediticia ni para otorgar préstamos.

## Distribución

- **Visibilidad:** Pública
- **Regiones:** Todas
- **Precio:** Gratis
