"""
Renders the Django templates to a static site, then gets deleted.

Django knows how to expand {% extends %} and {% block %}, so it does the
conversion rather than anyone transcribing thirteen pages by hand. The links it
emits are absolute, so they are rewritten here to be relative and work whether
the site is served from a domain root or from a subpath.

    python build_static.py [output_dir]
"""

import os
import re
import shutil
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "projects.settings")
os.environ.setdefault("DJANGO_SECRET_KEY", "build-only")

import django  # noqa: E402

django.setup()

from django.conf import settings  # noqa: E402
from django.contrib.staticfiles import storage  # noqa: E402
from django.template.loader import render_to_string  # noqa: E402
from django.utils.functional import empty  # noqa: E402

from index import catalog  # noqa: E402

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def use_plain_static():
    """
    Turn off the hashed manifest storage. The names have to stay predictable
    because nothing rewrites them again after this.
    """
    settings.STORAGES["staticfiles"]["BACKEND"] = \
        "django.contrib.staticfiles.storage.StaticFilesStorage"
    storage.staticfiles_storage._wrapped = empty


def relative(html: str, depth: int) -> str:
    """
    Rewrites the absolute links Django emits into relative ones.

    depth is how many directories down the page sits, so a page in
    cryptography/ reaches the assets through '../'.
    """
    up = "../" * depth

    # /project/direct=algorithms&name=sorting  ->  ../algorithms/sorting.html
    html = re.sub(r'/project/direct=([\w.]+)&(?:amp;)?name=([\w.]+)',
                  lambda m: "%s%s/%s.html" % (up, m.group(1), m.group(2)), html)

    # form targets: every one of them posted back to its own page. The alg is
    # matched loosely because a commented-out PGP link still carries one.
    html = re.sub(r'/asymmetric-key/alg=\w*', 'asymmetric.html', html)
    html = html.replace('/symmetric-key/', 'symmetric.html')
    html = html.replace('/hash/', 'hash.html')

    html = html.replace('href="/static/', 'href="%sstatic/' % up)
    html = html.replace('src="/static/', 'src="%sstatic/' % up)

    # the home link, which is the only bare "/" left
    html = html.replace('href="/"', 'href="%sindex.html"' % up)

    # no server, so nothing to protect against cross-site posts
    html = re.sub(r'\s*<input type="hidden" name="csrfmiddlewaretoken"[^>]*>', '', html)

    return html


def write(out_dir: str, path: str, html: str):
    full = os.path.join(out_dir, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)

    with open(full, "w", encoding="utf-8") as handle:
        handle.write(html)

    print("  %-46s %6.1f KB" % (path, len(html) / 1024))


def build(out_dir: str):
    use_plain_static()

    if os.path.isdir(out_dir):
        shutil.rmtree(out_dir)

    print("pages")
    write(out_dir, "index.html",
          relative(render_to_string("index/home.html", {"groups": catalog.groups()}), 0))

    for group, sections in catalog.PROJECTS:
        directory = catalog.group_link(group)

        for _, link in sections:
            context = {"alg": "rsa"} if link == "asymmetric" else {}
            html = render_to_string("%s/%s.html" % (directory, link), context)
            write(out_dir, "%s/%s.html" % (directory, link), relative(html, 1))

    print("assets")
    target = os.path.join(out_dir, "static")

    # The sketches and stylesheets still sit in the app; the python and the
    # runtime sit at the root. They land in one static/ tree.
    for source in (os.path.join(BASE_DIR, "index", "static"),
                   os.path.join(BASE_DIR, "static")):
        shutil.copytree(source, target, dirs_exist_ok=True,
                        ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))

    total = sum(len(files) for _, _, files in os.walk(target))
    print("  static/  %d files" % total)


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE_DIR, "dist"))
