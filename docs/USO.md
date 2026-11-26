# Guía de uso

## La ventana de la extensión

```
┌──────────────────────────────────────┐
│ ▣ Fotos Rápido                     ? │
├──────────────────────────────────────┤
│ [ Óptica Centro (3)      ▾] [+][✎][🗑]│  ← proyecto actual y sus botones
│                                      │
│ [img] [img] [img]                    │  ← galería: toca una imagen para pegarla
│ [ + ]                                │  ← agrega imágenes (o arrástralas)
│ ┌──────────────────────────────────┐ │
│ │ Texto que acompaña la imagen     │ │  ← pie de foto del proyecto (opcional)
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ Este sitio        [Permitir]         │  ← solo aparece en otras páginas web
│ Sitios permitidos [Quitar]           │
└──────────────────────────────────────┘
```

## Mandar una imagen guardada

1. Abre [WhatsApp Web](https://web.whatsapp.com) y entra al chat de la persona.
2. Haz clic en el ícono de la extensión.
3. Elige el proyecto en la lista.
4. Si quieres, escribe el texto que irá debajo de la imagen.
5. Toca la imagen. Se pega en el chat con su texto y la ventana se cierra.
6. Revisa la vista previa de WhatsApp y presiona **Enviar**.

Si ya habías escrito un mensaje en el chat y no pones texto en la extensión, ese mensaje pasa a ser el pie de la imagen.

## Agregar y quitar imágenes

- **Agregar:** botón **+** de la galería, o arrastra archivos sobre la galería. Se aceptan PNG, JPG, GIF y WebP. Puedes elegir varias a la vez.
- **Tamaño:** las fotos grandes se reducen solas (lado mayor de 1600 px) para que WhatsApp las mande rápido. Los GIF se guardan tal cual.
- **Quitar:** pasa el mouse sobre la imagen y presiona ✕.
- **Nombre:** se usa el nombre del archivo. Aparece al pasar el mouse y es el nombre del archivo que recibe la otra persona.

## Proyectos

Lee [PROYECTOS.md](PROYECTOS.md) para organizar varios negocios o clientes.

## Usarla con tu sistema

Si tu sistema web es compatible (ver [INTEGRACION.md](INTEGRACION.md)):

1. Entra a tu sistema en Chrome.
2. Abre la extensión y presiona **Permitir** en «Este sitio». Chrome te pedirá confirmar. Solo se hace una vez por sitio.
3. Recarga la página del sistema.
4. Cuando el sistema abra WhatsApp Web para mandar un mensaje, la imagen se adjunta sola con el texto. Solo presiona **Enviar**.

Los sistemas en `localhost` o `127.0.0.1` no necesitan permiso.

Para dejar de permitir un sitio, abre la extensión y presiona **Quitar** en «Sitios permitidos».

## Problemas comunes

| Mensaje o problema | Qué hacer |
|---|---|
| «Abre un chat primero» | Entra a una conversación en WhatsApp Web y vuelve a abrir la extensión. |
| «Abre WhatsApp Web, entra al chat…» | La pestaña activa no es WhatsApp Web. Cámbiate a esa pestaña y abre la extensión desde ahí. |
| «Recarga la pestaña de WhatsApp Web» | Presiona F5 en WhatsApp Web. Pasa muy rara vez, justo después de instalar o actualizar. |
| «WhatsApp no aceptó la imagen» | WhatsApp no abrió la vista previa. Prueba de nuevo; si sigue, recarga WhatsApp Web. |
| Mi sistema no adjunta la imagen | Revisa que el sitio esté en «Sitios permitidos», recarga el sistema y confirma que WhatsApp se abre en **WhatsApp Web** dentro de Chrome, no en la app de escritorio. |
| Quiero mis imágenes en otra computadora | Se guardan solo en esta computadora. Agrégalas de nuevo en la otra. |
| Dejó de funcionar de un día a otro | WhatsApp cambia su página de vez en cuando. Chrome instala la corrección en cuanto se publica; mientras tanto el texto se sigue abriendo normal. |
