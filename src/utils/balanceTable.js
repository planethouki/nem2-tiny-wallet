class BalanceTable {
    constructor(id) {
        this.tableElm = document.getElementById(id)
        const oldTbodys = this.tableElm.getElementsByTagName('tbody')
        for (let i = 0; i < oldTbodys.length; i++) {
            oldTbodys[i].remove()
        }
        const tbody = document.createElement('tbody')
        this.tableElm.appendChild(tbody)
        this.tbodyElm = tbody
    }

    append(mosaicId, amount) {
        const mosaicTd = document.createElement('td')
        mosaicTd.innerText = mosaicId
        const amountTd = document.createElement('td')
        amountTd.innerText = amount
        const tr = document.createElement('tr')
        tr.appendChild(mosaicTd)
        tr.appendChild(amountTd)
        this.tbodyElm.appendChild(tr)
    }
}

module.exports = BalanceTable;
