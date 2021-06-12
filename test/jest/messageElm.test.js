const MessageElm = require('../../src/utils/messageElm')

describe('MessageElm', () => {
    test('normal', () => {
        const elm = document.createElement('span')
        elm.id = 'elm'
        document.body.appendChild(elm)
        const msgElm = new MessageElm('elm')
        msgElm.startLoading()
        expect(elm.innerText).toBe('getting...')
    });
});
