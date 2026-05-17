#!/usr/bin/env python3
"""Download product-specific perfume bottle images from Wikimedia Commons."""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images"
SOURCES = Path(__file__).with_name("perfume-image-sources.json")
UA = "EclatPerfumeStore/1.0 (educational demo; contact: local-dev)"


def api(base: str, params: dict) -> dict:
    url = base + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.load(resp)


def commons_thumb_from_file(title: str, width: int = 720) -> str | None:
    if not title.startswith("File:"):
        title = "File:" + title
    data = api(
        "https://commons.wikimedia.org/w/api.php",
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|mime|thumburl",
            "iiurlwidth": width,
            "format": "json",
        },
    )
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        if page.get("missing"):
            continue
        info = (page.get("imageinfo") or [{}])[0]
        mime = info.get("mime", "")
        if not mime.startswith("image/"):
            continue
        return info.get("thumburl") or info.get("url")
    return None


def commons_search(query: str, width: int = 720) -> tuple[str | None, str | None]:
    data = api(
        "https://commons.wikimedia.org/w/api.php",
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": 6,
            "gsrlimit": 8,
            "prop": "imageinfo",
            "iiprop": "url|mime|thumburl",
            "iiurlwidth": width,
            "format": "json",
        },
    )
    pages = data.get("query", {}).get("pages", {})
    for page in sorted(pages.values(), key=lambda p: p.get("index", 0)):
        info = (page.get("imageinfo") or [{}])[0]
        mime = info.get("mime", "")
        title = page.get("title", "")
        if not mime.startswith("image/"):
            continue
        if re.search(r"(logo|icon|svg|advert|banner|store|shop)", title, re.I):
            continue
        url = info.get("thumburl") or info.get("url")
        if url:
            return url, title
    return None, None


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as resp:
        dest.write_bytes(resp.read())


def main() -> int:
    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    ok = 0
    for pid, meta in sorted(sources.items(), key=lambda x: int(x[0])):
        num = f"{int(pid):02d}"
        dest_opt = OUT / f"{num}.optimized.jpg"
        dest_jpg = OUT / f"{num}.jpg"
        url = None
        title = None

        if meta.get("file"):
            url = commons_thumb_from_file(meta["file"])
            title = meta["file"]

        if not url:
            url, title = commons_search(meta.get("query", ""))

        if not url:
            print(f"SKIP {num}: no image for {meta.get('query')}")
            continue

        try:
            download(url, dest_opt)
            dest_jpg.write_bytes(dest_opt.read_bytes())
            print(f"OK {num} <- {title}")
            ok += 1
        except Exception as exc:
            print(f"FAIL {num}: {exc}")
        time.sleep(0.35)

    print(f"Done: {ok}/{len(sources)} saved to {OUT}")
    return 0 if ok >= 25 else 1


if __name__ == "__main__":
    sys.exit(main())
