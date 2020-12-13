const sha3_256 = require('js-sha3').sha3_256
const { hexToUint8Array } = require('./independence')

function getTransactionHash(signedTxPayload, generationHash) {
    const hashInputPayload =
        signedTxPayload.substr(8 * 2,64 * 2) +
        signedTxPayload.substr((8 + 64) * 2,32 * 2) +
        generationHash +
        signedTxPayload.substr((8 + 64 + 32 + 4) * 2)
    const signedTxHash =
        sha3_256.create().update(hexToUint8Array(hashInputPayload)).hex().toUpperCase()
    return signedTxHash
}

module.exports = {
    getTransactionHash
}
