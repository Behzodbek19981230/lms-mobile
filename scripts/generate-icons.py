#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path

from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC = PROJECT_ROOT / "src" / "assets" / "images" / "logo.jpg"

ANDROID_RES = PROJECT_ROOT / "android" / "app" / "src" / "main" / "res"
IOS_APPICON = (
    PROJECT_ROOT
    / "ios"
    / "EduOne"
    / "Images.xcassets"
    / "AppIcon.appiconset"
)


def _square_crop(img: Image.Image) -> Image.Image:
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return img.crop((left, top, left + side, top + side))


def _resize_png(img: Image.Image, size: int, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(out, format="PNG", optimize=True)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source logo not found: {SRC}")

    base = Image.open(SRC).convert("RGBA")
    square = _square_crop(base)

    # Android launcher icons
    android_sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }

    for folder, px in android_sizes.items():
        _resize_png(square, px, ANDROID_RES / folder / "ic_launcher.png")
        _resize_png(square, px, ANDROID_RES / folder / "ic_launcher_round.png")

    # iOS AppIcon (React Native template expects these in asset catalog)
    ios_images = [
        (40, "Icon-20@2x.png"),
        (60, "Icon-20@3x.png"),
        (58, "Icon-29@2x.png"),
        (87, "Icon-29@3x.png"),
        (80, "Icon-40@2x.png"),
        (120, "Icon-40@3x.png"),
        (120, "Icon-60@2x.png"),
        (180, "Icon-60@3x.png"),
        (1024, "Icon-1024.png"),
    ]

    for px, name in ios_images:
        _resize_png(square, px, IOS_APPICON / name)

    print("✅ Generated Android + iOS launcher icons from", SRC)


if __name__ == "__main__":
    main()
