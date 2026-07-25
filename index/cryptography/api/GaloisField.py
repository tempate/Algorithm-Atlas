from .BitwiseOperators import *


def inv_mix_columns(state: List[int]) -> List[int]:
    for i in range(0, 16, 4):
        a = [0] * 4
        b = [0] * 4
        # a is a copy of the input array
        # b is a multiplied by 2

        for j in range(4):
            a[j] = state[j]
            # Implicitly removes high bit because b[i] is an 8-bit char,
            # so we xor by 0x1b and not by 0x11b in the next line.
            b[j] = shift(state[j], 1, size=8, d="left")
            # Rijndael's Galois Field
            if int(state[j]) >= 128:
                b[j] ^= 0x1B  # Rijndael's indivisible polynomial.

        state[i+0] = b[0] ^ a[3] ^ a[2] ^ b[1] ^ a[1]   # 2 * a0 + a3 + a2 + 3 * a1
        state[i+1] = b[1] ^ a[0] ^ a[3] ^ b[2] ^ a[2]   # 2 * a1 + a0 + a3 + 3 * a2
        state[i+2] = b[2] ^ a[1] ^ a[0] ^ b[3] ^ a[3]   # 2 * a2 + a1 + a0 + 3 * a3
        state[i+3] = b[3] ^ a[2] ^ a[1] ^ b[0] ^ a[0]   # 2 * a3 + a2 + a1 + 3 * a4

    return state


def matrix_mult(A, B) -> List[int]:
    x = [[0] * len(B[0]) for _ in range(len(A))]

    for i in range(len(A)):
        for j in range(len(B[0])):
            for k in range(len(A[0])):
                x[i][j] ^= rijn_mult(B[k][j], A[i][k])

    return matrix_to_list(transpose(x))


def rijn_mult(x, y):
    return globals()["times%d" % y](x)


def times1(x):
    return x


def times2(x):
    # Implicitly removes high bit because b[i] is an 8-bit char,
    # so we xor by 0x1b and not by 0x11b in the next line.
    y = shift(x, 1, size=8, d="left")
    # Rijndael's Galois Field
    if int(x) >= 128:
        y ^= 0x1B  # Rijndael's indivisible polynomial.

    return y


def times3(x):
    return times2(x) ^ x


def times9(x):
    return times2(times2(times2(x))) ^ x


def times11(x):
    return times2(times2(times2(x)) ^ x) ^ x


def times13(x):
    return times2(times2(times2(x) ^ x)) ^ x


def times14(x):
    return times2(times2(times2(x) ^ x) ^ x)


def list_to_matrix(b: List[int]):
    """ Converts a list of size 16 to a transposed (4x4) matrix. """
    return transpose([b[i * 4:(i + 1) * 4] for i in range(4)])


def matrix_to_list(A):
    return [value for row in A for value in row]


def transpose(A):
    """ Swaps a matrix's rows and columns. """
    return [[row[i] for row in A] for i in range(len(A[0]))]
