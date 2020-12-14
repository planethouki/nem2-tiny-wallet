const { hexToUint8Array } = require('./independence')
const hash = require('hash-wasm')

/**
 *
 * @param {string} signedTxPayload
 * @param {string} generationHash
 * @return {string}
 */
async function getTransactionHash(signedTxPayload, generationHash) {
    const hashInputPayload =
        signedTxPayload.substr(8 * 2,64 * 2) +
        signedTxPayload.substr((8 + 64) * 2,32 * 2) +
        generationHash +
        signedTxPayload.substr((8 + 64 + 32 + 4) * 2);
    const hashed = await hash.sha3(hexToUint8Array(hashInputPayload), 256);
    return hashed.toUpperCase();
}

/**
 *
 * @param {string} publicKey
 * @param prefix
 * @return {Promise<string>}
 */
async function publicKeyToHexAddress(publicKey, prefix = "98") {
    const a = await hash.sha3(hexToUint8Array(publicKey), 256)
        .then((sha3ed) => {
            return hash.ripemd160(hexToUint8Array(sha3ed))
        });
    const b = prefix + a;
    const check = await hash.sha3(hexToUint8Array(b), 256);
    const c = b + check.substr(0, 6);
    return c.toUpperCase();
}

module.exports = {
    getTransactionHash,
    publicKeyToHexAddress
}
