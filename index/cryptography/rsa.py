from .api.BitwiseOperators import *
from .api.PrimeNumbers import *
from .api.BlockCipher import *

PRIME_BITS = 256    # n ends up twice this wide.


class RSA(object):
    def __init__(self):
        p, q = get_primes(2, bits=PRIME_BITS)

        # RSA's security is based on factorization.
        self.n = p * q

        # Totient of n
        self.phi = (p - 1) * (q - 1)

        e = self.generate_public_key()

        # ed = 1 => d = e⁻¹
        d = self.generate_private_key(e)

        self.public_key = (e, self.n)
        self.private_key = (d, self.n)

    def generate_public_key(self):
        while True:
            e = random.randint(1, self.phi)
            if gcd(e, self.phi) == 1:
                return e

    def generate_private_key(self, e: int) -> int:
        """
        Current implementation uses the Extended Euclidean Algorithm.
        This algorithm is an efficient method for computing
        the greatest common divisor of two numbers.
        """
        return xgcd(e, self.phi) % self.phi


def cipher_width(n: int) -> int:
    """ Bytes needed to hold any value below n. """
    return (n.bit_length() + 7) // 8


def block_size(n: int) -> int:
    """
    Plaintext bytes per block. One byte goes to the leading marker, and one more
    keeps the block below n.
    """
    return cipher_width(n) - 2


def to_bytes(value: int, width: int) -> List[int]:
    """ The value as a fixed number of bytes, most significant first. """
    return word_to_list(number_to_format(value, width * 8, "b"), 8)


def encrypt(msg: str, key: List[int]) -> str:
    """
    Encrypts the message one block at a time.

    A block has to stay below n, so a longer message must be split. Encrypting
    it whole silently wrapped the modulus and threw away everything above it.
    """
    n = key[1]
    width, size = cipher_width(n), block_size(n)
    data = [ord(char) for char in msg]

    cipher = ""

    for i in range(0, len(data), size):
        # The leading 1 keeps the block's length unambiguous, so a block that
        # starts with a zero byte still survives the round trip.
        block = list_to_word([1] + data[i:i + size])

        # x ** e (mod n)
        y = pow(block, key[0], n)

        # Fixed width, so decrypt can find the block boundaries again.
        cipher += "".join(chr(byte) for byte in to_bytes(y, width))

    return cipher


def decrypt(msg: str, key: List[int]) -> str:
    """
    Follows the same equation as in the encryption, block by block.
    """
    n = key[1]
    width = cipher_width(n)

    plain = ""

    for i in range(0, len(msg), width):
        block = list_to_word([ord(char) for char in msg[i:i + width]])

        # x ** d (mod n)
        x = pow(block, key[0], n)

        # The marker sits in the top byte, so the value is exactly as wide as
        # the original block was. Drop it and keep the rest.
        plain += "".join(chr(byte) for byte in to_bytes(x, cipher_width(x))[1:])

    return plain


def gcd(a: int, b: int) -> int:
    """
    Euclid's algorithm for determining the greatest common divisor.
    The iteration is used as it's faster for larger integers.
    """
    while b != 0:
        a, b = b, a % b

    return a


def xgcd(e: int, n: int) -> int:
    """
    The Extended Euclidean Algorithm, computes in addition, the coefficients
    of Bezout's identity, which are integers a and b such that:
        ax + by = gcd(a, b)
    """
    x0, x1, y0, y1 = 1, 0, 0, 1

    while n != 0:
        q, e, n = e // n, n, e % n
        x0, x1 = x1, x0 - q * x1
        y0, y1 = y1, y0 - q * y1

    return x0
