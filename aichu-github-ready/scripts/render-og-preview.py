"""Render a crisp Open Graph PNG from the approved aichuuu.co logo contours.

Build-only asset generator; no runtime dependency or animation changes.
Contours were extracted from the previously approved logo, preserving the h-u connection.
"""
import base64
import json
import math
import struct
import zlib
from pathlib import Path

W, H, S = 1200, 630, 2
SW, SH = W * S, H * S
DATA = "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"
polys = json.loads(zlib.decompress(base64.b64decode(DATA)))
edges = []
for poly in polys:
    for (x1, y1), (x2, y2) in zip(poly, poly[1:] + poly[:1]):
        if y1 != y2:
            edges.append((x1, y1, x2, y2, min(y1, y2), max(y1, y2)))

mask = bytearray(SW * SH)
white = b"\xff" * SW
for y in range(SH):
    yy = y + 0.5
    xs = []
    for x1, y1, x2, y2, lo, hi in edges:
        if lo <= yy < hi:
            xs.append(x1 + (yy - y1) * (x2 - x1) / (y2 - y1))
    xs.sort()
    off = y * SW
    for a, b in zip(xs[::2], xs[1::2]):
        start = max(0, min(SW, math.ceil(a - 0.5)))
        end = max(0, min(SW, math.ceil(b - 0.5)))
        if end > start:
            mask[off + start : off + end] = white[: end - start]

raw = bytearray()
for y in range(H):
    raw.append(0)
    for x in range(W):
        j = y * 2 * SW + x * 2
        a = (mask[j] + mask[j + 1] + mask[j + SW] + mask[j + SW + 1]) // 4
        t = max(0, 1 - (abs(x - W / 2) / (W / 2)) ** 2)
        r = 5 + int(1.6 * t)
        g = 18 + int(9 * t) - int(y / H * 1.5)
        b = 43 + int(26 * t) - int(y / H * 4)
        fr, fg, fb = 253, 194, 30
        raw.extend(
            (
                (r * (255 - a) + fr * a) // 255,
                (g * (255 - a) + fg * a) // 255,
                (b * (255 - a) + fb * a) // 255,
            )
        )

def chunk(tag, data):
    return (
        struct.pack("!I", len(data))
        + tag
        + data
        + struct.pack("!I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )

png = (
    b"\x89PNG\r\n\x1a\n"
    + chunk(b"IHDR", struct.pack("!IIBBBBB", W, H, 8, 2, 0, 0, 0))
    + chunk(b"IDAT", zlib.compress(raw, 9))
    + chunk(b"IEND", b"")
)
output = Path(__file__).resolve().parent.parent / "dist" / "og-preview-v3.png"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_bytes(png)
print(f"Open Graph image generated: {output} ({len(png)} bytes)")
