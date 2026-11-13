"""Check a deployed static export: python3 scripts/test-static-http.py URL UPLOAD_DIR."""
import sys
from pathlib import Path
from urllib.request import urlopen
from urllib.error import HTTPError

base = sys.argv[1].rstrip("/")
directory = Path(sys.argv[2])
checks = 0

def request(path):
    try:
        response = urlopen(base + path, timeout=20)
    except HTTPError as error:
        response = error
    return response.status, response.headers, response.read()

def check(path, status, contains=None):
    global checks
    actual, headers, body = request(path)
    assert actual == status, (path, actual, status)
    if contains:
        assert contains.encode() in body, path
    checks += 1
    return headers

for page in sorted(directory.rglob("index.html")):
    route = "/" + str(page.parent.relative_to(directory)).replace(".", "").strip("/")
    check(route, 200, "<html")
    if route != "/":
        check(route + "/", 200, "<html")
    check(route.rstrip("/") + "/index.html", 200, "<html")

for route in ["/unbekannt", "/ratgeber/fehlt", "/admin/fehlt", "/assets/fehlt.js", "/uploads/fehlt.jpg"]:
    check(route, 404, "Seite nicht gefunden")

for asset in sorted((directory / "assets").iterdir()):
    headers = check("/assets/" + asset.name, 200)
    if asset.suffix == ".woff2":
        assert headers.get_content_type() == "font/woff2", asset.name
check("/admin/config.yml", 200, "name: github")
check("/robots.txt", 200)
check("/favicon.png", 200)
check("/admin/affiliate-box.js", 200, "Produkt-Kaufbox")
for asset in sorted((directory / "__l5e").rglob("*")):
    if asset.is_file():
        status, headers, body = request("/" + str(asset.relative_to(directory)))
        assert status == 200 and body == asset.read_bytes(), asset
        checks += 1
check("/.htaccess", 403)
print(f"PASS: {checks} HTTP checks; deep links, index files, assets, admin, MIME types and genuine 404 fallback.")