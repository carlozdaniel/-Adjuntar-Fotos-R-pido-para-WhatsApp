#!/bin/sh
# Arma dist/adjuntar-fotos-rapido-<versión>.zip listo para subir a la Chrome Web Store.
set -e
cd "$(dirname "$0")/.."
version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' extension/manifest.json | head -n 1)
mkdir -p dist
salida="dist/adjuntar-fotos-rapido-$version.zip"
rm -f "$salida"
(cd extension && zip -qr -X "../$salida" . -x '.*' -x '*/.*')
echo "$salida"
