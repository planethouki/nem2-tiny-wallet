const nem2lib = require('nem2-library')
const sha3_256 = require('js-sha3').sha3_256
const request = require('request')

function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

function getInfo(privateKey, endpoint, callback) {
    const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(privateKey)
    const pubkey = nem2lib.convert.uint8ToHex(keypair.publicKey)
    const address = nem2lib.address.addressToString(nem2lib.address.publicKeyToAddress(keypair.publicKey, 0x90))
    request({
        url: endpoint + "/account/" + nem2lib.convert.uint8ToHex(keypair.publicKey),
        method: 'GET',
        headers: {'Content-Type':'application/json'}
    }, (error, response, body) => {
        if (error) {
            callback(error, pubkey, address)
        } else {
            if (response.statusCode === 200) {
                const mosaics = JSON.parse(body).account.mosaics
                callback(JSON.stringify(mosaics).replace(/},{/g,"},\n{"), pubkey, address)
            } else {
                callback(body, pubkey, address)
            }
        }
    })
}

function transferTransaction(privateKey, endpoint, recipientPlainAddress, mosaicId, amount, callback) {
    const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(privateKey)
    const recipient = nem2lib.convert.uint8ToHex(nem2lib.address.stringToAddress(recipientPlainAddress))
    const txPayload = 
        "A5000000" +
        "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
        nem2lib.convert.uint8ToHex(keypair.publicKey) +
        "039054410000000000000000" +
        nem2lib.convert.uint8ToHex(new Uint8Array(new Uint32Array(nem2lib.deadline(2 * 60 * 60 * 1000)).buffer)) +
        recipient +
        "01000100" +
        endian(mosaicId) +
        endian(amount)
    const txPayloadSigningBytes = txPayload.substr(100*2)
    const signatureByte = nem2lib.KeyPair.sign(keypair, txPayloadSigningBytes)
    const signature = nem2lib.convert.uint8ToHex(signatureByte)
    
    const signedTxPayload =
        txPayload.substr(0,4*2) +
        signature +
        txPayload.substr((4+64)*2)
    
    const hashInputPayload = 
        signedTxPayload.substr(4*2,32*2) +
        signedTxPayload.substr((4+64)*2,32*2) +
        signedTxPayload.substr((4+64+32)*2)
    const signedTxHash = 
        sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase()
    
    request({
        url: endpoint + "/transaction",
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        json: {"payload": signedTxPayload}
    }, (error, response, body) => {
        if (error) {
            callback(error)
        } else {
            callback(
                JSON.stringify(body),
                signedTxHash
            )
        }
    })
}

const acForm = document.getElementById('account')
const foForm = document.getElementById('info')
const txForm = document.getElementById('transaction')
txForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const isValid = txForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        const recipient = txForm["recipient"].value.toUpperCase().replace(/-/g, '')
        const mosaicId = txForm["mosaicId"].value.toUpperCase()
        const amount = txForm["amount"].value.toUpperCase()
        transferTransaction(privateKey, endpoint, recipient, mosaicId, amount, function(status, hash) {
            const a = document.createElement('a')
            a.setAttribute('href', endpoint + "/transaction/" + hash + "/status")
            a.setAttribute('target', '_blank')
            a.appendChild(document.createTextNode(hash.substr(0,4) + "..."))
            const li = document.createElement('li')
            li.appendChild(a)
            document.getElementById('txHistory').appendChild(li)
            document.getElementById('txOutput').value = status
        })
    }
})
foForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const isValid = foForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        getInfo(privateKey, endpoint, function(mosaicsOrStatus, pubkey, address) {
            document.getElementById('balanceOutput').value = mosaicsOrStatus
            document.getElementById('pubKey').value = pubkey
            document.getElementById('addr').value = address
        })
    }
})