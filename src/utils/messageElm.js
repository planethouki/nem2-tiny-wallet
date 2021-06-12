class MessageElm {
    constructor(id) {
        this.elm = document.getElementById(id)
        this.elm.innerText = ''
    }

    startLoading() {
        this.elm.innerText = 'wait...'
    }

    finishLoading() {
        this.elm.innerText = ''
    }

    setString(str) {
        this.elm.innerText = str
    }

    setError(err) {
        this.elm.innerText = err.toString()
    }
}

module.exports = MessageElm;
