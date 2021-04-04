const { endian } = require('./utils/independence')
const { getTransactionHash, publicKeyToHexAddress } = require('./utils/hash')
const Nem2 = require('./utils/nem2')
const { getBase32DecodeAddress, getBase32EncodeAddress } = require('./utils/base32')

async function getInfo(privateKey, endpoint, callback) {
    // eslint-disable-next-line no-unused-vars
    const network = await fetch(`${endpoint}/node/info`)
        .then(res => res.json())
        .then(nodeInfo => nodeInfo.networkIdentifier)
    const n = new Nem2(privateKey)
    const pubkey = n.getPublicKey()
    const address = getBase32EncodeAddress(await publicKeyToHexAddress(pubkey))
    const { error, mosaics } = await fetch(`${endpoint}/accounts/${address}`)
        .then(res => res.json())
        .then(res => res.account)
        .then((accountInfo) => {
            return {
                mosaics: JSON.stringify(accountInfo.mosaics).replace(/},{/g,"},\n{")
            }
        })
        .catch((error) => {
            console.error(error)
            return { error }
        })
    callback(error, mosaics, pubkey, address)
}
async function sendTransferTransaction(signedTxPayload, signedTxHash, endpoint, callback) {
    const request = new Request(
        `${endpoint}/transactions`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload: signedTxPayload }),
            mode: 'cors'
        }
    )
    fetch(request)
        .then(res => res.json())
        .then((res) => {
            callback(
                null,
                JSON.stringify(res),
                signedTxHash
            )
        })
        .catch((e) => {
            console.error(e)
            callback(e)
        })
}

async function makeTransferTransaction(privateKey, endpoint, recipientPlainAddress, fee, mosaicId, amount, callback) {
    // eslint-disable-next-line no-unused-vars
    const { network, generationHash } = await fetch(`${endpoint}/node/info`)
        .then(res => res.json())
        .then((nodeInfo) => {
            return {
                network: nodeInfo.networkIdentifier,
                generationHash: nodeInfo.networkGenerationHashSeed
            }
        })
    const n = new Nem2(privateKey)
    const pubkey = n.getPublicKey()
    const serverTime = await fetch(`${endpoint}/node/time`)
        .then(res => res.json())
        .then((nodeTime) => {
            return Number(nodeTime.communicationTimestamps.sendTimestamp)
        })
    console.log(serverTime)
    const deadline = n.createDeadline(serverTime + 2 * 3600 * 1000)
    console.log(deadline)
    const recipient = getBase32DecodeAddress(recipientPlainAddress)
    const txPayload =
        "B000000000000000" +
        "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
        pubkey +
        "0000000001985441" +
        endian(fee) +
        endian(deadline) +
        recipient +
        "0000010000000000" +
        endian(mosaicId) +
        endian(amount)
    const signature = n.sign(txPayload, generationHash)
    const signedTxPayload =
        txPayload.substr(0,8 * 2) +
        signature +
        txPayload.substr((8 + 64) * 2)

    const signedTxHash = await getTransactionHash(signedTxPayload, generationHash)

    callback(null, signedTxPayload, signedTxHash)
}

function showPayload() {
    const isValid = txForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        const recipient = txForm["recipient"].value.toUpperCase().replace(/-/g, '')
        const mosaicId = txForm["mosaicId"].value.toUpperCase()
        const amount = txForm["amount"].value.toUpperCase()
        const fee = txForm["fee"].value.toUpperCase()
        makeTransferTransaction(
            privateKey,
            endpoint,
            recipient,
            fee,
            mosaicId,
            amount,
            function(error, signedTxPayload, signedTxHash) {
                document.getElementById('txPayload').value = JSON.stringify({
                    hash: signedTxHash,
                    payload: signedTxPayload
                })
            }
        )
    }
}

const acForm = document.getElementById('account')
const foForm = document.getElementById('info')
const txForm = document.getElementById('transaction')
document.getElementById('txPreview').addEventListener('click', showPayload)
txForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const isValid = txForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        const recipient = txForm["recipient"].value.toUpperCase().replace(/-/g, '')
        const mosaicId = txForm["mosaicId"].value.toUpperCase()
        const amount = txForm["amount"].value.toUpperCase()
        const fee = txForm["fee"].value.toUpperCase()
        makeTransferTransaction(
            privateKey,
            endpoint,
            recipient,
            fee,
            mosaicId,
            amount,
            function(error, signedTxPayload, signedTxHash) {
                sendTransferTransaction(signedTxPayload, signedTxHash, endpoint,
                    function (error, status, hash) {
                        if (error) {
                            document.getElementById("txOutput").value = JSON.stringify(error);
                            return;
                        }
                        const a = document.createElement("a");
                        a.setAttribute("href", endpoint + "/transactionStatus/" + hash);
                        a.setAttribute("target", "_blank");
                        a.appendChild(document.createTextNode(hash.substr(0, 4) + "..."));
                        const li = document.createElement("li");
                        li.appendChild(a);
                        document.getElementById("txHistory").appendChild(li);
                        document.getElementById("txOutput").value = status;
                    }
                )
            }
        )
    }
})
foForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const isValid = foForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        getInfo(privateKey, endpoint, function(error, mosaics, pubkey, address) {
            if (error) {
                document.getElementById('balanceOutput').value = JSON.stringify(error);
                return;
            }
            document.getElementById('balanceOutput').value = mosaics
            document.getElementById('pubKey').value = pubkey
            document.getElementById('addr').value = address
        })
    }
})
