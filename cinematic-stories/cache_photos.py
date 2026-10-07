"""Download, verify and optimise photographic references for local iPad playback."""
import io
import json
import pathlib
import time
import urllib.request
from PIL import Image, ImageOps

root = pathlib.Path("cinematic-stories")
sources = json.loads((root / "photo-sources.json").read_text())
target = root / "media"
target.mkdir(parents=True, exist_ok=True)
for item in sources:
    dest = target / item["file"]
    if dest.exists() and dest.read_bytes()[:3] == b"\xff\xd8\xff":
        data = dest.read_bytes()
    else:
        last_error = None
        for attempt in range(3):
            try:
                req = urllib.request.Request(item["url"], headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=45) as response:
                    data = response.read(16 * 1024 * 1024)
                if len(data) < 4096 or data[:3] != b"\xff\xd8\xff":
                    raise ValueError("Expected photographic JPEG content")
                last_error = None
                break
            except Exception as error:
                last_error = error
                if attempt < 2:
                    time.sleep(3)
        if last_error:
            raise RuntimeError(f'Could not cache {item["file"]}: {last_error}')
    with Image.open(io.BytesIO(data)) as original:
        original.verify()
    with Image.open(io.BytesIO(data)) as original:
        if max(original.size) > 1600 or not dest.exists():
            photo = ImageOps.exif_transpose(original).convert("RGB")
            photo.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            photo.save(dest, "JPEG", quality=87, optimize=True, progressive=False)
            print(f'Optimised {item["file"]}: {photo.width}x{photo.height}, {dest.stat().st_size} bytes')
        else:
            print(f'Already optimised: {item["file"]}')
    with Image.open(dest) as verify:
        verify.verify()
print(f"Verified {len(sources)} local photographic JPEG files.")
