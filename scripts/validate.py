#!/usr/bin/env python3
import json
import re
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
failures = []


def fail(message):
    failures.append(message)


def read_text(relative_path):
    return (ROOT / relative_path).read_text(encoding="utf-8")


def png_dimensions(path):
    data = path.read_bytes()[:24]
    if len(data) < 24 or data[:8] != b"\x89PNG\r\n\x1a\n":
        fail(f"{path.relative_to(ROOT)} is not a valid PNG")
        return None
    return struct.unpack(">II", data[16:24])


def extract_js_array(source, const_name):
    marker = f"const {const_name} = ["
    start = source.find(marker)
    if start < 0:
        fail(f"Cannot find JavaScript array: {const_name}")
        return "[]"
    bracket_start = source.find("[", start)
    depth = 0
    in_string = False
    quote = ""
    escaped = False
    for index in range(bracket_start, len(source)):
        char = source[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                in_string = False
            continue
        if char in ("'", '"'):
            in_string = True
            quote = char
            continue
        if char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return source[bracket_start : index + 1]
    fail(f"Unclosed JavaScript array: {const_name}")
    return "[]"


required_files = [
    "index.html",
    "styles.css",
    "manifest.json",
    "sw.js",
    "404.html",
    "apple-touch-icon.png",
    "icon-192.png",
    "icon-512.png",
    "logo.png",
    "splash-screen.png",
    "data/songs.js",
    "data/prayers.js",
    "data/liturgy.js",
]

for day in range(1, 16):
    required_files.append(f"trasa/dzien-{day:02d}.png")

for startup_image in [
    "splash/iphone-5-se.png",
    "splash/iphone-6-7-8-se.png",
    "splash/iphone-plus.png",
    "splash/iphone-x-xs-11pro.png",
    "splash/iphone-xr-11.png",
    "splash/iphone-xsmax-11promax.png",
    "splash/iphone-12-13-mini.png",
    "splash/iphone-12-13-14.png",
    "splash/iphone-12-13-14-promax.png",
    "splash/iphone-14pro-15-15pro.png",
    "splash/iphone-14promax-15plus-15promax.png",
    "splash/ipad-9-7.png",
    "splash/ipad-10-2.png",
    "splash/ipad-10-5-11.png",
    "splash/ipad-11-modern.png",
    "splash/ipad-12-9.png",
]:
    required_files.append(startup_image)

for relative_path in required_files:
    if not (ROOT / relative_path).exists():
        fail(f"Missing required file: {relative_path}")

try:
    manifest = json.loads(read_text("manifest.json"))
except Exception as error:
    manifest = {}
    fail(f"manifest.json is not valid JSON: {error}")

index_html = read_text("index.html")
styles_css = read_text("styles.css")
sw_js = read_text("sw.js")

required_viewport = 'content="width=device-width, initial-scale=1, viewport-fit=cover"'
if required_viewport not in index_html:
    fail("Viewport should use width=device-width, initial-scale=1, viewport-fit=cover")

if "user-scalable=no" in index_html or "maximum-scale=1" in index_html:
    fail("Viewport should not rely on legacy zoom-locking values")

for required_responsive_snippet in [
    "env(safe-area-inset-top",
    "env(safe-area-inset-bottom",
    "env(safe-area-inset-left",
    "env(safe-area-inset-right",
    "--app-min-height: 100dvh",
    "--app-large-height: 100lvh",
    "min-height: var(--app-min-height)",
    "@media (orientation: landscape)",
    "@media (min-width: 1024px)",
]:
    if required_responsive_snippet not in styles_css and required_responsive_snippet not in index_html:
        fail(f"Responsive/safe-area wiring is missing: {required_responsive_snippet}")

if "preventDoubleTapZoom" in index_html:
    fail("Legacy zoom-blocking function is still present")

for stale_pattern in ["img/dzien", "img/augustow", ".jpg"]:
    if stale_pattern in index_html or stale_pattern in sw_js:
        fail(f"Production files still reference stale asset pattern: {stale_pattern}")

if "cdn.tailwindcss.com" in sw_js or "fonts.googleapis.com" in sw_js:
    fail("Service worker still precaches external assets that are not required by the app")

if 'href="styles.css"' not in index_html:
    fail("index.html should load the extracted styles.css file")

if "styles.css" not in sw_js:
    fail("Service worker should precache styles.css for offline rendering")

if ".app-splash" not in styles_css:
    fail("styles.css should contain the full app styles, including splash styling")

if "data/liturgy.js" not in sw_js:
    fail("Service worker should precache the liturgy data file")

if "splash-screen.png" not in sw_js:
    fail("Service worker should precache the app splash screen")

if "apple-touch-icon.png" not in sw_js:
    fail("Service worker should precache the Apple touch icon")

if "APPLE_STARTUP_ASSETS" not in sw_js or "...APPLE_STARTUP_ASSETS" not in sw_js:
    fail("Service worker should precache iOS startup images")

if "apple-touch-startup-image" not in index_html:
    fail("iOS startup images should be linked in index.html")

for required_splash_snippet in [
    "appSplashMinimumMs = 3000",
    "appSplashFadeMs = 560",
    "is-hiding",
    "startApplication()",
]:
    if required_splash_snippet not in index_html:
        fail(f"App splash timing/fade wiring is missing: {required_splash_snippet}")

for required_install_nudge_snippet in [
    "installNudgeStorageKey",
    "showStartupInstallNudgeIfNeeded",
    "openInstallModal({ source: \"startup\" })",
]:
    if required_install_nudge_snippet not in index_html:
        fail(f"Startup install nudge is missing: {required_install_nudge_snippet}")

if ".install-benefits" not in styles_css:
    fail("Startup install nudge styles are missing")

if "ROUTE_IMAGE_ASSETS" not in sw_js or "...ROUTE_IMAGE_ASSETS" not in sw_js:
    fail("Service worker should precache route images for offline map access")

index_version_match = re.search(r'let appActiveVersion = "Wersja ([^"]+)"', index_html)
sw_version_match = re.search(r"CACHE_NAME = 'epp-pwa-cache-v([^']+)'", sw_js)
if not index_version_match:
    fail("Cannot find appActiveVersion in index.html")
if not sw_version_match:
    fail("Cannot find CACHE_NAME version in sw.js")
if index_version_match and sw_version_match and index_version_match.group(1) != sw_version_match.group(1):
    fail(
        f"Version mismatch: index {index_version_match.group(1)} vs service worker {sw_version_match.group(1)}"
    )

if "handleModalKeydown" not in index_html or "openModal(" not in index_html:
    fail("Modal focus/keyboard handling is missing")

if "const rootViewNames = new Set" not in index_html or "isRootView(viewName)" not in index_html:
    fail("Root-view navigation history guard is missing")

for required_navigation_snippet in [
    "syncRootViewHistory(viewName)",
    "appStackDepth",
    "pendingRootNavigation",
    "window.history.scrollRestoration = \"manual\"",
]:
    if required_navigation_snippet not in index_html:
        fail(f"Native-style navigation wiring is missing: {required_navigation_snippet}")

if "orientation-guard" not in index_html or ".orientation-guard" not in styles_css:
    fail("Portrait-only orientation guard is missing")

if "data-full-src" not in index_html or "openImagePreview" not in index_html:
    fail("Route image preview wiring is missing")

if "#image-modal .modal-card" not in styles_css:
    fail("Route image preview should use a full-screen modal layout")

if "imageCaption.textContent = src" in index_html:
    fail("Image preview still exposes the raw image filename")

if "- obraz trasy" in index_html:
    fail("Route image titles should use route names instead of generic day labels")

if "setTimeout(requestRouteLocationAccess, 700)" in index_html:
    fail("Location permission is still requested automatically on app startup")

if "navigator.permissions.query({ name: \"geolocation\" })" not in index_html:
    fail("Location access should query permission state before requesting geolocation")

if "isAndroidDevice() && permissionState !== \"granted\"" not in index_html:
    fail("Android location prompt suppression is missing")

try:
    route_schedule = json.loads(extract_js_array(index_html, "mainRouteSchedule"))
except Exception as error:
    route_schedule = []
    fail(f"Cannot parse mainRouteSchedule: {error}")

if len(route_schedule) != 15:
    fail(f"Expected 15 route days, found {len(route_schedule)}")

for day in route_schedule:
    day_number = day.get("day")
    staff_stops = [stop.get("nazwa") for stop in day.get("staffStops", []) if stop.get("nazwa")]
    public_stops = day.get("publicStops", [])
    finish = day.get("finish")
    if finish and public_stops and finish != public_stops[-1]:
        fail(f"Route day {day_number}: finish '{finish}' does not match last public stop '{public_stops[-1]}'")
    if finish and staff_stops and finish != staff_stops[-1]:
        fail(f"Route day {day_number}: finish '{finish}' does not match last staff stop '{staff_stops[-1]}'")
    if not day.get("publicDeparture"):
        fail(f"Route day {day_number}: missing publicDeparture")
    if not day.get("publicAppeal"):
        fail(f"Route day {day_number}: missing publicAppeal")

if manifest.get("display") != "standalone":
    fail("Manifest display should be standalone")
if manifest.get("orientation") != "portrait":
    fail("Manifest orientation should be portrait")
if manifest.get("start_url") != "./":
    fail("Manifest start_url should be ./")
if manifest.get("scope") != "./":
    fail("Manifest scope should be ./")

for icon in manifest.get("icons", []):
    src = icon.get("src")
    sizes = icon.get("sizes", "")
    if not src:
        fail("Manifest icon without src")
        continue
    icon_path = ROOT / src
    if not icon_path.exists():
        fail(f"Manifest icon does not exist: {src}")
        continue
    dimensions = png_dimensions(icon_path)
    if dimensions and sizes:
        actual = f"{dimensions[0]}x{dimensions[1]}"
        if actual != sizes:
            fail(f"Manifest icon size mismatch for {src}: manifest {sizes}, actual {actual}")
    if "maskable" not in icon.get("purpose", ""):
        fail(f"Manifest icon should include maskable purpose: {src}")

for day in range(1, 16):
    route_path = ROOT / f"trasa/dzien-{day:02d}.png"
    if route_path.exists():
        dimensions = png_dimensions(route_path)
        if dimensions and dimensions[0] < 800:
            fail(f"Route image is unexpectedly narrow: {route_path.relative_to(ROOT)}")

if failures:
    print("Static validation failed:")
    for item in failures:
        print(f"- {item}")
    sys.exit(1)

print("Static validation passed.")
