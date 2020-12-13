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

module.exports = {
    endian,
    uint8ArrayToHex,
    hexToUint8Array
}
