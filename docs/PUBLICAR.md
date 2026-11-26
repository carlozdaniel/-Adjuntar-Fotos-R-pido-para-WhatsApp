# Publicar en la Chrome Web Store

## Primera publicación

1. Entra al [panel de desarrollador](https://chrome.google.com/webstore/devconsole) con la cuenta de desarrollador.
2. **Nuevo elemento** → sube `dist/adjuntar-fotos-rapido-<versión>.zip` (se crea con `npm run empaquetar`).
3. **Ficha de la tienda:** copia los textos de [`tienda/FICHA.md`](../tienda/FICHA.md) y sube las imágenes de `tienda/`.
4. **Privacidad:** propósito único, justificación de cada permiso, «sin código remoto», sin datos recopilados, las tres certificaciones y la URL de la política (`PRIVACIDAD.md` en GitHub).
5. **Distribución:** pública, todas las regiones.
6. **Enviar a revisión.** La revisión suele tardar de unas horas a unos días; llega un correo con el resultado.

## Versión nueva

1. Sube el número de `version` en `extension/manifest.json` y en `package.json`, y anota los cambios en `CHANGELOG.md`.
2. `npm test` y `npm run empaquetar`.
3. En el panel: el elemento → **Paquete** → **Subir paquete nuevo** → elige el zip → **Enviar a revisión**.
4. Chrome actualiza la extensión de los usuarios sola cuando se aprueba.

## Si WhatsApp cambia su página

Los selectores que usa la extensión están en `extension/wa-main.js`:

- caja de mensaje: `footer div[contenteditable="true"]`
- campo de texto de la vista previa: el nuevo `div[contenteditable="true"]` que aparece fuera del `footer` y de `#side` al pegar la imagen

Si dejan de funcionar, ajústalos ahí, actualiza el chat simulado en `pruebas/servidor-simulado.js` para que imite el cambio, corre `npm test` y publica una versión nueva.
