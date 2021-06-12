function endian(hex) {
    const result = [];
    let len = hex.length - 2;
    while (len >= 0) {
        result.push(hex.substr(len, 2));
        len -= 2;
    }
    return result.join('');
}

function uint8ArrayToHex (arrayBuffer) {
    return [...new Uint8Array(arrayBuffer)]
        .map (b => b.toString(16).padStart(2, "0"))
        .join ("")
        .toUpperCase();
}

function hexToUint8Array(hex) {
    return new Uint8Array(hex.toLowerCase().match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))
}

function parseNodeVersion(num) {
    const hex = `00000000${Number(num).toString(16)}`.substr(-8)
    const strArray = []
    for (let i = 0; i < 8; i += 2) {
        const octet = Number(`0x${hex[i]}${hex[i + 1]}`).toString(10)
        strArray.push(octet)
    }

    return strArray.join('.')
}

module.exports = {
    endian,
    uint8ArrayToHex,
    hexToUint8Array,
    parseNodeVersion
}
