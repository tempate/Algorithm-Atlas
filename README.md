## Projects

In this repository I intend to keep track of some algorithms I've been learning throw the past year.
The code consists on a set of algorithms written in [p5.js](https://p5js.org/) (Processing),
and three cryptography demos written in Python.

There is no server and no build step. The pages are plain HTML, the sketches are
p5.js, and the cryptography is the original Python, running in the browser under
[Brython](https://brython.info/).

### Running the code

Any static file server will do:

```
python -m http.server 8000
```

Then open <http://localhost:8000>.

Opening `index.html` from the filesystem works for the p5.js pages, but not for
the three cryptography ones: Brython fetches the Python modules over HTTP, which
`file://` does not allow.

### Layout

Pages sit at the top, everything they load is under `assets/`, and everything
written by someone else is under `vendor/`.

```
index.html               the menu
algorithms/              sorting, path finding, mazes, TSP, regression
ai/                      flappy bird, smart rockets, steering, XOR, blocks
cryptography/            hash, symmetric, asymmetric

assets/css               the stylesheet
assets/sketches          the p5.js sketches, one directory per page
assets/python            the cryptography, served to Brython

vendor/p5                p5.js
vendor/bootstrap         bootstrap, and jquery and popper beside it
vendor/brython           the Brython runtime

tools/test_crypto.py     known-answer tests for the cryptography
tools/check_heads.py     checks the pages have not drifted apart
```

### The cryptography

`assets/python/cryptography` is hand-written and has no dependencies, so it runs
under CPython as well as in the browser. `tools/test_crypto.py` checks it against
known answers: AES against the FIPS-197 vector, SHA-1 against `hashlib`, and RSA
round trips including messages longer than the modulus.

```
python tools/test_crypto.py
```

Run it after touching anything under `assets/python`.

The asymmetric page keeps its keypairs and conversation in `localStorage`, so a
reload picks up where it left off. Regenerate clears them.

None of this is meant to secure anything. The keys are small enough to display on
the page, and the interesting part is watching the algorithms work.

### Adding a page

Copy the closest existing page, change the title and the script it loads, and add
a link to it in `index.html`. There is no template to expand and nothing to
rebuild.

Every page carries its own copy of the same `<head>`, since there is no template
engine to share one. If you change it, change it everywhere and confirm with:

```
python tools/check_heads.py
```
