from django.http import Http404, HttpResponseBadRequest
from django.shortcuts import render

from . import catalog
from cryptography import aes, rsa, sha1

HISTORY_LIMIT = 10
KEY_LENGTH = 16     # AES-128 takes a 128-bit key.

# One message has to leave room for itself in the cookie, since the history
# cannot be trimmed below the message that was just sent.
MAX_MESSAGE = 500

# The session rides in a signed cookie and browsers refuse one over 4KB. Leave
# room for the cookie's own name and attributes.
COOKIE_BUDGET = 3800

# Every algorithm the views are allowed to reach. Names arrive from the URL and
# the request body, so they are looked up here rather than in globals().
CIPHERS = {"aes": aes}
HASHES = {"sha1": sha1}
ASYMMETRIC = {"rsa": rsa}

USERS = ("alice", "bob")
ACTIONS = ("encrypt", "decrypt")


def home(request):
    return render(request, "index/home.html", {
        "groups": catalog.groups()
    })


def projects(request, direct, name):
    if name == "asymmetric":
        return asymmetric(request, "rsa")

    # Both halves come straight from the URL, so only pairs that are actually
    # in the catalog may be turned into a template path.
    if (direct, name) not in catalog.PAGES:
        raise Http404("No such project: %s/%s" % (direct, name))

    return render(request, "%s/%s.html" % (direct, name))


def asymmetric(request, alg="rsa"):
    if alg not in ASYMMETRIC:
        raise Http404("No such algorithm: %s" % alg)

    module = ASYMMETRIC[alg]
    context = {"alg": alg}

    if request.method != "POST" or not _has_keys(request):
        _new_keys(request, module, alg)
        return render(request, "cryptography/asymmetric.html", context)

    msg = request.POST.get("msg")
    user = (request.POST.get("user") or "").lower()
    action = request.POST.get("action")

    if user not in USERS or not msg or action not in ACTIONS:
        return HttpResponseBadRequest("Pick a sender and type a message.")

    if len(msg) > MAX_MESSAGE:
        return HttpResponseBadRequest(
            "Messages are limited to %d characters." % MAX_MESSAGE)

    context["action"] = action

    to = "bob" if user == "alice" else "alice"

    cipher_ = module.encrypt(msg, request.session[user]["sk"])
    cipher = module.encrypt(cipher_, request.session[to]["pk"])
    plain_ = module.decrypt(cipher, request.session[to]["sk"])
    plain = module.decrypt(plain_, request.session[user]["pk"])

    history = request.session["history"] + [{
        "plain": plain,
        "cipher": cipher,
        "user": user
    }]

    request.session["history"] = _fit_cookie(request.session, history[-HISTORY_LIMIT:])

    return render(request, "cryptography/asymmetric.html", context)


def _fit_cookie(session, history):
    """
    Drop the oldest messages until the signed session fits in a cookie.

    A count alone is not enough of a limit: how much room an entry takes
    depends on the message length and on how wide the keys are, so the encoded
    size is what gets measured.
    """
    while len(history) > 1:
        candidate = dict(session.items(), history=history)

        if len(session.encode(candidate)) <= COOKIE_BUDGET:
            break

        history = history[1:]

    return history


def _has_keys(request):
    """ Whether this session still carries a usable pair of keyrings. """
    return all(name in request.session for name in USERS + ("history",))


def _new_keys(request, module, alg):
    """ Give Alice and Bob a fresh keyring and an empty conversation. """
    for name in USERS:
        keys = getattr(module, alg.upper())()
        request.session[name] = {"pk": keys.public_key, "sk": keys.private_key}

    request.session["history"] = []


def symmetric(request):
    if request.method != "POST":
        return render(request, "cryptography/symmetric.html")

    msg = request.POST.get("msg")
    key = request.POST.get("key") or ""
    action = request.POST.get("action")
    alg = request.POST.get("alg")

    if alg not in CIPHERS or action not in ACTIONS or not msg:
        return HttpResponseBadRequest("Pick an algorithm and type a message.")

    if len(key) != KEY_LENGTH:
        return HttpResponseBadRequest(
            "The key must be exactly %d characters." % KEY_LENGTH)

    cipher = getattr(CIPHERS[alg], action)(msg, key)

    return render(request, "cryptography/symmetric.html", {
        "cipher": cipher,
        "key": key,
        "action": action,
        "alg": alg
    })


def hash(request):
    if request.method != "POST":
        return render(request, "cryptography/hash.html")

    msg = request.POST.get("msg")
    alg = request.POST.get("alg")

    if alg not in HASHES or not msg:
        return HttpResponseBadRequest("Pick an algorithm and type a message.")

    return render(request, "cryptography/hash.html", {
        "hash": HASHES[alg].hash_sum(msg),
        "alg": alg
    })
