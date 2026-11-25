#!/usr/bin/env python3
"""Sincroniza una carpeta de Google Drive con la galería del sitio.

- Lista la carpeta raíz y sus subcarpetas (recursivo).
- Descarga solo archivos nuevos o modificados (id + modifiedTime en el manifest).
- Imágenes -> WebP optimizado (máx. 1600 px) + miniatura.
- PDFs -> una imagen WebP por página (máx. 1600 px) + miniaturas.
- Videos mp4/webm/mov -> se copian si pesan <= --max-video-mb; si no, se omiten.
- El nombre de cada subcarpeta se usa como nombre de sección de la galería.
- Escribe data/drive-manifest.json (metadatos + secciones + orden) y las salidas
  en image/drive/. El sitio lee ese manifest y arma la galería sin tocar HTML.

Modo offline (para pruebas sin credenciales):
    python scripts/drive_sync.py --offline-listing tests/fixtures/listing.json \
        --output-root /tmp/drive-test

El listado offline tiene la forma:
    {"files": [{"id": "...", "name": "...", "mimeType": "image/png",
                "modifiedTime": "...", "size": 123, "section": "Ilustración",
                "localPath": "archivo-local.png"}]}
"""

from __future__ import annotations

import argparse
import base64
import json
import logging
import os
import re
import shutil
import sys
import tempfile
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from PIL import Image, ImageOps

try:
    import fitz  # PyMuPDF
except ImportError:  # pragma: no cover - mensaje claro en el workflow
    fitz = None

ROOT = Path(__file__).resolve().parents[1]

FOLDER_MIME = "application/vnd.google-apps.folder"
PDF_MIME = "application/pdf"
IMAGE_MIMES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
}
VIDEO_MIMES = {"video/mp4", "video/webm", "video/quicktime", "video/x-m4v"}
VIDEO_EXTS = {".mp4", ".webm", ".mov", ".m4v"}
DEFAULT_MAX_VIDEO_MB = 25
MAX_IMAGE_SIDE = 1600
MAX_THUMB_SIDE = 480
IMAGE_QUALITY = 82
THUMB_QUALITY = 74
PDF_QUALITY = 78


def log(message: str) -> None:
    logging.info(message)


def slugify(value: str, fallback: str = "archivo") -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = value.encode("ascii", "ignore").decode("ascii").lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    value = re.sub(r"-{2,}", "-", value)
    return (value or fallback)[:70]


def clean_title(name: str) -> str:
    title = Path(name).stem
    title = re.sub(r"[_-]+", " ", title)
    title = re.sub(r"\s+", " ", title).strip()
    return title or "Archivo"


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def safe_join(root: Path, relative: str) -> Path:
    candidate = (root / relative).resolve()
    root_resolved = root.resolve()
    if root_resolved != candidate and root_resolved not in candidate.parents:
        raise ValueError(f"Ruta fuera del proyecto: {relative!r}")
    return candidate


def save_webp(image: Image.Image, dest: Path, max_side: int, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    image = ImageOps.exif_transpose(image)
    if image.mode in ("RGBA", "LA", "P"):
        image = image.convert("RGBA")
        background = Image.new("RGB", image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[-1])
        image = background
    else:
        image = image.convert("RGB")

    width, height = image.size
    scale = min(1.0, max_side / float(max(width, height)))
    if scale < 1.0:
        image = image.resize(
            (max(1, round(width * scale)), max(1, round(height * scale))),
            Image.Resampling.LANCZOS,
        )
    image.save(dest, "WEBP", quality=quality, method=6)


def process_image(source: Path, root: Path, section: str, fid: str, title: str, meta: str) -> dict[str, Any]:
    section_slug = slugify(section, "drive")
    base = f"{slugify(title)}-{fid[:8]}"
    relative_full = f"image/drive/{section_slug}/{base}.webp"
    relative_thumb = f"image/drive/{section_slug}/thumbs/{base}.webp"

    with Image.open(source) as image:
        save_webp(image, safe_join(root, relative_full), MAX_IMAGE_SIDE, IMAGE_QUALITY)
        save_webp(image, safe_join(root, relative_thumb), MAX_THUMB_SIDE, THUMB_QUALITY)

    return {
        "type": "image",
        "title": title,
        "src": relative_full,
        "thumb": relative_thumb,
        "paths": [relative_full, relative_thumb],
        "meta": meta,
    }


def process_pdf(source: Path, root: Path, section: str, fid: str, title: str, meta: str) -> dict[str, Any]:
    if fitz is None:
        raise RuntimeError("PyMuPDF no está instalado (pip install PyMuPDF).")

    section_slug = slugify(section, "drive")
    base = f"{slugify(title)}-{fid[:8]}"
    folder = f"image/drive/{section_slug}/pdfs/{base}"

    pages: list[dict[str, str]] = []
    doc = fitz.open(source)
    try:
        for index in range(doc.page_count):
            page = doc[index]
            rect = page.rect
            scale = min(MAX_IMAGE_SIDE / rect.width, MAX_IMAGE_SIDE / rect.height)
            pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

            page_name = f"page-{index + 1:02d}.webp"
            relative_full = f"{folder}/{page_name}"
            relative_thumb = f"{folder}/thumbs/{page_name}"
            save_webp(image, safe_join(root, relative_full), MAX_IMAGE_SIDE, PDF_QUALITY)
            save_webp(image, safe_join(root, relative_thumb), MAX_THUMB_SIDE, THUMB_QUALITY)

            pages.append(
                {
                    "src": relative_full,
                    "thumb": relative_thumb,
                    "title": f"{title} · página {index + 1:02d}",
                    "meta": meta,
                }
            )
    finally:
        doc.close()

    paths: list[str] = []
    for page in pages:
        paths.extend([page["src"], page["thumb"]])

    return {
        "type": "pdf",
        "title": title,
        "pages": pages,
        "paths": paths,
        "pageCount": len(pages),
        "meta": meta,
    }


def process_video(source: Path, root: Path, section: str, fid: str, title: str, meta: str, extension: str) -> dict[str, Any]:
    section_slug = slugify(section, "drive")
    base = f"{slugify(title)}-{fid[:8]}"
    relative = f"image/drive/{section_slug}/{base}{extension}"
    destination = safe_join(root, relative)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)
    return {
        "type": "video",
        "title": title,
        "src": relative,
        "paths": [relative],
        "meta": meta,
    }


def remove_outputs(root: Path, paths: Iterable[str]) -> None:
    for relative in paths or []:
        try:
            target = safe_join(root, relative)
        except ValueError:
            log(f"WARN ruta inválida en manifest, se ignora: {relative}")
            continue
        if target.is_file():
            target.unlink()
        # Limpia carpetas vacías dentro de image/drive.
        parent = target.parent
        while parent != root and parent.is_dir():
            try:
                parent.rmdir()
            except OSError:
                break
            if parent.name == "drive" and parent.parent.name == "image":
                break
            parent = parent.parent


def download_drive_file(service: Any, file_id: str, destination: Path) -> None:
    from googleapiclient.http import MediaIoBaseDownload

    destination.parent.mkdir(parents=True, exist_ok=True)
    request = service.files().get_media(fileId=file_id, supportsAllDrives=True)
    with destination.open("wb") as handle:
        downloader = MediaIoBaseDownload(handle, request, chunksize=8 * 1024 * 1024)
        done = False
        while not done:
            _, done = downloader.next_chunk()


def list_drive_folder(service: Any, folder_id: str, folder_path: tuple[str, ...] = (), seen: set[str] | None = None) -> list[dict[str, Any]]:
    if seen is None:
        seen = set()
    if folder_id in seen:
        return []
    seen.add(folder_id)

    entries: list[dict[str, Any]] = []
    page_token = None
    fields = "nextPageToken, files(id,name,mimeType,modifiedTime,size,md5Checksum,parents)"
    while True:
        response = (
            service.files()
            .list(
                q=f"'{folder_id}' in parents and trashed = false",
                spaces="drive",
                fields=fields,
                pageSize=1000,
                pageToken=page_token,
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            )
            .execute()
        )
        for item in response.get("files", []):
            item["sectionPath"] = folder_path
            entries.append(item)
        page_token = response.get("nextPageToken")
        if not page_token:
            break

    # Recorre subcarpetas después de listar esta carpeta.
    for item in list(entries):
        if item.get("mimeType") == FOLDER_MIME:
            subfolder_path = folder_path + (item["name"],)
            entries.extend(list_drive_folder(service, item["id"], subfolder_path, seen))
    return entries


def build_service() -> Any:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    raw = (os.environ.get("GDRIVE_SA_KEY") or "").strip()
    if not raw:
        raise RuntimeError(
            "Falta la variable de entorno GDRIVE_SA_KEY con el JSON de la cuenta de servicio."
        )
    try:
        info = json.loads(raw)
    except json.JSONDecodeError:
        try:
            info = json.loads(base64.b64decode(raw).decode("utf-8"))
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError("GDRIVE_SA_KEY no es JSON ni base64 de JSON válido.") from exc

    credentials = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/drive.readonly"]
    )
    return build("drive", "v3", credentials=credentials, cache_discovery=False)


def load_offline_listing(path: Path) -> tuple[str, list[dict[str, Any]]]:
    with path.open(encoding="utf-8") as handle:
        payload = json.load(handle)
    files = payload.get("files") or []
    for item in files:
        item.setdefault("section", payload.get("rootSectionName") or "Drive")
        item["sectionPath"] = ()
    return payload.get("folderId") or "offline", files


def entry_kind(entry: dict[str, Any]) -> str | None:
    mime = (entry.get("mimeType") or "").lower()
    suffix = Path(entry.get("name") or "").suffix.lower()
    if mime == PDF_MIME or suffix == ".pdf":
        return "pdf"
    if mime in IMAGE_MIMES or suffix in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff"}:
        return "image"
    if mime in VIDEO_MIMES or suffix in VIDEO_EXTS:
        return "video"
    return None


def section_name(entry: dict[str, Any], root_section_name: str) -> str:
    explicit = entry.get("section")
    if explicit:
        return str(explicit)
    parts = [part for part in (entry.get("sectionPath") or ()) if part]
    if not parts:
        return root_section_name
    return " / ".join(parts)


def build_manifest_sections(files: dict[str, dict[str, Any]], root_section_name: str) -> list[dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = {}
    for item in files.values():
        grouped.setdefault(item["section"], []).append(item)

    sections: list[dict[str, Any]] = []
    ordered_names = sorted(
        grouped,
        key=lambda name: (name == root_section_name, name.lower()),
    )
    for index, name in enumerate(ordered_names):
        items = sorted(grouped[name], key=lambda item: item.get("name", "").lower())
        for position, item in enumerate(items):
            item["order"] = position
        sections.append({"name": name, "order": index, "items": items})
    return sections


def run_sync(args: argparse.Namespace) -> dict[str, int]:
    output_root = Path(args.output_root).resolve()
    manifest_path = Path(args.manifest)
    if not manifest_path.is_absolute():
        manifest_path = output_root / manifest_path
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    old_manifest: dict[str, Any] = {}
    if manifest_path.exists():
        try:
            old_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            log("WARN manifest anterior inválido; se reconstruye.")
    old_files: dict[str, dict[str, Any]] = old_manifest.get("files") or {}

    service = None
    folder_id = args.folder_id or os.environ.get("DRIVE_FOLDER_ID") or ""
    if args.offline_listing:
        folder_id, entries = load_offline_listing(Path(args.offline_listing))
        source_root = Path(args.source_root).resolve() if args.source_root else Path(args.offline_listing).resolve().parent
        log(f"Modo offline: {len(entries)} archivos en el listado de prueba.")
    else:
        if not folder_id:
            raise RuntimeError("Falta --folder-id (o DRIVE_FOLDER_ID).")
        log(f"Listando carpeta de Drive {folder_id}...")
        service = build_service()
        entries = list_drive_folder(service, folder_id)
        source_root = None
        log(f"Drive devolvió {len(entries)} entradas (incluyendo carpetas).")

    current_ids = {entry["id"] for entry in entries}
    files: dict[str, dict[str, Any]] = {}
    stats = {"new": 0, "updated": 0, "unchanged": 0, "removed": 0, "skipped": 0}
    max_video_bytes = int(float(args.max_video_mb) * 1024 * 1024)

    with tempfile.TemporaryDirectory(prefix="drive-sync-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)

        for entry in entries:
            if entry.get("mimeType") == FOLDER_MIME:
                continue

            fid = entry["id"]
            name = entry.get("name") or fid
            modified = entry.get("modifiedTime") or ""
            kind = entry_kind(entry)
            section = section_name(entry, args.root_section_name)
            title = clean_title(name)
            meta = f"{section} · {modified[:10]}" if modified else section

            old = old_files.get(fid)
            if old and old.get("modifiedTime") == modified and all(
                safe_join(output_root, path).is_file() for path in old.get("paths", [])
            ):
                files[fid] = old
                stats["unchanged"] += 1
                continue

            if old:
                if args.dry_run:
                    log(f"DRY actualizaría: {name} ({section})")
                else:
                    remove_outputs(output_root, old.get("paths", []))

            if not kind:
                log(f"SKIP formato no soportado: {name} ({entry.get('mimeType')})")
                stats["skipped"] += 1
                continue

            size = int(entry.get("size") or 0)
            if kind == "video" and size > max_video_bytes:
                log(f"SKIP video > {args.max_video_mb} MB: {name} ({size / 1024 / 1024:.1f} MB)")
                stats["skipped"] += 1
                continue

            local_path = entry.get("localPath")
            source = None
            if not args.dry_run:
                if local_path:
                    source = (source_root / local_path).resolve()
                    if not source.is_file():
                        log(f"SKIP archivo local no encontrado: {source}")
                        stats["skipped"] += 1
                        continue
                else:
                    suffix = Path(name).suffix or ".bin"
                    source = temp_dir / f"{fid}{suffix}"
                    log(f"Descargando {name}...")
                    download_drive_file(service, fid, source)

            if old:
                stats["updated"] += 1
            else:
                stats["new"] += 1

            if args.dry_run:
                continue

            try:
                if kind == "image":
                    result = process_image(source, output_root, section, fid, title, meta)
                elif kind == "pdf":
                    result = process_pdf(source, output_root, section, fid, title, meta)
                elif kind == "video":
                    result = process_video(
                        source,
                        output_root,
                        section,
                        fid,
                        title,
                        meta,
                        Path(name).suffix.lower() or ".mp4",
                    )
                else:  # pragma: no cover
                    continue
            except Exception as exc:  # noqa: BLE001
                log(f"ERROR procesando {name}: {exc}")
                stats["skipped"] += 1
                continue
            finally:
                if not local_path and source.exists():
                    source.unlink(missing_ok=True)

            result.update(
                {
                    "id": fid,
                    "name": name,
                    "section": section,
                    "modifiedTime": modified,
                    "size": size,
                }
            )
            files[fid] = result

    if args.prune:
        for fid, old in old_files.items():
            if fid not in current_ids:
                if args.dry_run:
                    log(f"DRY eliminaría: {old.get('name')}")
                else:
                    remove_outputs(output_root, old.get("paths", []))
                stats["removed"] += 1

    manifest = {
        "version": 1,
        "folderId": folder_id,
        "updatedAt": iso_now(),
        "rootSectionName": args.root_section_name,
        "sections": build_manifest_sections(files, args.root_section_name),
        "files": files,
        "stats": stats,
    }

    if not args.dry_run:
        temp_manifest = manifest_path.with_suffix(manifest_path.suffix + ".tmp")
        temp_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        temp_manifest.replace(manifest_path)
        log(f"Manifest escrito en {manifest_path}")
    else:
        log("DRY RUN: no se escribieron archivos ni manifest.")

    log(
        "Resumen: {new} nuevos, {updated} actualizados, {unchanged} sin cambios, "
        "{removed} eliminados, {skipped} omitidos.".format(**stats)
    )
    # Líneas legibles por el workflow de GitHub Actions.
    print(f"NEW_FILES={stats['new']}")
    print(f"UPDATED_FILES={stats['updated']}")
    print(f"REMOVED_FILES={stats['removed']}")
    print(f"SKIPPED_FILES={stats['skipped']}")
    return stats


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sincroniza Google Drive con la galería del sitio.")
    parser.add_argument("--folder-id", default=os.environ.get("DRIVE_FOLDER_ID", ""))
    parser.add_argument("--manifest", default="data/drive-manifest.json")
    parser.add_argument("--output-root", default=str(ROOT))
    parser.add_argument("--offline-listing", help="JSON de listado falso para pruebas sin credenciales.")
    parser.add_argument("--source-root", help="Carpeta base para localPath en modo offline.")
    parser.add_argument("--root-section-name", default="Drive")
    parser.add_argument("--max-video-mb", type=float, default=DEFAULT_MAX_VIDEO_MB)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--no-prune", dest="prune", action="store_false", help="No borrar archivos ausentes en Drive.")
    parser.add_argument("--verbose", action="store_true")
    parser.set_defaults(prune=True)
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s %(message)s",
    )
    try:
        run_sync(args)
    except Exception as exc:  # noqa: BLE001
        logging.error("%s", exc)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
