#!/usr/bin/env python3
"""Check text contrast against the real pixels behind it (text over images).

Two ways to use it:
  1) From the shoot.mjs report (elements marked data-on-image in the HTML):
       python3 contrast_over_image.py --report shots/report.json --size 1440x900
     It reads shots/<size>/full.png and every [data-on-image] box.
  2) One box by hand, on a screenshot taken with the text hidden:
       python3 contrast_over_image.py shot.png --box 120,300,640,90 --color "#ffffff" --large

The background is judged by its worst 10% of pixels (the busiest part under the text).
Pass: 4.5:1 for body text, 3:1 for large text (24px+, or 18.66px+ bold).
Needs Pillow:  pip install pillow
"""
import argparse
import json
import os
import re
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is not installed: pip install pillow")


def lum(rgb):
    def ch(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb[:3]
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def ratio(l1, l2):
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def parse_color(s):
    s = s.strip()
    m = re.match(r"rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)", s)
    if m:
        return tuple(int(float(x)) for x in m.groups())
    s = s.lstrip("#")
    if len(s) == 3:
        s = "".join(c * 2 for c in s)
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def check(img, box, text_rgb):
    x, y, w, h = [int(round(v)) for v in box]
    x, y = max(0, x), max(0, y)
    crop = img.crop((x, y, min(img.width, x + w), min(img.height, y + h))).convert("RGB")
    crop.thumbnail((200, 200))
    tl = lum(text_rgb)
    pixels = crop.get_flattened_data() if hasattr(crop, "get_flattened_data") else crop.getdata()
    ratios = sorted(ratio(tl, lum(p)) for p in pixels)
    if not ratios:
        return None, None
    # the screenshot must not contain the text itself (shoot.mjs writes full-notext.png for this)
    worst10 = ratios[max(0, int(len(ratios) * 0.10) - 1)]
    return round(worst10, 2), round(ratios[len(ratios) // 2], 2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image", nargs="?")
    ap.add_argument("--box", help="x,y,w,h in image pixels")
    ap.add_argument("--color", help="text color, #hex or rgb()")
    ap.add_argument("--large", action="store_true", help="text is 24px+ (or 18.66px+ bold): 3:1 is enough")
    ap.add_argument("--report", help="report.json from shoot.mjs")
    ap.add_argument("--size", default="1440x900")
    a = ap.parse_args()

    jobs = []
    if a.report:
        rep = json.load(open(a.report))
        size = next((s for s in rep["sizes"] if s["size"] == a.size), None)
        if not size:
            sys.exit(f"size {a.size} not in report")
        img = Image.open(os.path.join(size["dir"], "full-notext.png"))
        for e in size["onImage"]:
            large = e["fontSize"] >= 24 or (e["fontSize"] >= 18.66 and int(float(e["fontWeight"])) >= 700)
            jobs.append((img, (e["docX"], e["docY"], e["w"], e["h"]), parse_color(e["color"]), large, e["text"]))
        if not jobs:
            sys.exit("no [data-on-image] elements in the report: mark text that sits on images with data-on-image")
    else:
        if not (a.image and a.box and a.color):
            ap.error("give an image with --box and --color, or --report")
        jobs.append((Image.open(a.image), [float(v) for v in a.box.split(",")], parse_color(a.color), a.large, "box"))

    fails = 0
    for img, box, rgb, large, label in jobs:
        worst, median = check(img, box, rgb)
        need = 3.0 if large else 4.5
        ok = worst is not None and worst >= need
        fails += 0 if ok else 1
        tip = "" if ok else "  -> move to a calmer area, or add a soft ink overlay (30-55%) and re-check"
        print(f"{'ok  ' if ok else 'FAIL'} worst10% {worst}:1  median {median}:1  need {need}:1  \"{label}\"{tip}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
