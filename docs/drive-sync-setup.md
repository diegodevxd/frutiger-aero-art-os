# Sincronizar Google Drive con la galería (paso a paso)

Esta guía explica cómo conectar la carpeta de Google Drive del portafolio con el sitio, para que las
imágenes, PDFs y videos nuevos aparezcan solos en la pestaña **Drive** de `galerie.html`.

- **Carpeta de Drive:** https://drive.google.com/drive/folders/1Tw6mHgEgSyUefrPzMQVwudSUhz7Y3N8J
- **ID de carpeta:** `1Tw6mHgEgSyUefrPzMQVwudSUhz7Y3N8J`
- **Workflow:** `.github/workflows/drive-sync.yml` (corre todos los días a las 09:00 UTC y a mano).
- **Secreto de GitHub:** `GDRIVE_SA_KEY` (el JSON completo de la cuenta de servicio).
- **Resultado:** `data/drive-manifest.json` + `image/drive/` + commit automático + redeploy en Vercel.

> No hace falta tocar HTML: el sitio lee `data/drive-manifest.json` y arma la galería solo.

---

## 1. Crear el proyecto en Google Cloud

1. Entra a https://console.cloud.google.com/ con la cuenta de Google dueña de la carpeta de Drive.
2. Arriba a la izquierda, abre el selector de proyectos y pulsa **Nuevo proyecto**.
3. Nombre sugerido: `moekat-drive-sync`. Pulsa **Crear** y espera unos segundos.
4. Asegúrate de que el proyecto nuevo quede seleccionado en la barra superior.

## 2. Activar la API de Google Drive

1. En el menú lateral ve a **APIs y servicios → Biblioteca**.
2. Busca **Google Drive API** y ábrela.
3. Pulsa **Habilitar**. Si ya estaba habilitada, no pasa nada.

## 3. Crear la cuenta de servicio

1. Ve a **APIs y servicios → Credenciales**.
2. Pulsa **Crear credenciales → Cuenta de servicio**.
3. Nombre: `drive-sync-bot`. Pulsa **Crear y continuar**.
4. En "Otorgar acceso a este proyecto" no agregues roles. Pulsa **Continuar** y luego **Listo**.
5. En la lista de cuentas de servicio, abre `drive-sync-bot@...iam.gserviceaccount.com`.
6. Copia su **correo electrónico** (termina en `iam.gserviceaccount.com`). Lo usarás en el paso 5.

## 4. Crear la llave JSON

1. Dentro de la cuenta de servicio, abre la pestaña **Claves**.
2. Pulsa **Agregar clave → Crear clave nueva**.
3. Elige **JSON** y pulsa **Crear**. Se descargará un archivo `.json`.
4. Abre ese archivo con un editor de texto. Lo necesitas completo en el paso 6.

> Guarda el archivo en un lugar privado. **Nunca** lo subas al repositorio ni lo pegues en un issue.
> Si se filtra, borra la clave en Google Cloud y crea otra.

## 5. Compartir la carpeta de Drive con la cuenta de servicio

1. Abre la carpeta de Drive del portafolio.
2. Pulsa **Compartir**.
3. Pega el correo de la cuenta de servicio del paso 3.
4. Cambia el permiso a **Lector** (Viewer) y desactiva "Notificar a las personas".
5. Pulsa **Compartir**.

La cuenta de servicio solo podrá leer. No puede borrar ni cambiar nada en Drive.

## 6. Guardar el JSON como secreto en GitHub

1. Entra al repositorio: https://github.com/diegodevxd/moekat
2. Ve a **Settings → Secrets and variables → Actions**.
3. Pulsa **New repository secret**.
4. Nombre exacto: `GDRIVE_SA_KEY`.
5. En **Secret**, pega **todo** el contenido del archivo JSON (desde `{` hasta `}`).
6. Pulsa **Add secret**.

Opcional: si algún día cambias de carpeta, crea en **Variables** una variable `DRIVE_FOLDER_ID`
con el nuevo ID. Si no existe, el workflow usa el ID que ya está escrito en `.github/workflows/drive-sync.yml`.

## 7. Correr el workflow una vez a mano

1. En el repositorio ve a la pestaña **Actions**.
2. En la lista izquierda elige **Drive sync**.
3. Pulsa **Run workflow** → rama `main` → **Run workflow**.
4. Espera a que termine en verde. La primera corrida tarda más porque descarga y convierte todo.
5. Revisa el commit automático: debe decir algo como `Drive sync: 3 new files`.
6. Abre `https://TU-SITIO.vercel.app/galerie.html?tab=drive` y comprueba que aparece la galería.

> Si el botón **Run workflow** no aparece, el workflow todavía no está en la rama `main`.
> Este PR debe mergearse primero.

## 8. Cómo organizar el contenido en Drive

- **Subcarpeta = sección de la galería.** Ejemplo: `Ilustración`, `Dioramas`, `2026 / Bocetos`.
  Los archivos que estén sueltos en la raíz caen en la sección `Drive`.
- **Imágenes** (`.jpg`, `.png`, `.webp`, `.gif`): se convierten a WebP de máximo 1600 px y miniatura.
- **PDFs**: cada página se convierte en una imagen y se muestra como visor secuencial.
- **Videos** (`.mp4`, `.webm`, `.mov`): se copian si pesan **25 MB o menos**. Si pesan más, se omiten
  y queda el aviso en el log del workflow.
- **Nombres**: el nombre del archivo (sin extensión) se usa como título. Evita caracteres raros.
- **Orden**: dentro de cada sección se ordena por nombre de archivo. Para controlar el orden,
  usa prefijos como `01-`, `02-`.
- **Borrar o mover** un archivo en Drive: en la siguiente corrida se quita de la galería y se borran
  sus imágenes generadas (el commit lo refleja).

## 9. Qué hace el workflow cada día

1. Lista la carpeta y sus subcarpetas con la cuenta de servicio.
2. Compara `id` y `modifiedTime` con `data/drive-manifest.json`.
3. Descarga y procesa solo lo nuevo o modificado.
4. Escribe el manifest con título, sección, tipo, rutas y orden.
5. Si hubo cambios, hace un commit `Drive sync: N new files` y lo empuja a `main`.
6. Vercel detecta el push y vuelve a desplegar el sitio.
7. Si no hubo cambios, **no** crea commit.

## 10. Probar el script sin credenciales (para desarrollo)

El script tiene modo offline. En tu computadora:

```bash
python -m unittest tests/test_drive_sync.py -v
```

Los tests crean solos sus archivos y su listado falso. También puedes pasar tu propio listado:

```bash
python scripts/drive_sync.py \
  --offline-listing mi-listing.json \
  --source-root carpeta-con-archivos-de-prueba \
  --output-root /tmp/drive-test \
  --dry-run
```

El listado de prueba tiene esta forma:

```json
{
  "folderId": "fake",
  "files": [
    {
      "id": "abc123",
      "name": "Mi dibujo.png",
      "mimeType": "image/png",
      "modifiedTime": "2026-05-01T10:00:00Z",
      "size": 123456,
      "section": "Ilustración",
      "localPath": "mi-dibujo.png"
    }
  ]
}
```

## 11. Problemas comunes

| Síntoma | Causa probable | Solución |
| :--- | :--- | :--- |
| `403 The caller does not have permission` | La carpeta no está compartida con la cuenta de servicio. | Repite el paso 5 con el correo `...iam.gserviceaccount.com`. |
| `404 File not found` | ID de carpeta incorrecto o la cuenta no tiene acceso. | Revisa el ID y la variable `DRIVE_FOLDER_ID`. |
| `Falta la variable de entorno GDRIVE_SA_KEY` | El secreto no existe o tiene otro nombre. | Créalo como `GDRIVE_SA_KEY` en Settings → Secrets → Actions. |
| El workflow falla al hacer `git push` | El repo restringe los permisos del `GITHUB_TOKEN`. | Settings → Actions → General → Workflow permissions: **Read and write permissions**. |
| El video no aparece | Pesa más de 25 MB. | Comprímelo o súbelo a otra plataforma y enlázalo manualmente. |
| La galería no cambia | El workflow no ha corrido o falló. | Revisa Actions → Drive sync y correlo a mano. |
| `data/drive-manifest.json` da 404 en local | Abriste el sitio con `file://`. | Usa `python -m http.server` como explica el README. |

## 12. Seguridad

- El JSON de la cuenta de servicio permite leer **solo** las carpetas compartidas con ella.
- Nunca lo subas al repo: vive en el secreto `GDRIVE_SA_KEY`.
- Si sospechas que se filtró, elimina la clave en Google Cloud y crea otra; actualiza el secreto.
- La cuenta de servicio tiene permiso **Lector**, no editor: no puede modificar tu Drive.

---

¿Dudas? Revisa el log de la corrida en **Actions → Drive sync → última ejecución**.
