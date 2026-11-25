"""Pruebas offline del sincronizador de Drive (sin credenciales).

Ejecutar:
    python -m unittest tests/test_drive_sync.py -v
"""

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

try:
    import fitz
except ImportError:  # pragma: no cover
    fitz = None

REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT = REPO_ROOT / "scripts" / "drive_sync.py"


def write_listing(path: Path, files: list[dict]) -> None:
    path.write_text(json.dumps({"folderId": "fake-folder", "files": files}, ensure_ascii=False), encoding="utf-8")


class DriveSyncOfflineTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory(prefix="drive-sync-test-")
        self.base = Path(self.temp.name)
        self.site = self.base / "site"
        self.site.mkdir()

        image = Image.new("RGB", (2200, 1200), (210, 120, 180))
        image.save(self.base / "foto.png")

        if fitz is not None:
            document = fitz.open()
            page = document.new_page(width=800, height=600)
            page.insert_text((60, 80), "Pagina de prueba")
            document.save(self.base / "bitacora.pdf")
            document.close()

        (self.base / "clip.mp4").write_bytes(b"\x00" * 4096)
        self.listing = self.base / "listing.json"
        write_listing(
            self.listing,
            [
                {
                    "id": "img000001",
                    "name": "Mi Foto.png",
                    "mimeType": "image/png",
                    "modifiedTime": "2026-01-01T10:00:00Z",
                    "size": 1024,
                    "section": "Ilustración",
                    "localPath": "foto.png",
                },
                {
                    "id": "pdf000001",
                    "name": "Bitacora de prueba.pdf",
                    "mimeType": "application/pdf",
                    "modifiedTime": "2026-01-01T10:00:00Z",
                    "size": 2048,
                    "section": "Bitácoras",
                    "localPath": "bitacora.pdf",
                },
                {
                    "id": "vid000001",
                    "name": "Proceso.mp4",
                    "mimeType": "video/mp4",
                    "modifiedTime": "2026-01-01T10:00:00Z",
                    "size": 4096,
                    "section": "Videos",
                    "localPath": "clip.mp4",
                },
                {
                    "id": "big000001",
                    "name": "Video pesado.mp4",
                    "mimeType": "video/mp4",
                    "modifiedTime": "2026-01-01T10:00:00Z",
                    "size": 30 * 1024 * 1024,
                    "section": "Videos",
                },
            ],
        )

    def tearDown(self) -> None:
        self.temp.cleanup()

    def run_sync(self, *extra: str) -> subprocess.CompletedProcess:
        env = dict(os.environ)
        env["PYTHONIOENCODING"] = "utf-8"
        command = [
            sys.executable,
            str(SCRIPT),
            "--offline-listing",
            str(self.listing),
            "--source-root",
            str(self.base),
            "--output-root",
            str(self.site),
            "--manifest",
            "data/drive-manifest.json",
            *extra,
        ]
        return subprocess.run(command, capture_output=True, text=True, encoding="utf-8", env=env)

    def manifest(self) -> dict:
        return json.loads((self.site / "data" / "drive-manifest.json").read_text(encoding="utf-8"))

    @unittest.skipIf(fitz is None, "PyMuPDF no está instalado")
    def test_pipeline_and_idempotency(self) -> None:
        result = self.run_sync()
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
        self.assertIn("NEW_FILES=3", result.stdout)
        self.assertIn("SKIPPED_FILES=1", result.stdout)

        manifest = self.manifest()
        sections = {section["name"]: section for section in manifest["sections"]}
        self.assertEqual(set(sections), {"Ilustración", "Bitácoras", "Videos"})

        image_item = sections["Ilustración"]["items"][0]
        self.assertEqual(image_item["type"], "image")
        self.assertTrue((self.site / image_item["src"]).is_file())
        self.assertTrue((self.site / image_item["thumb"]).is_file())
        with Image.open(self.site / image_item["src"]) as optimized:
            self.assertLessEqual(max(optimized.size), 1600)

        pdf_item = sections["Bitácoras"]["items"][0]
        self.assertEqual(pdf_item["type"], "pdf")
        self.assertEqual(pdf_item["pageCount"], 1)
        self.assertTrue((self.site / pdf_item["pages"][0]["src"]).is_file())

        video_item = sections["Videos"]["items"][0]
        self.assertEqual(video_item["type"], "video")
        self.assertTrue((self.site / video_item["src"]).is_file())
        self.assertEqual(len(manifest["files"]), 3)

        second = self.run_sync()
        self.assertEqual(second.returncode, 0, second.stderr + second.stdout)
        self.assertIn("NEW_FILES=0", second.stdout)
        self.assertIn("UPDATED_FILES=0", second.stdout)

    @unittest.skipIf(fitz is None, "PyMuPDF no está instalado")
    def test_dry_run_writes_nothing(self) -> None:
        result = self.run_sync("--dry-run")
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
        self.assertIn("NEW_FILES=3", result.stdout)
        self.assertFalse((self.site / "data" / "drive-manifest.json").exists())
        self.assertFalse((self.site / "image" / "drive").exists())

    @unittest.skipIf(fitz is None, "PyMuPDF no está instalado")
    def test_prune_removes_missing_drive_files(self) -> None:
        first = self.run_sync()
        self.assertEqual(first.returncode, 0, first.stderr + first.stdout)
        manifest = self.manifest()
        image_item = next(item for item in manifest["files"].values() if item["type"] == "image")
        image_path = self.site / image_item["src"]
        self.assertTrue(image_path.is_file())

        write_listing(
            self.listing,
            [
                {
                    "id": "pdf000001",
                    "name": "Bitacora de prueba.pdf",
                    "mimeType": "application/pdf",
                    "modifiedTime": "2026-01-01T10:00:00Z",
                    "size": 2048,
                    "section": "Bitácoras",
                    "localPath": "bitacora.pdf",
                },
                {
                    "id": "vid000001",
                    "name": "Proceso.mp4",
                    "mimeType": "video/mp4",
                    "modifiedTime": "2026-01-01T10:00:00Z",
                    "size": 4096,
                    "section": "Videos",
                    "localPath": "clip.mp4",
                },
            ],
        )

        second = self.run_sync()
        self.assertEqual(second.returncode, 0, second.stderr + second.stdout)
        self.assertIn("REMOVED_FILES=1", second.stdout)
        self.assertFalse(image_path.exists())
        self.assertNotIn("img000001", self.manifest()["files"])


if __name__ == "__main__":
    unittest.main()
