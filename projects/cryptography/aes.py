from .api.BlockCipher import *
from .api.GaloisField import *


Nb = 4          # Number of columns comprising the State.
Nk = 4          # Number of 32-bit words comprising the Cipher Key.
Nr = Nk + 6     # Number of rounds


def parse_matrix(text: str) -> List[List[int]]:
    """ Reads a matrix written as rows of numbers separated by semicolons. """
    return [[int(n) for n in row.split()] for row in text.strip().split(";")]


S_BOX = parse_matrix("""
    99 124 119 123 242 107 111 197 48 1 103 43 254 215 171 118;
    202 130 201 125 250 89 71 240 173 212 162 175 156 164 114 192;
    183 253 147 38 54 63 247 204 52 165 229 241 113 216 49 21;
    4 199 35 195 24 150 5 154 7 18 128 226 235 39 178 117;
    9 131 44 26 27 110 90 160 82 59 214 179 41 227 47 132;
    83 209 0 237 32 252 177 91 106 203 190 57 74 76 88 207;
    208 239 170 251 67 77 51 133 69 249 2 127 80 60 159 168;
    81 163 64 143 146 157 56 245 188 182 218 33 16 255 243 210;
    205 12 19 236 95 151 68 23 196 167 126 61 100 93 25 115;
    96 129 79 220 34 42 144 136 70 238 184 20 222 94 11 219;
    224 50 58 10 73 6 36 92 194 211 172 98 145 149 228 121;
    231 200 55 109 141 213 78 169 108 86 244 234 101 122 174 8;
    186 120 37 46 28 166 180 198 232 221 116 31 75 189 139 138;
    112 62 181 102 72 3 246 14 97 53 87 185 134 193 29 158;
    225 248 152 17 105 217 142 148 155 30 135 233 206 85 40 223;
    140 161 137 13 191 230 66 104 65 153 45 15 176 84 187 22
""")

INV_S_BOX = parse_matrix("""
    82 9 106 213 48 54 165 56 191 64 163 158 129 243 215 251;
    124 227 57 130 155 47 255 135 52 142 67 68 196 222 233 203;
    84 123 148 50 166 194 35 61 238 76 149 11 66 250 195 78;
    8 46 161 102 40 217 36 178 118 91 162 73 109 139 209 37;
    114 248 246 100 134 104 152 22 212 164 92 204 93 101 182 146;
    108 112 72 80 253 237 185 218 94 21 70 87 167 141 157 132;
    144 216 171 0 140 188 211 10 247 228 88 5 184 179 69 6;
    208 44 30 143 202 63 15 2 193 175 189 3 1 19 138 107;
    58 145 17 65 79 103 220 234 151 242 207 206 240 180 230 115;
    150 172 116 34 231 173 53 133 226 249 55 232 28 117 223 110;
    71 241 26 113 29 41 197 137 111 183 98 14 170 24 190 27;
    252 86 62 75 198 210 121 32 154 219 192 254 120 205 90 244;
    31 221 168 51 136 7 199 49 177 18 16 89 39 128 236 95;
    96 81 127 169 25 181 74 13 45 229 122 159 147 201 156 239;
    160 224 59 77 174 42 245 176 200 235 187 60 131 83 153 97;
    23 43 4 126 186 119 214 38 225 105 20 99 85 33 12 125
""")

def Rcon(i):
    const = number_to_format(pow(2, i - 1) % 229, 8, "b")
    zero = number_to_format(0, 8, "b")
    number = int(const + zero * 3, 2)

    return number

def encrypt(msg: str, key: str = None):
    # Splits the message into 128-bit blocks, padding it if necessary.
    blocks = padding(msg)

    # Gets a key from the user.
    key = msg_to_bytes(key) if key else get_key()

    def show(x):
        """ Converts a list of bytes to an hexadecimal string. """
        return "".join([number_to_format(byte, 2, "x") for byte in x])

    cipher = []
    key = key_expansion(key)

    for block in blocks:
        state = add_round_key(block, key[:Nb])

        for i in range(1, Nr + 1):
            # Gets the selected part of the key for the round.
            key_block = key[i * Nb: (i + 1) * Nb]

            state = sub_bytes(state)
            state = shift_rows(state)

            if i != Nr:
                state = mix_columns(state)

            state = add_round_key(state, key_block)

        cipher.extend(state)

    return show(cipher)


def decrypt(msg: str, key: str = None):
    bytes = hex_to_bytes(msg)
    blocks = bytes_to_words(bytes, 16)

    # Gets a key from the user.
    key = msg_to_bytes(key) if key else get_key()

    msg = []
    key = key_expansion(key)

    for block in blocks:
        state = add_round_key(block, key[Nr*Nb:(Nr+1)*Nb])

        for i in range(Nr-1, -1, -1):
            # Gets the selected part of the key for the round.
            key_block = key[i * Nb: (i + 1) * Nb]

            state = inv_shift_rows(state)
            state = inv_sub_bytes(state)
            state = add_round_key(state, key_block)

            if i != 0:
                state = inv_mix_columns(state)

        msg.extend(state)

    msg = inv_pkcs7(msg)

    def text(x):
        return "".join([chr(byte) for byte in x])

    return text(msg)

# 11FB1FBD0EA90C5C4EF2194117A9483E

def padding(msg: str) -> List[List[int]]:
    """
    AES does not have a padding standard, it counts with exact block size
    and should crash when they aren't. Despite this, implementations usually take
    different paths to pad messages, making it easier to use.
    """
    return pkcs7(msg_to_bytes(msg), 16)  # 16 bytes = 128 bits


def get_key() -> List[int]:
    while True:
        key = input("Key: ")

        if len(key) == 16:
            break

        print("[-] Key must be 128 bits long. ")

    return msg_to_bytes(key)


def key_expansion(key: List[int]) -> List[int]:
    """
    The key is converted to round keys following Rijndael's key schedule.
    There must be a 128-bit round key block for each round plus one extra.
    """
    def rot_word(word_: int) -> int:
        """ Takes a word (32-bits) and performs a cyclic permutation. """
        return rotate(word_, 8, 32, "left")

    def sub_word(word_: int) -> str:
        """ Applies the S-Box transformation to each byte on a word (4-bytes). """
        word_ = word_to_list(number_to_format(word_, 32, "b"), 8)

        for i in range(len(word_)):
            h = number_to_format(word_[i], 2, 'x')
            d = [int(p, 16) for p in h]
            word_[i] = int(S_BOX[d[0]][d[1]])

        return list_to_word(word_, 8)

    w = []

    # Splits key into words.
    for i in range(Nk):
        word = list_to_word([key[4 * i + j] for j in range(4)])
        w.append(word)

    for i in range(Nk, Nb * (Nr + 1), 1):
        temp = w[i-1]

        if not i % Nk:
            temp = sub_word(rot_word(temp)) ^ Rcon(i // Nk)
        elif Nk > 6 and i % Nk == 4:    # (Nk = 8) includes this step
            temp = sub_word(temp)

        w.append(w[i-Nk] ^ temp)

    return w


def add_round_key(state: List[int], keys: List[int]) -> List[int]:
    """ Combines each byte of the round key with a state byte. """
    a = []

    for i in range(4):
        word = list_to_word(state[i*4:(i+1)*4])
        new_word = number_to_format(keys[i] ^ word, 32, "b")
        a += word_to_list(new_word, 8)

    return a


def sub_bytes(state: List[str]) -> List[str]:
    """
    High level:   Substitute bytes for their equivalent in a table to avoid linearity.
    Low level:    Finds the byte's inverse in Galois' Field and maps it to it's affine.
    """
    for i in range(len(state)):
        """
        Converts the byte to hex and maps it to the S-Box:
            x -- First digit
            y -- Second digit
        """
        h = number_to_format(state[i], 2, 'x')
        state[i] = int(S_BOX[int(h[0], 16)][int(h[1], 16)])

    return state


def inv_sub_bytes(state: List[str]) -> List[str]:
    for i in range(len(state)):
        h = number_to_format(state[i], 2, 'x')
        state[i] = int(INV_S_BOX[int(h[0], 16)][int(h[1], 16)])

    return state


def shift_rows(state: List[int]) -> List[int]:
    """ Creates a 4x4 matrix and shifts left each row by its y index. (0,1,2,3) => (1,2,3,0) """
    state = list_to_matrix(state)
    new_state = []

    for i in range(4):
        new_state += roll(state[i], 4 - i)

    return transpose_list(new_state)


def inv_shift_rows(state: List[int]) -> List[int]:
    """ Creates a 4x4 matrix and shifts right each row by its y index. (0,1,2,3) => (3,0,1,2) """
    state = list_to_matrix(state)
    new_state = []

    for i in range(4):
        new_state += roll(state[i], i)

    return transpose_list(new_state)


def mix_columns(state: List[int]) -> List[int]:
    """
    High level:   Combines the bytes of each column.
    Low level:    Multiplies b by a matrix, mixing all values between each other.

    Note: All multiplications and additions are performed within Galois' Field.
    """
    A = parse_matrix("""
        2 3 1 1;
        1 2 3 1;
        1 1 2 3;
        3 1 1 2
    """)

    B = list_to_matrix(state)
    state = matrix_mult(A, B)

    return state


def inv_mix_columns(state: List[int]) -> List[int]:
    A = parse_matrix("""
        14 11 13  9;
         9 14 11 13;
        13  9 14 11;
        11 13  9 14
    """)

    B = list_to_matrix(state)
    state = matrix_mult(A, B)

    return state


def transpose_list(list_: List[int]) -> List[int]:
    """ Applies matrix transposition to a list. """
    new_list = []

    for i in range(4):
        for j in range(4):
            new_list.append(list_[i+4*j])

    return new_list


def roll(row: List[int], offset: int) -> List[int]:
    """ Shifts a row to the right, wrapping the values that fall off the end. """
    offset %= len(row)

    return row[-offset:] + row[:-offset] if offset else list(row)
