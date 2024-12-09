// rsa.js
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function modInverse(e, phi) {
    let m0 = phi;
    let y = 0, x = 1;

    while (e > 1) {
        let q = Math.floor(e / phi);
        let t = phi;

        phi = e % phi;
        e = t;
        t = y;

        y = x - q * y;
        x = t;
    }

    if (x < 0) {
        x += m0;
    }

    return x;
}

function generateKeys() {
    const p = 61; // Số nguyên tố cố định
    const q = 53; // Số nguyên tố cố định
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    let e = 3; // Giá trị e thường là một số nguyên tố nhỏ
    while (e < phi && gcd(e, phi) !== 1) {
        e += 2;
    }

    const d = modInverse(e, phi);

    return {
        publicKey: { e, n },
        privateKey: { d, n }
    };
}

function encrypt(plainText, publicKey) {
    const { e, n } = publicKey;
    return plainText.split('').map(char => {
        const m = char.charCodeAt(0);
        return Math.pow(m, e) % n;
    });
}

function decrypt(cipherText, privateKey) {
    const { d, n } = privateKey;
    return cipherText.map(c => {
        const m = Math.pow(c, d) % n;
        return String.fromCharCode(m);
    }).join('');
}

export { generateKeys, encrypt, decrypt };
