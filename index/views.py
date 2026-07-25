from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect

from . import catalog
from .cryptography import aes, rsa, sha1

HISTORY_LIMIT = 10


def home(request):
    return render(request, "index/home.html", {
        "groups": catalog.groups()
    })


def projects(request, direct, name):
    if name == "asymmetric":
        return asymmetric(request, "rsa")

    return render(request, "%s/%s.html" % (direct, name))


def asymmetric(request, alg="rsa"):
    context = {"alg": alg}

    if request.method != "POST":
        alice = getattr(globals()[alg], alg.upper())()
        bob = getattr(globals()[alg], alg.upper())()

        request.session["alice"] = {"pk": alice.public_key, "sk": alice.private_key}
        request.session["bob"] = {"pk": bob.public_key, "sk": bob.private_key}
        request.session["history"] = []

        return render(request, "cryptography/asymmetric.html", context)

    context["action"] = request.POST.get("action")

    msg = request.POST.get("msg")
    user = request.POST.get("user").lower()
    to = "bob" if user == "alice" else "alice"

    cipher_ = getattr(globals()[alg], "encrypt")(msg, request.session[user]["sk"])
    cipher = getattr(globals()[alg], "encrypt")(cipher_, request.session[to]["pk"])
    plain_ = getattr(globals()[alg], "decrypt")(cipher, request.session[to]["sk"])
    plain = getattr(globals()[alg], "decrypt")(plain_, request.session[user]["pk"])

    # The session lives in a signed cookie, so the history has to stay small
    # enough to fit within the 4KB a browser will keep.
    history = request.session["history"]
    request.session["history"] = (history + [{
        "plain": plain,
        "cipher": cipher,
        "user": user
    }])[-HISTORY_LIMIT:]

    return render(request, "cryptography/asymmetric.html", context)


def symmetric(request):
    if request.method != "POST":
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

    msg = request.POST.get("msg")
    key = request.POST.get("key")
    action = request.POST.get("action")
    alg = request.POST.get("alg")

    if alg not in ["aes"]:
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

    cipher = getattr(globals()[alg], action)(msg, key)


    return render(request, "cryptography/symmetric.html", {
        "cipher": cipher,
        "key": key,
        "action": action,
        "alg": alg
    })


def hash(request):
    if request.method != "POST":
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

    msg = request.POST.get("msg")
    alg = request.POST.get("alg")

    if alg not in ["sha1"]:
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

    hash = getattr(globals()[alg], "hash_sum")(msg)

    return render(request, "cryptography/hash.html", {
        "hash": hash,
        "alg": alg
    })
