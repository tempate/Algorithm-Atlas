"""
Checks the cryptography against known answers.

The modules are plain standard library, so this runs under CPython with nothing
installed, even though the site itself runs them in the browser under Brython.

    python test_crypto.py
"""

import hashlib
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                "static", "python"))

from cryptography import aes, rsa, sha1  # noqa: E402

failures = []


def check(label, ok, detail=""):
    if not ok:
        failures.append(label)

    print("  %-5s %-44s %s" % ("ok" if ok else "FAIL", label, detail))


def test_aes():
    print("AES")

    # FIPS-197 appendix B: key 000102...0f, plaintext 00112233...eeff
    key = "".join(chr(i) for i in range(16))
    plain = "".join(chr(i) for i in [0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
                                     0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff])
    cipher = aes.encrypt(plain, key)[:32]
    check("FIPS-197 vector", cipher == "69c4e0d86a7b0430d8cdb78070b4c55a", cipher)

    key = "0123456789ABCDEF"

    for msg in ["hello world", "a", "exactly sixteen!", "long" * 20, "\x00\x01\x02"]:
        check("round trip %r" % msg[:18], aes.decrypt(aes.encrypt(msg, key), key) == msg)


def test_sha1():
    print("SHA-1")

    for msg in ["", "abc", "hello", "x" * 100, "z" * 1000]:
        expected = hashlib.sha1(msg.encode()).hexdigest()
        check("matches hashlib on %r" % msg[:12], sha1.hash_sum(msg) == expected)


def test_rsa():
    print("RSA")

    alice, bob = rsa.RSA(), rsa.RSA()

    # A message wider than n used to wrap the modulus and come back as noise.
    messages = ["hi", "a much longer message than 25 bytes for sure", "y" * 300,
                "\x00leading nul", "punctuation!? ~ #$%"]

    for msg in messages:
        got = rsa.decrypt(rsa.encrypt(msg, alice.public_key), alice.private_key)
        check("round trip %r" % msg[:24], got == msg)

    for msg in messages:
        cipher_ = rsa.encrypt(msg, alice.private_key)
        cipher = rsa.encrypt(cipher_, bob.public_key)
        plain_ = rsa.decrypt(cipher, bob.private_key)
        check("Alice to Bob %r" % msg[:22],
              rsa.decrypt(plain_, alice.public_key) == msg)


if __name__ == "__main__":
    test_aes()
    test_sha1()
    test_rsa()

    print()
    print("%d failures" % len(failures) if failures else "all checks passed")
    sys.exit(1 if failures else 0)
