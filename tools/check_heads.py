"""
Checks that every page still shares the same <head>.

Without a template engine the head is copied into each page, so the thing to
guard against is not the duplication itself but the pages quietly drifting
apart. Run this after editing one of them.

    python tools/check_heads.py
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = re.compile(r"<head>(.*?)</head>", re.S)

# Directories that hold pages. Everything else is assets or tooling.
PAGE_DIRS = ("", "algorithms", "ai", "cryptography")


def pages():
    for directory in PAGE_DIRS:
        full = os.path.join(ROOT, directory)

        for name in sorted(os.listdir(full)):
            if name.endswith(".html"):
                yield os.path.join(directory, name)


def head_of(page: str) -> str:
    """
    The page's head, with the depth prefix removed.

    A page in a subdirectory reaches the assets through '../', so that part is
    expected to differ and is normalised away before comparing.
    """
    with open(os.path.join(ROOT, page), encoding="utf-8") as handle:
        match = HEAD.search(handle.read())

    if not match:
        return ""

    return match.group(1).replace("../", "").strip()


def main() -> int:
    heads = {}

    for page in pages():
        head = head_of(page)

        if not head:
            print("  FAIL  %-40s has no <head>" % page)
            return 1

        heads.setdefault(head, []).append(page)

    if len(heads) == 1:
        pages_checked = sum(len(group) for group in heads.values())
        print("  ok    all %d pages share one head" % pages_checked)
        return 0

    print("  FAIL  the pages have drifted into %d different heads:" % len(heads))

    # Show the odd ones out against whichever version is most common.
    groups = sorted(heads.values(), key=len, reverse=True)

    for group in groups[1:]:
        print("          %s" % ", ".join(group))

    print("        differ from: %s" % ", ".join(groups[0]))
    return 1


if __name__ == "__main__":
    sys.exit(main())
