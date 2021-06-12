class TxHistoryElm {
    constructor(elementId, endpoint) {
        this.elm = document.getElementById(elementId)
        this.endpoint = endpoint
    }

    append(hash) {
        const a = document.createElement("a")
        a.setAttribute("href", this.endpoint + "/transactionStatus/" + hash)
        a.setAttribute("target", "_blank")
        a.setAttribute('style', 'word-break: break-all;')
        a.appendChild(document.createTextNode(hash))
        const li = document.createElement("li")
        li.appendChild(a);
        this.elm.appendChild(li)
    }
}

module.exports = TxHistoryElm;
