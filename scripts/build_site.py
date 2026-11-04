"""Build a dependency-free static deployment and ZIP for Netlify Drop."""
from pathlib import Path
from shutil import copy2, rmtree
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'dist'
FILES = ('index.html', 'style.css', 'app.js', 'calendar.js', '_headers')
ASSETS = ('about-banner-2.jpg', 'blog-1.png', 'blog-3.jpg', 'property-2.jpg', 'property-3.jpg')

# Only rebuild generated output; never modify the source files.
if OUTPUT.exists():
    rmtree(OUTPUT)
OUTPUT.mkdir()
for filename in FILES:
    copy2(ROOT / filename, OUTPUT / filename)
(OUTPUT / 'assets').mkdir()
for filename in ASSETS:
    copy2(ROOT / 'assets' / filename, OUTPUT / 'assets' / filename)
archive = ROOT / 'fes-spa-demo.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as bundle:
    for path in sorted(OUTPUT.rglob('*')):
        if path.is_file():
            bundle.write(path, path.relative_to(OUTPUT))
print(f'Site: {OUTPUT}')
print(f'Upload archive: {archive} ({archive.stat().st_size:,} bytes)')
