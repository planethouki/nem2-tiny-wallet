const { Account, KeyPair } = require('symbol-sdk');
const { uint8ArrayToHex, hexToUint8Array } = require('./independence');
const base32Decode = require('base32-decode');

class Nem2 {
    constructor(privateKey, networkType) {
        this.account = Account.createFromPrivateKey(privateKey, networkType);
    }

    getPublicKey() {
        return this.account.publicKey
    }

    getPlainAddress() {
        return this.account.address.plain()
    }

    getBase32DecodeAddress(plainOrPrettyAddress) {
        const plainAddress = plainOrPrettyAddress.replace(/-/g, '')
        return uint8ArrayToHex(base32Decode(plainAddress, 'RFC4648'))
    }

    createDeadline(catapultTime) {
        return Number(catapultTime).toString(16).padStart(16, "0").toUpperCase()
    }

    sign(txPayload, generationHash) {
        const txPayloadSigningBytes = generationHash + txPayload.substr((4 + 64 + 32 + 8) * 2)
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(this.account.privateKey)
        return uint8ArrayToHex(KeyPair.sign(keyPair, hexToUint8Array(txPayloadSigningBytes)))
    }
}

module.exports = Nem2;
