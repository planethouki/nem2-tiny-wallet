const base32Decode = require('base32-decode');
const base32Encode = require('base32-encode');
const { uint8ArrayToHex, hexToUint8Array } = require('./independence');

function getBase32DecodeAddress(plainOrPrettyAddress) {
    const plainAddress = plainOrPrettyAddress.replace(/-/g, '')
    return uint8ArrayToHex(base32Decode(plainAddress, 'RFC4648'))
}

function getBase32EncodeAddress(hexAddress) {
    const a = hexAddress + "00"
    const b = base32Encode(hexToUint8Array(a), 'RFC4648')
    return b.substr(0, 39)
}

module.exports = {
    getBase32DecodeAddress,
    getBase32EncodeAddress
}
