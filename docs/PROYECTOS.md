# Varios proyectos, cada uno con sus imágenes

Si tienes más de un negocio, sucursal o cliente, cada uno manda imágenes distintas. Hay dos formas de manejarlo, y se pueden usar juntas.

## 1. Proyectos en la galería (manual)

Para las imágenes que mandas tú a mano: logo, lista de precios, horario, promoción del mes, formas de pago.

1. Abre la extensión y presiona **+** junto al nombre del proyecto.
2. Escribe el nombre, por ejemplo `Óptica`, y presiona **Guardar**.
3. Agrega las imágenes de ese proyecto.
4. Si siempre mandas el mismo texto con esas imágenes (dirección, horario), escríbelo en el cuadro de texto: se guarda en ese proyecto.
5. Repite para cada proyecto: `Lavandería`, `Taller`, `Cliente Pérez`…

Para mandar, elige el proyecto en la lista y toca la imagen. La extensión recuerda el último proyecto que usaste.

| Botón | Qué hace |
|---|---|
| **+** | Crea un proyecto nuevo. |
| **✎** | Cambia el nombre del proyecto actual. |
| **🗑** | Elimina el proyecto actual con todas sus imágenes. Pide confirmación y siempre deja al menos uno. |

Ejemplo de organización:

| Proyecto | Imágenes | Texto del proyecto |
|---|---|---|
| Óptica | logo, promoción de lentes, lista de armazones | «Te esperamos de lunes a sábado de 10 a 7.» |
| Lavandería | lista de precios, horario | «Recolección a domicilio sin costo.» |
| Taller | formas de pago, ubicación | (vacío) |

## 2. Cada sistema manda su propia imagen (automático)

Si cada proyecto tiene su propio sistema web (punto de venta, citas, pedidos), no hace falta elegir nada en la extensión: **cada sistema indica qué imagen va con cada mensaje**.

- El sistema de la óptica manda la foto de los lentes listos con «Tu pedido está listo».
- El de la lavandería manda el ticket con «Ya puedes pasar por tu ropa».
- Otro sistema manda el recibo de pago con su texto.

Qué hace cada sistema:

1. Llama a la extensión con el teléfono, el texto y la imagen de ese mensaje (ver [INTEGRACION.md](INTEGRACION.md)).
2. Abre `https://web.whatsapp.com/send?phone=…&text=…`.
3. La extensión pega esa imagen con ese texto en ese chat.

Qué haces tú una sola vez: entra a cada sistema, abre la extensión y presiona **Permitir**. Desde ese momento cada sistema adjunta su imagen sin que configures nada más. En «Sitios permitidos» ves todos los sistemas conectados.

Si un sistema usa siempre las mismas imágenes según el tipo de mensaje, lo más simple es decidirlo en el propio sistema:

```js
const IMAGENES = {
  pedido_listo: '/img/pedido-listo.png',
  recordatorio: '/img/recordatorio-cita.png',
  promocion: '/img/promo-mes.jpg',
};

enviarConImagen({ telefono, texto, imagen: IMAGENES[tipo] });
```

## ¿Cuál uso?

| Situación | Forma |
|---|---|
| Contestas mensajes a mano y quieres tener tus imágenes a la mano | Proyectos en la galería |
| Tu sistema ya abre WhatsApp con el mensaje escrito | Cada sistema manda su imagen |
| Ambas cosas | Las dos: no se estorban |
