const { endian, parseNodeVersion, dec2hex8 } = require('./utils/independence')
const { getTransactionHash, publicKeyToHexAddress } = require('./utils/hash')
const Nem2 = require('./utils/nem2')
const MessageElm = require('./utils/messageElm')
const TxHistoryElm = require('./utils/txHistoryElm')
const BalanceTable = require('./utils/balanceTable')
const { getBase32DecodeAddress, getBase32EncodeAddress } = require('./utils/base32')

async function getAccountInfo(privateKey, endpoint, callback) {
    const n = new Nem2(privateKey)
    const pubkey = n.getPublicKey()
    const address = getBase32EncodeAddress(await publicKeyToHexAddress(pubkey))
    const { error, mosaics } = await fetch(`${endpoint}/accounts/${address}`)
        .then(res => {
            if (res.ok) return res.json()
            throw new Error(`${res.status} ${res.statusText}`)
        })
        .then(res => { return { mosaics: res.account.mosaics } })
        .catch((error) => {
            console.error(error)
            return { error }
        })
    callback(error, { mosaics, pubkey, address })
}
async function getEndpointInfo(endpoint, callback) {
    // eslint-disable-next-line no-unused-vars
    const nodePromise = fetch(`${endpoint}/node/info`)
        .then(res => res.json())
    const networkPromise = fetch(`${endpoint}/network/properties`)
        .then(res => res.json())
        .then(info => info.network)
    const chainPromise = fetch(`${endpoint}/chain/info`)
        .then(res => res.json())
    const { error, result } = await Promise
        .all([nodePromise, networkPromise, chainPromise])
        .then(([node, network, chain]) => {
            return { result: { node, network, chain } }
        })
        .catch((error) => {
            console.error(error)
            return { error }
        })
    callback(error, result)
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
    const deadline = n.createDeadline(serverTime + 2 * 3600 * 1000)
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
    console.log(signedTxPayload)

    callback(null, signedTxPayload, signedTxHash)
}

const acForm = document.getElementById('account-input')
const eiForm = document.getElementById('endpoint-info')
const aiForm = document.getElementById('account-info')
const txForm = document.getElementById('transaction')
txForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageElm = new MessageElm('tx-message')
    const isValid = txForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        messageElm.startLoading()
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        const recipient = txForm["recipient"].value.toUpperCase().replace(/-/g, '')
        const mosaicId = txForm["mosaicId"].value.toUpperCase()
        const amount = dec2hex8(txForm["amount"].value)
        const fee = dec2hex8(txForm["fee"].value)
        const isDryRun = txForm["txIsDryRn"].checked
        makeTransferTransaction(
            privateKey,
            endpoint,
            recipient,
            fee,
            mosaicId,
            amount,
            function(error, signedTxPayload, signedTxHash) {
                if (error) {
                    messageElm.setError(error)
                    return;
                }
                document.getElementById('tx-hash').innerText = signedTxHash
                document.getElementById('tx-payload').innerText = signedTxPayload
                if (isDryRun) {
                    messageElm.finishLoading()
                    document.getElementById("txOutput").innerText = ""
                    return
                }
                sendTransferTransaction(signedTxPayload, signedTxHash, endpoint,
                    function (error, status, hash) {
                        messageElm.finishLoading()
                        if (error) {
                            messageElm.setError(error)
                            return;
                        }
                        const elm = new TxHistoryElm('txHistory', endpoint)
                        elm.append(hash)
                        document.getElementById("txOutput").innerText = status;
                    }
                )
            }
        )
    } else {
        txForm.reportValidity()
        acForm.reportValidity()
    }
})
aiForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const messageElm = new MessageElm('ai-message')
    const isValid = aiForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        messageElm.startLoading()
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        getAccountInfo(privateKey, endpoint, function(error, result) {
            messageElm.finishLoading()
            const { mosaics, pubkey, address } = result
            document.getElementById('pubKey').value = pubkey
            document.getElementById('addr').value = address
            if (error) {
                messageElm.setError(error)
                return;
            }
            const elm = new BalanceTable('balanceOutput')
            mosaics.forEach(m => elm.append(m.id, m.amount))
            document.getElementById('balanceOutput').value = mosaics
        })
    } else {
        aiForm.reportValidity()
        acForm.reportValidity()
    }
})
eiForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const messageElm = new MessageElm('ei-message')
    const isValid = eiForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        messageElm.startLoading()
        const endpoint = acForm["endpoint"].value
        getEndpointInfo(endpoint, function(error, result) {
            messageElm.finishLoading()
            if (error) {
                messageElm.setError(error)
                return;
            }
            const { node, network, chain } = result
            document.getElementById('ei-node-version').innerText = parseNodeVersion(node.version)
            document.getElementById('ei-node-generation-hash').innerText = node.networkGenerationHashSeed
            document.getElementById('ei-chain-height').innerText = chain.height
            document.getElementById('ei-network-identifier').innerText = network.identifier
        })
    } else {
        eiForm.reportValidity()
        acForm.reportValidity()
    }
})
