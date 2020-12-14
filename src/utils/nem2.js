const { uint8ArrayToHex, hexToUint8Array } = require('./independence');
const tweetnacl = require('tweetnacl');

class Nem2 {
    constructor(hexPrivateKey) {
        const privateKey = hexToUint8Array(hexPrivateKey);
        const { publicKey } = tweetnacl.sign.keyPair.fromSeed(privateKey);
        this.keyPair = { privateKey, publicKey };
    }

    getPublicKey() {
        return uint8ArrayToHex(this.keyPair.publicKey).toUpperCase();
    }

    createDeadline(catapultTime) {
        return Number(catapultTime).toString(16).padStart(16, "0").toUpperCase()
    }

    sign(txPayload, generationHash) {
        const txPayloadSigningBytes =
            hexToUint8Array(generationHash + txPayload.substr((4 + 64 + 32 + 8) * 2));
        const secretKey = new Uint8Array(64);
        secretKey.set(this.keyPair.privateKey);
        secretKey.set(this.keyPair.publicKey, 32);
        const signature = tweetnacl.sign.detached(txPayloadSigningBytes, secretKey);
        return uint8ArrayToHex(signature);
    }
}

module.exports = Nem2;
