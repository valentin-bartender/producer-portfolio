"""Cache licensed photographic references as ordinary local JPEG assets."""
import json
import pathlib
import time
import urllib.request

root = pathlib.Path("cinematic-stories")
sources = json.loads((root / "photo-sources.json").read_text())
target = root / "media"
target.mkdir(parents=True, exist_ok=True)
for item in sources:
    dest = target / item["file"]
    if dest.exists() and dest.read_bytes()[:3] == b"\xff\xd8\xff":
        print(f'Already cached: {item["file"]}')
        continue
    last_error = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(item["url"], headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=45) as response:
                data = response.read(16 * 1024 * 1024)
            if len(data) < 4096 or data[:3] != b"\xff\xd8\xff":
                raise ValueError("Expected a photographic JPEG, received invalid content")
            dest.write_bytes(data)
            print(f'Cached {item["file"]}: {len(data)} bytes; {item["author"]}')
            last_error = None
            break
        except Exception as error:
            last_error = error
            if attempt < 2:
                time.sleep(3)
    if last_error:
        raise RuntimeError(f'Could not cache {item["file"]}: {last_error}')
print(f"Verified {len(sources)} local JPEG files.")
