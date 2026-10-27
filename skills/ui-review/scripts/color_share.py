#!/usr/bin/env python3
"""Measure the 60-30-10 color balance of screenshots.

Each pixel is sorted into:
  neutral - near black, grey, white, cream (low saturation, or very dark)
  color   - everything else (stands in for the primary)
  vivid   - high saturation and brightness (stands in for the accent)

Usage:
  python3 color_share.py shots/1440x900            # every section-*.png in a folder
  python3 color_share.py a.png b.png --no-accent    # target 70/30/0 when the brand has no vibrant accent
  python3 color_share.py shots/1440x900 --tolerance 10
Needs Pillow:  pip install pillow
"""
import argparse
import colorsys
import glob
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is not installed: pip install pillow")


def classify(path, sample=320):
    img = Image.open(path).convert("RGB")
    img.thumbnail((sample, sample))          # downsample: shares, not detail
    counts = {"neutral": 0, "color": 0, "vivid": 0}
    pixels = img.get_flattened_data() if hasattr(img, "get_flattened_data") else img.getdata()
    for r, g, b in pixels:
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if v < 0.16 or s < 0.16:
            counts["neutral"] += 1
        elif s >= 0.55 and v >= 0.55:
            counts["vivid"] += 1
        else:
            counts["color"] += 1
    total = sum(counts.values()) or 1
    return {k: round(100 * n / total, 1) for k, n in counts.items()}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--no-accent", action="store_true", help="brand has no vibrant secondary: target 70/30/0")
    ap.add_argument("--tolerance", type=float, default=10.0)
    a = ap.parse_args()

    files = []
    for p in a.paths:
        if os.path.isdir(p):
            found = sorted(glob.glob(os.path.join(p, "section-*.png"))) or sorted(glob.glob(os.path.join(p, "*.png")))
            files += found
        else:
            files.append(p)
    if not files:
        sys.exit("no images found")

    target = {"neutral": 70, "color": 30, "vivid": 0} if a.no_accent else {"neutral": 60, "color": 30, "vivid": 10}
    print(f"target neutral/color/vivid = {target['neutral']}/{target['color']}/{target['vivid']}  (+/- {a.tolerance:g})")
    fails = 0
    for f in files:
        s = classify(f)
        off = [k for k in target if abs(s[k] - target[k]) > a.tolerance]
        hint = ""
        if off:
            fails += 1
            if s["neutral"] < target["neutral"] - a.tolerance:
                hint = "too colorful: give more area to the neutral"
            elif s["neutral"] > target["neutral"] + a.tolerance:
                hint = "too flat: give the primary a large area (a section ground, big shapes, the photo tint)"
            elif s["vivid"] > target["vivid"] + a.tolerance:
                hint = "too much vivid color: keep the accent for the key action and a few highlights"
            else:
                hint = "balance off: " + ", ".join(off)
        status = "FAIL" if off else "ok  "
        print(f"{status} {os.path.basename(f):24s} neutral {s['neutral']:5.1f}  color {s['color']:5.1f}  vivid {s['vivid']:5.1f}  {hint}")
    print(f"\n{len(files)} screens, {fails} off target. Photos count as color: the shared grade keeps them in the palette.")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
